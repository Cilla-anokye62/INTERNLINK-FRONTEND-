import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { TAB_BAR_BOTTOM_PADDING } from '../../src/constants/Colors';
import StatusBadge from '../../src/components/StatusBadge';
import {
  applicationApi,
  getAuthErrorMessage,
  listingApi,
  type BackendApplicantResponse,
  type BackendApplicationStatus,
} from '../../src/api';
import type { ApplicationStatus } from '../../src/types/application';

type ApplicantFilter = BackendApplicationStatus | 'ALL';
type SortOption = 'Newest' | 'Oldest' | 'A-Z';
type CompanyApplicant = BackendApplicantResponse & {
  listingId: number;
  listingTitle: string;
};

const FILTERS: { label: string; value: ApplicantFilter }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'New', value: 'APPLIED' },
  { label: 'Reviewing', value: 'UNDER_REVIEW' },
  { label: 'Accepted', value: 'ACCEPTED' },
  { label: 'Rejected', value: 'REJECTED' },
];

const SORT_OPTIONS: SortOption[] = ['Newest', 'Oldest', 'A-Z'];

const frontendStatus = (status: BackendApplicationStatus): ApplicationStatus => {
  switch (status) {
    case 'UNDER_REVIEW': return 'under_review';
    case 'ACCEPTED': return 'accepted';
    case 'REJECTED': return 'rejected';
    default: return 'submitted';
  }
};

const initialsFor = (name: string): string => name
  .trim()
  .split(/\s+/)
  .slice(0, 2)
  .map((part) => part.charAt(0).toUpperCase())
  .join('') || 'S';

