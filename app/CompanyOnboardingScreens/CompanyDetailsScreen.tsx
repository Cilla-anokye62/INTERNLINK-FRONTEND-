import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { companyApi, getAuthErrorMessage } from '../../src/api';
import type { CompanySize } from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';

type Props = NativeStackScreenProps<any, any>;

const COMPANY_SIZES: CompanySize[] = ['1-10', '11-50', '51-200', '200+'];

// ---------- Main Screen ----------
const CompanyDetailsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const [industry, setIndustry] = useState('');
  const [selectedSize, setSelectedSize] = useState<CompanySize | null>(null);
  const [headquarters, setHeadquarters] = useState('');
  const [description, setDescription] = useState('');
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
        setIndustry(profile.industry ?? '');
        setSelectedSize(profile.companySize);
        setHeadquarters(profile.headquarters ?? '');
        setDescription(profile.description ?? '');
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

  const handleContinue = async (): Promise<void> => {
    if (isSubmitting) return;

    const cleanIndustry = industry.trim();
    const cleanHeadquarters = headquarters.trim();
    const cleanDescription = description.trim();

    if (!cleanIndustry) {
      setSubmitError('Enter your company industry.');
      return;
    }
    if (cleanIndustry.length > 255) {
      setSubmitError('Industry must be 255 characters or fewer.');
      return;
    }
    if (!selectedSize) {
      setSubmitError('Select a company size.');
      return;
    }
    if (!cleanHeadquarters) {
      setSubmitError('Enter your company headquarters.');
      return;
    }
    if (cleanHeadquarters.length > 255) {
      setSubmitError('Headquarters must be 255 characters or fewer.');
      return;
    }
    if (!cleanDescription) {
      setSubmitError('Enter a company description.');
      return;
    }
    if (cleanDescription.length > 5000) {
      setSubmitError('Company description must be 5,000 characters or fewer.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await companyApi.updateMe({
        industry: cleanIndustry,
        companySize: selectedSize,
        headquarters: cleanHeadquarters,
        description: cleanDescription,
      });
      navigation.navigate('RecruitmentPreferences');
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
          <Text style={styles.stateText}>Loading company details...</Text>
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step indicator */}
        <View style={styles.stepRow}>
          <Text style={styles.stepText}>Company setup · Step 2 of 4</Text>
          <Text style={styles.stepPercent}>50%</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '50%' }]} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Company details</Text>
        <Text style={styles.subtitle}>Help students understand your business.</Text>

        {/* Industry */}
        <Text style={styles.sectionLabel}>INDUSTRY</Text>
        <View style={styles.inputRow}>
          <Ionicons name="business-outline" size={16} color={colors.subtitle} style={{ marginRight: 10 }} />
          <TextInput
            style={styles.input}
            value={industry}
            onChangeText={(value) => {
              setIndustry(value);
              setSubmitError(null);
            }}
            placeholder="e.g. Software & SaaS"
            placeholderTextColor={colors.placeholder}
            maxLength={255}
            editable={!isSubmitting}
          />
        </View>

        {/* Company size */}
        <Text style={styles.sectionLabel}>COMPANY SIZE</Text>
        <View style={styles.sizeRow}>
          {COMPANY_SIZES.map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.sizeButton,
                selectedSize === size && styles.sizeButtonSelected,
              ]}
              onPress={() => {
                setSelectedSize(size);
                setSubmitError(null);
              }}
              activeOpacity={0.7}
              disabled={isSubmitting}
            >
              <Text
                style={[
                  styles.sizeButtonText,
                  selectedSize === size && styles.sizeButtonTextSelected,
                ]}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Headquarters */}
        <Text style={styles.sectionLabel}>HEADQUARTERS</Text>
        <View style={styles.inputRow}>
          <Ionicons name="location-outline" size={16} color={colors.subtitle} style={{ marginRight: 10 }} />
          <TextInput
            style={styles.input}
            value={headquarters}
            onChangeText={(value) => {
              setHeadquarters(value);
              setSubmitError(null);
            }}
            placeholder="e.g. San Francisco, CA"
            placeholderTextColor={colors.placeholder}
            maxLength={255}
            editable={!isSubmitting}
          />
        </View>

        {/* Company description */}
        <Text style={styles.sectionLabel}>COMPANY DESCRIPTION</Text>
        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={(value) => {
              setDescription(value);
              setSubmitError(null);
            }}
            placeholder="Tell students about your company..."
            placeholderTextColor={colors.placeholder}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            maxLength={5000}
            editable={!isSubmitting}
          />
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
    fontSize: 11,
    fontWeight: '700',
    color: colors.placeholder,
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  sizeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  sizeButtonSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  sizeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.title,
  },
  sizeButtonTextSelected: {
    color: colors.onPrimary,
  },
  textAreaContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 32,
  },
  textArea: {
    fontSize: 14,
    color: colors.text,
    minHeight: 120,
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

export default CompanyDetailsScreen;
