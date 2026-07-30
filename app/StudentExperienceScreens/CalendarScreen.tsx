import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  applicationApi,
  getAuthErrorMessage,
  stageApi,
  type ApplicationStageProgressResponse,
  type BackendApplicationResponse,
} from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';

type InterviewEvent = {
  application: BackendApplicationResponse;
  stage: ApplicationStageProgressResponse;
};

export default function CalendarScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [events, setEvents] = useState<InterviewEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const applications = await applicationApi.listOwn();
      const stageGroups = await Promise.all(
        applications.map((application) => stageApi.listForStudent(application.id)),
      );
      const nextEvents = applications.flatMap((application, index) => (
        stageGroups[index]
          .filter((stage) => stage.stageType === 'INTERVIEW' && Boolean(stage.interviewLink))
          .map((stage) => ({ application, stage }))
      ));
      nextEvents.sort((left, right) => (
        new Date(left.stage.interviewLinkExpiresAt ?? 0).getTime()
        - new Date(right.stage.interviewLinkExpiresAt ?? 0).getTime()
      ));
      setEvents(nextEvents);
    } catch (loadError) {
      setError(getAuthErrorMessage(loadError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const openInterview = async (url: string | null) => {
    if (url && await Linking.canOpenURL(url)) await Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.title} />
        </TouchableOpacity>
        <Text style={styles.title}>Interviews</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={(
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void load(true)}
              tintColor={colors.accent}
            />
          )}
        >
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {events.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="calendar-outline" size={42} color={colors.subtitle} />
              <Text style={styles.emptyTitle}>No interview links yet</Text>
              <Text style={styles.emptyText}>
                Interview links created by employers will appear here and in the application details.
              </Text>
            </View>
          ) : (
            events.map(({ application, stage }) => {
              const expiresAt = stage.interviewLinkExpiresAt
                ? new Date(stage.interviewLinkExpiresAt)
                : null;
              const expired = expiresAt ? expiresAt.getTime() < Date.now() : false;
              return (
                <View key={stage.id} style={styles.card}>
                  <View style={styles.icon}>
                    <Ionicons name="videocam-outline" size={23} color={colors.accent} />
                  </View>
                  <View style={styles.flex}>
                    <Text style={styles.cardTitle}>{stage.stageName}</Text>
                    <Text style={styles.company}>{application.companyName}</Text>
                    <Text style={styles.meta}>{application.listingTitle}</Text>
                    <Text style={[styles.expiry, expired && styles.expired]}>
                      {expiresAt
                        ? `${expired ? 'Expired' : 'Link expires'} ${expiresAt.toLocaleString()}`
                        : 'No expiry supplied'}
                    </Text>
                    {!expired ? (
                      <TouchableOpacity
                        style={styles.joinButton}
                        onPress={() => void openInterview(stage.interviewLink)}
                      >
                        <Text style={styles.joinText}>Open interview link</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 8 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    marginRight: 12,
  },
  title: { color: colors.title, fontSize: 22, fontWeight: '800' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20, paddingTop: 12, paddingBottom: 40, flexGrow: 1 },
  card: {
    flexDirection: 'row',
    gap: 13,
    backgroundColor: colors.card,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: 16,
    marginBottom: 10,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.iconCircle,
  },
  flex: { flex: 1 },
  cardTitle: { color: colors.title, fontSize: 15, fontWeight: '800' },
  company: { color: colors.accent, fontSize: 13, fontWeight: '700', marginTop: 3 },
  meta: { color: colors.subtitle, fontSize: 12, marginTop: 3 },
  expiry: { color: colors.text, fontSize: 11, marginTop: 9 },
  expired: { color: colors.danger },
  joinButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginTop: 11,
  },
  joinText: { color: colors.onPrimary, fontSize: 12, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 70 },
  emptyTitle: { color: colors.title, fontSize: 17, fontWeight: '800', marginTop: 12 },
  emptyText: { color: colors.subtitle, fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 7 },
  error: { color: colors.danger, marginBottom: 12 },
});
