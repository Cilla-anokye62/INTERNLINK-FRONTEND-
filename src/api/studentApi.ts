import { apiClient } from './configuredClient';
import type {
  RecommendationResponse,
  StudentDataExportResponse,
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

  recommendations() {
    return apiClient.request<RecommendationResponse[]>('/api/students/recommendations', {
      method: 'GET',
    });
  },

  registerDeviceToken(fcmToken: string) {
    return apiClient.request<StudentProfileResponse>('/api/students/me/device-token', {
      method: 'PUT',
      body: { fcmToken },
    });
  },

  exportData() {
    return apiClient.request<StudentDataExportResponse>('/api/students/me/export', {
      method: 'GET',
    });
  },

  deleteMe() {
    return apiClient.request<void>('/api/students/me', {
      method: 'DELETE',
    });
  },
};
