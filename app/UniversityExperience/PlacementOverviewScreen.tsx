/**
 * PlacementOverviewScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Placement Overview (Analytics-related detail screen,
 * reached from somewhere in the university flow — e.g. a "View
 * details" link on the Analytics tab, or the Dashboard)
 *
 * UPDATED: the bottom tab bar has been REMOVED from this file.
 * This screen is NOT one of the 5 bottom tabs — it's a regular
 * full-screen page you navigate INTO, so it now just shows a back
 * arrow instead of a tab bar.
 *
 * HOW TO USE:
 *  This screen is registered directly in App.tsx's main Stack
 *  Navigator (NOT inside UniversityTabs.tsx):
 *     import PlacementOverviewScreen from './app/PlacementOverviewScreen';
 *     <Stack.Screen name="PlacementOverview" component={PlacementOverviewScreen} />
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
  backBtnBg:         '#FFFFFF',
  backArrow:         '#0D3B47',
  headerTitle:       '#0D3B47', // "Placements"
  headerSubtitle:    '#4A7C75', // "Spring 2026 cohort"

  statCardBg:        '#FFFFFF',
  statLabel:         '#9BB8B4',
  statValue:         '#0D3B47',
  statChangePositive:'#2EC4B6',

  sectionCardBg:     '#FFFFFF',
  sectionTitle:      '#0D3B47',
  filterText:        '#2EC4B6',
  deptName:          '#0D3B47',
  deptPercent:       '#0D3B47',
  barTrack:          '#E5F2F0',
  barFill:           '#2EC4B6',

  trendCardBg:       '#FFFFFF',
  trendTitle:        '#0D3B47',
  chartAreaBg:        '#FFFFFF',
  chartAreaBorder:   '#F0F6F5',
  monthLabel:        '#9BB8B4',
};


// ─── DATA ─────────────────────────────────────────────────────────
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
    change: null,
  },
  {
    id: 'returnOffers',
    label: 'Return offers',
    value: '64%',
    change: null,
  },
];

const DEPARTMENTS = [
  { id: 'cs', name: 'Computer Science', percent: 94 },
  { id: 'ee', name: 'Electrical Eng', percent: 88 },
  { id: 'me', name: 'Mechanical Eng', percent: 81 },
  { id: 'business', name: 'Business', percent: 76 },
  { id: 'design', name: 'Design', percent: 72 },
];

const MONTH_LABELS = ['S', 'O', 'N', 'D', 'J', 'F', 'M'];


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function PlacementOverviewScreen({ navigation }: any) {

  const handleBackPress = () => {
    console.log('Back tapped');
    // TODO: navigation.goBack();
  };

  const handleFilterPress = () => {
    console.log('Filter tapped');
    // TODO: open a filter modal/sheet
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── HEADER ROW: back arrow + title/subtitle ─────────────── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrowText}>‹</Text>
          </TouchableOpacity>

          <View style={styles.headerTextBlock}>
            <Text style={styles.headerTitle}>Placements</Text>
            <Text style={styles.headerSubtitle}>Spring 2026 cohort</Text>
          </View>
        </View>


        {/* ── STAT CARDS GRID (2x2) ───────────────────────────────── */}
        <View style={styles.statsGrid}>
          {STAT_CARDS.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              {stat.change ? (
                <Text style={styles.statChange}>{stat.change}</Text>
              ) : null}
            </View>
          ))}
        </View>


        {/* ── "BY DEPARTMENT" CARD ────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>By department</Text>
            <TouchableOpacity onPress={handleFilterPress}>
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
          </View>

          {DEPARTMENTS.map((dept, index) => (
            <View
              key={dept.id}
              style={[
                styles.deptRow,
                index === DEPARTMENTS.length - 1 && styles.deptRowLast,
              ]}
            >
              <View style={styles.deptLabelRow}>
                <Text style={styles.deptName}>{dept.name}</Text>
                <Text style={styles.deptPercent}>{dept.percent}%</Text>
              </View>

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


        {/* ── "MONTHLY TREND" CARD ────────────────────────────────── */}
        <View style={styles.trendCard}>
          <Text style={styles.trendTitle}>Monthly trend</Text>

          <View style={styles.chartArea} />

          <View style={styles.monthLabelsRow}>
            {MONTH_LABELS.map((month, index) => (
              <Text key={`${month}-${index}`} style={styles.monthLabel}>
                {month}
              </Text>
            ))}
          </View>
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

  // paddingBottom is back to a normal value (no tab bar to clear
  // space for anymore on this screen)
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
  },

  // ── Header ────────────────────────────────────────────────────
  // Now includes the back button, since this screen is reached BY
  // navigating into it (not a tab-root screen)
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
  backArrowText: {
    fontSize: 22,
    color: COLORS.backArrow,
    lineHeight: 26,
    marginRight: 2,
  },
  headerTextBlock: {
    flex: 1,
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

  // ── Stat cards grid ───────────────────────────────────────────
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.statCardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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

  // ── Shared "card" container style ──────────────────────────────
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

  deptRow: {
    marginBottom: 16,
  },
  deptRowLast: {
    marginBottom: 0,
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
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.barFill,
    borderRadius: 4,
  },

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

});