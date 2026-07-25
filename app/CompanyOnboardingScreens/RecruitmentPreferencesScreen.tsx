import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { companyApi, getAuthErrorMessage } from '../../src/api';
import type { CompanyWorkSetup } from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';

// ---------- Types ----------
interface ChipData {
  label: string;
  selected: boolean;
}

const CATEGORY_OPTIONS = [
  'Engineering',
  'Design',
  'Product',
  'Data',
  'Marketing',
  'Operations',
];

const QUALIFICATION_OPTIONS = [
  "Bachelor's+",
  '3.0+ GPA',
  'Final year',
  'Visa sponsorship',
  'Portfolio required',
];

const WORK_SETUP_OPTIONS: CompanyWorkSetup[] = ['Remote', 'Hybrid', 'On-site'];

const hydrateChips = (options: string[], selectedValues: string[]): ChipData[] => {
  const selected = new Set(selectedValues);
  const serverOnlyOptions = selectedValues.filter((value) => !options.includes(value));

  return [...options, ...serverOnlyOptions].map((label) => ({
    label,
    selected: selected.has(label),
  }));
};

// ---------- Reusable Chip Component ----------
interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  colors: any;
}

const Chip: React.FC<ChipProps> = ({ label, selected, onPress, colors }) => {
  return (
    <TouchableOpacity
      style={[
        {
          paddingVertical: 8,
          paddingHorizontal: 14,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          backgroundColor: colors.card,
        },
        selected && {
          backgroundColor: colors.accent,
          borderColor: colors.accent,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[
        {
          fontSize: 13,
          color: colors.title,
          fontWeight: '500',
        },
        selected && {
          color: colors.onPrimary,
        }
      ]}>
        {selected ? `✓ ${label}` : label}
      </Text>
    </TouchableOpacity>
  );
};
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, any>;

// ---------- Main Screen ----------
const RecruitmentPreferencesScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const [categories, setCategories] = useState<ChipData[]>(() =>
    hydrateChips(CATEGORY_OPTIONS, []),
  );
  const [qualifications, setQualifications] = useState<ChipData[]>(() =>
    hydrateChips(QUALIFICATION_OPTIONS, []),
  );
  const [workSetup, setWorkSetup] = useState<CompanyWorkSetup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    setIsLoading(true);
    setLoadError(null);
    companyApi.getMe()
      .then((profile) => {
        if (!active) return;
        setCategories(hydrateChips(CATEGORY_OPTIONS, profile.internshipCategories));
        setQualifications(hydrateChips(
          QUALIFICATION_OPTIONS,
          profile.preferredQualifications,
        ));
        setWorkSetup(profile.workSetup);
      })
      .catch((error: unknown) => {
        if (active) setLoadError(getAuthErrorMessage(error));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [loadAttempt]);

  const toggleCategory = (index: number) => {
    if (isSubmitting) return;
    setSubmitError(null);
    setCategories((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleQualification = (index: number) => {
    if (isSubmitting) return;
    setSubmitError(null);
    setQualifications((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleContinue = async (): Promise<void> => {
    if (isSubmitting) return;

    const selectedCategories = categories
      .filter((item) => item.selected)
      .map((item) => item.label);
    const selectedQualifications = qualifications
      .filter((item) => item.selected)
      .map((item) => item.label);

    if (selectedCategories.length === 0) {
      setSubmitError('Select at least one internship category.');
      return;
    }
    if (selectedQualifications.length === 0) {
      setSubmitError('Select at least one preferred qualification.');
      return;
    }
    if (!workSetup) {
      setSubmitError('Select a work setup.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await companyApi.updateMe({
        internshipCategories: selectedCategories,
        preferredQualifications: selectedQualifications,
        workSetup,
      });
      navigation.navigate('CompanyProfileCompletion');
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.stateText}>Loading recruitment preferences...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loadError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.stateContainer}>
          <Text style={styles.errorText}>{loadError}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setLoadAttempt((attempt) => attempt + 1)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step indicator */}
        <View style={styles.stepRow}>
          <Text style={styles.stepText}>Company setup · Step 3 of 4</Text>
          <Text style={styles.stepPercent}>75%</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '75%' }]} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Recruitment preferences</Text>
        <Text style={styles.subtitle}>
          We'll surface candidates that match your needs.
        </Text>

        {/* Internship categories */}
        <Text style={styles.sectionLabel}>INTERNSHIP CATEGORIES</Text>
        <View style={styles.card}>
          <View style={styles.chipWrap}>
            {categories.map((item, index) => (
              <Chip
                key={item.label}
                label={item.label}
                selected={item.selected}
                onPress={() => toggleCategory(index)}
                colors={colors}
              />
            ))}
          </View>
        </View>

        {/* Preferred qualifications */}
        <Text style={styles.sectionLabel}>PREFERRED QUALIFICATIONS</Text>
        <View style={styles.card}>
          <View style={styles.chipWrap}>
            {qualifications.map((item, index) => (
              <Chip
                key={item.label}
                label={item.label}
                selected={item.selected}
                onPress={() => toggleQualification(index)}
                colors={colors}
              />
            ))}
          </View>
        </View>

        {/* Work setup */}
        <Text style={styles.sectionLabel}>WORK SETUP</Text>
        <View style={styles.workSetupRow}>
          {WORK_SETUP_OPTIONS.map((option) => {
            const isSelected = workSetup === option;
            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.workSetupButton,
                  isSelected && styles.workSetupButtonSelected,
                ]}
                onPress={() => {
                  setWorkSetup(option);
                  setSubmitError(null);
                }}
                activeOpacity={0.7}
                disabled={isSubmitting}
              >
                <Text
                  style={[
                    styles.workSetupText,
                    isSelected && styles.workSetupTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}

        {/* Continue button */}
        <TouchableOpacity
          style={[styles.continueButton, isSubmitting && styles.continueButtonDisabled]}
          onPress={handleContinue}
          activeOpacity={0.8}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={colors.onPrimary} />
          ) : (
            <Text style={styles.continueButtonText}>Next →</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------- Styles ----------
const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 14,
  },
  stateText: {
    color: colors.subtitle,
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 10,
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
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '500',
  },
  stepPercent: {
    fontSize: 13,
    color: colors.subtitle,
    fontWeight: '500',
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.inputBorder,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.title,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtitle,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.placeholder,
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: 14,
    marginBottom: 20,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.card,
  },
  chipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: {
    fontSize: 13,
    color: colors.title,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: colors.onPrimary,
  },
  workSetupRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 32,
  },
  workSetupButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  workSetupButtonSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  workSetupText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.title,
  },
  workSetupTextSelected: {
    color: colors.onPrimary,
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

export default RecruitmentPreferencesScreen;
