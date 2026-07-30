import { apiClient } from './configuredClient';
import type {
  CompanyEngagementResponse,
  PlacementStatisticsResponse,
  StudentPlacementResponse,
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

  listStudents() {
    return apiClient.request<StudentPlacementResponse[]>('/api/universities/students', {
      method: 'GET',
    });
  },

  getStatistics() {
    return apiClient.request<PlacementStatisticsResponse>('/api/universities/statistics', {
      method: 'GET',
    });
  },

  getAdvancedStatistics() {
    return apiClient.request<PlacementStatisticsResponse>('/api/universities/analytics', {
      method: 'GET',
    });
  },

  listCompanies() {
    return apiClient.request<CompanyEngagementResponse[]>('/api/universities/companies', {
      method: 'GET',
    });
  },

  listCompanyInsights() {
    return apiClient.request<CompanyEngagementResponse[]>('/api/universities/companies/insights', {
      method: 'GET',
    });
  },

  placementReportCsv() {
    return apiClient.request<string>('/api/universities/reports/placements.csv', {
      method: 'GET',
      headers: { Accept: 'text/csv' },
    });
  },

  exportData() {
    return apiClient.request<UniversityProfileResponse>('/api/universities/me/export', {
      method: 'GET',
    });
  },

  deleteMe() {
    return apiClient.request<void>('/api/universities/me', {
      method: 'DELETE',
    });
  },
};
