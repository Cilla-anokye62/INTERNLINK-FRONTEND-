import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EmployerDashboardScreen from './EmployerDashboardScreen';
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
  icon: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, focused }) => {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{icon}</Text>
  );
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
          borderTopColor: colors.tabBarBorder,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
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
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Listings"
        component={ListingsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🗂️" focused={focused} />,
        }}
      />

      <Tab.Screen
        name="Applicants"
        component={ApplicantsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="👥" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Company"
        component={CompanyProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🏢" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        initialParams={{ role: 'employer' }}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="⚙️" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default CompanyTabs;