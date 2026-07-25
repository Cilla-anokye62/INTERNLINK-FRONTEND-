import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  completeUniversityOnboarding,
  getAuthErrorMessage,
  signOut,
  universityApi,
  type UniversityProfileResponse,
} from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import type { RootStackParamList } from '../../types/navigation';

type Props = StackScreenProps<RootStackParamList, 'ReviewComplete'>;
type EditRoute = 'UniversityInfo' | 'InstitutionDetails' | 'CareerServicesSetup';
type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface ReviewRow {
  id: string;
  icon: IconName;
  title: string;
  detail: string;
  route: EditRoute;
}

const REQUIRED_FIELD_COUNT = 12;

const hasText = (value: string | null | undefined): boolean => Boolean(value?.trim());

const valueOrMissing = (value: string | null | undefined, fallback: string): string =>
  hasText(value) ? value!.trim() : fallback;

export default function ReviewCompleteScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [university, setUniversity] = useState<UniversityProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const loadUniversity = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setLoadError(null);
    try {
      setUniversity(await universityApi.getMe());
    } catch (error) {
      setLoadError(getAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadUniversity();
    }, [loadUniversity]),
  );

  const missingRequiredFields = useMemo(() => {
    if (!university) return [];

    const fields = [
      { label: 'university name', complete: hasText(university.name) },
      { label: 'phone number', complete: hasText(university.phoneNumber) },
      { label: 'website', complete: hasText(university.website) },
      { label: 'institution type', complete: hasText(university.institutionType) },
      { label: 'country', complete: hasText(university.country) },
      { label: 'city', complete: hasText(university.city) },
      { label: 'student count', complete: university.studentCount !== null },
      { label: 'academic programs', complete: university.academicPrograms.length > 0 },
      {
        label: 'career services contact',
        complete: hasText(university.careerServicesContactName),
      },
      { label: 'department email', complete: hasText(university.departmentEmail) },
      {
        label: 'internship coordinator',
        complete: hasText(university.internshipCoordinatorName),
      },
      {
        label: 'coordinator email',
        complete: hasText(university.internshipCoordinatorEmail),
      },
    ];

    return fields.filter((field) => !field.complete).map((field) => field.label);
  }, [university]);

  const completeness = university
    ? Math.round(
        ((REQUIRED_FIELD_COUNT - missingRequiredFields.length) / REQUIRED_FIELD_COUNT) * 100,
      )
    : 0;
  const canComplete = Boolean(university) && missingRequiredFields.length === 0;
  const isBusy = isCompleting || isSigningOut;

  const reviewRows = useMemo<ReviewRow[]>(() => {
    if (!university) return [];

    return [
      {
        id: 'universityInfo',
        icon: 'school-outline',
        title: 'University information',
        detail: [
          valueOrMissing(university.name, 'Name missing'),
          valueOrMissing(university.contactEmail, 'Email missing'),
          valueOrMissing(university.phoneNumber, 'Phone missing'),
          valueOrMissing(university.website, 'Website missing'),
        ].join(' · '),
        route: 'UniversityInfo',
      },
      {
        id: 'institutionDetails',
        icon: 'business-outline',
        title: 'Institution details',
        detail: [
          valueOrMissing(university.institutionType, 'Type missing'),
          [university.city, university.country].filter(hasText).join(', ') || 'Location missing',
          university.studentCount === null
            ? 'Student count missing'
            : `${university.studentCount.toLocaleString()} students`,
          `${university.academicPrograms.length} ${
            university.academicPrograms.length === 1 ? 'program' : 'programs'
          }`,
        ].join(' · '),
        route: 'InstitutionDetails',
      },
      {
        id: 'careerServices',
        icon: 'people-outline',
        title: 'Career services',
        detail: [
          valueOrMissing(university.careerServicesContactName, 'Contact missing'),
          valueOrMissing(university.departmentEmail, 'Email missing'),
        ].join(' · '),
        route: 'CareerServicesSetup',
      },
      {
        id: 'coordinator',
        icon: 'briefcase-outline',
        title: 'Internship coordinator',
        detail: [
          valueOrMissing(university.internshipCoordinatorName, 'Coordinator missing'),
          valueOrMissing(university.internshipCoordinatorEmail, 'Email missing'),
        ].join(' · '),
        route: 'CareerServicesSetup',
      },
    ];
  }, [university]);

  const handleComplete = async (): Promise<void> => {
    if (!canComplete || isBusy) return;

    setActionError(null);
    setIsCompleting(true);
    try {
      await completeUniversityOnboarding();
    } catch (error) {
      setActionError(getAuthErrorMessage(error));
      setIsCompleting(false);
    }
  };

  const handleSaveForLater = async (): Promise<void> => {
    if (isBusy) return;

    setActionError(null);
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      setActionError(getAuthErrorMessage(error));
      setIsSigningOut(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.stateTitle}>Loading university profile</Text>
          <Text style={styles.stateMessage}>Fetching the information you already saved.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loadError || !university) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredState}>
          <Ionicons name="alert-circle-outline" size={36} color={colors.accent} />
          <Text style={styles.stateTitle}>Couldn’t load your university profile</Text>
          <Text style={styles.stateMessage}>
            {loadError ?? 'The university profile was not returned. Please try again.'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => void loadUniversity()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const universityInitial = university.name.trim().charAt(0).toUpperCase() || 'U';
  const location = [university.city, university.country].filter(hasText).join(', ');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.stepRow}>
          <Text style={styles.stepLabel}>University setup · Step 4 of 4</Text>
          <Text style={styles.stepPercent}>100%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>

        <Text style={styles.title}>Review & complete</Text>
        <Text style={styles.subtitle}>Confirm your university profile before continuing.</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{universityInitial}</Text>
            </View>
            <View style={styles.summaryTextBlock}>
              <Text style={styles.summaryName}>{university.name}</Text>
              <Text style={styles.summaryDetail}>
                {location || 'Location incomplete'}
                {university.studentCount === null
                  ? ''
                  : ` · ${university.studentCount.toLocaleString()} students`}
              </Text>
            </View>
            <View style={styles.completenessPill}>
              <Text style={styles.completenessText}>{completeness}%</Text>
            </View>
          </View>
          <View style={styles.summaryBarTrack}>
            <View
              style={[
                styles.summaryBarFill,
                { width: `${completeness}%` as `${number}%` },
              ]}
            />
          </View>
        </View>

        {reviewRows.map((row) => (
          <View key={row.id} style={styles.reviewRow}>
            <Ionicons name={row.icon} size={18} color={colors.accent} style={styles.rowIcon} />
            <View style={styles.rowTextBlock}>
              <Text style={styles.rowTitle}>{row.title}</Text>
              <Text style={styles.rowSubtitle} numberOfLines={2}>{row.detail}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate(row.route)}
              accessibilityRole="button"
              accessibilityLabel={`Edit ${row.title}`}
            >
              <Ionicons name="create-outline" size={16} color={colors.subtitle} />
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.banner}>
          <Ionicons name="information-circle-outline" size={17} color={colors.accent} style={styles.rowIcon} />
          <Text style={styles.bannerText}>
            {canComplete
              ? 'Your university dashboard will open after the server confirms setup.'
              : `${missingRequiredFields.length} required ${
                  missingRequiredFields.length === 1 ? 'field is' : 'fields are'
                } still missing: ${missingRequiredFields.join(', ')}.`}
          </Text>
        </View>

        {actionError ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={17} color={colors.error} style={styles.rowIcon} />
            <Text style={styles.errorText}>{actionError}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.completeButton, (!canComplete || isBusy) && styles.buttonDisabled]}
          onPress={() => void handleComplete()}
          disabled={!canComplete || isBusy}
        >
          {isCompleting ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator size="small" color={colors.onPrimary} />
              <Text style={styles.completeButtonText}>Completing setup…</Text>
            </View>
          ) : (
            <Text style={styles.completeButtonText}>Complete Setup</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveLaterButton, isBusy && styles.buttonDisabled]}
          onPress={() => void handleSaveForLater()}
          disabled={isBusy}
        >
          {isSigningOut ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator size="small" color={colors.title} />
              <Text style={styles.saveLaterButtonText}>Signing out…</Text>
            </View>
          ) : (
            <Text style={styles.saveLaterButtonText}>Save & finish later</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 18, paddingBottom: 40 },
  centeredState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  stateTitle: { color: colors.title, fontSize: 18, fontWeight: '700', marginTop: 16, marginBottom: 6, textAlign: 'center' },
  stateMessage: { color: colors.subtitle, fontSize: 14, lineHeight: 20, textAlign: 'center' },
  retryButton: { backgroundColor: colors.accent, borderRadius: 22, paddingHorizontal: 24, paddingVertical: 11, marginTop: 18 },
  retryButtonText: { color: colors.onPrimary, fontSize: 14, fontWeight: '700' },
  stepRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  stepLabel: { color: colors.accent, fontSize: 12, fontWeight: '600' },
  stepPercent: { color: colors.subtitle, fontSize: 12, fontWeight: '600' },
  progressTrack: { height: 5, backgroundColor: colors.inputBorder, borderRadius: 3, overflow: 'hidden', marginBottom: 22 },
  progressFill: { height: '100%', backgroundColor: colors.accent },
  title: { color: colors.title, fontSize: 26, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: colors.subtitle, fontSize: 14, lineHeight: 20, marginBottom: 20 },
  summaryCard: { backgroundColor: colors.card, borderColor: colors.inputBorder, borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 16 },
  summaryTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 13 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: colors.onPrimary, fontSize: 18, fontWeight: '700' },
  summaryTextBlock: { flex: 1, marginRight: 8 },
  summaryName: { color: colors.title, fontSize: 16, fontWeight: '700', marginBottom: 3 },
  summaryDetail: { color: colors.subtitle, fontSize: 12 },
  completenessPill: { backgroundColor: colors.iconCircle, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5 },
  completenessText: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  summaryBarTrack: { height: 5, backgroundColor: colors.inputBorder, borderRadius: 3, overflow: 'hidden' },
  summaryBarFill: { height: '100%', backgroundColor: colors.accent },
  reviewRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderColor: colors.inputBorder, borderWidth: 1, borderRadius: 14, padding: 13, marginBottom: 10 },
  rowIcon: { marginRight: 10 },
  rowTextBlock: { flex: 1 },
  rowTitle: { color: colors.title, fontSize: 14, fontWeight: '700', marginBottom: 2 },
  rowSubtitle: { color: colors.subtitle, fontSize: 12, lineHeight: 17 },
  editButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginLeft: 8, backgroundColor: colors.iconCircle },
  banner: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.iconCircle, borderRadius: 13, padding: 13, marginTop: 6, marginBottom: 16 },
  bannerText: { flex: 1, color: colors.accent, fontSize: 12, lineHeight: 18 },
  errorBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderColor: colors.error, borderWidth: 1, borderRadius: 13, padding: 13, marginBottom: 14 },
  errorText: { flex: 1, color: colors.error, fontSize: 12, lineHeight: 18 },
  completeButton: { backgroundColor: colors.accent, borderRadius: 28, paddingVertical: 16, alignItems: 'center', marginBottom: 10 },
  completeButtonText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
  saveLaterButton: { backgroundColor: colors.card, borderColor: colors.inputBorder, borderWidth: 1, borderRadius: 28, paddingVertical: 15, alignItems: 'center' },
  saveLaterButtonText: { color: colors.title, fontSize: 15, fontWeight: '600' },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  buttonDisabled: { opacity: 0.55 },
});
