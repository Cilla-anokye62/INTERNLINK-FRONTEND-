import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions, FlatList } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

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

  // Clears the search box and resets the category filter back to "All".
  // This is what the empty state's "Browse All" button calls — it's
  // the quickest way to get the user back to seeing every internship.
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
            placeholderTextColor="#94A3B8"
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

      {/*
        ── EMPTY STATE vs. RESULTS LIST ──────────────────────────
        This is the new piece: instead of always rendering the
        FlatList, we check filtered.length first.

        - filtered.length === 0  → user searched/filtered and got
          NOTHING back → show the "Nothing here yet" empty state
        - filtered.length > 0    → show the normal results list,
          exactly as before

        Because `filtered` is recalculated every render based on
        `search` and `activeCategory`, this empty state will appear
        and disappear automatically as the user types or changes
        category — no extra state needed to track "is it empty".
      */}
      {filtered.length === 0 ? (

        // ── EMPTY STATE ──────────────────────────────────────────
        <View style={styles.emptyState}>

          <View style={styles.illustrationCard}>
            {/*
              TODO: replace this emoji combo with an actual illustration
              image, e.g.:
              <Image source={require('../assets/empty-search-box.png')} style={styles.illustrationImage} />
            */}
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
            {/* TODO: swap for <Ionicons name="refresh" size={16} color="#FFFFFF" /> */}
            <Text style={styles.browseBtnIcon}>↻</Text>
            <Text style={styles.browseBtnText}>Browse All</Text>
          </TouchableOpacity>

        </View>

      ) : (

        // ── RESULTS LIST (unchanged from before) ──────────────────
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0FAFA',
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
    color: '#024D60',
  },
  headerSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuDots: {
    fontSize: 18,
    color: '#024D60',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
    color: '#94A3B8',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#024D60',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2CACAD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    fontSize: 20,
    color: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  categoryChipActive: {
    backgroundColor: '#2CACAD',
    borderColor: '#2CACAD',
  },
  categoryText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
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
    color: '#024D60',
    marginBottom: 2,
  },
  cardCompany: {
    fontSize: 13,
    color: '#64748B',
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
    color: '#94A3B8',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  matchBadge: {
    backgroundColor: '#EAF6F5',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  matchText: {
    fontSize: 11,
    color: '#2CACAD',
    fontWeight: '700',
  },
  tag: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 11,
    color: '#64748B',
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

  // ── Empty state ──────────────────────────────────────────────
  // Everything below here is NEW — added to support the "Nothing
  // here yet" design. Colors are matched to this file's existing
  // palette (#024D60 dark teal, #2CACAD accent teal, #64748B grey)
  // instead of the separate mint palette used elsewhere in the app,
  // so this empty state blends seamlessly into THIS screen.
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 60, // nudges content up slightly above true center
  },
  illustrationCard: {
    width: 160,
    height: 160,
    backgroundColor: '#FFFFFF',
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
    color: '#024D60',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 22,
  },
  browseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2CACAD',
    borderRadius: 30, // pill shape, matching this screen's other rounded elements
    paddingVertical: 13,
    paddingHorizontal: 26,
  },
  browseBtnIcon: {
    fontSize: 14,
    color: '#FFFFFF',
    marginRight: 8,
    fontWeight: '700',
  },
  browseBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});