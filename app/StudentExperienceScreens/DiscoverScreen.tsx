import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions, FlatList } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../src/hooks/useAppTheme';

const { width } = Dimensions.get('window');

const CATEGORIES = ['All', 'Engineering', 'Design', 'Data', 'Marketing', 'Finance'];

const INTERNSHIPS = [
  { id: '1', title: 'Software Engineering Intern', company: 'Airbnb', location: 'San Francisco, CA · Hybrid', match: 94, pay: 'GHS 48/hr', duration: "Summer '26", color: '#EF4444', saved: true },
  { id: '2', title: 'Product Design Intern', company: 'Spotify', location: 'New York, NY · On-site', match: 89, pay: 'GHS 42/hr', duration: "Summer '26", color: '#10B981', saved: false },
  { id: '3', title: 'ML Research Intern', company: 'OpenAI', location: 'Remote', match: 86, pay: 'GHS 60/hr', duration: "Summer '26", color: '#6B7280', saved: false },
  { id: '4', title: 'Frontend Intern', company: 'Linear', location: 'Remote', match: 84, pay: 'GHS 50/hr', duration: "Summer '26", color: '#7C3AED', saved: false },
  { id: '5', title: 'Data Analyst Intern', company: 'MTN', location: 'Accra · Hybrid', match: 81, pay: 'GHS 45/hr', duration: "Summer '26", color: '#F59E0B', saved: false },
  { id: '6', title: 'UX Research Intern', company: 'Google', location: 'Remote', match: 79, pay: 'GHS 55/hr', duration: "Summer '26", color: '#2CACAD', saved: false },
];

export default function DiscoverScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [savedItems, setSavedItems] = useState<string[]>(['1']);

  const toggleSave = (id: string) => {
    setSavedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filtered = INTERNSHIPS.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.company.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const handleBrowseAll = () => {
    setSearch('');
    setActiveCategory('All');
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Discover</Text>
          <Text style={styles.headerSub}>248 open internships</Text>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuDots}>···</Text>
        </TouchableOpacity>
      </View>

      {/* Search + Filter row */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="React, design, remote..."
            placeholderTextColor={colors.placeholder}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesRow}
      >
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
            onPress={() => setActiveCategory(cat)}
            activeOpacity={0.7}
          >
            <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filtered.length === 0 ? (

        // ── EMPTY STATE ──────────────────────────────────────────
        <View style={styles.emptyState}>
          <View style={styles.illustrationCard}>
            <Text style={styles.illustrationEmoji}>📦🔍</Text>
          </View>
          <Text style={styles.emptyHeadline}>Nothing here yet</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your filters or search terms to find what you're looking for.
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={handleBrowseAll}
            activeOpacity={0.85}
          >
            <Text style={styles.browseBtnIcon}>↻</Text>
            <Text style={styles.browseBtnText}>Browse All</Text>
          </TouchableOpacity>
        </View>

      ) : (

        // ── RESULTS LIST ──────────────────────────────────────
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => navigation.navigate('InternshipDetails', { internship: item })}>
              {/* Left: company avatar */}
              <View style={[styles.companyAvatar, { backgroundColor: item.color }]}>
                <Text style={styles.companyAvatarText}>{item.company[0]}</Text>
              </View>

              {/* Middle: info */}
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardCompany}>{item.company}</Text>
                <View style={styles.locationRow}>
                  <Text style={styles.locationIcon}>📍</Text>
                  <Text style={styles.cardLocation}>{item.location}</Text>
                </View>
                <View style={styles.tagsRow}>
                  <View style={styles.matchBadge}>
                    <Text style={styles.matchText}>{item.match}% match</Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{item.pay}</Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{item.duration}</Text>
                  </View>
                </View>
              </View>

              {/* Right: save button */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => toggleSave(item.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.saveIcon, savedItems.includes(item.id) && styles.saveIconActive]}>
                  {savedItems.includes(item.id) ? '🔖' : '🔖'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />

      )}
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.title,
  },
  headerSub: {
    fontSize: 13,
    color: colors.subtitle,
    marginTop: 2,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuDots: {
    fontSize: 18,
    color: colors.menuBtnIcon,
    fontWeight: 'bold',
    letterSpacing: 2,
  },

  // Search
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 14,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
    color: colors.searchIcon,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    fontSize: 20,
    color: colors.onPrimary,
  },

  // Categories
  categoriesRow: {
    paddingHorizontal: 24,
    paddingBottom: 14,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  categoryChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  categoryText: {
    fontSize: 13,
    color: colors.subtitle,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: colors.onPrimary,
    fontWeight: '700',
  },

  // List
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },

  // Card
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  companyAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  companyAvatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.cardTitle,
    marginBottom: 2,
  },
  cardCompany: {
    fontSize: 13,
    color: colors.subtitle,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  cardLocation: {
    fontSize: 12,
    color: colors.placeholder,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  matchBadge: {
    backgroundColor: colors.matchPillBg,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  matchText: {
    fontSize: 11,
    color: colors.matchPillText,
    fontWeight: '700',
  },
  tag: {
    backgroundColor: colors.ratePillBg,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 11,
    color: colors.ratePillText,
    fontWeight: '500',
  },

  // Save
  saveButton: {
    marginLeft: 8,
    padding: 4,
  },
  saveIcon: {
    fontSize: 18,
    opacity: 0.3,
  },
  saveIconActive: {
    opacity: 1,
  },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  illustrationCard: {
    width: 160,
    height: 160,
    backgroundColor: colors.card,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  illustrationEmoji: {
    fontSize: 44,
  },
  emptyHeadline: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.title,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.subtitle,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 22,
  },
  browseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: 30,
    paddingVertical: 13,
    paddingHorizontal: 26,
  },
  browseBtnIcon: {
    fontSize: 14,
    color: colors.onPrimary,
    marginRight: 8,
    fontWeight: '700',
  },
  browseBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onPrimary,
  },
});