import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// ---------- Types ----------
type Props = NativeStackScreenProps<any, any>;
type ListingStatus = 'Active' | 'Paused' | 'Draft' | 'Closed';
type FilterTab = 'All' | 'Active' | 'Paused' | 'Drafts' | 'Closed';

interface Listing {
  id: string;
  title: string;
  applicants: number;
  views: string;
  growth: string;
  status: ListingStatus;
}

// ---------- Main Screen ----------
const ListingsScreen: React.FC<Props> = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');

  const listings: Listing[] = [
    {
      id: '1',
      title: 'Frontend Engineering Intern',
      applicants: 124,
      views: '1.2K views',
      growth: '+12% wk',
      status: 'Active',
    },
    {
      id: '2',
      title: 'Product Design Intern',
      applicants: 86,
      views: '1.2K views',
      growth: '+12% wk',
      status: 'Active',
    },
    {
      id: '3',
      title: 'Data Science Intern',
      applicants: 52,
      views: '1.2K views',
      growth: '+12% wk',
      status: 'Paused',
    },
    {
      id: '4',
      title: 'Marketing Intern',
      applicants: 0,
      views: '1.2K views',
      growth: '+12% wk',
      status: 'Draft',
    },
    {
      id: '5',
      title: 'Backend Intern',
      applicants: 198,
      views: '1.2K views',
      growth: '+12% wk',
      status: 'Closed',
    },
  ];

  const filterTabs: { label: FilterTab; count: number }[] = [
    { label: 'All', count: 6 },
    { label: 'Active', count: 3 },
    { label: 'Paused', count: 1 },
    { label: 'Drafts', count: 1 },
    { label: 'Closed', count: 1 },
  ];

  const filteredListings = listings.filter((listing) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Drafts') return listing.status === 'Draft';
    return listing.status === activeFilter;
  });

  const getStatusStyle = (status: ListingStatus) => {
    switch (status) {
      case 'Active':
        return { badge: styles.badgeActive, text: styles.badgeTextActive };
      case 'Paused':
        return { badge: styles.badgePaused, text: styles.badgeTextPaused };
      case 'Draft':
        return { badge: styles.badgeDraft, text: styles.badgeTextDraft };
      case 'Closed':
        return { badge: styles.badgeClosed, text: styles.badgeTextClosed };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Listings</Text>
          <Text style={styles.headerSubtitle}>6 internships</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.8}
          onPress={() => console.log('Add new listing')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
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
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredListings.map((listing) => {
          const statusStyle = getStatusStyle(listing.status);
          return (
            <View key={listing.id} style={styles.listingCard}>
              <View style={styles.listingHeader}>
                <Text style={styles.listingTitle}>{listing.title}</Text>
                <View style={[styles.statusBadge, statusStyle.badge]}>
                  <Text style={[styles.statusBadgeText, statusStyle.text]}>
                    {listing.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.applicantsText}>
                {listing.applicants} applicants
              </Text>

              <View style={styles.listingFooter}>
                <View style={styles.listingStats}>
                  <Text style={styles.statItem}>👁 {listing.views}</Text>
                  <Text style={styles.statItem}>📈 {listing.growth}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => console.log('Manage:', listing.title)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.manageLink}>Manage {'>'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------- Styles ----------
const TEAL = '#2BA9A0';
const TEAL_DARK = '#1E8A82';
const TEAL_LIGHT = '#E6F5F4';
const TEXT_DARK = '#1A1A1A';
const TEXT_GRAY = '#6B7280';
const BORDER_COLOR = '#E5E7EB';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2FBFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#F2FBFA',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  headerSubtitle: {
    fontSize: 13,
    color: TEAL,
    fontWeight: '500',
    marginTop: 2,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  filterTabActive: {
  backgroundColor: TEAL,
  borderColor: TEAL,
  height: 34,
  justifyContent: 'center',
},
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_GRAY,
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },
  listingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
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
    color: TEXT_DARK,
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
    backgroundColor: TEAL_LIGHT,
  },
  badgeTextActive: {
    color: TEAL_DARK,
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
    color: TEXT_GRAY,
  },
  badgeClosed: {
    backgroundColor: '#F3F4F6',
  },
  badgeTextClosed: {
    color: TEXT_GRAY,
  },
  applicantsText: {
    fontSize: 13,
    color: TEAL,
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
    color: TEXT_GRAY,
  },
  manageLink: {
    fontSize: 13,
    color: TEAL,
    fontWeight: '600',
  },
});

export default ListingsScreen;