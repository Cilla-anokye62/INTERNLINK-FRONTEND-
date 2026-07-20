/**
 * StudentMonitoringScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Student Monitoring (Students tab for university users)
 *
 * Content (from design):
 *  - Header: "Students" title + "1,476 total · 1,248 placed" subtitle
 *    + filter button on the right
 *  - Search bar: "Search students..."
 *  - List of student rows, each with: avatar initials, name, status pill,
 *    and a detail line (major · year · company/status)
 *  - Status pills have different colors depending on status:
 *    Placed (green), Interviewing (orange), Applied (light teal),
 *    Seeking (grey outline)
 *  - Bottom tab bar with "Students" highlighted as active
 *
 * HOW TO USE:
 *  1. Drop inside your screens/ or app/ folder
 *  2. Add to App.tsx:
 *     import StudentMonitoringScreen from './app/StudentMonitoringScreen';
 *     <Stack.Screen name="StudentMonitoring" component={StudentMonitoringScreen} />
 * ─────────────────────────────────────────────────────────────────
 */

// ─── IMPORTS ─────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // non-deprecated version
import { Ionicons } from '@expo/vector-icons';
import FilterModal from './FilterModal';


// ─── COLOR PALETTE ───────────────────────────────────────────────
const COLORS = {
  background:        '#F5FBFA', // mint — full screen background
  headerTitle:       '#0D3B47', // "Students"
  headerSubtitle:    '#4A7C75', // "1,476 total · 1,248 placed"
  filterBtnBg:       '#FFFFFF', // filter icon circle background
  filterIcon:        '#0D3B47',

  // Search bar
  searchBg:          '#FFFFFF',
  searchBorder:      '#FFFFFF', // no visible border in the design, just a soft shadow
  searchPlaceholder: '#9BB8B4',
  searchIcon:        '#9BB8B4',

  // Student rows
  rowBg:             '#FFFFFF',
  avatarBg:          '#0D3B47', // dark teal circle with initials
  avatarText:        '#FFFFFF',
  studentName:       '#0D3B47',
  studentDetail:     '#9BB8B4',

  // Status pill colors — each status has its own background + text color
  statusPlacedBg:       '#D6F2E3',
  statusPlacedText:     '#1E8E5A',
  statusInterviewingBg: '#FBE6C8',
  statusInterviewingText:'#B5750F',
  statusAppliedBg:      '#D6EEF2',
  statusAppliedText:    '#1B7E94',
  statusSeekingBg:      '#FFFFFF',
  statusSeekingBorder:  '#D8E4E2',
  statusSeekingText:    '#7A9D98',

  // Bottom tab bar
  tabBarBg:          '#FFFFFF',
  tabActive:         '#2EC4B6',
  tabInactive:       '#9BB8B4',
};


// ─── DATA ─────────────────────────────────────────────────────────

// Each student's status determines the color of their pill.
// Storing the 4 possible statuses' styles here means the row rendering
// logic below can just look up the right colors instead of using a
// long if/else chain for every student.
const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; border?: string }
> = {
  Placed: { bg: COLORS.statusPlacedBg, text: COLORS.statusPlacedText },
  Interviewing: { bg: COLORS.statusInterviewingBg, text: COLORS.statusInterviewingText },
  Applied: { bg: COLORS.statusAppliedBg, text: COLORS.statusAppliedText },
  Seeking: {
    bg: COLORS.statusSeekingBg,
    text: COLORS.statusSeekingText,
    border: COLORS.statusSeekingBorder,
  },
};

// The student list. In the real app this would come from your backend —
// for now it's hardcoded to match the design exactly.
// initials + a unique avatarColor give each row a distinct-looking avatar.
const STUDENTS = [
  {
    id: '1',
    initials: 'AM',
    name: 'Alex Morgan',
    detail: 'CS · Junior · at Airbnb',
    status: 'Placed',
  },
  {
    id: '2',
    initials: 'PP',
    name: 'Priya Patel',
    detail: 'CS · Senior · at Stripe',
    status: 'Interviewing',
  },
  {
    id: '3',
    initials: 'ML',
    name: 'Marcus Lee',
    detail: 'EE · Sophomore · at Notion',
    status: 'Applied',
  },
  {
    id: '4',
    initials: 'ZK',
    name: 'Zara Khan',
    detail: 'EECS · Junior · no offer yet',
    status: 'Seeking',
  },
  {
    id: '5',
    initials: 'LN',
    name: 'Liam Nguyen',
    detail: 'CS · Senior · at Meta',
    status: 'Placed',
  },
];

