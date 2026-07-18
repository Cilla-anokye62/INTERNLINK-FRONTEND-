import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';
import { Application, STATUS_CONFIG } from '../../src/types/application';
import StatusBadge from '../../src/components/StatusBadge';
import ApplicationTimeline from '../../src/components/ApplicationTimeline';

const { height } = Dimensions.get('window');

const MOCK_PROFILES: Record<string, { name: string; initials: string; school: string; programme: string; gpa: string; skills: string[]; projects: string[]; experience: string[]; certificates: string[]; languages: string[] }> = {
  'student-1': {
    name: 'Alex Morgan',
    initials: 'AM',
    school: 'Massachusetts Institute of Technology',
    programme: 'B.Sc. Computer Science — Junior',
    gpa: '3.87',
    skills: ['React', 'TypeScript', 'GraphQL', 'Node.js', 'Python', 'SQL'],
    projects: ['E-commerce Platform — React/Node.js', 'AI Chat Bot — Python/TensorFlow', 'Open Source Contributor — React Native'],
    experience: ['Frontend Intern — Startup Co. (Summer 2025)', 'Teaching Assistant — MIT CS Dept (2024-2025)'],
    certificates: ['AWS Cloud Practitioner', 'Google UX Design Certificate'],
    languages: ['English (Native)', 'Spanish (Intermediate)'],
  },
};

