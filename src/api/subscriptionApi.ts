import { apiClient } from './configuredClient';
import type {
  BillingTransactionResponse,
  PaystackCheckoutResponse,
  SubscriptionPlanResponse,
  SubscriptionRecordResponse,
  SubscriptionSnapshotResponse,
} from './types';

export const subscriptionApi = {
  listPlans() {
    return apiClient.request<SubscriptionPlanResponse[]>('/api/subscription-plans', {
      method: 'GET',
    });
  },

  getCurrent() {
    return apiClient.request<SubscriptionSnapshotResponse>('/api/subscriptions/me', {
      method: 'GET',
    });
  },

  history() {
    return apiClient.request<SubscriptionRecordResponse[]>('/api/subscriptions/me/history', {
      method: 'GET',
    });
  },

  billingHistory() {
    return apiClient.request<BillingTransactionResponse[]>(
      '/api/subscriptions/me/billing-history',
      { method: 'GET' },
    );
  },

  initializePaystack(planCode: string) {
    return apiClient.request<PaystackCheckoutResponse>('/api/billing/paystack/initialize', {
      method: 'POST',
      body: { planCode },
    });
  },

  verifyPaystack(reference: string) {
    return apiClient.request<SubscriptionSnapshotResponse>('/api/billing/paystack/verify', {
      method: 'POST',
      body: { reference },
    });
  },
};
