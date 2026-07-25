import { apiClient } from './configuredClient';
import type { CompanyProfileResponse, UpdateCompanyProfileRequest } from './types';

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
};
