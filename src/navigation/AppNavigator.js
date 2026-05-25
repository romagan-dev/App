import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const Stack = createNativeStackNavigator();

// ─── Головний навігатор (пункт 4) ───
// Stack Navigator як зовнішній: Auth → Main
export default function AppNavigator() {
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <NavigationContainer
      theme={{
        colors: {
          background: theme.bg,
          card: theme.headerBg,
          text: theme.headerText,
          border: theme.border,
          primary: theme.primary,
          notification: theme.accent,
        },
        dark: theme.isDark,
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {user ? (
          // Авторизований → Tab/Drawer навігатор
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          // Не авторизований → екран входу
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}