import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, TextInput } from 'react-native';
import { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { TAB_BAR_BOTTOM_PADDING } from '../../src/constants/Colors';

const FILTERS = ['All (14)', 'Engineering (8)', 'Design (4)', 'Closing soon'];

const SAVED_INTERNSHIPS = [
  { id: '1', title: 'Frontend Intern', company: 'Stripe', daysLeft: 4, location: 'Remote', color: '#7C3AED', match: 96, pay: 'GHS 45/hr', duration: '12 weeks', workMode: 'remote' },
  { id: '2', title: 'Product Design Intern', company: 'Figma', daysLeft: 7, location: 'Remote', color: '#EF4444', match: 91, pay: 'GHS 42/hr', duration: '12 weeks', workMode: 'remote' },
  { id: '3', title: 'DevTools Intern', company: 'Vercel', daysLeft: 12, location: 'Remote', color: '#0F172A', match: 87, pay: 'GHS 50/hr', duration: '12 weeks', workMode: 'remote' },
  { id: '4', title: 'Data Intern', company: 'Notion', daysLeft: 18, location: 'Remote', color: '#0F172A', match: 83, pay: 'GHS 45/hr', duration: '10 weeks', workMode: 'remote' },
];

export default function SavedScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const [activeFilter, setActiveFilter] = useState('All (14)');
  const [savedItems, setSavedItems] = useState<string[]>(['1', '2', '3', '4']);
  const [search, setSearch] = useState('');

  const toggleSave = useCallback((id: string) => {
    setSavedItems(prev => prev.filter(i => i !== id));
  }, []);

  const filtered = SAVED_INTERNSHIPS.filter(item => {
    const matchesSaved = savedItems.includes(item.id);
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.company.toLowerCase().includes(search.toLowerCase());
    return matchesSaved && matchesSearch;
  });

  const renderItem = useCallback(({ item }: { item: typeof SAVED_INTERNSHIPS[0] }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => navigation.navigate('InternshipDetails', { internship: item })}>
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: item.color }]}>
        <Text style={styles.avatarText}>{item.company[0]}</Text>
      </View>

      {/* Info */}
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardCompany}>{item.company}</Text>
        <View style={styles.tagsRow}>
          <View style={styles.daysTag}>
            <Ionicons name="time-outline" size={10} color="#92400E" style={{marginRight: 2}} />
            <Text style={styles.daysText}>{item.daysLeft}d left</Text>
          </View>
          <View style={styles.locationTag}>
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
        </View>
      </View>

      {/* Save toggle */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => toggleSave(item.id)}
        activeOpacity={0.7}
      >
        <Ionicons name="bookmark" size={18} color={colors.accent} />
      </TouchableOpacity>
    </TouchableOpacity>
  ), [navigation, colors, toggleSave]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Saved</Text>
          <Text style={styles.headerSub}>{filtered.length} internships</Text>
        </View>
      </View>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={16} color={colors.searchIcon} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search saved..."
            placeholderTextColor={colors.placeholder}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersRow}
      >
        {FILTERS.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
            onPress={() => setActiveFilter(filter)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Saved list */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
      />
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

  // Search
  searchRow: {
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  searchBar: {
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
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },

  // Filters
  filtersScroll: {
    flexGrow: 0,
    marginBottom: 16,
  },
  filtersRow: {
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    minHeight: 48,
    flexShrink: 0,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  filterText: {
    fontSize: 14,
    color: colors.subtitle,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // List
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: TAB_BAR_BOTTOM_PADDING,
    gap: 12,
  },

  // Card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
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
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  daysTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  daysText: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '600',
  },
  locationTag: {
    backgroundColor: colors.ratePillBg,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  locationText: {
    fontSize: 11,
    color: colors.ratePillText,
    fontWeight: '500',
  },

  // Save button
  saveButton: {
    marginLeft: 8,
    padding: 4,
  },
});