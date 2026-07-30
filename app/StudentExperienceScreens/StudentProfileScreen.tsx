import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import {
  applicationApi,
  getAuthErrorMessage,
  studentApi,
  resolveMediaUrl,
  type BackendApplicationResponse,
  type StudentProfileResponse,
} from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { TAB_BAR_BOTTOM_PADDING } from '../../src/constants/Colors';
import {
  ApplicationLimitIndicator,
  SubscriptionStatusCard,
} from '../../src/components/PremiumComponents';
import { useSubscription } from '../../src/context/SubscriptionContext';

export default function StudentProfileScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {
    snapshot,
    entitlement,
    hasFeature,
    refresh: refreshSubscription,
  } = useSubscription();
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);
  const [applications, setApplications] = useState<BackendApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProfile = useCallback(async () => {
    setError('');
    try {
      const [profileResult, applicationResults] = await Promise.all([
        studentApi.getMe(),
        applicationApi.listOwn(),
        refreshSubscription(),
      ]);
      setProfile(profileResult);
      setApplications(applicationResults);
    } catch (loadError) {
      setError(getAuthErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [refreshSubscription]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      void loadProfile();
    }, [loadProfile]),
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => void loadProfile()}
            colors={[colors.accent]}
            tintColor={colors.accent}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Settings', { role: 'student' })}>
            <Ionicons name="settings-outline" size={19} color={colors.title} />
          </TouchableOpacity>
        </View>

        {error ? (
          <TouchableOpacity style={styles.errorCard} onPress={() => void loadProfile()}>
            <Text style={styles.errorText}>{error} Tap to retry.</Text>
          </TouchableOpacity>
        ) : null}

        {!profile && loading ? (
          <ActivityIndicator color={colors.accent} />
        ) : profile ? (
          <>
            <View style={styles.profileCard}>
              {profile.profileImageUrl ? (
                <Image
                  source={{ uri: resolveMediaUrl(profile.profileImageUrl) || undefined }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{profile.fullName.charAt(0).toUpperCase()}</Text>
                </View>
              )}
              <Text style={styles.name}>{profile.fullName}</Text>
              <Text style={styles.subtitle}>
                {[profile.program, profile.level, profile.universityName].filter(Boolean).join(' · ') || 'Student'}
              </Text>
              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{profile.emailVerified ? 'Verified' : 'Unverified'}</Text>
                </View>
                {profile.subscriptionActive ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{profile.subscriptionPlan}</Text>
                  </View>
                ) : null}
              </View>
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{applications.length}</Text>
                  <Text style={styles.statLabel}>Applied</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>
                    {hasFeature('STUDENT_APPLICATION_TRACKING')
                      ? applications.filter((application) => application.status === 'ACCEPTED').length
                      : '—'}
                  </Text>
                  <Text style={styles.statLabel}>
                    {hasFeature('STUDENT_APPLICATION_TRACKING') ? 'Accepted' : 'Premium status'}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{profile.freeApplicationsRemaining}</Text>
                  <Text style={styles.statLabel}>Free left</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('StudentEditProfile')}>
                <Text style={styles.primaryButtonText}>Edit profile</Text>
              </TouchableOpacity>
            </View>

            <SubscriptionStatusCard
              snapshot={snapshot}
              onPress={() => navigation.navigate('Subscription')}
            />
            <ApplicationLimitIndicator
              entitlement={entitlement('STUDENT_APPLICATIONS')}
              onUpgrade={() => navigation.navigate('PremiumPlans', { source: 'profile' })}
            />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bodyText}>{profile.background || profile.personalEssay || 'No profile summary added yet.'}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.chips}>
                {profile.skills.length === 0 ? (
                  <Text style={styles.bodyText}>No skills added yet.</Text>
                ) : profile.skills.map((skill) => (
                  <View key={skill} style={styles.chip}>
                    <Text style={styles.chipText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Career preferences</Text>
              <InfoRow label="Interests" value={profile.careerInterests.join(', ') || 'Not provided'} styles={styles} />
              <InfoRow label="Location" value={profile.preferredLocation || 'Not provided'} styles={styles} />
              <InfoRow label="Relocation" value={profile.willingToRelocate ? 'Willing to relocate' : 'Not specified'} styles={styles} />
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoRow = ({ label, value, styles }: { label: string; value: string; styles: any }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: TAB_BAR_BOTTOM_PADDING, gap: 13 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: colors.title, fontSize: 24, fontWeight: '700' },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  errorCard: { padding: 12, borderRadius: 12, backgroundColor: colors.withdrawBg },
  errorText: { color: colors.withdrawText, fontSize: 12 },
  profileCard: { alignItems: 'center', padding: 20, borderRadius: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 11 },
  avatarImage: { width: 70, height: 70, borderRadius: 35, marginBottom: 11, backgroundColor: colors.iconCircle },
  avatarText: { color: colors.onPrimary, fontSize: 25, fontWeight: '800' },
  name: { color: colors.title, fontSize: 19, fontWeight: '700' },
  subtitle: { color: colors.subtitle, fontSize: 12, marginTop: 4, textAlign: 'center' },
  badgeRow: { flexDirection: 'row', gap: 8, marginTop: 11 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14, backgroundColor: colors.iconCircle },
  badgeText: { color: colors.accent, fontSize: 10, fontWeight: '700' },
  statsRow: { width: '100%', flexDirection: 'row', marginTop: 18, paddingVertical: 12, borderRadius: 13, backgroundColor: colors.background },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { color: colors.title, fontSize: 19, fontWeight: '800' },
  statLabel: { color: colors.subtitle, fontSize: 10, marginTop: 3 },
  divider: { width: 1, backgroundColor: colors.inputBorder },
  primaryButton: { width: '100%', minHeight: 44, borderRadius: 22, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginTop: 15 },
  primaryButtonText: { color: colors.onPrimary, fontSize: 13, fontWeight: '700' },
  section: { padding: 16, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder },
  sectionTitle: { color: colors.title, fontSize: 15, fontWeight: '700', marginBottom: 9 },
  bodyText: { color: colors.subtitle, fontSize: 13, lineHeight: 20 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  chip: { paddingHorizontal: 11, paddingVertical: 6, borderRadius: 16, backgroundColor: colors.iconCircle },
  chipText: { color: colors.accent, fontSize: 11, fontWeight: '600' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, borderTopWidth: 1, borderTopColor: colors.inputBorder },
  infoLabel: { color: colors.subtitle, fontSize: 12 },
  infoValue: { color: colors.title, fontSize: 12, fontWeight: '600', maxWidth: '65%', textAlign: 'right' },
});
