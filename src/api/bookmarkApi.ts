import { ApiError } from './client';
import { apiClient } from './configuredClient';
import type { BookmarkResponse } from './types';

export const bookmarkApi = {
  list() {
    return apiClient.request<BookmarkResponse[]>('/api/students/bookmarks', {
      method: 'GET',
    });
  },

  save(listingId: number) {
    return apiClient.request<BookmarkResponse>('/api/students/bookmarks', {
      method: 'POST',
      body: { listingId },
    });
  },

  remove(listingId: number) {
    return apiClient.request<void>(`/api/students/bookmarks/${listingId}`, {
      method: 'DELETE',
    });
  },

  async setSaved(listingId: number, saved: boolean) {
    try {
      if (saved) {
        await this.save(listingId);
      } else {
        await this.remove(listingId);
      }
    } catch (error) {
      const alreadyInRequestedState = error instanceof ApiError
        && ((saved && error.status === 409) || (!saved && error.status === 404));
      if (!alreadyInRequestedState) throw error;
    }
  },
};
