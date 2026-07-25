import { View, Text, StyleSheet, TouchableOpacity, Dimensions, StatusBar, ImageBackground, Animated, Image, Platform, PanResponder, useWindowDimensions } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('screen');

const slides = [
  {
    id: '1',
    title: 'Discover Your Perfect Internship',
    description: 'AI analyzes your academic background, skills, and career goals to surface the best opportunities for you.',
    image: require('../assets/WelcomeOnboardingImages/discover.webp'),
  },
  {
    id: '2',
    title: 'Personalized AI Match Scores',
    description: 'Every internship gets a percentage match score so you know exactly where your application stands out.',
    image: require('../assets/WelcomeOnboardingImages/personalized.webp'),
  },
  {
    id: '3',
    title: 'Track Every Application',
    description: 'From first click to final offer — stay organized and informed at every stage of your internship journey.',
    image: require('../assets/WelcomeOnboardingImages/track.webp'),
  },
];

export default function WelcomeOnboardingScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Create separate animated values for each slide for cross-fading
  const slideAnims = useRef(
    slides.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (Platform.OS === 'web') return; // resolveAssetSource isn't supported on web
    slides.forEach(slide => {
      Image.prefetch(Image.resolveAssetSource(slide.image).uri).catch(() => {});
    });
  }, []);

  useEffect(() => {
    // Initialize first slide to visible
    slideAnims[0].setValue(1);
  }, []);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      
      // Cross-fade: fade out current, fade in next simultaneously
      Animated.parallel([
        Animated.timing(slideAnims[currentIndex], {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnims[nextIndex], {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentIndex(nextIndex);
      });
    } else {
      navigation.navigate('RoleSelection');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      
      // Cross-fade: fade out current, fade in previous simultaneously
      Animated.parallel([
        Animated.timing(slideAnims[currentIndex], {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnims[prevIndex], {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentIndex(prevIndex);
      });
    }
  };

  // PanResponder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal swipes with minimum movement
        return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        const swipeThreshold = 30;
        
        // Swipe left (negative dx) - go to next slide
        if (gestureState.dx < -swipeThreshold) {
          handleNext();
        }
        // Swipe right (positive dx) - go to previous slide
        else if (gestureState.dx > swipeThreshold) {
          handlePrevious();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {slides.map((slide, index) => (
        <Animated.View
          key={slide.id}
          style={[
            styles.slide,
            { width, height },
            { opacity: slideAnims[index] }
          ]}
          pointerEvents={index === currentIndex ? 'auto' : 'none'}
        >
          <ImageBackground
            source={slide.image}
            style={[styles.slide, { width, height }]}
            resizeMode="cover"
          >
            <View style={styles.darkOverlay} />
            <View style={styles.textBlock}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </ImageBackground>
        </Animated.View>
      ))}

      <View
        style={[styles.overlayContainer, { paddingBottom: insets.bottom + 24 }]}
        pointerEvents="box-none"
      >
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.85}>
            <Text style={styles.buttonText}>
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'} →
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>I Already Have an Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  slide: {
    justifyContent: 'flex-start',
    position: 'absolute',
    top: 0,
    left: 0,
    marginTop: Platform.OS === 'android' ? -(StatusBar.currentHeight ?? 0) : 0,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  textBlock: {
    paddingHorizontal: 28,
    paddingTop: 110,
    zIndex: 1,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  description: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 21,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: '#2CACAD',
    borderRadius: 4,
  },
  bottomContainer: {
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2CACAD',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});