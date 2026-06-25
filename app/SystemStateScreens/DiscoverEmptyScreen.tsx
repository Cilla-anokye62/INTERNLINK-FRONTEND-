/**
 * DiscoverEmptyScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Student "Discover" tab, empty/no-results state
 * ("Nothing here yet")
 *
 * UPDATED: the bottom tab bar has been REMOVED from this file.
 * It's now handled once, automatically, by StudentTabs.tsx using
 * React Navigation's Bottom Tab Navigator. This screen is rendered
 * AS the "Discover" tab, so it no longer builds its own tab bar UI.
 *
 * Content (from design):
 *  - Top header bar (light grey/white): user avatar (left), "InternLink"
 *    app name (center), notification bell (right)
 *  - Mint background below the header
 *  - Centered illustration: white square card with a box+magnifying-
 *    glass graphic — represents "searched, found nothing"
 *  - Headline: "Nothing here yet"
 *  - Subtext: suggests adjusting filters/search terms
 *  - "Browse All" button (filled dark teal, with a refresh icon)
 *
 * HOW TO USE:
 *  This screen is registered inside StudentTabs.tsx as the
 *  "Discover" tab's component:
 *     import DiscoverEmptyScreen from './DiscoverEmptyScreen';
 *     <Tab.Screen name="Discover" component={DiscoverEmptyScreen} />
 *
 *  NOTE: your current StudentTabs.tsx already imports a separate
 *  DiscoverScreen for this tab. This file (DiscoverEmptyScreen)
 *  represents the EMPTY STATE that DiscoverScreen should show when
 *  there are no search results — it's not meant to replace
 *  DiscoverScreen's "Tab.Screen" entry directly. Two common ways to
 *  wire this up:
 *    1. Inside DiscoverScreen.tsx, conditionally render this empty
 *       state's JSX when the results array is empty, e.g.:
 *         {results.length === 0 ? <EmptyStateContent /> : <ResultsList />}
 *    2. Or keep this as its own screen and navigate to it manually
 *       when a search returns zero results.
 *  Ask if you'd like help wiring option 1 directly into your real
 *  DiscoverScreen.tsx once you share that file.
 * ─────────────────────────────────────────────────────────────────
 */

// ─── IMPORTS ─────────────────────────────────────────────────────
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // non-deprecated version


// ─── COLOR PALETTE ───────────────────────────────────────────────
const COLORS = {
  headerBg:          '#F7F8FA',
  headerTitle:       '#0F6E64', // "InternLink" teal text
  bellIcon:          '#1A1A2E',

  background:        '#F5FBFA', // mint body background

  illustrationCardBg:'#FFFFFF',

  headline:          '#1A1A2E',
  subtext:           '#5C6B6A',

  browseBtnBg:       '#0F6E64',
  browseBtnText:     '#FFFFFF',
};


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function DiscoverEmptyScreen({ navigation }: any) {

  // Placeholder avatar — in the real app this would be the logged-in
  // student's profile photo URL
  const userAvatarUrl = 'https://via.placeholder.com/100';

  const handleNotificationsPress = () => {
    console.log('Notifications tapped');
    // TODO: navigation.navigate('Notifications'); — this would be a
    // screen OUTSIDE the tab navigator, reached via the parent Stack
  };

  const handleBrowseAll = () => {
    console.log('Browse All tapped');
    // TODO: clear any active filters/search and reload the full
    // internship list, e.g.: setFilters({}); refetchInternships();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.headerBg} />

      {/* ── TOP HEADER BAR ───────────────────────────────────────── */}
      <View style={styles.header}>

        <TouchableOpacity onPress={() => console.log('Avatar tapped')}>
          <Image
            source={{ uri: userAvatarUrl }}
            style={styles.avatar}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>InternLink</Text>

        <TouchableOpacity onPress={handleNotificationsPress}>
          {/* TODO: swap for <Ionicons name="notifications-outline" size={22} /> */}
          <Text style={styles.bellIconText}>🔔</Text>
        </TouchableOpacity>

      </View>
      {/* ── END HEADER ──────────────────────────────────────────── */}


      {/* ── MINT BODY: centered empty-state content ─────────────── */}
      <View style={styles.body}>

        <View style={styles.illustrationCard}>
          {/*
            TODO: replace this emoji combo with an actual illustration
            image, e.g.:
            <Image source={require('../assets/empty-search-box.png')} style={styles.illustrationImage} />
          */}
          <Text style={styles.illustrationEmoji}>📦🔍</Text>
        </View>

        <Text style={styles.headline}>Nothing here yet</Text>

        <Text style={styles.subtext}>
          Try adjusting your filters or search terms to find what you're looking for.
        </Text>

        <TouchableOpacity
          style={styles.browseBtn}
          onPress={handleBrowseAll}
          activeOpacity={0.85}
        >
          {/* TODO: swap for <Ionicons name="refresh" size={16} color="#FFFFFF" /> */}
          <Text style={styles.browseBtnIcon}>↻</Text>
          <Text style={styles.browseBtnText}>Browse All</Text>
        </TouchableOpacity>

      </View>
      {/* ── END BODY ─────────────────────────────────────────────── */}

      {/*
        No tab bar here anymore — StudentTabs.tsx renders it
        automatically since this screen IS the "Discover" tab.
      */}

    </SafeAreaView>
  );
}


// ─── STYLES ──────────────────────────────────────────────────────
const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.headerBg,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.headerBg,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.headerTitle,
  },
  bellIconText: {
    fontSize: 20,
  },

  body: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  illustrationCard: {
    width: 180,
    height: 180,
    backgroundColor: COLORS.illustrationCardBg,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  illustrationEmoji: {
    fontSize: 48,
  },

  headline: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.headline,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtext: {
    fontSize: 14,
    color: COLORS.subtext,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },

  browseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.browseBtnBg,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  browseBtnIcon: {
    fontSize: 15,
    color: COLORS.browseBtnText,
    marginRight: 8,
    fontWeight: '700',
  },
  browseBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.browseBtnText,
  },

});