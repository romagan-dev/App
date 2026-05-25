import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

import CatalogScreen from '../screens/CatalogScreen';
import AddBookScreen from '../screens/AddBookScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BookDetailScreen from '../screens/BookDetailScreen';

const Tab = createBottomTabNavigator();
const CatalogStack = createNativeStackNavigator();

// ─── Іконка таба ───
const TabIcon = ({ emoji, label, focused, color }) => (
  <View style={styles.tabIconWrapper}>
    <Text style={[styles.tabEmoji, { opacity: focused ? 1 : 0.5 }]}>{emoji}</Text>
    <Text style={[styles.tabLabel, { color }]}>{label}</Text>
  </View>
);

// ─── Вкладений Stack для каталогу (Catalog → Detail) ───
function CatalogStackNavigator() {
  const { theme } = useTheme();
  return (
    <CatalogStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.headerBg },
        headerTintColor: theme.headerText,
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <CatalogStack.Screen
        name="CatalogList"
        component={CatalogScreen}
        options={{ title: '📚 Каталог книг' }}
      />
      <CatalogStack.Screen
        name="BookDetail"
        component={BookDetailScreen}
        options={({ route }) => ({
          title: route.params?.title ?? 'Деталі',
          headerBackTitle: 'Назад',
        })}
      />
    </CatalogStack.Navigator>
  );
}

// ─── Головний Tab Navigator (пункт 4) ───
export default function MainNavigator() {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.subtext,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Catalog"
        component={CatalogStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon emoji="📚" label="Каталог" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddBookScreen}
        options={{
          // Цей таб має власний header
          headerShown: true,
          headerTitle: '➕ Додати книгу',
          headerStyle: { backgroundColor: theme.headerBg },
          headerTintColor: theme.headerText,
          headerTitleStyle: { fontWeight: '700' },
          tabBarIcon: ({ focused, color }) => (
            <TabIcon emoji="➕" label="Додати" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          headerTitle: `⚙️ ${user?.name ?? 'Налаштування'}`,
          headerStyle: { backgroundColor: theme.headerBg },
          headerTintColor: theme.headerText,
          headerTitleStyle: { fontWeight: '700' },
          tabBarIcon: ({ focused, color }) => (
            <TabIcon emoji="⚙️" label="Профіль" focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIconWrapper: { alignItems: 'center', justifyContent: 'center', paddingTop: 6 },
  tabEmoji: { fontSize: 22 },
  tabLabel: { fontSize: 10, marginTop: 3 },
});