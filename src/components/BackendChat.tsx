import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getAuthErrorMessage, messagingApi, type BackendMessageResponse } from '../api';
import { useAppTheme } from '../hooks/useAppTheme';

export default function BackendChat({
  route,
  navigation,
  role,
}: {
  route: any;
  navigation: any;
  role: 'STUDENT' | 'EMPLOYER';
}) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const conversationId = Number(route.params?.conversationId);
  const participantName = route.params?.participantName || 'Conversation';
  const [items, setItems] = useState<BackendMessageResponse[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef<FlatList<BackendMessageResponse>>(null);

  const load = useCallback(async () => {
    try {
      const result = await messagingApi.messages(conversationId);
      setItems(result);
      await messagingApi.markRead(conversationId);
      setError('');
    } catch (loadError) {
      setError(getAuthErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => { void load(); }, [load]);

  const send = async () => {
    const body = input.trim();
    if (!body || sending) return;
    setSending(true);
    try {
      const sent = await messagingApi.send(conversationId, body);
      setItems((current) => [...current, sent]);
      setInput('');
    } catch (sendError) {
      setError(getAuthErrorMessage(sendError));
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.title} />
        </TouchableOpacity>
        <View style={styles.flex}>
          <Text style={styles.name}>{participantName}</Text>
          <Text style={styles.subtitle}>{route.params?.internshipTitle || 'InternLink conversation'}</Text>
        </View>
        <TouchableOpacity onPress={() => void load()}>
          <Ionicons name="refresh" size={20} color={colors.accent} />
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {loading ? (
          <View style={styles.center}><ActivityIndicator color={colors.accent} /></View>
        ) : (
          <FlatList
            ref={listRef}
            data={items}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.messages}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => {
              const mine = item.senderRole === role;
              return (
                <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
                  <Text style={[styles.body, mine && styles.mineText]}>{item.body}</Text>
                  <Text style={[styles.time, mine && styles.mineTime]}>
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {mine ? (item.readAt ? '  Read' : '  Sent') : ''}
                  </Text>
                </View>
              );
            }}
            ListEmptyComponent={<View style={styles.center}><Text style={styles.empty}>Send the first message.</Text></View>}
          />
        )}
        <View style={styles.composer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message"
            placeholderTextColor={colors.placeholder}
            style={styles.input}
            multiline
            maxLength={5000}
          />
          <TouchableOpacity style={[styles.send, !input.trim() && styles.disabled]} onPress={() => void send()} disabled={!input.trim() || sending}>
            {sending ? <ActivityIndicator color={colors.onPrimary} /> : <Ionicons name="send" size={18} color={colors.onPrimary} />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15, borderBottomWidth: 1, borderBottomColor: colors.inputBorder },
  back: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  name: { color: colors.title, fontSize: 16, fontWeight: '700' },
  subtitle: { color: colors.subtitle, fontSize: 11, marginTop: 2 },
  messages: { flexGrow: 1, padding: 16, justifyContent: 'flex-end' },
  bubble: { maxWidth: '82%', borderRadius: 17, padding: 12, marginBottom: 8 },
  mine: { alignSelf: 'flex-end', backgroundColor: colors.accent, borderBottomRightRadius: 4 },
  theirs: { alignSelf: 'flex-start', backgroundColor: colors.card, borderBottomLeftRadius: 4 },
  body: { color: colors.text, fontSize: 14, lineHeight: 20 },
  mineText: { color: colors.onPrimary },
  time: { color: colors.subtitle, fontSize: 9, marginTop: 5, textAlign: 'right' },
  mineTime: { color: 'rgba(255,255,255,0.72)' },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: colors.inputBorder },
  input: { flex: 1, minHeight: 44, maxHeight: 110, borderRadius: 22, paddingHorizontal: 15, paddingVertical: 11, color: colors.text, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder },
  send: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.45 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { color: colors.subtitle, fontSize: 13 },
  error: { color: colors.withdrawText, backgroundColor: colors.withdrawBg, padding: 9, textAlign: 'center', fontSize: 11 },
});
