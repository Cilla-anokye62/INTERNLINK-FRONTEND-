import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { TAB_BAR_BOTTOM_PADDING } from '../../src/constants/Colors';

// ---------- Types ----------
type Props = NativeStackScreenProps<any, any>;

interface StatItem {
  label: string;
  value: string;
  subtext?: string;
}

interface PerkItem {
  label: string;
}

interface InfoItem {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
}

// ---------- Main Screen ----------
const CompanyProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const stats: StatItem[] = [
    { label: 'Open roles', value: '6' },
    { label: 'Avg rating', value: '4.8' },
    { label: "Hires '25", value: '38' },
  ];

  const perks: PerkItem[] = [
    { label: 'Remote-friendly' },
    { label: 'Mentorship' },
    { label: 'Return offers' },
    { label: 'Wellness budget' },
    { label: 'Latest gear' },
  ];

  const infoItems: InfoItem[] = [
    { icon: 'globe-outline', label: 'Website', value: 'acme.tech' },
    { icon: 'location-outline', label: 'HQ', value: 'SF, CA' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Company profile</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.editLink}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cover image */}
        <View style={styles.coverImage} />

        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>A</Text>
          </View>
        </View>

        {/* Company name + badge */}
        <View style={styles.nameRow}>
          <Text style={styles.companyName}>Acme Tech</Text>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        </View>

        <Text style={styles.companyMeta}>
          Series B · 450 employees · San Francisco
        </Text>

        {/* Stats row */}
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
              {stat.subtext && (
                <View style={{ flexDirection: 'row', gap: 1, marginTop: 2 }}>
                  <Ionicons name="star" size={10} color={colors.accent} />
                  <Ionicons name="star" size={10} color={colors.accent} />
                  <Ionicons name="star" size={10} color={colors.accent} />
                  <Ionicons name="star" size={10} color={colors.accent} />
                  <Ionicons name="star" size={10} color={colors.accent} />
                </View>
              )}
            </View>
          ))}
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          We build infrastructure tools that help engineering teams ship
          faster. Our internship program ramps you from day-one shipping
          to owning a feature by week 6.
        </Text>

        {/* Culture & perks */}
        <Text style={styles.sectionTitle}>Culture & perks</Text>
        <View style={styles.perksWrap}>
          {perks.map((perk) => (
            <View key={perk.label} style={styles.perkChip}>
              <Text style={styles.perkChipText}>{perk.label}</Text>
            </View>
          ))}
        </View>

        {/* Info cards */}
        <View style={styles.infoRow}>
          {infoItems.map((item) => (
            <View key={item.label} style={styles.infoCard}>
              <Ionicons name={item.icon} size={18} color={colors.accent} style={{ marginBottom: 6 }} />
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------- Styles ----------
const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  backButton: {
    padding: 4,
  },
  backIcon: {
    fontSize: 18,
    color: colors.title,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.title,
  },
  editLink: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: TAB_BAR_BOTTOM_PADDING,
  },
  coverImage: {
    width: '100%',
    height: 140,
    backgroundColor: colors.accent,
  },
  avatarWrapper: {
    paddingHorizontal: 20,
    marginTop: -30,
    marginBottom: 12,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  avatarText: {
    color: colors.onPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 4,
  },
  companyName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.title,
  },
  verifiedBadge: {
    backgroundColor: colors.iconCircle,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  companyMeta: {
    fontSize: 13,
    color: colors.subtitle,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingVertical: 14,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statBoxDivider: {
    borderRightWidth: 1,
    borderRightColor: colors.inputBorder,
  },
  statLabel: {
    fontSize: 11,
    color: colors.subtitle,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.title,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.title,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.subtitle,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  perksWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 24,
  },
  perkChip: {
    backgroundColor: colors.iconCircle,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  perkChipText: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: 14,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.subtitle,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.title,
  },
});

export default CompanyProfileScreen;
