import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types/navigation';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useSubscription } from '../../src/context/SubscriptionContext';
import { FeatureComparisonCard } from '../../src/components/PremiumComponents';
import { getAuthErrorMessage } from '../../src/api';
import type { SubscriptionPlanResponse } from '../../src/api/types';

type Props = StackScreenProps<RootStackParamList, 'PremiumPlans'>;

export default function PremiumPlansScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const {
    plans,
    snapshot,
    loading,
    error,
    refresh,
    purchase,
  } = useSubscription();
  const premiumPlans = useMemo(
    () => plans.filter(
      (plan) =>
        (plan.billingInterval === 'MONTH' || plan.billingInterval === 'YEAR')
        && plan.active,
    ),
    [plans],
  );
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const selected = premiumPlans.find((plan) => plan.code === selectedCode) ?? premiumPlans[0];

  useEffect(() => {
    if (!selectedCode && premiumPlans[0]) setSelectedCode(premiumPlans[0].code);
  }, [premiumPlans, selectedCode]);

  const upgrade = async (plan: SubscriptionPlanResponse) => {
    if (!plan.purchasable || submitting) return;
    setSubmitting(true);
    try {
      await purchase(plan);
      Alert.alert('Premium activated', 'Your Premium benefits are now active.', [
        { text: 'Continue', onPress: () => navigation.replace('Subscription') },
      ]);
    } catch (purchaseError) {
      Alert.alert('Purchase not completed', getAuthErrorMessage(purchaseError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.card }]}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={colors.backArrow} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.title }]}>Premium</Text>
        <TouchableOpacity
          style={styles.manageButton}
          onPress={() => navigation.navigate('Subscription')}
        >
          <Text style={[styles.manageText, { color: colors.primary }]}>Manage</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={[styles.heroIcon, { backgroundColor: colors.premiumBadgeBg }]}>
            <Ionicons name="diamond" size={34} color={colors.premiumBadgeText} />
          </View>
          <Text style={[styles.heroTitle, { color: colors.title }]}>
            Get more from InternLink
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.subtitle }]}>
            Choose monthly or yearly Premium and complete checkout securely with Paystack.
          </Text>
        </View>

        {snapshot?.premiumActive ? (
          <View style={[styles.activeBanner, {
            backgroundColor: colors.premiumBannerBg,
            borderColor: colors.premiumBannerBorder,
          }]}>
            <Ionicons name="checkmark-circle" size={22} color={colors.premiumText} />
            <View style={styles.bannerCopy}>
              <Text style={[styles.bannerTitle, { color: colors.title }]}>Premium is active</Text>
              <Text style={[styles.bannerText, { color: colors.subtitle }]}>
                You currently have {snapshot.plan.displayName}.
              </Text>
            </View>
          </View>
        ) : null}

        {loading && premiumPlans.length === 0 ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : null}

        {error && premiumPlans.length === 0 ? (
          <View style={[styles.errorCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            <TouchableOpacity onPress={() => void refresh()}>
              <Text style={[styles.retryText, { color: colors.primary }]}>Try again</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.planList}>
          {premiumPlans.map((plan) => (
            <FeatureComparisonCard
              key={plan.code}
              plan={plan}
              selected={selected?.code === plan.code}
              onPress={() => setSelectedCode(plan.code)}
            />
          ))}
        </View>

        {premiumPlans.length === 0 && !loading && !error ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
            <Ionicons name="time-outline" size={28} color={colors.icon} />
            <Text style={[styles.emptyTitle, { color: colors.title }]}>Plans are being prepared</Text>
            <Text style={[styles.emptyText, { color: colors.subtitle }]}>
              No Premium plan is currently active for this account type.
            </Text>
          </View>
        ) : null}

        {selected ? (
          <>
            <TouchableOpacity
              style={[
                styles.upgradeButton,
                { backgroundColor: colors.primary },
                (!selected.purchasable || submitting) && styles.disabled,
              ]}
              disabled={!selected.purchasable || submitting}
              onPress={() => void upgrade(selected)}
            >
              {submitting ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <>
                  <Ionicons name="sparkles" size={18} color={colors.onPrimary} />
                  <Text style={[styles.upgradeText, { color: colors.onPrimary }]}>
                    {selected.purchasable
                      ? 'Continue with Paystack'
                      : 'Paystack setup required'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
            {!selected.purchasable ? (
              <Text style={[styles.setupNote, { color: colors.subtitle }]}>
                Add the Paystack test secret and callback URL to the backend before checkout.
              </Text>
            ) : null}
          </>
        ) : null}

        <Text style={[styles.legal, { color: colors.subtitle }]}>
          {selected?.paystackMode === 'TEST'
            ? 'Paystack test mode validates the complete payment flow without charging real money.'
            : 'Paystack processes payment details. InternLink stores only the verified transaction reference and subscription status.'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { minHeight: 58, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  manageButton: { minWidth: 54, minHeight: 40, alignItems: 'flex-end', justifyContent: 'center' },
  manageText: { fontSize: 13, fontWeight: '700' },
  content: { padding: 20, paddingBottom: 44 },
  hero: { alignItems: 'center', marginBottom: 22 },
  heroIcon: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  heroTitle: { fontSize: 24, lineHeight: 30, fontWeight: '900', textAlign: 'center' },
  heroSubtitle: { fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8, maxWidth: 360 },
  activeBanner: { borderWidth: 1, borderRadius: 18, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 16 },
  bannerCopy: { flex: 1 },
  bannerTitle: { fontSize: 14, fontWeight: '800' },
  bannerText: { fontSize: 12, marginTop: 2 },
  loader: { marginVertical: 32 },
  errorCard: { borderRadius: 18, padding: 18, alignItems: 'center', gap: 10 },
  errorText: { fontSize: 13, textAlign: 'center' },
  retryText: { fontSize: 13, fontWeight: '800' },
  planList: { gap: 14 },
  emptyCard: { borderRadius: 20, padding: 24, alignItems: 'center', gap: 8 },
  emptyTitle: { fontSize: 17, fontWeight: '800' },
  emptyText: { fontSize: 13, lineHeight: 19, textAlign: 'center' },
  upgradeButton: { minHeight: 52, borderRadius: 26, marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  upgradeText: { fontSize: 15, fontWeight: '800' },
  disabled: { opacity: 0.5 },
  setupNote: { fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 10 },
  legal: { fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 18 },
});
