import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { InternshipData } from '../../src/types/application';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import {
  applicationApi,
  bookmarkApi,
  getAuthErrorMessage,
  type BackendApplicationResponse,
} from '../../src/api';
import { ApplicationLimitIndicator } from '../../src/components/PremiumComponents';
import { useSubscription } from '../../src/context/SubscriptionContext';

const { height } = Dimensions.get('window');

export default function InternshipDetailsScreen({ navigation, route }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { entitlement, refresh } = useSubscription();
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existingApplication, setExistingApplication] =
    useState<BackendApplicationResponse | null>(null);
  const [checkingApplication, setCheckingApplication] = useState(true);
  const applicationEntitlement = entitlement('STUDENT_APPLICATIONS');
  const limitReached = Boolean(
    applicationEntitlement?.limit != null
    && applicationEntitlement.remaining != null
    && applicationEntitlement.remaining <= 0,
  );

  const raw = route.params?.internship;

  const internship: InternshipData | null = raw
    ? {
        id: raw.id || 'int-0',
        backendListingId: raw.backendListingId,
        title: raw.title || 'Internship',
        company: raw.company || 'Company',
        companyId: raw.companyId || 'employer-0',
        companyLogo: raw.companyLogo || raw.company?.[0] || 'C',
        companyColor: raw.companyColor || raw.color || '#2CACAD',
        imageUrl: raw.imageUrl || null,
        location: raw.location || '',
        workMode: raw.workMode || (raw.location?.includes('Remote') ? 'remote' : raw.location?.includes('Hybrid') ? 'hybrid' : 'onsite'),
        salary: raw.salary || raw.pay || '',
        duration: raw.duration || '',
        description: raw.description || 'No description provided.',
        responsibilities: raw.responsibilities || [],
        requirements: raw.requirements || raw.skills || [],
        benefits: raw.benefits || [],
        skills: raw.skills || [],
        matchScore: raw.matchScore || raw.match || 0,
        applicants: raw.applicants || 0,
        postedDate: raw.postedDate || new Date(Date.now() - 7 * 86400000).toISOString(),
        closingDate: raw.closingDate || new Date(Date.now() + 30 * 86400000).toISOString(),
        requiredDocuments: raw.requiredDocuments || [],
        allowCoverLetter: raw.allowCoverLetter ?? false,
        resumeRequired: raw.resumeRequired ?? false,
        portfolioRequired: raw.portfolioRequired ?? false,
      }
    : null;

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const loadState = async () => {
        setCheckingApplication(true);
        setExistingApplication(null);
        void refresh();
        const [bookmarksResult, applicationResult] = await Promise.allSettled([
          bookmarkApi.list(),
          internship?.backendListingId
            ? applicationApi.findOwnByListing(internship.backendListingId)
            : Promise.resolve(null),
        ]);
        if (!active) return;
        if (bookmarksResult.status === 'fulfilled') {
          const bookmarks = bookmarksResult.value;
          setIsSaved(Boolean(
            internship?.backendListingId
            && bookmarks.some((bookmark) => bookmark.listingId === internship.backendListingId),
          ));
        }
        if (applicationResult.status === 'fulfilled') {
          setExistingApplication(applicationResult.value);
        }
        setCheckingApplication(false);
      };
      void loadState();
      return () => {
        active = false;
      };
    }, [internship?.backendListingId, refresh]),
  );

  if (!internship) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ color: colors.title, fontSize: 18, fontWeight: '700' }}>Internship details unavailable</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: colors.accent, marginTop: 12, fontWeight: '600' }}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleBookmark = async () => {
    if (!internship.backendListingId || saving) {
      if (!internship.backendListingId) {
        Alert.alert('Internship unavailable', 'This internship is no longer available to save.');
      }
      return;
    }
    setSaving(true);
    try {
      const shouldSave = !isSaved;
      await bookmarkApi.setSaved(internship.backendListingId, shouldSave);
      setIsSaved(shouldSave);
    } catch (error) {
      Alert.alert('Could not update saved internships', getAuthErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleApply = () => {
    if (existingApplication) {
      navigation.navigate('ApplicationDetails', { application: existingApplication });
      return;
    }
    if (limitReached) {
      navigation.navigate('PremiumPlans', { source: 'application-limit' });
      return;
    }
    navigation.navigate('ApplicationReview', { internship });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={20} color={colors.title} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={() => void toggleBookmark()} disabled={saving}>
          {saving
            ? <ActivityIndicator size="small" color={colors.accent} />
            : <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={18} color={isSaved ? colors.accent : colors.title} />}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Company avatar */}
        {internship.imageUrl ? (
          <Image source={{ uri: internship.imageUrl }} style={styles.listingImage} />
        ) : (
          <View style={[styles.companyAvatar, { backgroundColor: internship.companyColor }]}>
            <Text style={styles.companyAvatarText}>{internship.companyLogo}</Text>
          </View>
        )}

        {/* Title */}
        <Text style={styles.title}>{internship.title}</Text>
        <Text style={styles.company}>{internship.company} · {internship.location}</Text>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {internship.matchScore > 0 ? (
            <View style={styles.matchBadge}>
              <Text style={styles.matchText}>{internship.matchScore}% match</Text>
            </View>
          ) : null}
          <View style={styles.tag}>
            <Text style={styles.tagText}>{internship.workMode}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{internship.salary}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{internship.duration}</Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {internship.applicants > 0 ? (
            <>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{internship.applicants}</Text>
                <Text style={styles.statLabel}>Applicants</Text>
              </View>
              <View style={styles.statDivider} />
            </>
          ) : null}
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{new Date(internship.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
            <Text style={styles.statLabel}>Posted</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{new Date(internship.closingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
            <Text style={styles.statLabel}>Closes</Text>
          </View>
        </View>

        {/* About the role */}
        <Text style={styles.sectionTitle}>About the role</Text>
        <Text style={styles.bodyText}>{internship.description}</Text>

        {/* Skills required */}
        <Text style={styles.sectionTitle}>Skills required</Text>
        <View style={styles.skillsRow}>
          {internship.skills.map(skill => (
            <View key={skill} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>

        {/* What you'll do */}
        <Text style={styles.sectionTitle}>What you'll do</Text>
        {internship.responsibilities.map((item, index) => (
          <View key={index} style={styles.bulletRow}>
            <Text style={styles.bulletIcon}>✓</Text>
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}

        <View style={{ height: height * 0.12 }} />
      </ScrollView>

      {/* Bottom action buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveBtn} onPress={() => void toggleBookmark()} disabled={saving}>
          <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={16} color={colors.accent} style={{marginRight: 6}} />
          <Text style={styles.saveBtnText}>{isSaved ? 'Saved' : 'Save'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.applyBtn,
            limitReached && !existingApplication && styles.applyBtnLocked,
          ]}
          onPress={handleApply}
          disabled={checkingApplication}
          activeOpacity={0.85}
        >
          <Text style={styles.applyBtnText}>
            {checkingApplication
              ? 'Checking...'
              : existingApplication
                ? 'View Application'
                : limitReached
              ? 'View Premium'
              : 'Apply Now'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.limitIndicator}>
        <ApplicationLimitIndicator
          entitlement={applicationEntitlement}
          onUpgrade={() => navigation.navigate('PremiumPlans', { source: 'application-limit' })}
        />
      </View>

    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: colors.title,
    fontWeight: 'bold',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveIcon: {
    fontSize: 18,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  listingImage: {
    width: '100%',
    height: 190,
    borderRadius: 16,
    marginBottom: 16,
  },
  companyAvatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  companyAvatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 6,
  },
  company: {
    fontSize: 14,
    color: colors.subtitle,
    marginBottom: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  matchBadge: {
    backgroundColor: colors.matchPillBg,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  matchText: {
    fontSize: 12,
    color: colors.matchPillText,
    fontWeight: '700',
  },
  tag: {
    backgroundColor: colors.ratePillBg,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: {
    fontSize: 12,
    color: colors.ratePillText,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.placeholder,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.rowBorder,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 10,
    marginTop: 4,
  },
  bodyText: {
    fontSize: 14,
    color: colors.subtitle,
    lineHeight: 22,
    marginBottom: 20,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  skillChip: {
    backgroundColor: colors.iconCircle,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  skillText: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '600',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bulletIcon: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: 'bold',
    marginRight: 10,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: colors.subtitle,
    lineHeight: 22,
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: height * 0.03,
    paddingTop: 12,
    backgroundColor: colors.background,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.rowBorder,
  },
  saveBtn: {
    flex: 1,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: colors.card,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: 'bold',
  },
  applyBtn: {
    flex: 2,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: colors.accent,
  },
  applyBtnLocked: {
    backgroundColor: colors.premiumGradientStart,
  },
  applyBtnText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  limitIndicator: {
    paddingHorizontal: 24,
    paddingBottom: 10,
    backgroundColor: colors.background,
  },
});
