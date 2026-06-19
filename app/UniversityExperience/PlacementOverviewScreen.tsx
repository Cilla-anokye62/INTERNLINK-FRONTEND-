/**
 * PlacementOverviewScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Placement Overview (Analytics screen for university users)
 *
 * Content (from design):
 *  - Header: "Placements" title + "Spring 2026 cohort" subtitle
 *  - 2x2 grid of stat cards: Placement rate, Avg offer, Avg time-to-offer,
 *    Return offers
 *  - "By department" card: 5 horizontal progress bars showing placement
 *    rate per department, with a "Filter" link
 *  - "Monthly trend" card: placeholder chart area with month labels
 *  - Bottom tab bar: Overview, Students, Analytics, Reports, Settings
 *    (same tab bar as the Dashboard screen, with "Overview" still active
 *    since this is reached from that tab)
 *
 * HOW TO USE:
 *  1. Drop inside your screens/ or app/ folder
 *  2. Add to App.tsx:
 *     import PlacementOverviewScreen from './app/PlacementOverviewScreen';
 *     <Stack.Screen name="PlacementOverview" component={PlacementOverviewScreen} />
 *
 * NOTE ON THE MONTHLY TREND CHART:
 *  The design shows an empty chart area with month labels along the
 *  bottom. This file renders just the empty placeholder box + labels.
 *  When you're ready to plot real data, a simple line/bar chart library
 *  like 'react-native-svg' + 'react-native-chart-kit', or 'victory-native',
 *  can be dropped into the chartArea View. Ask if you'd like that wired up.
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
  headerTitle:       '#0D3B47', // "Placements"
  headerSubtitle:    '#4A7C75', // "Spring 2026 cohort"

  // Stat cards (2x2 grid)
  statCardBg:        '#FFFFFF',
  statLabel:         '#9BB8B4',
  statValue:         '#0D3B47',
  statChangePositive:'#2EC4B6', // green/teal for "+4% YoY", "+8%"

  // "By department" card
  sectionCardBg:     '#FFFFFF',
  sectionTitle:      '#0D3B47',
  filterText:        '#2EC4B6',
  deptName:          '#0D3B47',
  deptPercent:       '#0D3B47',
  barTrack:          '#E5F2F0',
  barFill:           '#2EC4B6',

  // "Monthly trend" card
  trendCardBg:       '#FFFFFF',
  trendTitle:        '#0D3B47',
  chartAreaBg:        '#FFFFFF',
  chartAreaBorder:   '#F0F6F5',
  monthLabel:        '#9BB8B4',

  // Bottom tab bar
  tabBarBg:          '#FFFFFF',
  tabActive:         '#2EC4B6',
  tabInactive:       '#9BB8B4',
};


// ─── DATA ─────────────────────────────────────────────────────────

// The four stat cards in the 2x2 grid at the top.
// Storing them in an array means adding a 5th stat later is one line.
const STAT_CARDS = [
  {
    id: 'placementRate',
    label: 'Placement rate',
    value: '87%',
    change: '+4% YoY',
  },
  {
    id: 'avgOffer',
    label: 'Avg offer',
    value: '$52/hr',
    change: '+8%',
  },
  {
    id: 'avgTimeToOffer',
    label: 'Avg time-to-offer',
    value: '18d',
    change: null, // no change indicator shown for this stat in the design
  },
  {
    id: 'returnOffers',
    label: 'Return offers',
    value: '64%',
    change: null,
  },
];

// "By department" — each row shows a department name, a percentage,
// and a horizontal progress bar whose fill width matches that percentage.
const DEPARTMENTS = [
  { id: 'cs', name: 'Computer Science', percent: 94 },
  { id: 'ee', name: 'Electrical Eng', percent: 88 },
  { id: 'me', name: 'Mechanical Eng', percent: 81 },
  { id: 'business', name: 'Business', percent: 76 },
  { id: 'design', name: 'Design', percent: 72 },
];

// Month labels shown along the bottom of the Monthly Trend chart area
const MONTH_LABELS = ['S', 'O', 'N', 'D', 'J', 'F', 'M'];

// Bottom tab bar items — same as the Dashboard screen
const TAB_ITEMS = [
  { id: 'overview', icon: '🏠', label: 'Overview' },
  { id: 'students', icon: '🎓', label: 'Students' },
  { id: 'analytics', icon: '📊', label: 'Analytics' },
  { id: 'reports', icon: '📄', label: 'Reports' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
];


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function PlacementOverviewScreen({ navigation }: any) {

  // Tracks which bottom tab is active. This screen is reached from the
  // "Overview" tab on the Dashboard, so it starts highlighted there too.
  const [activeTab, setActiveTab] = useState('overview');

  // Called when "Filter" is tapped next to "By department"
  const handleFilterPress = () => {
    console.log('Filter tapped');
    // TODO: open a filter modal/sheet, or navigate to a filter screen
  };

  // Called when a bottom tab is tapped
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

        {/* ── HEADER ───────────────────────────────────────────── */}
        <Text style={styles.headerTitle}>Placements</Text>
        <Text style={styles.headerSubtitle}>Spring 2026 cohort</Text>
        {/* ── END HEADER ──────────────────────────────────────────── */}


        {/* ── STAT CARDS GRID (2x2) ───────────────────────────────── */}
        {/*
          flexWrap: 'wrap' on statsGrid lets the 4 cards arrange into
          2 rows of 2 automatically, since each card takes ~48% width.
        */}
        <View style={styles.statsGrid}>
          {STAT_CARDS.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>

              {/* Only render the change line if one was provided */}
              {stat.change ? (
                <Text style={styles.statChange}>{stat.change}</Text>
              ) : null}
            </View>
          ))}
        </View>
        {/* ── END STAT CARDS GRID ─────────────────────────────────── */}


        {/* ── "BY DEPARTMENT" CARD ────────────────────────────────── */}
        <View style={styles.sectionCard}>

          {/* Header row: title on the left, "Filter" link on the right */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>By department</Text>
            <TouchableOpacity onPress={handleFilterPress}>
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
          </View>

          {/*
            .map() loops over DEPARTMENTS and renders one row per
            department: name + percent on top, progress bar underneath.
          */}
          {DEPARTMENTS.map((dept, index) => (
            <View
              key={dept.id}
              style={[
                styles.deptRow,
                // Remove bottom margin on the last row so spacing looks even
                index === DEPARTMENTS.length - 1 && styles.deptRowLast,
              ]}
            >
              {/* Name on the left, percentage on the right */}
              <View style={styles.deptLabelRow}>
                <Text style={styles.deptName}>{dept.name}</Text>
                <Text style={styles.deptPercent}>{dept.percent}%</Text>
              </View>

              {/* Progress bar — fill width matches dept.percent exactly */}
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${dept.percent}%` },
                  ]}
                />
              </View>
            </View>
          ))}

        </View>
        {/* ── END "BY DEPARTMENT" CARD ────────────────────────────── */}


        {/* ── "MONTHLY TREND" CARD ────────────────────────────────── */}
        <View style={styles.trendCard}>
          <Text style={styles.trendTitle}>Monthly trend</Text>

          {/*
            Placeholder chart area — currently just an empty box.
            TODO: replace this View with an actual chart component
            (e.g. react-native-chart-kit's LineChart) once you have
            monthly data to plot. The month labels below already line
            up with where a chart's x-axis would sit.
          */}
          <View style={styles.chartArea} />

          {/* Month labels along the bottom, evenly spaced */}
          <View style={styles.monthLabelsRow}>
            {MONTH_LABELS.map((month, index) => (
              // Using index in the key since month letters could repeat
              // (e.g. multiple "J"s for June/July/January)
              <Text key={`${month}-${index}`} style={styles.monthLabel}>
                {month}
              </Text>
            ))}
          </View>
        </View>
        {/* ── END "MONTHLY TREND" CARD ────────────────────────────── */}

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
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.headerTitle,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.headerSubtitle,
    marginBottom: 18,
  },

  // ── Stat cards grid ───────────────────────────────────────────
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap', // wraps the 4 cards into 2 rows of 2 automatically
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  statCard: {
    width: '48%', // two cards per row with a small gap between them
    backgroundColor: COLORS.statCardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12, // space between rows
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
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.statValue,
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.statChangePositive,
  },

  // ── Shared "card" container style (By department, Monthly trend) ──
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.sectionTitle,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.filterText,
  },

  // ── Department rows ───────────────────────────────────────────
  deptRow: {
    marginBottom: 16, // space between each department's row
  },
  deptRowLast: {
    marginBottom: 0, // no extra space after the final row
  },
  deptLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  deptName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.deptName,
  },
  deptPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.deptPercent,
  },
  barTrack: {
    width: '100%',
    height: 7,
    backgroundColor: COLORS.barTrack,
    borderRadius: 4,
    overflow: 'hidden', // keeps the fill's corners clipped to match the track
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.barFill,
    borderRadius: 4,
  },

  // ── Monthly trend card ────────────────────────────────────────
  trendCard: {
    backgroundColor: COLORS.trendCardBg,
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.trendTitle,
    marginBottom: 14,
  },
  // Empty placeholder area where a real chart will eventually go
  chartArea: {
    width: '100%',
    height: 130,
    backgroundColor: COLORS.chartAreaBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.chartAreaBorder,
    marginBottom: 10,
  },
  monthLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthLabel: {
    fontSize: 11,
    color: COLORS.monthLabel,
  },

  // ── Bottom tab bar (identical to Dashboard screen for consistency) ──
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