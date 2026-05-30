import 'react-native-gesture-handler';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider }     from './src/store/useAuthStore';
import { SettingsProvider } from './src/store/useSettingsStore';
import { BooksProvider }    from './src/store/useBooksStore';
import AppNavigator from './src/navigation/AppNavigator';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 2 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          <BooksProvider>
            <AppNavigator />
          </BooksProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}