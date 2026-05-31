import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useBooksStore } from '../store/useBooksStore';

// Конфіг тем — винесений за межі рендеру, щоб не створювати нові об'єкти щоразу
const THEMES = {
  light: {
    bg: '#F0F2F5', card: '#FFFFFF', text: '#1A1A2E', subtext: '#666666', border: '#E0E0E0', primary: '#3F51B5'
  },
  dark: {
    bg: '#0D0D0D', card: '#1C1C1E', text: '#FFFFFF', subtext: '#AAAAAA', border: '#333333', primary: '#3F51B5'
  }
};

// ─── Анімований рядок Switch ───
const AnimatedRow = React.memo(({ label, sublabel, value, onValueChange, trackColor, theme, index }) => {
  const slideAnim = useRef(new Animated.Value(40)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, delay: index * 50, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 300, delay: index * 50, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.timing(bgAnim, { toValue: value ? 1 : 0, duration: 250, useNativeDriver: false }).start();
  }, [value]);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.card, `${trackColor}18`],
  });

  return (
    <Animated.View style={[styles.row, { backgroundColor: bgColor, opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
      <View style={styles.flexShrink}>
        <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
        {sublabel && <Text style={[styles.rowSub, { color: theme.subtext }]}>{sublabel}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#ccc', true: trackColor }}
        thumbColor="#fff"
      />
    </Animated.View>
  );
});

// ─── Статистична картка ───
const StatBox = React.memo(({ num, label, theme, delay }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, delay, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border, transform: [{ scale: scaleAnim }] }]}>
      <Text style={[styles.statNum, { color: theme.primary }]}>{num}</Text>
      <Text style={[styles.statLabel, { color: theme.subtext }]}>{label}</Text>
    </Animated.View>
  );
});

