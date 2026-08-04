import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Image, View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';
import { TAB_BAR_BOTTOM_PADDING } from '../../src/constants/Colors';
import { useFocusEffect } from '@react-navigation/native';
import {
  listingApi,
  listingToInternshipData,
  resolveMediaUrl,
  studentApi,
  type ListingResponse,
  type RecommendationResponse,
} from '../../src/api';

const { width } = Dimensions.get('window');

type RecommendationCard = {
  recommendation: RecommendationResponse;
  listing: ListingResponse;
};

const QUICK_ACTIONS = [
  { id: '1', icon: 'chatbubbles-outline', title: 'Messages',       subtitle: 'Chat with employers',    screen: 'StudentMessages' },
  { id: '2', icon: 'help-circle-outline',  title: 'Help & Support', subtitle: 'Get assistance',        screen: 'HelpSupport' },
  { id: '3', icon: 'calendar-outline',     title: 'Calendar',       subtitle: 'Interviews & deadlines', screen: 'Calendar' },
  { id: '4', icon: 'people-outline',       title: 'Refer a Friend', subtitle: 'Invite peers',          screen: 'ReferFriend' },
];

export default function HomeDashboardScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const userName = useAppStore((state) => state.userName);
  const profilePhotoUri = useAppStore((state) => state.profile.photoUri);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const username = userName;
  const [recommendations, setRecommendations] = useState<RecommendationCard[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const profileLoadedRef = useRef(false);

  const syncStudentProfile = useCallback(async () => {
    if (profileLoadedRef.current) return;
    try {
      const profile = await studentApi.getMe();
      updateProfile({ photoUri: resolveMediaUrl(profile.profileImageUrl) });
    } catch {
      // The cached profile remains usable if the dashboard refresh cannot reach the API.
    } finally {
      profileLoadedRef.current = true;
    }
  }, [updateProfile]);

  const loadRecommendations = useCallback(async () => {
    try {
      const matches = await studentApi.recommendations();
      const cards = await Promise.all(matches.slice(0, 10).map(async (recommendation) => {
        try {
          return {
            recommendation,
            listing: await listingApi.getOpen(recommendation.internshipId),
          };
        } catch {
          return null;
        }
      }));
      setRecommendations(cards.filter((card): card is RecommendationCard => card !== null));
    } catch {
      setRecommendations([]);
    } finally {
      setLoadingRecommendations(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void syncStudentProfile();
      setLoadingRecommendations(true);
      void loadRecommendations();
    }, [loadRecommendations, syncStudentProfile]),
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          {profilePhotoUri ? (
            <Image source={{ uri: profilePhotoUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{username ? username.charAt(0).toUpperCase() : 'U'}</Text>
            </View>
          )}
          <View style={styles.greetingBlock}>
            <View style={styles.greetingRow}>
              <Text style={styles.greeting}>Hi{username ? `, ${username}` : ''}</Text>
            </View>
            <Text style={styles.greetingSub}>Let's find your perfect role</Text>
          </View>

          <TouchableOpacity style={styles.bellButton} activeOpacity={0.7}
            onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* AI Match banner — intentionally dark-teal regardless of theme for visual pop */}
        <View style={styles.aiBanner}>
          <View style={styles.aiBannerContent}>
            <View style={styles.aiMatchBadge}>
              <Ionicons name="sparkles" size={12} color="#2CACAD" style={styles.aiMatchBadgeIcon} />
              <Text style={styles.aiMatchBadgeText}>AI Match</Text>
            </View>
            <Text style={styles.aiBannerTitle}>
              {recommendations.length} internship{recommendations.length === 1 ? '' : 's'}{'\n'}match your profile
            </Text>
            <TouchableOpacity
              style={styles.viewMatchesBtn}
              onPress={() => navigation.navigate('Discover')}
            >
              <Text style={styles.viewMatchesBtnText}>View matches</Text>
              <Ionicons name="arrow-forward" size={14} color="#024D60" style={styles.viewMatchesBtnIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.bannerCircle1} />
          <View style={styles.bannerCircle2} />
        </View>

        {/* Recommended for you */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for you</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SearchResults')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScrollWrapper}
          contentContainerStyle={styles.horizontalScroll}
        >
          {loadingRecommendations ? (
            <View style={styles.recommendLoading}>
              <ActivityIndicator color={colors.accent} />
            </View>
          ) : recommendations.length === 0 ? (
            <View style={styles.recommendEmpty}>
              <Text style={styles.recommendEmptyText}>
                Complete your skills and career interests to receive recommendations.
              </Text>
            </View>
          ) : recommendations.slice(0, 5).map(({ recommendation, listing }) => (
            <TouchableOpacity
              key={recommendation.internshipId}
              style={styles.recommendCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('InternshipDetails', {
                internship: listingToInternshipData(listing, recommendation.matchScore),
              })}
            >
              <View style={[styles.companyAvatar, { backgroundColor: colors.accent }]}>
                <Text style={styles.companyAvatarText}>{recommendation.companyName[0]}</Text>
              </View>
              <View style={styles.matchBadge}>
                <Text style={styles.matchBadgeText}>{Math.round(recommendation.matchScore)}% match</Text>
              </View>
              <Text style={styles.recommendTitle}>{recommendation.title}</Text>
              <Text style={styles.recommendCompany}>
                {recommendation.companyName} · {listing.remote ? 'Remote' : listing.location || 'Location not set'}
              </Text>
              <View style={styles.recommendFooter}>
                <Text style={styles.recommendPay}>{listing.allowance || 'Allowance not set'}</Text>
                <Text style={styles.recommendDot}> · </Text>
                <Text style={styles.recommendDuration}>{listing.duration || 'Duration not set'}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.quickActionsGrid}>
          {QUICK_ACTIONS.map((item) => (
            <TouchableOpacity key={item.id} style={[styles.quickActionCard, { backgroundColor: colors.card }]}
              activeOpacity={0.7} onPress={() => navigation.navigate(item.screen)}>
              <Ionicons name={item.icon as any} size={24} color={colors.accent} style={styles.quickActionIcon} />
              <Text style={[styles.quickActionTitle, { color: colors.title }]}>{item.title}</Text>
              <Text style={[styles.quickActionSubtitle, { color: colors.subtitle }]}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: TAB_BAR_BOTTOM_PADDING,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: colors.onPrimary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  avatarImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
    backgroundColor: colors.iconCircle,
  },
  greetingBlock: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waveIcon: {
    marginLeft: 6,
  },
  greeting: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.title,
  },
  greetingSub: {
    fontSize: 12,
    color: colors.subtitle,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // AI banner stays dark-teal for visual impact in both modes
  aiBanner: {
    backgroundColor: '#024D60',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  aiBannerContent: {
    zIndex: 1,
  },
  aiMatchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(44,172,173,0.3)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  aiMatchBadgeIcon: {
    marginRight: 4,
  },
  aiMatchBadgeText: {
    color: '#2CACAD',
    fontSize: 12,
    fontWeight: '600',
  },
  aiBannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 30,
  },
  viewMatchesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  viewMatchesBtnIcon: {
    marginLeft: 6,
  },
  viewMatchesBtnText: {
    color: '#024D60',
    fontWeight: '700',
    fontSize: 13,
  },
  bannerCircle1: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(44,172,173,0.2)',
    top: -30,
    right: -30,
  },
  bannerCircle2: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(44,172,173,0.15)',
    bottom: -20,
    right: 60,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingRight: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 14,
  },
  seeAll: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '600',
  },
  horizontalScrollWrapper: {
    marginHorizontal: -24,
  },
  horizontalScroll: {
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 24,
  },
  recommendLoading: {
    width: width * 0.55,
    minHeight: 170,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendEmpty: {
    width: width - 48,
    minHeight: 100,
    borderRadius: 16,
    padding: 18,
    backgroundColor: colors.card,
    justifyContent: 'center',
  },
  recommendEmptyText: {
    color: colors.subtitle,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  recommendCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    width: width * 0.55,
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  companyAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  companyAvatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  matchBadge: {
    backgroundColor: colors.matchPillBg,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  matchBadgeText: {
    fontSize: 11,
    color: colors.matchPillText,
    fontWeight: '700',
  },
  recommendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.cardTitle,
    marginBottom: 4,
  },
  recommendCompany: {
    fontSize: 12,
    color: colors.subtitle,
    marginBottom: 12,
  },
  recommendFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendPay: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  recommendDot: {
    color: colors.placeholder,
    fontSize: 12,
  },
  recommendDuration: {
    fontSize: 12,
    color: colors.placeholder,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quickActionCard: {
    width: '48%',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  quickActionIcon: {
    marginBottom: 10,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 12,
  },
});
