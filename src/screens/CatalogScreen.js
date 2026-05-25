import React, { useState, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image,
  StyleSheet, Alert, Animated, TextInput,
} from 'react-native';
import { useBooks } from '../context/BooksContext';
import { useTheme } from '../context/ThemeContext';

// ─── Картка книги ───
const BookItem = ({ item, onDelete, onPress, theme }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const press = (v) =>
    Animated.spring(scale, { toValue: v, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={onPress}
        onPressIn={() => press(0.97)}
        onPressOut={() => press(1)}
        activeOpacity={1}
      >
        <Image source={{ uri: item.cover }} style={styles.cover} />
        <View style={styles.info}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[styles.author, { color: theme.subtext }]}>{item.author}</Text>
          <View style={[styles.badge, { backgroundColor: theme.primary + '22' }]}>
            <Text style={[styles.badgeText, { color: theme.primary }]}>{item.genre}</Text>
          </View>
          <Text style={[styles.year, { color: theme.subtext }]}>
            ⭐ {item.rating}  ·  {item.year} р.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.delBtn}
          onPress={() =>
            Alert.alert('Видалити книгу?', `"${item.title}"`, [
              { text: 'Скасувати', style: 'cancel' },
              { text: 'Видалити', style: 'destructive', onPress: () => onDelete(item.id) },
            ])
          }
        >
          <Text style={styles.delText}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Екран каталогу ───
export default function CatalogScreen({ navigation }) {
  const { books, deleteBook } = useBooks();
  const { theme } = useTheme();
  const [search, setSearch] = useState('');

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Пошук */}
      <View style={[styles.searchWrap, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Пошук за назвою або автором..."
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
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <BookItem
            item={item}
            theme={theme}
            onDelete={deleteBook}
            onPress={() =>
              navigation.navigate('BookDetail', {
                bookId: item.id,
                title: item.title,
              })
            }
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 48 }}>📭</Text>
            <Text style={[styles.emptyText, { color: theme.subtext }]}>
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
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    margin: 12, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 14, borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15 },
  list: { paddingHorizontal: 12, paddingBottom: 20 },
  card: {
    flexDirection: 'row', padding: 12, marginBottom: 10,
    borderRadius: 16, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  cover: { width: 65, height: 95, borderRadius: 8 },
  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  author: { fontSize: 13, marginBottom: 6 },
  badge: {
    alignSelf: 'flex-start', paddingHorizontal: 10,
    paddingVertical: 3, borderRadius: 20, marginBottom: 6,
  },
  badgeText: { fontSize: 11, fontWeight: '600' },
  year: { fontSize: 12 },
  delBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#FFEBEE', justifyContent: 'center',
    alignItems: 'center', alignSelf: 'center', marginLeft: 6,
  },
  delText: { color: '#E53935', fontSize: 13, fontWeight: 'bold' },
  empty: { alignItems: 'center', marginTop: 80, gap: 12 },
  emptyText: { fontSize: 16 },
});