import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import SplashScreen from './app/SplashScreen';
import WelcomeOnboardingScreen from './app/WelcomeOnboardingScreen';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="WelcomeOnboarding" component={WelcomeOnboardingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}