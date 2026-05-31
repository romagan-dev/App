import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image,
  StyleSheet, Alert, TextInput, Animated, Modal,
} from 'react-native';
import { useBooksStore }    from '../store/useBooksStore';
import { useSettingsStore } from '../store/useSettingsStore';

// ─── Пункт 2a+2b: Анімована картка ───
const BookItem = ({ item, onDelete, onPress, theme, index }) => {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 450, delay: index * 70, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 450, delay: index * 70, useNativeDriver: true }),
    ]).start();
  }, []);

  const pressIn  = () => Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  const pressOut = () => Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true }).start();

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} activeOpacity={1}
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
          ])}>
          <Text style={styles.delText}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Пункт 3: Анімоване модальне вікно ───
const BookModal = ({ book, visible, onClose, theme }) => {
  const slideAnim   = useRef(new Animated.Value(600)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim,   { toValue: 0,   tension: 65, friction: 11, useNativeDriver: true }),
        Animated.timing(overlayAnim, { toValue: 1,   duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim,   { toValue: 600, duration: 300, useNativeDriver: true }),
        Animated.timing(overlayAnim, { toValue: 0,   duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!book) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.modalOverlay, { opacity: overlayAnim }]}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} activeOpacity={1} />
        <Animated.View style={[
          styles.modalSheet,
          { backgroundColor: theme.card, transform: [{ translateY: slideAnim }] }
        ]}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Image source={{ uri: book.cover }} style={styles.modalCover} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>{book.title}</Text>
              <Text style={[styles.modalAuthor, { color: theme.subtext }]}>{book.author}</Text>
              <View style={[styles.badge, { backgroundColor: theme.primary + '22', marginTop: 8 }]}>
                <Text style={[styles.badgeText, { color: theme.primary }]}>{book.genre}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.modalStats, { borderColor: theme.border }]}>
            {[{ l: 'Рік', v: book.year }, { l: 'Рейтинг', v: `⭐ ${book.rating}` }].map(s => (
              <View key={s.l} style={styles.modalStat}>
                <Text style={[styles.modalStatVal, { color: theme.primary }]}>{s.v}</Text>
                <Text style={[styles.modalStatLabel, { color: theme.subtext }]}>{s.l}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.modalDesc, { color: theme.subtext }]}>{book.description}</Text>
          <TouchableOpacity style={[styles.modalBtn, { backgroundColor: theme.primary }]} onPress={onClose}>
            <Text style={styles.modalBtnText}>Закрити</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default function CatalogScreen({ navigation }) {
  const { books, deleteBook, sessionOnly } = useBooksStore();
  const { isDark, sortAlpha } = useSettingsStore();
  const [search, setSearch]       = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const searchAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(searchAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const theme = {
    bg: isDark ? '#0D0D0D' : '#F0F2F5', card: isDark ? '#1C1C1E' : '#FFFFFF',
    text: isDark ? '#FFF' : '#1A1A2E', subtext: isDark ? '#AAA' : '#666',
    border: isDark ? '#333' : '#E0E0E0', primary: '#3F51B5',
  };

  const filtered = books
    .filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortAlpha ? a.title.localeCompare(b.title, 'uk') : 0);

  const openModal = (book) => { setSelectedBook(book); setModalVisible(true); };
  const closeModal = () => setModalVisible(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {sessionOnly && (
        <View style={styles.sessionBanner}>
          <Text style={styles.sessionText}>⚡ Режим сесії — зміни не зберігаються</Text>
        </View>
      )}

      <Animated.View style={{
        opacity: searchAnim,
        transform: [{ translateY: searchAnim.interpolate({ inputRange: [0,1], outputRange: [-20, 0] }) }],
      }}>
        <View style={[styles.searchWrap, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Пошук..." placeholderTextColor={theme.subtext}
            value={search} onChangeText={setSearch}
          />
          {search ? <TouchableOpacity onPress={() => setSearch('')}><Text style={{ color: theme.subtext, fontSize: 18 }}>✕</Text></TouchableOpacity> : null}
        </View>
      </Animated.View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={({ item, index }) => (
          <BookItem item={item} theme={theme} index={index}
            onDelete={deleteBook}
            onPress={() => openModal(item)}
          />
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

      {/* Пункт 3: Анімоване модальне вікно */}
      <BookModal
        book={selectedBook}
        visible={modalVisible}
        onClose={closeModal}
        theme={theme}
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

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  modalHandle: { width: 40, height: 4, backgroundColor: '#ccc', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalHeader: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  modalCover: { width: 90, height: 130, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: '800', lineHeight: 24 },
  modalAuthor: { fontSize: 14, marginTop: 4 },
  modalStats: { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, paddingVertical: 14, marginBottom: 16, gap: 20 },
  modalStat: { alignItems: 'center', flex: 1 },
  modalStatVal: { fontSize: 18, fontWeight: '700' },
  modalStatLabel: { fontSize: 12, marginTop: 2 },
  modalDesc: { fontSize: 15, lineHeight: 22, marginBottom: 20 },
  modalBtn: { borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  modalBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});