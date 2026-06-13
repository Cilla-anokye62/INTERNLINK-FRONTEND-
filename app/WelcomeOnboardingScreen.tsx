import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useState, useRef } from 'react';
import { FlatList } from 'react-native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Discover Your Perfect Internship',
    description: 'AI analyzes your academic background, skills, and career goals to surface the best opportunities for you.',
  },
  {
    id: '2',
    title: 'Personalized AI Match Scores',
    description: 'Every internship gets a percentage match score so you know exactly where your application stands out.',
  },
  {
    id: '3',
    title: 'Track Every Application',
    description: 'From first click to final offer — stay organized and informed at every stage of your internship journey.',
  },
];

export default function WelcomeOnboardingScreen({ navigation }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('RoleSelection');
    }
  };

 const renderSlide = ({ item }: any) => (
    <View style={styles.slide}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>

      {/* Wave */}
      <View style={styles.wave} />

      {/* Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'} →
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>I Already Have an Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E1F6F4',
  },
  slide: {
    width: width,
    alignItems: 'center',
    paddingTop: 300,
    paddingHorizontal: 32,
  },
  logoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  internText: {
    color: '#050315',
  },
  linkText: {
    color: '#2CACAD',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#024D60',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#B0E0E0',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: '#2CACAD',
    borderRadius: 4,
  },
  wave: {
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  bottomContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingBottom: 40,
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
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    color: '#2CACAD',
    fontSize: 14,
  },
});