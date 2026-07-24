import { useAppStore } from '../store/useAppStore';
import { authApi } from './authApi';
import { studentApi } from './studentApi';
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
    const universities = await studentApi.listUniversities();
    const exactMatch = universities.find(
      (university) => university.name.toLowerCase() === trimmedUniversityName.toLowerCase(),
    );
    const normalizedName = normalizeUniversityName(trimmedUniversityName);
    const normalizedMatch = exactMatch ?? universities.find(
      (university) => normalizeUniversityName(university.name) === normalizedName,
    );
    universityId = normalizedMatch?.id;
  }

  await studentApi.updateMe({
    ...profile,
    ...(universityId === undefined ? {} : { universityId }),
  });
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
    skills: completedProfile.skills,
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
