import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import {
  applicationApi,
  getAuthErrorMessage,
  type BackendApplicationResponse,
  type BackendApplicationStatus,
} from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { TAB_BAR_BOTTOM_PADDING } from '../../src/constants/Colors';
import { ApplicationLimitIndicator } from '../../src/components/PremiumComponents';
import { useSubscription } from '../../src/context/SubscriptionContext';

type Filter = BackendApplicationStatus | 'ALL';

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Applied', value: 'APPLIED' },
  { label: 'Review', value: 'UNDER_REVIEW' },
  { label: 'Accepted', value: 'ACCEPTED' },
  { label: 'Rejected', value: 'REJECTED' },
];

const STATUS_LABELS: Record<BackendApplicationStatus, string> = {
  APPLIED: 'Applied',
  UNDER_REVIEW: 'Under review',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
};

export default function MyApplicationsScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { entitlement, hasFeature, refresh: refreshSubscription } = useSubscription();
  const applicationEntitlement = entitlement('STUDENT_APPLICATIONS');
  const canTrack = hasFeature('STUDENT_APPLICATION_TRACKING');
  const [applications, setApplications] = useState<BackendApplicationResponse[]>([]);
  const [activeFilter, setActiveFilter] = useState<Filter>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadApplications = useCallback(async () => {
    setError('');
    try {
      const [nextApplications] = await Promise.all([
        applicationApi.listOwn(),
        refreshSubscription(),
      ]);
      setApplications(nextApplications);
    } catch (loadError) {
      setError(getAuthErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [refreshSubscription]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      void loadApplications();
    }, [loadApplications]),
  );

  const filtered = useMemo(
    () => applications
      .filter((application) => activeFilter === 'ALL' || application.status === activeFilter)
      .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()),
    [activeFilter, applications],
  );

  const activeCount = applications.filter(
    (application) => application.status === 'APPLIED' || application.status === 'UNDER_REVIEW',
  ).length;
  const acceptedCount = applications.filter((application) => application.status === 'ACCEPTED').length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Applications</Text>
        <Text style={styles.headerSub}>
          {canTrack
            ? `${activeCount} active · ${acceptedCount} accepted`
            : `${applications.length} submitted application${applications.length === 1 ? '' : 's'}`}
        </Text>
      </View>

      <View style={styles.limitWrap}>
        <ApplicationLimitIndicator
          entitlement={applicationEntitlement}
          onUpgrade={() => navigation.navigate('PremiumPlans', { source: 'applications' })}
        />
      </View>

      {canTrack ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersRow}
        >
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              style={[styles.filterChip, activeFilter === filter.value && styles.filterChipActive]}
              onPress={() => setActiveFilter(filter.value)}
            >
              <Text style={[styles.filterText, activeFilter === filter.value && styles.filterTextActive]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : null}

      <FlatList
        data={filtered}
        keyExtractor={(application) => String(application.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => void loadApplications()}
            colors={[colors.accent]}
            tintColor={colors.accent}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('ApplicationDetails', { application: item })}
          >
            <View style={styles.cardTop}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.companyName.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.listingTitle}</Text>
                <Text style={styles.companyName}>{item.companyName}</Text>
              </View>
              <View style={[
                styles.statusPill,
                item.status === 'ACCEPTED' && styles.acceptedPill,
                item.status === 'REJECTED' && styles.rejectedPill,
              ]}>
                <Text style={[
                  styles.statusText,
                  item.status === 'ACCEPTED' && styles.acceptedText,
                  item.status === 'REJECTED' && styles.rejectedText,
                ]}>
                  {item.trackingLocked ? 'Premium tracking' : STATUS_LABELS[item.status]}
                </Text>
              </View>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.dateText}>
                Applied {new Date(item.appliedAt).toLocaleDateString()}
              </Text>
              <Ionicons name="chevron-forward" size={17} color={colors.subtitle} />
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {loading ? (
              <ActivityIndicator color={colors.accent} />
            ) : error ? (
              <>
                <Ionicons name="cloud-offline-outline" size={44} color={colors.subtitle} />
                <Text style={styles.emptyTitle}>Could not load applications</Text>
                <Text style={styles.emptyDesc}>{error}</Text>
                <TouchableOpacity style={styles.primaryButton} onPress={() => void loadApplications()}>
                  <Text style={styles.primaryButtonText}>Try again</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Ionicons name="document-text-outline" size={44} color={colors.subtitle} />
                <Text style={styles.emptyTitle}>No applications yet</Text>
                <Text style={styles.emptyDesc}>Apply from Discover and your progress will appear here.</Text>
                <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Discover')}>
                  <Text style={styles.primaryButtonText}>Browse internships</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 24, paddingTop: 16, marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.title },
  headerSub: { fontSize: 13, color: colors.subtitle, marginTop: 3 },
  limitWrap: { paddingHorizontal: 24, marginBottom: 14 },
  filtersScroll: { flexGrow: 0, marginBottom: 14 },
  filtersRow: { paddingHorizontal: 24, gap: 8 },
  filterChip: {
    paddingHorizontal: 17,
    paddingVertical: 9,
    borderRadius: 24,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  filterChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  filterText: { color: colors.subtitle, fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: colors.onPrimary },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: TAB_BAR_BOTTOM_PADDING,
    gap: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: 15,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    marginRight: 11,
  },
  avatarText: { color: colors.onPrimary, fontWeight: '700', fontSize: 16 },
  cardInfo: { flex: 1, marginRight: 8 },
  cardTitle: { color: colors.title, fontSize: 14, fontWeight: '700' },
  companyName: { color: colors.subtitle, fontSize: 12, marginTop: 2 },
  statusPill: { backgroundColor: colors.iconCircle, borderRadius: 16, paddingHorizontal: 9, paddingVertical: 5 },
  statusText: { color: colors.accent, fontSize: 10, fontWeight: '700' },
  acceptedPill: { backgroundColor: '#DCFCE7' },
  acceptedText: { color: '#166534' },
  rejectedPill: { backgroundColor: colors.withdrawBg },
  rejectedText: { color: colors.withdrawText },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 13,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
  },
  dateText: { color: colors.subtitle, fontSize: 11 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, paddingTop: 70, gap: 10 },
  emptyTitle: { color: colors.title, fontSize: 18, fontWeight: '700', textAlign: 'center' },
  emptyDesc: { color: colors.subtitle, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  primaryButton: { marginTop: 6, backgroundColor: colors.accent, borderRadius: 24, paddingHorizontal: 22, paddingVertical: 12 },
  primaryButtonText: { color: colors.onPrimary, fontSize: 14, fontWeight: '700' },
});
