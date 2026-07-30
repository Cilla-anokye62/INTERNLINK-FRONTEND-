import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getAuthErrorMessage,
  universityApi,
  type CompanyEngagementResponse,
  type PlacementStatisticsResponse,
} from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';

export default function PlacementOverviewScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [statistics, setStatistics] = useState<PlacementStatisticsResponse | null>(null);
  const [companies, setCompanies] = useState<CompanyEngagementResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const [nextStatistics, nextCompanies] = await Promise.all([
        universityApi.getStatistics(),
        universityApi.listCompanies(),
      ]);
      setStatistics(nextStatistics);
      setCompanies(nextCompanies);
    } catch (loadError) {
      setError(getAuthErrorMessage(loadError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const placementRate = statistics && statistics.totalStudents > 0
    ? Math.round((statistics.placedCount / statistics.totalStudents) * 100)
    : 0;

  const cards = statistics ? [
    { label: 'Placement rate', value: `${placementRate}%` },
    { label: 'Total students', value: statistics.totalStudents },
    { label: 'Students placed', value: statistics.placedCount },
    { label: 'Applications', value: statistics.totalApplications },
  ] : [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.title} />
        </TouchableOpacity>
        <Text style={styles.title}>Placement Overview</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={(
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void load(true)}
              tintColor={colors.accent}
            />
          )}
        >
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.grid}>
            {cards.map((card) => (
              <View key={card.label} style={styles.statCard}>
                <Text style={styles.statLabel}>{card.label}</Text>
                <Text style={styles.statValue}>{card.value}</Text>
              </View>
            ))}
          </View>

          {statistics ? (
            <>
              <Text style={styles.sectionTitle}>Student progress</Text>
              {[
                { label: 'Placed', value: statistics.placedCount, color: '#10B981' },
                { label: 'Searching', value: statistics.searchingCount, color: colors.accent },
                { label: 'Not started', value: statistics.notStartedCount, color: colors.subtitle },
              ].map((item) => {
                const width = statistics.totalStudents > 0
                  ? `${Math.round((item.value / statistics.totalStudents) * 100)}%`
                  : '0%';
                return (
                  <View key={item.label} style={styles.progressItem}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>{item.label}</Text>
                      <Text style={styles.progressValue}>{item.value}</Text>
                    </View>
                    <View style={styles.track}>
                      <View style={[styles.fill, { width: width as any, backgroundColor: item.color }]} />
                    </View>
                  </View>
                );
              })}
            </>
          ) : null}

          <Text style={styles.sectionTitle}>Company engagement</Text>
          {companies.length === 0 ? (
            <Text style={styles.empty}>No company engagement data yet.</Text>
          ) : (
            companies.slice(0, 10).map((company) => (
              <View key={company.companyId} style={styles.companyRow}>
                <View style={styles.flex}>
                  <Text style={styles.companyName}>{company.companyName}</Text>
                  <Text style={styles.companyMeta}>
                    {company.applicationCount} applications
                  </Text>
                </View>
                <Text style={styles.accepted}>{company.acceptedCount} placed</Text>
              </View>
            ))
          )}

          <View style={styles.notice}>
            <Ionicons name="information-circle-outline" size={20} color={colors.accent} />
            <Text style={styles.noticeText}>
              Department, salary, and historical trend data are not currently exposed by the backend.
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 8 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    marginRight: 12,
  },
  title: { color: colors.title, fontSize: 22, fontWeight: '800' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20, paddingTop: 12, paddingBottom: 40 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  statCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: 16,
  },
  statLabel: { color: colors.subtitle, fontSize: 12 },
  statValue: { color: colors.title, fontSize: 25, fontWeight: '800', marginTop: 5 },
  sectionTitle: { color: colors.title, fontSize: 17, fontWeight: '800', marginTop: 25, marginBottom: 12 },
  progressItem: { backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 9 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 9 },
  progressLabel: { color: colors.text, fontWeight: '600' },
  progressValue: { color: colors.title, fontWeight: '800' },
  track: { height: 7, backgroundColor: colors.inputBorder, borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  flex: { flex: 1 },
  companyName: { color: colors.title, fontWeight: '700' },
  companyMeta: { color: colors.subtitle, fontSize: 12, marginTop: 3 },
  accepted: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  empty: { color: colors.subtitle, backgroundColor: colors.card, borderRadius: 12, padding: 18 },
  notice: {
    flexDirection: 'row',
    gap: 9,
    backgroundColor: colors.iconCircle,
    borderRadius: 12,
    padding: 14,
    marginTop: 18,
  },
  noticeText: { color: colors.text, fontSize: 12, lineHeight: 18, flex: 1 },
  error: { color: colors.danger, marginBottom: 12 },
});
