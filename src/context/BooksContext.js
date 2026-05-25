import React, { createContext, useContext, useState } from 'react';

const TITLES = ['Кобзар', 'Тіні забутих предків', 'Маруся Чурай', 'Інтернат', 'Ворошиловград'];
const AUTHORS = ['Т. Шевченко', 'М. Коцюбинський', 'Л. Костенко', 'С. Жадан', 'М. Хвильовий'];
const GENRES = ['Поезія', 'Проза', 'Роман', 'Повість', 'Оповідання'];
const DESCRIPTIONS = [
  'Видатна збірка поезій, що стала символом української національної ідентичності та духовності.',
  'Геніальна повість про гуцульське кохання, природу і народні вірування Карпат.',
  'Ліричний роман у віршах про долю поетеси XVII століття та непросту любов.',
  'Сучасний роман про школу для дітей з особливими потребами під час війни на Сході.',
  'Роман-феєрія про повернення на батьківщину, пошук себе та ціну вибору.',
];

const initialBooks = Array.from({ length: 12 }).map((_, i) => ({
  id: `book_${i}`,
  title: TITLES[i % 5],
  author: AUTHORS[i % 5],
  genre: GENRES[i % 5],
  description: DESCRIPTIONS[i % 5],
  year: 1840 + i * 15,
  rating: Math.round((3.5 + (i % 3) * 0.5) * 10) / 10,
  cover: `https://picsum.photos/150/200?random=${i + 10}`,
}));

const BooksContext = createContext(null);

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState(initialBooks);

  const addBook = (book) =>
    setBooks((prev) => [{ ...book, id: `book_${Date.now()}` }, ...prev]);

  const deleteBook = (id) =>
    setBooks((prev) => prev.filter((b) => b.id !== id));

  const clearBooks = () => setBooks([]);

  return (
    <BooksContext.Provider value={{ books, addBook, deleteBook, clearBooks }}>
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = () => useContext(BooksContext);