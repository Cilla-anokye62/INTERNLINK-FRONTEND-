import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';
import { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';

const CATEGORIES = ['All', 'Engineering', 'Design', 'Data', 'Marketing', 'Finance'];

const INTERNSHIPS = [
  { id: '1', title: 'Software Engineering Intern', company: 'Airbnb', location: 'San Francisco, CA · Hybrid', match: 94, pay: 'GHS 48/hr', duration: "Summer '26", color: '#EF4444' },
  { id: '2', title: 'Product Design Intern', company: 'Spotify', location: 'New York, NY · On-site', match: 89, pay: 'GHS 42/hr', duration: "Summer '26", color: '#10B981' },
  { id: '3', title: 'ML Research Intern', company: 'OpenAI', location: 'Remote', match: 86, pay: 'GHS 60/hr', duration: "Summer '26", color: '#6B7280' },
  { id: '4', title: 'Frontend Intern', company: 'Linear', location: 'Remote', match: 84, pay: 'GHS 50/hr', duration: "Summer '26", color: '#7C3AED' },
  { id: '5', title: 'Data Analyst Intern', company: 'MTN', location: 'Accra · Hybrid', match: 81, pay: 'GHS 45/hr', duration: "Summer '26", color: '#F59E0B' },
  { id: '6', title: 'UX Research Intern', company: 'Google', location: 'Remote', match: 79, pay: 'GHS 55/hr', duration: "Summer '26", color: '#2CACAD' },
];

export default function DiscoverScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { savedInternships, toggleSavedInternship } = useAppStore();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const toggleSave = useCallback((id: string) => {
    toggleSavedInternship(id);
  }, [toggleSavedInternship]);

  const filtered = INTERNSHIPS.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.company.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === 'All' ||
      item.title.toLowerCase().includes(activeCategory.toLowerCase()) ||
      item.company.toLowerCase().includes(activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const renderItem = useCallback(({ item }: { item: typeof INTERNSHIPS[0] }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('InternshipDetails', { internship: item })}
    >
      {/* Left: company avatar */}
      <View style={[styles.companyAvatar, { backgroundColor: item.color }]}>
        <Text style={styles.companyAvatarText}>{item.company[0]}</Text>
      </View>

      {/* Middle: info */}
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardCompany}>{item.company}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={11} color={colors.placeholder} style={{ marginRight: 4 }} />
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
        <Ionicons
          name={savedInternships.includes(item.id) ? 'bookmark' : 'bookmark-outline'}
          size={18}
          color={savedInternships.includes(item.id) ? colors.accent : colors.placeholder}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  ), [navigation, colors, savedInternships, toggleSave, styles]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Discover</Text>
          <Text style={styles.headerSub}>248 open internships</Text>
        </View>
      </View>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={16} color={colors.searchIcon} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="React, design, remote..."
            placeholderTextColor={colors.placeholder}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesRow}
      >
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
            onPress={() => setActiveCategory(cat)}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}
              numberOfLines={1}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Internship list */}
      <FlatList
        style={styles.list}
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={40} color={colors.placeholder} />
            <Text style={styles.emptyText}>No internships match your search</Text>
          </View>
        }
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

  // Categories
  categoriesScroll: {
    flexGrow: 0,
    marginBottom: 14,
  },
  categoriesRow: {
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    flexShrink: 0,
  },
  categoryChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  categoryText: {
    fontSize: 13,
    color: colors.subtitle,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // List
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
    flexGrow: 1,
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

  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: colors.subtitle,
    textAlign: 'center',
  },
});