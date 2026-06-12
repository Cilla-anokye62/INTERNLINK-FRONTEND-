import { View, StyleSheet, Image, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen({ navigation }: any) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 1) {
          clearInterval(interval);
          return 1;
        }
        return prev + 0.05;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 1) {
      navigation.navigate('WelcomeOnboarding');
    }
  }, [progress]);

  return (
    <LinearGradient
      colors={['#2BACA8', '#3BBFBA', '#5DD8D0'] as const}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0.15)'] as const}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gloss}
      />
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>
      <Text style={styles.appName}>
        <Text style={styles.internText}>Intern</Text>
        <Text style={styles.linkText}>Link</Text>
      </Text>
      <View style={styles.progressContainer}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  logoContainer: {
    width: 130,
    height: 130,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    marginBottom: 50,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  internText: {
    color: '#050315',
  },
  linkText: {
    color: '#2CACAD',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 80,
    width: 150,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
});