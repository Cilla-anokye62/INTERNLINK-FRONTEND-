import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getAuthErrorMessage, messagingApi, type ConversationResponse } from '../api';
import { useAppTheme } from '../hooks/useAppTheme';

export default function BackendConversationList({
  navigation,
  role,
}: {
  navigation: any;
  role: 'student' | 'employer';
}) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [items, setItems] = useState<ConversationResponse[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      setItems(await messagingApi.list());
    } catch (loadError) {
      setError(getAuthErrorMessage(loadError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const filtered = items.filter((item) => {
    const participant = role === 'student' ? item.companyName : item.studentName;
    const needle = query.trim().toLowerCase();
    return !needle || participant.toLowerCase().includes(needle)
      || item.listingTitle.toLowerCase().includes(needle)
      || (item.lastMessage?.body.toLowerCase().includes(needle) ?? false);
  });

  const open = async (item: ConversationResponse) => {
    await messagingApi.markRead(item.id).catch(() => undefined);
    const participantName = role === 'student' ? item.companyName : item.studentName;
    navigation.navigate(role === 'student' ? 'StudentChatScreen' : 'ChatScreen', {
      conversationId: item.id,
      participantName,
      participantInitials: initials(participantName),
      participantColor: colors.accent,
      internshipTitle: item.listingTitle,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Text style={styles.title}>Messages</Text>
      <View style={styles.search}>
        <Ionicons name="search-outline" size={18} color={colors.placeholder} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search conversations"
          placeholderTextColor={colors.placeholder}
          style={styles.input}
        />
      </View>
      {error ? (
        <TouchableOpacity style={styles.errorCard} onPress={() => void load()}>
          <Text style={styles.error}>{error} Tap to retry.</Text>
        </TouchableOpacity>
      ) : null}
      {loading ? (
        <View style={styles.center}><ActivityIndicator color={colors.accent} /></View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} />}
          contentContainerStyle={filtered.length ? styles.list : styles.emptyList}
          renderItem={({ item }) => {
            const participant = role === 'student' ? item.companyName : item.studentName;
            return (
              <TouchableOpacity style={styles.card} onPress={() => void open(item)}>
                <View style={styles.avatar}><Text style={styles.avatarText}>{initials(participant)}</Text></View>
                <View style={styles.flex}>
                  <View style={styles.row}>
                    <Text style={styles.name} numberOfLines={1}>{participant}</Text>
                    <Text style={styles.time}>{formatTime(item.updatedAt)}</Text>
                  </View>
                  <Text style={styles.listing} numberOfLines={1}>{item.listingTitle}</Text>
                  <View style={styles.row}>
                    <Text style={styles.preview} numberOfLines={1}>
                      {item.lastMessage?.body ?? 'Start the conversation'}
                    </Text>
                    {item.unreadCount > 0 ? (
                      <View style={styles.badge}><Text style={styles.badgeText}>{item.unreadCount}</Text></View>
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="chatbubbles-outline" size={44} color={colors.placeholder} />
              <Text style={styles.emptyTitle}>No conversations yet</Text>
              <Text style={styles.emptyText}>
                {role === 'student'
                  ? 'Open one of your applications to message the employer.'
                  : 'Open an applicant profile to begin a conversation.'}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const initials = (name: string) => name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
const formatTime = (value: string) => new Date(value).toLocaleDateString([], { month: 'short', day: 'numeric' });

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.title, fontSize: 22, fontWeight: '800', paddingHorizontal: 20, paddingTop: 12 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: 20, marginBottom: 8, paddingHorizontal: 14, height: 48, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder },
  input: { flex: 1, color: colors.text, fontSize: 14 },
  list: { padding: 20, paddingTop: 8, paddingBottom: 100 },
  emptyList: { flexGrow: 1 },
  card: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: 16, backgroundColor: colors.card, marginBottom: 9, borderWidth: 1, borderColor: colors.inputBorder },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.onPrimary, fontSize: 16, fontWeight: '800' },
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  name: { flex: 1, color: colors.title, fontSize: 15, fontWeight: '700' },
  time: { color: colors.subtitle, fontSize: 10 },
  listing: { color: colors.accent, fontSize: 11, marginTop: 2 },
  preview: { flex: 1, color: colors.subtitle, fontSize: 12, marginTop: 5 },
  badge: { minWidth: 20, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, backgroundColor: colors.accent, alignItems: 'center' },
  badgeText: { color: colors.onPrimary, fontSize: 10, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  emptyTitle: { color: colors.title, fontSize: 17, fontWeight: '700', marginTop: 12 },
  emptyText: { color: colors.subtitle, fontSize: 13, textAlign: 'center', marginTop: 6 },
  errorCard: { marginHorizontal: 20, padding: 11, borderRadius: 10, backgroundColor: colors.withdrawBg },
  error: { color: colors.withdrawText, fontSize: 12 },
});
