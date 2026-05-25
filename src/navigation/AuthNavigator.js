import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

// ─── Навігатор авторизації (пункт 4) ───
// Окремий Stack для екранів до логіну.
// Зараз один екран; легко додати ResetPassword, Register тощо.
export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F0F2F5' },
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Вхід' }}
      />
    </Stack.Navigator>
  );
}