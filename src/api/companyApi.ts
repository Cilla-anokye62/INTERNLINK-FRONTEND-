import { apiClient } from './configuredClient';
import type {
  CompanyDataExportResponse,
  CompanyProfileResponse,
  UpdateCompanyProfileRequest,
} from './types';

export const companyApi = {
  getMe() {
    return apiClient.request<CompanyProfileResponse>('/api/companies/me', {
      method: 'GET',
    });
  },

  updateMe(request: UpdateCompanyProfileRequest) {
    return apiClient.request<CompanyProfileResponse>('/api/companies/me', {
      method: 'PUT',
      body: request,
    });
  },

  exportData() {
    return apiClient.request<CompanyDataExportResponse>('/api/companies/me/export', {
      method: 'GET',
    });
  },

  deleteMe() {
    return apiClient.request<void>('/api/companies/me', {
      method: 'DELETE',
    });
  },
};
