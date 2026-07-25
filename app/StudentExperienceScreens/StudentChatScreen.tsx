import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';
import { ChatMessage } from '../../src/types/application';
import { Ionicons } from '@expo/vector-icons';

const QUICK_REPLIES = [
  'Thank you for the update!',
  'That sounds great.',
  'Could you share more details?',
  'I\'m available for a call.',
  'I\'ll get back to you shortly.',
];

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function groupMessagesByDate(messages: ChatMessage[]): { date: string; data: ChatMessage[] }[] {
  const groups: Record<string, ChatMessage[]> = {};
  messages.forEach((m) => {
    const key = new Date(m.timestamp).toDateString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  });
  return Object.entries(groups).map(([date, data]) => ({ date, data }));
}

export default function StudentChatScreen({ route, navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { conversationId, participantName, participantInitials, participantColor, internshipTitle } = route.params;
  const { chatMessages, addChatMessage, userId, userName, getMessagesByConversation } = useAppStore();
  const [inputText, setInputText] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const messages = useMemo(() => {
    return getMessagesByConversation(conversationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [chatMessages, conversationId]);

  const grouped = useMemo(() => groupMessagesByDate(messages), [messages]);

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages.length]);

  const handleSend = (text?: string) => {
    const content = (text || inputText).trim();
    if (!content) return;
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now().toString(36),
      conversationId,
      senderId: userId,
      senderName: userName || 'Student',
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'text',
    };
    addChatMessage(newMsg);
    setInputText('');
    setShowQuickReplies(false);
  };

  const renderSystemMessage = (msg: ChatMessage) => (
    <View style={styles.systemBubble}>
      <Text style={[styles.systemText, { color: colors.subtitle }]}>{msg.content}</Text>
    </View>
  );

  const renderSpecialMessage = (msg: ChatMessage) => {
    const isOffer = msg.type === 'offer';
    return (
      <View style={[styles.specialBubble, { backgroundColor: isOffer ? colors.offerCardBg : colors.iconCircle, borderLeftColor: isOffer ? '#10B981' : colors.accent }]}>
        {isOffer ? (
          <Ionicons name="gift-outline" size={16} color={colors.successIcon} />
        ) : (
          <Ionicons name="calendar-outline" size={16} color={colors.accent} />
        )}
        <Text style={[styles.specialText, { color: colors.title }]}>{msg.content}</Text>
      </View>
    );
  };

  const renderTextMessage = (msg: ChatMessage, isMine: boolean) => (
    <View style={[styles.bubbleRow, isMine && styles.bubbleRowMine]}>
      {!isMine && <View style={[styles.msgAvatar, { backgroundColor: participantColor }]}><Text style={styles.msgAvatarText}>{participantInitials}</Text></View>}
      <View style={[styles.bubble, isMine ? { backgroundColor: colors.accent } : { backgroundColor: colors.card }]}>
        {!isMine && <Text style={[styles.senderName, { color: colors.accent }]}>{msg.senderName}</Text>}
        <Text style={[styles.msgText, { color: isMine ? colors.onPrimary : colors.text }]}>{msg.content}</Text>
        <View style={styles.msgFooter}>
          <Text style={[styles.msgTime, { color: isMine ? 'rgba(255,255,255,0.7)' : colors.subtitle }]}>{formatTime(msg.timestamp)}</Text>
          {isMine && <Text style={[styles.readReceipt, { color: msg.isRead ? '#60A5FA' : 'rgba(255,255,255,0.5)' }]}>{msg.isRead ? '✓✓' : '✓'}</Text>}
        </View>
      </View>
    </View>
  );

  const renderItem = useCallback(({ item }: { item: ChatMessage }) => {
    const isMine = item.senderId === userId;
    if (item.type === 'system') return renderSystemMessage(item);
    if (item.type === 'offer' || item.type === 'interview_invite') return renderSpecialMessage(item);
    return renderTextMessage(item, isMine);
  }, [userId, renderSystemMessage, renderSpecialMessage, renderTextMessage]);

  const renderDateHeader = (date: string) => (
    <View style={styles.dateHeader}>
      <View style={[styles.dateLine, { backgroundColor: colors.inputBorder }]} />
      <Text style={[styles.dateText, { color: colors.subtitle }]}>{formatDate(date)}</Text>
      <View style={[styles.dateLine, { backgroundColor: colors.inputBorder }]} />
    </View>
  );

  const renderSection = () => {
    const sections: any[] = [];
    grouped.forEach((group) => {
      sections.push({ type: 'date', date: group.date, id: `date-${group.date}` });
      group.data.forEach((msg) => {
        sections.push({ type: 'message', data: msg, id: msg.id });
      });
    });
    return sections;
  };

  const sections = renderSection();

  const renderItemWrapper = useCallback(({ item }: { item: any }) => {
    if (item.type === 'date') return renderDateHeader(item.date);
    return renderItem({ item: item.data });
  }, [renderDateHeader, renderItem]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={[styles.header, { borderBottomColor: colors.rowBorder }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={20} color={colors.title} />
        </TouchableOpacity>
        <View style={[styles.headerAvatar, { backgroundColor: participantColor }]}>
          <Text style={styles.headerAvatarText}>{participantInitials}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerName, { color: colors.title }]} numberOfLines={1}>{participantName}</Text>
          {internshipTitle && <Text style={[styles.headerRole, { color: colors.subtitle }]} numberOfLines={1}>{internshipTitle}</Text>}
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0}>
        <FlatList
          ref={flatListRef}
          data={sections}
          renderItem={renderItemWrapper}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {showQuickReplies && (
          <View style={styles.quickRepliesContainer}>
            <View style={styles.quickRepliesScroll}>
              {QUICK_REPLIES.map((qr, i) => (
                <TouchableOpacity key={i} style={[styles.quickReplyPill, { backgroundColor: colors.card, borderColor: colors.inputBorder }]}
                  onPress={() => { setInputText(qr); setShowQuickReplies(false); }}>
                  <Text style={[styles.quickReplyText, { color: colors.title }]}>{qr}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={[styles.inputBar, { backgroundColor: colors.background, borderTopColor: colors.rowBorder }]}>
          <TouchableOpacity style={styles.quickBtn} onPress={() => setShowQuickReplies(!showQuickReplies)}>
            <Ionicons name="flash-outline" size={18} color={colors.accent} />
          </TouchableOpacity>
          <View style={[styles.inputField, { backgroundColor: colors.card, borderColor: colors.inputBorder }]}>
            <TextInput style={[styles.input, { color: colors.text }]} placeholder="Type a message..."
              placeholderTextColor={colors.placeholder} value={inputText} onChangeText={setInputText}
              multiline maxLength={1000} />
          </View>
          <TouchableOpacity style={[styles.sendBtn, { backgroundColor: inputText.trim() ? colors.accent : colors.inputBorder }]}
            onPress={() => handleSend()} disabled={!inputText.trim()}>
            <Text style={[styles.sendIcon, { color: inputText.trim() ? colors.onPrimary : colors.subtitle }]}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, gap: 10 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 16, fontWeight: 'bold' },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerAvatarText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 15, fontWeight: '700' },
  headerRole: { fontSize: 12, marginTop: 1 },
  chatContent: { padding: 16, paddingBottom: 8 },
  dateHeader: { flexDirection: 'row', alignItems: 'center', marginVertical: 16, gap: 12 },
  dateLine: { flex: 1, height: 1 },
  dateText: { fontSize: 12, fontWeight: '600' },
  systemBubble: { alignSelf: 'center', backgroundColor: colors.card, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 10, marginVertical: 6, maxWidth: '80%' },
  systemText: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
  specialBubble: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 14, marginVertical: 6, borderLeftWidth: 3, gap: 8 },
  specialIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', textAlign: 'center', lineHeight: 24, overflow: 'hidden' },
  specialText: { flex: 1, fontSize: 13, lineHeight: 18 },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8, maxWidth: '85%' },
  bubbleRowMine: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  msgAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  msgAvatarText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  bubble: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, maxWidth: '100%' },
  senderName: { fontSize: 11, fontWeight: '700', marginBottom: 4 },
  msgText: { fontSize: 14, lineHeight: 20 },
  msgFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 4 },
  msgTime: { fontSize: 10 },
  readReceipt: { fontSize: 11, fontWeight: '700' },
  quickRepliesContainer: { paddingHorizontal: 16, paddingBottom: 8 },
  quickRepliesScroll: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickReplyPill: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },
  quickReplyText: { fontSize: 13 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingVertical: 10, gap: 8, borderTopWidth: 1 },
  quickBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  quickBtnIcon: { fontSize: 18 },
  inputField: { flex: 1, borderRadius: 22, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10, maxHeight: 100 },
  input: { fontSize: 14, padding: 0, lineHeight: 20 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  sendIcon: { fontSize: 18, fontWeight: 'bold' },
});
