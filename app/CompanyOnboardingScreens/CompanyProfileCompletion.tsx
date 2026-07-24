import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import {
  companyApi,
  completeCompanyOnboarding,
  getAuthErrorMessage,
  signOut,
  type CompanyProfileResponse,
} from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import type { RootStackParamList } from '../../types/navigation';

type EditableCompanyRoute =
  | 'CompanyInformation'
  | 'CompanyDetails'
  | 'RecruitmentPreferences';

interface SummaryRow {
  icon: string;
  title: string;
  subtitle: string;
  route: EditableCompanyRoute;
}

interface SummaryRowItemProps {
  row: SummaryRow;
  onEdit: () => void;
  colors: any;
}

type Props = StackScreenProps<RootStackParamList, 'CompanyProfileCompletion'>;

const REQUIRED_FIELD_COUNT = 10;

const hasText = (value: string | null | undefined): boolean => Boolean(value?.trim());

const displayValue = (value: string | null | undefined, fallback: string): string =>
  hasText(value) ? value!.trim() : fallback;

const SummaryRowItem: React.FC<SummaryRowItemProps> = ({ row, onEdit, colors }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      paddingVertical: 12,
      paddingHorizontal: 14,
      marginBottom: 10,
    }}
  >
    <Ionicons
      name={row.icon as any}
      size={16}
      color={colors.subtitle}
      style={{ marginRight: 12 }}
    />

    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: '700',
          color: colors.title,
          marginBottom: 2,
        }}
      >
        {row.title}
      </Text>
      <Text
        numberOfLines={2}
        style={{
          fontSize: 12,
          color: colors.subtitle,
        }}
      >
        {row.subtitle}
      </Text>
    </View>

    <TouchableOpacity
      onPress={onEdit}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      accessibilityRole="button"
      accessibilityLabel={`Edit ${row.title}`}
    >
      <Ionicons name="create-outline" size={16} color={colors.subtitle} />
    </TouchableOpacity>
  </View>
);

const CompanyProfileCompletion: React.FC<Props> = ({ navigation }) => {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [company, setCompany] = useState<CompanyProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const loadCompany = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setLoadError(null);

    try {
      setCompany(await companyApi.getMe());
    } catch (error) {
      setLoadError(getAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadCompany();
    }, [loadCompany]),
  );

  const missingRequiredFields = useMemo(() => {
    if (!company) return [];

    const fields = [
      { label: 'company name', complete: hasText(company.companyName) },
      { label: 'phone number', complete: hasText(company.phoneNumber) },
      { label: 'website', complete: hasText(company.website) },
      { label: 'industry', complete: hasText(company.industry) },
      { label: 'company size', complete: hasText(company.companySize) },
      { label: 'headquarters', complete: hasText(company.headquarters) },
      { label: 'description', complete: hasText(company.description) },
      {
        label: 'internship categories',
        complete: company.internshipCategories.length > 0,
      },
      {
        label: 'preferred qualifications',
        complete: company.preferredQualifications.length > 0,
      },
      { label: 'work setup', complete: hasText(company.workSetup) },
    ];

    return fields.filter((field) => !field.complete).map((field) => field.label);
  }, [company]);

  const completedRequiredFields = REQUIRED_FIELD_COUNT - missingRequiredFields.length;
  const completeness = company
    ? Math.round((completedRequiredFields / REQUIRED_FIELD_COUNT) * 100)
    : 0;
  const canComplete = Boolean(company) && missingRequiredFields.length === 0;
  const isBusy = isCompleting || isSigningOut;

  const summaryRows = useMemo<SummaryRow[]>(() => {
    if (!company) return [];

    const categoryCount = company.internshipCategories.length;
    const qualificationCount = company.preferredQualifications.length;

    return [
      {
        icon: 'business-outline',
        title: 'Company info',
        subtitle: [
          displayValue(company.companyName, 'Company name missing'),
          displayValue(company.email, 'Email missing'),
          displayValue(company.phoneNumber, 'Phone missing'),
          displayValue(company.website, 'Website missing'),
        ].join(' · '),
        route: 'CompanyInformation',
      },
      {
        icon: 'folder-outline',
        title: 'Details',
        subtitle: [
          displayValue(company.industry, 'Industry missing'),
          company.companySize ? `${company.companySize} employees` : 'Size missing',
          displayValue(company.headquarters, 'Headquarters missing'),
          displayValue(company.description, 'Description missing'),
        ].join(' · '),
        route: 'CompanyDetails',
      },
      {
        icon: 'briefcase-outline',
        title: 'Recruitment',
        subtitle: [
          `${categoryCount} ${categoryCount === 1 ? 'category' : 'categories'}`,
          `${qualificationCount} ${
            qualificationCount === 1 ? 'qualification' : 'qualifications'
          }`,
          displayValue(company.workSetup, 'Work setup missing'),
        ].join(' · '),
        route: 'RecruitmentPreferences',
      },
    ];
  }, [company]);

  const handleCompleteSetup = async (): Promise<void> => {
    if (!canComplete || isBusy) return;

    setActionError(null);
    setIsCompleting(true);
    try {
      await completeCompanyOnboarding();
    } catch (error) {
      setActionError(getAuthErrorMessage(error));
      setIsCompleting(false);
    }
  };

  const handleSaveAndFinishLater = async (): Promise<void> => {
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
          <Text style={styles.stateTitle}>Loading company profile</Text>
          <Text style={styles.stateMessage}>Fetching the details you already saved.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loadError || !company) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredState}>
          <Ionicons name="alert-circle-outline" size={34} color={colors.accent} />
          <Text style={styles.stateTitle}>Couldn’t load your company profile</Text>
          <Text style={styles.stateMessage}>
            {loadError ?? 'Your company profile was not returned. Please try again.'}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => void loadCompany()}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const companyInitial = company.companyName.trim().charAt(0).toUpperCase() || 'C';
  const companyMeta = [
    displayValue(company.industry, 'Industry missing'),
    company.companySize ? `${company.companySize} employees` : 'Size missing',
    displayValue(company.headquarters, 'Headquarters missing'),
  ].join(' · ');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stepRow}>
          <Text style={styles.stepText}>Company setup · Step 4 of 4</Text>
          <Text style={styles.stepPercent}>100%</Text>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>

        <Text style={styles.title}>Review & complete</Text>
        <Text style={styles.subtitle}>Confirm your company profile before going live.</Text>

        <View style={styles.companyCard}>
          <View style={styles.companyCardTop}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{companyInitial}</Text>
            </View>

            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{company.companyName}</Text>
              <Text style={styles.companyMeta}>{companyMeta}</Text>
            </View>

            <View style={styles.scoreBadge}>
              <Text style={styles.scoreBadgeText}>{completeness}%</Text>
            </View>
          </View>

          <View style={styles.companyProgressTrack}>
            <View
              style={[
                styles.companyProgressFill,
                { width: `${completeness}%` as `${number}%` },
              ]}
            />
          </View>
        </View>

        {summaryRows.map((row) => (
          <SummaryRowItem
            key={row.title}
            row={row}
            onEdit={() => navigation.navigate(row.route)}
            colors={colors}
          />
        ))}

        <View style={styles.infoBanner}>
          <Ionicons
            name="document-text-outline"
            size={14}
            color={colors.accent}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.infoBannerText}>
            {canComplete
              ? 'You can post your first internship right after setup.'
              : `${missingRequiredFields.length} required ${
                  missingRequiredFields.length === 1 ? 'field is' : 'fields are'
                } still missing: ${missingRequiredFields.join(', ')}.`}
          </Text>
        </View>

        {actionError ? (
          <View style={styles.actionErrorBanner}>
            <Ionicons
              name="alert-circle-outline"
              size={16}
              color={colors.accent}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.actionErrorText}>{actionError}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[
            styles.completeButton,
            (!canComplete || isBusy) && styles.buttonDisabled,
          ]}
          onPress={() => void handleCompleteSetup()}
          activeOpacity={0.8}
          disabled={!canComplete || isBusy}
          accessibilityRole="button"
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
          onPress={() => void handleSaveAndFinishLater()}
          activeOpacity={0.7}
          disabled={isBusy}
          accessibilityRole="button"
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
};

