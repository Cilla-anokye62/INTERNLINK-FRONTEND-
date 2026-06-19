import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const RECOMMENDED = [
  { id: '1', title: 'Frontend Intern',    company: 'Stripe',  location: 'Remote',  pay: 'GHS 45/hr', duration: '12 weeks', match: 96, color: '#7C3AED' },
  { id: '2', title: 'Product Designer',   company: 'Figma',   location: 'Remote',  pay: 'GHS 45/hr', duration: '12 weeks', match: 91, color: '#F59E0B' },
  { id: '3', title: 'Data Analyst Intern',company: 'MTN',     location: 'Accra',   pay: 'GHS 50/hr', duration: '8 weeks',  match: 88, color: '#10B981' },
];

const ACTIVITY = [
  { id: '1', icon: '👁️', title: 'Application viewed', subtitle: 'Google · UX Research Intern', time: '2h',  dot: '#2CACAD' },
  { id: '2', icon: '📅', title: 'Interview scheduled', subtitle: 'Meta · Software Intern · Mar 24', time: '1d', dot: '#F59E0B' },
  { id: '3', icon: '💬', title: 'New message',          subtitle: 'Sarah from Airbnb HR',          time: '3d', dot: '#10B981' },
];

export default function HomeDashboardScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AM</Text>
          </View>
          <View style={styles.greetingBlock}>
            <Text style={styles.greeting}>Hi, Alex 👋</Text>
            <Text style={styles.greetingSub}>Let's find your perfect role</Text>
          </View>

          {/* Bell button — navigates to Notifications */}
          <TouchableOpacity
            style={styles.bellButton}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
          >
            <Text style={styles.bellIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search internships, companies..."
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* AI Match banner */}
        <View style={styles.aiBanner}>
          <View style={styles.aiBannerContent}>
            <View style={styles.aiMatchBadge}>
              <Text style={styles.aiMatchBadgeText}>✦ AI Match</Text>
            </View>
            <Text style={styles.aiBannerTitle}>12 new internships{'\n'}match your profile</Text>
            <TouchableOpacity style={styles.viewMatchesBtn}>
              <Text style={styles.viewMatchesBtnText}>View matches →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bannerCircle1} />
          <View style={styles.bannerCircle2} />
        </View>

        {/* Recommended for you */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for you</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {RECOMMENDED.map(item => (
            <TouchableOpacity key={item.id} style={styles.recommendCard} activeOpacity={0.85}>
              <View style={[styles.companyAvatar, { backgroundColor: item.color }]}>
                <Text style={styles.companyAvatarText}>{item.company[0]}</Text>
              </View>
              <View style={styles.matchBadge}>
                <Text style={styles.matchBadgeText}>{item.match}% match</Text>
              </View>
              <Text style={styles.recommendTitle}>{item.title}</Text>
              <Text style={styles.recommendCompany}>{item.company} · {item.location}</Text>
              <View style={styles.recommendFooter}>
                <Text style={styles.recommendPay}>{item.pay}</Text>
                <Text style={styles.recommendDot}> · </Text>
                <Text style={styles.recommendDuration}>{item.duration}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recent activity */}
        <Text style={styles.sectionTitle}>Recent activity</Text>
        <View style={styles.activityCard}>
          {ACTIVITY.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.activityItem,
                index < ACTIVITY.length - 1 && styles.activityItemBorder,
              ]}
            >
              <View style={styles.activityIconCircle}>
                <Text style={styles.activityIcon}>{item.icon}</Text>
              </View>
              <View style={styles.activityText}>
                <View style={styles.activityTitleRow}>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <View style={[styles.activityDot, { backgroundColor: item.dot }]} />
                </View>
                <Text style={styles.activitySubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.activityTime}>{item.time}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0FAFA',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2CACAD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  greetingBlock: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#024D60',
  },
  greetingSub: {
    fontSize: 12,
    color: '#64748B',
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIcon: {
    fontSize: 18,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    marginBottom: 20,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
    color: '#94A3B8',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#024D60',
  },
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
    backgroundColor: 'rgba(44,172,173,0.3)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
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
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#024D60',
    marginBottom: 14,
  },
  seeAll: {
    fontSize: 13,
    color: '#2CACAD',
    fontWeight: '600',
  },
  horizontalScroll: {
    paddingRight: 24,
    marginBottom: 24,
  },
  recommendCard: {
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#EAF6F5',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  matchBadgeText: {
    fontSize: 11,
    color: '#2CACAD',
    fontWeight: '700',
  },
  recommendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#024D60',
    marginBottom: 4,
  },
  recommendCompany: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  recommendFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendPay: {
    fontSize: 12,
    color: '#024D60',
    fontWeight: '600',
  },
  recommendDot: {
    color: '#94A3B8',
    fontSize: 12,
  },
  recommendDuration: {
    fontSize: 12,
    color: '#94A3B8',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  activityItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activityIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EAF6F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityIcon: {
    fontSize: 18,
  },
  activityText: {
    flex: 1,
  },
  activityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#024D60',
    marginRight: 6,
  },
  activityDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  activitySubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  activityTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
});