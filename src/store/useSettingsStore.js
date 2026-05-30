import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@bookapp_settings';

const DEFAULT = {
  isDark: false, language: 'UA', fontSize: 16,
  showCovers: true, sortAlpha: false, sessionOnly: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':           return { ...state, ...action.payload };
    case 'TOGGLE_DARK':       return { ...state, isDark: !state.isDark };
    case 'SET_LANGUAGE':      return { ...state, language: action.payload };
    case 'SET_FONT_SIZE':     return { ...state, fontSize: action.payload };
    case 'TOGGLE_COVERS':     return { ...state, showCovers: !state.showCovers };
    case 'TOGGLE_SORT':       return { ...state, sortAlpha: !state.sortAlpha };
    case 'TOGGLE_SESSION':    return { ...state, sessionOnly: !state.sessionOnly };
    case 'RESET':             return { ...DEFAULT };
    default:                  return state;
  }
}

const SettingsContext = createContext(null);

const save = async (state) => {
  if (state.sessionOnly) return;
  const { isDark, language, fontSize, showCovers, sortAlpha } = state;
  await AsyncStorage.setItem(SETTINGS_KEY,
    JSON.stringify({ isDark, language, fontSize, showCovers, sortAlpha, sessionOnly: false })
  ).catch(() => {});
};

export function SettingsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, DEFAULT);

  // Пункт 3a
  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then(raw => {
      if (raw) dispatch({ type: 'HYDRATE', payload: JSON.parse(raw) });
    }).catch(() => {});
  }, []);

  // Пункт 3b — зберігати при кожній зміні
  useEffect(() => { save(state); }, [state]);

  const toggleDark       = () => dispatch({ type: 'TOGGLE_DARK' });
  const setLanguage  = v  => dispatch({ type: 'SET_LANGUAGE', payload: v });
  const setFontSize  = v  => dispatch({ type: 'SET_FONT_SIZE', payload: v });
  const toggleCovers     = () => dispatch({ type: 'TOGGLE_COVERS' });
  const toggleSort       = () => dispatch({ type: 'TOGGLE_SORT' });
  // Пункт 4
  const toggleSessionOnly = () => {
    if (!state.sessionOnly) AsyncStorage.removeItem(SETTINGS_KEY).catch(() => {});
    dispatch({ type: 'TOGGLE_SESSION' });
  };
  const reset = async () => {
    await AsyncStorage.removeItem(SETTINGS_KEY).catch(() => {});
    dispatch({ type: 'RESET' });
  };

  return (
    <SettingsContext.Provider value={{ ...state, toggleDark, setLanguage, setFontSize, toggleCovers, toggleSort, toggleSessionOnly, reset }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettingsStore = () => useContext(SettingsContext);