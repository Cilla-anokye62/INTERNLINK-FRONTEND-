import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, type LinkingOptions } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/context/ThemeContext';
import { useAppStore } from './src/store/useAppStore';
import { restoreSession } from './src/api';
import type { RootStackParamList } from './types/navigation';

import SplashScreen from './app/SplashScreen';
import WelcomeOnboardingScreen from './app/WelcomeOnboardingScreen';
import RoleSelectionScreen from './app/AuthScreens/RoleSelectionScreen';
import LoginScreen from './app/AuthScreens/LoginScreen';
import SignUpScreen from './app/AuthScreens/SignUpScreen';
import VerificationScreen from './app/AuthScreens/VerificationScreen';
import ForgotPasswordScreen from './app/AuthScreens/ForgotPasswordScreen';
import ResetPasswordScreen from './app/AuthScreens/ResetPasswordScreen';

import UniversityInfoScreen from './app/UniversityOnboarding/UniversityInfoScreen';
import InstitutionDetailsScreen from './app/UniversityOnboarding/InstitutionDetailsScreen';
import CareerServicesSetupScreen from './app/UniversityOnboarding/CareerServicesSetupScreen';
import ReviewCompleteScreen from './app/UniversityOnboarding/ReviewCompleteScreen';
import AcademicInfoScreen from './app/StudentOnboardingScreens/AcademicInfoScreen';
import SkillsScreen from './app/StudentOnboardingScreens/SkillsScreen';
import CareerInterestsScreen from './app/StudentOnboardingScreens/CareerInterestsScreen';
import PreferredLocationScreen from './app/StudentOnboardingScreens/PreferredLocationScreen';
import ProfileCompletionScreen from './app/StudentOnboardingScreens/ProfileCompletionScreen';
import CompanyInformation from './app/CompanyOnboardingScreens/CompanyInformation';
import RecruitmentPreferencesScreen from './app/CompanyOnboardingScreens/RecruitmentPreferencesScreen';
import CompanyReviewCompleteScreen from './app/CompanyOnboardingScreens/CompanyReviewCompleteScreen';
import CompanyDetailsScreen from './app/CompanyOnboardingScreens/CompanyDetailsScreen';
import CompanyProfileCompletion from './app/CompanyOnboardingScreens/CompanyProfileCompletion';

import CompanyTabs from './app/CompanyExperienceScreens/CompanyTabs';
import CompanyProfileScreen from './app/CompanyExperienceScreens/CompanyProfileScreen';
import NewInternshipDetailsScreen from './app/CompanyExperienceScreens/NewInternshipDetailsScreen';
import ApplicantProfileScreen from './app/CompanyExperienceScreens/ApplicantProfileScreen';
import InterviewScheduleScreen from './app/CompanyExperienceScreens/InterviewScheduleScreen';
import OfferSendScreen from './app/CompanyExperienceScreens/OfferSendScreen';
import PostInternshipWizard from './app/CompanyExperienceScreens/PostInternshipWizard';
import MessagesScreen from './app/CompanyExperienceScreens/MessagesScreen';
import ChatScreen from './app/CompanyExperienceScreens/ChatScreen';
import InsightsScreen from './app/CompanyExperienceScreens/InsightsScreen';
import UniversityTabs from './app/UniversityExperience/UniversityTabs';
import PlacementOverviewScreen from './app/UniversityExperience/PlacementOverviewScreen';
import CompanyEngagementScreen from './app/UniversityExperience/CompanyEngagementScreen';
import StudentDetailScreen from './app/UniversityExperience/StudentDetailScreen';
import CompanyDetailScreen from './app/UniversityExperience/CompanyDetailScreen';
import UniversityNotificationsScreen from './app/UniversityExperience/UniversityNotificationsScreen';
import UniversityEditProfileScreen from './app/UniversityExperience/EditProfileScreen';
import InternshipDetailsScreen from './app/StudentExperienceScreens/InternshipDetailsScreen';
import StudentEditProfileScreen from './app/StudentExperienceScreens/StudentEditProfileScreen';
import StudentTabs from './app/StudentExperienceScreens/StudentTabs';
import StudentChatScreen from './app/StudentExperienceScreens/StudentChatScreen';
import ApplicationReviewScreen from './app/StudentExperienceScreens/ApplicationReviewScreen';
import ResumeSelectionScreen from './app/StudentExperienceScreens/ResumeSelectionScreen';
import AdditionalInfoScreen from './app/StudentExperienceScreens/AdditionalInfoScreen';
import PortfolioLinksScreen from './app/StudentExperienceScreens/PortfolioLinksScreen';
import AvailabilityScreen from './app/StudentExperienceScreens/AvailabilityScreen';
import ReviewApplicationScreen from './app/StudentExperienceScreens/ReviewApplicationScreen';
import ApplicationSubmittedScreen from './app/StudentExperienceScreens/ApplicationSubmittedScreen';
import ApplicationDetailsScreen from './app/StudentExperienceScreens/ApplicationDetailsScreen';
import NotificationsScreen from './app/StudentExperienceScreens/NotificationsScreen';

