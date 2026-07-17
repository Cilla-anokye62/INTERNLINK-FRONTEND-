import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';
import { LinearGradient } from 'expo-linear-gradient';

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
    currentStage: 3,
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
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const isPremium = useAppStore((state) => state.isPremium);

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

      {/* Applications list */}
      {isPremium ? (
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
      ) : (
        /* Free user tracking gate */
        <View style={styles.gateContainer}>
          <View style={styles.gateContent}>
            <Ionicons name="bar-chart-outline" size={40} color={colors.placeholder} />
            <Text style={styles.gateTitle}>Application Tracking</Text>
            <Text style={styles.gateDesc}>
              Track every application from submission to offer. Know exactly where you stand at every stage.
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('PremiumPaywall')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[colors.premiumGradientStart, colors.premiumGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gateCtaBtn}
              >
                <Text style={styles.gateCtaText}>Unlock with Premium</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
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
    paddingBottom: 24,
    gap: 12,
  },

  // Card
  card: {
    backgroundColor: colors.card,
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
    color: colors.cardTitle,
    marginBottom: 2,
  },
  cardCompany: {
    fontSize: 12,
    color: colors.subtitle,
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

  // Detailed stages
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
    color: colors.placeholder,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  stageLabelActive: {
    color: colors.accent,
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
    backgroundColor: colors.inputBorder,
  },
  stageDotActive: {
    backgroundColor: colors.accent,
  },
  stageLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.inputBorder,
  },
  stageLineActive: {
    backgroundColor: colors.accent,
  },

  // Simple progress bar
  simpleProgressBg: {
    width: '100%',
    height: 5,
    backgroundColor: colors.inputBorder,
    borderRadius: 3,
  },
  simpleProgressFill: {
    height: 5,
    backgroundColor: colors.accent,
    borderRadius: 3,
  },

  // Premium gate styles
  gateContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gateContent: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  gateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  gateTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.title,
    marginBottom: 8,
    textAlign: 'center',
  },
  gateDesc: {
    fontSize: 14,
    color: colors.subtitle,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  gateCtaBtn: {
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  gateCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});