import { useAppStore } from '../store/useAppStore';
import { authApi } from './authApi';
import { ApiError } from './client';
import { studentApi } from './studentApi';
import { resolveMediaUrl } from './mediaApi';
import type { StudentProfileResponse, UpdateStudentProfileRequest } from './types';

export interface CompleteStudentOnboardingRequest {
  universityName: string;
  profile: UpdateStudentProfileRequest;
}

export interface CompleteStudentOnboardingResult {
  profile: StudentProfileResponse;
  universityLinked: boolean;
}

const normalizeUniversityName = (value: string) => value
  .normalize('NFKD')
  .replace(/\([^)]*\)/g, ' ')
  .replace(/[^a-zA-Z0-9]+/g, ' ')
  .trim()
  .toLowerCase();

export const completeStudentOnboarding = async ({
  universityName,
  profile,
}: CompleteStudentOnboardingRequest): Promise<CompleteStudentOnboardingResult> => {
  const trimmedUniversityName = universityName.trim();
  let universityId: number | undefined;

  if (trimmedUniversityName) {
    try {
      const universities = await studentApi.listUniversities();
      const exactMatch = universities.find(
        (university) => university.name.toLowerCase() === trimmedUniversityName.toLowerCase(),
      );
      const normalizedName = normalizeUniversityName(trimmedUniversityName);
      const normalizedMatch = exactMatch ?? universities.find(
        (university) => normalizeUniversityName(university.name) === normalizedName,
      );
      universityId = normalizedMatch?.id;
    } catch {
      // A university link improves monitoring but is not required to finish a
      // student's profile. Legacy local university data may use an older
      // encryption key, so an unreadable summary must not block onboarding.
      universityId = undefined;
    }
  }

  const profileRequest: UpdateStudentProfileRequest = {
    ...profile,
    ...(universityId === undefined ? {} : { universityId }),
  };
  try {
    await studentApi.updateMe(profileRequest);
  } catch (error) {
    if (universityId === undefined || !(error instanceof ApiError) || error.status < 500) {
      throw error;
    }
    const { universityId: ignoredUniversityId, ...profileWithoutUniversity } = profileRequest;
    void ignoredUniversityId;
    await studentApi.updateMe(profileWithoutUniversity);
    universityId = undefined;
  }
  await authApi.completeOnboarding();

  const completedProfile = await studentApi.getMe();
  if (!completedProfile.onboardingComplete) {
    throw new Error('The server did not confirm that onboarding was completed. Please try again.');
  }

  const state = useAppStore.getState();
  state.setUserName(completedProfile.fullName);
  state.updateProfile({
    email: completedProfile.email ?? state.profile.email,
    phone: completedProfile.phoneNumber ?? state.profile.phone,
    bio: completedProfile.background ?? state.profile.bio,
    about: completedProfile.background ?? state.profile.about,
    skills: completedProfile.skills,
    photoUri: resolveMediaUrl(completedProfile.profileImageUrl) ?? state.profile.photoUri,
  });
  state.setAcademicInfo(
    completedProfile.universityName ?? state.university,
    completedProfile.program ?? state.programme,
    completedProfile.level ?? state.academicLevel,
    state.graduationYear,
  );
  state.setCareerInterests(completedProfile.careerInterests);
  state.setLocationPreferences(
    completedProfile.preferredLocation ?? state.preferredLocation,
    state.workSetup,
    completedProfile.willingToRelocate,
  );
  state.completeOnboarding();

  return {
    profile: completedProfile,
    universityLinked: universityId !== undefined,
  };
};
