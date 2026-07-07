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
  subtext?: string;
}

interface PerkItem {
  label: string;
}

interface InfoItem {
  icon: string;
  label: string;
  value: string;
}

// ---------- Main Screen ----------
const CompanyProfileScreen: React.FC<Props> = ({ navigation }) => {
  const stats: StatItem[] = [
    { label: 'Open roles', value: '6' },
    { label: 'Avg rating', value: '4.8', subtext: '★★★★★' },
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
    { icon: '🌐', label: 'Website', value: 'acme.tech' },
    { icon: '📍', label: 'HQ', value: 'SF, CA' },
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
                <Text style={styles.statSubtext}>{stat.subtext}</Text>
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
              <Text style={styles.infoIcon}>{item.icon}</Text>
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
const TEAL = '#2BA9A0';
const TEAL_DARK = '#1E8A82';
const TEAL_LIGHT = '#E6F5F4';
const TEXT_DARK = '#1A1A1A';
const TEXT_GRAY = '#6B7280';
const BORDER_COLOR = '#E5E7EB';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  backButton: {
    padding: 4,
  },
  backIcon: {
    fontSize: 18,
    color: TEXT_DARK,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  editLink: {
    fontSize: 14,
    color: TEAL,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  coverImage: {
    width: '100%',
    height: 140,
    backgroundColor: TEAL_DARK,
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
    backgroundColor: TEAL_DARK,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    color: '#FFFFFF',
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
    color: TEXT_DARK,
  },
  verifiedBadge: {
    backgroundColor: TEAL_LIGHT,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: TEAL_DARK,
    fontWeight: '600',
  },
  companyMeta: {
    fontSize: 13,
    color: TEXT_GRAY,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingVertical: 14,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statBoxDivider: {
    borderRightWidth: 1,
    borderRightColor: BORDER_COLOR,
  },
  statLabel: {
    fontSize: 11,
    color: TEXT_GRAY,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  statSubtext: {
    fontSize: 10,
    color: TEAL,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 13,
    lineHeight: 20,
    color: TEXT_GRAY,
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
    backgroundColor: TEAL_LIGHT,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  perkChipText: {
    fontSize: 12,
    color: TEAL_DARK,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 14,
  },
  infoIcon: {
    fontSize: 18,
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 11,
    color: TEXT_GRAY,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_DARK,
  },
});

export default CompanyProfileScreen;