const createStyles = (colors: any) =>
  StyleSheet.create({
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
    centeredState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 28,
    },
    stateTitle: {
      marginTop: 16,
      marginBottom: 6,
      color: colors.title,
      fontSize: 18,
      fontWeight: '700',
      textAlign: 'center',
    },
    stateMessage: {
      color: colors.subtitle,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
    },
    retryButton: {
      marginTop: 20,
      borderRadius: 24,
      backgroundColor: colors.accent,
      paddingHorizontal: 28,
      paddingVertical: 12,
    },
    retryButtonText: {
      color: colors.onPrimary,
      fontSize: 15,
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
      marginBottom: 20,
    },
    companyCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      padding: 16,
      marginBottom: 16,
    },
    companyCardTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    avatarCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    avatarText: {
      color: colors.onPrimary,
      fontSize: 18,
      fontWeight: '700',
    },
    companyInfo: {
      flex: 1,
      marginRight: 8,
    },
    companyName: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.title,
      marginBottom: 2,
    },
    companyMeta: {
      fontSize: 12,
      color: colors.subtitle,
    },
    scoreBadge: {
      backgroundColor: colors.iconCircle,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 12,
    },
    scoreBadgeText: {
      color: colors.accent,
      fontSize: 12,
      fontWeight: '700',
    },
    companyProgressTrack: {
      height: 4,
      backgroundColor: colors.inputBorder,
      borderRadius: 2,
      overflow: 'hidden',
    },
    companyProgressFill: {
      height: '100%',
      backgroundColor: colors.accent,
      borderRadius: 2,
    },
    infoBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.iconCircle,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 14,
      marginTop: 6,
      marginBottom: 20,
    },
    infoBannerText: {
      flex: 1,
      fontSize: 12,
      lineHeight: 17,
      color: colors.accent,
      fontWeight: '500',
    },
    actionErrorBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.accent,
      borderRadius: 12,
      paddingVertical: 11,
      paddingHorizontal: 14,
      marginBottom: 14,
    },
    actionErrorText: {
      flex: 1,
      color: colors.title,
      fontSize: 12,
      lineHeight: 17,
    },
    completeButton: {
      backgroundColor: colors.accent,
      borderRadius: 30,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 10,
    },
    completeButtonText: {
      color: colors.onPrimary,
      fontSize: 16,
      fontWeight: 'bold',
    },
    saveLaterButton: {
      backgroundColor: colors.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      paddingVertical: 16,
      alignItems: 'center',
    },
    saveLaterButtonText: {
      color: colors.title,
      fontSize: 15,
      fontWeight: '600',
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
  });

export default CompanyProfileCompletion;
