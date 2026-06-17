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
import UniversityInfoScreen from './app/UniversityOnboarding/UniversityInfoScreen';
import AcademicInfoScreen from './app/StudentOnboardingScreens/AcademicInfoScreen';
import ReviewCompleteScreen from './app/UniversityOnboarding/ReviewCompleteScreen';
import CareerServicesSetupScreen from './app/UniversityOnboarding/CareerServicesSetupScreen';
import InstitutionDetailsScreen from './app/UniversityOnboarding/InstitutionDetailsScreen';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="WelcomeOnboarding" component={WelcomeOnboardingScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="UniversityInfo" component={UniversityInfoScreen} />
        <Stack.Screen name="AcademicInfo" component={AcademicInfoScreen} />
        <Stack.Screen name="InstitutionDetails" component={InstitutionDetailsScreen} />
        <Stack.Screen name="CareerServicesSetup" component={CareerServicesSetupScreen} />
        <Stack.Screen name="ReviewComplete" component={ReviewCompleteScreen} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}