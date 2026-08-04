import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { TAB_BAR_BOTTOM_PADDING } from '../../src/constants/Colors';
import { getAuthErrorMessage, listingApi, type ListingResponse } from '../../src/api';
import { ApplicationLimitIndicator } from '../../src/components/PremiumComponents';
import { useSubscription } from '../../src/context/SubscriptionContext';

// ---------- Types ----------
type Props = NativeStackScreenProps<any, any>;
type ListingStatus = 'Active' | 'Closed';
type FilterTab = 'All' | ListingStatus;

// ---------- Main Screen ----------
const ListingsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const {
    entitlement,
    hasFeature,
  } = useSubscription();
  const listingEntitlement = entitlement('COMPANY_ACTIVE_LISTINGS');
  const pipelineEnabled = hasFeature('COMPANY_PIPELINE_WORKFLOW');
  const listingLimitReached = Boolean(
    listingEntitlement?.limit != null
    && listingEntitlement.remaining != null
    && listingEntitlement.remaining <= 0,
  );

  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState('');
  const hasLoadedRef = useRef(false);

  const loadListings = useCallback(async () => {
    setLoadError('');
    try {
      const nextListings = await listingApi.listOwn();
      setListings(nextListings);
    } catch (error) {
      setLoadError(getAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      hasLoadedRef.current = true;
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!hasLoadedRef.current) setIsLoading(true);
      void loadListings();
    }, [loadListings]),
  );

  const filterTabs: { label: FilterTab; count: number }[] = [
    { label: 'All', count: listings.length },
    { label: 'Active', count: listings.filter((listing) => listing.status === 'OPEN').length },
    { label: 'Closed', count: listings.filter((listing) => listing.status === 'CLOSED').length },
  ];

  const filteredListings = listings.filter((listing) => {
    if (activeFilter === 'All') return true;
    return activeFilter === 'Active' ? listing.status === 'OPEN' : listing.status === 'CLOSED';
  });

  const getStatusStyle = (status: ListingStatus) => {
    switch (status) {
      case 'Active':
        return { badge: styles.badgeActive, text: styles.badgeTextActive };
      case 'Closed':
        return { badge: styles.badgeClosed, text: styles.badgeTextClosed };
    }
  };

  const renderListing = ({ item: listing }: { item: ListingResponse }) => {
    const displayStatus: ListingStatus = listing.status === 'OPEN' ? 'Active' : 'Closed';
    const statusStyle = getStatusStyle(displayStatus);
    return (
      <View style={styles.listingCard}>
        <View style={styles.listingHeader}>
          <Text style={styles.listingTitle}>{listing.title}</Text>
          <View style={[styles.statusBadge, statusStyle.badge]}>
            <Text style={[styles.statusBadgeText, statusStyle.text]}>
              {displayStatus}
            </Text>
          </View>
        </View>

        <Text style={styles.applicantsText}>{listing.location || 'Location not specified'}</Text>

        <View style={styles.listingFooter}>
          <View style={styles.listingStats}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="time-outline" size={12} color={colors.subtitle} />
              <Text style={styles.statItem}>{listing.duration || 'Duration not specified'}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="cash-outline" size={12} color={colors.subtitle} />
              <Text style={styles.statItem}>{listing.allowance || 'Allowance not specified'}</Text>
            </View>
          </View>
        </View>
        {listing.status === 'OPEN' ? (
          <TouchableOpacity
            style={styles.pipelineButton}
            onPress={() => pipelineEnabled
              ? navigation.navigate('PipelineSetup', { listing })
              : navigation.navigate('PremiumPlans', { source: 'company-pipeline' })}
          >
            <Ionicons
              name={pipelineEnabled ? 'git-branch-outline' : 'lock-closed-outline'}
              size={15}
              color={colors.accent}
            />
            <Text style={styles.pipelineButtonText}>
              {pipelineEnabled
                ? listing.multiStage ? 'Manage hiring pipeline' : 'Set up hiring pipeline'
                : 'Premium hiring pipeline'}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Listings</Text>
          <Text style={styles.headerSubtitle}>{listings.length} internships</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.8}
          onPress={() => listingLimitReached
            ? navigation.navigate('PremiumPlans', { source: 'listing-limit' })
            : navigation.navigate('PostInternshipWizard')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.limitWrap}>
        <ApplicationLimitIndicator
          entitlement={listingEntitlement}
          title="Active listings used"
          unlimitedValue="Unlimited Active Listings"
          onUpgrade={() => navigation.navigate('PremiumPlans', { source: 'listing-limit' })}
        />
      </View>

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={styles.filterRow}
      >
        {filterTabs.map((tab) => (
          <TouchableOpacity
            key={tab.label}
            style={[
              styles.filterTab,
              activeFilter === tab.label && styles.filterTabActive,
            ]}
            onPress={() => setActiveFilter(tab.label)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === tab.label && styles.filterTabTextActive,
              ]}
            >
              {tab.label} ({tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Listings */}
      <FlatList
        style={styles.container}
        data={filteredListings}
        keyExtractor={(listing) => String(listing.id)}
        renderItem={renderListing}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={() => {
          setIsRefreshing(true);
          void loadListings();
        }}
        ListEmptyComponent={(
          <View style={styles.stateContainer}>
            {isLoading ? (
              <>
                <ActivityIndicator color={colors.accent} />
                <Text style={styles.stateText}>Loading listings...</Text>
              </>
            ) : loadError ? (
              <>
                <Ionicons name="cloud-offline-outline" size={36} color={colors.subtitle} />
                <Text style={styles.stateText}>{loadError}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => void loadListings()}>
                  <Text style={styles.retryButtonText}>Try again</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Ionicons name="briefcase-outline" size={36} color={colors.subtitle} />
                <Text style={styles.stateText}>No {activeFilter.toLowerCase()} listings yet.</Text>
              </>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

// ---------- Styles ----------
const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.title,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '500',
    marginTop: 2,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: colors.onPrimary,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
  },
  filterRow: {
  paddingHorizontal: 20,
  paddingBottom: 12,
  gap: 8,
  alignItems: 'flex-start',
},
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  filterTabActive: {
  backgroundColor: colors.accent,
  borderColor: colors.accent,
  height: 34,
  justifyContent: 'center',
},
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.subtitle,
  },
  filterTabTextActive: {
    color: colors.onPrimary,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: TAB_BAR_BOTTOM_PADDING,
    gap: 12,
  },
  listingCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: 16,
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  listingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.title,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeActive: {
    backgroundColor: colors.iconCircle,
  },
  badgeTextActive: {
    color: colors.accent,
  },
  badgePaused: {
    backgroundColor: '#FEF3C7',
  },
  badgeTextPaused: {
    color: '#D97706',
  },
  badgeDraft: {
    backgroundColor: '#F3F4F6',
  },
  badgeTextDraft: {
    color: colors.subtitle,
  },
  badgeClosed: {
    backgroundColor: '#F3F4F6',
  },
  badgeTextClosed: {
    color: colors.subtitle,
  },
  applicantsText: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '500',
    marginBottom: 12,
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listingStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    fontSize: 12,
    color: colors.subtitle,
  },
  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  stateText: {
    color: colors.subtitle,
    fontSize: 13,
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
  manageLink: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '600',
  },
  limitWrap: { paddingHorizontal: 20, paddingBottom: 12 },
  pipelineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
  },
  pipelineButtonText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
});

export default ListingsScreen;
