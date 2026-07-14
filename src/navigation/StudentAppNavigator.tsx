import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

// Screens
import StudentTabs from '../../app/StudentExperienceScreens/StudentTabs';
import ApplicationSentScreen from '../../app/StudentExperienceScreens/ApplicationSentScreen';
import InternshipDetailsScreen from '../../app/StudentExperienceScreens/InternshipDetailsScreen';
import StudentEditProfileScreen from '../../app/StudentExperienceScreens/StudentEditProfileScreen';

const Stack = createStackNavigator();

export default function StudentAppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
      }}
    >
      <Stack.Screen name="HomeDashboard" component={StudentTabs} />
      <Stack.Screen name="ApplicationSent" component={ApplicationSentScreen} />
      <Stack.Screen name="InternshipDetails" component={InternshipDetailsScreen} />
      <Stack.Screen name="StudentEditProfile" component={StudentEditProfileScreen} />
    </Stack.Navigator>
  );
}
