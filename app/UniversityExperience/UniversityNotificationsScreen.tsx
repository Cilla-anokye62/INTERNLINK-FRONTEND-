/**
 * UniversityNotificationsScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — University Notifications (reached from the bell icon
 * on the University Dashboard)
 *
 * Content:
 *  - Back arrow + "Notifications" title + "Mark all read" button
 *  - List of notification rows, each with: icon circle, title,
 *    description, timestamp, and unread dot indicator
 *  - Notifications grouped by time: "Today", "This week", "Earlier"
 *  - Empty state if no notifications
 *
 * HOW TO USE:
 *  Registered in App.tsx's Stack Navigator:
 *     <Stack.Screen name="UniversityNotifications" component={UniversityNotificationsScreen} />
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


// ─── COLOR PALETTE ───────────────────────────────────────────────
const COLORS = {
  background:        '#F5FBFA',
  backBtnBg:         '#FFFFFF',
  backArrow:         '#0D3B47',
  headerTitle:       '#0D3B47',
  markAllReadText:   '#2EC4B6',

  // Section labels ("Today", "This week")
  sectionLabel:      '#4A7C75',

  // Notification rows
  rowBg:             '#FFFFFF',
  rowBorder:         '#F0F6F5',
  unreadDot:         '#2EC4B6',
  iconBg:            '#E8F8F5',
  iconColor:         '#2EC4B6',
  notifTitle:        '#0D3B47',
  notifDescription:  '#9BB8B4',
  notifTime:         '#9BB8B4',

  // Icon variant colors
  placementIconBg:   '#D6F2E3',
  placementIcon:     '#1E8E5A',
  applicationIconBg: '#D6EEF2',
  applicationIcon:   '#1B7E94',
  companyIconBg:     '#FBE6C8',
  companyIcon:       '#B5750F',
  alertIconBg:       '#FCE4E4',
  alertIcon:         '#E0524C',
};


// ─── DATA ─────────────────────────────────────────────────────────
const NOTIFICATIONS = [
  {
    id: '1',
    group: 'Today',
    iconBg: COLORS.placementIconBg,
    iconColor: COLORS.placementIcon,
    icon: 'checkmark-circle-outline',
    title: 'Student placed at Google',
    description: 'Liam Nguyen accepted the SWE Intern offer from Google.',
    time: '2h ago',
    unread: true,
  },
  {
    id: '2',
    group: 'Today',
    iconBg: COLORS.applicationIconBg,
    iconColor: COLORS.applicationIcon,
    icon: 'paper-plane-outline',
    title: 'New application received',
    description: 'Priya Patel applied to Stripe for the Backend Engineering Intern role.',
    time: '4h ago',
    unread: true,
  },
  {
    id: '3',
    group: 'This week',
    iconBg: COLORS.companyIconBg,
    iconColor: COLORS.companyIcon,
    icon: 'business-outline',
    title: 'New partner engaged',
    description: 'Nvidia joined as a hiring partner with 6 open intern roles.',
    time: '2d ago',
    unread: false,
  },
  {
    id: '4',
    group: 'This week',
    iconBg: COLORS.placementIconBg,
    iconColor: COLORS.placementIcon,
    icon: 'checkmark-circle-outline',
    title: 'Student placed at Meta',
    description: 'Alex Morgan accepted the Frontend Intern offer from Meta.',
    time: '3d ago',
    unread: false,
  },
  {
    id: '5',
    group: 'This week',
    iconBg: COLORS.applicationIconBg,
    iconColor: COLORS.applicationIcon,
    icon: 'chatbubble-outline',
    title: 'Interview scheduled',
    description: 'Priya Patel has a final round interview with Stripe tomorrow.',
    time: '4d ago',
    unread: false,
  },
  {
    id: '6',
    group: 'Earlier',
    iconBg: COLORS.alertIconBg,
    iconColor: COLORS.alertIcon,
    icon: 'alert-circle-outline',
    title: 'Report ready',
    description: 'Spring 2026 placement summary report has been generated.',
    time: '1w ago',
    unread: false,
  },
  {
    id: '7',
    group: 'Earlier',
    iconBg: COLORS.companyIconBg,
    iconColor: COLORS.companyIcon,
    icon: 'trending-up-outline',
    title: 'Placement rate increased',
    description: 'Your placement rate increased by 4% compared to last year.',
    time: '2w ago',
    unread: false,
  },
];


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function UniversityNotificationsScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleMarkAllRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, unread: false }))
    );
  };

  const handleNotifPress = (notifId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notifId ? { ...n, unread: false } : n)
    );
  };

  // Group notifications by their "group" field
  const groups = notifications.reduce<Record<string, typeof notifications>>((acc, notif) => {
    if (!acc[notif.group]) acc[notif.group] = [];
    acc[notif.group].push(notif);
    return acc;
  }, {});

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER ─────────────────────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back-outline" size={22} color={COLORS.backArrow} />
          </TouchableOpacity>

          <View style={styles.headerTextBlock}>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <Text style={styles.unreadCount}>{unreadCount} unread</Text>
            )}
          </View>

          {unreadCount > 0 && (
            <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.7}>
              <Text style={styles.markAllReadText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── NOTIFICATION GROUPS ────────────────────────────────── */}
        {Object.entries(groups).map(([group, items]) => (
          <View key={group} style={styles.group}>
            <Text style={styles.sectionLabel}>{group}</Text>

            {items.map((notif) => (
              <TouchableOpacity
                key={notif.id}
                style={[
                  styles.notifRow,
                  notif.unread && styles.notifRowUnread,
                ]}
                onPress={() => handleNotifPress(notif.id)}
                activeOpacity={0.85}
              >
                {/* Icon circle */}
                <View style={[styles.iconCircle, { backgroundColor: notif.iconBg }]}>
                  <Ionicons
                    name={notif.icon as any}
                    size={18}
                    color={notif.iconColor}
                  />
                </View>

                {/* Text content */}
                <View style={styles.notifTextBlock}>
                  <View style={styles.notifTitleRow}>
                    <Text style={[
                      styles.notifTitle,
                      notif.unread && styles.notifTitleUnread,
                    ]}>
                      {notif.title}
                    </Text>
                    {notif.unread && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notifDescription}>{notif.description}</Text>
                  <Text style={styles.notifTime}>{notif.time}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}


// ─── STYLES ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.backBtnBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTextBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.headerTitle,
  },
  unreadCount: {
    fontSize: 12,
    color: COLORS.sectionLabel,
    marginTop: 2,
  },
  markAllReadText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.markAllReadText,
  },

  // Groups
  group: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.sectionLabel,
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 4,
  },

  // Notification rows
  notifRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.rowBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  notifRowUnread: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.unreadDot,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notifTextBlock: {
    flex: 1,
  },
  notifTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.notifTitle,
    flex: 1,
  },
  notifTitleUnread: {
    fontWeight: '700',
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.unreadDot,
    marginLeft: 6,
  },
  notifDescription: {
    fontSize: 13,
    color: COLORS.notifDescription,
    lineHeight: 18,
    marginBottom: 4,
  },
  notifTime: {
    fontSize: 11,
    color: COLORS.notifTime,
  },
});
