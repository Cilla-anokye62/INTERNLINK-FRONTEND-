import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { useState, useRef } from 'react';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: '🎯',
    title: 'Discover Your Perfect Internship',
    description: 'AI analyzes your academic background, skills, and career goals to surface the best opportunities for you.',
  },
  {
    id: '2',
    icon: '🤖',
    title: 'Personalized AI Match Scores',
    description: 'Every internship gets a percentage match score so you know exactly where your application stands out.',
  },
  {
    id: '3',
    icon: '🚀',
    title: 'Track Every Application',
    description: 'From first click to final offer — stay organized and informed at every stage of your internship journey.',
  },
];

export default function WelcomeOnboardingScreen({ navigation }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const renderSlide = ({ item }: any) => (
    <View style={styles.slide}>
      <View style={styles.topSection}>
        <Text style={styles.icon}>{item.icon}</Text>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <View style={styles.bottomSection}>
        <Text style={styles.description}>{item.description}</Text>
      </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9F5F0',
  },
  slide: {
    width: width,
    height: height,
  },
  topSection: {
    flex: 1,
    backgroundColor: '#024D60',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#D9F5F0',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  icon: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#024D60',
    textAlign: 'center',
    lineHeight: 24,
  },
});