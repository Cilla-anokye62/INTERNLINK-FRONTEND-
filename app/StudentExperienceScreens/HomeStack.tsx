import { createStackNavigator } from '@react-navigation/stack';
import HomeDashboardScreen from './HomeDashboardScreen';
import NotificationScreen from './NotificationScreen';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeDashboard" component={HomeDashboardScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
    </Stack.Navigator>
  );
}