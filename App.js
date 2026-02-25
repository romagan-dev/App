import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Switch, SafeAreaView } from 'react-native';

// --- ПУНКТ 7: Кастомний компонент для книги (Props) ---
const BookItem = ({ title, author, cover, isDark }) => (
  <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
    <Image source={{ uri: cover }} style={styles.coverImage} />
    <View style={styles.bookInfo}>
      <Text style={[styles.bookTitle, isDark && styles.textWhite]}>{title}</Text>
      <Text style={styles.bookAuthor}>{author}</Text>
    </View>
  </View>
);

export default function App() {
  // --- ПУНКТ 3 & 6: Стан для екранів та темної теми ---
  const [activeTab, setActiveTab] = useState('catalog'); 
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- ПУНКТ 5: Список книг (20+ елементів) ---
  const booksData = Array.from({ length: 20 }).map((_, i) => ({
    id: i.toString(),
    title: `Книга "${['Кобзар', 'Тіні забутих предків', 'Маруся Чурай', 'Інтернат', 'Ворошиловград'][i % 5]}"`,
    author: `Автор: ${['Т. Шевченко', 'М. Коцюбинський', 'Л. Костенко', 'С. Жадан', 'М. Хвильовий'][i % 5]}`,
    cover: `https://picsum.photos/150/200?random=${i}`,
  }));

  return (
    <SafeAreaView style={[styles.container, isDarkMode ? styles.bgDark : styles.bgLight]}>
      
      {/* ПУНКТ 4: Навігація з індикатором активності */}
      <View style={styles.navBar}>
        <TouchableOpacity 
          style={[styles.navBtn, activeTab === 'catalog' && styles.activeNavBtn]} 
          onPress={() => setActiveTab('catalog')}
        >
          <Text style={activeTab === 'catalog' ? styles.activeText : styles.inactiveText}>Каталог</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navBtn, activeTab === 'settings' && styles.activeNavBtn]} 
          onPress={() => setActiveTab('settings')}
        >
          <Text style={activeTab === 'settings' ? styles.activeText : styles.inactiveText}>Налаштування</Text>
        </TouchableOpacity>
      </View>

      {/* ОСНОВНИЙ КОНТЕНТ */}
      <View style={styles.content}>
        {activeTab === 'catalog' ? (
          <FlatList
            data={booksData}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <BookItem 
                title={item.title} 
                author={item.author} 
                cover={item.cover} 
                isDark={isDarkMode} 
              />
            )}
            contentContainerStyle={styles.listPadding}
          />
        ) : (
          <View style={styles.settingsScreen}>
            <Text style={[styles.settingsTitle, isDarkMode && styles.textWhite]}>Налаштування додатка</Text>
            <View style={styles.switchRow}>
              <Text style={[styles.label, isDarkMode && styles.textWhite]}>Темний режим</Text>
              <Switch 
                value={isDarkMode} 
                onValueChange={setIsDarkMode} 
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
              />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// --- СТИЛІ (Пункти 5 та 7) ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  bgLight: { backgroundColor: '#F5F5F5' },
  bgDark: { backgroundColor: '#121212' },
  textWhite: { color: '#FFFFFF' },

  navBar: { flexDirection: 'row', marginTop: 40, height: 60, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  navBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0e0e0' },
  activeNavBtn: { backgroundColor: '#3F51B5', borderBottomWidth: 4, borderBottomColor: '#1A237E' },
  inactiveText: { color: '#333' },
  activeText: { color: '#FFF', fontWeight: 'bold' },

  content: { flex: 1 },
  listPadding: { padding: 15 },
  
  card: { 
    flexDirection: 'row', 
    padding: 12, 
    marginBottom: 12, 
    borderRadius: 12, 
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  cardLight: { backgroundColor: '#FFFFFF' },
  cardDark: { backgroundColor: '#1E1E1E' },
  
  coverImage: { width: 70, height: 100, borderRadius: 6 },
  bookInfo: { marginLeft: 15, justifyContent: 'center', flex: 1 },
  bookTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  bookAuthor: { fontSize: 14, color: '#666' },

  settingsScreen: { flex: 1, padding: 30, alignItems: 'center' },
  settingsTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 40 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  label: { fontSize: 18 },
});