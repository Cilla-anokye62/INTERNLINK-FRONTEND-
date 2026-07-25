import { apiClient } from './configuredClient';
import type {
  StudentProfileResponse,
  UniversitySummary,
  UpdateStudentProfileRequest,
} from './types';

export const studentApi = {
  getMe() {
    return apiClient.request<StudentProfileResponse>('/api/students/me', {
      method: 'GET',
    });
  },

  updateMe(request: UpdateStudentProfileRequest) {
    return apiClient.request<StudentProfileResponse>('/api/students/me', {
      method: 'PUT',
      body: request,
    });
  },

  listUniversities() {
    return apiClient.request<UniversitySummary[]>('/api/universities', {
      method: 'GET',
    });
  },
};
