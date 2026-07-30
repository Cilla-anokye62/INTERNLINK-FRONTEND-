import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { subscriptionApi } from '../api/subscriptionApi';
import type {
  EntitlementResponse,
  PremiumFeature,
  SubscriptionPlanResponse,
  SubscriptionSnapshotResponse,
} from '../api/types';
import { openPaystackCheckout } from '../services/paystackCheckout';
import { useAppStore } from '../store/useAppStore';

interface SubscriptionContextValue {
  snapshot: SubscriptionSnapshotResponse | null;
  plans: SubscriptionPlanResponse[];
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  hasFeature: (feature: PremiumFeature) => boolean;
  entitlement: (feature: PremiumFeature) => EntitlementResponse | null;
  purchase: (plan: SubscriptionPlanResponse) => Promise<SubscriptionSnapshotResponse>;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: React.PropsWithChildren) {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const userId = useAppStore((state) => state.userId);
  const userRole = useAppStore((state) => state.userRole);
  const [snapshot, setSnapshot] = useState<SubscriptionSnapshotResponse | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlanResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!isAuthenticated || !userId || !userRole) {
      setSnapshot(null);
      setPlans([]);
      setError('');
      return;
    }
    setLoading(true);
    try {
      const [nextSnapshot, nextPlans] = await Promise.all([
        subscriptionApi.getCurrent(),
        subscriptionApi.listPlans(),
      ]);
      setSnapshot(nextSnapshot);
      setPlans(nextPlans);
      setError('');
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : 'Unable to load subscription');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userId, userRole]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const hasFeature = useCallback(
    (feature: PremiumFeature) =>
      Boolean(snapshot?.entitlements.find(
        (value) => value.featureKey === feature,
      )?.enabled),
    [snapshot],
  );

  const entitlement = useCallback(
    (feature: PremiumFeature) =>
      snapshot?.entitlements.find((value) => value.featureKey === feature) ?? null,
    [snapshot],
  );

  const purchase = useCallback(async (plan: SubscriptionPlanResponse) => {
    if (!plan.purchasable) {
      throw new Error('Paystack checkout is not configured for this plan.');
    }
    const checkout = await subscriptionApi.initializePaystack(plan.code);
    const browserResult = await openPaystackCheckout(
      checkout.authorizationUrl,
      checkout.reference,
    );
    try {
      const next = await subscriptionApi.verifyPaystack(checkout.reference);
      setSnapshot(next);
      return next;
    } catch (verificationError) {
      if (!browserResult.completed) {
        throw new Error('Paystack checkout was closed before the payment was confirmed.');
      }
      throw verificationError;
    }
  }, []);

  const value = useMemo<SubscriptionContextValue>(() => ({
    snapshot,
    plans,
    loading,
    error,
    refresh,
    hasFeature,
    entitlement,
    purchase,
  }), [
    snapshot,
    plans,
    loading,
    error,
    refresh,
    hasFeature,
    entitlement,
    purchase,
  ]);

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => {
  const value = useContext(SubscriptionContext);
  if (!value) {
    throw new Error('useSubscription must be used inside SubscriptionProvider');
  }
  return value;
};
