import { createStackNavigator } from '@react-navigation/stack';
import HomeDashboardScreen from './HomeDashboardScreen';
import NotificationScreen from './NotificationScreen';
import NotificationsScreen from './NotificationsScreen';
import StudentMessagesScreen from './StudentMessagesScreen';
import StudentChatScreen from './StudentChatScreen';
import HelpSupportScreen from './HelpSupportScreen';
import CalendarScreen from './CalendarScreen';
import ReferFriendScreen from './ReferFriendScreen';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeDashboard" component={HomeDashboardScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="StudentMessages" component={StudentMessagesScreen} />
      <Stack.Screen name="StudentChatScreen" component={StudentChatScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="ReferFriend" component={ReferFriendScreen} />
    </Stack.Navigator>
  );
}