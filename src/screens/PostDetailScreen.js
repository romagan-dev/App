import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, Image, Platform,
} from 'react-native';
import * as Calendar from 'expo-calendar';
import * as ImagePicker from 'expo-image-picker';
import { usePostDetail } from '../hooks/UsePosts';
import { useSettingsStore } from '../store/useSettingsStore';
// ─── Пункт 5 + 6: детальний екран поста з нативними можливостями ───
export default function PostDetailScreen({ route }) {
  const { postId } = route.params;
const isDark = useSettingsStore(s => s.isDark);
const theme = {
  bg: isDark ? '#0D0D0D' : '#F0F2F5',
  card: isDark ? '#1C1C1E' : '#FFFFFF',
  text: isDark ? '#FFF' : '#1A1A2E',
  subtext: isDark ? '#AAA' : '#666',
  border: isDark ? '#333' : '#E0E0E0',
  primary: '#3F51B5',
};  const { data, isLoading, isError } = usePostDetail(postId);

  const [calendarSaved, setCalendarSaved] = useState(false);
  const [eventId, setEventId]             = useState(null);
  const [image, setImage]                 = useState(null);
  const [calLoading, setCalLoading]       = useState(false);

  // ─── Нативна можливість 1: Календар (пункт 6a) ───
  const getDefaultCalendar = async () => {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    return (
      calendars.find(c => c.allowsModifications && c.source?.isLocalAccount) ||
      calendars.find(c => c.allowsModifications) ||
      calendars[0]
    );
  };

  const handleCalendar = async () => {
    if (!data?.post) return;
    setCalLoading(true);
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Немає дозволу', 'Дозвольте доступ до календаря в налаштуваннях.');
        setCalLoading(false);
        return;
      }

      if (calendarSaved && eventId) {
        // Видалити подію
        await Calendar.deleteEventAsync(eventId);
        setCalendarSaved(false);
        setEventId(null);
        Alert.alert('🗑 Видалено', 'Нагадування видалено з календаря.');
      } else {
        // Додати подію
        const cal = await getDefaultCalendar();
        if (!cal) { Alert.alert('Помилка', 'Не знайдено доступного календаря.'); setCalLoading(false); return; }

        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 1);
        startDate.setHours(18, 0, 0, 0);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

        const newEventId = await Calendar.createEventAsync(cal.id, {
          title:    `📖 Прочитати: ${data.post.title}`,
          notes:    data.post.body,
          startDate,
          endDate,
          alarms:   [{ relativeOffset: -30 }],
          timeZone: 'Europe/Kiev',
        });
        setEventId(newEventId);
        setCalendarSaved(true);
        Alert.alert('✅ Збережено', 'Нагадування додано до календаря на завтра о 18:00.');
      }
    } catch (e) {
      Alert.alert('Помилка', e.message);
    }
    setCalLoading(false);
  };

  // ─── Нативна можливість 2: Галерея (пункт 6b) ───
  const handleImage = async () => {
    if (image) {
      // Відкріпити
      setImage(null);
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Немає дозволу', 'Дозвольте доступ до фото в налаштуваннях.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Немає дозволу', 'Дозвольте доступ до камери в налаштуваннях.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  if (isLoading) return (
    <View style={[styles.center, { backgroundColor: theme.bg }]}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );

  if (isError || !data) return (
    <View style={[styles.center, { backgroundColor: theme.bg }]}>
      <Text style={{ color: theme.text }}>Помилка завантаження</Text>
    </View>
  );

  const { post, comments } = data;

  return (
    <ScrollView style={{ backgroundColor: theme.bg }} contentContainerStyle={styles.container}>

      {/* Пост */}
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={[styles.idBadge, { backgroundColor: theme.primary + '22' }]}>
          <Text style={[styles.idText, { color: theme.primary }]}>Пост #{post.id}</Text>
        </View>
        <Text style={[styles.postTitle, { color: theme.text }]}>{post.title}</Text>
        <Text style={[styles.postBody, { color: theme.subtext }]}>{post.body}</Text>
      </View>

      {/* Прикріплене фото */}
      {image && (
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>📎 Прикріплене фото</Text>
          <Image source={{ uri: image }} style={styles.attachedImage} resizeMode="cover" />
        </View>
      )}

      {/* ─── Нативні кнопки (пункт 6) ─── */}
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>🛠 Нативні можливості</Text>

        {/* Календар */}
        <TouchableOpacity
          style={[styles.nativeBtn, {
            backgroundColor: calendarSaved ? '#E8F5E9' : theme.primary,
            borderColor: calendarSaved ? '#4CAF50' : theme.primary,
          }]}
          onPress={handleCalendar}
          disabled={calLoading}
        >
          {calLoading
            ? <ActivityIndicator color={calendarSaved ? '#4CAF50' : '#fff'} />
            : <Text style={[styles.nativeBtnText, { color: calendarSaved ? '#4CAF50' : '#fff' }]}>
                {calendarSaved ? '🗓 Видалити нагадування' : '🗓 Додати до календаря'}
              </Text>
          }
        </TouchableOpacity>

        {/* Галерея */}
        <TouchableOpacity
          style={[styles.nativeBtn, {
            backgroundColor: image ? '#FFF3E0' : '#FF6B35',
            borderColor: image ? '#FF6B35' : '#FF6B35',
            marginTop: 10,
          }]}
          onPress={handleImage}
        >
          <Text style={[styles.nativeBtnText, { color: image ? '#FF6B35' : '#fff' }]}>
            {image ? '🖼 Відкріпити фото' : '🖼 Прикріпити з галереї'}
          </Text>
        </TouchableOpacity>

        {/* Камера */}
        <TouchableOpacity
          style={[styles.nativeBtn, {
            backgroundColor: '#7B1FA2',
            marginTop: 10,
          }]}
          onPress={handleCamera}
        >
          <Text style={[styles.nativeBtnText, { color: '#fff' }]}>
            📷 Зняти фото камерою
          </Text>
        </TouchableOpacity>
      </View>

      {/* Коментарі */}
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          💬 Коментарі ({comments.length})
        </Text>
        {comments.map(c => (
          <View key={c.id} style={[styles.comment, { borderTopColor: theme.border }]}>
            <Text style={[styles.commentName, { color: theme.primary }]}>
              {c.name}
            </Text>
            <Text style={[styles.commentEmail, { color: theme.subtext }]}>
              ✉️ {c.email}
            </Text>
            <Text style={[styles.commentBody, { color: theme.text }]}>
              {c.body}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 14, gap: 14, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  section: { borderRadius: 16, borderWidth: 1, padding: 18, gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  idBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  idText: { fontSize: 12, fontWeight: '700' },
  postTitle: { fontSize: 18, fontWeight: '800', lineHeight: 26 },
  postBody: { fontSize: 14, lineHeight: 22 },
  attachedImage: { width: '100%', height: 180, borderRadius: 12, marginTop: 6 },
  nativeBtn: {
    borderRadius: 14, paddingVertical: 15,
    alignItems: 'center', borderWidth: 1.5,
  },
  nativeBtnText: { fontSize: 15, fontWeight: '700' },
  comment: { borderTopWidth: 1, paddingTop: 12, gap: 4 },
  commentName: { fontSize: 13, fontWeight: '700' },
  commentEmail: { fontSize: 11 },
  commentBody: { fontSize: 13, lineHeight: 19 },
});