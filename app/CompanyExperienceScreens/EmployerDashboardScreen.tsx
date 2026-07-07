import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// ---------- Types ----------
type Props = NativeStackScreenProps<any, any>;

interface StatItem {
  label: string;
  value: string;
}

interface QuickAction {
  icon: string;
  title: string;
  subtitle: string;
  highlighted: boolean;
}

interface ListingMetric {
  label: string;
  value: string;
}

interface Listing {
  title: string;
  applicantsSummary: string;
  status: 'Active' | 'Closed' | 'Draft';
  metrics: ListingMetric[];
}

// ---------- Quick Action Card ----------
interface QuickActionCardProps {
  action: QuickAction;
  onPress: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ action, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.quickActionCard,
        action.highlighted && styles.quickActionCardHighlighted,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.quickActionIconWrap,
          action.highlighted && styles.quickActionIconWrapHighlighted,
        ]}
      >
        <Text style={styles.quickActionIcon}>{action.icon}</Text>
      </View>
      <Text
        style={[
          styles.quickActionTitle,
          action.highlighted && styles.quickActionTitleHighlighted,
        ]}
      >
        {action.title}
      </Text>
      <Text
        style={[
          styles.quickActionSubtitle,
          action.highlighted && styles.quickActionSubtitleHighlighted,
        ]}
      >
        {action.subtitle}
      </Text>
    </TouchableOpacity>
  );
};

