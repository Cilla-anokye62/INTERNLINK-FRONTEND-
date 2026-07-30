import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import {
  getAuthErrorMessage,
  universityApi,
  type CompanyEngagementResponse,
} from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { LockedFeatureOverlay } from '../../src/components/PremiumComponents';
import { useSubscription } from '../../src/context/SubscriptionContext';

export default function CompanyEngagementScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {
    hasFeature,
    loading: subscriptionLoading,
  } = useSubscription();
  const insightsEnabled = hasFeature('UNIVERSITY_EMPLOYER_INSIGHTS');
  const [companies, setCompanies] = useState<CompanyEngagementResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCompanies = useCallback(async () => {
    if (!insightsEnabled) {
      setLoading(false);
      return;
    }
    setError('');
    try {
      setCompanies((await universityApi.listCompanyInsights())
        .sort((a, b) => b.applicationCount - a.applicationCount));
    } catch (loadError) {
      setError(getAuthErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [insightsEnabled]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      void loadCompanies();
    }, [loadCompanies]),
  );

  const totalApplications = companies.reduce((sum, company) => sum + company.applicationCount, 0);
  const totalAccepted = companies.reduce((sum, company) => sum + company.acceptedCount, 0);

  if (subscriptionLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}><ActivityIndicator color={colors.accent} /></View>
      </SafeAreaView>
    );
  }

  if (!insightsEnabled) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={21} color={colors.title} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Company engagement</Text>
            <Text style={styles.subtitle}>Employer partnership insights</Text>
          </View>
        </View>
        <View style={styles.lockedWrap}>
          <LockedFeatureOverlay
            title="Employer insights are Premium"
            message="Upgrade to compare employer engagement, applications, and placement outcomes across partners."
            onUpgrade={() => navigation.navigate('PremiumPlans', { source: 'university-employers' })}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={21} color={colors.title} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>Company engagement</Text>
          <Text style={styles.subtitle}>{companies.length} active partner{companies.length === 1 ? '' : 's'}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalApplications}</Text>
          <Text style={styles.statLabel}>Applications</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalAccepted}</Text>
          <Text style={styles.statLabel}>Accepted</Text>
        </View>
      </View>

      <FlatList
        data={companies}
        keyExtractor={(company) => String(company.companyId)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => void loadCompanies()}
            colors={[colors.accent]}
            tintColor={colors.accent}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.companyRow}
            onPress={() => navigation.navigate('CompanyDetail', { company: item })}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.companyName.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{item.companyName}</Text>
              <Text style={styles.companyMeta}>
                {item.applicationCount} application{item.applicationCount === 1 ? '' : 's'} · {item.acceptedCount} accepted
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.subtitle} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {loading ? (
              <ActivityIndicator color={colors.accent} />
            ) : error ? (
              <>
                <Text style={styles.emptyTitle}>Could not load companies</Text>
                <Text style={styles.emptyText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => void loadCompanies()}>
                  <Text style={styles.retryText}>Try again</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Ionicons name="business-outline" size={44} color={colors.subtitle} />
                <Text style={styles.emptyTitle}>No company engagement yet</Text>
                <Text style={styles.emptyText}>Companies appear after engaging with your students’ applications.</Text>
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  lockedWrap: { flex: 1, justifyContent: 'center', padding: 24 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, marginBottom: 14 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  headerText: { flex: 1 },
  title: { color: colors.title, fontSize: 20, fontWeight: '700' },
  subtitle: { color: colors.subtitle, fontSize: 12, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 14 },
  statCard: { flex: 1, padding: 15, borderRadius: 15, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder },
  statValue: { color: colors.title, fontSize: 22, fontWeight: '800' },
  statLabel: { color: colors.subtitle, fontSize: 11, marginTop: 3 },
  listContent: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 30, gap: 10 },
  companyRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 15, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder },
  avatar: { width: 45, height: 45, borderRadius: 23, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  avatarText: { color: colors.onPrimary, fontSize: 17, fontWeight: '800' },
  companyInfo: { flex: 1 },
  companyName: { color: colors.title, fontSize: 14, fontWeight: '700' },
  companyMeta: { color: colors.subtitle, fontSize: 11, marginTop: 4 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 70, paddingHorizontal: 28, gap: 10 },
  emptyTitle: { color: colors.title, fontSize: 17, fontWeight: '700', textAlign: 'center' },
  emptyText: { color: colors.subtitle, fontSize: 13, lineHeight: 19, textAlign: 'center' },
  retryButton: { marginTop: 5, paddingHorizontal: 19, paddingVertical: 10, borderRadius: 20, backgroundColor: colors.accent },
  retryText: { color: colors.onPrimary, fontSize: 13, fontWeight: '700' },
});
