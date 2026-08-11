"use client";

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const goldColor = "#C5A059";

  return (
    <div className="flex items-center gap-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-1 rounded-full text-xs font-semibold">
      <div className="px-1.5 text-neutral-400">
        <Globe size={14} />
      </div>
      <button
        onClick={() => setLocale('en')}
        className={`px-2.5 py-1 rounded-full transition-all duration-200 ${
          locale === 'en'
            ? 'bg-[#C5A059] text-white shadow-xs'
            : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale('ar')}
        className={`px-2.5 py-1 rounded-full font-serif transition-all duration-200 ${
          locale === 'ar'
            ? 'bg-[#C5A059] text-white shadow-xs'
            : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
        }`}
      >
        العربية
      </button>
    </div>
  );
}
