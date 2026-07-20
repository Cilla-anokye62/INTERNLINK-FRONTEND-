import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { ThemeProvider } from './src/context/ThemeContext';


// First screens
import SplashScreen from './app/SplashScreen';
import WelcomeOnboardingScreen from './app/WelcomeOnboardingScreen';

//Auth screens
import RoleSelectionScreen from './app/AuthScreens/RoleSelectionScreen';
import LoginScreen from './app/AuthScreens/LoginScreen';
import SignUpScreen from './app/AuthScreens/SignUpScreen';
import VerificationScreen from './app/AuthScreens/VerificationScreen';
import ForgotPasswordScreen from './app/AuthScreens/ForgotPasswordScreen';

import OnboardingRouter from './app/OnboardingRouter';

//University onboarding screens
import UniversityInfoScreen from './app/UniversityOnboarding/UniversityInfoScreen';
import InstitutionDetailsScreen from './app/UniversityOnboarding/InstitutionDetailsScreen';
import CareerServicesSetupScreen from './app/UniversityOnboarding/CareerServicesSetupScreen';
import ReviewCompleteScreen from './app/UniversityOnboarding/ReviewCompleteScreen';

//Student onboarding screens
import AcademicInfoScreen from './app/StudentOnboardingScreens/AcademicInfoScreen';
import SkillsScreen from './app/StudentOnboardingScreens/SkillsScreen';
import CareerInterestsScreen from './app/StudentOnboardingScreens/CareerInterestsScreen';
import PreferredLocationScreen from './app/StudentOnboardingScreens/PreferredLocationScreen';
import ProfileCompletionScreen from './app/StudentOnboardingScreens/ProfileCompletionScreen';

//Company onboarding screens
import CompanyInformation from './app/CompanyOnboardingScreens/CompanyInformation';
import RecruitmentPreferencesScreen from './app/CompanyOnboardingScreens/RecruitmentPreferencesScreen';
import CompanyReviewCompleteScreen from './app/CompanyOnboardingScreens/CompanyReviewCompleteScreen';
import CompanyDetailsScreen from './app/CompanyOnboardingScreens/CompanyDetailsScreen';
import CompanyProfileCompletion from './app/CompanyOnboardingScreens/CompanyProfileCompletion';
//Company experience screens
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
//University experience screens
import UniversityTabs from './app/UniversityExperience/UniversityTabs';
import PlacementOverviewScreen from './app/UniversityExperience/PlacementOverviewScreen';
import CompanyEngagementScreen from './app/UniversityExperience/CompanyEngagementScreen';
import StudentDetailScreen from './app/UniversityExperience/StudentDetailScreen';
import CompanyDetailScreen from './app/UniversityExperience/CompanyDetailScreen';
import UniversityNotificationsScreen from './app/UniversityExperience/UniversityNotificationsScreen';
import UniversityEditProfileScreen from './app/UniversityExperience/EditProfileScreen';

//Student experience screens
import InternshipDetailsScreen from './app/StudentExperienceScreens/InternshipDetailsScreen';
import StudentEditProfileScreen from './app/StudentExperienceScreens/StudentEditProfileScreen';
import StudentTabs from './app/StudentExperienceScreens/StudentTabs';
import StudentChatScreen from './app/StudentExperienceScreens/StudentChatScreen';

// Student application flow screens
import ApplicationReviewScreen from './app/StudentExperienceScreens/ApplicationReviewScreen';
import ResumeSelectionScreen from './app/StudentExperienceScreens/ResumeSelectionScreen';
import AdditionalInfoScreen from './app/StudentExperienceScreens/AdditionalInfoScreen';
import PortfolioLinksScreen from './app/StudentExperienceScreens/PortfolioLinksScreen';
import AvailabilityScreen from './app/StudentExperienceScreens/AvailabilityScreen';
import ReviewApplicationScreen from './app/StudentExperienceScreens/ReviewApplicationScreen';
import ApplicationSubmittedScreen from './app/StudentExperienceScreens/ApplicationSubmittedScreen';
import MyApplicationsScreen from './app/StudentExperienceScreens/MyApplicationsScreen';
import ApplicationDetailsScreen from './app/StudentExperienceScreens/ApplicationDetailsScreen';
import NotificationsScreen from './app/StudentExperienceScreens/NotificationsScreen';

//System state screens
import DiscoverEmptyScreen from './app/SystemStateScreens/DiscoverEmptyScreen';
import NoConnectionScreen from './app/SystemStateScreens/NoConnectionScreen';
import LoadingStateScreen from './app/SystemStateScreens/LoadingStateScreen';
import SearchResultsScreen from './app/SystemStateScreens/SearchResultsScreen';
import ActionSuccessfulScreen from './app/SystemStateScreens/ActionSuccessfulScreen';

//Settings components (shared across all roles)
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

//Premium screens
import PremiumPaywallScreen from './app/PremiumScreens/PremiumPaywallScreen';
import PaymentScreen from './app/PremiumScreens/PaymentScreen';
import PremiumConfirmationScreen from './app/PremiumScreens/PremiumConfirmationScreen';
import PremiumManageScreen from './app/PremiumScreens/PremiumManageScreen';


