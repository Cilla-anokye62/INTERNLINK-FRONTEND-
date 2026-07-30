/**
 * UniversityTabs.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Bottom Tab Navigator for University users
 * ─────────────────────────────────────────────────────────────────
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from "../../src/hooks/useAppTheme";

import UniversityDashboardScreen from './UniversityDashboardScreen';
import StudentMonitoringScreen from './StudentMonitoringScreen';
import PlacementAnalyticsScreen from './PlacementAnalyticsScreen';
import ReportsScreen from './ReportsScreen';
import SettingsScreen from './SettingsScreen';

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

const Tab = createBottomTabNavigator();

export default function UniversityTabs() {
  const { colors } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopWidth: 1,
          borderTopColor: colors.tabBarBorder,
          height: 78,
          paddingTop: 8,
          paddingBottom: 18,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
        tabBarIcon: ({ color }) => (
          <Ionicons
            name={TAB_ICONS[route.name] as any}
            size={22}
            color={color}
          />
        ),
      })}
    >
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
