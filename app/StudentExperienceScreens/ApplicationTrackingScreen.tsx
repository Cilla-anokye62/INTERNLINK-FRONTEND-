import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const FILTERS = ['All', 'Review', 'Interview', 'Offer', 'Rejected'];

const STAGES = ['APPLIED', 'REVIEW', 'INTERVIEW', 'OFFER'];

const APPLICATIONS = [
  {
    id: '1',
    title: 'Software Eng Intern',
    company: 'Airbnb',
    duration: '12 weeks',
    color: '#EF4444',
    statusLabel: 'Offer',
    statusColor: '#10B981',
    statusBg: '#D1FAE5',
    currentStage: 3, // index into STAGES, inclusive progress
    showStages: true,
  },
  {
    id: '2',
    title: 'Software Intern',
    company: 'Meta',
    color: '#3B82F6',
    statusLabel: 'Interview',
    statusColor: '#D97706',
    statusBg: '#FEF3C7',
    progress: 0.66,
    showStages: false,
  },
  {
    id: '3',
    title: 'Frontend Intern',
    company: 'Stripe',
    color: '#7C3AED',
    statusLabel: 'In review',
    statusColor: '#2CACAD',
    statusBg: '#D4F0EE',
    progress: 0.4,
    showStages: false,
  },
  {
    id: '4',
    title: 'Data Intern',
    company: 'Notion',
    color: '#0F172A',
    statusLabel: 'Applied',
    statusColor: '#64748B',
    statusBg: '#F1F5F9',
    progress: 0.15,
    showStages: false,
  },
];

export default function ApplicationTrackingScreen({ navigation }: any) {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Applications</Text>
          <Text style={styles.headerSub}>8 active · 2 offers</Text>
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

      {/* Applications list */}
      <FlatList
        data={APPLICATIONS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.85}>
            {/* Top row */}
            <View style={styles.cardTopRow}>
              <View style={[styles.avatar, { backgroundColor: item.color }]}>
                <Text style={styles.avatarText}>{item.company[0]}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardCompany}>
                  {item.company}{item.duration ? ` · ${item.duration}` : ''}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: item.statusBg }]}>
                <Text style={[styles.statusText, { color: item.statusColor }]}>
                  {item.statusLabel}
                </Text>
              </View>
            </View>

            {/* Progress section */}
            {item.showStages ? (
              <View style={styles.stagesRow}>
                {STAGES.map((stage, index) => {
                  const isActive = index <= (item.currentStage ?? 0);
                  return (
                    <View key={stage} style={styles.stageItem}>
                      <Text style={[styles.stageLabel, isActive && styles.stageLabelActive]}>
                        {stage}
                      </Text>
                      <View style={styles.stageDotsRow}>
                        <View style={[styles.stageDot, isActive && styles.stageDotActive]} />
                        {index < STAGES.length - 1 && (
                          <View style={[styles.stageLine, isActive && styles.stageLineActive]} />
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.simpleProgressBg}>
                <View style={[styles.simpleProgressFill, { width: `${(item.progress ?? 0) * 100}%` }]} />
              </View>
            )}
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
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
    fontSize: 12,
    color: '#64748B',
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Detailed stages (Airbnb-style)
  stagesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stageItem: {
    flex: 1,
    alignItems: 'center',
  },
  stageLabel: {
    fontSize: 9,
    color: '#CBD5E1',
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  stageLabelActive: {
    color: '#2CACAD',
  },
  stageDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  stageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  stageDotActive: {
    backgroundColor: '#2CACAD',
  },
  stageLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
  },
  stageLineActive: {
    backgroundColor: '#2CACAD',
  },

  // Simple progress bar (other cards)
  simpleProgressBg: {
    width: '100%',
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
  },
  simpleProgressFill: {
    height: 5,
    backgroundColor: '#2CACAD',
    borderRadius: 3,
  },
});