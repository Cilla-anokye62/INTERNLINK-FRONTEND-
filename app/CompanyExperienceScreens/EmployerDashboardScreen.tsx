import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';
import { TAB_BAR_BOTTOM_PADDING } from '../../src/constants/Colors';

export default function EmployerDashboardScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { userId, userName, getAnalytics, applications, conversations, listings } = useAppStore();

  const analytics = useMemo(() => getAnalytics(userId), [userId]);
  const unreadMessages = useMemo(() => conversations.filter((c) => !c.isArchived && c.unreadCount > 0).reduce((s, c) => s + c.unreadCount, 0), [conversations]);
  const activeListings = useMemo(() => listings.filter((l) => l.status === 'active'), [listings]);
  const pendingApps = useMemo(() => applications.filter((a) => a.status === 'submitted' || a.status === 'viewed'), [applications]);

  const quickActions = [
    { icon: 'add-circle-outline' as const, title: 'Post Internship', subtitle: `Publish a new role`, highlighted: true, screen: 'PostInternshipWizard' },
    { icon: 'people-outline' as const, title: 'Review Applicants', subtitle: `${pendingApps.length} awaiting review`, highlighted: false, screen: 'Applicants' },
    { icon: 'chatbubble-outline' as const, title: 'Messages', subtitle: unreadMessages > 0 ? `${unreadMessages} unread` : 'All read', highlighted: unreadMessages > 0, screen: 'Messages' },
    { icon: 'bar-chart-outline' as const, title: 'Insights', subtitle: `${analytics.totalApplications} total apps`, highlighted: false, screen: 'Insights' },
  ];

  const stats = [
    { label: 'Active', value: String(analytics.activeInternships) },
    { label: 'Interviews', value: String(analytics.interviewsScheduled) },
    { label: 'Offers Sent', value: String(analytics.offersSent) },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.companyAvatar}>
              <Text style={styles.companyAvatarText}>{userName ? userName.charAt(0).toUpperCase() : 'E'}</Text>
            </View>
            <View>
              <Text style={styles.companyName}>{userName || 'Employer'}</Text>
              <Text style={styles.companySubtitle}>Employer dashboard</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}
            onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={16} color={colors.title} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsCardLabel}>This month</Text>
          <Text style={styles.statsCardValue}>{analytics.totalApplications} applicants</Text>
          <Text style={styles.statsCardChange}>{analytics.applicationsThisWeek} new this week</Text>
          <View style={styles.statsRow}>
            {stats.map((stat, index) => (
              <View key={stat.label} style={[styles.statBox, index < stats.length - 1 && styles.statBoxDivider]}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.title }]}>Quick actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity key={action.title} style={[styles.quickActionCard, {
              backgroundColor: action.highlighted ? colors.accent : colors.card,
            }]} activeOpacity={0.8} onPress={() => navigation.navigate(action.screen)}>
              <Ionicons name={action.icon} size={15} color={action.highlighted ? colors.onPrimary : colors.accent} style={{ marginBottom: 10 }} />
              <Text style={[styles.quickActionTitle, {
                color: action.highlighted ? '#FFFFFF' : colors.title,
              }]}>{action.title}</Text>
              <Text style={[styles.quickActionSubtitle, {
                color: action.highlighted ? 'rgba(255,255,255,0.8)' : colors.subtitle,
              }]}>{action.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.listingsHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.title }]}>Active listings</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Listings')}>
            <Text style={[styles.manageLink, { color: colors.accent }]}>Manage</Text>
          </TouchableOpacity>
        </View>

        {activeListings.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.inputBorder }]}>
            <Ionicons name="clipboard-outline" size={32} color={colors.subtitle} style={{ marginBottom: 12 }} />
            <Text style={[styles.emptyTitle, { color: colors.title }]}>No active listings</Text>
            <Text style={[styles.emptySubtitle, { color: colors.subtitle }]}>Post your first internship to start receiving applications</Text>
          </View>
        ) : (
          activeListings.slice(0, 3).map((listing) => (
            <View key={listing.id} style={[styles.listingCard, { backgroundColor: colors.card, borderColor: colors.inputBorder }]}>
              <View style={styles.listingTopRow}>
                <View style={styles.listingInfo}>
                  <Text style={[styles.listingTitle, { color: colors.title }]} numberOfLines={1}>{listing.title}</Text>
                  <Text style={[styles.listingSub, { color: colors.subtitle }]}>{listing.applicantCount} applicants · {listing.views} views</Text>
                </View>
                <View style={[styles.listingBadge, { backgroundColor: colors.iconCircle }]}>
                  <Text style={[styles.listingBadgeText, { color: colors.accent }]}>
                    {listing.status === 'active' ? 'Active' : listing.status}
                  </Text>
                </View>
              </View>
              <View style={[styles.listingMetrics, { backgroundColor: colors.background }]}>
                <View style={[styles.listingMetric, { borderRightColor: colors.inputBorder }]}>
                  <Text style={[styles.listingMetricLabel, { color: colors.subtitle }]}>Views</Text>
                  <Text style={[styles.listingMetricValue, { color: colors.title }]}>{listing.views}</Text>
                </View>
                <View style={[styles.listingMetric, { borderRightColor: colors.inputBorder }]}>
                  <Text style={[styles.listingMetricLabel, { color: colors.subtitle }]}>Applied</Text>
                  <Text style={[styles.listingMetricValue, { color: colors.title }]}>{listing.applicantCount}</Text>
                </View>
                <View style={styles.listingMetric}>
                  <Text style={[styles.listingMetricLabel, { color: colors.subtitle }]}>Positions</Text>
                  <Text style={[styles.listingMetricValue, { color: colors.title }]}>{listing.openPositions}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: TAB_BAR_BOTTOM_PADDING },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  companyAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  companyAvatarText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
  companyName: { fontSize: 15, fontWeight: '700', color: colors.title },
  companySubtitle: { fontSize: 12, color: colors.subtitle },
  notificationButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  statsCard: { backgroundColor: colors.gradientStart, borderRadius: 18, padding: 18, marginBottom: 24 },
  statsCardLabel: { fontSize: 13, color: '#D7F0EE', marginBottom: 6 },
  statsCardValue: { fontSize: 26, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  statsCardChange: { fontSize: 12, color: '#BCE9E5', marginBottom: 16 },
  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 12, paddingVertical: 12 },
  statBox: { flex: 1, alignItems: 'center' },
  statBoxDivider: { borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.2)' },
  statLabel: { fontSize: 11, color: '#D7F0EE', marginBottom: 4 },
  statValue: { fontSize: 17, fontWeight: '700', color: '#FFFFFF' },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12 },
  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  quickActionCard: { width: '48%', borderRadius: 16, padding: 14, marginBottom: 12 },

  quickActionTitle: { fontSize: 13, fontWeight: '700', marginBottom: 2 },
  quickActionSubtitle: { fontSize: 11 },
  listingsHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  manageLink: { fontSize: 13, fontWeight: '600', marginBottom: 12 },
  emptyCard: { borderRadius: 16, padding: 24, borderWidth: 1, alignItems: 'center' },
  emptyTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  emptySubtitle: { fontSize: 13, textAlign: 'center' },
  listingCard: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 12 },
  listingTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  listingInfo: { flex: 1, marginRight: 8 },
  listingTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  listingSub: { fontSize: 12 },
  listingBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  listingBadgeText: { fontSize: 11, fontWeight: '700' },
  listingMetrics: { flexDirection: 'row', borderRadius: 12, paddingVertical: 10 },
  listingMetric: { flex: 1, alignItems: 'center', borderRightWidth: 1 },
  listingMetricLabel: { fontSize: 11, marginBottom: 4 },
  listingMetricValue: { fontSize: 15, fontWeight: '700' },
});
