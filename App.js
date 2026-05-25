import 'react-native-gesture-handler';
import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { BooksProvider } from './src/context/BooksContext';
import AppNavigator from './src/navigation/AppNavigator.js';

// ─── Точка входу ───
// Всі провайдери контексту огортають навігатор,
// щоб useAuth / useTheme / useBooks були доступні з будь-якого екрану.
export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BooksProvider>
          <AppNavigator />
        </BooksProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}