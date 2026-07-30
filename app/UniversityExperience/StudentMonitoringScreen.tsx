import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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
import {
  getAuthErrorMessage,
  universityApi,
  type PlacementStatus,
  type StudentPlacementResponse,
} from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { TAB_BAR_BOTTOM_PADDING } from '../../src/constants/Colors';

type Filter = PlacementStatus | 'ALL';

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Placed', value: 'PLACED' },
  { label: 'Searching', value: 'SEARCHING' },
  { label: 'Not started', value: 'NOT_STARTED' },
];

const initialsFor = (name: string) => name
  .trim()
  .split(/\s+/)
  .slice(0, 2)
  .map((part) => part.charAt(0).toUpperCase())
  .join('') || 'S';

export default function StudentMonitoringScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [students, setStudents] = useState<StudentPlacementResponse[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStudents = useCallback(async () => {
    setError('');
    try {
      setStudents(await universityApi.listStudents());
    } catch (loadError) {
      setError(getAuthErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      void loadStudents();
    }, [loadStudents]),
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return students.filter((student) => {
      const matchesFilter = filter === 'ALL' || student.placementStatus === filter;
      const matchesSearch = !query
        || student.fullName.toLowerCase().includes(query)
        || student.email?.toLowerCase().includes(query)
        || student.program?.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [filter, search, students]);

  const placed = students.filter((student) => student.placementStatus === 'PLACED').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Students</Text>
        <Text style={styles.subtitle}>{students.length} total · {placed} placed</Text>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={17} color={colors.placeholder} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search students..."
          placeholderTextColor={colors.placeholder}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterRow}>
        {FILTERS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[styles.filterChip, filter === option.value && styles.filterChipActive]}
            onPress={() => setFilter(option.value)}
          >
            <Text style={[styles.filterText, filter === option.value && styles.filterTextActive]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(student) => String(student.studentId)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => void loadStudents()}
            colors={[colors.accent]}
            tintColor={colors.accent}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.studentRow}
            onPress={() => navigation.navigate('StudentDetail', { student: item })}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initialsFor(item.fullName)}</Text>
            </View>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{item.fullName}</Text>
              <Text style={styles.studentMeta}>
                {[item.program, item.level].filter(Boolean).join(' · ') || item.email || 'Profile incomplete'}
              </Text>
              <Text style={styles.applicationCount}>{item.applicationCount} application{item.applicationCount === 1 ? '' : 's'}</Text>
            </View>
            <View style={[
              styles.statusPill,
              item.placementStatus === 'PLACED' && styles.placedPill,
            ]}>
              <Text style={[
                styles.statusText,
                item.placementStatus === 'PLACED' && styles.placedText,
              ]}>
                {item.placementStatus.replace('_', ' ')}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {loading ? (
              <ActivityIndicator color={colors.accent} />
            ) : error ? (
              <>
                <Text style={styles.emptyTitle}>Could not load students</Text>
                <Text style={styles.emptyText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => void loadStudents()}>
                  <Text style={styles.retryText}>Try again</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Ionicons name="school-outline" size={44} color={colors.subtitle} />
                <Text style={styles.emptyTitle}>No students found</Text>
                <Text style={styles.emptyText}>Students appear after selecting this university in their profile.</Text>
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
  header: { paddingHorizontal: 20, paddingTop: 15, marginBottom: 14 },
  title: { color: colors.title, fontSize: 22, fontWeight: '700' },
  subtitle: { color: colors.subtitle, fontSize: 13, marginTop: 3 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 47, marginHorizontal: 20, borderRadius: 14, paddingHorizontal: 13, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder },
  searchInput: { flex: 1, color: colors.text, fontSize: 14 },
  filterScroll: { flexGrow: 0, marginVertical: 13 },
  filterRow: { paddingHorizontal: 20, gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 19, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder },
  filterChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  filterText: { color: colors.subtitle, fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: colors.onPrimary },
  listContent: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: TAB_BAR_BOTTOM_PADDING, gap: 10 },
  studentRow: { flexDirection: 'row', alignItems: 'center', padding: 13, borderRadius: 15, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder },
  avatar: { width: 45, height: 45, borderRadius: 23, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  avatarText: { color: colors.onPrimary, fontSize: 13, fontWeight: '800' },
  studentInfo: { flex: 1, marginRight: 6 },
  studentName: { color: colors.title, fontSize: 14, fontWeight: '700' },
  studentMeta: { color: colors.subtitle, fontSize: 11, marginTop: 2 },
  applicationCount: { color: colors.accent, fontSize: 10, fontWeight: '600', marginTop: 5 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 14, backgroundColor: colors.iconCircle },
  statusText: { color: colors.accent, fontSize: 9, fontWeight: '800' },
  placedPill: { backgroundColor: '#DCFCE7' },
  placedText: { color: '#166534' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 70, paddingHorizontal: 28, gap: 10 },
  emptyTitle: { color: colors.title, fontSize: 17, fontWeight: '700', textAlign: 'center' },
  emptyText: { color: colors.subtitle, fontSize: 13, lineHeight: 19, textAlign: 'center' },
  retryButton: { marginTop: 5, paddingHorizontal: 19, paddingVertical: 10, borderRadius: 20, backgroundColor: colors.accent },
  retryText: { color: colors.onPrimary, fontSize: 13, fontWeight: '700' },
});
