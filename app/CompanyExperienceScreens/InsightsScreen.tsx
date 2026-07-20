import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 80;

function formatNum(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

export default function InsightsScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { getAnalytics, userId } = useAppStore();
  const analytics = useMemo(() => getAnalytics(userId), [userId]);

  const maxDay = useMemo(() => Math.max(...analytics.applicationsByDay.map((d) => d.count), 1), [analytics]);
  const maxSkill = useMemo(() => Math.max(...analytics.skillsDistribution.map((s) => s.count), 1), [analytics]);
  const totalStatus = useMemo(() => analytics.statusBreakdown.reduce((s, b) => s + b.count, 0) || 1, [analytics]);
  const maxUni = useMemo(() => Math.max(...analytics.applicationsByUniversity.map((u) => u.count), 1), [analytics]);
  const maxProg = useMemo(() => Math.max(...analytics.applicationsByProgramme.map((p) => p.count), 1), [analytics]);

  const statCards = [
    { label: 'Active Listings', value: analytics.activeInternships, icon: 'clipboard-outline' as const, color: colors.accent },
    { label: 'Total Views', value: formatNum(analytics.totalViews), icon: 'eye-outline' as const, color: colors.primary },
    { label: 'This Week', value: analytics.applicationsThisWeek, icon: 'trending-up-outline' as const, color: colors.successIcon },
    { label: 'Avg Match', value: analytics.avgMatchScore + '%', icon: 'analytics-outline' as const, color: colors.primary },
  ];

  const conversionCards = [
    { label: 'Application → Non-reject', value: analytics.conversionRate + '%', color: '#10B981' },
    { label: 'Application → Interview', value: analytics.interviewConversionRate + '%', color: '#8B5CF6' },
    { label: 'Offer Acceptance', value: analytics.offerAcceptanceRate + '%', color: '#059669' },
  ];

  const aiInsights = useMemo(() => {
    const insights: { icon: React.ComponentProps<typeof Ionicons>['name']; title: string; body: string; color: string }[] = [];
    if (analytics.avgMatchScore > 70) {
      insights.push({ icon: 'locate-outline', title: 'Strong Candidate Pool', body: `Your average match score of ${analytics.avgMatchScore}% indicates high-quality applicants matching your requirements.`, color: colors.successIcon });
    }
    if (analytics.applicationsThisWeek > 5) {
      insights.push({ icon: 'trending-up-outline', title: 'Growing Interest', body: `${analytics.applicationsThisWeek} applications this week — your listings are gaining traction.`, color: colors.accent });
    }
    if (analytics.interviewConversionRate > 20) {
      insights.push({ icon: 'sparkles-outline', title: 'Efficient Pipeline', body: `${analytics.interviewConversionRate}% of applicants are reaching interview stage.`, color: colors.primary });
    }
    if (analytics.pendingReview > 0) {
      insights.push({ icon: 'time-outline', title: 'Action Needed', body: `${analytics.pendingReview} applications are awaiting review. Timely responses improve candidate experience.`, color: colors.danger });
    }
    if (analytics.skillsDistribution.length > 0) {
      insights.push({ icon: 'bulb-outline', title: 'Top Skill', body: `"${analytics.skillsDistribution[0].skill}" is the most common skill among applicants.`, color: colors.accent });
    }
    return insights;
  }, [analytics, colors]);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.title }]}>{title}</Text>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={20} color={colors.title} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.title }]}>Insights & Analytics</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Section title="Overview">
          <View style={styles.statsGrid}>
            {statCards.map((card, i) => (
              <View key={i} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.inputBorder }]}>
                <Ionicons name={card.icon} size={22} color={card.color} style={{ marginBottom: 8 }} />
                <Text style={[styles.statValue, { color: card.color }]}>{card.value}</Text>
                <Text style={[styles.statLabel, { color: colors.subtitle }]}>{card.label}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Applications This Week">
          <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.inputBorder }]}>
            <View style={styles.barChart}>
              {analytics.applicationsByDay.map((d, i) => (
                <View key={i} style={styles.barCol}>
                  <Text style={[styles.barValue, { color: colors.subtitle }]}>{d.count}</Text>
                  <View style={[styles.barTrack, { backgroundColor: colors.inputBorder }]}>
                    <View style={[styles.barFill, { backgroundColor: colors.accent, height: `${(d.count / maxDay) * 100}%` }]} />
                  </View>
                  <Text style={[styles.barLabel, { color: colors.subtitle }]}>{d.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </Section>

        <Section title="Application Status">
          <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.inputBorder }]}>
            <View style={styles.statusRow}>
              {analytics.statusBreakdown.filter((s) => s.count > 0).map((s, i) => {
                const pct = Math.round((s.count / totalStatus) * 100);
                return (
                  <View key={i} style={[styles.statusSeg, { flex: s.count, backgroundColor: s.color }]}>
                    {pct >= 8 && <Text style={styles.statusSegText}>{pct}%</Text>}
                  </View>
                );
              })}
            </View>
            <View style={styles.statusLegend}>
              {analytics.statusBreakdown.filter((s) => s.count > 0).map((s, i) => (
                <View key={i} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: s.color }]} />
                  <Text style={[styles.legendLabel, { color: colors.subtitle }]}>{s.status}</Text>
                  <Text style={[styles.legendCount, { color: colors.title }]}>{s.count}</Text>
                </View>
              ))}
            </View>
          </View>
        </Section>

        <Section title="Conversion Funnel">
          <View style={styles.funnelRow}>
            {conversionCards.map((c, i) => (
              <View key={i} style={[styles.funnelCard, { backgroundColor: colors.card, borderColor: colors.inputBorder }]}>
                <Text style={[styles.funnelValue, { color: c.color }]}>{c.value}</Text>
                <Text style={[styles.funnelLabel, { color: colors.subtitle }]}>{c.label}</Text>
              </View>
            ))}
          </View>
        </Section>

        {analytics.skillsDistribution.length > 0 && (
          <Section title="Skills in Demand">
            <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.inputBorder }]}>
              {analytics.skillsDistribution.slice(0, 8).map((s, i) => (
                <View key={i} style={styles.hBarRow}>
                  <Text style={[styles.hBarLabel, { color: colors.title }]} numberOfLines={1}>{s.skill}</Text>
                  <View style={[styles.hBarTrack, { backgroundColor: colors.inputBorder }]}>
                    <View style={[styles.hBarFill, { backgroundColor: i === 0 ? colors.accent : colors.primary, width: `${(s.count / maxSkill) * 100}%` }]} />
                  </View>
                  <Text style={[styles.hBarValue, { color: colors.subtitle }]}>{s.count}</Text>
                </View>
              ))}
            </View>
          </Section>
        )}

        {analytics.applicationsByUniversity.length > 0 && (
          <Section title="Applications by University">
            <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.inputBorder }]}>
              {analytics.applicationsByUniversity.slice(0, 5).map((u, i) => (
                <View key={i} style={styles.hBarRow}>
                  <Text style={[styles.hBarLabel, { color: colors.title }]} numberOfLines={1}>{u.name}</Text>
                  <View style={[styles.hBarTrack, { backgroundColor: colors.inputBorder }]}>
                    <View style={[styles.hBarFill, { backgroundColor: '#8B5CF6', width: `${(u.count / maxUni) * 100}%` }]} />
                  </View>
                  <Text style={[styles.hBarValue, { color: colors.subtitle }]}>{u.count}</Text>
                </View>
              ))}
            </View>
          </Section>
        )}

        {analytics.applicationsByProgramme.length > 0 && (
          <Section title="Applications by Programme">
            <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.inputBorder }]}>
              {analytics.applicationsByProgramme.slice(0, 5).map((p, i) => (
                <View key={i} style={styles.hBarRow}>
                  <Text style={[styles.hBarLabel, { color: colors.title }]} numberOfLines={1}>{p.name}</Text>
                  <View style={[styles.hBarTrack, { backgroundColor: colors.inputBorder }]}>
                    <View style={[styles.hBarFill, { backgroundColor: '#F59E0B', width: `${(p.count / maxProg) * 100}%` }]} />
                  </View>
                  <Text style={[styles.hBarValue, { color: colors.subtitle }]}>{p.count}</Text>
                </View>
              ))}
            </View>
          </Section>
        )}

        {analytics.topListings.length > 0 && (
          <Section title="Top Listings">
            {analytics.topListings.map((l, i) => (
              <View key={i} style={[styles.listingRow, { backgroundColor: colors.card, borderColor: colors.inputBorder }]}>
                <View style={[styles.listingRank, { backgroundColor: i === 0 ? colors.accent : i === 1 ? '#10B981' : colors.iconCircle }]}>
                  <Text style={[styles.listingRankText, { color: i < 2 ? colors.onPrimary : colors.title }]}>{i + 1}</Text>
                </View>
                <View style={styles.listingInfo}>
                  <Text style={[styles.listingTitle, { color: colors.title }]} numberOfLines={1}>{l.title}</Text>
                  <Text style={[styles.listingStats, { color: colors.subtitle }]}>{l.applications} apps · {l.views} views</Text>
                </View>
                <View style={styles.listingBar}>
                  <View style={[styles.listingBarFill, { backgroundColor: colors.accent, width: `${Math.min((l.applications / Math.max(analytics.topListings[0]?.applications || 1, 1)) * 100, 100)}%` }]} />
                </View>
              </View>
            ))}
          </Section>
        )}

        {aiInsights.length > 0 && (
          <Section title="AI Insights">
            {aiInsights.map((insight, i) => (
              <View key={i} style={[styles.insightCard, { backgroundColor: colors.card, borderColor: colors.inputBorder, borderLeftColor: insight.color }]}>
                <Ionicons name={insight.icon} size={22} color={insight.color} style={{ marginTop: 2 }} />
                <View style={styles.insightContent}>
                  <Text style={[styles.insightTitle, { color: colors.title }]}>{insight.title}</Text>
                  <Text style={[styles.insightBody, { color: colors.subtitle }]}>{insight.body}</Text>
                </View>
              </View>
            ))}
          </Section>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 18, fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scrollContent: { paddingHorizontal: 20 },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 14 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { width: (SCREEN_WIDTH - 52) / 2, borderRadius: 16, padding: 16, borderWidth: 1 },
  statValue: { fontSize: 26, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 12, fontWeight: '500' },

  chartCard: { borderRadius: 16, padding: 16, borderWidth: 1 },

  barChart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 140, paddingTop: 20 },
  barCol: { alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' },
  barValue: { fontSize: 10, marginBottom: 4 },
  barTrack: { width: 18, height: 100, borderRadius: 9, overflow: 'hidden', justifyContent: 'flex-end' },
  barFill: { width: '100%', borderRadius: 9, minHeight: 2 },
  barLabel: { fontSize: 10, marginTop: 6 },

  statusRow: { flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: 14, gap: 2 },
  statusSeg: { borderRadius: 4, alignItems: 'center', justifyContent: 'center', minWidth: 8 },
  statusSegText: { fontSize: 9, fontWeight: '700', color: '#fff' },
  statusLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 11 },
  legendCount: { fontSize: 11, fontWeight: '700' },

  funnelRow: { flexDirection: 'row', gap: 10 },
  funnelCard: { flex: 1, borderRadius: 14, padding: 14, borderWidth: 1, alignItems: 'center' },
  funnelValue: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  funnelLabel: { fontSize: 10, textAlign: 'center', lineHeight: 14 },

  hBarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  hBarLabel: { width: 80, fontSize: 12, fontWeight: '500' },
  hBarTrack: { flex: 1, height: 10, borderRadius: 5, overflow: 'hidden' },
  hBarFill: { height: '100%', borderRadius: 5, minWidth: 2 },
  hBarValue: { width: 24, fontSize: 12, fontWeight: '600', textAlign: 'right' },

  listingRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 12, borderWidth: 1, marginBottom: 8, gap: 12 },
  listingRank: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  listingRankText: { fontSize: 13, fontWeight: '700' },
  listingInfo: { flex: 1 },
  listingTitle: { fontSize: 13, fontWeight: '600', marginBottom: 2 },
  listingStats: { fontSize: 11 },
  listingBar: { width: 50, height: 6, borderRadius: 3, backgroundColor: colors.inputBorder, overflow: 'hidden' },
  listingBarFill: { height: '100%', borderRadius: 3 },

  insightCard: { flexDirection: 'row', borderRadius: 14, padding: 14, borderWidth: 1, borderLeftWidth: 4, marginBottom: 10, gap: 12 },
  insightContent: { flex: 1 },
  insightTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  insightBody: { fontSize: 12, lineHeight: 17 },
});
