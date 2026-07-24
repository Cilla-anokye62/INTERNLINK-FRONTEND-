import React from 'react';
import { ActivityIndicator, Alert, View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';
import { useStudentOnboardingOptions } from '../../src/hooks/useStudentOnboardingOptions';

const { height, width } = Dimensions.get('window');

export default function CareerInterestsScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { careerInterests, setCareerInterests } = useAppStore();
  const { options, isLoading, error: optionsError, retry } = useStudentOnboardingOptions();

  const [selected, setSelected] = useState<string[]>(careerInterests);

  useEffect(() => {
    if (!options) return;

    const normalized = Array.from(new Set(selected.map((value) => {
      const matchingOption = options.careerInterests.find(
        (option) => option.name === value || option.code === value,
      );
      return matchingOption?.name ?? value;
    })));

    if (normalized.length !== selected.length || normalized.some((value, index) => value !== selected[index])) {
      setSelected(normalized);
      setCareerInterests(normalized);
    }
  }, [options]);

  const toggleInterest = (name: string) => {
    setSelected(prev => {
      const next = prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name];
      setCareerInterests(next);
      return next;
    });
  };

  const handleContinue = () => {
    if (selected.length < 2) {
      Alert.alert('Choose more interests', 'Please select at least 2 interests.');
      return;
    }
    navigation.navigate('PreferredLocation');
  };

  const CARD_SIZE = (width - 24 * 2 - 12) / 2;

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Fixed top section */}
      <View style={styles.topSection}>
        <View style={styles.progressRow}>
          <Text style={styles.stepLabel}>Step 3 of 5</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PreferredLocation')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: '60%' }]} />
        </View>

        <Text style={styles.title}>What interests{'\n'}you?</Text>
        <Text style={styles.subtitle}>
          Choose career areas you'd like to explore. Select multiple.
        </Text>

        <View style={styles.hintRow}>
          <Ionicons name="sparkles-outline" size={16} color={colors.accent} style={{ marginRight: 8 }} />
          <Text style={styles.hintText}>AI uses your interests to calculate match scores</Text>
        </View>
      </View>

      {/* Scrollable grid */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && !options ? (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="small" color={colors.accent} />
            <Text style={styles.stateText}>Loading career interests...</Text>
          </View>
        ) : null}

        {optionsError && !options ? (
          <View style={styles.stateContainer}>
            <Text style={styles.errorText}>{optionsError}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={retry}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {options && options.careerInterests.length === 0 ? (
          <View style={styles.stateContainer}>
            <Text style={styles.stateText}>No career interests are available yet. You can skip this step for now.</Text>
          </View>
        ) : null}

        <View style={styles.grid}>
          {(options?.careerInterests ?? []).map(item => {
            const isSelected = selected.includes(item.name);
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => toggleInterest(item.name)}
                activeOpacity={0.85}
                style={[
                  styles.card,
                  { width: CARD_SIZE, height: CARD_SIZE },
                  isSelected && styles.cardSelected,
                ]}
              >
                <LinearGradient
                  colors={(isSelected
                    ? [colors.primary, colors.accent]
                    : [colors.card, colors.iconCircle]) as [string, string]}
                  style={styles.cardGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                  <Text style={[styles.cardLabel, { color: isSelected ? colors.onPrimary : colors.text }]}>
                    {item.name}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: height * 0.12 }} />
      </ScrollView>

      {/* Fixed bottom bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomInfo}>
          <Text style={styles.selectedCount}>{selected.length} selected</Text>
          <Text style={styles.minText}>Select at least 2</Text>
        </View>
        <TouchableOpacity
          style={[styles.continueButton, isLoading && styles.continueButtonDisabled]}
          onPress={handleContinue}
          activeOpacity={0.85}
          disabled={isLoading}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
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
  topSection: {
    paddingHorizontal: 24,
    paddingTop: height * 0.02,
    paddingBottom: 12,
    backgroundColor: colors.background,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepLabel: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  skipText: {
    fontSize: 13,
    color: colors.placeholder,
    fontWeight: '500',
  },
  progressBarBg: {
    width: '100%',
    height: 5,
    backgroundColor: colors.inputBorder,
    borderRadius: 3,
    marginBottom: height * 0.025,
  },
  progressBarFill: {
    height: 5,
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 8,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtitle,
    marginBottom: 12,
    lineHeight: 20,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    marginBottom: 4,
  },
  hintIcon: {
    fontSize: 14,
    color: colors.accent,
    marginRight: 8,
  },
  hintText: {
    fontSize: 13,
    color: colors.subtitle,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  stateContainer: {
    alignItems: 'center',
    paddingVertical: 28,
    gap: 12,
  },
  stateText: {
    color: colors.subtitle,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.card,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  retryButtonText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: colors.accent,
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: colors.onPrimary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: height * 0.03,
    paddingTop: 12,
    backgroundColor: colors.background,
  },
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  selectedCount: {
    fontSize: 13,
    color: colors.title,
    fontWeight: '600',
  },
  minText: {
    fontSize: 13,
    color: colors.placeholder,
  },
  continueButton: {
    backgroundColor: colors.accent,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
