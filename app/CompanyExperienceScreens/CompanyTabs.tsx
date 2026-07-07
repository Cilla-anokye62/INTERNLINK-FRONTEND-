import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EmployerDashboardScreen from './EmployerDashboardScreen';

import CompanyProfileScreen from './CompanyProfileScreen';
import ListingsScreen from './ListingsScreen';
import ApplicantsScreen from './ApplicantsScreen';

import SettingsScreen from '../SettingsComponents/SettingsScreen';

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

const TEAL = '#2BA9A0';
const TEXT_GRAY = '#6B7280';

const CompanyTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: TEAL,
        tabBarInactiveTintColor: TEXT_GRAY,
        tabBarStyle: {
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