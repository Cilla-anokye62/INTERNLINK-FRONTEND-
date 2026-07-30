import { apiClient } from './configuredClient';
import type { BackendMessageResponse, ConversationResponse } from './types';

export const messagingApi = {
  list() {
    return apiClient.request<ConversationResponse[]>('/api/conversations', { method: 'GET' });
  },
  create(applicationId: number) {
    return apiClient.request<ConversationResponse>('/api/conversations', {
      method: 'POST',
      body: { applicationId },
    });
  },
  messages(conversationId: number) {
    return apiClient.request<BackendMessageResponse[]>(
      `/api/conversations/${conversationId}/messages`,
      { method: 'GET' },
    );
  },
  send(conversationId: number, body: string) {
    return apiClient.request<BackendMessageResponse>(
      `/api/conversations/${conversationId}/messages`,
      { method: 'POST', body: { body } },
    );
  },
  markRead(conversationId: number) {
    return apiClient.request<void>(`/api/conversations/${conversationId}/read`, { method: 'PUT' });
  },
};
