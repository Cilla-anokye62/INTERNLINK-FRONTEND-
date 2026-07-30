import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  bookmarkApi,
  getAuthErrorMessage,
  listingApi,
  listingToInternshipData,
  type ListingResponse,
} from '../../src/api';
import { useAppTheme } from '../../src/hooks/useAppTheme';

export default function SearchResultsScreen({ navigation, route }: any) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [query, setQuery] = useState(route.params?.query ?? '');
  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const [nextListings, nextBookmarks] = await Promise.all([
        listingApi.listOpen(),
        bookmarkApi.list(),
      ]);
      setListings(nextListings);
      setBookmarks(nextBookmarks.map((bookmark) => bookmark.listingId));
    } catch (loadError) {
      setError(getAuthErrorMessage(loadError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return listings;
    return listings.filter((listing) => [
      listing.title,
      listing.companyName,
      listing.location ?? '',
      listing.industry ?? '',
      ...listing.requiredSkills,
    ].some((value) => value.toLowerCase().includes(normalized)));
  }, [listings, query]);

  const toggleBookmark = async (listingId: number) => {
    if (savingId !== null) return;
    setSavingId(listingId);
    try {
      if (bookmarks.includes(listingId)) {
        await bookmarkApi.remove(listingId);
        setBookmarks((current) => current.filter((id) => id !== listingId));
      } else {
        await bookmarkApi.save(listingId);
        setBookmarks((current) => [...current, listingId]);
      }
    } catch (saveError) {
      Alert.alert('Unable to update saved internships', getAuthErrorMessage(saveError));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.title} />
        </TouchableOpacity>
        <View style={styles.flex}>
          <Text style={styles.title}>Search Internships</Text>
          <Text style={styles.subtitle}>{results.length} open results</Text>
        </View>
      </View>

      <View style={styles.search}>
        <Ionicons name="search-outline" size={19} color={colors.subtitle} />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Role, company, skill, location…"
          placeholderTextColor={colors.subtitle}
          autoFocus={Boolean(route.params?.autoFocus)}
        />
        {query ? (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={19} color={colors.subtitle} />
          </TouchableOpacity>
        ) : null}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          refreshControl={(
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void load(true)}
              tintColor={colors.accent}
            />
          )}
          ListHeaderComponent={error ? <Text style={styles.error}>{error}</Text> : null}
          ListEmptyComponent={(
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={38} color={colors.subtitle} />
              <Text style={styles.emptyTitle}>No internships found</Text>
              <Text style={styles.emptyText}>Try a different role, skill, company, or location.</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('InternshipDetails', {
                internship: listingToInternshipData(item),
              })}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.companyName.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.flex}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.company}>{item.companyName}</Text>
                <Text style={styles.meta}>
                  {item.location || 'Location not specified'}{item.remote ? ' · Remote' : ''}
                </Text>
                <Text style={styles.meta}>
                  {item.allowance || 'Allowance not specified'} · {item.duration || 'Duration not specified'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.bookmark}
                onPress={() => void toggleBookmark(item.id)}
                disabled={savingId === item.id}
              >
                {savingId === item.id
                  ? <ActivityIndicator size="small" color={colors.accent} />
                  : (
                    <Ionicons
                      name={bookmarks.includes(item.id) ? 'bookmark' : 'bookmark-outline'}
                      size={20}
                      color={bookmarks.includes(item.id) ? colors.accent : colors.subtitle}
                    />
                  )}
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 10 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    marginRight: 12,
  },
  flex: { flex: 1 },
  title: { color: colors.title, fontSize: 21, fontWeight: '800' },
  subtitle: { color: colors.subtitle, fontSize: 12, marginTop: 2 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 13,
    marginHorizontal: 20,
    paddingHorizontal: 13,
  },
  input: { flex: 1, color: colors.text, paddingVertical: 13, fontSize: 14 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 20, paddingBottom: 40, flexGrow: 1 },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: 15,
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.iconCircle,
  },
  avatarText: { color: colors.accent, fontSize: 18, fontWeight: '800' },
  cardTitle: { color: colors.title, fontSize: 15, fontWeight: '800', paddingRight: 4 },
  company: { color: colors.text, fontSize: 13, fontWeight: '600', marginTop: 3 },
  meta: { color: colors.subtitle, fontSize: 11, marginTop: 4 },
  bookmark: { width: 35, height: 35, alignItems: 'center', justifyContent: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 70 },
  emptyTitle: { color: colors.title, fontSize: 16, fontWeight: '800', marginTop: 10 },
  emptyText: { color: colors.subtitle, fontSize: 12, textAlign: 'center', marginTop: 5 },
  error: { color: colors.danger, marginBottom: 12 },
});
