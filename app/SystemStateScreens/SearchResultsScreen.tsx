/**
 * SearchResultsScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Search Results (student-facing search/discovery screen)
 *
 * Content (from design):
 *  - Header: back arrow + "Search" title + "42 results for 'React'"
 *    subtitle + "Filters · 3" link on the right
 *  - Search bar pre-filled with "React"
 *  - Row of active filter chips (Remote ✕, Summer ✕, $40+ ✕, Engineering)
 *    — the first 3 are removable (have an ✕), "Engineering" looks like
 *    a suggestion chip without an ✕ in this design
 *  - "Sorted by: Best match" + "Change" link
 *  - List of internship cards, each with: colored avatar, role title,
 *    company name, location · term line, match % pill, hourly rate pill,
 *    and a bookmark icon top-right
 *
 * HOW TO USE:
 *  1. Drop inside your screens/ or app/ folder
 *  2. Add to App.tsx:
 *     import SearchResultsScreen from './app/SearchResultsScreen';
 *     <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from "../../src/hooks/useAppTheme";


// ─── DATA ─────────────────────────────────────────────────────────

// Active filter chips currently applied to the search.
// "removable: true" chips show an ✕ and can be cleared by the user.
// "Engineering" has removable: false since it appears as a suggestion
// chip (outlined, no ✕) rather than an applied filter in the design.
const ACTIVE_FILTERS = [
  { id: 'remote', label: 'Remote', removable: true },
  { id: 'summer', label: 'Summer', removable: true },
  { id: 'salary', label: '$40+', removable: true },
  { id: 'engineering', label: 'Engineering', removable: false },
];

// The internship search results. In the real app these would come
// from your backend's search/matching API.
// avatarColor gives each card's circle a distinct, recognizable color
// per company, similar to the logo circles on the university screens.
const SEARCH_RESULTS = [
  {
    id: 'stripe',
    avatarLetter: 'S',
    avatarColor: '#5B5FE9', // Stripe purple-blue
    roleTitle: 'Frontend Eng Intern · React',
    company: 'Stripe',
    location: 'Remote · Summer \'26',
    matchPercent: '96% match',
    rate: '$45/hr',
  },
  {
    id: 'linear',
    avatarLetter: 'L',
    avatarColor: '#5E72E4', // Linear blue-purple
    roleTitle: 'Software Intern (React/TS)',
    company: 'Linear',
    location: "Remote · Summer '26",
    matchPercent: '92% match',
    rate: '$45/hr',
  },
  {
    id: 'vercel',
    avatarLetter: 'V',
    avatarColor: '#0D0D0D', // Vercel black
    roleTitle: 'DX Intern · Next.js',
    company: 'Vercel',
    location: "Remote · Summer '26",
    matchPercent: '88% match',
    rate: '$45/hr',
  },
  {
    id: 'notion',
    avatarLetter: 'N',
    avatarColor: '#0D0D0D', // Notion black
    roleTitle: 'Web Eng Intern · React',
    company: 'Notion',
    location: "Remote · Summer '26",
    matchPercent: '84% match',
    rate: '$45/hr',
  },
];


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function SearchResultsScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);


  // What's typed in the search bar — starts pre-filled with "React"
  // to match the design
  const [searchText, setSearchText] = useState('React');

  // Tracks which filter chips are currently active. Starts with the
  // same 3 removable filters shown in the design already applied.
  const [activeFilters, setActiveFilters] = useState(
    ACTIVE_FILTERS.filter((f) => f.removable).map((f) => f.id)
  );

  // Tracks which internship cards the student has bookmarked.
  // Stored as an array of ids; toggling adds/removes from this array.
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Removes one filter chip when its ✕ is tapped
  const removeFilter = (filterId: string) => {
    setActiveFilters((prev) => prev.filter((id) => id !== filterId));
  };

  // Toggles bookmark state for a given internship card
  const toggleBookmark = (resultId: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(resultId)
        ? prev.filter((id) => id !== resultId) // already bookmarked → remove it
        : [...prev, resultId]                  // not bookmarked → add it
    );
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleFiltersPress = () => {
    console.log('Filters tapped');
    // TODO: navigation.navigate('FilterModal') or open a bottom sheet
  };

  const handleChangeSortPress = () => {
    console.log('Change sort tapped');
    // TODO: open a sort-options modal/sheet
  };

  const handleCardPress = (resultId: string) => {
    console.log('Opening internship:', resultId);
    // TODO: navigation.navigate('InternshipDetail', { id: resultId });
  };

  // Only the chips whose id is still in activeFilters get shown as
  // removable; "Engineering" (removable: false) always shows since
  // it's a suggestion chip, not an applied filter.
  const visibleFilterChips = ACTIVE_FILTERS.filter(
    (filter) => !filter.removable || activeFilters.includes(filter.id)
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── HEADER ROW: back arrow + title/subtitle + Filters link ── */}
        <View style={styles.header}>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrowText}>‹</Text>
          </TouchableOpacity>

          <View style={styles.headerTextBlock}>
            <Text style={styles.headerTitle}>Search</Text>
            <Text style={styles.headerSubtitle}>
              42 results for '{searchText}'
            </Text>
          </View>

          <TouchableOpacity onPress={handleFiltersPress}>
            <Text style={styles.filtersLink}>Filters · 3</Text>
          </TouchableOpacity>

        </View>
        {/* ── END HEADER ──────────────────────────────────────────── */}


        {/* ── SEARCH BAR ───────────────────────────────────────────── */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={16} color={colors.searchIcon} style={{ marginRight: 10 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search internships..."
            placeholderTextColor={colors.searchIcon}
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="none"
          />
        </View>
        {/* ── END SEARCH BAR ──────────────────────────────────────── */}


        {/* ── FILTER CHIPS ROW ─────────────────────────────────────── */}
        {/*
          flexWrap lets chips flow onto a new line automatically if
          there isn't enough horizontal space for all of them.
        */}
        <View style={styles.filterChipsRow}>
          {visibleFilterChips.map((filter) => (
            <View
              key={filter.id}
              style={[
                styles.filterChip,
                // Removable (applied) filters are solid teal;
                // the suggestion chip ("Engineering") is outlined white
                filter.removable ? styles.filterChipActive : styles.filterChipSuggestion,
              ]}
            >
              <Text style={[
                styles.filterChipText,
                filter.removable ? styles.filterChipTextActive : styles.filterChipTextSuggestion,
              ]}>
                {filter.label}
              </Text>

              {/* Only removable filters show the ✕ — tapping it clears that filter */}
              {filter.removable && (
                <TouchableOpacity
                  onPress={() => removeFilter(filter.id)}
                  style={styles.filterChipXBtn}
                >
                  <Text style={styles.filterChipXText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
        {/* ── END FILTER CHIPS ROW ────────────────────────────────── */}


        {/* ── SORTED BY ROW ────────────────────────────────────────── */}
        <View style={styles.sortRow}>
          <Text style={styles.sortedByText}>Sorted by: Best match</Text>
          <TouchableOpacity onPress={handleChangeSortPress}>
            <Text style={styles.changeLink}>Change</Text>
          </TouchableOpacity>
        </View>
        {/* ── END SORTED BY ROW ───────────────────────────────────── */}


        {/* ── SEARCH RESULT CARDS ──────────────────────────────────── */}
        {/*
          .map() loops over SEARCH_RESULTS and renders one card per
          internship: avatar | title/company/location | match% + rate pills
          A bookmark icon sits in the top-right corner of each card.
        */}
        {SEARCH_RESULTS.map((result) => {
          const isBookmarked = bookmarkedIds.includes(result.id);

          return (
            <TouchableOpacity
              key={result.id}
              style={styles.resultCard}
              onPress={() => handleCardPress(result.id)}
              activeOpacity={0.85}
            >

              {/* Top row: avatar + title/company + bookmark icon */}
              <View style={styles.resultTopRow}>

                {/* Avatar circle — background color unique per company */}
                <View style={[
                  styles.avatar,
                  { backgroundColor: result.avatarColor },
                ]}>
                  <Text style={styles.avatarText}>{result.avatarLetter}</Text>
                </View>

                {/* Title + company, fills remaining space */}
                <View style={styles.resultTextBlock}>
                  <Text style={styles.roleTitle}>{result.roleTitle}</Text>
                  <Text style={styles.companyName}>{result.company}</Text>
                </View>

                {/* Bookmark toggle — filled icon when bookmarked, outline when not */}
                <TouchableOpacity
                  onPress={() => toggleBookmark(result.id)}
                  style={styles.bookmarkBtn}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                    size={16}
                    color={isBookmarked ? colors.accent : colors.subtitle}
                  />
                </TouchableOpacity>

              </View>

              {/* Location · term line */}
              <Text style={styles.locationText}>
                <Ionicons name="location-outline" size={12} color={colors.locationText} style={{ marginRight: 4 }} />
                {result.location}
              </Text>

              {/* Bottom row: match % pill + hourly rate pill */}
              <View style={styles.pillsRow}>
                <View style={styles.matchPill}>
                  <Text style={styles.matchPillText}>{result.matchPercent}</Text>
                </View>
                <View style={styles.ratePill}>
                  <Text style={styles.ratePillText}>{result.rate}</Text>
                </View>
              </View>

            </TouchableOpacity>
          );
        })}
        {/* ── END SEARCH RESULT CARDS ─────────────────────────────── */}

      </ScrollView>
    </SafeAreaView>
  );
}


// ─── STYLES ──────────────────────────────────────────────────────
const createStyles = (colors: any) => StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // ── Header ────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.backBtnBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  backArrowText: {
    fontSize: 22,
    color: colors.backArrow,
    lineHeight: 26,
    marginRight: 2,
  },
  headerTextBlock: {
    flex: 1, // fills space between back button and Filters link
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.headerTitle,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.headerSubtitle,
    marginTop: 2,
  },
  filtersLink: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.filtersLink,
    marginTop: 9, // aligns roughly with the "Search" title's baseline
  },

  // ── Search bar ────────────────────────────────────────────────
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.searchBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 10,
    color: colors.searchIcon,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.searchText,
  },

  // ── Filter chips row ──────────────────────────────────────────
  filterChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', // chips flow onto a new line if they don't all fit
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  // Applied/removable filters — solid teal background
  filterChipActive: {
    backgroundColor: colors.filterChipBg,
  },
  // Suggestion chip (Engineering) — outlined, white background
  filterChipSuggestion: {
    backgroundColor: colors.suggestionChipBg,
    borderWidth: 1.5,
    borderColor: colors.suggestionChipBorder,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: colors.filterChipText,
  },
  filterChipTextSuggestion: {
    color: colors.suggestionChipText,
  },
  filterChipXBtn: {
    marginLeft: 6,
  },
  filterChipXText: {
    fontSize: 11,
    color: colors.filterChipX,
    fontWeight: '700',
  },

  // ── Sorted by row ──────────────────────────────────────────────
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sortedByText: {
    fontSize: 12,
    color: colors.sortedByText,
  },
  changeLink: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.changeLink,
  },

  // ── Search result cards ──────────────────────────────────────
  resultCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12, // space between each result card
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  resultTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resultTextBlock: {
    flex: 1, // fills space between avatar and bookmark icon
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.roleTitle,
    marginBottom: 2,
  },
  companyName: {
    fontSize: 12,
    color: colors.companyName,
  },
  bookmarkBtn: {
    padding: 4, // larger tap target than the icon's visual size
  },
  bookmarkIconText: {
    fontSize: 16,
  },
  locationText: {
    fontSize: 12,
    color: colors.locationText,
    marginBottom: 10,
    marginLeft: 54, // aligns with the text block above (avatar width + margin)
  },

  // ── Match % and rate pills ────────────────────────────────────
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 54, // same alignment as the location line above
  },
  matchPill: {
    backgroundColor: colors.matchPillBg,
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  matchPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.matchPillText,
  },
  ratePill: {
    backgroundColor: colors.ratePillBg,
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  ratePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.ratePillText,
  },

});