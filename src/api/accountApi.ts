import { apiClient, publicApiClient } from './configuredClient';
import type {
  AccountPreferenceResponse,
  SocialProviderStatusResponse,
  UpdateAccountPreferenceRequest,
} from './types';

export const accountApi = {
  preferences() {
    return apiClient.request<AccountPreferenceResponse>('/api/account/preferences', { method: 'GET' });
  },
  updatePreferences(request: UpdateAccountPreferenceRequest) {
    return apiClient.request<AccountPreferenceResponse>('/api/account/preferences', {
      method: 'PUT',
      body: request,
    });
  },
  feedback(subject: string, message: string) {
    return apiClient.request('/api/account/feedback', { method: 'POST', body: { subject, message } });
  },
  problem(subject: string, message: string, deviceInfo?: string) {
    return apiClient.request('/api/account/problems', {
      method: 'POST',
      body: { subject, message, deviceInfo },
    });
  },
  socialProviders() {
    return publicApiClient.request<SocialProviderStatusResponse[]>('/api/auth/social/providers', {
      method: 'GET',
      requiresAuth: false,
    });
  },
  registerDeviceToken(token: string) {
    return apiClient.request<void>('/api/account/device-token', {
      method: 'PUT',
      body: { token },
    });
  },
  clearDeviceToken() {
    return apiClient.request<void>('/api/account/device-token', {
      method: 'DELETE',
    });
  },
  sendReferral(email: string) {
    return apiClient.request<void>('/api/account/referrals', {
      method: 'POST',
      body: { email },
    });
  },
};
