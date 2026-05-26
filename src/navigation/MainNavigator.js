import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

import CatalogScreen    from '../screens/CatalogScreen';
import AddBookScreen    from '../screens/AddBookScreen';
import SettingsScreen   from '../screens/SettingsScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import PostsScreen      from '../screens/PostsScreen';
import PostDetailScreen from '../screens/PostDetailScreen';

const Tab          = createBottomTabNavigator();
const CatalogStack = createNativeStackNavigator();
const PostsStack   = createNativeStackNavigator();

const TabIcon = ({ emoji, label, focused, color }) => (
  <View style={styles.tabIcon}>
    <Text style={[styles.tabEmoji, { opacity: focused ? 1 : 0.45 }]}>{emoji}</Text>
    <Text style={[styles.tabLabel, { color }]}>{label}</Text>
  </View>
);

// Stack: Каталог → Деталі книги
function CatalogStackNav() {
  const { theme } = useTheme();
  const stackOpts = {
    headerStyle: { backgroundColor: theme.headerBg },
    headerTintColor: theme.headerText,
    headerTitleStyle: { fontWeight: '700', fontSize: 17 },
    headerShadowVisible: false,
    animation: 'slide_from_right',
  };
  return (
    <CatalogStack.Navigator screenOptions={stackOpts}>
      <CatalogStack.Screen name="CatalogList" component={CatalogScreen} options={{ title: '📚 Каталог книг' }} />
      <CatalogStack.Screen name="BookDetail"  component={BookDetailScreen}
        options={({ route }) => ({ title: route.params?.title ?? 'Деталі', headerBackTitle: 'Назад' })} />
    </CatalogStack.Navigator>
  );
}

// Stack: Пости → Деталі поста (пункт 3 + 5)
function PostsStackNav() {
  const { theme } = useTheme();
  const stackOpts = {
    headerStyle: { backgroundColor: theme.headerBg },
    headerTintColor: theme.headerText,
    headerTitleStyle: { fontWeight: '700', fontSize: 17 },
    headerShadowVisible: false,
    animation: 'slide_from_right',
  };
  return (
    <PostsStack.Navigator screenOptions={stackOpts}>
      <PostsStack.Screen name="PostsList"  component={PostsScreen}      options={{ title: '📰 Пости' }} />
      <PostsStack.Screen name="PostDetail" component={PostDetailScreen}
        options={({ route }) => ({ title: route.params?.title ? route.params.title.slice(0, 24) + '…' : 'Деталі', headerBackTitle: 'Назад' })} />
    </PostsStack.Navigator>
  );
}

export default function MainNavigator() {
  const { theme } = useTheme();
  const { user }  = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border, height: 68, paddingBottom: 8 },
        tabBarActiveTintColor:   theme.primary,
        tabBarInactiveTintColor: theme.subtext,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen name="Catalog" component={CatalogStackNav}
        options={{ tabBarIcon: p => <TabIcon emoji="📚" label="Каталог" {...p} /> }} />

      {/* Пункт 3: четвертий екран — Пости */}
      <Tab.Screen name="Posts" component={PostsStackNav}
        options={{ tabBarIcon: p => <TabIcon emoji="📰" label="Пости" {...p} /> }} />

      <Tab.Screen name="Add" component={AddBookScreen}
        options={{
          headerShown: true,
          headerTitle: '➕ Нова книга',
          headerStyle: { backgroundColor: theme.headerBg },
          headerTintColor: theme.headerText,
          headerTitleStyle: { fontWeight: '700' },
          tabBarIcon: p => <TabIcon emoji="➕" label="Додати" {...p} />,
        }} />

      <Tab.Screen name="Settings" component={SettingsScreen}
        options={{
          headerShown: true,
          headerTitle: `⚙️ ${user?.name ?? 'Профіль'}`,
          headerStyle: { backgroundColor: theme.headerBg },
          headerTintColor: theme.headerText,
          headerTitleStyle: { fontWeight: '700' },
          tabBarIcon: p => <TabIcon emoji="⚙️" label="Профіль" {...p} />,
        }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIcon:  { alignItems: 'center', paddingTop: 5 },
  tabEmoji: { fontSize: 22 },
  tabLabel: { fontSize: 10, marginTop: 2 },
});