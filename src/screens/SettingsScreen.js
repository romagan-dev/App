import React from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { useAuthStore }     from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useBooksStore }    from '../store/useBooksStore';

export default function SettingsScreen() {
  const { user, logout }       = useAuthStore();
  const { books, clearBooks, sessionOnly: booksSession, toggleSessionOnly: toggleBooksSession } = useBooksStore();
  const {
    isDark, toggleDark,
    language, setLanguage,
    fontSize, setFontSize,
    showCovers, toggleCovers,
    sortAlpha, toggleSort,
    sessionOnly: settingsSession,
    toggleSessionOnly: toggleSettingsSession,
    reset,
  } = useSettingsStore();

  const theme = {
    bg: isDark ? '#0D0D0D' : '#F0F2F5',
    card: isDark ? '#1C1C1E' : '#FFFFFF',
    text: isDark ? '#FFF' : '#1A1A2E',
    subtext: isDark ? '#AAA' : '#666',
    border: isDark ? '#333' : '#E0E0E0',
    primary: '#3F51B5',
  };

  const cardStyle = [styles.card, { backgroundColor: theme.card, borderColor: theme.border }];

  const Row = ({ label, sublabel, right }) => (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
        {sublabel ? <Text style={[styles.rowSub, { color: theme.subtext }]}>{sublabel}</Text> : null}
      </View>
      {right}
    </View>
  );

  return (
    <ScrollView style={{ backgroundColor: theme.bg }} contentContainerStyle={styles.container}>

      {/* Профіль */}
      <View style={[cardStyle, styles.profileCard]}>
        <View style={[styles.avatar, { backgroundColor: user?.avatarColor ?? '#3F51B5' }]}>
          <Text style={styles.avatarText}>{user?.avatar ?? '??'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.profileName, { color: theme.text }]}>{user?.name}</Text>
          <Text style={[styles.profileSub, { color: theme.subtext }]}>{user?.role} · {user?.email}</Text>
        </View>
      </View>

      {/* Статистика */}
      <View style={styles.statsRow}>
        {[
          { num: books.length, label: 'Книг' },
          { num: user?.role ?? '—', label: 'Роль' },
          { num: `${Math.round(fontSize)}px`, label: 'Шрифт' },
        ].map(s => (
          <View key={s.label} style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statNum, { color: theme.primary }]}>{s.num}</Text>
            <Text style={[styles.statLabel, { color: theme.subtext }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Вигляд */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Вигляд</Text>
      <View style={cardStyle}>
        <Row label="🌙 Темний режим"
          right={<Switch value={isDark} onValueChange={toggleDark}
            trackColor={{ false: '#ccc', true: theme.primary }} thumbColor="#fff" />} />
        <View style={[styles.divider, { borderColor: theme.border }]} />
        <Row label="🖼 Показувати обкладинки"
          right={<Switch value={showCovers} onValueChange={toggleCovers}
            trackColor={{ false: '#ccc', true: theme.primary }} thumbColor="#fff" />} />
        <View style={[styles.divider, { borderColor: theme.border }]} />
        <Row label="🔤 Сортувати А–Я"
          right={<Switch value={sortAlpha} onValueChange={toggleSort}
            trackColor={{ false: '#ccc', true: theme.primary }} thumbColor="#fff" />} />
      </View>

      {/* Мова */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Мова інтерфейсу</Text>
      <View style={styles.langRow}>
        {['UA', 'EN', 'PL'].map(l => (
          <TouchableOpacity key={l}
            style={[styles.langBtn, { borderColor: theme.primary }, language === l && { backgroundColor: theme.primary }]}
            onPress={() => setLanguage(l)}>
            <Text style={[styles.langText, { color: language === l ? '#fff' : theme.primary }]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Шрифт */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Розмір шрифту: <Text style={{ color: theme.primary }}>{Math.round(fontSize)}px</Text>
      </Text>
      <View style={cardStyle}>
        <Text style={[{ fontSize: Math.round(fontSize), color: theme.text, textAlign: 'center', paddingVertical: 10 }]}>
          Зразок тексту
        </Text>
        <Slider style={{ width: '100%' }} minimumValue={12} maximumValue={24} step={1}
          value={fontSize} onValueChange={setFontSize}
          minimumTrackTintColor={theme.primary} maximumTrackTintColor={theme.border} thumbTintColor={theme.primary} />
      </View>

      {/* Пункт 4: Сесійний режим */}
      <Text style={[styles.sectionTitle, { color: '#FF6B35' }]}>⚡ Режим "лише сесія"</Text>
      <View style={cardStyle}>
        <Row
          label="📚 Книги — тільки сесія"
          sublabel={booksSession ? 'Зміни НЕ зберігаються на пристрій' : 'Зміни зберігаються в AsyncStorage'}
          right={<Switch value={booksSession} onValueChange={toggleBooksSession}
            trackColor={{ false: '#ccc', true: '#FF6B35' }} thumbColor="#fff" />}
        />
        <View style={[styles.divider, { borderColor: theme.border }]} />
        <Row
          label="⚙️ Налаштування — тільки сесія"
          sublabel={settingsSession ? 'Налаштування НЕ зберігаються' : 'Налаштування зберігаються'}
          right={<Switch value={settingsSession} onValueChange={toggleSettingsSession}
            trackColor={{ false: '#ccc', true: '#FF6B35' }} thumbColor="#fff" />}
        />
      </View>

      {/* Небезпечна зона */}
      <Text style={[styles.sectionTitle, { color: '#E53935' }]}>Небезпечна зона</Text>
      <View style={cardStyle}>
        <TouchableOpacity style={styles.dangerRow} onPress={() =>
          Alert.alert('Очистити каталог?', 'Всі книги буде видалено.', [
            { text: 'Скасувати', style: 'cancel' },
            { text: 'Очистити', style: 'destructive', onPress: clearBooks },
          ])}>
          <Text style={styles.dangerText}>🗑 Очистити каталог</Text>
          <Text style={{ color: '#E53935', fontSize: 22 }}>›</Text>
        </TouchableOpacity>
        <View style={[styles.divider, { borderColor: theme.border }]} />
        <TouchableOpacity style={styles.dangerRow} onPress={() =>
          Alert.alert('Скинути налаштування?', '', [
            { text: 'Скасувати', style: 'cancel' },
            { text: 'Скинути', style: 'destructive', onPress: reset },
          ])}>
          <Text style={styles.dangerText}>🔄 Скинути налаштування</Text>
          <Text style={{ color: '#E53935', fontSize: 22 }}>›</Text>
        </TouchableOpacity>
        <View style={[styles.divider, { borderColor: theme.border }]} />
        <TouchableOpacity style={styles.dangerRow} onPress={() =>
          Alert.alert('Вийти?', `Вихід із акаунту "${user?.name}"`, [
            { text: 'Скасувати', style: 'cancel' },
            { text: 'Вийти', style: 'destructive', onPress: logout },
          ])}>
          <Text style={styles.dangerText}>🚪 Вийти з акаунту</Text>
          <Text style={{ color: '#E53935', fontSize: 22 }}>›</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.footer, { color: theme.subtext }]}>
        BookApp v5.0 · {user?.username} · Context + AsyncStorage
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', marginTop: 16, marginBottom: 8, letterSpacing: 0.5 },
  card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 4 },
  profileCard: { flexDirection: 'row', padding: 18, alignItems: 'center', gap: 14 },
  avatar: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  profileName: { fontSize: 17, fontWeight: '800' },
  profileSub: { fontSize: 12, marginTop: 3 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  statBox: { flex: 1, borderRadius: 14, borderWidth: 1, padding: 12, alignItems: 'center', gap: 3 },
  statNum: { fontSize: 16, fontWeight: '800' },
  statLabel: { fontSize: 11 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  rowLabel: { fontSize: 15 },
  rowSub: { fontSize: 11, marginTop: 2 },
  divider: { borderTopWidth: 1, marginHorizontal: 14 },
  langRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  langBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, alignItems: 'center' },
  langText: { fontSize: 14, fontWeight: '700' },
  dangerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  dangerText: { color: '#E53935', fontSize: 15, fontWeight: '600' },
  footer: { textAlign: 'center', fontSize: 11, marginTop: 24 },
});