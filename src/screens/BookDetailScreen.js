import React from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native';
import { useBooks } from '../context/BooksContext';
import { useTheme } from '../context/ThemeContext';

export default function BookDetailScreen({ route, navigation }) {
  const { bookId } = route.params;
  const { books, deleteBook } = useBooks();
  const { theme } = useTheme();

  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <Text style={{ color: theme.subtext, fontSize: 16 }}>Книгу не знайдено</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Видалити книгу?', `"${book.title}"`, [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Видалити', style: 'destructive',
        onPress: () => { deleteBook(book.id); navigation.goBack(); },
      },
    ]);
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.bg }}
      contentContainerStyle={styles.container}
    >
      {/* Обкладинка + базова інфо */}
      <View style={[styles.hero, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Image source={{ uri: book.cover }} style={styles.cover} />
        <View style={styles.heroInfo}>
          <Text style={[styles.title, { color: theme.text }]}>{book.title}</Text>
          <Text style={[styles.author, { color: theme.subtext }]}>{book.author}</Text>
          <View style={[styles.badge, { backgroundColor: theme.primary + '22' }]}>
            <Text style={[styles.badgeText, { color: theme.primary }]}>{book.genre}</Text>
          </View>
        </View>
      </View>

      {/* Статистика */}
      <View style={styles.statsRow}>
        {[
          { label: 'Рік', value: book.year },
          { label: 'Рейтинг', value: `⭐ ${book.rating}` },
          { label: 'Жанр', value: book.genre },
        ].map((s) => (
          <View key={s.label} style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statValue, { color: theme.text }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: theme.subtext }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Опис */}
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Опис</Text>
        <Text style={[styles.desc, { color: theme.subtext }]}>{book.description}</Text>
      </View>

      {/* Кнопка видалення */}
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteBtnText}>🗑 Видалити книгу</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 14 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hero: {
    flexDirection: 'row', padding: 16,
    borderRadius: 18, borderWidth: 1, gap: 14,
  },
  cover: { width: 100, height: 145, borderRadius: 10 },
  heroInfo: { flex: 1, justifyContent: 'center', gap: 8 },
  title: { fontSize: 20, fontWeight: '800', lineHeight: 26 },
  author: { fontSize: 14 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1, padding: 14, borderRadius: 14, borderWidth: 1,
    alignItems: 'center', gap: 4,
  },
  statValue: { fontSize: 16, fontWeight: '700' },
  statLabel: { fontSize: 11 },
  section: { padding: 18, borderRadius: 16, borderWidth: 1, gap: 10 },
  sectionTitle: { fontSize: 17, fontWeight: '700' },
  desc: { fontSize: 15, lineHeight: 23 },
  deleteBtn: {
    backgroundColor: '#FFEBEE', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
  },
  deleteBtnText: { color: '#E53935', fontSize: 16, fontWeight: '700' },
});