/**
 * CompanyEngagementScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Company Engagement / Partners (reached from the
 * "Companies" quick-access card on the University Dashboard)
 *
 * Content (from design):
 *  - Header: "Partners" title + "238 companies engaged" subtitle
 *    + "···" menu button on the right
 *  - Two side-by-side stat cards: "Active partners" (238, +12 this month)
 *    and "New roles" (412, this quarter)
 *  - List of partner company rows, each with a colored logo circle,
 *    name, detail line (open roles · growth this month), and an
 *    "Engaged" status pill
 *  - Bottom tab bar with "Overview" highlighted as active (since this
 *    screen is reached FROM the Overview/Dashboard tab)
 *
 * HOW TO USE:
 *  1. Drop inside your screens/ or app/ folder
 *  2. Add to App.tsx:
 *     import CompanyEngagementScreen from './app/CompanyEngagementScreen';
 *     <Stack.Screen name="CompanyEngagement" component={CompanyEngagementScreen} />
 * ─────────────────────────────────────────────────────────────────
 */

// ─── IMPORTS ─────────────────────────────────────────────────────
import React, { useState } from 'react';
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
  headerTitle:       '#0D3B47', // "Partners"
  headerSubtitle:    '#4A7C75', // "238 companies engaged"
  menuBtnBg:         '#FFFFFF', // "···" circle background
  menuBtnIcon:       '#0D3B47',

  // Stat cards (Active partners / New roles)
  statCardBg:        '#FFFFFF',
  statLabel:         '#9BB8B4',
  statValue:         '#0D3B47',
  statChange:        '#2EC4B6', // "+12 this month", "this quarter"

  // Company rows
  rowBg:             '#FFFFFF',
  companyName:       '#0D3B47',
  companyDetail:     '#9BB8B4',
  logoText:          '#FFFFFF',

  // "Engaged" status pill — same teal-tinted style for every company
  // in this design (unlike the Students screen, which had multiple
  // different status colors)
  engagedPillBg:     '#D6EEF2',
  engagedPillText:   '#1B7E94',

  // Bottom tab bar
  tabBarBg:          '#FFFFFF',
  tabActive:         '#2EC4B6',
  tabInactive:       '#9BB8B4',
};


// ─── DATA ─────────────────────────────────────────────────────────

// The two stat cards at the top.
// Storing them in an array means a 3rd card later is a one-line change.
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

// The partner company list. Each company has its own logo letter +
// color, matching the distinct colored circles in the design.
// In the real app this would come from your backend.
const PARTNER_COMPANIES = [
  {
    id: 'google',
    logoLetter: 'G',
    logoColor: '#4285F4', // Google blue
    name: 'Google',
    detail: '24 open roles · +8 this month',
    status: 'Engaged',
  },
  {
    id: 'meta',
    logoLetter: 'M',
    logoColor: '#1877F2', // Meta blue
    name: 'Meta',
    detail: '18 open roles · +5 this month',
    status: 'Engaged',
  },
  {
    id: 'stripe',
    logoLetter: 'S',
    logoColor: '#7C5CFC', // Stripe-ish purple
    name: 'Stripe',
    detail: '12 open roles · +3 this month',
    status: 'Engaged',
  },
  {
    id: 'openai',
    logoLetter: 'O',
    logoColor: '#1E8E5A', // green
    name: 'OpenAI',
    detail: '8 open roles · +4 this month',
    status: 'Engaged',
  },
  {
    id: 'airbnb',
    logoLetter: 'A',
    logoColor: '#E94B6B', // pink/red
    name: 'Airbnb',
    detail: '6 open roles · +1 this month',
    status: 'Engaged',
  },
];

