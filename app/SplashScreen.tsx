import { View, StyleSheet, Image, Text } from 'react-native';
import { LightColors } from '../constants/theme';
import { useState, useEffect } from 'react';

export default function SplashScreen() {
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

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.appName}>
        <Text style={styles.internText}>Intern</Text>
        <Text style={styles.linkText}>Link</Text>
      </Text>
      <View style={styles.progressContainer}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightColors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  internText: {
    color: LightColors.secondary,
  },
  linkText: {
    color: LightColors.primary,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 80,
    width: 150,
    height: 4,
    backgroundColor: LightColors.accent,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: LightColors.primary,
    borderRadius: 2,
  },
});