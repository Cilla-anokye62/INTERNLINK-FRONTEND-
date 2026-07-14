import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../src/hooks/useAppTheme';

// ---------- Types ----------
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
  colors: any;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ action, onPress, colors }) => {
  return (
    <TouchableOpacity
      style={[
        {
          width: '48%',
          backgroundColor: action.highlighted ? colors.accent : colors.card,
          borderRadius: 16,
          padding: 14,
          marginBottom: 12,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: action.highlighted ? 'rgba(255,255,255,0.25)' : colors.iconCircle,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 15, color: action.highlighted ? '#FFFFFF' : colors.accent, fontWeight: '700' }}>
          {action.icon}
        </Text>
      </View>
      <Text style={{ fontSize: 13, fontWeight: '700', color: action.highlighted ? '#FFFFFF' : colors.cardTitle, marginBottom: 2 }}>
        {action.title}
      </Text>
      <Text style={{ fontSize: 11, color: action.highlighted ? 'rgba(255,255,255,0.8)' : colors.subtitle }}>
        {action.subtitle}
      </Text>
    </TouchableOpacity>
  );
};

// ---------- Listing Card ----------
interface ListingCardProps {
  listing: Listing;
  colors: any;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, colors }) => {
  return (
    <View style={{
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      padding: 14,
      marginBottom: 12,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.cardTitle, marginBottom: 2 }}>{listing.title}</Text>
          <Text style={{ fontSize: 12, color: colors.subtitle }}>{listing.applicantsSummary}</Text>
        </View>
        <View style={{ backgroundColor: colors.iconCircle, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: colors.accent }}>{listing.status}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', backgroundColor: colors.background, borderRadius: 12, paddingVertical: 10 }}>
        {listing.metrics.map((metric, index) => (
          <View
            key={metric.label}
            style={[
              { flex: 1, alignItems: 'center' },
              index < listing.metrics.length - 1 && { borderRightWidth: 1, borderRightColor: colors.cardBorder },
            ]}
          >
            <Text style={{ fontSize: 11, color: colors.subtitle, marginBottom: 4 }}>{metric.label}</Text>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.cardTitle }}>{metric.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ---------- Main Screen ----------
const EmployerDashboardScreen: React.FC = () => {
  const { colors } = useAppTheme();

  const stats: StatItem[] = [
    { label: 'Active', value: '6' },
    { label: 'Interviews', value: '24' },
    { label: 'Hired', value: '8' },
  ];

  const quickActions: QuickAction[] = [
    { icon: '+', title: 'Post internship', subtitle: 'Reach 12K students', highlighted: true },
    { icon: '👥', title: 'Review applicants', subtitle: '32 new', highlighted: false },
    { icon: '💬', title: 'Messages', subtitle: '4 unread', highlighted: false },
    { icon: '📊', title: 'Insights', subtitle: 'View report', highlighted: false },
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

  const styles = React.useMemo(() => createStyles(colors), [colors]);

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

          <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Stats card — intentionally stays branded teal in both modes */}
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
              onPress={() => {}}
              colors={colors}
            />
          ))}
        </View>

        {/* Active listings */}
        <View style={styles.listingsHeaderRow}>
          <Text style={styles.sectionTitle}>Active listings</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.manageLink}>Manage</Text>
          </TouchableOpacity>
        </View>

        {listings.map((listing) => (
          <ListingCard key={listing.title} listing={listing} colors={colors} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  companyAvatarText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  companyName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.title,
  },
  companySubtitle: {
    fontSize: 12,
    color: colors.subtitle,
  },
  notificationButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    fontSize: 16,
  },
  // Stats card stays branded teal regardless of theme
  statsCard: {
    backgroundColor: colors.gradientStart,
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
    color: colors.title,
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  listingsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  manageLink: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '600',
    marginBottom: 12,
  },
});

export default EmployerDashboardScreen;