import { createStackNavigator } from '@react-navigation/stack';
import HomeDashboardScreen from './HomeDashboardScreen';
import StudentMessagesScreen from './StudentMessagesScreen';
import HelpSupportScreen from './HelpSupportScreen';
import CalendarScreen from './CalendarScreen';
import ReferFriendScreen from './ReferFriendScreen';
import type { StudentHomeStackParamList } from '../../types/navigation';

const Stack = createStackNavigator<StudentHomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeDashboard" component={HomeDashboardScreen} />
      <Stack.Screen name="StudentMessages" component={StudentMessagesScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="ReferFriend" component={ReferFriendScreen} />
    </Stack.Navigator>
  );
}
