import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator }   from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSettingsStore } from '../store/useSettingsStore';
import { useAuthStore }     from '../store/useAuthStore';

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
  <View style={styles.icon}>
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>
    <Text style={{ fontSize: 10, color, marginTop: 2 }}>{label}</Text>
  </View>
);

function CatalogStackNav() {
  const { isDark } = useSettingsStore();
  const hBg = isDark ? '#1A1A2E' : '#3F51B5';
  const opts = { headerStyle: { backgroundColor: hBg }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: '700' }, headerShadowVisible: false };
  return (
    <CatalogStack.Navigator screenOptions={opts}>
      <CatalogStack.Screen name="CatalogList"  component={CatalogScreen}    options={{ title: '📚 Каталог книг' }} />
      <CatalogStack.Screen name="BookDetail"   component={BookDetailScreen} options={({ route }) => ({ title: route.params?.title?.slice(0,20) ?? 'Деталі' })} />
    </CatalogStack.Navigator>
  );
}

function PostsStackNav() {
  const { isDark } = useSettingsStore();
  const hBg = isDark ? '#1A1A2E' : '#3F51B5';
  const opts = { headerStyle: { backgroundColor: hBg }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: '700' }, headerShadowVisible: false };
  return (
    <PostsStack.Navigator screenOptions={opts}>
      <PostsStack.Screen name="PostsList"  component={PostsScreen}      options={{ title: '📰 Пости' }} />
      <PostsStack.Screen name="PostDetail" component={PostDetailScreen} options={({ route }) => ({ title: (route.params?.title ?? 'Деталі').slice(0,22) + '…' })} />
    </PostsStack.Navigator>
  );
}

export default function MainNavigator() {
  const { isDark } = useSettingsStore();
  const { user }   = useAuthStore();
  const hBg = isDark ? '#1A1A2E' : '#3F51B5';

  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: isDark ? '#1C1C1E' : '#fff', borderTopColor: isDark ? '#333' : '#E0E0E0', height: 68, paddingBottom: 8 },
      tabBarActiveTintColor: '#3F51B5',
      tabBarInactiveTintColor: isDark ? '#888' : '#999',
      tabBarShowLabel: false,
    }}>
      <Tab.Screen name="Catalog"  component={CatalogStackNav} options={{ tabBarIcon: p => <TabIcon emoji="📚" label="Каталог" {...p} /> }} />
      <Tab.Screen name="Posts"    component={PostsStackNav}   options={{ tabBarIcon: p => <TabIcon emoji="📰" label="Пости"   {...p} /> }} />
      <Tab.Screen name="Add"      component={AddBookScreen}
        options={{ headerShown: true, headerTitle: '➕ Нова книга', headerStyle: { backgroundColor: hBg }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: '700' }, tabBarIcon: p => <TabIcon emoji="➕" label="Додати" {...p} /> }} />
      <Tab.Screen name="Settings" component={SettingsScreen}
        options={{ headerShown: true, headerTitle: `⚙️ ${user?.name ?? 'Профіль'}`, headerStyle: { backgroundColor: hBg }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: '700' }, tabBarIcon: p => <TabIcon emoji="⚙️" label="Профіль" {...p} /> }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({ icon: { alignItems: 'center', paddingTop: 5 } });