// ─── Кнопка вибору мови ───
const LangBtn = React.memo(({ l, active, onPress, theme }) => {
  const pressAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(pressAnim, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
    onPress(l);
  };

  return (
    <Animated.View style={[styles.flexOne, { transform: [{ scale: pressAnim }] }]}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.langBtn, { borderColor: theme.primary }, active && { backgroundColor: theme.primary }]}
        onPress={handlePress}
      >
        <Text style={[styles.langText, { color: active ? '#fff' : theme.primary }]}>{l}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

// ─── Головний екран ───
export default function SettingsScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const books = useBooksStore((state) => state.books);
  const clearBooks = useBooksStore((state) => state.clearBooks);
  const booksSession = useBooksStore((state) => state.sessionOnly);
  const toggleBooksSession = useBooksStore((state) => state.toggleSessionOnly);

  const settings = useSettingsStore();
  const theme = settings.isDark ? THEMES.dark : THEMES.light;

  const headerScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(headerScale, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }).start();
  }, []);

  const cardStyle = [styles.card, { backgroundColor: theme.card, borderColor: theme.border }];

  return (
    <View style={[styles.flexOne, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Профіль */}
        <Animated.View style={[cardStyle, styles.profileCard, { transform: [{ scale: headerScale }], opacity: headerScale }]}>
          <View style={[styles.avatar, { backgroundColor: user?.avatarColor ?? theme.primary }]}>
            <Text style={styles.avatarText}>{user?.avatar ?? '??'}</Text>
          </View>
          <View style={styles.flexOne}>
            <Text style={[styles.profileName, { color: theme.text }]}>{user?.name}</Text>
            <Text style={[styles.profileSub, { color: theme.subtext }]}>{user?.role} · {user?.email}</Text>
          </View>
        </Animated.View>

        {/* Статистика */}
        <View style={styles.statsRow}>
          <StatBox num={books.length} label="Книг" theme={theme} delay={0} />
          <StatBox num={user?.role ?? '—'} label="Роль" theme={theme} delay={100} />
          <StatBox num={`${Math.round(settings.fontSize)}px`} label="Шрифт" theme={theme} delay={200} />
        </View>

        {/* Вигляд */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Вигляд</Text>
        <View style={cardStyle}>
          <AnimatedRow index={0} label="🌙 Темний режим" value={settings.isDark} onValueChange={settings.toggleDark} trackColor={theme.primary} theme={theme} />
          <View style={[styles.divider, { borderColor: theme.border }]} />
          <AnimatedRow index={1} label="🖼 Показувати обкладинки" value={settings.showCovers} onValueChange={settings.toggleCovers} trackColor={theme.primary} theme={theme} />
          <View style={[styles.divider, { borderColor: theme.border }]} />
          <AnimatedRow index={2} label="🔤 Сортувати А–Я" value={settings.sortAlpha} onValueChange={settings.toggleSort} trackColor={theme.primary} theme={theme} />
        </View>

        {/* Мова */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Мова інтерфейсу</Text>
        <View style={styles.langRow}>
          <LangBtn l="UA" active={settings.language === 'UA'} onPress={settings.setLanguage} theme={theme} />
          <LangBtn l="EN" active={settings.language === 'EN'} onPress={settings.setLanguage} theme={theme} />
          <LangBtn l="PL" active={settings.language === 'PL'} onPress={settings.setLanguage} theme={theme} />
        </View>

        {/* Шрифт */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Розмір шрифту: <Text style={{ color: theme.primary }}>{Math.round(settings.fontSize)}px</Text>
        </Text>
        <View style={cardStyle}>
          <Text style={[styles.previewText, { fontSize: Math.round(settings.fontSize), color: theme.text }]}>
            Зразок тексту BookApp
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={12}
            maximumValue={24}
            step={1}
            value={settings.fontSize}
            onValueChange={settings.setFontSize}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={theme.border}
            thumbTintColor={theme.primary}
          />
        </View>

        {/* Сесійний режим */}
        <Text style={[styles.sectionTitle, { color: '#FF6B35' }]}>⚡ Режим "лише сесія"</Text>
        <View style={cardStyle}>
          <AnimatedRow index={0} label="📚 Книги — тільки сесія" sublabel={booksSession ? 'НЕ зберігається на пристрій' : 'Зберігається в AsyncStorage'} value={booksSession} onValueChange={toggleBooksSession} trackColor="#FF6B35" theme={theme} />
          <View style={[styles.divider, { borderColor: theme.border }]} />
          <AnimatedRow index={1} label="⚙️ Налаштування — тільки сесія" sublabel={settings.sessionOnly ? 'НЕ зберігається' : 'Зберігається'} value={settings.sessionOnly} onValueChange={settings.toggleSessionOnly} trackColor="#FF6B35" theme={theme} />
        </View>

        {/* Небезпечна зона */}
        <Text style={[styles.sectionTitle, { color: '#E53935' }]}>Небезпечна зона</Text>
        <View style={cardStyle}>
          <TouchableOpacity activeOpacity={0.7} style={styles.dangerRow} onPress={() =>
            Alert.alert('Очистити каталог?', 'Цю дію не можна буде скасувати.', [{ text: 'Скасувати', style: 'cancel' }, { text: 'Очистити', style: 'destructive', onPress: clearBooks }])}>
            <Text style={styles.dangerText}>🗑 Очистити каталог</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <View style={[styles.divider, { borderColor: theme.border }]} />
          <TouchableOpacity activeOpacity={0.7} style={styles.dangerRow} onPress={() =>
            Alert.alert('Скинути налаштування?', 'Усі конфіги повернуться до дефолтних.', [{ text: 'Скасувати', style: 'cancel' }, { text: 'Скинути', style: 'destructive', onPress: settings.reset }])}>
            <Text style={styles.dangerText}>🔄 Скинути налаштування</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <View style={[styles.divider, { borderColor: theme.border }]} />
          <TouchableOpacity activeOpacity={0.7} style={styles.dangerRow} onPress={() =>
            Alert.alert('Вийти з акаунту?', `Ви вийдете з профілю "${user?.name}".`, [{ text: 'Скасувати', style: 'cancel' }, { text: 'Вийти', style: 'destructive', onPress: logout }])}>
            <Text style={styles.dangerText}>🚪 Вийти з акаунту</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.footer, { color: theme.subtext }]}>
          BookApp v6.0 · {user?.username ?? 'Гість'} · Optimized
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flexOne: { flex: 1 },
  flexShrink: { flex: 1 },
  container: { padding: 16, paddingBottom: 40 },
  sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', marginTop: 20, marginBottom: 8, letterSpacing: 0.5 },
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
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, justifyContent: 'space-between' },
  rowLabel: { fontSize: 15 },
  rowSub: { fontSize: 11, marginTop: 2 },
  divider: { borderTopWidth: 1, marginHorizontal: 14 },
  langRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  langBtn: { paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, alignItems: 'center' },
  langText: { fontSize: 14, fontWeight: '700' },
  previewText: { textAlign: 'center', paddingVertical: 10 },
  slider: { width: '100%', height: 40 },
  dangerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  dangerText: { color: '#E53935', fontSize: 15, fontWeight: '600' },
  chevron: { color: '#E53935', fontSize: 22, lineHeight: 22 },
  footer: { textAlign: 'center', fontSize: 11, marginTop: 24 },
});