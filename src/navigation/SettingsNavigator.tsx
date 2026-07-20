import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

// Screens
import SettingsScreen from '../../app/SettingsComponents/SettingsScreen';
import PersonalInfoScreen from '../../app/SettingsComponents/PersonalInfoScreen';
import EmailPasswordScreen from '../../app/SettingsComponents/EmailPasswordScreen';
import ConnectedAccountsScreen from '../../app/SettingsComponents/ConnectedAccountsScreen';
import NotificationSettingsScreen from '../../app/SettingsComponents/NotificationSettingsScreen';
import PrivacySettingsScreen from '../../app/SettingsComponents/PrivacySettingsScreen';
import LanguageSettingsScreen from '../../app/SettingsComponents/LanguageSettingsScreen';
import AppearanceSettingsScreen from '../../app/SettingsComponents/AppearanceSettingsScreen';
import HelpCenterScreen from '../../app/SettingsComponents/HelpCenterScreen';
import SendFeedbackScreen from '../../app/SettingsComponents/SendFeedbackScreen';
import TermsOfServiceScreen from '../../app/SettingsComponents/TermsOfServiceScreen';
import PrivacyPolicyScreen from '../../app/SettingsComponents/PrivacyPolicyScreen';
import DeleteAccountScreen from '../../app/SettingsComponents/DeleteAccountScreen';
import JobPreferencesScreen from '../../app/SettingsComponents/JobPreferencesScreen';
import DataStorageScreen from '../../app/SettingsComponents/DataStorageScreen';
import AccessibilityScreen from '../../app/SettingsComponents/AccessibilityScreen';
import CalendarSyncScreen from '../../app/SettingsComponents/CalendarSyncScreen';
import ReportProblemScreen from '../../app/SettingsComponents/ReportProblemScreen';
import AboutScreen from '../../app/SettingsComponents/AboutScreen';

const Stack = createStackNavigator();

export default function SettingsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
      }}
    >
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="EmailPassword" component={EmailPasswordScreen} />
      <Stack.Screen name="ConnectedAccounts" component={ConnectedAccountsScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
      <Stack.Screen name="LanguageSettings" component={LanguageSettingsScreen} />
      <Stack.Screen name="AppearanceSettings" component={AppearanceSettingsScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="SendFeedback" component={SendFeedbackScreen} />
      <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
      <Stack.Screen name="JobPreferences" component={JobPreferencesScreen} />
      <Stack.Screen name="DataStorage" component={DataStorageScreen} />
      <Stack.Screen name="Accessibility" component={AccessibilityScreen} />
      <Stack.Screen name="CalendarSync" component={CalendarSyncScreen} />
      <Stack.Screen name="ReportProblem" component={ReportProblemScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
}
