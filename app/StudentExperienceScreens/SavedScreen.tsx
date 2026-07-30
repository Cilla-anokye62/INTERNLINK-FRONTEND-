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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import {
  bookmarkApi,
  getAuthErrorMessage,
  listingApi,
  listingToInternshipData,
  type BookmarkResponse,
  type ListingResponse,
} from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { TAB_BAR_BOTTOM_PADDING } from '../../src/constants/Colors';

type SavedItem = {
  bookmark: BookmarkResponse;
  listing: ListingResponse | null;
};

export default function SavedScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [items, setItems] = useState<SavedItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState<number | null>(null);

  const loadSaved = useCallback(async () => {
    setError('');
    try {
      const bookmarks = await bookmarkApi.list();
      const resolved = await Promise.all(bookmarks.map(async (bookmark) => {
        try {
          return { bookmark, listing: await listingApi.getOpen(bookmark.listingId) };
        } catch {
          return { bookmark, listing: null };
        }
      }));
      setItems(resolved);
    } catch (loadError) {
      setError(getAuthErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      void loadSaved();
    }, [loadSaved]),
  );

  const removeBookmark = async (listingId: number) => {
    if (removingId !== null) return;
    setRemovingId(listingId);
    try {
      await bookmarkApi.setSaved(listingId, false);
      setItems((current) => current.filter((item) => item.bookmark.listingId !== listingId));
    } catch (removeError) {
      setError(getAuthErrorMessage(removeError));
    } finally {
      setRemovingId(null);
    }
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter(({ bookmark }) => !query
      || bookmark.listingTitle.toLowerCase().includes(query)
      || bookmark.companyName.toLowerCase().includes(query));
  }, [items, search]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved</Text>
        <Text style={styles.headerSub}>{items.length} internship{items.length === 1 ? '' : 's'}</Text>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={17} color={colors.placeholder} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search saved internships..."
          placeholderTextColor={colors.placeholder}
        />
      </View>

      {error ? (
        <TouchableOpacity style={styles.errorCard} onPress={() => void loadSaved()}>
          <Text style={styles.errorText}>{error} Tap to retry.</Text>
        </TouchableOpacity>
      ) : null}

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.bookmark.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => void loadSaved()}
            colors={[colors.accent]}
            tintColor={colors.accent}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={item.listing ? 0.85 : 1}
            onPress={() => item.listing && navigation.navigate('InternshipDetails', {
              internship: listingToInternshipData(item.listing),
            })}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.bookmark.companyName.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.bookmark.listingTitle}</Text>
              <Text style={styles.companyName}>{item.bookmark.companyName}</Text>
              <Text style={styles.metaText}>
                {item.listing
                  ? `${item.listing.remote ? 'Remote' : item.listing.location || 'Location not set'} · ${item.listing.duration || 'Duration not set'}`
                  : 'This listing is no longer open'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.bookmarkButton}
              disabled={removingId !== null}
              onPress={(event) => {
                event.stopPropagation();
                void removeBookmark(item.bookmark.listingId);
              }}
            >
              {removingId === item.bookmark.listingId
                ? <ActivityIndicator size="small" color={colors.accent} />
                : <Ionicons name="bookmark" size={20} color={colors.accent} />}
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {loading ? (
              <ActivityIndicator color={colors.accent} />
            ) : (
              <>
                <Ionicons name="bookmark-outline" size={46} color={colors.subtitle} />
                <Text style={styles.emptyTitle}>No saved internships</Text>
                <Text style={styles.emptyText}>Save an internship from its details page to find it here.</Text>
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
  header: { paddingHorizontal: 24, paddingTop: 16, marginBottom: 15 },
  headerTitle: { color: colors.title, fontSize: 24, fontWeight: '700' },
  headerSub: { color: colors.subtitle, fontSize: 13, marginTop: 3 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 24,
    marginBottom: 14,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 15,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  searchInput: { flex: 1, color: colors.text, fontSize: 14 },
  errorCard: { marginHorizontal: 24, marginBottom: 12, padding: 11, borderRadius: 10, backgroundColor: colors.withdrawBg },
  errorText: { color: colors.withdrawText, fontSize: 12 },
  listContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: TAB_BAR_BOTTOM_PADDING, gap: 11 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: colors.onPrimary, fontSize: 17, fontWeight: '700' },
  cardInfo: { flex: 1 },
  cardTitle: { color: colors.title, fontSize: 14, fontWeight: '700' },
  companyName: { color: colors.subtitle, fontSize: 12, marginTop: 2 },
  metaText: { color: colors.placeholder, fontSize: 11, marginTop: 7 },
  bookmarkButton: { padding: 8, marginLeft: 5 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 70, paddingHorizontal: 30, gap: 9 },
  emptyTitle: { color: colors.title, fontSize: 18, fontWeight: '700' },
  emptyText: { color: colors.subtitle, fontSize: 13, lineHeight: 19, textAlign: 'center' },
});
