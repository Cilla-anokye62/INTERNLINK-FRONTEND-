import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import HomeDashboardScreen from './HomeDashboardScreen';
import DiscoverScreen from './DiscoverScreen';
// Placeholder screens — we'll replace these one by one

function SavedScreen() {
  return <View style={styles.placeholder}><Text>Saved</Text></View>;
}
function ApplicationsScreen() {
  return <View style={styles.placeholder}><Text>Applications</Text></View>;
}
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
      <Tab.Screen name="Home"         component={HomeDashboardScreen} />  {/* ← replaced */}
      <Tab.Screen name="Discover"     component={DiscoverScreen} />
      <Tab.Screen name="Saved"        component={SavedScreen} />
      <Tab.Screen name="Applications" component={ApplicationsScreen} />
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