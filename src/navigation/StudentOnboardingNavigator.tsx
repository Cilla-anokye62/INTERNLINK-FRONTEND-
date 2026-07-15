import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

// Screens
import AcademicInfoScreen from '../../app/StudentOnboardingScreens/AcademicInfoScreen';
import SkillsScreen from '../../app/StudentOnboardingScreens/SkillsScreen';
import CareerInterestsScreen from '../../app/StudentOnboardingScreens/CareerInterestsScreen';
import PreferredLocationScreen from '../../app/StudentOnboardingScreens/PreferredLocationScreen';
import ProfileCompletionScreen from '../../app/StudentOnboardingScreens/ProfileCompletionScreen';

const Stack = createStackNavigator();

export default function StudentOnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
      }}
    >
      <Stack.Screen name="AcademicInfo" component={AcademicInfoScreen} />
      <Stack.Screen name="Skills" component={SkillsScreen} />
      <Stack.Screen name="CareerInterests" component={CareerInterestsScreen} />
      <Stack.Screen name="PreferredLocation" component={PreferredLocationScreen} />
      <Stack.Screen name="ProfileCompletion" component={ProfileCompletionScreen} />
    </Stack.Navigator>
  );
}
