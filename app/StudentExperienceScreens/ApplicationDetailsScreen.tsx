import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';
import { Application, STATUS_CONFIG, InterviewData, OfferData } from '../../src/types/application';
import ApplicationTimeline from '../../src/components/ApplicationTimeline';
import StatusBadge from '../../src/components/StatusBadge';

const { height } = Dimensions.get('window');

export default function ApplicationDetailsScreen({ navigation, route }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { applications, withdrawApplication, updateApplicationStatus, findOrCreateConversation, userId } = useAppStore();
  const applicationId: string = route.params?.applicationId;

  const application = applications.find((a) => a.id === applicationId);

  if (!application) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContent}>
          <Text style={[styles.errorText, { color: colors.title }]}>Application not found</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.backLink, { color: colors.accent }]}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { internship, timeline, interview, offer, status } = application;
  const config = STATUS_CONFIG[status];

  const handleWithdraw = () => {
    Alert.alert(
      'Withdraw Application',
      'Are you sure you want to withdraw your application? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          style: 'destructive',
          onPress: () => {
            withdrawApplication(application.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleMessageEmployer = () => {
    const conv = findOrCreateConversation(
      userId,
      application.employerId,
      internship.company,
      internship.companyLogo,
      internship.companyColor,
      application.id,
      internship.title,
    );
    navigation.navigate('StudentChatScreen', {
      conversationId: conv.id,
      participantName: internship.company,
      participantInitials: internship.companyLogo,
      participantColor: internship.companyColor,
      internshipTitle: internship.title,
    });
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={[styles.section, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.title }]}>{title}</Text>
      {children}
    </View>
  );

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
          <Text style={[styles.backArrow, { color: colors.title }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.title }]}>Application Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Internship header */}
        <View style={[styles.internshipCard, { backgroundColor: colors.card }]}>
          <View style={styles.internshipRow}>
            <View style={[styles.logo, { backgroundColor: internship.companyColor }]}>
              <Text style={styles.logoText}>{internship.companyLogo}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.roleTitle, { color: colors.title }]}>{internship.title}</Text>
              <Text style={[styles.companyName, { color: colors.subtitle }]}>{internship.company} · {internship.location}</Text>
            </View>
            <StatusBadge status={status} />
          </View>
        </View>

        {/* Interview Card */}
        {interview && interview.status === 'scheduled' && (
          <View style={[styles.highlightCard, { backgroundColor: colors.interviewCardBg }]}>
            <View style={styles.highlightHeader}>
              <Ionicons name="calendar-outline" size={20} color={colors.interviewCardText} style={{marginRight: 8}} />
              <Text style={[styles.highlightTitle, { color: colors.interviewCardText }]}>Upcoming Interview</Text>
            </View>
            <View style={[styles.highlightDivider, { backgroundColor: colors.interviewCardText + '30' }]} />
            <View style={styles.highlightRow}>
              <Text style={[styles.highlightLabel, { color: colors.interviewCardText }]}>Date</Text>
              <Text style={[styles.highlightValue, { color: colors.interviewCardText }]}>{interview.date}</Text>
            </View>
            <View style={styles.highlightRow}>
              <Text style={[styles.highlightLabel, { color: colors.interviewCardText }]}>Time</Text>
              <Text style={[styles.highlightValue, { color: colors.interviewCardText }]}>{interview.time}</Text>
            </View>
            <View style={styles.highlightRow}>
              <Text style={[styles.highlightLabel, { color: colors.interviewCardText }]}>Duration</Text>
              <Text style={[styles.highlightValue, { color: colors.interviewCardText }]}>{interview.duration}</Text>
            </View>
            <View style={styles.highlightRow}>
              <Text style={[styles.highlightLabel, { color: colors.interviewCardText }]}>Type</Text>
              <Text style={[styles.highlightValue, { color: colors.interviewCardText }]}>{interview.type}</Text>
            </View>
            {interview.meetingLink && (
              <View style={styles.highlightRow}>
                <Text style={[styles.highlightLabel, { color: colors.interviewCardText }]}>Link</Text>
                <Text style={[styles.highlightValue, { color: colors.interviewCardText }]} numberOfLines={1}>{interview.meetingLink}</Text>
              </View>
            )}
          </View>
        )}

        {/* Offer Card */}
        {offer && offer.status === 'pending' && (
          <View style={[styles.highlightCard, { backgroundColor: colors.offerCardBg }]}>
            <View style={styles.highlightHeader}>
              <Ionicons name="gift-outline" size={20} color={colors.offerCardText} style={{marginRight: 8}} />
              <Text style={[styles.highlightTitle, { color: colors.offerCardText }]}>Offer Received!</Text>
            </View>
            <View style={[styles.highlightDivider, { backgroundColor: colors.offerCardText + '30' }]} />
            <View style={styles.highlightRow}>
              <Text style={[styles.highlightLabel, { color: colors.offerCardText }]}>Salary</Text>
              <Text style={[styles.highlightValue, { color: colors.offerCardText }]}>{offer.salary}</Text>
            </View>
            <View style={styles.highlightRow}>
              <Text style={[styles.highlightLabel, { color: colors.offerCardText }]}>Start Date</Text>
              <Text style={[styles.highlightValue, { color: colors.offerCardText }]}>{offer.startDate}</Text>
            </View>
            <View style={styles.highlightRow}>
              <Text style={[styles.highlightLabel, { color: colors.offerCardText }]}>Expires</Text>
              <Text style={[styles.highlightValue, { color: colors.offerCardText }]}>{offer.expirationDate}</Text>
            </View>
            <View style={styles.offerActions}>
              <TouchableOpacity
                style={[styles.acceptBtn, { backgroundColor: colors.accent }]}
                onPress={() => {
                  updateApplicationStatus(application.id, 'accepted');
                  Alert.alert('Accepted', 'Offer accepted successfully!', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                  ]);
                }}
              >
                <Text style={[styles.acceptBtnText, { color: colors.onPrimary }]}>Accept Offer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.declineBtn, { borderColor: colors.withdrawText }]}
                onPress={() => {
                  updateApplicationStatus(application.id, 'rejected');
                  Alert.alert('Declined', 'Offer declined.', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                  ]);
                }}
              >
                <Text style={[styles.declineBtnText, { color: colors.withdrawText }]}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Timeline */}
        <Section title="Application Timeline">
          <ApplicationTimeline currentStatus={status} timeline={timeline} />
        </Section>

        {/* Documents */}
        <Section title="Documents Submitted">
          {application.resume && (
            <View style={styles.docRow}>
              <View style={[styles.docIcon, { backgroundColor: '#FEE2E2' }]}>
                <Text style={[styles.docIconText, { color: '#EF4444' }]}>PDF</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.docName, { color: colors.title }]}>{application.resume.name}</Text>
                <Text style={[styles.docMeta, { color: colors.placeholder }]}>{application.resume.size}</Text>
              </View>
            </View>
          )}
          {application.coverLetter ? (
            <InfoRow label="Cover Letter" value="Submitted" />
          ) : null}
          {application.portfolioLinks && Object.values(application.portfolioLinks).some((v) => v) ? (
            <InfoRow label="Portfolio" value={`${Object.values(application.portfolioLinks).filter(Boolean).length} links`} />
          ) : null}
        </Section>

        {/* Internship details */}
        <Section title="Internship Details">
          <InfoRow label="Location" value={internship.location} />
          <InfoRow label="Work Mode" value={internship.workMode} />
          <InfoRow label="Duration" value={internship.duration} />
          <InfoRow label="Compensation" value={internship.salary} />
          <InfoRow label="Match Score" value={`${internship.matchScore}%`} />
        </Section>

        {/* Message Employer */}
        {!['rejected', 'withdrawn'].includes(status) && (
          <TouchableOpacity style={[styles.messageBtn, { backgroundColor: colors.accent }]} onPress={handleMessageEmployer}>
            <Ionicons name="mail-outline" size={16} color={colors.onPrimary} style={{marginRight: 6}} />
            <Text style={[styles.messageBtnText, { color: colors.onPrimary }]}>Message Employer</Text>
          </TouchableOpacity>
        )}

        {/* Withdraw */}
        {!['rejected', 'withdrawn', 'accepted'].includes(status) && (
          <TouchableOpacity style={[styles.withdrawBtn, { borderColor: colors.withdrawText }]} onPress={handleWithdraw}>
            <Text style={[styles.withdrawText, { color: colors.withdrawText }]}>Withdraw Application</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontSize: 18, fontWeight: 'bold' },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  backLink: { fontSize: 15, fontWeight: '600' },
  internshipCard: {
    borderRadius: 16, padding: 18, marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  internshipRow: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  logoText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  roleTitle: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  companyName: { fontSize: 13 },
  highlightCard: { borderRadius: 16, padding: 18, marginBottom: 16 },
  highlightHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  highlightTitle: { fontSize: 16, fontWeight: '700' },
  highlightDivider: { height: 1, marginBottom: 12 },
  highlightRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  highlightLabel: { fontSize: 13, fontWeight: '500' },
  highlightValue: { fontSize: 13, fontWeight: '600' },
  offerActions: { flexDirection: 'row', gap: 12, marginTop: 14 },
  acceptBtn: { flex: 1, borderRadius: 24, paddingVertical: 12, alignItems: 'center' },
  acceptBtnText: { fontSize: 14, fontWeight: '700' },
  declineBtn: { flex: 1, borderRadius: 24, paddingVertical: 12, alignItems: 'center', borderWidth: 1.5 },
  declineBtnText: { fontSize: 14, fontWeight: '700' },
  section: { borderRadius: 16, padding: 18, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 14 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1 },
  infoLabel: { fontSize: 13 },
  infoValue: { fontSize: 13, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  docRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  docIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  docIconText: { fontSize: 10, fontWeight: '800' },
  docName: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  docMeta: { fontSize: 12 },
  messageBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 30, paddingVertical: 14, marginBottom: 12 },
  messageBtnText: { fontSize: 15, fontWeight: '700' },
  withdrawBtn: { borderWidth: 1.5, borderRadius: 30, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  withdrawText: { fontSize: 15, fontWeight: '600' },
});
