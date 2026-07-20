/**
 * UniversityTabs.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Bottom Tab Navigator for University users
 *
 * WHAT THIS FILE DOES:
 *  This replaces the custom-built tab bar (the View + TouchableOpacity
 *  rows you had inside each screen file) with React Navigation's real
 *  Bottom Tab Navigator. One single component now controls which
 *  screen shows, handles the active/inactive tab highlighting, and
 *  renders the tab bar — automatically, on every screen, for free.
 *
 *  Instead of importing UniversityDashboardScreen, PlacementOverviewScreen,
 *  etc. directly into App.tsx, you now import THEM into THIS file, and
 *  App.tsx only needs to import THIS file once.
 *
 * REQUIRED PACKAGE:
 *  npx expo install @react-navigation/bottom-tabs
 *
 *  (@react-navigation/native and react-native-screens /
 *  react-native-safe-area-context should already be installed since
 *  you're using createStackNavigator elsewhere in the app.)
 * ─────────────────────────────────────────────────────────────────
 */

// ─── IMPORTS ─────────────────────────────────────────────────────
import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import every screen that should appear as a tab.
// Update these paths to match wherever you actually saved each file
// (e.g. if they're inside a "University Onboarding" or "University"
// folder, adjust the path accordingly).
import UniversityDashboardScreen from './UniversityDashboardScreen';
import StudentMonitoringScreen from './StudentMonitoringScreen';
import PlacementAnalyticsScreen from './PlacementAnalyticsScreen';
import ReportsScreen from './ReportsScreen';
import SettingsScreen from './SettingsScreen';


// ─── COLOR PALETTE ───────────────────────────────────────────────
// Same teal/mint colors used as the active/inactive tab colors
// across your custom tab bars, so the look stays identical.
const COLORS = {
  tabBarBg:      '#FFFFFF',
  tabActive:     '#2EC4B6',
  tabInactive:   '#9BB8B4',
  tabBarBorder:  '#EAF5F3',
};


// ─── TAB ICON DATA ────────────────────────────────────────────────
// Maps each route name to the Ionicons name shown above its label.
// Centralising this here means the icon-per-tab logic lives in ONE
// place instead of being copy-pasted into every screen file like before.
const TAB_ICONS: Record<string, string> = {
  Overview: 'home-outline',
  Students: 'school-outline',
  Analytics: 'analytics-outline',
  Reports: 'document-text-outline',
  Settings: 'settings-outline',
};


// Creates the navigator. Tab.Navigator and Tab.Screen below come from
// this — same pattern as Stack.Navigator / Stack.Screen you already
// use in App.tsx, just for tabs instead of stacked pages.
const Tab = createBottomTabNavigator();


// ─── MAIN TAB NAVIGATOR COMPONENT ─────────────────────────────────
export default function UniversityTabs() {
  return (
    <Tab.Navigator
      // screenOptions applies to EVERY tab screen at once, so you
      // don't have to repeat this styling 5 times.
      screenOptions={({ route }) => ({
        headerShown: false, // each screen already has its own header content

        // Colors for the active vs inactive tab label + icon
        tabBarActiveTintColor: COLORS.tabActive,
        tabBarInactiveTintColor: COLORS.tabInactive,

        // Styling for the tab bar itself — matches your custom tabBar style
        tabBarStyle: {
          backgroundColor: COLORS.tabBarBg,
          borderTopWidth: 1,
          borderTopColor: COLORS.tabBarBorder,
          height: 78,
          paddingTop: 8,
          paddingBottom: 18, // accounts for the phone's home indicator area
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },

        // This function returns the icon shown for each tab.
        // `route.name` is whatever string you passed to `name=` on the
        // <Tab.Screen> below (e.g. "Overview", "Students").
        // `color` is automatically provided by React Navigation — it's
        // already the correct active/inactive color from above, so we
        // don't need to calculate that ourselves like in the old code.
        tabBarIcon: ({ color }) => (
          <Ionicons
            name={TAB_ICONS[route.name] as any}
            size={22}
            color={color}
          />
        ),
      })}
    >
      {/*
        Each Tab.Screen below is one bottom tab. `name` is what shows
        as the label text AND what you'd use with navigation.navigate()
        if you ever need to jump to a specific tab programmatically.
      */}
      <Tab.Screen name="Overview" component={UniversityDashboardScreen} />
      <Tab.Screen name="Students" component={StudentMonitoringScreen} />
      <Tab.Screen name="Analytics" component={PlacementAnalyticsScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        initialParams={{ role: 'university' }}
      />
    </Tab.Navigator>
  );
}