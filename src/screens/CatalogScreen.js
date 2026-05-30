import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image,
  StyleSheet, Alert, Animated, TextInput, useRef,
} from 'react-native';
import { useBooksStore }    from '../store/useBooksStore';
import { useSettingsStore } from '../store/useSettingsStore';

const BookItem = ({ item, onDelete, onPress, theme }) => {
  const scale = React.useRef(new Animated.Value(1)).current;
  const press = v => Animated.spring(scale, { toValue: v, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={onPress} onPressIn={() => press(0.97)} onPressOut={() => press(1)} activeOpacity={1}
      >
        <Image source={{ uri: item.cover }} style={styles.cover} />
        <View style={styles.info}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>{item.title}</Text>
          <Text style={[styles.author, { color: theme.subtext }]}>{item.author}</Text>
          <View style={[styles.badge, { backgroundColor: theme.primary + '22' }]}>
            <Text style={[styles.badgeText, { color: theme.primary }]}>{item.genre}</Text>
          </View>
          <Text style={[styles.meta, { color: theme.subtext }]}>⭐ {item.rating} · {item.year} р.</Text>
        </View>
        <TouchableOpacity style={styles.delBtn} onPress={() =>
          Alert.alert('Видалити?', `"${item.title}"`, [
            { text: 'Скасувати', style: 'cancel' },
            { text: 'Видалити', style: 'destructive', onPress: () => onDelete(item.id) },
          ])
        }>
          <Text style={styles.delText}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function CatalogScreen({ navigation }) {
  const { books, deleteBook, sessionOnly } = useBooksStore();
  const isDark    = useSettingsStore(s => s.isDark);
  const sortAlpha = useSettingsStore(s => s.sortAlpha);
  const [search, setSearch] = useState('');

  const theme = {
    bg: isDark ? '#0D0D0D' : '#F0F2F5', card: isDark ? '#1C1C1E' : '#FFFFFF',
    text: isDark ? '#FFF' : '#1A1A2E', subtext: isDark ? '#AAA' : '#666',
    border: isDark ? '#333' : '#E0E0E0', primary: '#3F51B5',
  };

  const filtered = books
    .filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortAlpha ? a.title.localeCompare(b.title, 'uk') : 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Індикатор сесійного режиму */}
      {sessionOnly && (
        <View style={styles.sessionBanner}>
          <Text style={styles.sessionText}>⚡ Режим сесії — зміни не зберігаються</Text>
        </View>
      )}

      <View style={[styles.searchWrap, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Пошук..." placeholderTextColor={theme.subtext}
          value={search} onChangeText={setSearch}
        />
        {search ? <TouchableOpacity onPress={() => setSearch('')}><Text style={{ color: theme.subtext, fontSize: 18 }}>✕</Text></TouchableOpacity> : null}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <BookItem item={item} theme={theme} onDelete={deleteBook}
            onPress={() => navigation.navigate('BookDetail', { bookId: item.id, title: item.title })} />
        )}
        contentContainerStyle={{ padding: 12 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 48 }}>📭</Text>
            <Text style={[{ color: theme.subtext, marginTop: 10 }]}>
              {search ? 'Нічого не знайдено' : 'Каталог порожній'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sessionBanner: { backgroundColor: '#FF6B35', padding: 8, alignItems: 'center' },
  sessionText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    margin: 12, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15 },
  card: {
    flexDirection: 'row', padding: 12, marginBottom: 10, borderRadius: 16, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  cover: { width: 65, height: 95, borderRadius: 8 },
  info: { flex: 1, marginLeft: 12, justifyContent: 'center', gap: 4 },
  title: { fontSize: 16, fontWeight: '700' },
  author: { fontSize: 13 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  meta: { fontSize: 12 },
  delBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginLeft: 6 },
  delText: { color: '#E53935', fontSize: 13, fontWeight: 'bold' },
  empty: { alignItems: 'center', marginTop: 80 },
});