"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Globe, ChevronDown, Check } from "lucide-react";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (newLocale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
        title="Select Language"
        className="h-10 px-3 rounded-lg border border-[#E7E2D9] dark:border-[#2E2A24] bg-[#FFFFFF] dark:bg-[#1A1714] text-[#1A1714] dark:text-[#F5F1E8] hover:bg-[#FAF4E9] dark:hover:bg-[#262118] hover:text-[#C5A059] dark:hover:text-[#C5A059] hover:border-[#C5A059]/50 transition-all duration-200 text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
      >
        <Globe size={15} className="text-[#C5A059] flex-shrink-0" />
        <span className="uppercase font-bold tracking-wider">{locale === "ar" ? "AR" : "EN"}</span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#C5A059]" : "text-[#6B6459] dark:text-[#A39B8B]"
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-32 rounded-lg bg-[#FFFFFF] dark:bg-[#1A1714] border border-[#E7E2D9] dark:border-[#2E2A24] shadow-xl py-1 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
          <button
            onClick={() => handleSelect("en")}
            className={`w-full text-left rtl:text-right px-3.5 py-2 transition-colors flex items-center justify-between cursor-pointer ${
              locale === "en"
                ? "bg-[#FAF4E9] dark:bg-[#262118] text-[#C5A059] font-bold"
                : "text-[#1A1714] dark:text-[#F5F1E8] hover:bg-[#FAF4E9]/60 dark:hover:bg-[#262118]/60"
            }`}
          >
            <span>English</span>
            {locale === "en" && <Check size={14} className="text-[#C5A059]" />}
          </button>
          <button
            onClick={() => handleSelect("ar")}
            className={`w-full text-left rtl:text-right px-3.5 py-2 font-serif transition-colors flex items-center justify-between cursor-pointer ${
              locale === "ar"
                ? "bg-[#FAF4E9] dark:bg-[#262118] text-[#C5A059] font-bold"
                : "text-[#1A1714] dark:text-[#F5F1E8] hover:bg-[#FAF4E9]/60 dark:hover:bg-[#262118]/60"
            }`}
          >
            <span>العربية</span>
            {locale === "ar" && <Check size={14} className="text-[#C5A059]" />}
          </button>
        </div>
      )}
    </div>
  );
}
