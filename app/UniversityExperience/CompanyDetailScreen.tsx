/**
 * CompanyDetailScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Company Detail (reached by tapping a company row
 * in the CompanyEngagement screen or Top Placements on Dashboard)
 *
 * Content:
 *  - Back arrow + header with company name
 *  - Company profile card: logo, name, industry, location
 *  - "Partnership" info card: status, open roles, students placed, since
 *  - "Open roles" list: internship positions available
 *  - "Recent placements" list: students placed at this company
 *
 * HOW TO USE:
 *  Registered in App.tsx's Stack Navigator:
 *     <Stack.Screen name="CompanyDetail" component={CompanyDetailScreen} />
 * ─────────────────────────────────────────────────────────────────
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


// ─── COLOR PALETTE ───────────────────────────────────────────────
const COLORS = {
  background:        '#F5FBFA',
  backBtnBg:         '#FFFFFF',
  backArrow:         '#0D3B47',
  headerTitle:       '#0D3B47',

  // Company profile card
  profileCardBg:     '#FFFFFF',
  logoText:          '#FFFFFF',
  companyName:       '#0D3B47',
  companyIndustry:   '#4A7C75',
  companyLocation:   '#9BB8B4',

  // Info card
  sectionCardBg:     '#FFFFFF',
  sectionTitle:      '#0D3B47',
  fieldLabel:        '#9BB8B4',
  fieldValue:        '#0D3B47',
  fieldDivider:      '#F0F6F5',

  // Engaged pill
  engagedPillBg:     '#D6EEF2',
  engagedPillText:   '#1B7E94',

  // Role rows
  roleName:          '#0D3B47',
  roleDetail:        '#9BB8B4',
  roleApplyBg:       '#E8F8F5',
  roleApplyText:     '#2EC4B6',

  // Student rows
  studentName:       '#0D3B47',
  studentDetail:     '#9BB8B4',
  avatarBg:          '#0D3B47',
  avatarText:        '#FFFFFF',
};

const COMPANY_DATA: Record<string, any> = {
  google: {
    logoLetter: 'G', logoColor: '#4285F4', name: 'Google',
    industry: 'Technology', location: 'Mountain View, CA',
    status: 'Engaged', openRoles: 24, studentsPlaced: 48, partnerSince: '2022',
    roles: [
      { title: 'Software Engineering Intern', team: 'Cloud', duration: '12 weeks' },
      { title: 'Product Management Intern', team: 'Ads', duration: '10 weeks' },
      { title: 'UX Design Intern', team: 'Search', duration: '12 weeks' },
    ],
    placements: [
      { initials: 'LN', name: 'Liam Nguyen', role: 'SWE Intern', year: '2026' },
      { initials: 'AM', name: 'Alex Morgan', role: 'SWE Intern', year: '2025' },
    ],
  },
  meta: {
    logoLetter: 'M', logoColor: '#1877F2', name: 'Meta',
    industry: 'Technology', location: 'Menlo Park, CA',
    status: 'Engaged', openRoles: 18, studentsPlaced: 32, partnerSince: '2021',
    roles: [
      { title: 'Frontend Engineering Intern', team: 'Reality Labs', duration: '12 weeks' },
      { title: 'ML Research Intern', team: 'FAIR', duration: '10 weeks' },
    ],
    placements: [
      { initials: 'LN', name: 'Liam Nguyen', role: 'Frontend Intern', year: '2026' },
    ],
  },
  stripe: {
    logoLetter: 'S', logoColor: '#7C5CFC', name: 'Stripe',
    industry: 'FinTech', location: 'San Francisco, CA',
    status: 'Engaged', openRoles: 12, studentsPlaced: 21, partnerSince: '2023',
    roles: [
      { title: 'Backend Engineering Intern', team: 'Payments', duration: '10 weeks' },
    ],
    placements: [],
  },
  openai: {
    logoLetter: 'O', logoColor: '#1E8E5A', name: 'OpenAI',
    industry: 'AI / Machine Learning', location: 'San Francisco, CA',
    status: 'Engaged', openRoles: 8, studentsPlaced: 16, partnerSince: '2024',
    roles: [
      { title: 'Research Intern', team: 'Alignment', duration: '12 weeks' },
    ],
    placements: [],
  },
  airbnb: {
    logoLetter: 'A', logoColor: '#E94B6B', name: 'Airbnb',
    industry: 'Travel / Hospitality', location: 'San Francisco, CA',
    status: 'Engaged', openRoles: 6, studentsPlaced: 12, partnerSince: '2023',
    roles: [
      { title: 'Software Engineering Intern', team: 'Payments', duration: '10 weeks' },
    ],
    placements: [
      { initials: 'AM', name: 'Alex Morgan', role: 'SWE Intern', year: '2026' },
    ],
  },
};


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function CompanyDetailScreen({ navigation, route }: any) {
  const companyId = route.params?.companyId || 'google';
  const company = COMPANY_DATA[companyId] ?? COMPANY_DATA.google;

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER ─────────────────────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back-outline" size={22} color={COLORS.backArrow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Company Profile</Text>
        </View>

        {/* ── COMPANY PROFILE CARD ───────────────────────────────── */}
        <View style={styles.profileCard}>
          <View style={[styles.logo, { backgroundColor: company.logoColor }]}>
            <Text style={styles.logoText}>{company.logoLetter}</Text>
          </View>
          <Text style={styles.companyName}>{company.name}</Text>
          <Text style={styles.companyIndustry}>{company.industry}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={COLORS.companyLocation} />
            <Text style={styles.companyLocation}>{company.location}</Text>
          </View>
        </View>

        {/* ── PARTNERSHIP INFO CARD ──────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Partnership</Text>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Status</Text>
            <View style={styles.engagedPill}>
              <Text style={styles.engagedPillText}>{company.status}</Text>
            </View>
          </View>
          <View style={styles.fieldDivider} />

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Open roles</Text>
            <Text style={styles.fieldValue}>{company.openRoles}</Text>
          </View>
          <View style={styles.fieldDivider} />

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Students placed</Text>
            <Text style={styles.fieldValue}>{company.studentsPlaced}</Text>
          </View>
          <View style={styles.fieldDivider} />

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Partner since</Text>
            <Text style={styles.fieldValue}>{company.partnerSince}</Text>
          </View>
        </View>

        {/* ── OPEN ROLES ─────────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Open roles ({company.roles.length})</Text>

          {company.roles.map((role: any, index: number) => (
            <View
              key={index}
              style={[
                styles.roleRow,
                index === company.roles.length - 1 && styles.roleRowLast,
              ]}
            >
              <View style={styles.roleTextBlock}>
                <Text style={styles.roleName}>{role.title}</Text>
                <Text style={styles.roleDetail}>{role.team} · {role.duration}</Text>
              </View>
              <View style={styles.roleApplyBadge}>
                <Text style={styles.roleApplyText}>View</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── RECENT PLACEMENTS ──────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent placements ({company.placements.length})</Text>

          {company.placements.length === 0 ? (
            <Text style={styles.emptyText}>No placements recorded yet.</Text>
          ) : (
            company.placements.map((student: any, index: number) => (
              <View
                key={index}
                style={[
                  styles.studentRow,
                  index === company.placements.length - 1 && styles.roleRowLast,
                ]}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{student.initials}</Text>
                </View>
                <View style={styles.studentTextBlock}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentDetail}>{student.role} · {student.year}</Text>
                </View>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}


// ─── STYLES ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.backBtnBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.headerTitle,
  },

  // Profile card
  profileCard: {
    backgroundColor: COLORS.profileCardBg,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.logoText,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.companyName,
    marginBottom: 4,
  },
  companyIndustry: {
    fontSize: 13,
    color: COLORS.companyIndustry,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyLocation: {
    fontSize: 12,
    color: COLORS.companyLocation,
    marginLeft: 4,
  },

  // Section cards
  sectionCard: {
    backgroundColor: COLORS.sectionCardBg,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.sectionTitle,
    marginBottom: 14,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  fieldLabel: {
    fontSize: 13,
    color: COLORS.fieldLabel,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.fieldValue,
  },
  fieldDivider: {
    height: 1,
    backgroundColor: COLORS.fieldDivider,
  },

  // Engaged pill
  engagedPill: {
    backgroundColor: COLORS.engagedPillBg,
    borderRadius: 50,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  engagedPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.engagedPillText,
  },

  // Role rows
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.fieldDivider,
  },
  roleRowLast: {
    borderBottomWidth: 0,
  },
  roleTextBlock: {
    flex: 1,
  },
  roleName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.roleName,
    marginBottom: 2,
  },
  roleDetail: {
    fontSize: 12,
    color: COLORS.roleDetail,
  },
  roleApplyBadge: {
    backgroundColor: COLORS.roleApplyBg,
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  roleApplyText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.roleApplyText,
  },

  // Student rows
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.fieldDivider,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.avatarText,
  },
  studentTextBlock: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.studentName,
    marginBottom: 2,
  },
  studentDetail: {
    fontSize: 12,
    color: COLORS.studentDetail,
  },

  emptyText: {
    fontSize: 13,
    color: COLORS.fieldLabel,
    textAlign: 'center',
    paddingVertical: 12,
  },
});
