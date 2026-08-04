import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import {
  applicationApi,
  documentApi,
  getAuthErrorMessage,
  stageApi,
  type ApplicationStageProgressResponse,
  type BackendApplicantResponse,
  type ApplicantDetailResponse,
  messagingApi,
  offerApi,
  type OfferResponse,
  type DocumentDraftResponse,
} from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';

type ApplicantRouteData = BackendApplicantResponse & {
  listingId: number;
  listingTitle: string;
  multiStage: boolean;
};

const initialsFor = (name: string) => name
  .trim()
  .split(/\s+/)
  .slice(0, 2)
  .map((part) => part.charAt(0).toUpperCase())
  .join('') || 'S';

export default function ApplicantProfileScreen({ navigation, route }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const routeApplicant = route.params?.applicant as ApplicantRouteData | undefined;
  const [applicant, setApplicant] = useState<(ApplicantRouteData & Partial<ApplicantDetailResponse>) | null>(routeApplicant ?? null);
  const [stages, setStages] = useState<ApplicationStageProgressResponse[]>([]);
  const [documents, setDocuments] = useState<DocumentDraftResponse[]>([]);
  const [offer, setOffer] = useState<OfferResponse | null>(null);
  const [interviewLink, setInterviewLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const loadDetails = useCallback(async () => {
    if (!routeApplicant) {
      setLoading(false);
      return;
    }
    setError('');
    try {
      const [detail, stageResults, documentResults, companyOffers] = await Promise.all([
        applicationApi.details(routeApplicant.id),
        stageApi.listForCompanyApplication(routeApplicant.id),
        documentApi.listSubmittedForEmployer(routeApplicant.id),
        offerApi.listCompany(),
      ]);
      setApplicant((current) => current ? { ...current, ...detail } : { ...routeApplicant, ...detail });
      setStages(stageResults);
      setDocuments(documentResults);
      setOffer(companyOffers.find((value) => value.applicationId === routeApplicant.id) ?? null);
    } catch (loadError) {
      setError(getAuthErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [routeApplicant]);

  useEffect(() => {
    void loadDetails();
  }, [loadDetails]);

  const directDecision = async (status: 'ACCEPTED' | 'REJECTED') => {
    if (!applicant || busy) return;
    setBusy(status);
    try {
      const updated = await applicationApi.updateStatus(applicant.id, status);
      setApplicant((current) => current ? { ...current, ...updated } : current);
      Alert.alert('Application updated', `${applicant.studentName} was ${status.toLowerCase()}.`);
    } catch (actionError) {
      Alert.alert('Could not update application', getAuthErrorMessage(actionError));
    } finally {
      setBusy('');
    }
  };

  const stageDecision = async (decision: 'APPROVE' | 'REJECT') => {
    if (!applicant || busy) return;
    setBusy(decision);
    try {
      await stageApi.decide(applicant.id, decision);
      await loadDetails();
      if (decision === 'REJECT') {
        setApplicant((current) => current ? { ...current, status: 'REJECTED' } : current);
      }
      Alert.alert('Stage updated', decision === 'APPROVE'
        ? 'The applicant advanced to the next stage.'
        : 'The application was rejected.');
    } catch (actionError) {
      Alert.alert('Could not update stage', getAuthErrorMessage(actionError));
    } finally {
      setBusy('');
    }
  };

  const saveInterviewLink = async () => {
    if (!applicant || !interviewLink.trim() || busy) return;
    setBusy('INTERVIEW');
    try {
      const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const updated = await stageApi.setInterviewLink(applicant.id, interviewLink.trim(), expiry);
      setStages((current) => current.map((stage) => stage.id === updated.id ? updated : stage));
      setInterviewLink('');
      Alert.alert('Interview link saved', 'The student has been notified.');
    } catch (actionError) {
      Alert.alert('Could not save interview link', getAuthErrorMessage(actionError));
    } finally {
      setBusy('');
    }
  };

  const openConversation = async () => {
    if (!applicant || busy) return;
    setBusy('MESSAGE');
    try {
      const conversation = await messagingApi.create(applicant.id);
      navigation.navigate('ChatScreen', {
        conversationId: conversation.id,
        participantName: conversation.studentName,
        participantInitials: initialsFor(conversation.studentName),
        participantColor: colors.accent,
        internshipTitle: conversation.listingTitle,
      });
    } catch (actionError) {
      Alert.alert('Could not open conversation', getAuthErrorMessage(actionError));
    } finally {
      setBusy('');
    }
  };

  const withdrawOffer = async () => {
    if (!offer || busy) return;
    setBusy('WITHDRAW');
    try {
      setOffer(await offerApi.withdraw(offer.id));
      Alert.alert('Offer withdrawn', 'The student has been notified.');
    } catch (actionError) {
      Alert.alert('Could not withdraw offer', getAuthErrorMessage(actionError));
    } finally {
      setBusy('');
    }
  };

  const openApplicationFile = async (file: NonNullable<ApplicantDetailResponse['files']>[number]) => {
    if (busy) return;
    setBusy(`FILE-${file.id}`);
    try {
      if (!await Sharing.isAvailableAsync()) {
        Alert.alert('Sharing unavailable', 'This device cannot open shared application files.');
        return;
      }
      const uri = await applicationApi.downloadCompanyFile(file);
      await Sharing.shareAsync(uri, {
        mimeType: file.contentType,
        dialogTitle: `Open ${file.originalFileName}`,
      });
    } catch (fileError) {
      Alert.alert('Could not open document', getAuthErrorMessage(fileError));
    } finally {
      setBusy('');
    }
  };

  if (!applicant) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Applicant details are unavailable</Text>
          <Text style={styles.emptyText}>Open the applicant from the Applicants tab.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentStage = stages.find((stage) => stage.status === 'PENDING');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={21} color={colors.title} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Applicant</Text>
        <TouchableOpacity onPress={() => void loadDetails()}>
          <Ionicons name="refresh" size={20} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initialsFor(applicant.studentName)}</Text>
          </View>
          <Text style={styles.name}>{applicant.studentName}</Text>
          <Text style={styles.email}>{applicant.studentEmail || 'No email available'}</Text>
          {applicant.phoneNumber ? <Text style={styles.email}>{applicant.phoneNumber}</Text> : null}
          <Text style={styles.listingTitle}>{applicant.listingTitle}</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{applicant.status.replace('_', ' ')}</Text>
          </View>
          <Text style={styles.dateText}>Applied {new Date(applicant.appliedAt).toLocaleString()}</Text>
        </View>

        {loading ? (
          <View style={styles.loadingBlock}>
            <ActivityIndicator color={colors.accent} />
          </View>
        ) : null}

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => void openConversation()}>
            <Text style={styles.secondaryText}>Message applicant</Text>
          </TouchableOpacity>
          {!offer || offer.status === 'DRAFT' ? <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('OfferSend', { applicationId: String(applicant.id) })}
            >
              <Text style={styles.primaryButtonText}>{offer ? 'Complete offer' : 'Prepare offer'}</Text>
            </TouchableOpacity> : null}
        </View>

        {offer ? <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offer</Text>
          <Text style={styles.profileLine}>{offer.title} · {offer.status}</Text>
          {offer.compensation ? <Text style={styles.profileBody}>{offer.compensation}</Text> : null}
          {offer.status === 'SENT' ? <TouchableOpacity style={styles.rejectButton} onPress={() => void withdrawOffer()}>
            <Text style={styles.rejectText}>{busy === 'WITHDRAW' ? 'Withdrawing...' : 'Withdraw offer'}</Text>
          </TouchableOpacity> : null}
        </View> : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student profile</Text>
          <Text style={styles.profileLine}>{applicant.universityName || 'University not provided'}</Text>
          <Text style={styles.profileLine}>
            {[applicant.program, applicant.level].filter(Boolean).join(' · ') || 'Programme not provided'}
          </Text>
          {applicant.background ? <Text style={styles.profileBody}>{applicant.background}</Text> : null}
          {applicant.personalEssay ? <Text style={styles.profileBody}>{applicant.personalEssay}</Text> : null}
          <Text style={styles.profileBody}>
            Preferred location: {applicant.preferredLocation || 'Not provided'} · Relocation: {applicant.willingToRelocate ? 'Yes' : 'No'}
          </Text>
          {(applicant.skills?.length ?? 0) > 0 ? (
            <Text style={styles.profileBody}>Skills: {applicant.skills?.join(', ')}</Text>
          ) : null}
          {(applicant.careerInterests?.length ?? 0) > 0 ? (
            <Text style={styles.profileBody}>Interests: {applicant.careerInterests?.join(', ')}</Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application responses</Text>
          {applicant.coverLetter ? <>
            <Text style={styles.responseLabel}>Cover letter</Text>
            <Text style={styles.profileBody}>{applicant.coverLetter}</Text>
          </> : null}
          {applicant.motivation ? <>
            <Text style={styles.responseLabel}>Motivation</Text>
            <Text style={styles.profileBody}>{applicant.motivation}</Text>
          </> : null}
          {applicant.whyThisInternship ? <>
            <Text style={styles.responseLabel}>Why this internship</Text>
            <Text style={styles.profileBody}>{applicant.whyThisInternship}</Text>
          </> : null}
          {applicant.strongCandidate ? <>
            <Text style={styles.responseLabel}>Why they are a strong candidate</Text>
            <Text style={styles.profileBody}>{applicant.strongCandidate}</Text>
          </> : null}
          {!applicant.coverLetter && !applicant.motivation
            && !applicant.whyThisInternship && !applicant.strongCandidate
            ? <Text style={styles.emptyText}>No written responses were provided.</Text>
            : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability and portfolio</Text>
          <Text style={styles.profileLine}>
            Earliest start: {applicant.earliestStartDate || 'Not provided'}
          </Text>
          <Text style={styles.profileLine}>
            Duration: {applicant.expectedDuration || 'Not provided'}
          </Text>
          <Text style={styles.profileLine}>
            Preferred mode: {applicant.preferredWorkMode || 'Not provided'}
          </Text>
          <Text style={styles.profileLine}>
            Can relocate: {applicant.canRelocate == null ? 'Not provided' : applicant.canRelocate ? 'Yes' : 'No'}
          </Text>
          {Object.entries(applicant.portfolioLinks ?? {}).map(([label, url]) => (
            <TouchableOpacity key={label} onPress={() => void Linking.openURL(url)}>
              <Text style={styles.portfolioLink}>{label}: {url}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {error ? (
          <TouchableOpacity style={styles.errorCard} onPress={() => void loadDetails()}>
            <Text style={styles.errorText}>{error} Tap to retry.</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Submitted documents</Text>
          {loading ? null : documents.length === 0 && (applicant.files?.length ?? 0) === 0 ? (
            <Text style={styles.emptyText}>The student has not submitted any application documents.</Text>
          ) : <>
          {applicant.files?.map((file) => (
            <TouchableOpacity
              key={`file-${file.id}`}
              style={styles.documentCard}
              disabled={Boolean(busy)}
              onPress={() => void openApplicationFile(file)}
            >
              <View style={styles.documentHeading}>
                <Text style={styles.documentTitle}>{file.kind.replaceAll('_', ' ')}</Text>
                {busy === `FILE-${file.id}`
                  ? <ActivityIndicator size="small" color={colors.accent} />
                  : <Ionicons name="download-outline" size={18} color={colors.accent} />}
              </View>
              <Text style={styles.documentText}>{file.originalFileName} · {Math.ceil(file.sizeBytes / 1024)} KB</Text>
              <Text style={styles.documentAction}>Tap to securely open</Text>
            </TouchableOpacity>
          ))}
          {documents.map((document) => (
            <View key={document.id} style={styles.documentCard}>
              <Text style={styles.documentTitle}>{document.documentType.replaceAll('_', ' ')}</Text>
              <Text style={styles.documentText}>{document.draftText}</Text>
            </View>
          ))}</>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hiring pipeline</Text>
          {loading ? null : stages.length === 0 ? (
            <Text style={styles.emptyText}>
              This application uses direct accept/reject because no pipeline was configured before the student applied.
            </Text>
          ) : stages
            .slice()
            .sort((a, b) => a.stageOrder - b.stageOrder)
            .map((stage) => (
              <View key={stage.id} style={styles.stageRow}>
                <View style={[
                  styles.stageDot,
                  stage.status === 'APPROVED' && styles.approvedDot,
                  stage.status === 'REJECTED' && styles.rejectedDot,
                ]} />
                <View style={styles.stageContent}>
                  <Text style={styles.stageName}>{stage.stageName}</Text>
                  <Text style={styles.stageMeta}>{stage.stageType.replace('_', ' ')} · {stage.status}</Text>
                  {stage.interviewLink ? <Text style={styles.stageLink}>Interview: {stage.interviewLink}</Text> : null}
                  {stage.studentMeetingLink ? <Text style={styles.stageLink}>Student link: {stage.studentMeetingLink}</Text> : null}
                </View>
              </View>
            ))}

          {currentStage?.stageType === 'INTERVIEW' ? (
            <View style={styles.interviewBox}>
              <Text style={styles.fieldLabel}>Interview scheduling link</Text>
              <TextInput
                style={styles.input}
                value={interviewLink}
                onChangeText={setInterviewLink}
                autoCapitalize="none"
                keyboardType="url"
                placeholder="https://calendly.com/... or meeting link"
                placeholderTextColor={colors.placeholder}
              />
              <TouchableOpacity
                style={[styles.primaryButton, !interviewLink.trim() && styles.disabled]}
                disabled={!interviewLink.trim() || Boolean(busy)}
                onPress={() => void saveInterviewLink()}
              >
                {busy === 'INTERVIEW'
                  ? <ActivityIndicator color={colors.onPrimary} />
                  : <Text style={styles.primaryButtonText}>Save and notify student</Text>}
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {stages.length > 0 && currentStage ? (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.rejectButton}
              disabled={Boolean(busy)}
              onPress={() => void stageDecision('REJECT')}
            >
              <Text style={styles.rejectText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              disabled={Boolean(busy)}
              onPress={() => void stageDecision('APPROVE')}
            >
              <Text style={styles.primaryButtonText}>Approve stage</Text>
            </TouchableOpacity>
          </View>
        ) : stages.length === 0 && !['ACCEPTED', 'REJECTED'].includes(applicant.status) ? (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.rejectButton}
              disabled={Boolean(busy)}
              onPress={() => void directDecision('REJECTED')}
            >
              <Text style={styles.rejectText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              disabled={Boolean(busy)}
              onPress={() => void directDecision('ACCEPTED')}
            >
              <Text style={styles.primaryButtonText}>Accept applicant</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.title, fontSize: 17, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 14 },
  loadingBlock: { alignItems: 'center', paddingVertical: 18 },
  profileCard: { alignItems: 'center', padding: 20, backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.inputBorder },
  avatar: { width: 62, height: 62, borderRadius: 31, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  avatarText: { color: colors.onPrimary, fontSize: 19, fontWeight: '800' },
  name: { color: colors.title, fontSize: 19, fontWeight: '700' },
  email: { color: colors.subtitle, fontSize: 13, marginTop: 3 },
  listingTitle: { color: colors.title, fontSize: 13, fontWeight: '600', marginTop: 12, textAlign: 'center' },
  statusPill: { marginTop: 9, paddingHorizontal: 11, paddingVertical: 5, borderRadius: 14, backgroundColor: colors.iconCircle },
  statusText: { color: colors.accent, fontSize: 10, fontWeight: '700' },
  dateText: { color: colors.placeholder, fontSize: 11, marginTop: 8 },
  section: { padding: 16, backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.inputBorder },
  sectionTitle: { color: colors.title, fontSize: 16, fontWeight: '700', marginBottom: 10 },
  emptyText: { color: colors.subtitle, fontSize: 13, lineHeight: 19, textAlign: 'center' },
  documentCard: { paddingTop: 11, marginTop: 8, borderTopWidth: 1, borderTopColor: colors.inputBorder },
  documentHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  documentTitle: { color: colors.accent, fontSize: 11, fontWeight: '800', marginBottom: 7 },
  documentText: { color: colors.text, fontSize: 13, lineHeight: 20 },
  documentAction: { color: colors.accent, fontSize: 11, fontWeight: '600', marginTop: 5 },
  stageRow: { flexDirection: 'row', paddingVertical: 8 },
  stageDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.inputBorder, marginTop: 4, marginRight: 11 },
  approvedDot: { backgroundColor: '#22C55E' },
  rejectedDot: { backgroundColor: colors.withdrawText },
  stageContent: { flex: 1 },
  stageName: { color: colors.title, fontSize: 14, fontWeight: '700' },
  stageMeta: { color: colors.subtitle, fontSize: 11, marginTop: 2 },
  stageLink: { color: colors.accent, fontSize: 11, marginTop: 5 },
  interviewBox: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.inputBorder },
  fieldLabel: { color: colors.title, fontSize: 12, fontWeight: '600', marginBottom: 6 },
  input: { color: colors.text, minHeight: 45, paddingHorizontal: 12, borderRadius: 10, backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.inputBorder },
  actionRow: { flexDirection: 'row', gap: 10 },
  primaryButton: { flex: 1, minHeight: 44, borderRadius: 22, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14, marginTop: 10 },
  primaryButtonText: { color: colors.onPrimary, fontSize: 13, fontWeight: '700' },
  rejectButton: { flex: 1, minHeight: 44, borderRadius: 22, backgroundColor: colors.withdrawBg, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  rejectText: { color: colors.withdrawText, fontSize: 13, fontWeight: '700' },
  secondaryButton: { flex: 1, minHeight: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  secondaryText: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  profileLine: { color: colors.title, fontSize: 13, fontWeight: '600', marginBottom: 5 },
  profileBody: { color: colors.subtitle, fontSize: 12, lineHeight: 18, marginTop: 7 },
  responseLabel: { color: colors.title, fontSize: 12, fontWeight: '800', marginTop: 10 },
  portfolioLink: { color: colors.accent, fontSize: 12, lineHeight: 18, marginTop: 8 },
  disabled: { opacity: 0.5 },
  errorCard: { padding: 12, borderRadius: 12, backgroundColor: colors.withdrawBg },
  errorText: { color: colors.withdrawText, fontSize: 12 },
  errorTitle: { color: colors.title, fontSize: 18, fontWeight: '700', textAlign: 'center' },
  linkText: { color: colors.accent, fontSize: 13, fontWeight: '700' },
});
