import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAppStore } from '../../src/store/useAppStore';
import { Conversation } from '../../src/types/application';

type FilterTab = 'all' | 'unread' | 'pinned' | 'archived';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

export default function MessagesScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { conversations, userId, markConversationRead, togglePinConversation, archiveConversation } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const employerConversations = useMemo(() => {
    return conversations.filter((c) => c.ownerId === userId && (!c.isArchived || activeFilter === 'archived'));
  }, [conversations, userId, activeFilter]);

  const filtered = useMemo(() => {
    let result = employerConversations;
    switch (activeFilter) {
      case 'unread': result = result.filter((c) => c.unreadCount > 0); break;
      case 'pinned': result = result.filter((c) => c.isPinned); break;
      case 'archived': result = result.filter((c) => c.isArchived); break;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) => c.participantName.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q) || (c.internshipTitle || '').toLowerCase().includes(q));
    }
    return [...result].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
    });
  }, [employerConversations, activeFilter, searchQuery]);

  const totalUnread = useMemo(() => conversations.filter((c) => !c.isArchived).reduce((sum, c) => sum + c.unreadCount, 0), [conversations]);

  const filters: { key: FilterTab; label: string; count?: number }[] = [
    { key: 'all', label: 'All', count: employerConversations.filter((c) => !c.isArchived).length },
    { key: 'unread', label: 'Unread', count: totalUnread },
    { key: 'pinned', label: 'Pinned' },
    { key: 'archived', label: 'Archived' },
  ];

  const handleOpen = useCallback((conv: Conversation) => {
    markConversationRead(conv.id);
    navigation.navigate('ChatScreen', {
      conversationId: conv.id,
      participantName: conv.participantName,
      participantInitials: conv.participantInitials,
      participantColor: conv.participantColor,
      internshipTitle: conv.internshipTitle,
    });
  }, [navigation, markConversationRead]);

  const handleLongPress = useCallback((conv: Conversation) => {
    const options: any[] = [];
    options.push({ text: conv.isPinned ? 'Unpin' : 'Pin', onPress: () => togglePinConversation(conv.id) });
    options.push({ text: conv.isArchived ? 'Unarchive' : 'Archive', onPress: () => archiveConversation(conv.id) });
    options.push({ text: 'Cancel', style: 'cancel' });
    Alert.alert(conv.participantName, 'Choose an action', options);
  }, [togglePinConversation, archiveConversation]);

  const renderConversation = ({ item }: { item: Conversation }) => {
    const hasUnread = item.unreadCount > 0;
    return (
      <TouchableOpacity
        style={[styles.convCard, { backgroundColor: hasUnread ? colors.unreadBg : colors.card, borderLeftColor: hasUnread ? colors.accent : 'transparent' }]}
        activeOpacity={0.7}
        onPress={() => handleOpen(item)}
        onLongPress={() => handleLongPress(item)}
      >
        <View style={[styles.avatar, { backgroundColor: item.participantColor }]}>
          <Text style={styles.avatarText}>{item.participantInitials}</Text>
          {!item.isMuted && hasUnread && <View style={[styles.onlineDot, { backgroundColor: colors.onlineDot }]} />}
        </View>
        <View style={styles.convContent}>
          <View style={styles.convTopRow}>
            <View style={styles.convNameRow}>
              {item.isPinned && <Ionicons name="pin-outline" size={12} color={colors.accent} />}
              <Text style={[styles.convName, { color: colors.title }]} numberOfLines={1}>{item.participantName}</Text>
            </View>
            <Text style={[styles.convTime, { color: colors.subtitle }]}>{timeAgo(item.lastMessageTime)}</Text>
          </View>
          {item.internshipTitle && <Text style={[styles.convRole, { color: colors.accent }]} numberOfLines={1}>{item.internshipTitle}</Text>}
          <View style={styles.convBottomRow}>
            <Text style={[styles.convPreview, { color: hasUnread ? colors.title : colors.subtitle }]} numberOfLines={1}>{item.lastMessage}</Text>
            {hasUnread && (
              <View style={[styles.badge, { backgroundColor: colors.accent }]}>
                <Text style={[styles.badgeText, { color: colors.onPrimary }]}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={[styles.backArrow, { color: colors.title }]}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.title }]}>Messages</Text>
          {totalUnread > 0 && <View style={[styles.headerBadge, { backgroundColor: colors.accent }]}><Text style={[styles.headerBadgeText, { color: colors.onPrimary }]}>{totalUnread}</Text></View>}
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.inputBorder }]}>
          <Ionicons name="search-outline" size={16} color={colors.placeholder} />
          <TextInput style={[styles.searchInput, { color: colors.text }]} placeholder="Search conversations..."
            placeholderTextColor={colors.placeholder} value={searchQuery} onChangeText={setSearchQuery} />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={[styles.clearBtn, { color: colors.subtitle }]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity key={f.key} style={[styles.filterPill, {
            backgroundColor: activeFilter === f.key ? colors.accent : colors.card,
            borderColor: activeFilter === f.key ? colors.accent : colors.inputBorder,
          }]} onPress={() => setActiveFilter(f.key)}>
            <Text style={[styles.filterText, { color: activeFilter === f.key ? colors.onPrimary : colors.subtitle }]}>{f.label}</Text>
            {f.count !== undefined && f.count > 0 && (
              <View style={[styles.filterBadge, { backgroundColor: activeFilter === f.key ? 'rgba(255,255,255,0.3)' : colors.accent }]}>
                <Text style={[styles.filterBadgeText, { color: activeFilter === f.key ? colors.onPrimary : colors.onPrimary }]}>{f.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered} renderItem={renderConversation} keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubble-outline" size={48} color={colors.subtitle} style={{ marginBottom: 16 }} />
            <Text style={[styles.emptyTitle, { color: colors.title }]}>
              {activeFilter === 'archived' ? 'No archived conversations' : activeFilter === 'unread' ? 'All caught up!' : 'No conversations yet'}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.subtitle }]}>
              {activeFilter === 'archived' ? 'Archived conversations will appear here' : activeFilter === 'unread' ? 'No unread messages at the moment' : 'Conversations with applicants will appear here'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 18, fontWeight: 'bold' },
  headerCenter: { alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerBadge: { borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2, minWidth: 20, alignItems: 'center' },
  headerBadgeText: { fontSize: 11, fontWeight: '700' },
  searchContainer: { paddingHorizontal: 20, marginBottom: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1, paddingHorizontal: 14, height: 48, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },
  clearBtn: { fontSize: 14, padding: 4 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 8 },
  filterPill: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, gap: 6 },
  filterText: { fontSize: 13, fontWeight: '500' },
  filterBadge: { borderRadius: 8, paddingHorizontal: 5, paddingVertical: 1, minWidth: 16, alignItems: 'center' },
  filterBadgeText: { fontSize: 10, fontWeight: '700' },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  convCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 14, marginBottom: 8, gap: 12, borderLeftWidth: 3 },
  avatar: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  onlineDot: { width: 12, height: 12, borderRadius: 6, position: 'absolute', bottom: 0, right: 0, borderWidth: 2, borderColor: colors.card },
  convContent: { flex: 1 },
  convTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  convNameRow: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 4 },
  convName: { fontSize: 15, fontWeight: '700', flex: 1 },
  convTime: { fontSize: 12 },
  convRole: { fontSize: 12, fontWeight: '500', marginBottom: 4 },
  convBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  convPreview: { fontSize: 13, flex: 1, marginRight: 8 },
  badge: { borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2, minWidth: 20, alignItems: 'center' },
  badgeText: { fontSize: 11, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, textAlign: 'center' },
});
