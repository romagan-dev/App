import React, { useState, useRef } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, FlatList,
  Image, Switch, SafeAreaView, Modal, TextInput,
 Animated, ScrollView, Alert, Platform
} from 'react-native';

import Slider from '@react-native-community/slider';
const BookItem = ({ item, isDark, onDelete, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  const handlePressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Image source={{ uri: item.cover }} style={styles.coverImage} />
        <View style={styles.bookInfo}>
          <Text style={[styles.bookTitle, isDark && styles.textWhite]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.bookAuthor}>{item.author}</Text>
          {item.genre ? (
            <View style={styles.genreBadge}>
              <Text style={styles.genreText}>{item.genre}</Text>
            </View>
          ) : null}
        </View>
        {/* ПУНКТ 3: Кнопка видалення */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() =>
            Alert.alert('Видалити', `Видалити "${item.title}"?`, [
              { text: 'Скасувати', style: 'cancel' },
              { text: 'Видалити', style: 'destructive', onPress: () => onDelete(item.id) },
            ])
          }
        >
          <Text style={styles.deleteBtnText}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────
// Початкові дані
// ─────────────────────────────────────────────
const TITLES = ['Кобзар', 'Тіні забутих предків', 'Маруся Чурай', 'Інтернат', 'Ворошиловград'];
const AUTHORS = ['Т. Шевченко', 'М. Коцюбинський', 'Л. Костенко', 'С. Жадан', 'М. Хвильовий'];
const GENRES = ['Поезія', 'Проза', 'Роман', 'Повість', 'Оповідання'];
const DESCRIPTIONS = [
  'Видатна збірка поезій, що стала символом української національної ідентичності.',
  'Геніальна повість про гуцульське кохання, природу і народні вірування.',
  'Ліричний роман у віршах про долю поетеси XVII століття.',
  'Сучасний роман про школу для дітей з особливими потребами під час війни.',
  'Роман-феєрія про повернення на батьківщину та пошук себе.',
];

const initialBooks = Array.from({ length: 10 }).map((_, i) => ({
  id: `book_${i}`,
  title: TITLES[i % 5],
  author: AUTHORS[i % 5],
  genre: GENRES[i % 5],
  description: DESCRIPTIONS[i % 5],
  year: 1840 + i * 15,
  rating: Math.round((3.5 + (i % 3) * 0.5) * 10) / 10,
  cover: `https://picsum.photos/150/200?random=${i + 10}`,
}));

// ─────────────────────────────────────────────
// ГОЛОВНИЙ КОМПОНЕНТ
// ─────────────────────────────────────────────
export default function App() {
  // --- Стан ---
  const [books, setBooks] = useState(initialBooks);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);

  // ПУНКТ 5: активний екран через спадне меню (замість кнопок)
  const [activeTab, setActiveTab] = useState('catalog');

  // Форма додавання
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newGenre, setNewGenre] = useState('');
  const [newYear, setNewYear] = useState(2020);

  // Налаштування
  const [fontSize, setFontSize] = useState(16);
  const [showCovers, setShowCovers] = useState(true);
  const [sortAlpha, setSortAlpha] = useState(false);
  const [language, setLanguage] = useState('UA');

  // ─────── Хелпери ───────
  const deleteBook = (id) =>
    setBooks((prev) => prev.filter((b) => b.id !== id));

  const addBook = () => {
    if (!newTitle.trim() || !newAuthor.trim()) {
      Alert.alert('Помилка', 'Заповніть назву та автора');
      return;
    }
    const book = {
      id: `book_${Date.now()}`,
      title: newTitle.trim(),
      author: newAuthor.trim(),
      genre: newGenre.trim() || 'Інше',
      description: 'Опис відсутній.',
      year: Math.round(newYear),
      rating: 5.0,
      cover: `https://picsum.photos/150/200?random=${Date.now() % 100}`,
    };
    setBooks((prev) => [book, ...prev]);
    setNewTitle('');
    setNewAuthor('');
    setNewGenre('');
    setNewYear(2020);
    setShowAddModal(false);
  };

  const displayedBooks = sortAlpha
    ? [...books].sort((a, b) => a.title.localeCompare(b.title, 'uk'))
    : books;

  const TAB_LABELS = { catalog: '📚 Каталог', settings: '⚙️ Налаштування', add: '➕ Додати' };

  // ─────── РЕНДЕР ───────
  return (
    <SafeAreaView style={[styles.container, isDarkMode ? styles.bgDark : styles.bgLight]}>

      {/* ═══ ПУНКТ 5: Хедер з кнопкою спадного меню ═══ */}
      <View style={[styles.header, isDarkMode ? styles.headerDark : styles.headerLight]}>
        <Text style={[styles.headerTitle, isDarkMode && styles.textWhite]}>
          {TAB_LABELS[activeTab]}
        </Text>
        <TouchableOpacity style={styles.menuBtn} onPress={() => setShowMenuModal(true)}>
          <Text style={styles.menuBtnText}>☰ Меню</Text>
        </TouchableOpacity>
      </View>

      {/* ═══ ПУНКТ 5: Модальне спадне меню навігації ═══ */}
      <Modal visible={showMenuModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setShowMenuModal(false)}
        >
          <View style={[styles.menuDropdown, isDarkMode ? styles.cardDark : styles.cardLight]}>
            {Object.entries(TAB_LABELS).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[styles.menuItem, activeTab === key && styles.menuItemActive]}
                onPress={() => {
                  setActiveTab(key);
                  setShowMenuModal(false);
                }}
              >
                <Text style={[styles.menuItemText, isDarkMode && styles.textWhite,
                  activeTab === key && styles.menuItemActiveText]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ═══ ОСНОВНИЙ КОНТЕНТ ═══ */}
      {activeTab === 'catalog' && (
        <FlatList
          data={displayedBooks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BookItem
              item={item}
              isDark={isDarkMode}
              onDelete={deleteBook}
              onPress={() => setSelectedBook(item)}
            />
          )}
          contentContainerStyle={styles.listPadding}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, isDarkMode && styles.textWhite]}>
                Каталог порожній. Додайте книги! 📖
              </Text>
            </View>
          }
        />
      )}

      {activeTab === 'settings' && (
        /* ═══ ПУНКТ 4: Розширені налаштування ═══ */
        <ScrollView contentContainerStyle={styles.settingsContainer}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textWhite]}>Вигляд</Text>

          <View style={[styles.settingRow, isDarkMode ? styles.cardDark : styles.cardLight]}>
            <Text style={[styles.label, isDarkMode && styles.textWhite]}>🌙 Темний режим</Text>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#ccc', true: '#3F51B5' }}
              thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={[styles.settingRow, isDarkMode ? styles.cardDark : styles.cardLight]}>
            <Text style={[styles.label, isDarkMode && styles.textWhite]}>🖼 Показувати обкладинки</Text>
            <Switch
              value={showCovers}
              onValueChange={setShowCovers}
              trackColor={{ false: '#ccc', true: '#3F51B5' }}
              thumbColor={showCovers ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={[styles.settingRow, isDarkMode ? styles.cardDark : styles.cardLight]}>
            <Text style={[styles.label, isDarkMode && styles.textWhite]}>🔤 Сортувати А–Я</Text>
            <Switch
              value={sortAlpha}
              onValueChange={setSortAlpha}
              trackColor={{ false: '#ccc', true: '#3F51B5' }}
              thumbColor={sortAlpha ? '#fff' : '#f4f3f4'}
            />
          </View>

          <Text style={[styles.sectionTitle, isDarkMode && styles.textWhite, { marginTop: 24 }]}>
            Шрифт ({Math.round(fontSize)} px)
          </Text>
          <View style={[styles.sliderRow, isDarkMode ? styles.cardDark : styles.cardLight]}>
            <Text style={{ fontSize: 12, color: '#888' }}>12</Text>
            <Slider
              style={styles.slider}
              minimumValue={12}
              maximumValue={24}
              step={1}
              value={fontSize}
              onValueChange={setFontSize}
              minimumTrackTintColor="#3F51B5"
              maximumTrackTintColor="#ccc"
              thumbTintColor="#3F51B5"
            />
            <Text style={{ fontSize: 12, color: '#888' }}>24</Text>
          </View>
          <Text style={[{ fontSize, textAlign: 'center', marginTop: 8 }, isDarkMode && styles.textWhite]}>
            Зразок тексту
          </Text>

          <Text style={[styles.sectionTitle, isDarkMode && styles.textWhite, { marginTop: 24 }]}>
            Мова інтерфейсу
          </Text>
          <View style={styles.langRow}>
            {['UA', 'EN', 'PL'].map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.langBtn, language === lang && styles.langBtnActive]}
                onPress={() => setLanguage(lang)}
              >
                <Text style={[styles.langText, language === lang && styles.langTextActive]}>
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.settingRow, isDarkMode ? styles.cardDark : styles.cardLight, { marginTop: 24 }]}>
            <Text style={[styles.label, { color: '#E53935' }]}>🗑 Очистити каталог</Text>
            <TouchableOpacity
              style={styles.dangerBtn}
              onPress={() =>
                Alert.alert('Очистити?', 'Всі книги буде видалено.', [
                  { text: 'Скасувати', style: 'cancel' },
                  { text: 'Очистити', style: 'destructive', onPress: () => setBooks([]) },
                ])
              }
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Очистити</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {activeTab === 'add' && (
        /* ═══ ПУНКТ 2: Третій екран — додавання книги ═══ */
        <ScrollView contentContainerStyle={styles.settingsContainer}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textWhite]}>Нова книга</Text>

          <Text style={[styles.inputLabel, isDarkMode && styles.textWhite]}>Назва *</Text>
          <TextInput
            style={[styles.input, isDarkMode && styles.inputDark]}
            value={newTitle}
            onChangeText={setNewTitle}
            placeholder="Введіть назву книги"
            placeholderTextColor="#999"
          />

          <Text style={[styles.inputLabel, isDarkMode && styles.textWhite]}>Автор *</Text>
          <TextInput
            style={[styles.input, isDarkMode && styles.inputDark]}
            value={newAuthor}
            onChangeText={setNewAuthor}
            placeholder="Введіть автора"
            placeholderTextColor="#999"
          />

          <Text style={[styles.inputLabel, isDarkMode && styles.textWhite]}>Жанр</Text>
          <TextInput
            style={[styles.input, isDarkMode && styles.inputDark]}
            value={newGenre}
            onChangeText={setNewGenre}
            placeholder="Наприклад: Роман"
            placeholderTextColor="#999"
          />

          <Text style={[styles.inputLabel, isDarkMode && styles.textWhite]}>
            Рік видання: {Math.round(newYear)}
          </Text>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={1800}
            maximumValue={2024}
            step={1}
            value={newYear}
            onValueChange={setNewYear}
            minimumTrackTintColor="#3F51B5"
            maximumTrackTintColor="#ccc"
            thumbTintColor="#3F51B5"
          />

          <TouchableOpacity style={styles.addBtn} onPress={addBook}>
            <Text style={styles.addBtnText}>➕ Додати книгу</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ═══ ПУНКТ 6: Модальне вікно деталей книги ═══ */}
      <Modal
        visible={!!selectedBook}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedBook(null)}
      >
        <View style={styles.detailOverlay}>
          <View style={[styles.detailModal, isDarkMode ? styles.cardDark : styles.cardLight]}>
            {selectedBook && (
              <>
                <View style={styles.detailHeader}>
                  <Image source={{ uri: selectedBook.cover }} style={styles.detailCover} />
                  <View style={{ flex: 1, paddingLeft: 16 }}>
                    <Text style={[styles.detailTitle, isDarkMode && styles.textWhite]}>
                      {selectedBook.title}
                    </Text>
                    <Text style={styles.detailAuthor}>{selectedBook.author}</Text>
                    <View style={styles.genreBadge}>
                      <Text style={styles.genreText}>{selectedBook.genre}</Text>
                    </View>
                    <Text style={[{ marginTop: 8, color: '#888' }]}>
                      📅 {selectedBook.year} р.
                    </Text>
                    <Text style={[{ color: '#F4A836' }]}>
                      ⭐ {selectedBook.rating} / 5.0
                    </Text>
                  </View>
                </View>
                <Text style={[styles.sectionTitle, isDarkMode && styles.textWhite, { marginTop: 16 }]}>
                  Опис
                </Text>
                <Text style={[styles.detailDesc, isDarkMode && { color: '#ccc' }]}>
                  {selectedBook.description}
                </Text>
                <TouchableOpacity
                  style={[styles.addBtn, { marginTop: 24 }]}
                  onPress={() => setSelectedBook(null)}
                >
                  <Text style={styles.addBtnText}>Закрити</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// СТИЛІ
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  bgLight: { backgroundColor: '#F0F2F5' },
  bgDark: { backgroundColor: '#0D0D0D' },
  textWhite: { color: '#FFFFFF' },

  // Хедер
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerLight: { backgroundColor: '#3F51B5' },
  headerDark: { backgroundColor: '#1A1A2E' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  menuBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  menuBtnText: { color: '#fff', fontWeight: '600' },

  // Спадне меню навігації
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 80,
    paddingRight: 16,
  },
  menuDropdown: {
    width: 200,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
  },
  menuItem: { paddingVertical: 16, paddingHorizontal: 20 },
  menuItemActive: { backgroundColor: '#3F51B5' },
  menuItemText: { fontSize: 16 },
  menuItemActiveText: { color: '#fff', fontWeight: 'bold' },

  // Каталог
  listPadding: { padding: 12 },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#888', textAlign: 'center' },

  // Картка книги
  card: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 10,
    borderRadius: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardLight: { backgroundColor: '#FFFFFF' },
  cardDark: { backgroundColor: '#1C1C1E' },
  coverImage: { width: 65, height: 95, borderRadius: 8 },
  bookInfo: { marginLeft: 12, justifyContent: 'center', flex: 1 },
  bookTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#1A1A2E' },
  bookAuthor: { fontSize: 13, color: '#666' },
  genreBadge: {
    marginTop: 6,
    backgroundColor: '#E8EAF6',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  genreText: { fontSize: 11, color: '#3F51B5', fontWeight: '600' },

  // Кнопка видалення
  deleteBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginLeft: 8,
  },
  deleteBtnText: { color: '#E53935', fontSize: 14, fontWeight: 'bold' },

  // Налаштування
  settingsContainer: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 12 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  label: { fontSize: 16, color: '#1A1A2E', flex: 1 },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  slider: { flex: 1, marginHorizontal: 10 },
  langRow: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  langBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3F51B5',
    alignItems: 'center',
  },
  langBtnActive: { backgroundColor: '#3F51B5' },
  langText: { fontSize: 16, fontWeight: 'bold', color: '#3F51B5' },
  langTextActive: { color: '#fff' },
  dangerBtn: {
    backgroundColor: '#E53935',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  // Форма додавання
  inputLabel: { fontSize: 14, color: '#444', marginBottom: 4, marginTop: 12 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#1A1A2E',
  },
  inputDark: { backgroundColor: '#1C1C1E', borderColor: '#333', color: '#fff' },
  addBtn: {
    backgroundColor: '#3F51B5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  addBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  // Модальне вікно деталей
  detailOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  detailModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  detailHeader: { flexDirection: 'row' },
  detailCover: { width: 100, height: 145, borderRadius: 10 },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  detailAuthor: { fontSize: 14, color: '#666', marginBottom: 4 },
  detailDesc: { fontSize: 15, lineHeight: 22, color: '#444' },
});