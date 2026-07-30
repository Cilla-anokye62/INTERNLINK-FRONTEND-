import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { SubscriptionStatusCard } from '../../src/components/PremiumComponents';
import { subscriptionApi } from '../../src/api';
import type {
  BillingTransactionResponse,
  SubscriptionRecordResponse,
} from '../../src/api/types';

type Props = StackScreenProps<RootStackParamList, 'Subscription'>;

const dateLabel = (value: string | null) =>
  value ? new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }) : 'Not available';

export default function SubscriptionScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const {
    snapshot,
    loading,
    error,
    refresh,
  } = useSubscription();
  const [history, setHistory] = useState<SubscriptionRecordResponse[]>([]);
  const [billing, setBilling] = useState<BillingTransactionResponse[]>([]);

  useEffect(() => {
    if (!snapshot) return;
    void Promise.all([subscriptionApi.history(), subscriptionApi.billingHistory()])
      .then(([records, transactions]) => {
        setHistory(records);
        setBilling(transactions);
      })
      .catch(() => {
        // Status remains usable if optional history cannot be loaded.
      });
  }, [snapshot]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.card }]}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={colors.backArrow} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.title }]}>Subscription</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading && !snapshot ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : null}

        {error && !snapshot ? (
          <View style={[styles.errorCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            <TouchableOpacity onPress={() => void refresh()}>
              <Text style={[styles.retryText, { color: colors.primary }]}>Try again</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <SubscriptionStatusCard
          snapshot={snapshot}
          onPress={!snapshot?.premiumActive ? () => navigation.navigate('PremiumPlans') : undefined}
        />

        {snapshot?.premiumActive ? (
          <>
            <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <DetailRow label="Status" value={snapshot.status.replaceAll('_', ' ')} colors={colors} />
              <DetailRow label="Provider" value={snapshot.provider ?? 'Not available'} colors={colors} />
              <DetailRow label="Current period started" value={dateLabel(snapshot.currentPeriodStart)} colors={colors} />
              <DetailRow label="Current period ends" value={dateLabel(snapshot.currentPeriodEnd)} colors={colors} last />
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('PremiumPlans')}
            >
              <Ionicons name="refresh" size={18} color={colors.onPrimary} />
              <Text style={[styles.primaryText, { color: colors.onPrimary }]}>
                Renew or change plan
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('PremiumPlans')}
          >
            <Ionicons name="sparkles" size={18} color={colors.onPrimary} />
            <Text style={[styles.primaryText, { color: colors.onPrimary }]}>Explore Premium plans</Text>
          </TouchableOpacity>
        )}

        {history.length > 0 ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.title }]}>Subscription history</Text>
            {history.map((record) => (
              <View key={record.id} style={[styles.historyRow, { backgroundColor: colors.card }]}>
                <View style={styles.historyCopy}>
                  <Text style={[styles.historyTitle, { color: colors.title }]}>{record.planName}</Text>
                  <Text style={[styles.historyDate, { color: colors.subtitle }]}>
                    {dateLabel(record.createdAt)} · {record.provider}
                  </Text>
                </View>
                <Text style={[styles.historyStatus, { color: colors.primary }]}>{record.status}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {billing.length > 0 ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.title }]}>Billing history</Text>
            {billing.map((transaction) => (
              <View key={transaction.id} style={[styles.historyRow, { backgroundColor: colors.card }]}>
                <View style={styles.historyCopy}>
                  <Text style={[styles.historyTitle, { color: colors.title }]}>
                    {transaction.amountMinor == null
                      ? 'Payment transaction'
                      : `${transaction.currency ?? ''} ${(transaction.amountMinor / 100).toFixed(2)}`}
                  </Text>
                  <Text style={[styles.historyDate, { color: colors.subtitle }]}>
                    {dateLabel(transaction.occurredAt)}
                  </Text>
                </View>
                <Text style={[styles.historyStatus, { color: colors.primary }]}>{transaction.status}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({
  label,
  value,
  colors,
  last = false,
}: {
  label: string;
  value: string;
  colors: Record<string, string>;
  last?: boolean;
}) {
  return (
    <View style={[styles.detailRow, !last && { borderBottomColor: colors.dividerLine, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <Text style={[styles.detailLabel, { color: colors.subtitle }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.title }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { minHeight: 58, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  headerSpacer: { width: 40 },
  content: { padding: 20, paddingBottom: 44, gap: 16 },
  loader: { marginVertical: 40 },
  errorCard: { borderRadius: 18, padding: 18, alignItems: 'center', gap: 10 },
  errorText: { fontSize: 13, textAlign: 'center' },
  retryText: { fontSize: 13, fontWeight: '800' },
  detailCard: { borderRadius: 18, borderWidth: 1, paddingHorizontal: 16 },
  detailRow: { minHeight: 55, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 20 },
  detailLabel: { fontSize: 13, flex: 1 },
  detailValue: { fontSize: 13, fontWeight: '700', textAlign: 'right', flex: 1 },
  primaryButton: { minHeight: 50, borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryText: { fontSize: 15, fontWeight: '800' },
  section: { gap: 10, marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '800' },
  historyRow: { borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  historyCopy: { flex: 1 },
  historyTitle: { fontSize: 14, fontWeight: '700' },
  historyDate: { fontSize: 12, marginTop: 3 },
  historyStatus: { fontSize: 11, fontWeight: '800' },
});