import DiscoverEmptyScreen from './app/SystemStateScreens/DiscoverEmptyScreen';
import NoConnectionScreen from './app/SystemStateScreens/NoConnectionScreen';
import LoadingStateScreen from './app/SystemStateScreens/LoadingStateScreen';
import SearchResultsScreen from './app/SystemStateScreens/SearchResultsScreen';
import ActionSuccessfulScreen from './app/SystemStateScreens/ActionSuccessfulScreen';
import SettingsScreen from './app/SettingsComponents/SettingsScreen';
import PersonalInfoScreen from './app/SettingsComponents/PersonalInfoScreen';
import EmailPasswordScreen from './app/SettingsComponents/EmailPasswordScreen';
import ConnectedAccountsScreen from './app/SettingsComponents/ConnectedAccountsScreen';
import NotificationSettingsScreen from './app/SettingsComponents/NotificationSettingsScreen';
import PrivacySettingsScreen from './app/SettingsComponents/PrivacySettingsScreen';
import LanguageSettingsScreen from './app/SettingsComponents/LanguageSettingsScreen';
import AppearanceSettingsScreen from './app/SettingsComponents/AppearanceSettingsScreen';
import HelpCenterScreen from './app/SettingsComponents/HelpCenterScreen';
import SendFeedbackScreen from './app/SettingsComponents/SendFeedbackScreen';
import TermsOfServiceScreen from './app/SettingsComponents/TermsOfServiceScreen';
import PrivacyPolicyScreen from './app/SettingsComponents/PrivacyPolicyScreen';
import DeleteAccountScreen from './app/SettingsComponents/DeleteAccountScreen';
import JobPreferencesScreen from './app/SettingsComponents/JobPreferencesScreen';
import DataStorageScreen from './app/SettingsComponents/DataStorageScreen';
import AccessibilityScreen from './app/SettingsComponents/AccessibilityScreen';
import CalendarSyncScreen from './app/SettingsComponents/CalendarSyncScreen';
import ReportProblemScreen from './app/SettingsComponents/ReportProblemScreen';
import AboutScreen from './app/SettingsComponents/AboutScreen';
import PremiumPaywallScreen from './app/PremiumScreens/PremiumPaywallScreen';
import PaymentScreen from './app/PremiumScreens/PaymentScreen';
import PremiumConfirmationScreen from './app/PremiumScreens/PremiumConfirmationScreen';
import PremiumManageScreen from './app/PremiumScreens/PremiumManageScreen';

const Stack = createStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/'), 'internlink://'],
  config: {
    screens: {
      ResetPassword: {
        path: 'reset-password',
        parse: {
          token: (token: string) => token,
        },
      },
    },
  },
};

