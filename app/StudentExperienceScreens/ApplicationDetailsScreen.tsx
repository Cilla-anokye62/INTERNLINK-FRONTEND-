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
import {
  applicationApi,
  documentApi,
  getAuthErrorMessage,
  stageApi,
  messagingApi,
  offerApi,
  type ApplicationStageProgressResponse,
  type BackendApplicationResponse,
  type DocumentDraftResponse,
  type DocumentType,
  type OfferResponse,
} from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { LockedFeatureOverlay } from '../../src/components/PremiumComponents';

const DOCUMENT_LABELS: Record<DocumentType, string> = {
  COVER_LETTER: 'Cover letter',
  APPLICATION_ESSAY: 'Application essay',
  INTRO_EMAIL: 'Introduction email',
};

export default function ApplicationDetailsScreen({ navigation, route }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const routeApplication = route.params?.application as BackendApplicationResponse | undefined;
  const routeApplicationId = Number(route.params?.applicationId);
  const [application, setApplication] = useState<BackendApplicationResponse | null>(routeApplication ?? null);
  const [stages, setStages] = useState<ApplicationStageProgressResponse[]>([]);
  const [documents, setDocuments] = useState<DocumentDraftResponse[]>([]);
  const [offer, setOffer] = useState<OfferResponse | null>(null);
  const [draftTexts, setDraftTexts] = useState<Record<number, string>>({});
  const [meetingLink, setMeetingLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState('');
  const [error, setError] = useState('');

  const resolveApplication = useCallback(async () => {
    if (routeApplication) return routeApplication;
    if (!Number.isFinite(routeApplicationId)) return null;
    const applications = await applicationApi.listOwn();
    return applications.find((item) => item.id === routeApplicationId) ?? null;
  }, [routeApplication, routeApplicationId]);

  const loadDetails = useCallback(async () => {
    setError('');
    try {
      const resolved = await resolveApplication();
      if (!resolved) {
        setApplication(null);
        return;
      }
      setApplication(resolved);
      const [documentResults, offers] = await Promise.all([
        documentApi.listOwn(resolved.id),
        offerApi.listStudent(),
      ]);
      const stageResults = resolved.trackingLocked
        ? []
        : await stageApi.listForStudent(resolved.id);
      setStages(stageResults);
      setDocuments(documentResults);
      setOffer(offers.find((value) => value.applicationId === resolved.id) ?? null);
      setDraftTexts(Object.fromEntries(documentResults.map((document) => [document.id, document.draftText])));
    } catch (loadError) {
      setError(getAuthErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [resolveApplication]);

  useEffect(() => {
    void loadDetails();
  }, [loadDetails]);

  const replaceDocument = (updated: DocumentDraftResponse) => {
    setDocuments((current) => current.map((document) => document.id === updated.id ? updated : document));
    setDraftTexts((current) => ({ ...current, [updated.id]: updated.draftText }));
  };

  const createDraft = async (documentType: DocumentType) => {
    if (!application || busyKey) return;
    setBusyKey(`create-${documentType}`);
    try {
      const created = await documentApi.createDraft(application.id, documentType);
      setDocuments((current) => [...current, created]);
      setDraftTexts((current) => ({ ...current, [created.id]: created.draftText }));
    } catch (actionError) {
      Alert.alert('Could not create draft', getAuthErrorMessage(actionError));
    } finally {
      setBusyKey('');
    }
  };

  const saveDraft = async (document: DocumentDraftResponse) => {
    if (!application || busyKey) return;
    setBusyKey(`save-${document.id}`);
    try {
      replaceDocument(await documentApi.edit(
        application.id,
        document.id,
        draftTexts[document.id] ?? document.draftText,
      ));
      Alert.alert('Saved', 'Your draft was saved.');
    } catch (actionError) {
      Alert.alert('Could not save draft', getAuthErrorMessage(actionError));
    } finally {
      setBusyKey('');
    }
  };

  const advanceDocument = async (document: DocumentDraftResponse) => {
    if (!application || busyKey) return;
    const action = document.status === 'DRAFT' ? 'approve' : 'submit';
    setBusyKey(`${action}-${document.id}`);
    try {
      if (document.status === 'DRAFT') {
        const saved = await documentApi.edit(
          application.id,
          document.id,
          draftTexts[document.id] ?? document.draftText,
        );
        replaceDocument(await documentApi.approve(application.id, saved.id));
      } else if (document.status === 'APPROVED') {
        replaceDocument(await documentApi.submit(application.id, document.id));
      }
    } catch (actionError) {
      Alert.alert(`Could not ${action} document`, getAuthErrorMessage(actionError));
    } finally {
      setBusyKey('');
    }
  };

  const submitMeetingLink = async () => {
    if (!application || !meetingLink.trim() || busyKey) return;
    setBusyKey('meeting-link');
    try {
      const updated = await stageApi.setStudentMeetingLink(application.id, meetingLink.trim());
      setStages((current) => current.map((stage) => stage.id === updated.id ? updated : stage));
      setMeetingLink('');
      Alert.alert('Meeting link sent', 'The employer can now see your meeting link.');
    } catch (actionError) {
      Alert.alert('Could not send meeting link', getAuthErrorMessage(actionError));
    } finally {
      setBusyKey('');
    }
  };

  const openConversation = async () => {
    if (!application || busyKey) return;
    setBusyKey('message');
    try {
      const conversation = await messagingApi.create(application.id);
      navigation.navigate('StudentChatScreen', {
        conversationId: conversation.id,
        participantName: conversation.companyName,
        participantInitials: conversation.companyName.slice(0, 2).toUpperCase(),
        participantColor: colors.accent,
        internshipTitle: conversation.listingTitle,
      });
    } catch (actionError) {
      Alert.alert('Could not open conversation', getAuthErrorMessage(actionError));
    } finally {
      setBusyKey('');
    }
  };

  const decideOffer = async (accept: boolean) => {
    if (!offer || busyKey) return;
    setBusyKey('offer');
    try {
      const updated = accept ? await offerApi.accept(offer.id) : await offerApi.decline(offer.id);
      setOffer(updated);
      Alert.alert('Offer updated', accept ? 'You accepted the offer.' : 'You declined the offer.');
    } catch (actionError) {
      Alert.alert('Could not update offer', getAuthErrorMessage(actionError));
    } finally {
      setBusyKey('');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (!application) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Application not found</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const existingTypes = new Set(documents.map((document) => document.documentType));
  const currentInterviewStage = stages.find(
    (stage) => stage.status === 'PENDING' && stage.stageType === 'INTERVIEW',
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={21} color={colors.title} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Application</Text>
        <TouchableOpacity onPress={() => void loadDetails()}>
          <Ionicons name="refresh" size={20} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.companyAvatar}>
            <Text style={styles.companyAvatarText}>{application.companyName.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.roleTitle}>{application.listingTitle}</Text>
          <Text style={styles.companyText}>{application.companyName}</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>
              {application.trackingLocked ? 'SUBMITTED' : application.status.replace('_', ' ')}
            </Text>
          </View>
          <Text style={styles.appliedText}>Applied {new Date(application.appliedAt).toLocaleString()}</Text>
        </View>

        {error ? (
          <TouchableOpacity style={styles.errorCard} onPress={() => void loadDetails()}>
            <Text style={styles.errorText}>{error} Tap to retry.</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity style={styles.messageButton} onPress={() => void openConversation()}>
          <Ionicons name="chatbubble-outline" size={18} color={colors.onPrimary} />
          <Text style={styles.primaryButtonText}>Message employer</Text>
        </TouchableOpacity>

        {offer ? (
          <View style={styles.offerCard}>
            <Text style={styles.sectionTitle}>Internship offer</Text>
            <Text style={styles.offerTitle}>{offer.title}</Text>
            {offer.compensation ? <Text style={styles.offerLine}>Compensation: {offer.compensation}</Text> : null}
            {offer.startDate ? <Text style={styles.offerLine}>Starts: {new Date(offer.startDate).toLocaleDateString()}</Text> : null}
            {offer.message ? <Text style={styles.offerMessage}>{offer.message}</Text> : null}
            <Text style={styles.documentStatus}>{offer.status}</Text>
            {offer.status === 'SENT' ? (
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => void decideOffer(false)}>
                  <Text style={styles.secondaryButtonText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryButton} onPress={() => void decideOffer(true)}>
                  <Text style={styles.primaryButtonText}>Accept offer</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Submitted details</Text>
          <DetailRow label="Earliest start" value={application.earliestStartDate} styles={styles} />
          <DetailRow label="Expected duration" value={application.expectedDuration} styles={styles} />
          <DetailRow label="Preferred mode" value={application.preferredWorkMode} styles={styles} />
          <DetailRow
            label="Can relocate"
            value={application.canRelocate == null ? null : application.canRelocate ? 'Yes' : 'No'}
            styles={styles}
          />
          {application.coverLetter ? <>
            <Text style={styles.responseLabel}>Cover letter</Text>
            <Text style={styles.responseBody}>{application.coverLetter}</Text>
          </> : null}
          {Object.entries(application.portfolioLinks ?? {}).map(([label, url]) => (
            <TouchableOpacity key={label} onPress={() => void Linking.openURL(url)}>
              <Text style={styles.linkText}>{label}: {url}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application progress</Text>
          {application.trackingLocked ? (
            <LockedFeatureOverlay
              title="Detailed tracking is Premium"
              message="Upgrade to follow review stages and progress updates. Interview invitations, offers, and employer messages remain available to you."
              onUpgrade={() => navigation.navigate('PremiumPlans', { source: 'application-tracking' })}
            />
          ) : stages.length === 0 ? (
            <Text style={styles.emptyText}>
              This employer uses the standard application review process. Your current status is shown above.
            </Text>
          ) : (
            stages
              .slice()
              .sort((a, b) => a.stageOrder - b.stageOrder)
              .map((stage) => (
                <View key={stage.id} style={styles.stageRow}>
                  <View style={[
                    styles.stageDot,
                    stage.status === 'APPROVED' && styles.stageApproved,
                    stage.status === 'REJECTED' && styles.stageRejected,
                  ]} />
                  <View style={styles.stageContent}>
                    <Text style={styles.stageName}>{stage.stageName}</Text>
                    <Text style={styles.stageMeta}>
                      {stage.stageType.replace('_', ' ')} · {stage.status}
                    </Text>
                    {stage.interviewLink ? (
                      <TouchableOpacity onPress={() => void Linking.openURL(stage.interviewLink!)}>
                        <Text style={styles.linkText}>Open employer interview link</Text>
                      </TouchableOpacity>
                    ) : null}
                    {stage.studentMeetingLink ? (
                      <Text style={styles.savedLink}>Your link: {stage.studentMeetingLink}</Text>
                    ) : null}
                  </View>
                </View>
              ))
          )}

          {currentInterviewStage ? (
            <View style={styles.meetingBox}>
              <Text style={styles.fieldLabel}>Your Zoom/Meet link</Text>
              <TextInput
                style={styles.input}
                value={meetingLink}
                onChangeText={setMeetingLink}
                autoCapitalize="none"
                keyboardType="url"
                placeholder="https://..."
                placeholderTextColor={colors.placeholder}
              />
              <TouchableOpacity
                style={[styles.primaryButton, !meetingLink.trim() && styles.disabledButton]}
                disabled={!meetingLink.trim() || Boolean(busyKey)}
                onPress={() => void submitMeetingLink()}
              >
                {busyKey === 'meeting-link'
                  ? <ActivityIndicator color={colors.onPrimary} />
                  : <Text style={styles.primaryButtonText}>Send meeting link</Text>}
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application documents</Text>
          <Text style={styles.sectionHint}>
            AI drafts require review and approval before you submit them to the employer.
          </Text>

          {documents.map((document) => (
            <View key={document.id} style={styles.documentCard}>
              <View style={styles.documentHeader}>
                <Text style={styles.documentTitle}>{DOCUMENT_LABELS[document.documentType]}</Text>
                <Text style={styles.documentStatus}>{document.status}</Text>
              </View>
              <TextInput
                style={[styles.documentInput, document.status !== 'DRAFT' && styles.readOnlyInput]}
                value={draftTexts[document.id] ?? document.draftText}
                onChangeText={(text) => setDraftTexts((current) => ({ ...current, [document.id]: text }))}
                editable={document.status === 'DRAFT'}
                multiline
                textAlignVertical="top"
              />
              {document.status === 'DRAFT' ? (
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    disabled={Boolean(busyKey)}
                    onPress={() => void saveDraft(document)}
                  >
                    <Text style={styles.secondaryButtonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    disabled={Boolean(busyKey)}
                    onPress={() => void advanceDocument(document)}
                  >
                    <Text style={styles.primaryButtonText}>Approve</Text>
                  </TouchableOpacity>
                </View>
              ) : document.status === 'APPROVED' ? (
                <TouchableOpacity
                  style={styles.primaryButton}
                  disabled={Boolean(busyKey)}
                  onPress={() => void advanceDocument(document)}
                >
                  <Text style={styles.primaryButtonText}>Submit to employer</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.submittedText}>Submitted to employer</Text>
              )}
            </View>
          ))}

          <View style={styles.createRow}>
            {(Object.keys(DOCUMENT_LABELS) as DocumentType[])
              .filter((type) => !existingTypes.has(type))
              .map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.createButton}
                  disabled={Boolean(busyKey)}
                  onPress={() => void createDraft(type)}
                >
                  {busyKey === `create-${type}`
                    ? <ActivityIndicator size="small" color={colors.accent} />
                    : <Text style={styles.createButtonText}>+ {DOCUMENT_LABELS[type]}</Text>}
                </TouchableOpacity>
              ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({
  label,
  value,
  styles,
}: {
  label: string;
  value: string | null;
  styles: ReturnType<typeof createStyles>;
}) {
  return <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value || 'Not provided'}</Text>
  </View>;
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.title },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 14 },
  heroCard: { backgroundColor: colors.card, borderRadius: 18, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: colors.inputBorder },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 7 },
  detailLabel: { color: colors.subtitle, fontSize: 12 },
  detailValue: { color: colors.text, fontSize: 12, fontWeight: '600', flex: 1, textAlign: 'right' },
  responseLabel: { color: colors.title, fontSize: 12, fontWeight: '800', marginTop: 10 },
  responseBody: { color: colors.subtitle, fontSize: 12, lineHeight: 18, marginTop: 5 },
  companyAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  companyAvatarText: { color: colors.onPrimary, fontWeight: '800', fontSize: 20 },
  roleTitle: { color: colors.title, fontSize: 18, fontWeight: '700', textAlign: 'center' },
  companyText: { color: colors.subtitle, fontSize: 13, marginTop: 3 },
  statusPill: { marginTop: 12, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: colors.iconCircle },
  statusText: { color: colors.accent, fontSize: 11, fontWeight: '700' },
  appliedText: { color: colors.placeholder, fontSize: 11, marginTop: 9 },
  section: { backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.inputBorder },
  sectionTitle: { color: colors.title, fontSize: 16, fontWeight: '700', marginBottom: 9 },
  sectionHint: { color: colors.subtitle, fontSize: 12, lineHeight: 18, marginBottom: 12 },
  emptyText: { color: colors.subtitle, fontSize: 13, lineHeight: 20 },
  stageRow: { flexDirection: 'row', paddingVertical: 9 },
  stageDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.inputBorder, marginTop: 4, marginRight: 11 },
  stageApproved: { backgroundColor: '#22C55E' },
  stageRejected: { backgroundColor: colors.withdrawText },
  stageContent: { flex: 1 },
  stageName: { color: colors.title, fontSize: 14, fontWeight: '700' },
  stageMeta: { color: colors.subtitle, fontSize: 11, marginTop: 2 },
  linkText: { color: colors.accent, fontSize: 13, fontWeight: '600', marginTop: 6 },
  savedLink: { color: colors.subtitle, fontSize: 11, marginTop: 5 },
  meetingBox: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.inputBorder },
  fieldLabel: { color: colors.title, fontSize: 12, fontWeight: '600', marginBottom: 6 },
  input: { color: colors.text, backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 10, paddingHorizontal: 12, minHeight: 44, marginBottom: 9 },
  documentCard: { borderTopWidth: 1, borderTopColor: colors.inputBorder, paddingTop: 13, marginTop: 8 },
  documentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  documentTitle: { color: colors.title, fontSize: 14, fontWeight: '700' },
  documentStatus: { color: colors.accent, fontSize: 10, fontWeight: '700' },
  documentInput: { minHeight: 140, color: colors.text, backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 10, padding: 11, fontSize: 13, lineHeight: 19 },
  readOnlyInput: { opacity: 0.8 },
  buttonRow: { flexDirection: 'row', gap: 9, marginTop: 10 },
  primaryButton: { flex: 1, minHeight: 42, borderRadius: 21, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14, marginTop: 10 },
  primaryButtonText: { color: colors.onPrimary, fontSize: 13, fontWeight: '700' },
  secondaryButton: { flex: 1, minHeight: 42, borderRadius: 21, borderWidth: 1, borderColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  secondaryButtonText: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  disabledButton: { opacity: 0.5 },
  messageButton: { minHeight: 47, borderRadius: 24, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  offerCard: { padding: 16, backgroundColor: colors.offerCardBg, borderRadius: 16, borderWidth: 1, borderColor: colors.inputBorder },
  offerTitle: { color: colors.title, fontSize: 15, fontWeight: '700', marginBottom: 8 },
  offerLine: { color: colors.text, fontSize: 12, marginBottom: 4 },
  offerMessage: { color: colors.subtitle, fontSize: 12, lineHeight: 18, marginTop: 8 },
  submittedText: { color: '#15803D', fontSize: 12, fontWeight: '700', marginTop: 9 },
  createRow: { gap: 8, marginTop: 12 },
  createButton: { minHeight: 40, borderRadius: 20, borderWidth: 1, borderColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  createButtonText: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  errorCard: { backgroundColor: colors.withdrawBg, borderRadius: 12, padding: 12 },
  errorText: { color: colors.withdrawText, fontSize: 12 },
  errorTitle: { color: colors.title, fontSize: 18, fontWeight: '700' },
});
