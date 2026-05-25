import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Animated, ScrollView, Alert,
} from 'react-native';
import { useAuth, USERS } from '../context/AuthContext';

// ─── Екран авторизації (пункт 3) ───
export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = async () => {
    setError('');
    if (!username.trim() || !password) {
      setError('Заповніть всі поля');
      shake();
      return;
    }
    setLoading(true);
    // Імітація затримки мережі
    await new Promise((r) => setTimeout(r, 500));
    const result = login(username, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error);
      shake();
    }
    // При success — навігатор у App.js автоматично переключиться
  };

  const fillDemo = (u) => {
    setUsername(u.username);
    setPassword(u.password);
    setError('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Логотип */}
        <Animated.View style={[styles.logoSection, { opacity: fadeAnim }]}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>📚</Text>
          </View>
          <Text style={styles.appName}>BookApp</Text>
          <Text style={styles.tagline}>Ваша цифрова бібліотека</Text>
        </Animated.View>

        {/* Форма входу */}
        <Animated.View
          style={[
            styles.formCard,
            { transform: [{ translateX: shakeAnim }] },
          ]}
        >
          <Text style={styles.formTitle}>Вхід до системи</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          ) : null}

          <Text style={styles.inputLabel}>Логін</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={(t) => { setUsername(t); setError(''); }}
            placeholder="Введіть логін"
            placeholderTextColor="#aaa"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.inputLabel}>Пароль</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              value={password}
              onChangeText={(t) => { setPassword(t); setError(''); }}
              placeholder="Введіть пароль"
              placeholderTextColor="#aaa"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPassword((v) => !v)}
            >
              <Text style={{ fontSize: 20 }}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginBtnText}>
              {loading ? 'Вхід...' : 'Увійти →'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Демо-акаунти */}
        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>Демо-акаунти (натисніть для заповнення)</Text>
          {USERS.map((u) => (
            <TouchableOpacity
              key={u.id}
              style={styles.demoCard}
              onPress={() => fillDemo(u)}
            >
              <View style={[styles.demoAvatar, { backgroundColor: u.avatarColor }]}>
                <Text style={styles.demoAvatarText}>{u.avatar}</Text>
              </View>
              <View>
                <Text style={styles.demoName}>{u.name}</Text>
                <Text style={styles.demoCredentials}>
                  {u.username} / {u.password}  ·  {u.role}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  scroll: { flexGrow: 1, alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24 },

  // Логотип
  logoSection: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#3F51B5',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#3F51B5', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 8,
  },
  logoEmoji: { fontSize: 44 },
  appName: { fontSize: 32, fontWeight: '800', color: '#1A1A2E', letterSpacing: 1 },
  tagline: { fontSize: 15, color: '#666', marginTop: 4 },

  // Форма
  formCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },
  formTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A2E', marginBottom: 20 },
  errorBox: {
    backgroundColor: '#FFEBEE', borderRadius: 10,
    padding: 12, marginBottom: 16,
  },
  errorText: { color: '#C62828', fontSize: 14 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6 },
  input: {
    backgroundColor: '#F5F5F5', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 16, color: '#1A1A2E',
    borderWidth: 1, borderColor: '#E0E0E0',
    marginBottom: 16,
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  eyeBtn: { padding: 12, marginLeft: 8 },
  loginBtn: {
    backgroundColor: '#3F51B5', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginTop: 4,
  },
  loginBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },

  // Демо
  demoSection: { width: '100%' },
  demoTitle: { fontSize: 13, color: '#999', textAlign: 'center', marginBottom: 12 },
  demoCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14,
    padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  demoAvatar: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  demoAvatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  demoName: { fontSize: 15, fontWeight: '600', color: '#1A1A2E' },
  demoCredentials: { fontSize: 12, color: '#888', marginTop: 2 },
});