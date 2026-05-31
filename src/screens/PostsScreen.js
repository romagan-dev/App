import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl, TextInput, Animated,
} from 'react-native';
import { usePosts } from '../hooks/UsePosts';
import { useSettingsStore } from '../store/useSettingsStore';

const PostItem = ({ item, onPress, theme, index }) => {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, delay: index * 50, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay: index * 50, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={onPress}
        onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()}
        activeOpacity={1}
      >
        <View style={[styles.numBadge, { backgroundColor: theme.primary + '22' }]}>
          <Text style={[styles.numText, { color: theme.primary }]}>#{item.id}</Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={[styles.postTitle, { color: theme.text }]} numberOfLines={2}>{item.title}</Text>
          <Text style={[styles.postBody, { color: theme.subtext }]} numberOfLines={2}>{item.body}</Text>
          <Text style={[styles.readMore, { color: theme.primary }]}>Детальніше →</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function PostsScreen({ navigation }) {
  const { isDark } = useSettingsStore();
  const { data: posts, isLoading, isError, refetch, isFetching, dataUpdatedAt } = usePosts();
  const [search, setSearch] = useState('');

  const headerAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const theme = {
    bg: isDark ? '#0D0D0D' : '#F0F2F5', card: isDark ? '#1C1C1E' : '#FFFFFF',
    text: isDark ? '#FFF' : '#1A1A2E', subtext: isDark ? '#AAA' : '#666',
    border: isDark ? '#333' : '#E0E0E0', primary: '#3F51B5',
  };

  const filtered = (posts ?? []).filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
  const cacheTime = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString('uk-UA') : '—';

  if (isLoading) return (
    <View style={[styles.center, { backgroundColor: theme.bg }]}>
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={[{ color: theme.subtext, marginTop: 12 }]}>Завантаження постів...</Text>
    </View>
  );

  if (isError) return (
    <View style={[styles.center, { backgroundColor: theme.bg }]}>
      <Text style={{ fontSize: 48 }}>😵</Text>
      <Text style={[{ color: theme.text, fontSize: 17, fontWeight: '700', marginTop: 10 }]}>Помилка завантаження</Text>
      <TouchableOpacity style={[styles.retryBtn, { backgroundColor: theme.primary }]} onPress={refetch}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Повторити</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Animated.View style={{
        opacity: headerAnim,
        transform: [{ translateY: headerAnim.interpolate({ inputRange: [0,1], outputRange: [-15, 0] }) }],
      }}>
        <View style={[styles.cacheBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <Text style={[styles.cacheText, { color: theme.subtext }]}>
            {isFetching ? '🔄 Оновлення...' : `✅ Кеш: ${cacheTime}`}
          </Text>
          <Text style={[styles.cacheText, { color: theme.subtext }]}>{posts?.length ?? 0} постів</Text>
        </View>
        <View style={[styles.searchWrap, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput style={[styles.searchInput, { color: theme.text }]}
            placeholder="Пошук постів..." placeholderTextColor={theme.subtext}
            value={search} onChangeText={setSearch} />
          {search ? <TouchableOpacity onPress={() => setSearch('')}><Text style={{ color: theme.subtext, fontSize: 18 }}>✕</Text></TouchableOpacity> : null}
        </View>
      </Animated.View>

      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{ padding: 12 }}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={theme.primary} />}
        renderItem={({ item, index }) => (
          <PostItem item={item} theme={theme} index={index % 10}
            onPress={() => navigation.navigate('PostDetail', { postId: item.id, title: item.title })} />
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
  retryBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 10 },
  cacheBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1 },
  cacheText: { fontSize: 11 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', margin: 12, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 15 },
  card: {
    flexDirection: 'row', padding: 14, marginBottom: 10, borderRadius: 16, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  numBadge: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12, alignSelf: 'flex-start' },
  numText: { fontSize: 12, fontWeight: '800' },
  cardBody: { flex: 1 },
  postTitle: { fontSize: 15, fontWeight: '700', marginBottom: 5, lineHeight: 21 },
  postBody: { fontSize: 13, lineHeight: 19, marginBottom: 8 },
  readMore: { fontSize: 13, fontWeight: '600' },
  empty: { alignItems: 'center', marginTop: 60 },
});