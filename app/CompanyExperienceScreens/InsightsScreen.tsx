import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { analyticsApi, getAuthErrorMessage, type CompanyAnalyticsResponse } from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { LockedFeatureOverlay } from '../../src/components/PremiumComponents';
import { useSubscription } from '../../src/context/SubscriptionContext';

export default function InsightsScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {
    hasFeature,
    loading: subscriptionLoading,
  } = useSubscription();
  const analyticsEnabled = hasFeature('COMPANY_ADVANCED_ANALYTICS');
  const [data, setData] = useState<CompanyAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    if (!analyticsEnabled) {
      setLoading(false);
      return;
    }
    setLoading(true); setError('');
    try { setData(await analyticsApi.company()); }
    catch (loadError) { setError(getAuthErrorMessage(loadError)); }
    finally { setLoading(false); }
  }, [analyticsEnabled]);
  useEffect(() => { void load(); }, [load]);
  const copyCsv = async () => {
    try {
      await Clipboard.setStringAsync(await analyticsApi.companyReportCsv());
      Alert.alert('Report copied', 'The applicant analytics CSV is now on your clipboard.');
    } catch (exportError) {
      Alert.alert('Could not export report', getAuthErrorMessage(exportError));
    }
  };

  return <SafeAreaView style={styles.safeArea}>
    <View style={styles.header}><TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={22} color={colors.title} /></TouchableOpacity><Text style={styles.title}>Hiring Insights</Text></View>
    {subscriptionLoading ? <View style={styles.center}><ActivityIndicator color={colors.accent} /></View> : !analyticsEnabled ? (
      <View style={styles.lockedWrap}>
        <LockedFeatureOverlay
          title="Advanced hiring insights are Premium"
          message="Upgrade for applicant conversion analytics, candidate skill trends, listing performance, and report export."
          onUpgrade={() => navigation.navigate('PremiumPlans', { source: 'company-analytics' })}
        />
      </View>
    ) : loading && !data ? <View style={styles.center}><ActivityIndicator color={colors.accent} /></View> : <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={loading} onRefresh={() => void load()} />}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {data ? <>
        <View style={styles.grid}>
          {[['Active listings', data.activeListings], ['Listing views', data.totalViews], ['Applicants', data.totalApplicants], ['Accepted', data.acceptedApplicants]].map(([label, value]) => <View key={String(label)} style={styles.stat}><Text style={styles.value}>{value}</Text><Text style={styles.label}>{label}</Text></View>)}
        </View>
        <View style={styles.card}><Text style={styles.section}>Conversion</Text><Text style={styles.metric}>{data.overallApplicationConversionRate}% of views became applications</Text><Text style={styles.metric}>{data.overallAcceptanceRate}% of applicants were accepted</Text></View>
        <View style={styles.card}><Text style={styles.section}>Candidate skills</Text>{Object.entries(data.candidateSkills).length ? Object.entries(data.candidateSkills).sort((a,b) => b[1]-a[1]).slice(0,10).map(([skill,count]) => <View key={skill} style={styles.row}><Text style={styles.metric}>{skill}</Text><Text style={styles.count}>{count}</Text></View>) : <Text style={styles.empty}>No candidate skills yet.</Text>}</View>
        {data.listings.map((item) => <View key={item.listingId} style={styles.card}><Text style={styles.section}>{item.title}</Text><Text style={styles.metric}>{item.views} views · {item.applicants} applicants · {item.accepted} accepted</Text><Text style={styles.metric}>{item.applicationConversionRate}% view-to-application conversion</Text></View>)}
        <TouchableOpacity style={styles.exportButton} onPress={() => void copyCsv()}><Ionicons name="copy-outline" size={18} color={colors.onPrimary} /><Text style={styles.exportText}>Copy analytics CSV</Text></TouchableOpacity>
      </> : null}
    </ScrollView>}
  </SafeAreaView>;
}
const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background }, header: { flexDirection: 'row', alignItems: 'center', padding: 20 }, back: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', marginRight: 12 }, title: { color: colors.title, fontSize: 22, fontWeight: '800' }, center: { flex: 1, alignItems: 'center', justifyContent: 'center' }, content: { padding: 20, paddingTop: 0, paddingBottom: 50 }, error: { color: colors.withdrawText, backgroundColor: colors.withdrawBg, padding: 12, borderRadius: 10, marginBottom: 12 }, grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, marginBottom: 14 }, stat: { width: '48%', padding: 16, borderRadius: 15, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder }, value: { color: colors.title, fontSize: 25, fontWeight: '800' }, label: { color: colors.subtitle, fontSize: 11, marginTop: 4 }, card: { padding: 16, borderRadius: 15, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder, marginBottom: 11 }, section: { color: colors.title, fontSize: 15, fontWeight: '700', marginBottom: 9 }, metric: { color: colors.subtitle, fontSize: 12, lineHeight: 19 }, row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }, count: { color: colors.accent, fontWeight: '700' }, empty: { color: colors.subtitle, fontSize: 12 },
  lockedWrap: { flex: 1, justifyContent: 'center', padding: 24 },
  exportButton: { minHeight: 47, borderRadius: 24, backgroundColor: colors.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  exportText: { color: colors.onPrimary, fontSize: 13, fontWeight: '700' },
});
