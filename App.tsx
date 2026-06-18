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
import CompanyInformation from './app/Company Onboarding screens/CompanyInformation'; 
import CareerInterestsScreen from './app/StudentOnboardingScreens/CareerInterestsScreen';
import PreferredLocationScreen from './app/StudentOnboardingScreens/PreferredLocationScreen';
import CompanyDetails from './app/Company Onboarding screens/CompanyDetails';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">

        {/* Entry screens */}
        <Stack.Screen name="Splash"            component={SplashScreen} />
        <Stack.Screen name="WelcomeOnboarding" component={WelcomeOnboardingScreen} />

        {/* Auth screens */}
        <Stack.Screen name="RoleSelection"     component={RoleSelectionScreen} />
        <Stack.Screen name="Login"             component={LoginScreen} />
        <Stack.Screen name="SignUp"            component={SignUpScreen} />
        <Stack.Screen name="Verification"      component={VerificationScreen} />
        <Stack.Screen name="ForgotPassword"    component={ForgotPasswordScreen} />

        {/* Router — decides which onboarding to go to */}
        <Stack.Screen name="Onboarding"        component={OnboardingRouter} />

        {/* Student onboarding */}
        <Stack.Screen name="AcademicInfo"      component={AcademicInfoScreen} />
        <Stack.Screen name="Skills"            component={SkillsScreen} />
        <Stack.Screen name="CareerInterests" component={CareerInterestsScreen} />
        <Stack.Screen name="PreferredLocation" component={PreferredLocationScreen} />

        {/* University onboarding */}
        <Stack.Screen name="UniversityInfo"         component={UniversityInfoScreen} />
        <Stack.Screen name="InstitutionDetails"     component={InstitutionDetailsScreen} />
        <Stack.Screen name="CareerServicesSetup"    component={CareerServicesSetupScreen} />
        <Stack.Screen name="ReviewComplete"         component={ReviewCompleteScreen} />

        {/* Company onboarding */}
        <Stack.Screen name="CompanyInformation"     component={CompanyDetails} />
        <Stack.Screen name="CompanyDetails"     component={CompanyDetails} />

        {/* Employer onboarding — add when CompanyInfoScreen is ready */}
        {/* <Stack.Screen name="CompanyInfo"    component={CompanyInfoScreen} /> */}

      </Stack.Navigator>
    </NavigationContainer>
  );
}