// Bottom tab bar items — same set used across all university screens.
// "overview" stays highlighted since this screen is reached from there.
const TAB_ITEMS = [
  { id: 'overview', icon: '🏠', label: 'Overview' },
  { id: 'students', icon: '🎓', label: 'Students' },
  { id: 'analytics', icon: '📊', label: 'Analytics' },
  { id: 'reports', icon: '📄', label: 'Reports' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
];


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function CompanyEngagementScreen({ navigation }: any) {

  // This screen is reached from the Overview tab, so it starts active there
  const [activeTab, setActiveTab] = useState('overview');

  const handleMenuPress = () => {
    console.log('Menu (···) tapped');
    // TODO: open an options menu/sheet
  };

  const handleCompanyPress = (companyId: string) => {
    console.log('Opening company profile:', companyId);
    // TODO: navigation.navigate('CompanyDetail', { id: companyId });
  };

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    console.log('Switched to tab:', tabId);
    // TODO: navigation.navigate(...) to the matching screen
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Main scrollable content sits above the fixed bottom tab bar */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── HEADER ROW: title/subtitle + menu button ────────────── */}
        <View style={styles.header}>
          <View style={styles.headerTextBlock}>
            <Text style={styles.headerTitle}>Partners</Text>
            <Text style={styles.headerSubtitle}>238 companies engaged</Text>
          </View>

          <TouchableOpacity
            style={styles.menuBtn}
            onPress={handleMenuPress}
            activeOpacity={0.7}
          >
            {/* TODO: swap for <Ionicons name="ellipsis-horizontal" size={18} /> */}
            <Text style={styles.menuBtnText}>···</Text>
          </TouchableOpacity>
        </View>
        {/* ── END HEADER ──────────────────────────────────────────── */}


        {/* ── STAT CARDS (side by side) ───────────────────────────── */}
        <View style={styles.statsRow}>
          {/*
            .map() loops over STAT_CARDS so both cards come from one
            block of JSX instead of being written out twice by hand.
          */}
          {STAT_CARDS.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statChange}>{stat.change}</Text>
            </View>
          ))}
        </View>
        {/* ── END STAT CARDS ──────────────────────────────────────── */}


        {/* ── PARTNER COMPANY LIST ─────────────────────────────────── */}
        {/*
          .map() loops over PARTNER_COMPANIES and renders one row per
          company: colored logo circle | name + detail | "Engaged" pill
        */}
        {PARTNER_COMPANIES.map((company) => (
          <TouchableOpacity
            key={company.id}
            style={styles.companyRow}
            onPress={() => handleCompanyPress(company.id)}
            activeOpacity={0.85}
          >

            {/* Left: logo circle — background color is unique per company */}
            <View style={[
              styles.companyLogo,
              { backgroundColor: company.logoColor },
            ]}>
              <Text style={styles.logoText}>{company.logoLetter}</Text>
            </View>

            {/* Middle: name + detail line, fills remaining space */}
            <View style={styles.companyTextBlock}>
              <Text style={styles.companyName}>{company.name}</Text>
              <Text style={styles.companyDetail}>{company.detail}</Text>
            </View>

            {/* Right: "Engaged" status pill */}
            <View style={styles.engagedPill}>
              <Text style={styles.engagedPillText}>{company.status}</Text>
            </View>

          </TouchableOpacity>
        ))}
        {/* ── END PARTNER COMPANY LIST ─────────────────────────────── */}

      </ScrollView>


      {/* ── BOTTOM TAB BAR ─────────────────────────────────────────
          Sits outside the ScrollView so it stays fixed at the bottom
          while the content above scrolls underneath it.
      */}
      <View style={styles.tabBar}>
        {TAB_ITEMS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabItem}
              onPress={() => handleTabPress(tab.id)}
              activeOpacity={0.7}
            >
              {/* TODO: swap emoji for matching <Ionicons /> per tab */}
              <Text style={[
                styles.tabIcon,
                { color: isActive ? COLORS.tabActive : COLORS.tabInactive },
              ]}>
                {tab.icon}
              </Text>
              <Text style={[
                styles.tabLabel,
                { color: isActive ? COLORS.tabActive : COLORS.tabInactive },
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {/* ── END BOTTOM TAB BAR ──────────────────────────────────────── */}

    </SafeAreaView>
  );
}


// ─── STYLES ──────────────────────────────────────────────────────
const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Scrollable content — leaves room at the bottom so the tab bar
  // doesn't cover the last items
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 100, // extra space so content isn't hidden behind tab bar
  },

  // ── Header ────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTextBlock: {
    flex: 1, // fills space to the left of the menu button
  },
  headerTitle: {
    fontSize: 22,
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
    width: '48%', // two cards side by side with a small gap between them
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
    marginBottom: 12, // space between each company's row
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
    flex: 1, // fills space between logo and "Engaged" pill
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

  // ── "Engaged" status pill ─────────────────────────────────────
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

  // ── Bottom tab bar (identical to other university screens) ────────
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.tabBarBg,
    paddingTop: 10,
    paddingBottom: 18, // extra padding accounts for the phone's home indicator area
    borderTopWidth: 1,
    borderTopColor: '#EAF5F3',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  tabItem: {
    flex: 1, // each of the 5 tabs takes equal width
    alignItems: 'center',
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },

});