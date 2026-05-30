import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { useBooksStore }    from '../store/useBooksStore';
import { useSettingsStore } from '../store/useSettingsStore';

const GENRES = ['Роман', 'Поезія', 'Повість', 'Оповідання', 'Проза', 'Нон-фікшн', 'Інше'];

export default function AddBookScreen({ navigation }) {
  const { addBook, sessionOnly } = useBooksStore();
  const isDark = useSettingsStore(s => s.isDark);

  const theme = {
    bg: isDark ? '#0D0D0D' : '#F0F2F5', card: isDark ? '#1C1C1E' : '#FFFFFF',
    text: isDark ? '#FFF' : '#1A1A2E', subtext: isDark ? '#AAA' : '#666',
    border: isDark ? '#444' : '#E0E0E0', primary: '#3F51B5',
  };

  const [title, setTitle]       = useState('');
  const [author, setAuthor]     = useState('');
  const [desc, setDesc]         = useState('');
  const [year, setYear]         = useState(2020);
  const [rating, setRating]     = useState(4);
  const [genre, setGenre]       = useState('Роман');
  const [errors, setErrors]     = useState({});

  const handleAdd = async () => {
    const e = {};
    if (!title.trim())  e.title  = "Обов'язкове поле";
    if (!author.trim()) e.author = "Обов'язкове поле";
    if (Object.keys(e).length) { setErrors(e); return; }

    await addBook({
      title: title.trim(), author: author.trim(),
      description: desc.trim() || 'Опис відсутній.',
      year: Math.round(year), rating: Math.round(rating * 10) / 10,
      genre, cover: `https://picsum.photos/150/200?random=${Date.now() % 200}`,
    });

    Alert.alert(
      '✅ Додано!',
      sessionOnly ? `"${title}" додано (тільки сесія — не збережено)` : `"${title}" збережено`,
      [{ text: 'OK', onPress: () => navigation.navigate('Catalog') }]
    );
  };

  const inputStyle = [styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }];

  return (
    <ScrollView style={{ backgroundColor: theme.bg }} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

      {sessionOnly && (
        <View style={styles.sessionBanner}>
          <Text style={styles.sessionText}>⚡ Режим сесії — книга не збережеться після перезапуску</Text>
        </View>
      )}

      {[
        { label: 'Назва *', key: 'title', value: title, set: setTitle, ph: 'Наприклад: Кобзар' },
        { label: 'Автор *', key: 'author', value: author, set: setAuthor, ph: 'Наприклад: Тарас Шевченко' },
      ].map(f => (
        <View key={f.key} style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>{f.label}</Text>
          <TextInput style={[inputStyle, errors[f.key] && { borderColor: '#E53935' }]}
            value={f.value} onChangeText={t => { f.set(t); setErrors(e => ({ ...e, [f.key]: '' })); }}
            placeholder={f.ph} placeholderTextColor={theme.subtext} />
          {errors[f.key] ? <Text style={styles.errText}>{errors[f.key]}</Text> : null}
        </View>
      ))}

      <View style={styles.field}>
        <Text style={[styles.label, { color: theme.text }]}>Опис</Text>
        <TextInput style={[inputStyle, { height: 90, textAlignVertical: 'top' }]}
          value={desc} onChangeText={setDesc} placeholder="Декілька речень про книгу..."
          placeholderTextColor={theme.subtext} multiline numberOfLines={3} />
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: theme.text }]}>Жанр</Text>
        <View style={styles.genreRow}>
          {GENRES.map(g => (
            <TouchableOpacity key={g}
              style={[styles.chip, { borderColor: theme.primary }, genre === g && { backgroundColor: theme.primary }]}
              onPress={() => setGenre(g)}>
              <Text style={[styles.chipText, { color: genre === g ? '#fff' : theme.primary }]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: theme.text }]}>Рік: <Text style={{ color: theme.primary, fontWeight: '700' }}>{Math.round(year)}</Text></Text>
        <Slider style={{ width: '100%', height: 36 }} minimumValue={1800} maximumValue={2024} step={1}
          value={year} onValueChange={setYear} minimumTrackTintColor={theme.primary} maximumTrackTintColor={theme.border} thumbTintColor={theme.primary} />
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: theme.text }]}>Рейтинг: <Text style={{ color: '#F4A836', fontWeight: '700' }}>{'⭐'.repeat(Math.round(rating))} ({Math.round(rating * 10) / 10})</Text></Text>
        <Slider style={{ width: '100%', height: 36 }} minimumValue={1} maximumValue={5} step={0.5}
          value={rating} onValueChange={setRating} minimumTrackTintColor="#F4A836" maximumTrackTintColor={theme.border} thumbTintColor="#F4A836" />
      </View>

      <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.primary }]} onPress={handleAdd}>
        <Text style={styles.addBtnText}>➕ Додати до каталогу</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  sessionBanner: { backgroundColor: '#FF6B35', padding: 10, borderRadius: 10, marginBottom: 14, alignItems: 'center' },
  sessionText: { color: '#fff', fontSize: 12, fontWeight: '700', textAlign: 'center' },
  field: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15 },
  errText: { color: '#E53935', fontSize: 12, marginTop: 4 },
  genreRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5 },
  chipText: { fontSize: 13, fontWeight: '600' },
  addBtn: { borderRadius: 16, paddingVertical: 17, alignItems: 'center', marginTop: 8 },
  addBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});