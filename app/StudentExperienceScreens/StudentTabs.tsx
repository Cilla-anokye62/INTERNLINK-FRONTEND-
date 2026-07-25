import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeStack from './HomeStack';
import DiscoverScreen from './DiscoverScreen';
import SavedScreen from './SavedScreen';
import MyApplicationsScreen from './MyApplicationsScreen';
import StudentProfileScreen from './StudentProfileScreen';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import type { StudentTabParamList } from '../../types/navigation';

const Tab = createBottomTabNavigator<StudentTabParamList>();

const ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Home:         { active: 'home',      inactive: 'home-outline' },
  Discover:     { active: 'search',    inactive: 'search-outline' },
  Saved:        { active: 'bookmark',  inactive: 'bookmark-outline' },
  Applications: { active: 'clipboard', inactive: 'clipboard-outline' },
  Profile:      { active: 'person',    inactive: 'person-outline' },
};

export default function StudentTabs() {
  const { colors } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopWidth: 1,
          borderTopColor: colors.tabBarBorder,
          height: 78,
          paddingTop: 8,
          paddingBottom: 18, // accounts for the phone's home indicator area
        },
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color, size }) => {
          const iconSet = ICONS[route.name];
          return (
            <Ionicons
              name={focused ? iconSet.active : iconSet.inactive}
              size={size ?? 22}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Applications" component={MyApplicationsScreen} />
      <Tab.Screen name="Profile" component={StudentProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
