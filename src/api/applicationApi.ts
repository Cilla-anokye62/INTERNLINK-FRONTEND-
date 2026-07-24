import { apiClient } from './configuredClient';
import type {
  BackendApplicantResponse,
  BackendApplicationResponse,
  BackendApplicationStatus,
} from './types';

export const applicationApi = {
  apply(listingId: number) {
    return apiClient.request<BackendApplicationResponse>('/api/students/applications', {
      method: 'POST',
      body: { listingId },
    });
  },

  listOwn() {
    return apiClient.request<BackendApplicationResponse[]>('/api/students/applications', {
      method: 'GET',
    });
  },

  listApplicants(listingId: number, status?: BackendApplicationStatus) {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return apiClient.request<BackendApplicantResponse[]>(
      `/api/companies/listings/${listingId}/applications${query}`,
      { method: 'GET' },
    );
  },

  updateStatus(applicationId: number, status: 'ACCEPTED' | 'REJECTED') {
    return apiClient.request<BackendApplicantResponse>(
      `/api/companies/applications/${applicationId}/status`,
      {
        method: 'PATCH',
        body: { status },
      },
    );
  },
};
