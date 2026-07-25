import { apiClient } from './configuredClient';
import type {
  CreateListingRequest,
  ListingResponse,
  UpdateListingRequest,
} from './types';

export const listingApi = {
  listOpen() {
    return apiClient.request<ListingResponse[]>('/api/listings', {
      method: 'GET',
    });
  },

  getOpen(listingId: number) {
    return apiClient.request<ListingResponse>(`/api/listings/${listingId}`, {
      method: 'GET',
    });
  },

  listOwn() {
    return apiClient.request<ListingResponse[]>('/api/companies/listings', {
      method: 'GET',
    });
  },

  create(request: CreateListingRequest) {
    return apiClient.request<ListingResponse>('/api/companies/listings', {
      method: 'POST',
      body: request,
    });
  },

  update(listingId: number, request: UpdateListingRequest) {
    return apiClient.request<ListingResponse>(`/api/companies/listings/${listingId}`, {
      method: 'PUT',
      body: request,
    });
  },

  close(listingId: number) {
    return apiClient.request<ListingResponse>(`/api/companies/listings/${listingId}/close`, {
      method: 'POST',
    });
  },
};
