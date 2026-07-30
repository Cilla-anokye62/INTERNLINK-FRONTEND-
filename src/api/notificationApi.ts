import { apiClient } from './configuredClient';
import type { BackendNotificationResponse } from './types';

export const notificationApi = {
  list(role: 'student' | 'employer' | 'university' = 'student') {
    const path = role === 'student'
      ? '/api/students/notifications'
      : role === 'employer'
        ? '/api/companies/notifications'
        : '/api/universities/notifications';
    return apiClient.request<BackendNotificationResponse[]>(path, {
      method: 'GET',
    });
  },
  markRead(id: number) {
    return apiClient.request<BackendNotificationResponse>(`/api/notifications/${id}/read`, {
      method: 'PUT',
    });
  },
  markAllRead() {
    return apiClient.request<void>('/api/notifications/read-all', { method: 'PUT' });
  },
};
