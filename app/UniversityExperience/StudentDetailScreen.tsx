/**
 * StudentDetailScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Student Detail (reached by tapping a student row
 * in the StudentMonitoring screen)
 *
 * Content:
 *  - Back arrow + header with student name
 *  - Student profile card: large avatar, name, major/year, status pill
 *  - "Internship" info card: company name, role, duration, supervisor
 *  - "Academic" info card: GPA, program, expected graduation
 *  - "Activity timeline" section: list of recent actions/milestones
 *  - Optional action buttons: "Send message", "Export profile"
 *
 * HOW TO USE:
 *  Registered in App.tsx's Stack Navigator:
 *     <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
 * ─────────────────────────────────────────────────────────────────
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


// ─── COLOR PALETTE ───────────────────────────────────────────────
const COLORS = {
  background:        '#F5FBFA',
  backBtnBg:         '#FFFFFF',
  backArrow:         '#0D3B47',
  headerTitle:       '#0D3B47',

  // Profile card
  profileCardBg:     '#FFFFFF',
  avatarBg:          '#0D3B47',
  avatarText:        '#FFFFFF',
  studentName:       '#0D3B47',
  studentDetail:     '#4A7C75',

  // Status pill colors
  statusPlacedBg:       '#D6F2E3',
  statusPlacedText:     '#1E8E5A',
  statusInterviewingBg: '#FBE6C8',
  statusInterviewingText:'#B5750F',
  statusAppliedBg:      '#D6EEF2',
  statusAppliedText:    '#1B7E94',
  statusSeekingBg:      '#FFFFFF',
  statusSeekingBorder:  '#D8E4E2',
  statusSeekingText:    '#7A9D98',

  // Info cards
  sectionCardBg:     '#FFFFFF',
  sectionTitle:      '#0D3B47',
  fieldLabel:        '#9BB8B4',
  fieldValue:        '#0D3B47',
  fieldDivider:      '#F0F6F5',

  // Timeline
  timelineDot:       '#2EC4B6',
  timelineLine:      '#E5F2F0',
  timelineTitle:     '#0D3B47',
  timelineDate:      '#9BB8B4',

  // Action buttons
  accent:            '#2CACAD',
  accentText:        '#FFFFFF',
  secondaryBtnBg:    '#FFFFFF',
  secondaryBtnBorder:'#C5E8E3',
  secondaryBtnText:  '#0D3B47',
};

const STATUS_STYLES: Record<string, { bg: string; text: string; border?: string }> = {
  Placed: { bg: COLORS.statusPlacedBg, text: COLORS.statusPlacedText },
  Interviewing: { bg: COLORS.statusInterviewingBg, text: COLORS.statusInterviewingText },
  Applied: { bg: COLORS.statusAppliedBg, text: COLORS.statusAppliedText },
  Seeking: {
    bg: COLORS.statusSeekingBg,
    text: COLORS.statusSeekingText,
    border: COLORS.statusSeekingBorder,
  },
};

const STUDENT_DATA: Record<string, any> = {
  '1': {
    initials: 'AM', name: 'Alex Morgan', major: 'Computer Science', year: 'Junior',
    status: 'Placed', gpa: '3.87', program: 'B.S. Computer Science', graduation: 'May 2027',
    company: 'Airbnb', role: 'Software Engineering Intern', duration: 'Jun – Aug 2026',
    supervisor: 'Sarah Chen',
    timeline: [
      { title: 'Accepted Airbnb offer', date: 'Apr 15, 2026' },
      { title: 'Completed 3rd round interview', date: 'Apr 8, 2026' },
      { title: 'Applied to Airbnb', date: 'Mar 20, 2026' },
      { title: 'Profile matched (92% fit)', date: 'Mar 18, 2026' },
    ],
  },
  '2': {
    initials: 'PP', name: 'Priya Patel', major: 'Computer Science', year: 'Senior',
    status: 'Interviewing', gpa: '3.92', program: 'B.S. Computer Science', graduation: 'May 2026',
    company: 'Stripe', role: 'Backend Engineering Intern', duration: 'Jul – Sep 2026',
    supervisor: 'James Liu',
    timeline: [
      { title: 'Scheduled final interview', date: 'Apr 18, 2026' },
      { title: 'Passed technical screen', date: 'Apr 10, 2026' },
      { title: 'Applied to Stripe', date: 'Mar 28, 2026' },
    ],
  },
  '3': {
    initials: 'ML', name: 'Marcus Lee', major: 'Electrical Engineering', year: 'Sophomore',
    status: 'Applied', gpa: '3.65', program: 'B.S. Electrical Engineering', graduation: 'May 2028',
    company: 'Notion', role: 'Product Engineering Intern', duration: 'Jun – Aug 2026',
    supervisor: 'TBD',
    timeline: [
      { title: 'Applied to Notion', date: 'Apr 12, 2026' },
      { title: 'Profile matched (85% fit)', date: 'Apr 10, 2026' },
    ],
  },
  '4': {
    initials: 'ZK', name: 'Zara Khan', major: 'EECS', year: 'Junior',
    status: 'Seeking', gpa: '3.78', program: 'B.S. EECS', graduation: 'May 2027',
    company: '—', role: '—', duration: '—',
    supervisor: '—',
    timeline: [
      { title: 'Updated skills portfolio', date: 'Apr 14, 2026' },
      { title: 'Attended career fair', date: 'Apr 5, 2026' },
      { title: 'Completed career interests quiz', date: 'Mar 30, 2026' },
    ],
  },
  '5': {
    initials: 'LN', name: 'Liam Nguyen', major: 'Computer Science', year: 'Senior',
    status: 'Placed', gpa: '3.95', program: 'B.S. Computer Science', graduation: 'May 2026',
    company: 'Meta', role: 'Frontend Engineering Intern', duration: 'Jun – Aug 2026',
    supervisor: 'Emily Park',
    timeline: [
      { title: 'Accepted Meta offer', date: 'Apr 1, 2026' },
      { title: 'Completed onboarding docs', date: 'Apr 5, 2026' },
      { title: 'Applied to Meta', date: 'Mar 10, 2026' },
    ],
  },
};


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function StudentDetailScreen({ navigation, route }: any) {
  const studentId = route.params?.studentId || '1';
  const student = STUDENT_DATA[studentId] ?? STUDENT_DATA['1'];
  const statusStyle = STATUS_STYLES[student.status] ?? STATUS_STYLES.Seeking;

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER ─────────────────────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back-outline" size={22} color={COLORS.backArrow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Student Profile</Text>
        </View>

        {/* ── PROFILE CARD ───────────────────────────────────────── */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{student.initials}</Text>
          </View>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.studentDetail}>{student.major} · {student.year}</Text>

          <View style={[
            styles.statusPill,
            { backgroundColor: statusStyle.bg },
            statusStyle.border ? { borderWidth: 1, borderColor: statusStyle.border } : null,
          ]}>
            <Text style={[styles.statusPillText, { color: statusStyle.text }]}>
              {student.status}
            </Text>
          </View>
        </View>

        {/* ── INTERNSHIP INFO CARD ───────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Internship</Text>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Company</Text>
            <Text style={styles.fieldValue}>{student.company}</Text>
          </View>
          <View style={styles.fieldDivider} />

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Role</Text>
            <Text style={styles.fieldValue}>{student.role}</Text>
          </View>
          <View style={styles.fieldDivider} />

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Duration</Text>
            <Text style={styles.fieldValue}>{student.duration}</Text>
          </View>
          <View style={styles.fieldDivider} />

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Supervisor</Text>
            <Text style={styles.fieldValue}>{student.supervisor}</Text>
          </View>
        </View>

        {/* ── ACADEMIC INFO CARD ─────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Academic</Text>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>GPA</Text>
            <Text style={styles.fieldValue}>{student.gpa}</Text>
          </View>
          <View style={styles.fieldDivider} />

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Program</Text>
            <Text style={styles.fieldValue}>{student.program}</Text>
          </View>
          <View style={styles.fieldDivider} />

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Expected Graduation</Text>
            <Text style={styles.fieldValue}>{student.graduation}</Text>
          </View>
        </View>

        {/* ── ACTIVITY TIMELINE ──────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Activity timeline</Text>

          {student.timeline.map((item: any, index: number) => (
            <View key={index} style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <View style={[
                  styles.timelineDot,
                  index === student.timeline.length - 1 && styles.timelineDotLast,
                ]} />
                {index < student.timeline.length - 1 && (
                  <View style={styles.timelineLine} />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>{item.title}</Text>
                <Text style={styles.timelineDate}>{item.date}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}


// ─── STYLES ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.backBtnBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.headerTitle,
  },

  // Profile card
  profileCard: {
    backgroundColor: COLORS.profileCardBg,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.avatarText,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.studentName,
    marginBottom: 4,
  },
  studentDetail: {
    fontSize: 13,
    color: COLORS.studentDetail,
    marginBottom: 12,
  },
  statusPill: {
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  statusPillText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // Section cards
  sectionCard: {
    backgroundColor: COLORS.sectionCardBg,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.sectionTitle,
    marginBottom: 14,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  fieldLabel: {
    fontSize: 13,
    color: COLORS.fieldLabel,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.fieldValue,
  },
  fieldDivider: {
    height: 1,
    backgroundColor: COLORS.fieldDivider,
  },

  // Timeline
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  timelineLeft: {
    width: 20,
    alignItems: 'center',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.timelineDot,
    marginTop: 4,
  },
  timelineDotLast: {
    // no line after last dot
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.timelineLine,
    marginTop: 4,
    marginBottom: 4,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 12,
    paddingBottom: 16,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.timelineTitle,
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 12,
    color: COLORS.timelineDate,
  },
});