export default function ApplicantProfileScreen({ navigation, route }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { applications, updateApplicationStatus } = useAppStore();
  const applicationId: string = route.params?.applicationId;

  const application = applications.find((a) => a.id === applicationId);
  if (!application) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContent}>
          <Text style={[styles.errorText, { color: colors.title }]}>Applicant not found</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.backLink, { color: colors.accent }]}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const profile = MOCK_PROFILES[application.studentId] || {
    name: 'Student',
    initials: 'ST',
    school: 'University',
    programme: 'Programme',
    gpa: 'N/A',
    skills: [],
    projects: [],
    experience: [],
    certificates: [],
    languages: [],
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'shortlist':
        updateApplicationStatus(application.id, 'shortlisted');
        Alert.alert('Shortlisted', `${profile.name} has been shortlisted.`);
        break;
      case 'reject':
        Alert.alert('Reject Applicant', `Are you sure you want to reject ${profile.name}?`, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Reject', style: 'destructive', onPress: () => {
            updateApplicationStatus(application.id, 'rejected');
            navigation.goBack();
          }},
        ]);
        break;
      case 'interview':
        navigation.navigate('InterviewSchedule', { applicationId: application.id });
        break;
      case 'moreInfo':
        Alert.alert('Request Sent', 'A request for more information has been sent to the applicant.');
        break;
    }
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={[styles.section, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.title }]}>{title}</Text>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={20} color={colors.title} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.title }]}>Applicant Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
            <Text style={styles.avatarText}>{profile.initials}</Text>
          </View>
          <Text style={[styles.profileName, { color: colors.title }]}>{profile.name}</Text>
          <Text style={[styles.profileSchool, { color: colors.subtitle }]}>{profile.school}</Text>
          <Text style={[styles.profileProgramme, { color: colors.placeholder }]}>{profile.programme}</Text>

          <View style={styles.statsRow}>
            <View style={[styles.statItem, { backgroundColor: colors.iconCircle }]}>
              <Text style={[styles.statValue, { color: colors.accent }]}>{profile.gpa}</Text>
              <Text style={[styles.statLabel, { color: colors.subtitle }]}>GPA</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: colors.iconCircle }]}>
              <Text style={[styles.statValue, { color: colors.accent }]}>{application.internship.matchScore}%</Text>
              <Text style={[styles.statLabel, { color: colors.subtitle }]}>Match</Text>
            </View>
          </View>
        </View>

        {/* AI Match Analysis */}
        <Section title="AI Match Analysis">
          <View style={styles.aiCard}>
            <View style={styles.aiRow}>
              <Text style={[styles.aiLabel, { color: colors.subtitle }]}>Strengths</Text>
              <View style={[styles.aiTag, { backgroundColor: colors.successBg }]}>
                <Text style={[styles.aiTagText, { color: colors.successText }]}>Strong</Text>
              </View>
            </View>
            <Text style={[styles.aiText, { color: colors.subtitle }]}>
              Excellent React/TypeScript skills, strong academic record, relevant project experience.
            </Text>
            <View style={styles.aiRow}>
              <Text style={[styles.aiLabel, { color: colors.subtitle }]}>Concerns</Text>
              <View style={[styles.aiTag, { backgroundColor: colors.ratePillBg }]}>
                <Text style={[styles.aiTagText, { color: colors.ratePillText }]}>Minor</Text>
              </View>
            </View>
            <Text style={[styles.aiText, { color: colors.subtitle }]}>
              Limited professional experience. Could benefit from more backend exposure.
            </Text>
          </View>
          <View style={[styles.questionsBox, { backgroundColor: colors.iconCircle }]}>
            <Text style={[styles.questionsTitle, { color: colors.accent }]}>Recommended Interview Questions</Text>
            <Text style={[styles.questionItem, { color: colors.subtitle }]}>1. Tell me about a challenging project you've worked on.</Text>
            <Text style={[styles.questionItem, { color: colors.subtitle }]}>2. How do you approach debugging complex issues?</Text>
            <Text style={[styles.questionItem, { color: colors.subtitle }]}>3. What interests you about our engineering culture?</Text>
          </View>
        </Section>

        {/* Skills */}
        <Section title="Skills">
          <View style={styles.chipsRow}>
            {profile.skills.map((skill) => (
              <View key={skill} style={[styles.skillChip, { backgroundColor: colors.iconCircle }]}>
                <Text style={[styles.skillText, { color: colors.accent }]}>{skill}</Text>
              </View>
            ))}
          </View>
        </Section>

        {/* Projects */}
        <Section title="Projects">
          {profile.projects.map((project, i) => (
            <View key={i} style={[styles.projectRow, i < profile.projects.length - 1 && { borderBottomColor: colors.rowBorder, borderBottomWidth: 1 }]}>
              <Text style={[styles.projectText, { color: colors.subtitle }]}>{project}</Text>
            </View>
          ))}
        </Section>

        {/* Experience */}
        <Section title="Experience">
          {profile.experience.map((exp, i) => (
            <View key={i} style={[styles.projectRow, i < profile.experience.length - 1 && { borderBottomColor: colors.rowBorder, borderBottomWidth: 1 }]}>
              <Text style={[styles.projectText, { color: colors.subtitle }]}>{exp}</Text>
            </View>
          ))}
        </Section>

        {/* Cover Letter */}
        {application.coverLetter ? (
          <Section title="Cover Letter">
            <Text style={[styles.coverLetterText, { color: colors.subtitle }]}>{application.coverLetter}</Text>
          </Section>
        ) : null}

        {/* Timeline */}
        <Section title="Application Timeline">
          <ApplicationTimeline currentStatus={application.status} timeline={application.timeline} />
        </Section>

        {/* Availability */}
        <Section title="Availability">
          <View style={styles.infoGrid}>
            <View style={[styles.infoItem, { backgroundColor: colors.background }]}>
              <Text style={[styles.infoLabel, { color: colors.placeholder }]}>Start Date</Text>
              <Text style={[styles.infoValue, { color: colors.title }]}>{application.availability.earliestStartDate || 'Flexible'}</Text>
            </View>
            <View style={[styles.infoItem, { backgroundColor: colors.background }]}>
              <Text style={[styles.infoLabel, { color: colors.placeholder }]}>Duration</Text>
              <Text style={[styles.infoValue, { color: colors.title }]}>{application.availability.expectedDuration || 'N/A'}</Text>
            </View>
            <View style={[styles.infoItem, { backgroundColor: colors.background }]}>
              <Text style={[styles.infoLabel, { color: colors.placeholder }]}>Work Mode</Text>
              <Text style={[styles.infoValue, { color: colors.title }]}>{application.availability.preferredWorkMode}</Text>
            </View>
            <View style={[styles.infoItem, { backgroundColor: colors.background }]}>
              <Text style={[styles.infoLabel, { color: colors.placeholder }]}>Relocate</Text>
              <Text style={[styles.infoValue, { color: colors.title }]}>{application.availability.canRelocate ? 'Yes' : 'No'}</Text>
            </View>
          </View>
        </Section>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom actions */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.rowBorder }]}>
        <TouchableOpacity
          style={[styles.rejectBtn, { borderColor: colors.withdrawText }]}
          onPress={() => handleAction('reject')}
        >
          <Text style={[styles.rejectText, { color: colors.withdrawText }]}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.shortlistBtn, { backgroundColor: colors.accent }]}
          onPress={() => handleAction('shortlist')}
        >
          <Text style={[styles.shortlistText, { color: colors.onPrimary }]}>Shortlist</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.interviewBtn, { backgroundColor: colors.interviewCardBg }]}
          onPress={() => handleAction('interview')}
        >
          <Text style={[styles.interviewText, { color: colors.interviewCardText }]}>Interview</Text>
        </TouchableOpacity>
      </View>
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
  profileCard: {
    borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  avatar: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  avatarText: { color: colors.onPrimary, fontSize: 28, fontWeight: 'bold' },
  profileName: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  profileSchool: { fontSize: 14, marginBottom: 2 },
  profileProgramme: { fontSize: 13, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 12, width: '100%' },
  statItem: { flex: 1, borderRadius: 12, padding: 12, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700', marginBottom: 2 },
  statLabel: { fontSize: 12 },
  section: { borderRadius: 16, padding: 18, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 14 },
  aiCard: { marginBottom: 12 },
  aiRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  aiLabel: { fontSize: 14, fontWeight: '600' },
  aiTag: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  aiTagText: { fontSize: 11, fontWeight: '700' },
  aiText: { fontSize: 13, lineHeight: 20, marginBottom: 14 },
  questionsBox: { borderRadius: 12, padding: 14 },
  questionsTitle: { fontSize: 13, fontWeight: '700', marginBottom: 8 },
  questionItem: { fontSize: 12, lineHeight: 20, marginBottom: 4 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillChip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  skillText: { fontSize: 13, fontWeight: '600' },
  projectRow: { paddingVertical: 10 },
  projectText: { fontSize: 13, lineHeight: 20 },
  coverLetterText: { fontSize: 13, lineHeight: 22 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  infoItem: { width: '48%', borderRadius: 12, padding: 12 },
  infoLabel: { fontSize: 11, marginBottom: 4 },
  infoValue: { fontSize: 14, fontWeight: '600' },
  bottomBar: {
    flexDirection: 'row', paddingHorizontal: 20, paddingBottom: height * 0.03,
    paddingTop: 12, gap: 10, borderTopWidth: 1,
  },
  rejectBtn: { flex: 1, borderRadius: 24, paddingVertical: 14, alignItems: 'center', borderWidth: 1.5 },
  rejectText: { fontSize: 14, fontWeight: '700' },
  shortlistBtn: { flex: 1, borderRadius: 24, paddingVertical: 14, alignItems: 'center' },
  shortlistText: { fontSize: 14, fontWeight: '700' },
  interviewBtn: { flex: 1, borderRadius: 24, paddingVertical: 14, alignItems: 'center' },
  interviewText: { fontSize: 14, fontWeight: '700' },
});