export default function App() {
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const sessionInitialized = useAppStore((state) => state.sessionInitialized);
  const setSessionInitialized = useAppStore((state) => state.setSessionInitialized);
  const authEntryRoute = useAppStore((state) => state.authEntryRoute);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const onboardingComplete = useAppStore((state) => state.onboardingComplete);
  const userRole = useAppStore((state) => state.userRole);

  useEffect(() => {
    if (!hasHydrated || sessionInitialized) return;

    let active = true;
    void restoreSession().finally(() => {
      if (active) setSessionInitialized(true);
    });

    return () => {
      active = false;
    };
  }, [hasHydrated, sessionInitialized, setSessionInitialized]);

  const navigatorKey = !hasHydrated || !sessionInitialized
    ? 'boot'
    : !isAuthenticated || !userRole
      ? `auth-${authEntryRoute}`
      : !onboardingComplete
        ? `onboarding-${userRole}`
        : `app-${userRole}`;

  const initialRouteName: keyof RootStackParamList = !hasHydrated || !sessionInitialized
    ? 'Splash'
    : !isAuthenticated || !userRole
      ? authEntryRoute === 'login' ? 'Login' : 'Splash'
      : !onboardingComplete
        ? userRole === 'student'
          ? 'AcademicInfo'
          : userRole === 'employer'
            ? 'CompanyInformation'
            : 'UniversityInfo'
        : userRole === 'employer'
          ? 'CompanyTabs'
          : userRole === 'university'
            ? 'UniversityTabs'
            : 'StudentApp';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <NavigationContainer key={navigatorKey} linking={linking}>
            <StatusBar style="auto" />
            <Stack.Navigator
              key={navigatorKey}
              initialRouteName={initialRouteName}
              screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
              }}
            >
              {!hasHydrated || !sessionInitialized ? (
                <Stack.Screen name="Splash" component={SplashScreen} />
              ) : !isAuthenticated || !userRole ? (
                <>
                  <Stack.Screen name="Splash" component={SplashScreen} />
                  <Stack.Screen name="WelcomeOnboarding" component={WelcomeOnboardingScreen} />
                  <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="SignUp" component={SignUpScreen} />
                  <Stack.Screen name="Verification" component={VerificationScreen} />
                  <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                  <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
                  <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
                </>
              ) : !onboardingComplete ? (
                <>
                  {userRole === 'student' && (
                    <>
                      <Stack.Screen name="AcademicInfo" component={AcademicInfoScreen} />
                      <Stack.Screen navigationKey="onboarding-skills" name="Skills" component={SkillsScreen} />
                      <Stack.Screen name="CareerInterests" component={CareerInterestsScreen} />
                      <Stack.Screen name="PreferredLocation" component={PreferredLocationScreen} />
                      <Stack.Screen name="ProfileCompletion" component={ProfileCompletionScreen} />
                    </>
                  )}
                  {userRole === 'employer' && (
                    <>
                      <Stack.Screen name="CompanyInformation" component={CompanyInformation} />
                      <Stack.Screen name="CompanyDetails" component={CompanyDetailsScreen} />
                      <Stack.Screen name="RecruitmentPreferences" component={RecruitmentPreferencesScreen} />
                      <Stack.Screen name="CompanyProfileCompletion" component={CompanyProfileCompletion} />
                      <Stack.Screen name="CompanyReviewComplete" component={CompanyReviewCompleteScreen} />
                    </>
                  )}
                  {userRole === 'university' && (
                    <>
                      <Stack.Screen name="UniversityInfo" component={UniversityInfoScreen} />
                      <Stack.Screen name="InstitutionDetails" component={InstitutionDetailsScreen} />
                      <Stack.Screen name="CareerServicesSetup" component={CareerServicesSetupScreen} />
                      <Stack.Screen name="ReviewComplete" component={ReviewCompleteScreen} />
                    </>
                  )}
                </>
              ) : (
                <>
                  {userRole === 'employer' ? (
                    <Stack.Screen name="CompanyTabs" component={CompanyTabs} />
                  ) : userRole === 'university' ? (
                    <Stack.Screen name="UniversityTabs" component={UniversityTabs} />
                  ) : (
                    <Stack.Screen name="StudentApp" component={StudentTabs} />
                  )}

                  {userRole === 'student' && (
                    <>
                      <Stack.Screen navigationKey="profile-skills" name="Skills" component={SkillsScreen} />
                      <Stack.Screen name="InternshipDetails" component={InternshipDetailsScreen} />
                      <Stack.Screen name="StudentEditProfile" component={StudentEditProfileScreen} />
                      <Stack.Screen name="ApplicationReview" component={ApplicationReviewScreen} />
                      <Stack.Screen name="ResumeSelection" component={ResumeSelectionScreen} />
                      <Stack.Screen name="AdditionalInfo" component={AdditionalInfoScreen} />
                      <Stack.Screen name="PortfolioLinks" component={PortfolioLinksScreen} />
                      <Stack.Screen name="Availability" component={AvailabilityScreen} />
                      <Stack.Screen name="ReviewApplication" component={ReviewApplicationScreen} />
                      <Stack.Screen name="ApplicationSubmitted" component={ApplicationSubmittedScreen} />
                      <Stack.Screen name="ApplicationDetails" component={ApplicationDetailsScreen} />
                      <Stack.Screen name="StudentChatScreen" component={StudentChatScreen} />
                      <Stack.Screen name="DiscoverEmpty" component={DiscoverEmptyScreen} />
                      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
                      <Stack.Screen name="Settings" component={SettingsScreen} />
                    </>
                  )}

                  {userRole === 'employer' && (
                    <>
                      <Stack.Screen name="CompanyProfile" component={CompanyProfileScreen} />
                      <Stack.Screen name="NewInternshipDetails" component={NewInternshipDetailsScreen} />
                      <Stack.Screen name="ApplicantProfile" component={ApplicantProfileScreen} />
                      <Stack.Screen name="InterviewSchedule" component={InterviewScheduleScreen} />
                      <Stack.Screen name="OfferSend" component={OfferSendScreen} />
                      <Stack.Screen name="PostInternshipWizard" component={PostInternshipWizard} />
                      <Stack.Screen name="Messages" component={MessagesScreen} />
                      <Stack.Screen name="ChatScreen" component={ChatScreen} />
                      <Stack.Screen name="Insights" component={InsightsScreen} />
                    </>
                  )}

                  {userRole === 'university' && (
                    <>
                      <Stack.Screen name="PlacementOverview" component={PlacementOverviewScreen} />
                      <Stack.Screen name="CompanyEngagement" component={CompanyEngagementScreen} />
                      <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
                      <Stack.Screen name="CompanyDetail" component={CompanyDetailScreen} />
                      <Stack.Screen name="UniversityNotifications" component={UniversityNotificationsScreen} />
                      <Stack.Screen name="UniversityEditProfile" component={UniversityEditProfileScreen} />
                    </>
                  )}

                  {userRole !== 'university' && (
                    <Stack.Screen name="Notifications" component={NotificationsScreen} />
                  )}

                  <Stack.Screen name="NoConnection" component={NoConnectionScreen} />
                  <Stack.Screen name="LoadingState" component={LoadingStateScreen} />
                  <Stack.Screen name="ActionSuccessful" component={ActionSuccessfulScreen} />
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
                  <Stack.Screen name="PremiumPaywall" component={PremiumPaywallScreen} />
                  <Stack.Screen name="Payment" component={PaymentScreen} />
                  <Stack.Screen name="PremiumConfirmation" component={PremiumConfirmationScreen} />
                  <Stack.Screen name="PremiumManage" component={PremiumManageScreen} />
                </>
              )}
              <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
