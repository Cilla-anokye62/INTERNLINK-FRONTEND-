import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';
import { Notification } from '../../src/types/application';

const { height } = Dimensions.get('window');

const NOTIF_ICONS: Record<string, string> = {
  application_submitted: 'checkmark-circle-outline',
  application_viewed: 'eye-outline',
  status_changed: 'swap-horizontal-outline',
  interview_scheduled: 'calendar-outline',
  assessment_assigned: 'document-text-outline',
  offer_received: 'gift-outline',
  rejected: 'close-circle-outline',
  new_application: 'mail-outline',
  student_responded: 'chatbubble-outline',
  interview_accepted: 'thumbs-up-outline',
  offer_accepted: 'handshake-outline',
};

export default function NotificationsScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { notifications, markNotificationRead, markAllNotificationsRead, userId, userRole } = useAppStore();

  const myNotifs = notifications.filter((n) => n.userId === userId);

  const handleNotifPress = (notif: Notification) => {
    markNotificationRead(notif.id);
    if (notif.applicationId) {
      if (userRole === 'employer') {
        navigation.navigate('ApplicantProfile', { applicationId: notif.applicationId });
      } else {
        navigation.navigate('ApplicationDetails', { applicationId: notif.applicationId });
      }
    }
  };

  const formatTime = (timestamp: string) => {
    const now = Date.now();
    const diff = now - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const renderItem = useCallback(({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notifCard,
        {
          backgroundColor: item.isRead ? colors.notifReadBg : colors.notifUnreadBg,
          borderLeftColor: item.isRead ? 'transparent' : colors.accent,
        },
      ]}
      onPress={() => handleNotifPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={(NOTIF_ICONS[item.type] || 'notifications-outline') as any} size={22} color={colors.accent} />
      </View>
      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <Text style={[styles.notifTitle, { color: colors.title }]} numberOfLines={1}>{item.title}</Text>
          {!item.isRead && <View style={[styles.unreadDot, { backgroundColor: colors.notifDot }]} />}
        </View>
        <Text style={[styles.notifMessage, { color: colors.subtitle }]} numberOfLines={2}>{item.message}</Text>
        <Text style={[styles.notifTime, { color: colors.placeholder }]}>{formatTime(item.timestamp)}</Text>
      </View>
    </TouchableOpacity>
  ), [colors, handleNotifPress]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={20} color={colors.title} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.title }]}>Notifications</Text>
        <TouchableOpacity onPress={() => markAllNotificationsRead(userRole === 'employer' ? 'employer' : 'student')}>
          <Text style={[styles.markRead, { color: colors.accent }]}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={myNotifs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.iconCircle }]}>
              <Ionicons name="notifications-outline" size={32} color={colors.accent} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.title }]}>No notifications</Text>
            <Text style={[styles.emptyDesc, { color: colors.subtitle }]}>
              You're all caught up! Notifications will appear here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontSize: 18, fontWeight: 'bold' },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  markRead: { fontSize: 13, fontWeight: '600' },
  listContent: { paddingHorizontal: 20, paddingBottom: 24, gap: 8 },
  notifCard: {
    flexDirection: 'row', borderRadius: 14, padding: 14,
    borderLeftWidth: 3, marginBottom: 4,
  },
  iconContainer: {
    width: 40, height: 40, alignItems: 'center',
    justifyContent: 'center', marginRight: 12,
  },
  notifContent: { flex: 1 },
  notifHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  notifTitle: { fontSize: 14, fontWeight: '600', flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 8 },
  notifMessage: { fontSize: 13, lineHeight: 18, marginBottom: 4 },
  notifTime: { fontSize: 11 },
  emptyContainer: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
