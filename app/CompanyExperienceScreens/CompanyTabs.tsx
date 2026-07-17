import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import EmployerDashboardScreen from './EmployerDashboardScreen';
import ListingsScreen from './ListingsScreen';
import ApplicantPipelineScreen from './ApplicantPipelineScreen';
import CompanyProfileScreen from './CompanyProfileScreen';
import SettingsScreen from '../SettingsComponents/SettingsScreen';
import { useAppTheme } from '../../src/hooks/useAppTheme';

// ---------- Types ----------
export type CompanyTabParamList = {
  Dashboard: undefined;
  Listings: undefined;
  Applicants: undefined;
  Company: undefined;
  Settings: { role: string };
};

interface TabIconProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  focused: boolean;
  color: string;
}

const FILLED_MAP: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  'home-outline': 'home',
  'albums-outline': 'albums',
  'people-outline': 'people',
  'business-outline': 'business',
  'settings-outline': 'settings',
};

const TabIcon: React.FC<TabIconProps> = ({ icon, focused, color }) => {
  const iconName = focused ? (FILLED_MAP[icon] || icon) : icon;
  return <Ionicons name={iconName} size={24} color={color} />;
};

const Tab = createBottomTabNavigator<CompanyTabParamList>();

const CompanyTabs: React.FC = () => {
  const { colors } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopWidth: 1,
          borderTopColor: colors.tabBarBorder,
          height: 78,
          paddingTop: 8,
          paddingBottom: 18, // accounts for the phone's home indicator area
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={EmployerDashboardScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon icon="home-outline" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Listings"
        component={ListingsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon icon="albums-outline" focused={focused} color={color} />,
        }}
      />

      <Tab.Screen
        name="Applicants"
        component={ApplicantPipelineScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon icon="people-outline" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Company"
        component={CompanyProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon icon="business-outline" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        initialParams={{ role: 'employer' }}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon icon="settings-outline" focused={focused} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default CompanyTabs;