// ---------- Listing Card ----------
interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  return (
    <View style={styles.listingCard}>
      <View style={styles.listingHeader}>
        <View style={styles.listingHeaderText}>
          <Text style={styles.listingTitle}>{listing.title}</Text>
          <Text style={styles.listingSubtitle}>{listing.applicantsSummary}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>{listing.status}</Text>
        </View>
      </View>

      <View style={styles.listingMetricsRow}>
        {listing.metrics.map((metric, index) => (
          <View
            key={metric.label}
            style={[
              styles.metricBox,
              index < listing.metrics.length - 1 && styles.metricBoxDivider,
            ]}
          >
            <Text style={styles.metricLabel}>{metric.label}</Text>
            <Text style={styles.metricValue}>{metric.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ---------- Main Screen ----------
const EmployerDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const stats: StatItem[] = [
    { label: 'Active', value: '6' },
    { label: 'Interviews', value: '24' },
    { label: 'Hired', value: '8' },
  ];

  const quickActions: QuickAction[] = [
    {
      icon: '+',
      title: 'Post internship',
      subtitle: 'Reach 12K students',
      highlighted: true,
    },
    {
      icon: '👥',
      title: 'Review applicants',
      subtitle: '32 new',
      highlighted: false,
    },
    {
      icon: '💬',
      title: 'Messages',
      subtitle: '4 unread',
      highlighted: false,
    },
    {
      icon: '📊',
      title: 'Insights',
      subtitle: 'View report',
      highlighted: false,
    },
  ];

  const listings: Listing[] = [
    {
      title: 'Frontend Engineering Intern',
      applicantsSummary: '124 applicants · 8 new today',
      status: 'Active',
      metrics: [
        { label: 'Views', value: '1.2K' },
        { label: 'Applied', value: '124' },
        { label: 'Match avg', value: '87%' },
      ],
    },
    {
      title: 'Product Design Intern',
      applicantsSummary: '86 applicants · 5 new today',
      status: 'Active',
      metrics: [
        { label: 'Views', value: '1.2K' },
        { label: 'Applied', value: '86' },
        { label: 'Match avg', value: '87%' },
      ],
    },
    {
      title: 'Data Science Intern',
      applicantsSummary: '52 applicants · 2 new today',
      status: 'Active',
      metrics: [
        { label: 'Views', value: '1.2K' },
        { label: 'Applied', value: '52' },
        { label: 'Match avg', value: '87%' },
      ],
    },
  ];

  const handleQuickActionPress = (title: string): void => {
    console.log('Quick action pressed:', title);
  };

  const handleManagePress = (): void => {
    console.log('Manage pressed');
  };

  const handleNotificationPress = (): void => {
    console.log('Notification bell pressed');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.companyAvatar}>
              <Text style={styles.companyAvatarText}>A</Text>
            </View>
            <View>
              <Text style={styles.companyName}>Acme Tech</Text>
              <Text style={styles.companySubtitle}>Employer dashboard</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={handleNotificationPress}
            activeOpacity={0.7}
          >
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Stats card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsCardLabel}>This month</Text>
          <Text style={styles.statsCardValue}>412 applicants</Text>
          <Text style={styles.statsCardChange}>+18% from last month</Text>

          <View style={styles.statsRow}>
            {stats.map((stat, index) => (
              <View
                key={stat.label}
                style={[
                  styles.statBox,
                  index < stats.length - 1 && styles.statBoxDivider,
                ]}
              >
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <QuickActionCard
              key={action.title}
              action={action}
              onPress={() => handleQuickActionPress(action.title)}
            />
          ))}
        </View>

        {/* Active listings */}
        <View style={styles.listingsHeaderRow}>
          <Text style={styles.sectionTitle}>Active listings</Text>
          <TouchableOpacity onPress={handleManagePress} activeOpacity={0.7}>
            <Text style={styles.manageLink}>Manage</Text>
          </TouchableOpacity>
        </View>

        {listings.map((listing) => (
          <ListingCard key={listing.title} listing={listing} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------- Styles ----------
const TEAL = '#2BA9A0';
const TEAL_DARK = '#1E8A82';
const TEAL_LIGHT = '#E6F5F4';
const BG_LIGHT = '#F2FBFA';
const TEXT_DARK = '#1A1A1A';
const TEXT_GRAY = '#6B7280';
const BORDER_COLOR = '#E5E7EB';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: TEAL_DARK,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  companyAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  companyName: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  companySubtitle: {
    fontSize: 12,
    color: TEXT_GRAY,
  },
  notificationButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    fontSize: 16,
  },
  statsCard: {
    backgroundColor: TEAL_DARK,
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
  },
  statsCardLabel: {
    fontSize: 13,
    color: '#D7F0EE',
    marginBottom: 6,
  },
  statsCardValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statsCardChange: {
    fontSize: 12,
    color: '#BCE9E5',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingVertical: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statBoxDivider: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.2)',
  },
  statLabel: {
    fontSize: 11,
    color: '#D7F0EE',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  quickActionCardHighlighted: {
    backgroundColor: TEAL,
  },
  quickActionIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: TEAL_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickActionIconWrapHighlighted: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  quickActionIcon: {
    fontSize: 15,
    color: TEAL_DARK,
    fontWeight: '700',
  },
  quickActionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 2,
  },
  quickActionTitleHighlighted: {
    color: '#FFFFFF',
  },
  quickActionSubtitle: {
    fontSize: 11,
    color: TEXT_GRAY,
  },
  quickActionSubtitleHighlighted: {
    color: '#E6F5F4',
  },
  listingsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  manageLink: {
    fontSize: 13,
    color: TEAL,
    fontWeight: '600',
    marginBottom: 12,
  },
  listingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 14,
    marginBottom: 12,
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  listingHeaderText: {
    flex: 1,
    marginRight: 8,
  },
  listingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 2,
  },
  listingSubtitle: {
    fontSize: 12,
    color: TEXT_GRAY,
  },
  statusBadge: {
    backgroundColor: TEAL_LIGHT,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: TEAL_DARK,
  },
  listingMetricsRow: {
    flexDirection: 'row',
    backgroundColor: BG_LIGHT,
    borderRadius: 12,
    paddingVertical: 10,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
  },
  metricBoxDivider: {
    borderRightWidth: 1,
    borderRightColor: BORDER_COLOR,
  },
  metricLabel: {
    fontSize: 11,
    color: TEXT_GRAY,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_DARK,
  },
});

export default EmployerDashboardScreen;