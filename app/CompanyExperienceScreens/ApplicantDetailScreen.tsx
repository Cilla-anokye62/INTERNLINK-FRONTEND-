import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// ---------- Types ----------
type Props = NativeStackScreenProps<any, any>;

// ---------- Main Screen ----------
const ApplicantDetailScreen: React.FC<Props> = ({ navigation }) => {
  const handleReject = (): void => {
    console.log('Reject pressed');
    // TODO: reject applicant logic
  };

  const handleMoveToInterview = (): void => {
    console.log('Move to Interview pressed');
    // TODO: move to interview logic
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.messageIcon}>💬</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile section */}
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AM</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.applicantName}>Alex Morgan</Text>
            <Text style={styles.applicantMeta}>
              MIT · CS Junior · Class of 2026
            </Text>
            <View style={styles.badgeRow}>
              <View style={styles.matchBadge}>
                <Text style={styles.matchText}>96% match</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Verified</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, styles.statBoxDivider]}>
            <Text style={styles.statLabel}>GPA</Text>
            <Text style={styles.statValue}>3.8</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxDivider]}>
            <Text style={styles.statLabel}>Skills match</Text>
            <Text style={styles.statValue}>9/10</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Portfolio</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.statValueLink}>View</Text>
              <Text style={styles.statLinkArrow}>↗</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI summary */}
        <Text style={styles.sectionTitle}>AI summary</Text>
        <View style={styles.aiSummaryCard}>
          <Text style={styles.aiIcon}>✨</Text>
          <Text style={styles.aiSummaryText}>
            Strong frontend candidate with React + TypeScript experience at
            Vercel. Portfolio shows real product shipping. Top 2% of
            applicants for this role.
          </Text>
        </View>

        {/* Cover letter */}
        <Text style={styles.sectionTitle}>Cover letter</Text>
        <View style={styles.card}>
          <Text style={styles.coverLetterText}>
            I've been a daily user of your platform tools since high school.
            What drew me to apply is your team's commitment to fast iteration
            with strong tasteful design...
          </Text>
        </View>

        {/* Resume */}
        <Text style={styles.sectionTitle}>Resume</Text>
        <View style={styles.resumeCard}>
          <View style={styles.resumeIconCircle}>
            <Text style={styles.resumeIcon}>📄</Text>
          </View>
          <View style={styles.resumeInfo}>
            <Text style={styles.resumeFileName}>Alex_Morgan_Resume.pdf</Text>
            <Text style={styles.resumeMeta}>482 KB · Updated 3 days ago</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.downloadIcon}>⬇️</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom buttons */}
      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={handleReject}
          activeOpacity={0.7}
        >
          <Text style={styles.rejectText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.interviewButton}
          onPress={handleMoveToInterview}
          activeOpacity={0.8}
        >
          <Text style={styles.interviewText}>Move to Interview</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ---------- Styles ----------
const TEAL = '#2BA9A0';
const TEAL_DARK = '#1E8A82';
const TEAL_LIGHT = '#E6F5F4';
const TEXT_DARK = '#1A1A1A';
const TEXT_GRAY = '#6B7280';
const BORDER_COLOR = '#E5E7EB';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  backButton: {
    padding: 4,
  },
  backIcon: {
    fontSize: 18,
    color: TEXT_DARK,
    fontWeight: '600',
  },
  messageIcon: {
    fontSize: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: TEAL_DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  applicantName: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  applicantMeta: {
    fontSize: 13,
    color: TEXT_GRAY,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  matchBadge: {
    backgroundColor: TEAL_LIGHT,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  matchText: {
    fontSize: 12,
    color: TEAL_DARK,
    fontWeight: '600',
  },
  verifiedBadge: {
    backgroundColor: '#D1FAE5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingVertical: 16,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statBoxDivider: {
    borderRightWidth: 1,
    borderRightColor: BORDER_COLOR,
  },
  statLabel: {
    fontSize: 11,
    color: TEXT_GRAY,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  statValueLink: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_DARK,
    textAlign: 'center',
  },
  statLinkArrow: {
    fontSize: 12,
    color: TEAL,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 10,
  },
  aiSummaryCard: {
    flexDirection: 'row',
    backgroundColor: TEAL_LIGHT,
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
    gap: 10,
    alignItems: 'flex-start',
  },
  aiIcon: {
    fontSize: 16,
  },
  aiSummaryText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: TEAL_DARK,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 14,
    marginBottom: 24,
  },
  coverLetterText: {
    fontSize: 13,
    lineHeight: 20,
    color: TEXT_GRAY,
  },
  resumeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 14,
    marginBottom: 16,
    gap: 12,
  },
  resumeIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: TEAL_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumeIcon: {
    fontSize: 18,
  },
  resumeInfo: {
    flex: 1,
  },
  resumeFileName: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 2,
  },
  resumeMeta: {
    fontSize: 12,
    color: TEXT_GRAY,
  },
  downloadIcon: {
    fontSize: 20,
  },
  bottomRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
    backgroundColor: '#FFFFFF',
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    alignItems: 'center',
  },
  rejectText: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  interviewButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: TEAL,
    alignItems: 'center',
  },
  interviewText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default ApplicantDetailScreen;