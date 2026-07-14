import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

// Screens
import DiscoverEmptyScreen from '../../app/SystemStateScreens/DiscoverEmptyScreen';
import NoConnectionScreen from '../../app/SystemStateScreens/NoConnectionScreen';
import LoadingStateScreen from '../../app/SystemStateScreens/LoadingStateScreen';
import SearchResultsScreen from '../../app/SystemStateScreens/SearchResultsScreen';
import ActionSuccessfulScreen from '../../app/SystemStateScreens/ActionSuccessfulScreen';

const Stack = createStackNavigator();

export default function SystemStateNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
      }}
    >
      <Stack.Screen name="DiscoverEmpty" component={DiscoverEmptyScreen} />
      <Stack.Screen name="NoConnection" component={NoConnectionScreen} />
      <Stack.Screen name="LoadingState" component={LoadingStateScreen} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
      <Stack.Screen name="ActionSuccessful" component={ActionSuccessfulScreen} />
    </Stack.Navigator>
  );
}
