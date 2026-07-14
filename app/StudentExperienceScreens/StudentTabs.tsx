import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import HomeStack from './HomeStack';
import DiscoverScreen from './DiscoverScreen';
import SavedScreen from './SavedScreen';
import ApplicationTrackingScreen from './ApplicationTrackingScreen';
import StudentProfileScreen from './StudentProfileScreen';
import { useAppTheme } from '../../src/hooks/useAppTheme';

const Tab = createBottomTabNavigator();

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
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color }) => {
          const icons: Record<string, string> = {
            Home:         '⌂',
            Discover:     '🔍',
            Saved:        '🔖',
            Applications: '📋',
            Profile:      '👤',
          };
          return (
            <Text style={{ fontSize: 20, color }}>
              {icons[route.name]}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Discover"     component={DiscoverScreen} />
      <Tab.Screen name="Saved"        component={SavedScreen} />
      <Tab.Screen name="Applications" component={ApplicationTrackingScreen} />
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