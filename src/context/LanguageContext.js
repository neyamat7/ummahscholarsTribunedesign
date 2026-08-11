"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import enMessages from '../../messages/en.json';
import arMessages from '../../messages/ar.json';

const messagesMap = {
  en: enMessages,
  ar: arMessages,
};

const LanguageContext = createContext({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
  dir: 'ltr',
  isRtl: false,
});

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState('en');

  useEffect(() => {
    // Read stored language or default to en
    const storedLang = localStorage.getItem('app_locale') || 'en';
    setLocaleState(storedLang);
    document.documentElement.dir = storedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = storedLang;
  }, []);

  const setLocale = (newLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem('app_locale', newLocale);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLocale;
  };

  const t = (path) => {
    const keys = path.split('.');
    let current = messagesMap[locale] || messagesMap.en;
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English key if missing
        let fallback = messagesMap.en;
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return current;
  };

  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const isRtl = locale === 'ar';

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
