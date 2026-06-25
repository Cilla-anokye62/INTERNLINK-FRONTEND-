import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';


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
import CompanyDetails from './app/CompanyOnboardingScreens/CompanyDetails';
import RecruitmentPreferencesScreen from './app/CompanyOnboardingScreens/RecruitmentPreferencesScreen';
import CompanyReviewCompleteScreen from './app/CompanyOnboardingScreens/CompanyReviewCompleteScreen';

//University experience screens
import UniversityDashboardScreen from './app/UniversityExperience/UniversityDashboardScreen';
import PlacementOverviewScreen from './app/UniversityExperience/PlacementOverviewScreen';
import PlacementAnalyticsScreen from './app/UniversityExperience/PlacementAnalyticsScreen';
import StudentMonitoringScreen from './app/UniversityExperience/StudentMonitoringScreen';
import CompanyEngagementScreen from './app/UniversityExperience/CompanyEngagementScreen';
import ReportsScreen from './app/UniversityExperience/ReportsScreen';
import SettingsScreen from './app/UniversityExperience/SettingsScreen';

//Student experience screens
import ApplicationSentScreen from './app/StudentExperienceScreens/ApplicationSentScreen';
import InternshipDetailsScreen from './app/StudentExperienceScreens/InternshipDetailsScreen';
import StudentEditProfileScreen from './app/StudentExperienceScreens/StudentEditProfileScreen';
import StudentSettingsScreen from './app/StudentExperienceScreens/StudentSettingsScreen';
import StudentTabs from './app/StudentExperienceScreens/StudentTabs';

//System state screens
import DiscoverEmptyScreen from './app/SystemStateScreens/DiscoverEmptyScreen';
import NoConnectionScreen from './app/SystemStateScreens/NoConnectionScreen';
import LoadingStateScreen from './app/SystemStateScreens/LoadingStateScreen';
import SearchResultsScreen from './app/SystemStateScreens/SearchResultsScreen';
import ActionSuccessfulScreen from './app/SystemStateScreens/ActionSuccessfulScreen';


const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
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
          <Stack.Screen name="ApplicationSent" component={ApplicationSentScreen} />
          <Stack.Screen name="InternshipDetails" component={InternshipDetailsScreen} />
          <Stack.Screen name="StudentEditProfile" component={StudentEditProfileScreen} />
          <Stack.Screen name="StudentSettings" component={StudentSettingsScreen} />


          {/* University onboarding */}
          <Stack.Screen name="UniversityInfo" component={UniversityInfoScreen} />
          <Stack.Screen name="InstitutionDetails" component={InstitutionDetailsScreen} />
          <Stack.Screen name="CareerServicesSetup" component={CareerServicesSetupScreen} />
          <Stack.Screen name="ReviewComplete" component={ReviewCompleteScreen} />

          {/* University experience screens */}
          <Stack.Screen name="UniversityDashboard" component={UniversityDashboardScreen} />
          <Stack.Screen name="PlacementAnalytics" component={PlacementAnalyticsScreen} />
          <Stack.Screen name="PlacementOverview" component={PlacementOverviewScreen} />
          <Stack.Screen name="StudentMonitoring" component={StudentMonitoringScreen} />
          <Stack.Screen name="CompanyEngagement" component={CompanyEngagementScreen} />
          <Stack.Screen name="Reports" component={ReportsScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />

          {/* Company onboarding */}
          <Stack.Screen name="CompanyInformation" component={CompanyInformation} />
          <Stack.Screen name="CompanyDetails" component={CompanyDetails} />
          <Stack.Screen name="RecruitmentPreferences" component={RecruitmentPreferencesScreen} />
          <Stack.Screen name="CompanyReviewComplete" component={CompanyReviewCompleteScreen} />

          {/* System states */}
          <Stack.Screen name="DiscoverEmpty" component={DiscoverEmptyScreen} />
          <Stack.Screen name="NoConnection" component={NoConnectionScreen} />
          <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
          <Stack.Screen name="LoadingState" component={LoadingStateScreen} />
          <Stack.Screen name="ActionSuccessful" component={ActionSuccessfulScreen} />
          {/* Employer onboarding — add when CompanyInfoScreen is ready */}
          {/* <Stack.Screen name="CompanyInfo"    component={CompanyInfoScreen} /> */}

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}