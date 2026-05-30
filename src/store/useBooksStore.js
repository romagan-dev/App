import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKS_KEY = '@bookapp_books';

const INITIAL_BOOKS = [
  { id: 'b0', title: 'Кобзар',               author: 'Т. Шевченко',     genre: 'Поезія',  year: 1840, rating: 5.0, description: 'Видатна збірка поезій — символ української ідентичності.', cover: 'https://picsum.photos/150/200?random=20' },
  { id: 'b1', title: 'Тіні забутих предків', author: 'М. Коцюбинський', genre: 'Проза',   year: 1912, rating: 4.8, description: 'Повість про гуцульське кохання та народні вірування.',      cover: 'https://picsum.photos/150/200?random=21' },
  { id: 'b2', title: 'Маруся Чурай',         author: 'Л. Костенко',     genre: 'Роман',   year: 1979, rating: 4.9, description: 'Ліричний роман у віршах про долю поетеси XVII ст.',          cover: 'https://picsum.photos/150/200?random=22' },
  { id: 'b3', title: 'Інтернат',             author: 'С. Жадан',        genre: 'Повість', year: 2017, rating: 4.7, description: 'Роман про школу під час війни на Сході.',                    cover: 'https://picsum.photos/150/200?random=23' },
  { id: 'b4', title: 'Ворошиловград',        author: 'С. Жадан',        genre: 'Роман',   year: 2010, rating: 4.5, description: 'Роман-феєрія про повернення на батьківщину.',                cover: 'https://picsum.photos/150/200?random=24' },
  { id: 'b5', title: 'Місто',                author: 'В. Підмогильний', genre: 'Роман',   year: 1928, rating: 4.6, description: 'Роман про молодого інтелігента у великому місті.',           cover: 'https://picsum.photos/150/200?random=25' },
];

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':  return { ...state, books: action.payload };
    case 'ADD':      return { ...state, books: [action.payload, ...state.books] };
    case 'DELETE':   return { ...state, books: state.books.filter(b => b.id !== action.payload) };
    case 'CLEAR':    return { ...state, books: [] };
    case 'TOGGLE_SESSION': return { ...state, sessionOnly: !state.sessionOnly };
    default:         return state;
  }
}

const BooksContext = createContext(null);

export function BooksProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { books: INITIAL_BOOKS, sessionOnly: false });

  // Пункт 3a
  useEffect(() => {
    AsyncStorage.getItem(BOOKS_KEY).then(raw => {
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved) && saved.length > 0)
          dispatch({ type: 'HYDRATE', payload: saved });
      }
    }).catch(() => {});
  }, []);

  // Пункт 3b
  useEffect(() => {
    if (state.sessionOnly) return;
    AsyncStorage.setItem(BOOKS_KEY, JSON.stringify(state.books)).catch(() => {});
  }, [state.books, state.sessionOnly]);

  const addBook = (book) =>
    dispatch({ type: 'ADD', payload: { ...book, id: `b_${Date.now()}` } });

  const deleteBook = (id) => dispatch({ type: 'DELETE', payload: id });

  const clearBooks = async () => {
    await AsyncStorage.removeItem(BOOKS_KEY).catch(() => {});
    dispatch({ type: 'CLEAR' });
  };

  // Пункт 4
  const toggleSessionOnly = async () => {
    if (!state.sessionOnly)
      await AsyncStorage.removeItem(BOOKS_KEY).catch(() => {});
    dispatch({ type: 'TOGGLE_SESSION' });
  };

  return (
    <BooksContext.Provider value={{ ...state, addBook, deleteBook, clearBooks, toggleSessionOnly }}>
      {children}
    </BooksContext.Provider>
  );
}

export const useBooksStore = () => useContext(BooksContext);