import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

// Screens
import UniversityInfoScreen from '../../app/UniversityOnboarding/UniversityInfoScreen';
import InstitutionDetailsScreen from '../../app/UniversityOnboarding/InstitutionDetailsScreen';
import CareerServicesSetupScreen from '../../app/UniversityOnboarding/CareerServicesSetupScreen';
import ReviewCompleteScreen from '../../app/UniversityOnboarding/ReviewCompleteScreen';

const Stack = createStackNavigator();

export default function UniversityOnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
      }}
    >
      <Stack.Screen name="UniversityInfo" component={UniversityInfoScreen} />
      <Stack.Screen name="InstitutionDetails" component={InstitutionDetailsScreen} />
      <Stack.Screen name="CareerServicesSetup" component={CareerServicesSetupScreen} />
      <Stack.Screen name="ReviewComplete" component={ReviewCompleteScreen} />
    </Stack.Navigator>
  );
}
