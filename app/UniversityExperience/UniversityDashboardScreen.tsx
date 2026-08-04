import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import {
  getAuthErrorMessage,
  resolveMediaUrl,
  universityApi,
  type CompanyEngagementResponse,
  type PlacementStatisticsResponse,
  type UniversityProfileResponse,
} from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { TAB_BAR_BOTTOM_PADDING } from '../../src/constants/Colors';

const EMPTY_STATS: PlacementStatisticsResponse = {
  totalStudents: 0,
  notStartedCount: 0,
  searchingCount: 0,
  placedCount: 0,
  totalApplications: 0,
};

export default function UniversityDashboardScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [profile, setProfile] = useState<UniversityProfileResponse | null>(null);
  const [statistics, setStatistics] = useState(EMPTY_STATS);
  const [companies, setCompanies] = useState<CompanyEngagementResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setError('');
    try {
      const [profileResult, statisticsResult, companyResults] = await Promise.all([
        universityApi.getMe(),
        universityApi.getStatistics(),
        universityApi.listCompanies(),
      ]);
      setProfile(profileResult);
      setStatistics(statisticsResult);
      setCompanies(companyResults);
    } catch (loadError) {
      setError(getAuthErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      void loadDashboard();
    }, [loadDashboard]),
  );

  const placementRate = statistics.totalStudents > 0
    ? Math.round((statistics.placedCount / statistics.totalStudents) * 100)
    : 0;
  const topCompanies = companies
    .slice()
    .sort((a, b) => b.acceptedCount - a.acceptedCount)
    .slice(0, 3);
  const profilePhotoUri = resolveMediaUrl(profile?.logoUrl);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => void loadDashboard()}
            colors={[colors.accent]}
            tintColor={colors.accent}
          />
        }
      >
        <View style={styles.header}>
          {profilePhotoUri ? (
            <Image source={{ uri: profilePhotoUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{profile?.name.charAt(0).toUpperCase() || 'U'}</Text>
            </View>
          )}
          <View style={styles.headerText}>
            <Text style={styles.title}>{profile?.name || 'University dashboard'}</Text>
            <Text style={styles.subtitle}>{profile?.city || 'Placement monitoring'}</Text>
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('UniversityEditProfile')}>
            <Ionicons name="create-outline" size={19} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {error ? (
          <TouchableOpacity style={styles.errorCard} onPress={() => void loadDashboard()}>
            <Text style={styles.errorText}>{error} Tap to retry.</Text>
          </TouchableOpacity>
        ) : null}

        <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.placementCard}>
          <Text style={styles.cardLabel}>Placement rate</Text>
          <Text style={styles.rate}>{placementRate}%</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${placementRate}%` }]} />
          </View>
          <View style={styles.statsRow}>
            {[
              { label: 'Placed', value: statistics.placedCount },
              { label: 'Searching', value: statistics.searchingCount },
              { label: 'Not started', value: statistics.notStartedCount },
            ].map((stat) => (
              <View key={stat.label} style={styles.stat}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        <View style={styles.quickGrid}>
          {[
            { title: 'Students', value: statistics.totalStudents, icon: 'school-outline', route: 'Students' },
            { title: 'Companies', value: companies.length, icon: 'business-outline', route: 'CompanyEngagement' },
            { title: 'Applications', value: statistics.totalApplications, icon: 'documents-outline', route: 'Analytics' },
            { title: 'Reports', value: 'View', icon: 'bar-chart-outline', route: 'Reports' },
          ].map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.quickCard}
              onPress={() => navigation.navigate(item.route)}
            >
              <Ionicons name={item.icon as any} size={21} color={colors.accent} />
              <Text style={styles.quickValue}>{item.value}</Text>
              <Text style={styles.quickTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top placement partners</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CompanyEngagement')}>
            <Text style={styles.linkText}>View all</Text>
          </TouchableOpacity>
        </View>

        {loading && companies.length === 0 ? (
          <ActivityIndicator color={colors.accent} />
        ) : topCompanies.length === 0 ? (
          <Text style={styles.emptyText}>Company engagement will appear after your students apply.</Text>
        ) : topCompanies.map((company) => (
          <TouchableOpacity
            key={company.companyId}
            style={styles.companyRow}
            onPress={() => navigation.navigate('CompanyDetail', { company })}
          >
            <View style={styles.companyLogo}>
              <Text style={styles.companyLogoText}>{company.companyName.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{company.companyName}</Text>
              <Text style={styles.companyMeta}>
                {company.acceptedCount} accepted · {company.applicationCount} applications
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.subtitle} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 18, paddingTop: 15, paddingBottom: TAB_BAR_BOTTOM_PADDING },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  avatarImage: { width: 44, height: 44, borderRadius: 22, marginRight: 11, backgroundColor: colors.iconCircle },
  avatarText: { color: colors.onPrimary, fontSize: 17, fontWeight: '800' },
  headerText: { flex: 1 },
  title: { color: colors.title, fontSize: 17, fontWeight: '700' },
  subtitle: { color: colors.subtitle, fontSize: 12, marginTop: 2 },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  errorCard: { padding: 12, borderRadius: 12, backgroundColor: colors.withdrawBg, marginBottom: 12 },
  errorText: { color: colors.withdrawText, fontSize: 12 },
  placementCard: { borderRadius: 18, padding: 18, marginBottom: 18 },
  cardLabel: { color: '#D7F0EE', fontSize: 13 },
  rate: { color: '#FFFFFF', fontSize: 34, fontWeight: '800', marginTop: 3 },
  progressTrack: { height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 15 },
  progressFill: { height: 7, borderRadius: 4, backgroundColor: '#FFFFFF' },
  statsRow: { flexDirection: 'row' },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  statLabel: { color: '#D7F0EE', fontSize: 10, marginTop: 3 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 18 },
  quickCard: { width: '48%', padding: 15, borderRadius: 15, backgroundColor: colors.card, marginBottom: 10, borderWidth: 1, borderColor: colors.inputBorder },
  quickValue: { color: colors.title, fontSize: 20, fontWeight: '800', marginTop: 9 },
  quickTitle: { color: colors.subtitle, fontSize: 12, marginTop: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { color: colors.title, fontSize: 16, fontWeight: '700' },
  linkText: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  companyRow: { flexDirection: 'row', alignItems: 'center', padding: 13, borderRadius: 15, backgroundColor: colors.card, marginBottom: 10, borderWidth: 1, borderColor: colors.inputBorder },
  companyLogo: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  companyLogoText: { color: colors.onPrimary, fontWeight: '800' },
  companyInfo: { flex: 1 },
  companyName: { color: colors.title, fontSize: 14, fontWeight: '700' },
  companyMeta: { color: colors.subtitle, fontSize: 11, marginTop: 3 },
  emptyText: { color: colors.subtitle, fontSize: 13, textAlign: 'center', paddingVertical: 24 },
});
