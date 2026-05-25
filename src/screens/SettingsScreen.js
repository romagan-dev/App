import React, { useState } from 'react';
import {
  View, Text, Switch, TouchableOpacity,
  ScrollView, StyleSheet, Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useBooks } from '../context/BooksContext';

export default function SettingsScreen() {
  // ─── пункт 6: поточний користувач через useContext ───
  const { user, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const { books, clearBooks } = useBooks();

  const [fontSize, setFontSize] = useState(16);
  const [sortAlpha, setSortAlpha] = useState(false);
  const [showCovers, setShowCovers] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Вийти з акаунту?',
      `Вихід із профілю "${user?.name}"`,
      [
        { text: 'Скасувати', style: 'cancel' },
        { text: 'Вийти', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleClear = () => {
    Alert.alert('Очистити каталог?', 'Всі книги буде видалено.', [
      { text: 'Скасувати', style: 'cancel' },
      { text: 'Очистити', style: 'destructive', onPress: clearBooks },
    ]);
  };

  const cardStyle = [styles.card, { backgroundColor: theme.card, borderColor: theme.border }];

  const Row = ({ label, right }) => (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
      {right}
    </View>
  );

  return (
    <ScrollView style={{ backgroundColor: theme.bg }} contentContainerStyle={styles.container}>

      {/* ─── Картка профілю (пункт 6) ─── */}
      <View style={[cardStyle, styles.profileCard]}>
        <View style={[styles.avatar, { backgroundColor: user?.avatarColor ?? theme.primary }]}>
          <Text style={styles.avatarText}>{user?.avatar ?? '??'}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: theme.text }]}>{user?.name}</Text>
          <Text style={[styles.profileRole, { color: theme.subtext }]}>{user?.role}</Text>
          <Text style={[styles.profileEmail, { color: theme.subtext }]}>{user?.email}</Text>
        </View>
      </View>

      {/* ─── Статистика ─── */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statNum, { color: theme.primary }]}>{books.length}</Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>Книг у каталозі</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statNum, { color: theme.primary }]}>
            {user?.id === '1' ? 'Адмін' : 'Читач'}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>Тип акаунту</Text>
        </View>
      </View>

      {/* ─── Вигляд ─── */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Вигляд</Text>
      <View style={cardStyle}>
        <Row
          label="🌙 Темний режим"
          right={
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#ccc', true: theme.primary }}
              thumbColor={isDark ? '#fff' : '#f4f3f4'}
            />
          }
        />
        <View style={[styles.divider, { borderColor: theme.border }]} />
        <Row
          label="🖼 Показувати обкладинки"
          right={
            <Switch
              value={showCovers}
              onValueChange={setShowCovers}
              trackColor={{ false: '#ccc', true: theme.primary }}
              thumbColor={showCovers ? '#fff' : '#f4f3f4'}
            />
          }
        />
        <View style={[styles.divider, { borderColor: theme.border }]} />
        <Row
          label="🔤 Сортувати А–Я"
          right={
            <Switch
              value={sortAlpha}
              onValueChange={setSortAlpha}
              trackColor={{ false: '#ccc', true: theme.primary }}
              thumbColor={sortAlpha ? '#fff' : '#f4f3f4'}
            />
          }
        />
      </View>

      {/* ─── Розмір шрифту ─── */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Розмір шрифту: <Text style={{ color: theme.primary }}>{Math.round(fontSize)}px</Text>
      </Text>
      <View style={cardStyle}>
        <Text style={[{ fontSize, color: theme.text, textAlign: 'center', paddingVertical: 10 }]}>
          Зразок тексту BookApp
        </Text>
        <Slider
          style={{ width: '100%', height: 36 }}
          minimumValue={12}
          maximumValue={24}
          step={1}
          value={fontSize}
          onValueChange={setFontSize}
          minimumTrackTintColor={theme.primary}
          maximumTrackTintColor={theme.border}
          thumbTintColor={theme.primary}
        />
      </View>

      {/* ─── Небезпечна зона ─── */}
      <Text style={[styles.sectionTitle, { color: '#E53935' }]}>Небезпечна зона</Text>
      <View style={cardStyle}>
        <TouchableOpacity style={styles.dangerRow} onPress={handleClear}>
          <Text style={styles.dangerText}>🗑 Очистити весь каталог</Text>
          <Text style={[styles.dangerArrow, { color: '#E53935' }]}>›</Text>
        </TouchableOpacity>
        <View style={[styles.divider, { borderColor: theme.border }]} />
        {/* ─── Вихід (пункт 6) ─── */}
        <TouchableOpacity style={styles.dangerRow} onPress={handleLogout}>
          <Text style={styles.dangerText}>🚪 Вийти з акаунту</Text>
          <Text style={[styles.dangerArrow, { color: '#E53935' }]}>›</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.footer, { color: theme.subtext }]}>
        BookApp v3.0  ·  Авторизовано як {user?.username}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 10, paddingBottom: 40 },
  sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', marginTop: 10, marginBottom: 4, letterSpacing: 0.5 },
  card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },

  // Профіль
  profileCard: { flexDirection: 'row', padding: 18, gap: 16, alignItems: 'center' },
  avatar: { width: 62, height: 62, borderRadius: 31, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  profileInfo: { flex: 1, gap: 3 },
  profileName: { fontSize: 18, fontWeight: '800' },
  profileRole: { fontSize: 13 },
  profileEmail: { fontSize: 12 },

  // Статистика
  statsRow: { flexDirection: 'row', gap: 10 },
  statBox: { flex: 1, borderRadius: 14, borderWidth: 1, padding: 14, alignItems: 'center', gap: 4 },
  statNum: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, textAlign: 'center' },

  // Рядок налаштування
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  rowLabel: { fontSize: 15, flex: 1 },
  divider: { borderTopWidth: 1, marginHorizontal: 16 },

  // Небезпечна зона
  dangerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  dangerText: { color: '#E53935', fontSize: 15, fontWeight: '600' },
  dangerArrow: { fontSize: 22 },

  footer: { textAlign: 'center', fontSize: 12, marginTop: 20 },
});