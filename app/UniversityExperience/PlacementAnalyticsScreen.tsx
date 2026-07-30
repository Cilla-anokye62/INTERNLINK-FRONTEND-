import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  getAuthErrorMessage,
  universityApi,
  type CompanyEngagementResponse,
  type PlacementStatisticsResponse,
} from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { TAB_BAR_BOTTOM_PADDING } from '../../src/constants/Colors';
import { LockedFeatureOverlay } from '../../src/components/PremiumComponents';
import { useSubscription } from '../../src/context/SubscriptionContext';

const EMPTY_STATS: PlacementStatisticsResponse = {
  totalStudents: 0,
  notStartedCount: 0,
  searchingCount: 0,
  placedCount: 0,
  totalApplications: 0,
};

export default function PlacementAnalyticsScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {
    hasFeature,
    loading: subscriptionLoading,
  } = useSubscription();
  const analyticsEnabled = hasFeature('UNIVERSITY_ADVANCED_ANALYTICS');
  const [statistics, setStatistics] = useState(EMPTY_STATS);
  const [companies, setCompanies] = useState<CompanyEngagementResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAnalytics = useCallback(async () => {
    if (!analyticsEnabled) {
      setLoading(false);
      return;
    }
    setError('');
    try {
      const [stats, companyResults] = await Promise.all([
        universityApi.getAdvancedStatistics(),
        universityApi.listCompanyInsights(),
      ]);
      setStatistics(stats);
      setCompanies(companyResults.sort((a, b) => b.acceptedCount - a.acceptedCount));
    } catch (loadError) {
      setError(getAuthErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [analyticsEnabled]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      void loadAnalytics();
    }, [loadAnalytics]),
  );

  const placementRate = statistics.totalStudents > 0
    ? Math.round((statistics.placedCount / statistics.totalStudents) * 100)
    : 0;
  const applicationRate = statistics.totalStudents > 0
    ? (statistics.totalApplications / statistics.totalStudents).toFixed(1)
    : '0.0';
  const maxAccepted = Math.max(1, ...companies.map((company) => company.acceptedCount));
  const distribution: { label: string; value: number; color: string }[] = [
    { label: 'Placed', value: statistics.placedCount, color: '#22C55E' },
    { label: 'Searching', value: statistics.searchingCount, color: colors.accent },
    { label: 'Not started', value: statistics.notStartedCount, color: colors.subtitle },
  ];

  if (subscriptionLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}><ActivityIndicator color={colors.accent} /></View>
      </SafeAreaView>
    );
  }

  if (!analyticsEnabled) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.lockedHeader}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Live placement data from student applications</Text>
        </View>
        <View style={styles.lockedWrap}>
          <LockedFeatureOverlay
            title="Advanced placement analytics are Premium"
            message="Upgrade for placement rates, application trends, distribution analysis, and top hiring partner insights."
            onUpgrade={() => navigation.navigate('PremiumPlans', { source: 'university-analytics' })}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => void loadAnalytics()}
            colors={[colors.accent]}
            tintColor={colors.accent}
          />
        }
      >
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Live placement data from student applications</Text>

        {error ? (
          <TouchableOpacity style={styles.errorCard} onPress={() => void loadAnalytics()}>
            <Text style={styles.errorText}>{error} Tap to retry.</Text>
          </TouchableOpacity>
        ) : null}

        {loading && statistics.totalStudents === 0 ? (
          <ActivityIndicator color={colors.accent} />
        ) : (
          <>
            <View style={styles.rateCard}>
              <Text style={styles.rateLabel}>Placement rate</Text>
              <Text style={styles.rateValue}>{placementRate}%</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${placementRate}%` }]} />
              </View>
            </View>

            <View style={styles.grid}>
              {[
                ['Students', statistics.totalStudents],
                ['Applications', statistics.totalApplications],
                ['Placed', statistics.placedCount],
                ['Apps/student', applicationRate],
              ].map(([label, value]) => (
                <View key={label} style={styles.metricCard}>
                  <Text style={styles.metricValue}>{value}</Text>
                  <Text style={styles.metricLabel}>{label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Placement distribution</Text>
              {distribution.map(({ label, value: count, color }) => {
                const width = statistics.totalStudents > 0
                  ? Math.round((count / statistics.totalStudents) * 100)
                  : 0;
                return (
                  <View key={label} style={styles.barRow}>
                    <View style={styles.barLabelRow}>
                      <Text style={styles.barLabel}>{label}</Text>
                      <Text style={styles.barCount}>{count}</Text>
                    </View>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { width: `${width}%`, backgroundColor: color }]} />
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Top hiring partners</Text>
              {companies.length === 0 ? (
                <Text style={styles.emptyText}>No company engagement data yet.</Text>
              ) : companies.slice(0, 5).map((company) => (
                <View key={company.companyId} style={styles.barRow}>
                  <View style={styles.barLabelRow}>
                    <Text style={styles.barLabel}>{company.companyName}</Text>
                    <Text style={styles.barCount}>{company.acceptedCount} accepted</Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View style={[
                      styles.barFill,
                      { width: `${Math.round((company.acceptedCount / maxAccepted) * 100)}%` },
                    ]} />
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  lockedHeader: { paddingHorizontal: 18, paddingTop: 16 },
  lockedWrap: { flex: 1, justifyContent: 'center', padding: 24 },
  content: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: TAB_BAR_BOTTOM_PADDING },
  title: { color: colors.title, fontSize: 22, fontWeight: '700' },
  subtitle: { color: colors.subtitle, fontSize: 13, marginTop: 3, marginBottom: 16 },
  errorCard: { padding: 12, borderRadius: 12, backgroundColor: colors.withdrawBg, marginBottom: 12 },
  errorText: { color: colors.withdrawText, fontSize: 12 },
  rateCard: { padding: 18, borderRadius: 17, backgroundColor: colors.gradientStart, marginBottom: 14 },
  rateLabel: { color: '#D7F0EE', fontSize: 13 },
  rateValue: { color: '#FFFFFF', fontSize: 34, fontWeight: '800', marginTop: 3 },
  progressTrack: { height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.22)', marginTop: 14 },
  progressFill: { height: 7, borderRadius: 4, backgroundColor: '#FFFFFF' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 4 },
  metricCard: { width: '48%', padding: 15, borderRadius: 15, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder, marginBottom: 10 },
  metricValue: { color: colors.title, fontSize: 22, fontWeight: '800' },
  metricLabel: { color: colors.subtitle, fontSize: 11, marginTop: 3 },
  section: { padding: 16, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder, marginTop: 10 },
  sectionTitle: { color: colors.title, fontSize: 15, fontWeight: '700', marginBottom: 11 },
  barRow: { marginBottom: 13 },
  barLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  barLabel: { color: colors.title, fontSize: 12, fontWeight: '600' },
  barCount: { color: colors.subtitle, fontSize: 11 },
  barTrack: { height: 7, borderRadius: 4, backgroundColor: colors.inputBorder },
  barFill: { height: 7, borderRadius: 4, backgroundColor: colors.accent },
  emptyText: { color: colors.subtitle, fontSize: 13, textAlign: 'center', paddingVertical: 16 },
});
