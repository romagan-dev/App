import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Alert, Switch,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useBooks } from '../context/BooksContext';
import { useTheme } from '../context/ThemeContext';

const GENRES = ['Роман', 'Поезія', 'Повість', 'Оповідання', 'Проза', 'Нон-фікшн', 'Інше'];

export default function AddBookScreen({ navigation }) {
  const { addBook } = useBooks();
  const { theme } = useTheme();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState(2020);
  const [rating, setRating] = useState(4);
  const [genre, setGenre] = useState('Роман');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Назва обов'язкова";
    if (!author.trim()) e.author = "Автор обов'язковий";
    return e;
  };

  const handleAdd = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    addBook({
      title: title.trim(),
      author: author.trim(),
      description: description.trim() || 'Опис відсутній.',
      year: Math.round(year),
      rating: Math.round(rating * 10) / 10,
      genre,
      cover: `https://picsum.photos/150/200?random=${Date.now() % 200}`,
    });

    Alert.alert('✅ Додано!', `"${title}" успішно додано до каталогу.`, [
      { text: 'OK', onPress: () => navigation.navigate('Catalog') },
    ]);
  };

  const Field = ({ label, error, children }) => (
    <View style={styles.fieldWrap}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      {children}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );

  const inputStyle = [styles.input, {
    backgroundColor: theme.input,
    borderColor: theme.inputBorder,
    color: theme.text,
  }];

  return (
    <ScrollView
      style={{ backgroundColor: theme.bg }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Field label="Назва книги *" error={errors.title}>
        <TextInput
          style={[inputStyle, errors.title && styles.inputError]}
          value={title}
          onChangeText={(t) => { setTitle(t); setErrors((e) => ({ ...e, title: '' })); }}
          placeholder="Наприклад: Кобзар"
          placeholderTextColor={theme.subtext}
        />
      </Field>

      <Field label="Автор *" error={errors.author}>
        <TextInput
          style={[inputStyle, errors.author && styles.inputError]}
          value={author}
          onChangeText={(t) => { setAuthor(t); setErrors((e) => ({ ...e, author: '' })); }}
          placeholder="Наприклад: Тарас Шевченко"
          placeholderTextColor={theme.subtext}
        />
      </Field>

      <Field label="Короткий опис">
        <TextInput
          style={[inputStyle, { height: 90, textAlignVertical: 'top' }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Декілька речень про книгу..."
          placeholderTextColor={theme.subtext}
          multiline
          numberOfLines={3}
        />
      </Field>

      {/* Жанр — кнопки вибору */}
      <View style={styles.fieldWrap}>
        <Text style={[styles.label, { color: theme.text }]}>Жанр</Text>
        <View style={styles.genreRow}>
          {GENRES.map((g) => (
            <TouchableOpacity
              key={g}
              style={[
                styles.genreChip,
                { borderColor: theme.primary },
                genre === g && { backgroundColor: theme.primary },
              ]}
              onPress={() => setGenre(g)}
            >
              <Text style={[
                styles.genreChipText,
                { color: genre === g ? '#fff' : theme.primary },
              ]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Рік — Slider */}
      <View style={styles.fieldWrap}>
        <Text style={[styles.label, { color: theme.text }]}>
          Рік видання: <Text style={{ color: theme.primary, fontWeight: '700' }}>{Math.round(year)}</Text>
        </Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={1800}
          maximumValue={2024}
          step={1}
          value={year}
          onValueChange={setYear}
          minimumTrackTintColor={theme.primary}
          maximumTrackTintColor={theme.border}
          thumbTintColor={theme.primary}
        />
        <View style={styles.sliderLabels}>
          <Text style={{ color: theme.subtext, fontSize: 11 }}>1800</Text>
          <Text style={{ color: theme.subtext, fontSize: 11 }}>2024</Text>
        </View>
      </View>

      {/* Рейтинг — Slider */}
      <View style={styles.fieldWrap}>
        <Text style={[styles.label, { color: theme.text }]}>
          Рейтинг: <Text style={{ color: theme.primary, fontWeight: '700' }}>
            {'⭐'.repeat(Math.round(rating))} ({Math.round(rating * 10) / 10})
          </Text>
        </Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={1}
          maximumValue={5}
          step={0.5}
          value={rating}
          onValueChange={setRating}
          minimumTrackTintColor="#F4A836"
          maximumTrackTintColor={theme.border}
          thumbTintColor="#F4A836"
        />
      </View>

      {/* Кнопка */}
      <TouchableOpacity style={[styles.submitBtn, { backgroundColor: theme.primary }]} onPress={handleAdd}>
        <Text style={styles.submitText}>➕ Додати до каталогу</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 4, paddingBottom: 40 },
  fieldWrap: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: {
    borderRadius: 12, borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 15,
  },
  inputError: { borderColor: '#E53935' },
  errorText: { color: '#E53935', fontSize: 12, marginTop: 4 },
  genreRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  genreChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1.5,
  },
  genreChipText: { fontSize: 13, fontWeight: '600' },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -4 },
  submitBtn: {
    borderRadius: 16, paddingVertical: 17,
    alignItems: 'center', marginTop: 8,
  },
  submitText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});