import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
 Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
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

export default function ReportsScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {
    hasFeature,
    loading: subscriptionLoading,
  } = useSubscription();
  const reportsEnabled = hasFeature('UNIVERSITY_REPORT_EXPORT');
  const [statistics, setStatistics] = useState(EMPTY_STATS);
  const [companies, setCompanies] = useState<CompanyEngagementResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  const copyCsv = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const csv = await universityApi.placementReportCsv();
      if (!FileSystem.cacheDirectory) throw new Error('Temporary storage is unavailable on this device.');
      const fileUri = `${FileSystem.cacheDirectory}internlink-placement-report-${Date.now()}.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Report generated', 'The CSV was generated, but sharing is unavailable on this device.');
        return;
      }
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'InternLink placement report',
        UTI: 'public.comma-separated-values-text',
      });
    } catch (exportError) {
      Alert.alert('Could not export report', getAuthErrorMessage(exportError));
    } finally {
      setExporting(false);
    }
  };

  const loadReport = useCallback(async () => {
    if (!reportsEnabled) {
      setLoading(false);
      return;
    }
    setError('');
    try {
      const [stats, partners] = await Promise.all([
        universityApi.getAdvancedStatistics(),
        universityApi.listCompanyInsights(),
      ]);
      setStatistics(stats);
      setCompanies(partners.sort((a, b) => b.applicationCount - a.applicationCount));
    } catch (loadError) {
      setError(getAuthErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [reportsEnabled]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      void loadReport();
    }, [loadReport]),
  );

  if (subscriptionLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}><ActivityIndicator color={colors.accent} /></View>
      </SafeAreaView>
    );
  }

  if (!reportsEnabled) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.lockedHeader}>
          <Text style={styles.title}>Reports</Text>
          <Text style={styles.subtitle}>Current placement summary</Text>
        </View>
        <View style={styles.lockedWrap}>
          <LockedFeatureOverlay
            title="Placement reports are Premium"
            message="Upgrade to view advanced placement summaries, partner results, and exportable CSV reports."
            onUpgrade={() => navigation.navigate('PremiumPlans', { source: 'university-reports' })}
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
            onRefresh={() => void loadReport()}
            colors={[colors.accent]}
            tintColor={colors.accent}
          />
        }
      >
        <Text style={styles.title}>Reports</Text>
        <Text style={styles.subtitle}>Current placement summary</Text>

        {error ? (
          <TouchableOpacity style={styles.errorCard} onPress={() => void loadReport()}>
            <Text style={styles.errorText}>{error} Tap to retry.</Text>
          </TouchableOpacity>
        ) : null}

        {loading && statistics.totalStudents === 0 ? (
          <ActivityIndicator color={colors.accent} />
        ) : (
          <>
            <View style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={styles.iconCircle}>
                  <Ionicons name="document-text-outline" size={22} color={colors.accent} />
                </View>
                <View>
                  <Text style={styles.reportTitle}>Live placement summary</Text>
                  <Text style={styles.reportMeta}>Updated from current backend data</Text>
                </View>
              </View>
              {[
                ['Total students', statistics.totalStudents],
                ['Placed students', statistics.placedCount],
                ['Students searching', statistics.searchingCount],
                ['Not started', statistics.notStartedCount],
                ['Total applications', statistics.totalApplications],
              ].map(([label, value]) => (
                <View key={label} style={styles.row}>
                  <Text style={styles.rowLabel}>{label}</Text>
                  <Text style={styles.rowValue}>{value}</Text>
                </View>
              ))}
            </View>

            <View style={styles.reportCard}>
              <Text style={styles.sectionTitle}>Company engagement</Text>
              {companies.length === 0 ? (
                <Text style={styles.emptyText}>No engagement records yet.</Text>
              ) : companies.map((company) => (
                <View key={company.companyId} style={styles.row}>
                  <View style={styles.companyInfo}>
                    <Text style={styles.companyName}>{company.companyName}</Text>
                    <Text style={styles.companyMeta}>{company.acceptedCount} accepted</Text>
                  </View>
                  <Text style={styles.rowValue}>{company.applicationCount} apps</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.exportButton} onPress={() => void copyCsv()} disabled={exporting}>
              {exporting ? <ActivityIndicator size="small" color={colors.onPrimary} /> : (
                <Ionicons name="download-outline" size={18} color={colors.onPrimary} />
              )}
              <Text style={styles.exportText}>{exporting ? 'Preparing report...' : 'Copy placement CSV'}</Text>
            </TouchableOpacity>
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
  reportCard: { padding: 16, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder, marginBottom: 12 },
  reportHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconCircle: { width: 43, height: 43, borderRadius: 22, backgroundColor: colors.iconCircle, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  reportTitle: { color: colors.title, fontSize: 15, fontWeight: '700' },
  reportMeta: { color: colors.subtitle, fontSize: 11, marginTop: 2 },
  sectionTitle: { color: colors.title, fontSize: 15, fontWeight: '700', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.inputBorder },
  rowLabel: { color: colors.subtitle, fontSize: 13 },
  rowValue: { color: colors.title, fontSize: 13, fontWeight: '700' },
  companyInfo: { flex: 1 },
  companyName: { color: colors.title, fontSize: 13, fontWeight: '600' },
  companyMeta: { color: colors.subtitle, fontSize: 10, marginTop: 2 },
  emptyText: { color: colors.subtitle, fontSize: 13, textAlign: 'center', paddingVertical: 15 },
  notice: { flexDirection: 'row', gap: 9, padding: 13, borderRadius: 12, backgroundColor: colors.iconCircle },
  noticeText: { flex: 1, color: colors.subtitle, fontSize: 12, lineHeight: 18 },
  exportButton: { minHeight: 47, borderRadius: 24, backgroundColor: colors.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  exportText: { color: colors.onPrimary, fontSize: 13, fontWeight: '700' },
});
