import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';
import { getAuthErrorMessage, listingApi, listingToInternshipData, type ListingResponse } from '../../src/api';

const CATEGORIES = ['All', 'Engineering', 'Design', 'Data', 'Marketing', 'Finance'];

export default function DiscoverScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { savedInternships, toggleSavedInternship } = useAppStore();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [internships, setInternships] = useState<ListingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const loadInternships = useCallback(async () => {
    setLoadError('');
    try {
      setInternships(await listingApi.listOpen());
    } catch (error) {
      setLoadError(getAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      void loadInternships();
    }, [loadInternships]),
  );

  const toggleSave = useCallback((id: string) => {
    toggleSavedInternship(id);
  }, [toggleSavedInternship]);

  const filtered = internships.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.companyName.toLowerCase().includes(search.toLowerCase()) ||
      item.requiredSkills.some((skill) => skill.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      activeCategory === 'All' ||
      item.industry?.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const renderItem = useCallback(({ item }: { item: ListingResponse }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('InternshipDetails', { internship: listingToInternshipData(item) })}
    >
      {/* Left: company avatar */}
      <View style={styles.companyAvatar}>
        <Text style={styles.companyAvatarText}>{item.companyName.charAt(0).toUpperCase()}</Text>
      </View>

      {/* Middle: info */}
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardCompany}>{item.companyName}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={11} color={colors.placeholder} style={{ marginRight: 4 }} />
          <Text style={styles.cardLocation}>
            {item.location || 'Location not specified'}{item.remote ? ' · Remote' : ''}
          </Text>
        </View>
        <View style={styles.tagsRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.allowance || 'Allowance not specified'}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.duration || 'Duration not specified'}</Text>
          </View>
        </View>
      </View>

      {/* Right: save button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => toggleSave(String(item.id))}
        activeOpacity={0.7}
      >
        <Ionicons
          name={savedInternships.includes(String(item.id)) ? 'bookmark' : 'bookmark-outline'}
          size={18}
          color={savedInternships.includes(String(item.id)) ? colors.accent : colors.placeholder}
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
          <Text style={styles.headerSub}>{internships.length} open internships</Text>
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
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => void loadInternships()}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {isLoading ? (
              <ActivityIndicator color={colors.accent} />
            ) : loadError ? (
              <>
                <Ionicons name="cloud-offline-outline" size={40} color={colors.placeholder} />
                <Text style={styles.emptyText}>{loadError}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => void loadInternships()}>
                  <Text style={styles.retryButtonText}>Try again</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Ionicons name="search-outline" size={40} color={colors.placeholder} />
                <Text style={styles.emptyText}>No internships match your search</Text>
              </>
            )}
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
    backgroundColor: colors.accent,
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
  retryButton: {
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: colors.onPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
});
