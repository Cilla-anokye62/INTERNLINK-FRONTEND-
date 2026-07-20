import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';
import { TAB_BAR_BOTTOM_PADDING } from '../../src/constants/Colors';
import { Application, ApplicationStatus, STATUS_CONFIG, ApplicantWithApplication } from '../../src/types/application';
import StatusBadge from '../../src/components/StatusBadge';

const { height } = Dimensions.get('window');

const PIPELINE_FILTERS: { label: string; value: ApplicationStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'submitted' },
  { label: 'Reviewing', value: 'under_review' },
  { label: 'Shortlisted', value: 'shortlisted' },
  { label: 'Interview', value: 'interview_scheduled' },
  { label: 'Offer', value: 'offer_received' },
];

const SORT_OPTIONS = ['Newest', 'Highest Match', 'Oldest', 'A-Z'];

export default function ApplicantPipelineScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { applications, userId, updateApplicationStatus } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ApplicationStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState('Newest');
  const [showSort, setShowSort] = useState(false);

  const employerApps = applications.filter((a) => a.employerId === userId);

  const filtered = employerApps
    .filter((a) => activeFilter === 'all' || a.status === activeFilter)
    .filter((a) =>
      a.internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'Newest': return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        case 'Oldest': return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
        case 'Highest Match': return b.internship.matchScore - a.internship.matchScore;
        default: return 0;
      }
    });

  const getStatusCounts = () => {
    const counts: Record<string, number> = { all: employerApps.length };
    employerApps.forEach((a) => {
      counts[a.status] = (counts[a.status] || 0) + 1;
    });
    return counts;
  };
  const counts = getStatusCounts();

  const handleQuickAction = (appId: string, action: ApplicationStatus) => {
    updateApplicationStatus(appId, action);
  };

  const MOCK_STUDENT_NAMES: Record<string, string> = {
    'student-1': 'Alex Morgan',
    'student-2': 'Priya Patel',
    'student-3': 'Marcus Lee',
    'student-4': 'Zara Khan',
    'student-5': 'Liam Nguyen',
  };

  const MOCK_SCHOOLS: Record<string, string> = {
    'student-1': 'MIT · CS Junior',
    'student-2': 'Stanford · CS Senior',
    'student-3': 'CMU · CS Sophomore',
    'student-4': 'Berkeley · EECS Junior',
    'student-5': 'UCLA · CS Senior',
  };

  const MOCK_INITIALS: Record<string, string> = {
    'student-1': 'AM',
    'student-2': 'PP',
    'student-3': 'ML',
    'student-4': 'ZK',
    'student-5': 'LN',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Applicants</Text>
          <Text style={styles.headerSubtitle}>{employerApps.length} total · {counts['submitted'] || 0} new</Text>
        </View>
        <TouchableOpacity style={styles.sortBtn} onPress={() => setShowSort(!showSort)}>
          <Text style={[styles.sortText, { color: colors.accent }]}>Sort: {sortBy}</Text>
        </TouchableOpacity>
      </View>

      {/* Sort dropdown */}
      {showSort && (
        <View style={[styles.sortDropdown, { backgroundColor: colors.card, borderColor: colors.inputBorder }]}>
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.sortOption, sortBy === opt && { backgroundColor: colors.iconCircle }]}
              onPress={() => { setSortBy(opt); setShowSort(false); }}
            >
              <Text style={[styles.sortOptionText, { color: sortBy === opt ? colors.accent : colors.title }]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.inputBorder }]}>
        <Ionicons name="search-outline" size={16} color={colors.placeholder} style={{ marginRight: 8 }} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search applicants..."
          placeholderTextColor={colors.placeholder}
        />
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={styles.filtersRow}>
        {PIPELINE_FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[styles.filterChip, activeFilter === filter.value && styles.filterChipActive]}
            onPress={() => setActiveFilter(filter.value)}
          >
            <Text style={[styles.filterText, activeFilter === filter.value && styles.filterTextActive]}>
              {filter.label} {counts[filter.value] ? `(${counts[filter.value]})` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Applicant list */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={colors.subtitle} style={{ marginBottom: 16 }} />
            <Text style={[styles.emptyTitle, { color: colors.title }]}>No applicants found</Text>
            <Text style={[styles.emptyDesc, { color: colors.subtitle }]}>Try adjusting your filters or search.</Text>
          </View>
        ) : (
          filtered.map((app) => {
            const name = MOCK_STUDENT_NAMES[app.studentId] || 'Student';
            const school = MOCK_SCHOOLS[app.studentId] || 'University';
            const initials = MOCK_INITIALS[app.studentId] || name.substring(0, 2).toUpperCase();

            return (
              <TouchableOpacity
                key={app.id}
                style={styles.applicantCard}
                onPress={() => navigation.navigate('ApplicantProfile', { applicationId: app.id })}
                activeOpacity={0.8}
              >
                <View style={styles.cardTop}>
                  <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
                    <Text style={styles.avatarText}>{initials}</Text>
                  </View>
                  <View style={styles.applicantInfo}>
                    <Text style={styles.applicantName}>{name}</Text>
                    <Text style={styles.applicantMeta}>{school}</Text>
                  </View>
                  <StatusBadge status={app.status} size="small" />
                </View>

                <View style={styles.cardMiddle}>
                  <View style={[styles.matchBadge, { backgroundColor: colors.iconCircle }]}>
                    <Text style={[styles.matchText, { color: colors.accent }]}>{app.internship.matchScore}% match</Text>
                  </View>
                  <View style={[styles.dateBadge, { backgroundColor: colors.ratePillBg }]}>
                    <Text style={[styles.dateText, { color: colors.ratePillText }]}>
                      {new Date(app.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                  </View>
                  {app.resume && (
                    <View style={[styles.resumeBadge, { backgroundColor: colors.iconCircle }]}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Ionicons name="document-text-outline" size={11} color={colors.accent} />
                        <Text style={[styles.resumeText, { color: colors.accent }]}>Resume</Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* Quick actions */}
                {app.status === 'submitted' && (
                  <View style={styles.quickActions}>
                    <TouchableOpacity
                      style={[styles.quickBtn, { backgroundColor: colors.accent }]}
                      onPress={() => handleQuickAction(app.id, 'under_review')}
                    >
                      <Text style={[styles.quickBtnText, { color: colors.onPrimary }]}>Review</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.quickBtn, { backgroundColor: colors.successBg }]}
                      onPress={() => handleQuickAction(app.id, 'shortlisted')}
                    >
                      <Text style={[styles.quickBtnText, { color: colors.successText }]}>Shortlist</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.quickBtn, { backgroundColor: colors.withdrawBg }]}
                      onPress={() => handleQuickAction(app.id, 'rejected')}
                    >
                      <Text style={[styles.quickBtnText, { color: colors.withdrawText }]}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {app.status === 'under_review' && (
                  <View style={styles.quickActions}>
                    <TouchableOpacity
                      style={[styles.quickBtn, { backgroundColor: colors.successBg }]}
                      onPress={() => handleQuickAction(app.id, 'shortlisted')}
                    >
                      <Text style={[styles.quickBtnText, { color: colors.successText }]}>Shortlist</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.quickBtn, { backgroundColor: colors.interviewCardBg }]}
                      onPress={() => navigation.navigate('InterviewSchedule', { applicationId: app.id })}
                    >
                      <Text style={[styles.quickBtnText, { color: colors.interviewCardText }]}>Schedule Interview</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.quickBtn, { backgroundColor: colors.withdrawBg }]}
                      onPress={() => handleQuickAction(app.id, 'rejected')}
                    >
                      <Text style={[styles.quickBtnText, { color: colors.withdrawText }]}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {app.status === 'shortlisted' && (
                  <View style={styles.quickActions}>
                    <TouchableOpacity
                      style={[styles.quickBtn, { backgroundColor: colors.interviewCardBg }]}
                      onPress={() => navigation.navigate('InterviewSchedule', { applicationId: app.id })}
                    >
                      <Text style={[styles.quickBtnText, { color: colors.interviewCardText }]}>Schedule Interview</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.quickBtn, { backgroundColor: colors.offerCardBg }]}
                      onPress={() => navigation.navigate('OfferSend', { applicationId: app.id })}
                    >
                      <Text style={[styles.quickBtnText, { color: colors.offerCardText }]}>Send Offer</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: colors.title },
  headerSubtitle: { fontSize: 13, color: colors.subtitle, marginTop: 2 },
  sortBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: colors.iconCircle },
  sortText: { fontSize: 12, fontWeight: '600' },
  sortDropdown: {
    marginHorizontal: 20, borderRadius: 12, borderWidth: 1, padding: 4, marginBottom: 8,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  sortOption: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  sortOptionText: { fontSize: 14, fontWeight: '500' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1,
    marginHorizontal: 20, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 14 },
  filtersScroll: { flexGrow: 0, marginBottom: 12 },
  filtersRow: { paddingHorizontal: 20, gap: 8 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.inputBorder,
  },
  filterChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  filterText: { fontSize: 12, color: colors.subtitle, fontWeight: '600' },
  filterTextActive: { color: '#FFF' },
  listContent: { paddingHorizontal: 20, paddingBottom: TAB_BAR_BOTTOM_PADDING, gap: 12 },
  applicantCard: {
    backgroundColor: colors.card, borderRadius: 16, borderWidth: 1,
    borderColor: colors.applicantCardBorder, padding: 14,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: {
    width: 44, height: 44, borderRadius: 22, alignItems: 'center',
    justifyContent: 'center', marginRight: 12,
  },
  avatarText: { color: colors.onPrimary, fontSize: 14, fontWeight: '700' },
  applicantInfo: { flex: 1 },
  applicantName: { fontSize: 15, fontWeight: '700', color: colors.title, marginBottom: 2 },
  applicantMeta: { fontSize: 12, color: colors.subtitle },
  cardMiddle: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 },
  matchBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  matchText: { fontSize: 12, fontWeight: '600' },
  dateBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  dateText: { fontSize: 11, fontWeight: '500' },
  resumeBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  resumeText: { fontSize: 11, fontWeight: '600' },
  quickActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  quickBtn: { flex: 1, borderRadius: 20, paddingVertical: 8, alignItems: 'center' },
  quickBtnText: { fontSize: 12, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptyDesc: { fontSize: 14 },
});
