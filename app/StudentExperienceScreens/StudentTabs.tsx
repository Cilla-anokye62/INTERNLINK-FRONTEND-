import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import HomeStack from './HomeStack';
import DiscoverScreen from './DiscoverScreen';
import SavedScreen from './SavedScreen';
import ApplicationTrackingScreen from './ApplicationTrackingScreen';
// Placeholder screens — we'll replace these one by one



function ProfileScreen() {
  return <View style={styles.placeholder}><Text>Profile</Text></View>;
}

const Tab = createBottomTabNavigator();

export default function StudentTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#2CACAD',
        tabBarInactiveTintColor: '#94A3B8',
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
      <Tab.Screen name="Profile"      component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    height: 64,
    paddingBottom: 10,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});