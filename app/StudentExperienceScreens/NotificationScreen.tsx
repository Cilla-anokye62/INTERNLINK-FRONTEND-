import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../src/hooks/useAppTheme';

const TODAY_NOTIFICATIONS = [
  {
    id: '1',
    icon: '📅',
    iconBg: '#D4F0EE',
    title: 'Interview scheduled',
    subtitle: 'Meta · Mar 24 at 2:00 PM',
    dotColor: '#10B981',
  },
  {
    id: '2',
    icon: '👁️',
    iconBg: '#D4F0EE',
    title: 'Application viewed',
    subtitle: 'Stripe viewed your application',
    dotColor: '#10B981',
  },
];

const WEEK_NOTIFICATIONS = [
  {
    id: '3',
    icon: '✦',
    iconBg: '#EDE9FE',
    title: 'New match',
    subtitle: 'OpenAI ML Research — 92% match',
    dotColor: '#10B981',
  },
  {
    id: '4',
    icon: '✉️',
    iconBg: '#D4F0EE',
    title: 'Message from recruiter',
    subtitle: 'Sarah Chen · Airbnb',
    dotColor: '#F59E0B',
  },
  {
    id: '5',
    icon: '↗',
    iconBg: '#D4F0EE',
    title: 'Profile boost',
    subtitle: 'Your profile got 24 views this week',
    dotColor: '#10B981',
  },
];

export default function NotificationsScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSub}>3 unread</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.markAllText}>Mark all</Text>
          </TouchableOpacity>
        </View>

        {/* TODAY section */}
        <Text style={styles.sectionLabel}>TODAY</Text>
        <View style={styles.section}>
          {TODAY_NOTIFICATIONS.map(item => (
            <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.7}>
              <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
                <Text style={styles.iconText}>{item.icon}</Text>
              </View>
              <View style={styles.cardInfo}>
                <View style={styles.titleRow}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <View style={[styles.dot, { backgroundColor: item.dotColor }]} />
                </View>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* THIS WEEK section */}
        <Text style={styles.sectionLabel}>THIS WEEK</Text>
        <View style={styles.section}>
          {WEEK_NOTIFICATIONS.map(item => (
            <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.7}>
              <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
                <Text style={styles.iconText}>{item.icon}</Text>
              </View>
              <View style={styles.cardInfo}>
                <View style={styles.titleRow}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <View style={[styles.dot, { backgroundColor: item.dotColor }]} />
                </View>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </View>
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
    paddingBottom: 24,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
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
  markAllText: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '600',
  },

  // Sections
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.placeholder,
    letterSpacing: 1,
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
    gap: 10,
  },

  // Card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 16,
  },
  cardInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.cardTitle,
    marginRight: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.subtitle,
  },
});