const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator 
  screenOptions={{ 
    headerShown: false,
    cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
  }} 
  initialRouteName="Splash"
>
          {/* Entry screens */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="WelcomeOnboarding" component={WelcomeOnboardingScreen} 
/>

          {/* Auth screens */}
          <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Verification" component={VerificationScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

          {/* Router — decides which onboarding to go to */}
          <Stack.Screen name="Onboarding" component={OnboardingRouter} />

          {/* Student onboarding */}
          <Stack.Screen name="AcademicInfo" component={AcademicInfoScreen} />
          <Stack.Screen name="Skills" component={SkillsScreen} />
          <Stack.Screen name="CareerInterests" component={CareerInterestsScreen} />
          <Stack.Screen name="PreferredLocation" component={PreferredLocationScreen} />
          <Stack.Screen name="ProfileCompletion" component={ProfileCompletionScreen} />

          {/* Student Experience screens */}
          <Stack.Screen name="HomeDashboard" component={StudentTabs} />
          <Stack.Screen name="InternshipDetails" component={InternshipDetailsScreen} />
          <Stack.Screen name="StudentEditProfile" component={StudentEditProfileScreen} />

          {/* Student Application Flow */}
          <Stack.Screen name="ApplicationReview" component={ApplicationReviewScreen} />
          <Stack.Screen name="ResumeSelection" component={ResumeSelectionScreen} />
          <Stack.Screen name="AdditionalInfo" component={AdditionalInfoScreen} />
          <Stack.Screen name="PortfolioLinks" component={PortfolioLinksScreen} />
          <Stack.Screen name="Availability" component={AvailabilityScreen} />
          <Stack.Screen name="ReviewApplication" component={ReviewApplicationScreen} />
          <Stack.Screen name="ApplicationSubmitted" component={ApplicationSubmittedScreen} />
          <Stack.Screen name="MyApplications" component={MyApplicationsScreen} />
          <Stack.Screen name="ApplicationDetails" component={ApplicationDetailsScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="StudentChatScreen" component={StudentChatScreen} />


          {/* University onboarding */}
          <Stack.Screen name="UniversityInfo" component={UniversityInfoScreen} />
          <Stack.Screen name="InstitutionDetails" component={InstitutionDetailsScreen} />
          <Stack.Screen name="CareerServicesSetup" component={CareerServicesSetupScreen} />
          <Stack.Screen name="ReviewComplete" component={ReviewCompleteScreen} />

          {/* University experience screens */}
          <Stack.Screen name="UniversityTabs" component={UniversityTabs} /> 
          <Stack.Screen name="PlacementOverview" component={PlacementOverviewScreen} />
          <Stack.Screen name="CompanyEngagement" component={CompanyEngagementScreen} />
          <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
          <Stack.Screen name="CompanyDetail" component={CompanyDetailScreen} />
          <Stack.Screen name="UniversityNotifications" component={UniversityNotificationsScreen} />
          <Stack.Screen name="UniversityEditProfile" component={UniversityEditProfileScreen} />
        

          {/* Company onboarding */}
          <Stack.Screen name="CompanyInformation" component={CompanyInformation} />
          <Stack.Screen name="RecruitmentPreferences" component={RecruitmentPreferencesScreen} />
          <Stack.Screen name="CompanyReviewComplete" component={CompanyReviewCompleteScreen} />
          <Stack.Screen name="CompanyDetails" component={CompanyDetailsScreen} />
          <Stack.Screen name="CompanyProfileCompletion" component={CompanyProfileCompletion} />
          {/* Company experience screens */}
          <Stack.Screen name="CompanyTabs" component={CompanyTabs} />
          <Stack.Screen name="CompanyProfile" component={CompanyProfileScreen} />
          <Stack.Screen name="NewInternshipDetails" component={NewInternshipDetailsScreen} />
          <Stack.Screen name="ApplicantProfile" component={ApplicantProfileScreen} />
          <Stack.Screen name="InterviewSchedule" component={InterviewScheduleScreen} />
          <Stack.Screen name="OfferSend" component={OfferSendScreen} />
          <Stack.Screen name="PostInternshipWizard" component={PostInternshipWizard} />
          <Stack.Screen name="Messages" component={MessagesScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="Insights" component={InsightsScreen} />

          {/* System states */}
          <Stack.Screen name="DiscoverEmpty" component={DiscoverEmptyScreen} />
          <Stack.Screen name="NoConnection" component={NoConnectionScreen} />
          <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
          <Stack.Screen name="LoadingState" component={LoadingStateScreen} />
          <Stack.Screen name="ActionSuccessful" component={ActionSuccessfulScreen} />

          {/* Settings components (shared across all roles) */}
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

          {/* Premium screens */}
          <Stack.Screen name="PremiumPaywall" component={PremiumPaywallScreen} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="PremiumConfirmation" component={PremiumConfirmationScreen} />
          <Stack.Screen name="PremiumManage" component={PremiumManageScreen} />

        </Stack.Navigator>
      </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
