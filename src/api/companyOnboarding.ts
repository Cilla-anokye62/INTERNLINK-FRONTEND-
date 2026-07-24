import { useAppStore } from '../store/useAppStore';
import { authApi } from './authApi';
import { companyApi } from './companyApi';
import type { CompanyProfileResponse } from './types';

export const completeCompanyOnboarding = async (): Promise<CompanyProfileResponse> => {
  await authApi.completeOnboarding();

  const completedProfile = await companyApi.getMe();
  if (!completedProfile.onboardingComplete) {
    throw new Error('The server did not confirm that company setup was completed. Please try again.');
  }

  const state = useAppStore.getState();
  state.setUserName(completedProfile.companyName);
  state.updateProfile({
    email: completedProfile.email,
    phone: completedProfile.phoneNumber ?? '',
    about: completedProfile.description ?? '',
    bio: completedProfile.description ?? '',
  });
  state.completeOnboarding();

  return completedProfile;
};
