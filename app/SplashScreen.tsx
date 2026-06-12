import { View, StyleSheet, Image, Text, Animated } from 'react-native';
import { LightColors } from '../constants/theme';
import { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';


export default function SplashScreen({ navigation }: any) {
  
  const [progress, setProgress] = useState(0);
  
  const shineAnimation = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 1) {
          clearInterval(interval);
          if (prev >= 1) {
  clearInterval(interval);
  navigation.navigate('WelcomeOnboarding');
  return 1;
}
          return 1;
        }
        return prev + 0.05;
      });
    }, 100);
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnimation, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.delay(1200)
      ])
    ).start();

    return () => clearInterval(interval);
  }, [shineAnimation]);

  const translateX = shineAnimation.interpolate({
    inputRange: [-1, 1],
    outputRange: [-250, 250], 
  });

  return (
    <LinearGradient
  colors={['#3BBFBA', '#E1F6F4', '#3BBFBA'] as const}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.container}
>
      
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        
        <Animated.View
          style={[
            styles.shineWrapper,
            { transform: [{ translateX }] }
          ]}
        >
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0)',
              'rgba(255, 255, 255, 0.1)', 
              'rgba(255, 255, 255, 0)'
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0.3, 0.5, 0.7]} 
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
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
 logoContainer: {
  width: 130,
  height: 130,
  borderRadius: 28,
  marginBottom: 50,
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
},
  logo: {
    width: '80%',
    height: '80%',
    //resizeMode: 'contain',
    alignSelf: 'center',
  },
  shineWrapper: {
    ...StyleSheet.absoluteFillObject,
    width: '150%', 
    height: '150%',
    top: '-25%',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  internText: {
    color: '#024D60',
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