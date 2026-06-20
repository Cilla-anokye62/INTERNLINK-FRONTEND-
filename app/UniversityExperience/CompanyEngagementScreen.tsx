/**
 * CompanyEngagementScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Company Engagement / Partners (reached from the
 * "Companies" quick-access card on the University Dashboard)
 *
 * UPDATED: the bottom tab bar has been REMOVED from this file.
 * This screen is NOT one of the 5 bottom tabs (Overview, Students,
 * Analytics, Reports, Settings) — it's a regular full-screen page
 * you navigate INTO from the Dashboard, so it shouldn't show a tab
 * bar at all. Just a back arrow now, like a normal stack screen.
 *
 * HOW TO USE:
 *  This screen is registered directly in App.tsx's main Stack
 *  Navigator (NOT inside UniversityTabs.tsx), since it sits on top
 *  of the tab bar rather than being one of the tabs itself:
 *     import CompanyEngagementScreen from './app/CompanyEngagementScreen';
 *     <Stack.Screen name="CompanyEngagement" component={CompanyEngagementScreen} />
 * ─────────────────────────────────────────────────────────────────
 */

// ─── IMPORTS ─────────────────────────────────────────────────────
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // non-deprecated version


// ─── COLOR PALETTE ───────────────────────────────────────────────
const COLORS = {
  background:        '#D9F2EE', // mint — full screen background
  backBtnBg:         '#FFFFFF', // back arrow circle background
  backArrow:         '#0D3B47',
  headerTitle:       '#0D3B47', // "Partners"
  headerSubtitle:    '#4A7C75', // "238 companies engaged"
  menuBtnBg:         '#FFFFFF', // "···" circle background
  menuBtnIcon:       '#0D3B47',

  statCardBg:        '#FFFFFF',
  statLabel:         '#9BB8B4',
  statValue:         '#0D3B47',
  statChange:        '#2EC4B6',

  rowBg:             '#FFFFFF',
  companyName:       '#0D3B47',
  companyDetail:     '#9BB8B4',
  logoText:          '#FFFFFF',

  engagedPillBg:     '#D6EEF2',
  engagedPillText:   '#1B7E94',
};


// ─── DATA ─────────────────────────────────────────────────────────
const STAT_CARDS = [
  {
    id: 'activePartners',
    label: 'Active partners',
    value: '238',
    change: '+12 this month',
  },
  {
    id: 'newRoles',
    label: 'New roles',
    value: '412',
    change: 'this quarter',
  },
];

const PARTNER_COMPANIES = [
  {
    id: 'google',
    logoLetter: 'G',
    logoColor: '#4285F4',
    name: 'Google',
    detail: '24 open roles · +8 this month',
    status: 'Engaged',
  },
  {
    id: 'meta',
    logoLetter: 'M',
    logoColor: '#1877F2',
    name: 'Meta',
    detail: '18 open roles · +5 this month',
    status: 'Engaged',
  },
  {
    id: 'stripe',
    logoLetter: 'S',
    logoColor: '#7C5CFC',
    name: 'Stripe',
    detail: '12 open roles · +3 this month',
    status: 'Engaged',
  },
  {
    id: 'openai',
    logoLetter: 'O',
    logoColor: '#1E8E5A',
    name: 'OpenAI',
    detail: '8 open roles · +4 this month',
    status: 'Engaged',
  },
  {
    id: 'airbnb',
    logoLetter: 'A',
    logoColor: '#E94B6B',
    name: 'Airbnb',
    detail: '6 open roles · +1 this month',
    status: 'Engaged',
  },
];


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function CompanyEngagementScreen({ navigation }: any) {

  // Now that this is a regular stack screen (not a tab), the back
  // arrow has a real, working destination: the Dashboard screen this
  // was navigated FROM. navigation.goBack() returns to whichever
  // screen called navigation.navigate('CompanyEngagement').
  const handleBackPress = () => {
    console.log('Back tapped');
    // TODO: navigation.goBack();
  };

  const handleMenuPress = () => {
    console.log('Menu (···) tapped');
    // TODO: open an options menu/sheet
  };

  const handleCompanyPress = (companyId: string) => {
    console.log('Opening company profile:', companyId);
    // TODO: navigation.navigate('CompanyDetail', { id: companyId });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── HEADER ROW: back arrow + title/subtitle + menu button ── */}
        <View style={styles.header}>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrowText}>‹</Text>
          </TouchableOpacity>

          <View style={styles.headerTextBlock}>
            <Text style={styles.headerTitle}>Partners</Text>
            <Text style={styles.headerSubtitle}>238 companies engaged</Text>
          </View>

          <TouchableOpacity
            style={styles.menuBtn}
            onPress={handleMenuPress}
            activeOpacity={0.7}
          >
            <Text style={styles.menuBtnText}>···</Text>
          </TouchableOpacity>

        </View>


        {/* ── STAT CARDS (side by side) ───────────────────────────── */}
        <View style={styles.statsRow}>
          {STAT_CARDS.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statChange}>{stat.change}</Text>
            </View>
          ))}
        </View>


        {/* ── PARTNER COMPANY LIST ─────────────────────────────────── */}
        {PARTNER_COMPANIES.map((company) => (
          <TouchableOpacity
            key={company.id}
            style={styles.companyRow}
            onPress={() => handleCompanyPress(company.id)}
            activeOpacity={0.85}
          >
            <View style={[
              styles.companyLogo,
              { backgroundColor: company.logoColor },
            ]}>
              <Text style={styles.logoText}>{company.logoLetter}</Text>
            </View>

            <View style={styles.companyTextBlock}>
              <Text style={styles.companyName}>{company.name}</Text>
              <Text style={styles.companyDetail}>{company.detail}</Text>
            </View>

            <View style={styles.engagedPill}>
              <Text style={styles.engagedPillText}>{company.status}</Text>
            </View>
          </TouchableOpacity>
        ))}

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

  // paddingBottom is back to a normal value (no tab bar to clear
  // space for anymore on this screen)
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
  },

  // ── Header ────────────────────────────────────────────────────
  // Now includes the back button, since this screen is reached BY
  // navigating into it (not a tab-root screen like the Dashboard)
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  backArrowText: {
    fontSize: 22,
    color: COLORS.backArrow,
    lineHeight: 26,
    marginRight: 2,
  },
  headerTextBlock: {
    flex: 1, // fills space between back button and menu button
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.headerTitle,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.headerSubtitle,
  },
  menuBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.menuBtnBg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  menuBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.menuBtnIcon,
  },

  // ── Stat cards (side by side) ─────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.statCardBg,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.statLabel,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.statValue,
    marginBottom: 4,
  },
  statChange: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.statChange,
  },

  // ── Partner company rows ──────────────────────────────────────
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.rowBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  companyLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.logoText,
  },
  companyTextBlock: {
    flex: 1,
  },
  companyName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.companyName,
    marginBottom: 2,
  },
  companyDetail: {
    fontSize: 12,
    color: COLORS.companyDetail,
  },

  engagedPill: {
    backgroundColor: COLORS.engagedPillBg,
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginLeft: 8,
  },
  engagedPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.engagedPillText,
  },

});