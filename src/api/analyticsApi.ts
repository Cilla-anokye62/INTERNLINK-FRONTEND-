import { apiClient } from './configuredClient';
import type { CompanyAnalyticsResponse } from './types';

export const analyticsApi = {
  company() {
    return apiClient.request<CompanyAnalyticsResponse>('/api/companies/analytics', { method: 'GET' });
  },
  companyReportCsv() {
    return apiClient.request<string>('/api/companies/reports/applicants.csv', {
      method: 'GET',
      headers: { Accept: 'text/csv' },
    });
  },
};
