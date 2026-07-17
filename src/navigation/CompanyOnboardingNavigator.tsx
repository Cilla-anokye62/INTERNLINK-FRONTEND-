import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

// Screens
import CompanyInformation from '../../app/CompanyOnboardingScreens/CompanyInformation';
import CompanyDetailsScreen from '../../app/CompanyOnboardingScreens/CompanyDetailsScreen';
import RecruitmentPreferencesScreen from '../../app/CompanyOnboardingScreens/RecruitmentPreferencesScreen';
import CompanyReviewCompleteScreen from '../../app/CompanyOnboardingScreens/CompanyReviewCompleteScreen';

const Stack = createStackNavigator();

export default function CompanyOnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
      }}
    >
      <Stack.Screen name="CompanyInformation" component={CompanyInformation} />
      <Stack.Screen name="CompanyDetails" component={CompanyDetailsScreen} />
      <Stack.Screen name="RecruitmentPreferences" component={RecruitmentPreferencesScreen} />
      <Stack.Screen name="CompanyReviewComplete" component={CompanyReviewCompleteScreen} />
    </Stack.Navigator>
  );
}
