import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';

const { width } = Dimensions.get('window');

const UNLOCKED_ITEMS = [
  { icon: 'rocket-outline' as const, text: 'Unlimited applications' },
  { icon: 'hardware-chip-outline' as const, text: 'Deep AI career analysis' },
  { icon: 'bar-chart-outline' as const, text: 'Full application tracking' },
  { icon: 'document-text-outline' as const, text: 'Resume optimization insights' },
];

export default function PremiumConfirmationScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleStartExploring = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeDashboard' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Animated checkmark */}
        <Animated.View style={[styles.checkCircle, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient
            colors={[colors.premiumGradientStart, colors.premiumGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.checkGradient}
          >
            <Text style={styles.checkmark}>✓</Text>
          </LinearGradient>
        </Animated.View>

        {/* Text content */}
        <Animated.View style={[styles.textBlock, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>Welcome to Premium!</Text>
          <Text style={styles.subtitle}>
            You've unlocked the full InternLink experience. Your career journey just got a major upgrade.
          </Text>
        </Animated.View>

        {/* Unlocked features */}
        <Animated.View style={[styles.featuresList, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {UNLOCKED_ITEMS.map((item, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIconCircle}>
                <Ionicons name={item.icon} size={20} color={colors.accent} />
              </View>
              <Text style={styles.featureText}>{item.text}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Crown decorations */}
        <View style={styles.crownDecorLeft}>
          <Ionicons name="diamond-outline" size={40} color={colors.accent} />
        </View>
        <View style={styles.crownDecorRight}>
          <Ionicons name="sparkles-outline" size={40} color={colors.accent} />
        </View>
      </View>

      {/* CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={handleStartExploring} activeOpacity={0.85}>
          <LinearGradient
            colors={[colors.premiumGradientStart, colors.premiumGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaBtn}
          >
            <Text style={styles.ctaBtnText}>Start Exploring</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    position: 'relative',
  },
  checkCircle: {
    marginBottom: 28,
  },
  checkGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  textBlock: {
    alignItems: 'center',
    marginBottom: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.title,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.subtitle,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  featuresList: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  featureIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.iconCircle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  crownDecorLeft: {
    position: 'absolute',
    top: 40,
    left: 20,
    opacity: 0.15,
  },
  crownDecorRight: {
    position: 'absolute',
    top: 60,
    right: 24,
    opacity: 0.15,
  },
  bottomBar: {
    paddingHorizontal: 32,
    paddingBottom: 32,
    paddingTop: 16,
    alignItems: 'center',
  },
  ctaBtn: {
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 32,
    width: width - 64,
    alignItems: 'center',
  },
  ctaBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