export default function ApplicantPipelineScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [applicants, setApplicants] = useState<CompanyApplicant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ApplicantFilter>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('Newest');
  const [showSort, setShowSort] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadApplicants = useCallback(async () => {
    setLoadError('');
    try {
      const listings = await listingApi.listOwn();
      const applicantGroups = await Promise.all(
        listings.map(async (listing) => {
          const listingApplicants = await applicationApi.listApplicants(listing.id);
          return listingApplicants.map((applicant) => ({
            ...applicant,
            listingId: listing.id,
            listingTitle: listing.title,
          }));
        }),
      );
      setApplicants(applicantGroups.flat());
    } catch (error) {
      setLoadError(getAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      void loadApplicants();
    }, [loadApplicants]),
  );

  const counts = useMemo(() => applicants.reduce<Record<string, number>>(
    (result, applicant) => {
      result.ALL += 1;
      result[applicant.status] = (result[applicant.status] ?? 0) + 1;
      return result;
    },
    { ALL: 0 },
  ), [applicants]);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return applicants
      .filter((applicant) => activeFilter === 'ALL' || applicant.status === activeFilter)
      .filter((applicant) => !query
        || applicant.studentName.toLowerCase().includes(query)
        || applicant.studentEmail?.toLowerCase().includes(query)
        || applicant.listingTitle.toLowerCase().includes(query))
      .sort((first, second) => {
        if (sortBy === 'Oldest') {
          return new Date(first.appliedAt).getTime() - new Date(second.appliedAt).getTime();
        }
        if (sortBy === 'A-Z') return first.studentName.localeCompare(second.studentName);
        return new Date(second.appliedAt).getTime() - new Date(first.appliedAt).getTime();
      });
  }, [activeFilter, applicants, searchQuery, sortBy]);

  const updateStatus = async (applicant: CompanyApplicant, status: 'ACCEPTED' | 'REJECTED') => {
    if (updatingId !== null) return;
    setUpdatingId(applicant.id);
    try {
      const updated = await applicationApi.updateStatus(applicant.id, status);
      setApplicants((current) => current.map((item) => item.id === applicant.id
        ? { ...item, ...updated }
        : item));
    } catch (error) {
      Alert.alert('Could not update application', getAuthErrorMessage(error));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Applicants</Text>
          <Text style={styles.headerSubtitle}>
            {applicants.length} total · {counts.APPLIED ?? 0} new
          </Text>
        </View>
        <TouchableOpacity style={styles.sortBtn} onPress={() => setShowSort((visible) => !visible)}>
          <Text style={styles.sortText}>Sort: {sortBy}</Text>
        </TouchableOpacity>
      </View>

      {showSort ? (
        <View style={styles.sortDropdown}>
          {SORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.sortOption, sortBy === option && styles.sortOptionActive]}
              onPress={() => {
                setSortBy(option);
                setShowSort(false);
              }}
            >
              <Text style={[styles.sortOptionText, sortBy === option && styles.sortOptionTextActive]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={16} color={colors.placeholder} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search name, email, or internship..."
          placeholderTextColor={colors.placeholder}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersRow}
      >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[styles.filterChip, activeFilter === filter.value && styles.filterChipActive]}
            onPress={() => setActiveFilter(filter.value)}
          >
            <Text style={[styles.filterText, activeFilter === filter.value && styles.filterTextActive]}>
              {filter.label} ({counts[filter.value] ?? 0})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(applicant) => String(applicant.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => void loadApplicants()}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.applicantCard}>
            <View style={styles.cardTop}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initialsFor(item.studentName)}</Text>
              </View>
              <View style={styles.applicantInfo}>
                <Text style={styles.applicantName}>{item.studentName}</Text>
                <Text style={styles.applicantMeta}>{item.studentEmail || 'No email available'}</Text>
              </View>
              <StatusBadge status={frontendStatus(item.status)} size="small" />
            </View>

            <Text style={styles.listingTitle}>{item.listingTitle}</Text>
            <Text style={styles.appliedDate}>
              Applied {new Date(item.appliedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>

            {item.status !== 'ACCEPTED' && item.status !== 'REJECTED' ? (
              <View style={styles.quickActions}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  disabled={updatingId !== null}
                  onPress={() => void updateStatus(item, 'ACCEPTED')}
                >
                  {updatingId === item.id
                    ? <ActivityIndicator size="small" color={colors.onPrimary} />
                    : <Text style={styles.acceptButtonText}>Accept</Text>}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectButton}
                  disabled={updatingId !== null}
                  onPress={() => void updateStatus(item, 'REJECTED')}
                >
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {isLoading ? (
              <ActivityIndicator color={colors.accent} />
            ) : loadError ? (
              <>
                <Ionicons name="cloud-offline-outline" size={44} color={colors.subtitle} />
                <Text style={styles.emptyTitle}>Could not load applicants</Text>
                <Text style={styles.emptyDesc}>{loadError}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => void loadApplicants()}>
                  <Text style={styles.retryButtonText}>Try again</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Ionicons name="people-outline" size={48} color={colors.subtitle} />
                <Text style={styles.emptyTitle}>No applicants found</Text>
                <Text style={styles.emptyDesc}>Applications for your published internships will appear here.</Text>
              </>
            )}
          </View>
        }
      />
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
  sortBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: colors.iconCircle },
  sortText: { fontSize: 12, fontWeight: '600', color: colors.accent },
  sortDropdown: {
    marginHorizontal: 20, borderRadius: 12, borderWidth: 1, borderColor: colors.inputBorder,
    padding: 4, marginBottom: 8, backgroundColor: colors.card,
  },
  sortOption: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  sortOptionActive: { backgroundColor: colors.iconCircle },
  sortOptionText: { fontSize: 14, fontWeight: '500', color: colors.title },
  sortOptionTextActive: { color: colors.accent },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, borderWidth: 1,
    borderColor: colors.inputBorder, backgroundColor: colors.card, marginHorizontal: 20,
    paddingHorizontal: 14, paddingVertical: 10, marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.text },
  filtersScroll: { flexGrow: 0, marginBottom: 12 },
  filtersRow: { paddingHorizontal: 20, gap: 8 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.inputBorder,
  },
  filterChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  filterText: { fontSize: 12, color: colors.subtitle, fontWeight: '600' },
  filterTextActive: { color: colors.onPrimary },
  listContent: { paddingHorizontal: 20, paddingBottom: TAB_BAR_BOTTOM_PADDING, gap: 12, flexGrow: 1 },
  applicantCard: {
    backgroundColor: colors.card, borderRadius: 16, borderWidth: 1,
    borderColor: colors.applicantCardBorder, padding: 14,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: {
    width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
    marginRight: 12, backgroundColor: colors.accent,
  },
  avatarText: { color: colors.onPrimary, fontSize: 14, fontWeight: '700' },
  applicantInfo: { flex: 1, marginRight: 8 },
  applicantName: { fontSize: 15, fontWeight: '700', color: colors.title, marginBottom: 2 },
  applicantMeta: { fontSize: 12, color: colors.subtitle },
  listingTitle: { fontSize: 13, fontWeight: '700', color: colors.title, marginBottom: 4 },
  appliedDate: { fontSize: 12, color: colors.subtitle },
  quickActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  acceptButton: {
    flex: 1, minHeight: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.accent,
  },
  acceptButtonText: { color: colors.onPrimary, fontSize: 13, fontWeight: '700' },
  rejectButton: {
    flex: 1, minHeight: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.withdrawBg,
  },
  rejectButtonText: { color: colors.withdrawText, fontSize: 13, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 72, paddingHorizontal: 24, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.title, textAlign: 'center' },
  emptyDesc: { fontSize: 14, color: colors.subtitle, textAlign: 'center', lineHeight: 20 },
  retryButton: { marginTop: 4, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, backgroundColor: colors.accent },
  retryButtonText: { color: colors.onPrimary, fontSize: 13, fontWeight: '700' },
});
