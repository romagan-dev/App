import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore }     from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user }   = useAuthStore();
  const { isDark } = useSettingsStore();

  return (
    <NavigationContainer theme={{
      dark: isDark,
      colors: {
        background:   isDark ? '#0D0D0D' : '#F0F2F5',
        card:         isDark ? '#1A1A2E' : '#3F51B5',
        text:         '#FFFFFF',
        border:       isDark ? '#333' : '#E0E0E0',
        primary:      '#3F51B5',
        notification: '#FF6B35',
      },
    }}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {user
          ? <Stack.Screen name="Main" component={MainNavigator} />
          : <Stack.Screen name="Auth" component={AuthNavigator} />
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}