import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const FILTERS = ['All (14)', 'Engineering (8)', 'Design (4)', 'Closing soon'];

const SAVED_INTERNSHIPS = [
  { id: '1', title: 'Frontend Intern',     company: 'Stripe',  daysLeft: 4,  location: 'Remote', color: '#7C3AED' },
  { id: '2', title: 'Product Design Intern',company: 'Figma',  daysLeft: 7,  location: 'Remote', color: '#EF4444' },
  { id: '3', title: 'DevTools Intern',      company: 'Vercel', daysLeft: 12, location: 'Remote', color: '#0F172A' },
  { id: '4', title: 'Data Intern',          company: 'Notion', daysLeft: 18, location: 'Remote', color: '#0F172A' },
];

export default function SavedScreen({ navigation }: any) {
  const [activeFilter, setActiveFilter] = useState('All (14)');
  const [savedItems, setSavedItems] = useState<string[]>(['1', '2', '3', '4']);

  const toggleSave = (id: string) => {
    setSavedItems(prev => prev.filter(i => i !== id));
  };

  const filtered = SAVED_INTERNSHIPS.filter(item => savedItems.includes(item.id));

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Saved</Text>
          <Text style={styles.headerSub}>{filtered.length} internships</Text>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuDots}>···</Text>
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
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
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.85}>
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
                  <Text style={styles.daysIcon}>⏱ </Text>
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
              <Text style={styles.saveIcon}>🔖</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
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

  // Filters
  filtersRow: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  filterChipActive: {
    backgroundColor: '#2CACAD',
    borderColor: '#2CACAD',
  },
  filterText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  filterTextActive: {
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
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
    color: '#024D60',
    marginBottom: 2,
  },
  cardCompany: {
    fontSize: 13,
    color: '#64748B',
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
  daysIcon: {
    fontSize: 10,
  },
  daysText: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '600',
  },
  locationTag: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  locationText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },

  // Save button
  saveButton: {
    marginLeft: 8,
    padding: 4,
  },
  saveIcon: {
    fontSize: 18,
    color: '#2CACAD',
  },
});