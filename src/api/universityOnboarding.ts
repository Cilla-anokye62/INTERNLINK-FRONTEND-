import { useAppStore } from '../store/useAppStore';
import { authApi } from './authApi';
import type { UniversityProfileResponse } from './types';
import { universityApi } from './universityApi';
import { resolveMediaUrl } from './mediaApi';

export const completeUniversityOnboarding = async (): Promise<UniversityProfileResponse> => {
  await authApi.completeOnboarding();

  const completedProfile = await universityApi.getMe();
  if (!completedProfile.onboardingComplete) {
    throw new Error('The server did not confirm that university setup was completed. Please try again.');
  }

  const state = useAppStore.getState();
  state.setUserName(completedProfile.name);
  state.updateProfile({
    email: completedProfile.contactEmail,
    phone: completedProfile.phoneNumber ?? '',
    photoUri: resolveMediaUrl(completedProfile.logoUrl) ?? state.profile.photoUri,
  });
  state.completeOnboarding();

  return completedProfile;
};
