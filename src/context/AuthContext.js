import React, { createContext, useContext, useState } from 'react';

// ─── Заздалегідь задані користувачі (пункт 3) ───
export const USERS = [
  {
    id: '1',
    username: 'admin',
    password: '1234',
    name: 'Олексій Мельник',
    email: 'admin@bookapp.ua',
    role: 'Адміністратор',
    avatar: 'ОМ',
    avatarColor: '#3F51B5',
  },
  {
    id: '2',
    username: 'user',
    password: 'qwerty',
    name: 'Марія Коваленко',
    email: 'maria@bookapp.ua',
    role: 'Читач',
    avatar: 'МК',
    avatarColor: '#E91E63',
  },
  {
    id: '3',
    username: 'test',
    password: 'test',
    name: 'Іван Петренко',
    email: 'ivan@bookapp.ua',
    role: 'Редактор',
    avatar: 'ІП',
    avatarColor: '#009688',
  },
];

// ─── Контекст (пункт 6) ───
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    const found = USERS.find(
      (u) => u.username === username.trim() && u.password === password
    );
    if (found) {
      setUser(found);
      return { success: true };
    }
    return { success: false, error: 'Невірний логін або пароль' };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};