/**
 * UniversityDashboardScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — University Dashboard (home screen for university users)
 *
 * Content (from design):
 *  - Header: avatar, university name + cohort label, notification bell
 *  - Placement Rate card (dark teal gradient): big % + YoY change,
 *    progress bar, and 3 stat columns (Placed / Active / Seeking)
 *  - 2x2 grid of quick-access cards: Students, Companies, Analytics, Reports
 *  - "Top placements" list with "View all" link — company rows with logo,
 *    name, student count, and an arrow icon
 *  - Bottom tab bar: Overview, Students, Analytics, Reports, Settings
 *
 * HOW TO USE:
 *  1. Drop inside your screens/ or app/ folder
 *  2. Add to App.tsx:
 *     import UniversityDashboardScreen from './app/UniversityDashboardScreen';
 *     <Stack.Screen name="UniversityDashboard" component={UniversityDashboardScreen} />
 *
 * NOTE ON THE BOTTOM TAB BAR:
 *  This file includes a simple custom tab bar built with View/TouchableOpacity
 *  so the screen looks complete on its own. In a real app you'd normally
 *  use React Navigation's Bottom Tab Navigator instead — ask if you want
 *  that version once this screen is wired into your navigator.
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
import { SafeAreaView } from 'react-native-safe-area-context'; // updated, non-deprecated version
import { LinearGradient } from 'expo-linear-gradient'; // used for the teal gradient card
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from "../../src/hooks/useAppTheme";

// ─── DATA ─────────────────────────────────────────────────────────

// Stat columns inside the Placement Rate card (Placed / Active / Seeking)
const PLACEMENT_STATS = [
  { id: 'placed', label: 'Placed', value: '1,248' },
  { id: 'active', label: 'Active', value: '186' },
  { id: 'seeking', label: 'Seeking', value: '42' },
];

// The 2x2 grid of quick-access cards.
// Storing them in an array means adding a 5th card is a one-line change
// (the grid layout below already wraps automatically).
const QUICK_ACCESS_CARDS = [
  { id: 'students', icon: 'school-outline', title: 'Students', subtitle: '1,476 total' },
  { id: 'companies', icon: 'business-outline', title: 'Companies', subtitle: '238 partners' },
  { id: 'analytics', icon: 'analytics-outline', title: 'Analytics', subtitle: 'View trends' },
  { id: 'reports', icon: 'document-text-outline', title: 'Reports', subtitle: 'Generate' },
];

// Top placements list — each row shows a company logo letter, name,
// number of students placed, and a colour for the logo circle.
const TOP_PLACEMENTS = [
  {
    id: 'google',
    logoLetter: 'G',
    logoColor: '#4285F4', // Google blue
    name: 'Google',
    detail: '48 students placed',
  },
  {
    id: 'meta',
    logoLetter: 'M',
    logoColor: '#1877F2', // Meta blue
    name: 'Meta',
    detail: '32 students placed',
  },
];

// Bottom tab bar items


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function UniversityDashboardScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);


  // Placeholder data for the placement rate card.
  // Later this will likely come from your backend/API.
  const placementRate = {
    percent: 87,
    yoyChange: '+4% YoY',
  };

  // Called when a quick-access grid card is tapped
  const handleCardPress = (cardId: string) => {
    switch (cardId) {
      case 'students':
        navigation.navigate('Students');
        break;
      case 'companies':
        navigation.navigate('CompanyEngagement');
        break;
      case 'analytics':
        navigation.navigate('Analytics');
        break;
      case 'reports':
        navigation.navigate('Reports');
        break;
      default:
        break;
    }
  };

  // Called when a company row in "Top placements" is tapped
  const handlePlacementPress = (companyId: string) => {
    navigation.navigate('CompanyDetail', { companyId });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Main scrollable content sits above the fixed bottom tab bar */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── HEADER ROW: avatar + name/subtitle + bell ──────────── */}
        <View style={styles.header}>

          {/* Left: avatar circle with university initial */}
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>M</Text>
          </View>

          {/* Middle: university name + cohort label, fills remaining space */}
          <View style={styles.headerTextBlock}>
            <Text style={styles.headerTitle}>MIT Career Hub</Text>
            <Text style={styles.headerSubtitle}>Class of 2026 · Spring</Text>
          </View>

          {/* Right: notification bell button */}
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => navigation.navigate('UniversityNotifications')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="notifications-outline"
              size={20}
              color={colors.bellIcon}
            />
          </TouchableOpacity>

        </View>
        {/* ── END HEADER ──────────────────────────────────────────── */}


        {/* ── PLACEMENT RATE CARD (gradient) ──────────────────────── */}
        {/* LinearGradient creates the dark-to-light teal background */}
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.placementCard}
        >

          {/* Top: label + big percentage + YoY change */}
          <Text style={styles.placementLabel}>Placement rate</Text>
          <View style={styles.placementPercentRow}>
            <Text style={styles.placementPercent}>{placementRate.percent}%</Text>
            <Text style={styles.placementYoY}>{placementRate.yoyChange}</Text>
          </View>

          {/* Progress bar showing the percentage visually */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${placementRate.percent}%` },
              ]}
            />
          </View>

          {/* Bottom: 3 stat columns (Placed / Active / Seeking) */}
          <View style={styles.statsRow}>
            {/*
              .map() loops over PLACEMENT_STATS and renders one column
              per stat, with a thin vertical divider between columns
              (except after the last one).
            */}
            {PLACEMENT_STATS.map((stat, index) => (
              <React.Fragment key={stat.id}>
                <View style={styles.statColumn}>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  <Text style={styles.statValue}>{stat.value}</Text>
                </View>

                {/* Divider line between columns, skipped after the last one */}
                {index < PLACEMENT_STATS.length - 1 && (
                  <View style={styles.statDivider} />
                )}
              </React.Fragment>
            ))}
          </View>

        </LinearGradient>
        {/* ── END PLACEMENT RATE CARD ─────────────────────────────── */}


        {/* ── QUICK ACCESS GRID (2x2) ─────────────────────────────── */}
        {/*
          flexWrap: 'wrap' on gridContainer lets the 4 cards arrange
          into 2 rows of 2 automatically, since each card takes ~48% width.
        */}
        <View style={styles.gridContainer}>
          {QUICK_ACCESS_CARDS.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.gridCard}
              onPress={() => handleCardPress(card.id)}
              activeOpacity={0.85}
            >
              {/* Icon circle */}
              <View style={styles.gridIconCircle}>
                <Ionicons
                  name={card.icon as any}
                  size={18}
                  color={colors.gridIcon}
                />
              </View>

              <Text style={styles.gridTitle}>{card.title}</Text>
              <Text style={styles.gridSubtitle}>{card.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* ── END QUICK ACCESS GRID ───────────────────────────────── */}


        {/* ── TOP PLACEMENTS SECTION ──────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top placements</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CompanyEngagement')}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        {/*
          .map() loops over TOP_PLACEMENTS and renders one row per company.
          Each row: colored logo circle | name + detail | arrow icon
        */}
        {TOP_PLACEMENTS.map((company) => (
          <TouchableOpacity
            key={company.id}
            style={styles.placementRow}
            onPress={() => handlePlacementPress(company.id)}
            activeOpacity={0.85}
          >
            {/* Logo circle — background color is unique per company */}
            <View style={[
              styles.companyLogo,
              { backgroundColor: company.logoColor },
            ]}>
              <Text style={styles.companyLogoText}>{company.logoLetter}</Text>
            </View>

            {/* Name + detail, fills remaining space */}
            <View style={styles.companyTextBlock}>
              <Text style={styles.companyName}>{company.name}</Text>
              <Text style={styles.companyDetail}>{company.detail}</Text>
            </View>

            {/* Arrow icon on the right */}
            <Ionicons
              name="arrow-forward-outline"
              size={18}
              color={colors.arrowIcon}
            />
          </TouchableOpacity>
        ))}
        {/* ── END TOP PLACEMENTS ──────────────────────────────────── */}

      </ScrollView>


      {/* ── BOTTOM TAB BAR ─────────────────────────────────────────
          Sits outside the ScrollView so it stays fixed at the bottom
          of the screen while the content above scrolls underneath it.
      */}

    </SafeAreaView>
  );
}


// ─── STYLES ──────────────────────────────────────────────────────
const createStyles = (colors: any) => StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
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
    alignItems: 'center',
    marginBottom: 20,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.headerAvatarBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.headerAvatarText,
  },
  headerTextBlock: {
    flex: 1, // fills the space between avatar and bell
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.headerTitle,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.headerSubtitle,
    marginTop: 2,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bellBg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  // ── Placement rate card (gradient) ───────────────────────────
  placementCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  placementLabel: {
    fontSize: 13,
    color: colors.placementLabel,
    marginBottom: 6,
  },
  placementPercentRow: {
    flexDirection: 'row',
    alignItems: 'baseline', // aligns the % and the smaller YoY text neatly
    marginBottom: 14,
  },
  placementPercent: {
    fontSize: 38,
    fontWeight: '800',
    color: colors.placementPercent,
    marginRight: 8,
  },
  placementYoY: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.placementYoY,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: colors.progressTrack,
    borderRadius: 3,
    marginBottom: 18,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.progressFill,
    borderRadius: 3,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statColumn: {
    flex: 1, // each of the 3 columns takes equal width
  },
  statLabel: {
    fontSize: 11,
    color: colors.statLabel,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.statValue,
  },
  // Thin vertical line between stat columns
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.statDivider,
    marginHorizontal: 12,
  },

  // ── Quick access grid ─────────────────────────────────────────
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // wraps cards into rows of 2 automatically
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  gridCard: {
    width: '48%', // two cards per row with a small gap between them
    backgroundColor: colors.gridCardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12, // space between rows
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  gridIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.gridIconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gridTitle,
    marginBottom: 2,
  },
  gridSubtitle: {
    fontSize: 12,
    color: colors.gridSubtitle,
  },

  // ── Top placements section ──────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.sectionTitle,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.viewAllText,
  },
  placementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.placementRowBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.placementRowBorder,
    padding: 14,
    marginBottom: 10,
  },
  companyLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  companyLogoText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.companyLogoText,
  },
  companyTextBlock: {
    flex: 1, // fills space between logo and arrow
  },
  companyName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.companyName,
    marginBottom: 2,
  },
  companyDetail: {
    fontSize: 12,
    color: colors.companyDetail,
  },

});