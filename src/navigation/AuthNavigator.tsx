import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

// Screens
import SplashScreen from '../../app/SplashScreen';
import WelcomeOnboardingScreen from '../../app/WelcomeOnboardingScreen';
import RoleSelectionScreen from '../../app/AuthScreens/RoleSelectionScreen';
import LoginScreen from '../../app/AuthScreens/LoginScreen';
import SignUpScreen from '../../app/AuthScreens/SignUpScreen';
import VerificationScreen from '../../app/AuthScreens/VerificationScreen';
import ForgotPasswordScreen from '../../app/AuthScreens/ForgotPasswordScreen';
import type { RootStackParamList } from '../../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
      }}
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="WelcomeOnboarding" component={WelcomeOnboardingScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Verification" component={VerificationScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
