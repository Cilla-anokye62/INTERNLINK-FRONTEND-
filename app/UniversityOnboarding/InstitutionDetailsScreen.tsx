import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getAuthErrorMessage, universityApi } from '../../src/api';
import type { UniversityInstitutionType } from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';

const INSTITUTION_TYPES: UniversityInstitutionType[] = ['Public', 'Private', 'Hybrid'];
const MAX_PROGRAMS = 50;
const MAX_PROGRAM_LENGTH = 100;
const MAX_INTEGER = 2_147_483_647;

export default function InstitutionDetailsScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const [institutionType, setInstitutionType] = useState<UniversityInstitutionType | null>(null);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [studentCount, setStudentCount] = useState('');
  const [academicPrograms, setAcademicPrograms] = useState<string[]>([]);
  const [programInput, setProgramInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    setIsLoading(true);
    setLoadError(null);
    universityApi.getMe()
      .then((profile) => {
        if (!active) return;

        setInstitutionType(profile.institutionType);
        setCountry(profile.country ?? '');
        setCity(profile.city ?? '');
        setStudentCount(profile.studentCount === null ? '' : String(profile.studentCount));

        const uniquePrograms = profile.academicPrograms.reduce<string[]>((programs, program) => {
          const cleanProgram = program.trim();
          const alreadyAdded = programs.some(
            (savedProgram) => savedProgram.toLocaleLowerCase() === cleanProgram.toLocaleLowerCase(),
          );
          if (cleanProgram && !alreadyAdded) programs.push(cleanProgram);
          return programs;
        }, []);
        setAcademicPrograms(uniquePrograms);
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

  const addProgram = () => {
    const cleanProgram = programInput.trim();

    if (!cleanProgram) {
      setFormError('Enter an academic program before tapping Add.');
      return;
    }
    if (cleanProgram.length > MAX_PROGRAM_LENGTH) {
      setFormError(`Each academic program must be ${MAX_PROGRAM_LENGTH} characters or fewer.`);
      return;
    }
    if (academicPrograms.length >= MAX_PROGRAMS) {
      setFormError(`You can add up to ${MAX_PROGRAMS} academic programs.`);
      return;
    }
    if (
      academicPrograms.some(
        (program) => program.toLocaleLowerCase() === cleanProgram.toLocaleLowerCase(),
      )
    ) {
      setFormError('That academic program has already been added.');
      return;
    }

    setAcademicPrograms((programs) => [...programs, cleanProgram]);
    setProgramInput('');
    setFormError(null);
  };

  const removeProgram = (programToRemove: string) => {
    setAcademicPrograms((programs) => programs.filter((program) => program !== programToRemove));
    setFormError(null);
  };

  const handleContinue = async () => {
    if (isSubmitting) return;

    const cleanCountry = country.trim();
    const cleanCity = city.trim();
    const cleanStudentCount = studentCount.trim();
    const cleanPrograms = academicPrograms.map((program) => program.trim());

    if (!institutionType || !INSTITUTION_TYPES.includes(institutionType)) {
      setFormError('Select whether your institution is Public, Private, or Hybrid.');
      return;
    }
    if (!cleanCountry) {
      setFormError('Enter the country where your institution is located.');
      return;
    }
    if (cleanCountry.length > 100) {
      setFormError('Country must be 100 characters or fewer.');
      return;
    }
    if (!cleanCity) {
      setFormError('Enter the city where your institution is located.');
      return;
    }
    if (cleanCity.length > 255) {
      setFormError('City must be 255 characters or fewer.');
      return;
    }
    if (!/^\d+$/.test(cleanStudentCount)) {
      setFormError('Enter the number of students as a whole number, using digits only.');
      return;
    }

    const parsedStudentCount = Number(cleanStudentCount);
    if (
      !Number.isSafeInteger(parsedStudentCount)
      || parsedStudentCount < 0
      || parsedStudentCount > MAX_INTEGER
    ) {
      setFormError('Number of students must be a non-negative whole number.');
      return;
    }
    if (programInput.trim()) {
      setFormError('Tap Add to include the academic program you entered.');
      return;
    }
    if (cleanPrograms.length === 0) {
      setFormError('Add at least one academic program.');
      return;
    }
    if (cleanPrograms.length > MAX_PROGRAMS) {
      setFormError(`You can add up to ${MAX_PROGRAMS} academic programs.`);
      return;
    }
    if (cleanPrograms.some((program) => !program || program.length > MAX_PROGRAM_LENGTH)) {
      setFormError(`Each academic program must be 1-${MAX_PROGRAM_LENGTH} characters long.`);
      return;
    }
    if (
      new Set(cleanPrograms.map((program) => program.toLocaleLowerCase())).size
      !== cleanPrograms.length
    ) {
      setFormError('Each academic program must be unique.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      await universityApi.updateMe({
        institutionType,
        country: cleanCountry,
        city: cleanCity,
        studentCount: parsedStudentCount,
        academicPrograms: cleanPrograms,
      });
      navigation.navigate('CareerServicesSetup');
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.stateText}>Loading institution details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loadError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.stateContainer}>
          <Ionicons name="cloud-offline-outline" size={34} color={colors.error} />
          <Text style={styles.errorText}>{loadError}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setLoadAttempt((attempt) => attempt + 1)}
            activeOpacity={0.8}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.stepRow}>
            <Text style={styles.stepText}>University setup · Step 2 of 4</Text>
            <Text style={styles.stepPercent}>50%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '50%' }]} />
          </View>

          <Text style={styles.title}>Institution details</Text>
          <Text style={styles.subtitle}>Tell employers about your campus.</Text>

          <Text style={styles.sectionLabel}>INSTITUTION TYPE</Text>
          <View style={styles.typeRow}>
            {INSTITUTION_TYPES.map((type) => {
              const isSelected = institutionType === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeButton, isSelected && styles.typeButtonSelected]}
                  onPress={() => {
                    setInstitutionType(type);
                    setFormError(null);
                  }}
                  activeOpacity={0.8}
                  disabled={isSubmitting}
                >
                  <Text
                    style={[styles.typeButtonText, isSelected && styles.typeButtonTextSelected]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>COUNTRY</Text>
          <View style={styles.inputRow}>
            <Ionicons name="location-outline" size={18} color={colors.subtitle} />
            <TextInput
              style={styles.input}
              value={country}
              onChangeText={(value) => {
                setCountry(value);
                setFormError(null);
              }}
              placeholder="e.g. Ghana"
              placeholderTextColor={colors.placeholder}
              maxLength={100}
              editable={!isSubmitting}
              autoCapitalize="words"
            />
          </View>

          <Text style={styles.sectionLabel}>CITY</Text>
          <View style={styles.inputRow}>
            <Ionicons name="business-outline" size={18} color={colors.subtitle} />
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={(value) => {
                setCity(value);
                setFormError(null);
              }}
              placeholder="e.g. Kumasi"
              placeholderTextColor={colors.placeholder}
              maxLength={255}
              editable={!isSubmitting}
              autoCapitalize="words"
            />
          </View>

          <Text style={styles.sectionLabel}>NUMBER OF STUDENTS</Text>
          <View style={styles.inputRow}>
            <Ionicons name="people-outline" size={18} color={colors.subtitle} />
            <TextInput
              style={styles.input}
              value={studentCount}
              onChangeText={(value) => {
                setStudentCount(value);
                setFormError(null);
              }}
              placeholder="e.g. 11520"
              placeholderTextColor={colors.placeholder}
              keyboardType="number-pad"
              maxLength={10}
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.programHeader}>
            <Text style={styles.sectionLabel}>ACADEMIC PROGRAMS OFFERED</Text>
            <Text style={styles.programCount}>{academicPrograms.length}/{MAX_PROGRAMS}</Text>
          </View>
          <Text style={styles.programHelp}>
            Enter one program at a time, then tap Add.
          </Text>
          <View style={styles.programEntryRow}>
            <View style={[styles.inputRow, styles.programInputRow]}>
              <Ionicons name="book-outline" size={18} color={colors.subtitle} />
              <TextInput
                style={styles.input}
                value={programInput}
                onChangeText={(value) => {
                  setProgramInput(value);
                  setFormError(null);
                }}
                placeholder="e.g. Computer Science"
                placeholderTextColor={colors.placeholder}
                maxLength={MAX_PROGRAM_LENGTH}
                editable={!isSubmitting && academicPrograms.length < MAX_PROGRAMS}
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={addProgram}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.addButton,
                (isSubmitting || academicPrograms.length >= MAX_PROGRAMS) && styles.disabledButton,
              ]}
              onPress={addProgram}
              activeOpacity={0.8}
              disabled={isSubmitting || academicPrograms.length >= MAX_PROGRAMS}
            >
              <Ionicons name="add" size={19} color={colors.onPrimary} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {academicPrograms.length > 0 ? (
            <View style={styles.programList}>
              {academicPrograms.map((program, index) => (
                <View key={`${program}-${index}`} style={styles.programTag}>
                  <Text style={styles.programTagText}>{program}</Text>
                  <TouchableOpacity
                    onPress={() => removeProgram(program)}
                    disabled={isSubmitting}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${program}`}
                    hitSlop={8}
                  >
                    <Ionicons name="close-circle" size={18} color={colors.accent} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyPrograms}>
              <Text style={styles.emptyProgramsText}>No academic programs added yet.</Text>
            </View>
          )}

          {formError ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={18} color={colors.error} />
              <Text style={styles.errorBannerText}>{formError}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.continueButton, isSubmitting && styles.disabledButton]}
            onPress={handleContinue}
            activeOpacity={0.8}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={colors.onPrimary} />
            ) : (
              <>
                <Text style={styles.continueButtonText}>Continue</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.onPrimary} />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  flex: {
    flex: 1,
  },
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
    lineHeight: 19,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.card,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  stepPercent: {
    color: colors.subtitle,
    fontSize: 13,
    fontWeight: '600',
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.inputBorder,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 22,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  title: {
    color: colors.title,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: colors.subtitle,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  sectionLabel: {
    color: colors.placeholder,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  typeButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.inputBorder,
    borderWidth: 1,
    borderRadius: 22,
    paddingVertical: 12,
  },
  typeButtonSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  typeButtonText: {
    color: colors.title,
    fontSize: 13,
    fontWeight: '600',
  },
  typeButtonTextSelected: {
    color: colors.onPrimary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 52,
    backgroundColor: colors.card,
    borderColor: colors.inputBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    paddingVertical: 12,
  },
  programHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  programCount: {
    color: colors.subtitle,
    fontSize: 12,
    marginBottom: 8,
  },
  programHelp: {
    color: colors.subtitle,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  programEntryRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
  },
  programInputRow: {
    flex: 1,
  },
  addButton: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  addButtonText: {
    color: colors.onPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  programList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 22,
  },
  programTag: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.card,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 8,
  },
  programTagText: {
    flexShrink: 1,
    color: colors.title,
    fontSize: 13,
    fontWeight: '600',
  },
  emptyPrograms: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.inputBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 22,
  },
  emptyProgramsText: {
    color: colors.subtitle,
    fontSize: 12,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.card,
    borderColor: colors.error,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    flex: 1,
    color: colors.error,
    fontSize: 12,
    lineHeight: 17,
  },
  continueButton: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: 26,
    paddingVertical: 15,
  },
  continueButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
