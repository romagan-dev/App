import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LOCAL_USERS = [
  { id: '1', username: 'admin', password: 'admin123', name: 'Олексій Мельник', email: 'admin@bookapp.ua', role: 'Адміністратор', avatar: 'ОМ', avatarColor: '#3F51B5' },
  { id: '2', username: 'user',  password: 'user123',  name: 'Марія Коваленко', email: 'maria@bookapp.ua', role: 'Читач',         avatar: 'МК', avatarColor: '#E91E63' },
  { id: '3', username: 'test',  password: 'test123',  name: 'Іван Петренко',   email: 'ivan@bookapp.ua',  role: 'Редактор',      avatar: 'ІП', avatarColor: '#009688' },
];

const AUTH_KEY = '@bookapp_user';

const initialState = { user: null, loading: false, error: '' };

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':    return { ...state, user: action.payload, loading: false, error: '' };
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'SET_ERROR':   return { ...state, error: action.payload, loading: false };
    case 'LOGOUT':      return { ...initialState };
    default:            return state;
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Пункт 3a: зчитати при запуску
  useEffect(() => {
    AsyncStorage.getItem(AUTH_KEY).then(raw => {
      if (raw) dispatch({ type: 'SET_USER', payload: JSON.parse(raw) });
    }).catch(() => {});
  }, []);

  const login = async (username, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    await new Promise(r => setTimeout(r, 500));
    const found = LOCAL_USERS.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase()
        && u.password === password.trim()
    );
    if (found) {
      // Пункт 3b: зберегти
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(found)).catch(() => {});
      dispatch({ type: 'SET_USER', payload: found });
      return { success: true };
    }
    dispatch({ type: 'SET_ERROR', payload: 'Невірний логін або пароль' });
    return { success: false };
  };

  const logout = async () => {
    await AsyncStorage.removeItem(AUTH_KEY).catch(() => {});
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => dispatch({ type: 'SET_ERROR', payload: '' });

  return (
    <AuthContext.Provider value={{ ...state, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthStore = () => useContext(AuthContext);