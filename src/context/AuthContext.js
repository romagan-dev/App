import React, { createContext, useContext, useState } from 'react';

// ─── Всі користувачі задані в коді (пункт 2) ───
export const LOCAL_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'Олексій Мельник',
    email: 'admin@bookapp.ua',
    role: 'Адміністратор',
    avatar: 'ОМ',
    avatarColor: '#3F51B5',
  },
  {
    id: '2',
    username: 'user',
    password: 'user123',
    name: 'Марія Коваленко',
    email: 'maria@bookapp.ua',
    role: 'Читач',
    avatar: 'МК',
    avatarColor: '#E91E63',
  },
  {
    id: '3',
    username: 'test',
    password: 'test123',
    name: 'Іван Петренко',
    email: 'ivan@bookapp.ua',
    role: 'Редактор',
    avatar: 'ІП',
    avatarColor: '#009688',
  },
];

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const login = async (username, password) => {
    setLoading(true);
    setError('');

    // Імітація мережевого запиту (як ніби йде до API)
    await new Promise(r => setTimeout(r, 600));

    const found = LOCAL_USERS.find(
      u =>
        u.username.toLowerCase() === username.trim().toLowerCase() &&
        u.password === password.trim()
    );

    if (found) {
      setUser(found);
      setLoading(false);
      return { success: true };
    }

    const msg = 'Невірний логін або пароль';
    setError(msg);
    setLoading(false);
    return { success: false, error: msg };
  };

  const logout = () => {
    setUser(null);
    setError('');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);