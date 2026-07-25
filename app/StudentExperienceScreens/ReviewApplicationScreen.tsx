import React, { useState } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';
import { InternshipData, Application, STATUS_CONFIG, ApplicationStatus } from '../../src/types/application';
import { ApiError, applicationApi, getAuthErrorMessage } from '../../src/api';

const { height } = Dimensions.get('window');

const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

export default function ReviewApplicationScreen({ navigation, route }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { addApplication, incrementApplicationsUsed, userId } = useAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const internship: InternshipData = route.params?.internship;
  const resumeId: string = route.params?.resumeId;
  const coverLetter: string = route.params?.coverLetter || '';
  const motivation: string = route.params?.motivation || '';
  const whyThis: string = route.params?.whyThis || '';
  const strongCandidate: string = route.params?.strongCandidate || '';
  const portfolioLinks = route.params?.portfolioLinks || {};
  const availability = route.params?.availability || {};

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!internship.backendListingId) {
      setSubmitError('This internship is sample content and cannot accept applications. Apply from Discover instead.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const submitted = await applicationApi.apply(internship.backendListingId);
      const localStatus: ApplicationStatus = submitted.status === 'UNDER_REVIEW'
        ? 'under_review'
        : submitted.status === 'ACCEPTED'
          ? 'accepted'
          : submitted.status === 'REJECTED'
            ? 'rejected'
            : 'submitted';
      const newApp: Application = {
        id: String(submitted.id),
        internshipId: String(submitted.listingId),
        studentId: userId,
        employerId: String(submitted.companyId),
        status: localStatus,
        submittedAt: submitted.appliedAt,
        updatedAt: submitted.updatedAt,
        resume: resumeId
          ? { id: resumeId, name: 'Resume.pdf', type: 'pdf', uri: '', uploadDate: submitted.appliedAt, size: '245 KB' }
          : null,
        coverLetter,
        motivationStatement: motivation,
        whyThisInternship: whyThis,
        strongCandidateReason: strongCandidate,
        portfolioLinks,
        availability,
        internship,
        timeline: [
          {
            id: generateId(),
            status: localStatus,
            label: localStatus === 'under_review' ? 'Application Under Review' : 'Application Submitted',
            description: 'Your application was sent successfully',
            timestamp: submitted.appliedAt,
            isActive: true,
          },
        ],
        messages: [],
        interview: null,
        offer: null,
      };

      addApplication(newApp);
      incrementApplicationsUsed();
      navigation.navigate('ApplicationSubmitted', {
        applicationId: String(submitted.id),
        company: submitted.companyName,
        title: submitted.listingTitle,
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 402) {
        navigation.navigate('PremiumPaywall');
      } else {
        setSubmitError(getAuthErrorMessage(error));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!internship) return null;

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={[styles.infoRow, { borderBottomColor: colors.rowBorder }]}>
      <Text style={[styles.infoLabel, { color: colors.placeholder }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.title }]}>{value || 'Not provided'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={20} color={colors.title} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.title }]}>Review Application</Text>
          <Text style={[styles.stepLabel, { color: colors.subtitle }]}>Step 6 of 6</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressTrack, { backgroundColor: colors.stepperInactive }]}>
          <View style={[styles.progressFill, { backgroundColor: colors.stepperActive, width: '100%' }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Internship Summary */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
          <View style={styles.internshipRow}>
            <View style={[styles.companyLogo, { backgroundColor: internship.companyColor }]}>
              <Text style={styles.companyLogoText}>{internship.companyLogo}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.internshipTitle, { color: colors.title }]}>{internship.title}</Text>
              <Text style={[styles.internshipCompany, { color: colors.subtitle }]}>{internship.company} · {internship.location}</Text>
            </View>
          </View>
        </View>

        {/* Personal Info */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.title }]}>Personal Info</Text>
          <InfoRow label="Name" value="Alex Morgan" />
          <InfoRow label="Email" value="alex.morgan@university.edu" />
          <InfoRow label="Phone" value="+233 55 123 4567" />
        </View>

        {/* Resume */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.title }]}>Resume</Text>
          <View style={styles.resumeRow}>
            <View style={[styles.fileIcon, { backgroundColor: '#FEE2E2' }]}>
              <Text style={[styles.fileIconText, { color: '#EF4444' }]}>PDF</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fileName, { color: colors.title }]}>Resume.pdf</Text>
              <Text style={[styles.fileMeta, { color: colors.placeholder }]}>245 KB</Text>
            </View>
            <View style={[styles.attachedBadge, { backgroundColor: colors.iconCircle }]}>
              <Text style={[styles.attachedText, { color: colors.accent }]}>Attached</Text>
            </View>
          </View>
        </View>

        {/* Cover Letter / Motivation */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.title }]}>Cover Letter & Motivation</Text>
          {coverLetter ? (
            <Text style={[styles.textContent, { color: colors.subtitle }]}>{coverLetter}</Text>
          ) : (
            <Text style={[styles.notProvided, { color: colors.placeholder }]}>No cover letter provided</Text>
          )}
          {motivation ? (
            <>
              <Text style={[styles.subLabel, { color: colors.title }]}>Motivation Statement</Text>
              <Text style={[styles.textContent, { color: colors.subtitle }]}>{motivation}</Text>
            </>
          ) : null}
        </View>

        {/* Portfolio */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.title }]}>Portfolio</Text>
          {Object.entries(portfolioLinks).filter(([_, v]) => v).length > 0 ? (
            Object.entries(portfolioLinks).filter(([_, v]) => v).map(([key, url]) => (
              <View key={key} style={styles.portfolioRow}>
                <View style={[styles.portfolioChip, { backgroundColor: colors.portfolioChipBg }]}>
                  <Text style={[styles.portfolioChipText, { color: colors.portfolioChipText }]}>{key}</Text>
                </View>
                <Text style={[styles.portfolioUrl, { color: colors.subtitle }]} numberOfLines={1}>{url as string}</Text>
              </View>
            ))
          ) : (
            <Text style={[styles.notProvided, { color: colors.placeholder }]}>No portfolio links added</Text>
          )}
        </View>

        {/* Availability */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.title }]}>Availability</Text>
          <InfoRow label="Start Date" value={availability.earliestStartDate || 'Not specified'} />
          <InfoRow label="Duration" value={availability.expectedDuration || 'Not specified'} />
          <InfoRow label="Student Level" value={availability.studentLevel || 'Not specified'} />
          <InfoRow label="Work Mode" value={availability.preferredWorkMode || 'Not specified'} />
          <InfoRow label="Can Relocate" value={availability.canRelocate ? 'Yes' : 'No'} />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.rowBorder }]}>
        {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.accent }, isSubmitting && { opacity: 0.6 }]}
          onPress={() => void handleSubmit()}
          activeOpacity={0.85}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? <ActivityIndicator color={colors.onPrimary} />
            : <Text style={[styles.submitText, { color: colors.onPrimary }]}>Submit Application</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontSize: 18, fontWeight: 'bold' },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  stepLabel: { fontSize: 12, marginTop: 2 },
  progressContainer: { paddingHorizontal: 20, paddingBottom: 16 },
  progressTrack: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, borderRadius: 2 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },
  sectionCard: {
    borderRadius: 16, padding: 18, marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  internshipRow: { flexDirection: 'row', alignItems: 'center' },
  companyLogo: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  companyLogoText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  internshipTitle: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  internshipCompany: { fontSize: 13 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1 },
  infoLabel: { fontSize: 13 },
  infoValue: { fontSize: 13, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  resumeRow: { flexDirection: 'row', alignItems: 'center' },
  fileIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  fileIconText: { fontSize: 10, fontWeight: '800' },
  fileName: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  fileMeta: { fontSize: 12 },
  attachedBadge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  attachedText: { fontSize: 11, fontWeight: '600' },
  textContent: { fontSize: 13, lineHeight: 20, marginBottom: 8 },
  notProvided: { fontSize: 13, fontStyle: 'italic' },
  subLabel: { fontSize: 13, fontWeight: '600', marginTop: 8, marginBottom: 4 },
  portfolioRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  portfolioChip: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginRight: 8 },
  portfolioChipText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  portfolioUrl: { fontSize: 13, flex: 1 },
  bottomBar: {
    paddingHorizontal: 20, paddingBottom: height * 0.03, paddingTop: 12,
    borderTopWidth: 1,
  },
  submitBtn: { borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  submitText: { fontSize: 16, fontWeight: 'bold' },
  submitError: { color: colors.error, fontSize: 13, textAlign: 'center', marginBottom: 10 },
});
