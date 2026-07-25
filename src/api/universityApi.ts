import { apiClient } from './configuredClient';
import type {
  UniversityProfileResponse,
  UpdateUniversityProfileRequest,
} from './types';

export const universityApi = {
  getMe() {
    return apiClient.request<UniversityProfileResponse>('/api/universities/me', {
      method: 'GET',
    });
  },

  updateMe(request: UpdateUniversityProfileRequest) {
    return apiClient.request<UniversityProfileResponse>('/api/universities/me', {
      method: 'PUT',
      body: request,
    });
  },
};
