import { apiClient } from './configuredClient';
import type { OfferResponse } from './types';

export interface CreateOfferRequest {
  applicationId: number;
  title: string;
  message?: string;
  startDate?: string;
  endDate?: string;
  compensation?: string;
  expiresAt?: string;
}

export const offerApi = {
  createDraft(request: CreateOfferRequest) {
    return apiClient.request<OfferResponse>('/api/companies/offers', { method: 'POST', body: request });
  },
  listCompany() {
    return apiClient.request<OfferResponse[]>('/api/companies/offers', { method: 'GET' });
  },
  send(id: number) {
    return apiClient.request<OfferResponse>(`/api/companies/offers/${id}/send`, { method: 'POST' });
  },
  withdraw(id: number) {
    return apiClient.request<OfferResponse>(`/api/companies/offers/${id}/withdraw`, { method: 'POST' });
  },
  listStudent() {
    return apiClient.request<OfferResponse[]>('/api/students/offers', { method: 'GET' });
  },
  accept(id: number) {
    return apiClient.request<OfferResponse>(`/api/students/offers/${id}/accept`, { method: 'POST' });
  },
  decline(id: number) {
    return apiClient.request<OfferResponse>(`/api/students/offers/${id}/decline`, { method: 'POST' });
  },
};
