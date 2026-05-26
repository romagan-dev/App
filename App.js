import 'react-native-gesture-handler';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { BooksProvider } from './src/context/BooksContext';
import AppNavigator from './src/navigation/AppNavigator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 хвилин кешу
      retry: 2,
    },
  },
});

export default function App() {
  return (
    // React Query провайдер для кешування (пункт 4)
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <BooksProvider>
            <AppNavigator />
          </BooksProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}