import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import {
  getAuthErrorMessage,
  notificationApi,
  type BackendNotificationResponse,
  type BackendNotificationType,
} from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';
import { LockedFeatureOverlay } from '../../src/components/PremiumComponents';
import { useSubscription } from '../../src/context/SubscriptionContext';

const ICONS: Record<BackendNotificationType, keyof typeof Ionicons.glyphMap> = {
  APPLICATION_STATUS_CHANGED: 'swap-horizontal-outline',
  STAGE_TRANSITION: 'git-branch-outline',
  INTERVIEW_SCHEDULED: 'calendar-outline',
  NEW_APPLICATION: 'person-add-outline',
  NEW_MESSAGE: 'chatbubble-outline',
  OFFER_RECEIVED: 'gift-outline',
  OFFER_DECIDED: 'checkmark-done-outline',
  ACCOUNT_UPDATE: 'person-circle-outline',
};

const TITLES: Record<BackendNotificationType, string> = {
  APPLICATION_STATUS_CHANGED: 'Application update',
  STAGE_TRANSITION: 'Application stage updated',
  INTERVIEW_SCHEDULED: 'Interview scheduled',
  NEW_APPLICATION: 'New application',
  NEW_MESSAGE: 'New message',
  OFFER_RECEIVED: 'Offer update',
  OFFER_DECIDED: 'Offer decision',
  ACCOUNT_UPDATE: 'Account update',
};

export default function NotificationsScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const role = useAppStore((state) => state.userRole);
  const { hasFeature } = useSubscription();
  const detailedUpdatesLocked = role === 'student'
    && !hasFeature('STUDENT_APPLICATION_NOTIFICATIONS');
  const [notifications, setNotifications] = useState<BackendNotificationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotifications = useCallback(async () => {
    setError('');
    try {
      if (!role) return;
      setNotifications(await notificationApi.list(role));
    } catch (loadError) {
      setError(getAuthErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [role]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      void loadNotifications();
    }, [loadNotifications]),
  );

  const formatTime = (timestamp: string) => {
    const elapsed = Date.now() - new Date(timestamp).getTime();
    if (elapsed < 60_000) return 'Just now';
    if (elapsed < 3_600_000) return `${Math.floor(elapsed / 60_000)}m ago`;
    if (elapsed < 86_400_000) return `${Math.floor(elapsed / 3_600_000)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={21} color={colors.title} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifications.length > 0 ? (
          <TouchableOpacity onPress={() => void notificationApi.markAllRead().then(loadNotifications)}>
            <Text style={styles.markAll}>Mark all read</Text>
          </TouchableOpacity>
        ) : <View style={{ width: 40 }} />}
      </View>

        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => void loadNotifications()}
              colors={[colors.accent]}
              tintColor={colors.accent}
            />
          }
          ListHeaderComponent={detailedUpdatesLocked ? (
            <LockedFeatureOverlay
              title="Detailed progress alerts are Premium"
              message="Upgrade for routine application and stage updates. Interview invitations, offers, messages, and account alerts remain available."
              onUpgrade={() => navigation.navigate('PremiumPlans', { source: 'notifications' })}
            />
          ) : null}
          renderItem={({ item }) => {
            const isRead = item.read;
            return (
              <TouchableOpacity
                style={[styles.card, !isRead && styles.unreadCard]}
                activeOpacity={0.85}
                onPress={() => void notificationApi.markRead(item.id).then((updated) => {
                  setNotifications((current) => current.map((value) => value.id === updated.id ? updated : value));
                })}
              >
                <View style={styles.iconCircle}>
                  <Ionicons name={ICONS[item.type]} size={22} color={colors.accent} />
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.titleRow}>
                    <Text style={styles.cardTitle}>{TITLES[item.type]}</Text>
                    {!isRead ? <View style={styles.unreadDot} /> : null}
                  </View>
                  <Text style={styles.message}>{item.message}</Text>
                  <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              {loading ? (
                <ActivityIndicator color={colors.accent} />
              ) : error ? (
                <>
                  <Ionicons name="cloud-offline-outline" size={46} color={colors.subtitle} />
                  <Text style={styles.emptyTitle}>Could not load notifications</Text>
                  <Text style={styles.emptyText}>{error}</Text>
                  <TouchableOpacity style={styles.retryButton} onPress={() => void loadNotifications()}>
                    <Text style={styles.retryText}>Try again</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Ionicons name="notifications-outline" size={46} color={colors.subtitle} />
                  <Text style={styles.emptyTitle}>No notifications</Text>
                  <Text style={styles.emptyText}>
                    {detailedUpdatesLocked
                      ? 'Interview invitations, offers, messages, and account alerts will appear here.'
                      : 'Application and interview updates will appear here.'}
                  </Text>
                </>
              )}
            </View>
          }
        />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.title, fontSize: 17, fontWeight: '700' },
  markAll: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  listContent: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 30, gap: 9 },
  card: { flexDirection: 'row', padding: 14, borderRadius: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder },
  unreadCard: { borderLeftWidth: 3, borderLeftColor: colors.accent },
  iconCircle: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.iconCircle, marginRight: 11 },
  cardContent: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { flex: 1, color: colors.title, fontSize: 14, fontWeight: '700' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent, marginLeft: 7 },
  message: { color: colors.subtitle, fontSize: 13, lineHeight: 19, marginTop: 4 },
  time: { color: colors.placeholder, fontSize: 11, marginTop: 6 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingTop: 75, gap: 10 },
  emptyTitle: { color: colors.title, fontSize: 17, fontWeight: '700', textAlign: 'center' },
  emptyText: { color: colors.subtitle, fontSize: 13, textAlign: 'center', lineHeight: 19 },
  retryButton: { marginTop: 6, backgroundColor: colors.accent, borderRadius: 22, paddingHorizontal: 20, paddingVertical: 11 },
  retryText: { color: colors.onPrimary, fontSize: 13, fontWeight: '700' },
});
