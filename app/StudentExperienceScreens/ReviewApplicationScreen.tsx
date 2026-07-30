import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ApiError,
  applicationApi,
  getAuthErrorMessage,
  studentApi,
  type StudentProfileResponse,
} from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useSubscription } from '../../src/context/SubscriptionContext';
import type { InternshipData } from '../../src/types/application';

export default function ReviewApplicationScreen({ navigation, route }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { refresh: refreshSubscription } = useSubscription();
  const internship: InternshipData | undefined = route.params?.internship;
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    studentApi.getMe()
      .then(setProfile)
      .catch((loadError) => setError(getAuthErrorMessage(loadError)))
      .finally(() => setLoading(false));
  }, []);

  const submit = async () => {
    if (!internship?.backendListingId || submitting) {
      if (!internship?.backendListingId) {
        setError('This listing is not connected to the backend and cannot accept applications.');
      }
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const availability = route.params?.availability;
      const resume = route.params?.resume;
      const result = await applicationApi.apply(internship.backendListingId, {
        coverLetter: route.params?.coverLetter,
        motivation: route.params?.motivation,
        whyThisInternship: route.params?.whyThis,
        strongCandidate: route.params?.strongCandidate,
        portfolioLinks: route.params?.portfolioLinks,
        earliestStartDate: availability?.earliestStartDate,
        expectedDuration: availability?.expectedDuration,
        preferredWorkMode: availability?.preferredWorkMode,
        canRelocate: availability?.canRelocate,
      }, resume);
      await refreshSubscription();
      navigation.replace('ApplicationSubmitted', {
        applicationId: String(result.id),
        company: result.companyName,
        title: result.listingTitle,
      });
    } catch (submitError) {
      if (submitError instanceof ApiError && submitError.status === 402) {
        Alert.alert(
          'Application limit reached',
          'You have used all three free applications. Upgrade to Premium for unlimited applications.',
          [
            { text: 'Not now', style: 'cancel' },
            {
              text: 'View Premium',
              onPress: () => navigation.navigate('PremiumPlans', { source: 'application-limit' }),
            },
          ],
        );
      } else if (submitError instanceof ApiError && submitError.status === 409) {
        const existing = await applicationApi
          .findOwnByListing(internship.backendListingId)
          .catch(() => null);
        if (existing) {
          Alert.alert(
            'Application already submitted',
            'You have already applied to this internship.',
            [
              {
                text: 'View application',
                onPress: () => navigation.replace('ApplicationDetails', {
                  application: existing,
                }),
              },
            ],
          );
        } else {
          setError(getAuthErrorMessage(submitError));
        }
      } else {
        setError(getAuthErrorMessage(submitError));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!internship) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center]}>
        <Text style={styles.error}>No internship was selected.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.title} />
        </TouchableOpacity>
        <Text style={styles.title}>Review Application</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>INTERNSHIP</Text>
              <Text style={styles.cardTitle}>{internship.title}</Text>
              <Text style={styles.cardSubtitle}>{internship.company} · {internship.location}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionLabel}>APPLICANT</Text>
              <InfoRow label="Name" value={profile?.fullName ?? 'Not available'} styles={styles} />
              <InfoRow label="Email" value={profile?.email ?? 'Not available'} styles={styles} />
              <InfoRow label="Program" value={profile?.program ?? 'Not provided'} styles={styles} />
              <InfoRow label="Level" value={profile?.level ?? 'Not provided'} styles={styles} />
            </View>

            <View style={styles.notice}>
              <Ionicons name="information-circle-outline" size={21} color={colors.accent} />
              <Text style={styles.noticeText}>
                {route.params?.resume
                  ? 'Your selected resume will be uploaded securely with this application. '
                  : 'This listing does not require a resume. '}
                You can also create and submit supported document drafts after applying.
              </Text>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.disabled]}
              onPress={() => void submit()}
              disabled={submitting}
            >
              {submitting
                ? <ActivityIndicator color={colors.onPrimary} />
                : <Text style={styles.submitText}>Submit Application</Text>}
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

function InfoRow({
  label,
  value,
  styles,
}: {
  label: string;
  value: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 8 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    marginRight: 12,
  },
  title: { color: colors.title, fontSize: 21, fontWeight: '800' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  content: { padding: 20, paddingTop: 12, paddingBottom: 110 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: 17,
    marginBottom: 12,
  },
  sectionLabel: { color: colors.accent, fontSize: 11, fontWeight: '800', letterSpacing: 0.8, marginBottom: 9 },
  cardTitle: { color: colors.title, fontSize: 18, fontWeight: '800' },
  cardSubtitle: { color: colors.subtitle, fontSize: 13, marginTop: 5 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 18,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.inputBorder,
  },
  infoLabel: { color: colors.subtitle, fontSize: 13 },
  infoValue: { color: colors.text, fontSize: 13, fontWeight: '600', flex: 1, textAlign: 'right' },
  notice: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: colors.iconCircle,
    borderRadius: 13,
    padding: 15,
  },
  noticeText: { color: colors.text, fontSize: 12, lineHeight: 18, flex: 1 },
  error: { color: colors.danger, fontSize: 13, marginTop: 13, textAlign: 'center' },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.inputBorder,
  },
  submitButton: {
    minHeight: 50,
    borderRadius: 25,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: { color: colors.onPrimary, fontSize: 15, fontWeight: '800' },
  disabled: { opacity: 0.6 },
});