// Bottom tab bar items — same set used across all university screens.
// "students" stays highlighted active since this screen IS that tab.


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function StudentMonitoringScreen({ navigation }: any) {

  // Stores what the user has typed into the search bar
  const [searchText, setSearchText] = useState('');

  // Filter modal state
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Header counts — later these would come from your backend/API
  const totalStudents = 1476;
  const placedStudents = 1248;

  // Filters the STUDENTS array based on search text AND active status filters.
  const filteredStudents = STUDENTS.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter = activeFilters.length === 0 || activeFilters.includes(student.status);
    return matchesSearch && matchesFilter;
  });

  const handleFilterPress = () => {
    setFilterVisible(true);
  };

  const handleFilterApply = (filters: string[]) => {
    setActiveFilters(filters);
  };

  const handleStudentPress = (studentId: string) => {
    navigation.navigate('StudentDetail', { studentId });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Main scrollable content sits above the fixed bottom tab bar */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" // allows tapping a row while the search keyboard is open
      >

        {/* ── HEADER ROW: title/subtitle + filter button ──────────── */}
        <View style={styles.header}>
          <View style={styles.headerTextBlock}>
            <Text style={styles.headerTitle}>Students</Text>
            <Text style={styles.headerSubtitle}>
              {totalStudents.toLocaleString()} total · {placedStudents.toLocaleString()} placed
            </Text>
          </View>

          <TouchableOpacity
            style={styles.filterBtn}
            onPress={handleFilterPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="filter-outline"
              size={18}
              color={COLORS.filterIcon}
            />
          </TouchableOpacity>
        </View>
        {/* ── END HEADER ──────────────────────────────────────────── */}


        {/* ── SEARCH BAR ───────────────────────────────────────────── */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={16}
            color={COLORS.searchIcon}
            style={{ marginRight: 10 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search students..."
            placeholderTextColor={COLORS.searchPlaceholder}
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="none"
          />
        </View>
        {/* ── END SEARCH BAR ───────────────────────────────────────── */}


        {/* ── STUDENT LIST ─────────────────────────────────────────── */}
        {/*
          .map() loops over filteredStudents (NOT the original STUDENTS
          array) so the list updates live as the user types in the search
          bar above.
        */}
        {filteredStudents.map((student) => {
          // Look up the right pill colors for this student's status.
          // Falls back to the "Seeking" style if an unrecognized status
          // ever sneaks in, so the row never crashes from a missing color.
          const statusStyle = STATUS_STYLES[student.status] ?? STATUS_STYLES.Seeking;

          return (
            <TouchableOpacity
              key={student.id}
              style={styles.studentRow}
              onPress={() => handleStudentPress(student.id)}
              activeOpacity={0.85}
            >

              {/* Left: avatar circle with initials */}
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{student.initials}</Text>
              </View>

              {/* Middle: name + detail line, fills remaining space */}
              <View style={styles.studentTextBlock}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentDetail}>{student.detail}</Text>
              </View>

              {/* Right: status pill — colors come from statusStyle above */}
              <View
                style={[
                  styles.statusPill,
                  { backgroundColor: statusStyle.bg },
                  // Only "Seeking" has a border in this design; the
                  // others rely on their background color alone
                  statusStyle.border ? { borderWidth: 1, borderColor: statusStyle.border } : null,
                ]}
              >
                <Text style={[styles.statusPillText, { color: statusStyle.text }]}>
                  {student.status}
                </Text>
              </View>

            </TouchableOpacity>
          );
        })}

        {/* Shown only when the search filters out every student */}
        {filteredStudents.length === 0 && (
          <Text style={styles.noResultsText}>
            No students match "{searchText}"
          </Text>
        )}
        {/* ── END STUDENT LIST ─────────────────────────────────────── */}

      </ScrollView>

      {/* ── FILTER MODAL ───────────────────────────────────────── */}
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={handleFilterApply}
        activeFilters={activeFilters}
      />
      
    </SafeAreaView>
  );
}


// ─── STYLES ──────────────────────────────────────────────────────
const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Scrollable content — leaves room at the bottom so the tab bar
  // doesn't cover the last items
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 100, // extra space so content isn't hidden behind tab bar
  },

  // ── Header ────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTextBlock: {
    flex: 1, // fills space to the left of the filter button
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.headerTitle,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.headerSubtitle,
  },
  filterBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.filterBtnBg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  // ── Search bar ────────────────────────────────────────────────
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.searchBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.headerTitle,
  },

  // ── Student rows ──────────────────────────────────────────────
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.rowBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12, // space between each student's row
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.avatarText,
  },
  studentTextBlock: {
    flex: 1, // fills space between avatar and status pill
  },
  studentName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.studentName,
    marginBottom: 2,
  },
  studentDetail: {
    fontSize: 12,
    color: COLORS.studentDetail,
  },

  // ── Status pill (color comes from STATUS_STYLES at render time) ───
  statusPill: {
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Shown only when search filters out every result
  noResultsText: {
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.studentDetail,
    marginTop: 20,
  },

});