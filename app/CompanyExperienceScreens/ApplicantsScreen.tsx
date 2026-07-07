import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// ---------- Types ----------
type Props = NativeStackScreenProps<any, any>;
type ApplicantStatus = 'New' | 'Shortlisted' | 'Reviewed' | 'Interview';

interface Applicant {
  id: string;
  initials: string;
  name: string;
  school: string;
  major: string;
  matchPercent: number;
  skills: string[];
  status: ApplicantStatus;
}

// ---------- Main Screen ----------
const ApplicantsScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const applicants: Applicant[] = [
    {
      id: '1',
      initials: 'AM',
      name: 'Alex Morgan',
      school: 'MIT',
      major: 'CS Junior',
      matchPercent: 96,
      skills: ['React', '+3'],
      status: 'New',
    },
    {
      id: '2',
      initials: 'PP',
      name: 'Priya Patel',
      school: 'Stanford',
      major: 'CS Senior',
      matchPercent: 94,
      skills: ['React', '+3'],
      status: 'Shortlisted',
    },
    {
      id: '3',
      initials: 'ML',
      name: 'Marcus Lee',
      school: 'CMU',
      major: 'CS Sophomore',
      matchPercent: 89,
      skills: ['React', '+3'],
      status: 'Reviewed',
    },
    {
      id: '4',
      initials: 'ZK',
      name: 'Zara Khan',
      school: 'Berkeley',
      major: 'EECS Junior',
      matchPercent: 87,
      skills: ['React', '+3'],
      status: 'Interview',
    },
    {
      id: '5',
      initials: 'LN',
      name: 'Liam Nguyen',
      school: 'UCLA',
      major: 'CS Senior',
      matchPercent: 85,
      skills: ['React', '+3'],
      status: 'New',
    },
  ];

  const filteredApplicants = applicants.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.school.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusStyle = (status: ApplicantStatus) => {
    switch (status) {
      case 'New':
        return { badge: styles.badgeNew, text: styles.badgeTextNew };
      case 'Shortlisted':
        return { badge: styles.badgeShortlisted, text: styles.badgeTextShortlisted };
      case 'Reviewed':
        return { badge: styles.badgeReviewed, text: styles.badgeTextReviewed };
      case 'Interview':
        return { badge: styles.badgeInterview, text: styles.badgeTextInterview };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Applicants</Text>
          <Text style={styles.headerSubtitle}>
            Frontend Eng Intern · 124
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.filterIcon}>⚲</Text>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name, skill, school..."
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Applicants list */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredApplicants.map((applicant) => {
          const statusStyle = getStatusStyle(applicant.status);
          return (
            <TouchableOpacity
              key={applicant.id}
              style={styles.applicantCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ApplicantDetail')}
            >
              <View style={styles.cardTop}>
                {/* Avatar */}
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{applicant.initials}</Text>
                </View>

                {/* Name + school */}
                <View style={styles.applicantInfo}>
                  <Text style={styles.applicantName}>{applicant.name}</Text>
                  <Text style={styles.applicantMeta}>
                    {applicant.school} · {applicant.major}
                  </Text>
                </View>

                {/* Status badge */}
                <View style={[styles.statusBadge, statusStyle.badge]}>
                  <Text style={[styles.statusBadgeText, statusStyle.text]}>
                    {applicant.status}
                  </Text>
                </View>
              </View>

              {/* Skills + match */}
              <View style={styles.cardBottom}>
                <View style={styles.matchBadge}>
                  <Text style={styles.matchText}>
                    {applicant.matchPercent}% match
                  </Text>
                </View>
                {applicant.skills.map((skill) => (
                  <View key={skill} style={styles.skillChip}>
                    <Text style={styles.skillChipText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
    backgroundColor: '#F2FBFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#F2FBFA',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  headerSubtitle: {
    fontSize: 13,
    color: TEXT_GRAY,
    marginTop: 2,
  },
  filterIcon: {
    fontSize: 22,
    color: TEXT_GRAY,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: TEXT_DARK,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },
  applicantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 14,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: TEAL_DARK,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  applicantInfo: {
    flex: 1,
  },
  applicantName: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 2,
  },
  applicantMeta: {
    fontSize: 12,
    color: TEXT_GRAY,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeNew: {
    backgroundColor: TEAL_LIGHT,
  },
  badgeTextNew: {
    color: TEAL_DARK,
  },
  badgeShortlisted: {
    backgroundColor: '#D1FAE5',
  },
  badgeTextShortlisted: {
    color: '#065F46',
  },
  badgeReviewed: {
    backgroundColor: '#F3F4F6',
  },
  badgeTextReviewed: {
    color: TEXT_GRAY,
  },
  badgeInterview: {
    backgroundColor: '#FEF3C7',
  },
  badgeTextInterview: {
    color: '#D97706',
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
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
  skillChip: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  skillChipText: {
    fontSize: 12,
    color: TEXT_GRAY,
    fontWeight: '500',
  },
});

export default ApplicantsScreen;