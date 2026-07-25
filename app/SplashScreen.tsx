import { View, StyleSheet, Image, Text, Animated, Dimensions, Platform } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import WelcomeOnboardingScreen from './WelcomeOnboardingScreen';
import { useAppStore } from '../src/store/useAppStore';

const { height } = Dimensions.get('window');

export default function SplashScreen({ navigation }: any) {

  const logoScale = useRef(new Animated.Value(0.9)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const splashFade = useRef(new Animated.Value(1)).current;
  const [assetsReady, setAssetsReady] = useState(false);
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const sessionInitialized = useAppStore((state) => state.sessionInitialized);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    const preload = async () => {
      try {
        if (Platform.OS !== 'web') {
          await Promise.all([
            Image.prefetch(Image.resolveAssetSource(require('../assets/WelcomeOnboardingImages/discover.webp')).uri),
          ]);
        }
      } catch (e) {
        console.log('Image preload error:', e);
      } finally {
        setAssetsReady(true);
      }
    };
    preload();

    return () => {};
  }, []);

  useEffect(() => {
    if (!assetsReady || !hasHydrated || !sessionInitialized) return;

    const exitTimer = setTimeout(() => {
      Animated.timing(splashFade, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        navigation.replace('WelcomeOnboarding');
      });
    }, 2000);

    return () => clearTimeout(exitTimer);
  }, [assetsReady, hasHydrated, navigation, sessionInitialized, splashFade]);

  return (
    <View style={styles.root}>
      <View style={StyleSheet.absoluteFillObject}>
        <WelcomeOnboardingScreen navigation={navigation} />
      </View>

      <Animated.View
        style={[styles.splashOverlay, { opacity: splashFade }]}
        pointerEvents="auto"
        onStartShouldSetResponder={() => true}
      >
        <LinearGradient
          colors={['#3BBFBA', '#E1F6F4', '#3BBFBA'] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.container}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.centerContent}>
              <Animated.View
                style={[
                  styles.logoContainer,
                  {
                    opacity: logoOpacity,
                    transform: [{ scale: logoScale }],
                  },
                ]}
              >
                <Image source={require('../assets/logo.png')} style={styles.logo} />
              </Animated.View>

              <Animated.Text style={[styles.appName, { opacity: logoOpacity }]}>
                <Text style={styles.internText}>Intern</Text>
                <Text style={styles.linkText}>Link</Text>
              </Animated.Text>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 130,
    height: 130,
    borderRadius: 28,
    marginBottom: height * 0.04,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '80%',
    height: '80%',
    alignSelf: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  internText: {
    color: '#024D60',
  },
  linkText: {
    color: '#2CACAD',
  },
});
