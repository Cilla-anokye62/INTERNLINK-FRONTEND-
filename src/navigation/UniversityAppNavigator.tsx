import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

// Screens
import UniversityTabs from '../../app/UniversityExperience/UniversityTabs';
import PlacementOverviewScreen from '../../app/UniversityExperience/PlacementOverviewScreen';
import CompanyEngagementScreen from '../../app/UniversityExperience/CompanyEngagementScreen';

const Stack = createStackNavigator();

export default function UniversityAppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
      }}
    >
      <Stack.Screen name="UniversityTabs" component={UniversityTabs} />
      <Stack.Screen name="PlacementOverview" component={PlacementOverviewScreen} />
      <Stack.Screen name="CompanyEngagement" component={CompanyEngagementScreen} />
    </Stack.Navigator>
  );
}
