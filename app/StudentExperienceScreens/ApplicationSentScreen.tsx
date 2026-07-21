import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';

const { height } = Dimensions.get('window');

export default function ApplicationSentScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const handleTrackApplication = () => {
    navigation.navigate('Applications');
  };

  const handleBrowseMore = () => {
    navigation.navigate('Discover');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back-outline" size={20} color={colors.title} />
      </TouchableOpacity>

      {/* Center content */}
      <View style={styles.centerContent}>
        {/* Checkmark circle */}
        <View style={styles.checkCircleOuter}>
          <View style={styles.checkCircleInner}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Application sent!</Text>
        <Text style={styles.subtitle}>
          Airbnb received your application for Software Engineering Intern. You'll get a response within 7 days.
        </Text>

        {/* Application card */}
        <View style={styles.card}>
          <View style={styles.companyAvatar}>
            <Text style={styles.companyAvatarText}>A</Text>
          </View>
          <View style={styles.cardInfo}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardTitle}>Software Engineering Intern</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>In review</Text>
              </View>
            </View>
            <Text style={styles.cardSubtitle}>Airbnb · Submitted today</Text>
          </View>
        </View>
      </View>

      {/* Bottom buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.trackButton}
          onPress={handleTrackApplication}
          activeOpacity={0.85}
        >
          <Text style={styles.trackButtonText}>Track Application</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={handleBrowseMore}
          activeOpacity={0.85}
        >
          <Text style={styles.browseButtonText}>Browse more roles</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.02,
  },
  backArrow: {
    fontSize: 18,
    color: colors.title,
    fontWeight: 'bold',
  },

  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkCircleOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.iconCircle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  checkCircleInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: colors.onPrimary,
    fontSize: 36,
    fontWeight: 'bold',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtitle,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 8,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  companyAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  companyAvatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.cardTitle,
    flexShrink: 1,
  },
  statusBadge: {
    backgroundColor: colors.iconCircle,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.placeholder,
  },

  bottomBar: {
    paddingBottom: height * 0.04,
    gap: 12,
  },
  trackButton: {
    backgroundColor: colors.accent,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  trackButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  browseButton: {
    backgroundColor: colors.card,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  browseButtonText: {
    color: colors.title,
    fontSize: 16,
    fontWeight: 'bold',
  },
});