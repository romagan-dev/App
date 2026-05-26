import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Animated, ScrollView, ActivityIndicator,
} from 'react-native';
import { useAuth, LOCAL_USERS } from '../context/AuthContext';

export default function LoginScreen() {
  const { login, loading, error: authError } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [localError, setLocalError] = useState('');

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    if (authError) { setLocalError(authError); shake(); }
  }, [authError]);

  const shake = () =>
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,   duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6,  duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 55, useNativeDriver: true }),
    ]).start();

  const handleLogin = async () => {
    setLocalError('');
    if (!username.trim() || !password.trim()) {
      setLocalError("Заповніть всі поля");
      shake();
      return;
    }
    await login(username, password);
  };

  // Автозаповнення — просто встановлює стейт
  const fill = (u) => {
    setUsername(u.username);
    setPassword(u.password);
    setLocalError('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Логотип */}
        <Animated.View style={[styles.logoWrap, { opacity: fadeAnim }]}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>📚</Text>
          </View>
          <Text style={styles.appName}>BookApp</Text>
          <Text style={styles.tagline}>Ваша цифрова бібліотека</Text>
        </Animated.View>

        {/* Форма */}
        <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}>
          <Text style={styles.cardTitle}>Вхід до системи</Text>

          {localError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {localError}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Логін</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={t => { setUsername(t); setLocalError(''); }}
            placeholder="Введіть логін"
            placeholderTextColor="#aaa"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Пароль</Text>
          <View style={styles.passRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              value={password}
              onChangeText={t => { setPassword(t); setLocalError(''); }}
              placeholder="Введіть пароль"
              placeholderTextColor="#aaa"
              secureTextEntry={!showPass}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(v => !v)}>
              <Text style={{ fontSize: 20 }}>{showPass ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.loginBtnText}>Увійти →</Text>
            }
          </TouchableOpacity>
        </Animated.View>

        {/* Демо акаунти */}
        <Text style={styles.demoTitle}>Натисніть для швидкого входу</Text>
        {LOCAL_USERS.map(u => (
          <TouchableOpacity
            key={u.id}
            style={styles.demoCard}
            onPress={() => fill(u)}
            activeOpacity={0.7}
          >
            <View style={[styles.demoAvatar, { backgroundColor: u.avatarColor }]}>
              <Text style={styles.demoAvatarText}>{u.avatar}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.demoName}>{u.name}</Text>
              <Text style={styles.demoCreds}>
                {u.username} / {u.password} · {u.role}
              </Text>
            </View>
            <Text style={{ color: '#3F51B5', fontSize: 20 }}>›</Text>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 50 },

  logoWrap: { alignItems: 'center', marginBottom: 28 },
  logoCircle: {
    width: 86, height: 86, borderRadius: 43, backgroundColor: '#3F51B5',
    justifyContent: 'center', alignItems: 'center', marginBottom: 14,
    shadowColor: '#3F51B5', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 14, elevation: 8,
  },
  logoEmoji: { fontSize: 42 },
  appName:   { fontSize: 30, fontWeight: '800', color: '#1A1A2E' },
  tagline:   { fontSize: 14, color: '#666', marginTop: 4 },

  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 22, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  cardTitle: { fontSize: 19, fontWeight: '700', color: '#1A1A2E', marginBottom: 18 },

  errorBox: { backgroundColor: '#FFEBEE', borderRadius: 10, padding: 12, marginBottom: 14 },
  errorText: { color: '#C62828', fontSize: 13 },

  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6 },
  input: {
    backgroundColor: '#F5F5F5', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 15, color: '#1A1A2E',
    borderWidth: 1, borderColor: '#E0E0E0', marginBottom: 14,
  },
  passRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  eyeBtn:   { padding: 10, marginLeft: 8 },

  loginBtn: {
    backgroundColor: '#3F51B5', borderRadius: 14,
    paddingVertical: 15, alignItems: 'center', marginTop: 4,
  },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  demoTitle: { fontSize: 12, color: '#999', textAlign: 'center', marginBottom: 10 },
  demoCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14,
    padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
    gap: 12,
  },
  demoAvatar: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
  },
  demoAvatarText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  demoName:  { fontSize: 15, fontWeight: '600', color: '#1A1A2E' },
  demoCreds: { fontSize: 11, color: '#888', marginTop: 2 },
});