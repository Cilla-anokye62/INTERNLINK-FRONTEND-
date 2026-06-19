import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import SplashScreen from './app/SplashScreen';
import WelcomeOnboardingScreen from './app/WelcomeOnboardingScreen';
import RoleSelectionScreen from './app/AuthScreens/RoleSelectionScreen';
import LoginScreen from './app/AuthScreens/LoginScreen';
import SignUpScreen from './app/AuthScreens/SignUpScreen';
import VerificationScreen from './app/AuthScreens/VerificationScreen';
import ForgotPasswordScreen from './app/AuthScreens/ForgotPasswordScreen';
import OnboardingRouter from './app/OnboardingRouter';
import UniversityInfoScreen from './app/UniversityOnboarding/UniversityInfoScreen';
import InstitutionDetailsScreen from './app/UniversityOnboarding/InstitutionDetailsScreen';
import CareerServicesSetupScreen from './app/UniversityOnboarding/CareerServicesSetupScreen';
import ReviewCompleteScreen from './app/UniversityOnboarding/ReviewCompleteScreen';
import AcademicInfoScreen from './app/StudentOnboardingScreens/AcademicInfoScreen';
import SkillsScreen from './app/StudentOnboardingScreens/SkillsScreen';
import CareerInterestsScreen from './app/StudentOnboardingScreens/CareerInterestsScreen';
import PreferredLocationScreen from './app/StudentOnboardingScreens/PreferredLocationScreen';
import ProfileCompletionScreen from './app/StudentOnboardingScreens/ProfileCompletionScreen';
import StudentTabs from './app/StudentExperienceScreens/StudentTabs';
import CompanyInformation from './app/Company Onboarding screens/CompanyInformation';
import CompanyDetails from './app/Company Onboarding screens/CompanyDetails';
import UniversityDashboardScreen from './app/UniversityExperience/UniversityDashboardScreen';
import PlacementOverviewScreen from './app/UniversityExperience/PlacementOverviewScreen';
import PlacementAnalyticsScreen from './app/UniversityExperience/PlacementAnalyticsScreen';
import StudentMonitoringScreen from './app/UniversityExperience/StudentMonitoringScreen';
import CompanyEngagementScreen from './app/UniversityExperience/CompanyEngagementScreen';
import ReportsScreen from './app/UniversityExperience/ReportsScreen';
import SettingsScreen from './app/UniversityExperience/SettingsScreen';
const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">

          {/* Entry screens */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="WelcomeOnboarding" component={WelcomeOnboardingScreen} />

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
          <Stack.Screen name="CompanyInformation" component={CompanyDetails} />
          <Stack.Screen name="CompanyDetails" component={CompanyDetails} />


          {/* Employer onboarding — add when CompanyInfoScreen is ready */}
          {/* <Stack.Screen name="CompanyInfo"    component={CompanyInfoScreen} /> */}

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}