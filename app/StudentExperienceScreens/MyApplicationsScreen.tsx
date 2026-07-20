import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { TAB_BAR_BOTTOM_PADDING } from '../../src/constants/Colors';
import { useAppStore } from '../../src/store/useAppStore';
import { Application, ApplicationStatus, STATUS_CONFIG, TIMELINE_STEPS } from '../../src/types/application';
import StatusBadge from '../../src/components/StatusBadge';

const { height } = Dimensions.get('window');

const FILTERS: { label: string; value: ApplicationStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Review', value: 'under_review' },
  { label: 'Interview', value: 'interview_scheduled' },
  { label: 'Offer', value: 'offer_received' },
  { label: 'Rejected', value: 'rejected' },
];

export default function MyApplicationsScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { applications, userId } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<ApplicationStatus | 'all'>('all');

  const myApplications = applications.filter((a) => a.studentId === userId);
  const filtered = activeFilter === 'all'
    ? myApplications
    : myApplications.filter((a) => a.status === activeFilter);

  const activeCount = myApplications.filter((a) => !['rejected', 'withdrawn'].includes(a.status)).length;
  const offerCount = myApplications.filter((a) => a.status === 'offer_received' || a.status === 'accepted').length;

  const getProgress = (app: Application): number => {
    const idx = TIMELINE_STEPS.indexOf(app.status);
    if (idx === -1) return 0;
    return (idx + 1) / TIMELINE_STEPS.length;
  };

  const renderItem = useCallback(({ item }: { item: Application }) => {
    const progress = getProgress(item);
    const config = STATUS_CONFIG[item.status];

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ApplicationDetails', { applicationId: item.id })}
        activeOpacity={0.85}
      >
        <View style={styles.cardTopRow}>
          <View style={[styles.avatar, { backgroundColor: item.internship.companyColor }]}>
            <Text style={styles.avatarText}>{item.internship.companyLogo}</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{item.internship.title}</Text>
            <Text style={styles.cardCompany}>{item.internship.company} · {item.internship.duration}</Text>
          </View>
          <StatusBadge status={item.status} size="small" />
        </View>

        {/* Progress bar */}
        <View style={[styles.progressTrack, { backgroundColor: colors.appProgressBg }]}>
          <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: config.color }]} />
        </View>

        {/* Stage dots */}
        <View style={styles.stagesRow}>
          {TIMELINE_STEPS.slice(0, 5).map((step, index) => {
            const stepIdx = TIMELINE_STEPS.indexOf(step);
            const isCompleted = stepIdx <= TIMELINE_STEPS.indexOf(item.status) && item.status !== 'rejected';
            return (
              <View key={step} style={styles.stageItem}>
                <View style={[styles.stageDot, { backgroundColor: isCompleted ? config.color : colors.inputBorder }]} />
                <Text style={[styles.stageLabel, { color: isCompleted ? colors.title : colors.placeholder }]}>
                  {STATUS_CONFIG[step].label.split(' ')[0]}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Date */}
        <Text style={[styles.dateText, { color: colors.placeholder }]}>
          Applied {new Date(item.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </Text>
      </TouchableOpacity>
    );
  }, [navigation, styles, colors, getProgress]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Applications</Text>
          <Text style={styles.headerSub}>{activeCount} active · {offerCount} offer{offerCount !== 1 ? 's' : ''}</Text>
        </View>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={{gap: 8}}>
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[styles.filterChip, activeFilter === filter.value && styles.filterChipActive]}
            onPress={() => setActiveFilter(filter.value)}
          >
            <Text style={[styles.filterText, activeFilter === filter.value && styles.filterTextActive]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.iconCircle }]}>
              <Ionicons name="document-text-outline" size={32} color={colors.placeholder} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.title }]}>No applications yet</Text>
            <Text style={[styles.emptyDesc, { color: colors.subtitle }]}>
              Start applying to internships to track your progress here.
            </Text>
            <TouchableOpacity
              style={[styles.browseBtn, { backgroundColor: colors.accent }]}
              onPress={() => navigation.navigate('HomeDashboard')}
            >
              <Text style={[styles.browseBtnText, { color: colors.onPrimary }]}>Browse Internships</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 24, paddingTop: 16, marginBottom: 16,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: colors.title },
  headerSub: { fontSize: 13, color: colors.subtitle, marginTop: 2 },
  filtersScroll: {
    paddingHorizontal: 24, marginBottom: 16,
  },
  filterChip: {
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 22, paddingVertical: 14, borderRadius: 30,
    backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.inputBorder,
    minHeight: 48, flexShrink: 0,
  },
  filterChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  filterText: { fontSize: 14, color: colors.subtitle, fontWeight: '600' },
  filterTextActive: { color: '#FFF', fontWeight: '700' },
  listContent: { paddingHorizontal: 24, paddingBottom: TAB_BAR_BOTTOM_PADDING, gap: 12 },
  card: {
    backgroundColor: colors.card, borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  avatar: {
    width: 40, height: 40, borderRadius: 20, alignItems: 'center',
    justifyContent: 'center', marginRight: 12,
  },
  avatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: colors.cardTitle, marginBottom: 2 },
  cardCompany: { fontSize: 12, color: colors.subtitle },
  progressTrack: { height: 4, borderRadius: 2, marginBottom: 12 },
  progressFill: { height: 4, borderRadius: 2 },
  stagesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  stageItem: { alignItems: 'center', flex: 1 },
  stageDot: { width: 6, height: 6, borderRadius: 3, marginBottom: 4 },
  stageLabel: { fontSize: 9, fontWeight: '600', textAlign: 'center' },
  dateText: { fontSize: 11 },
  emptyContainer: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 32 },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  browseBtn: { borderRadius: 30, paddingVertical: 14, paddingHorizontal: 32 },
  browseBtnText: { fontSize: 15, fontWeight: '700' },
});
