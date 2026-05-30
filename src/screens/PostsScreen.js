import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl, TextInput,
} from 'react-native';
import { usePosts } from '../hooks/UsePosts';
import { useSettingsStore } from '../store/useSettingsStore';

// ─── Пункт 3 + 4: четвертий екран з API + React Query кешуванням ───
export default function PostsScreen({ navigation }) {
const isDark = useSettingsStore(s => s.isDark);
const theme = {
  bg: isDark ? '#0D0D0D' : '#F0F2F5',
  card: isDark ? '#1C1C1E' : '#FFFFFF',
  text: isDark ? '#FFF' : '#1A1A2E',
  subtext: isDark ? '#AAA' : '#666',
  border: isDark ? '#333' : '#E0E0E0',
  primary: '#3F51B5',
};  const { data: posts, isLoading, isError, refetch, isFetching, dataUpdatedAt } = usePosts();
  const [search, setSearch] = useState('');

  const filtered = (posts ?? []).filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const cacheTime = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('uk-UA')
    : '—';

  if (isLoading) return (
    <View style={[styles.center, { backgroundColor: theme.bg }]}>
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={[styles.loadingText, { color: theme.subtext }]}>
        Завантаження постів...
      </Text>
    </View>
  );

  if (isError) return (
    <View style={[styles.center, { backgroundColor: theme.bg }]}>
      <Text style={{ fontSize: 48 }}>😵</Text>
      <Text style={[styles.errorText, { color: theme.text }]}>Помилка завантаження</Text>
      <TouchableOpacity style={[styles.retryBtn, { backgroundColor: theme.primary }]} onPress={refetch}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Повторити</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Індикатор кешу */}
      <View style={[styles.cacheBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <Text style={[styles.cacheText, { color: theme.subtext }]}>
          {isFetching ? '🔄 Оновлення...' : `✅ Кеш: ${cacheTime}`}
        </Text>
        <Text style={[styles.cacheText, { color: theme.subtext }]}>
          {posts?.length ?? 0} постів
        </Text>
      </View>

      {/* Пошук */}
      <View style={[styles.searchWrap, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Пошук постів..."
          placeholderTextColor={theme.subtext}
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={{ color: theme.subtext, fontSize: 18 }}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{ padding: 12 }}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={theme.primary} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => navigation.navigate('PostDetail', { postId: item.id, title: item.title })}
            activeOpacity={0.75}
          >
            <View style={[styles.numBadge, { backgroundColor: theme.primary + '22' }]}>
              <Text style={[styles.numText, { color: theme.primary }]}>#{item.id}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={[styles.postTitle, { color: theme.text }]} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={[styles.postBody, { color: theme.subtext }]} numberOfLines={2}>
                {item.body}
              </Text>
              <Text style={[styles.readMore, { color: theme.primary }]}>
                Детальніше →
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 40 }}>📭</Text>
            <Text style={[{ color: theme.subtext, marginTop: 10 }]}>Нічого не знайдено</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 14 },
  loadingText: { fontSize: 15, marginTop: 12 },
  errorText: { fontSize: 17, fontWeight: '700' },
  retryBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  cacheBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1,
  },
  cacheText: { fontSize: 11 },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    margin: 12, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 14, borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15 },
  card: {
    flexDirection: 'row', padding: 14, marginBottom: 10,
    borderRadius: 16, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  numBadge: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginRight: 12, alignSelf: 'flex-start',
  },
  numText: { fontSize: 12, fontWeight: '800' },
  cardBody: { flex: 1 },
  postTitle: { fontSize: 15, fontWeight: '700', marginBottom: 5, lineHeight: 21 },
  postBody: { fontSize: 13, lineHeight: 19, marginBottom: 8 },
  readMore: { fontSize: 13, fontWeight: '600' },
  empty: { alignItems: 'center', marginTop: 60 },
});