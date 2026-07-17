import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';

export default function CalendarScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { applications } = useAppStore();

  const events = useMemo(() => {
    const items: { id: string; title: string; company: string; date: string; time: string; type: string; color: string }[] = [];
    applications.forEach((app) => {
      if (app.interview && app.interview.status === 'scheduled') {
        items.push({
          id: app.id + '-interview',
          title: 'Interview',
          company: app.internship.company,
          date: app.interview.date,
          time: app.interview.time,
          type: 'interview',
          color: '#8B5CF6',
        });
      }
      if (app.offer && app.offer.status === 'pending') {
        items.push({
          id: app.id + '-offer',
          title: 'Offer Received',
          company: app.internship.company,
          date: app.offer.expirationDate,
          time: 'Expires',
          type: 'offer',
          color: '#10B981',
        });
      }
    });
    return items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [applications]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={[styles.backArrow, { color: colors.title }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.title }]}>Calendar</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {events.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={40} color={colors.placeholder} />
            <Text style={[styles.emptyTitle, { color: colors.title }]}>No upcoming events</Text>
            <Text style={[styles.emptySubtitle, { color: colors.subtitle }]}>Interviews and deadlines will appear here</Text>
          </View>
        ) : (
          events.map((event) => (
            <View key={event.id} style={[styles.eventCard, { backgroundColor: colors.card, borderColor: colors.inputBorder }]}>
              <View style={[styles.eventIndicator, { backgroundColor: event.color }]} />
              <View style={styles.eventContent}>
                <Text style={[styles.eventTitle, { color: colors.title }]}>{event.title}</Text>
                <Text style={[styles.eventCompany, { color: colors.accent }]}>{event.company}</Text>
                <View style={styles.eventDetails}>
                  <Text style={[styles.eventDate, { color: colors.subtitle }]}>{event.date}</Text>
                  <Text style={[styles.eventTime, { color: colors.subtitle }]}>{event.time}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 18, fontWeight: 'bold' },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  emptyContainer: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, textAlign: 'center' },
  eventCard: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 12, overflow: 'hidden' },
  eventIndicator: { width: 4, borderRadius: 2, marginRight: 14 },
  eventContent: { flex: 1 },
  eventTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  eventCompany: { fontSize: 13, fontWeight: '500', marginBottom: 8 },
  eventDetails: { flexDirection: 'row', gap: 16 },
  eventDate: { fontSize: 12 },
  eventTime: { fontSize: 12 },
});
