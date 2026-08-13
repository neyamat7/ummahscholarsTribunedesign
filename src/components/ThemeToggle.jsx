"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const shouldBeDark = storedTheme === "dark" || (!storedTheme && prefersDark);

    if (shouldBeDark) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    if (nextDark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    // Trigger window event for any custom listeners
    window.dispatchEvent(new Event("themeChange"));
  };

  if (!mounted) {
    return <div className="w-10 h-10 rounded-lg border border-[#E7E2D9] dark:border-[#2E2A24] bg-[#FFFFFF] dark:bg-[#1A1714]" />;
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Light / Dark Theme"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-lg border border-[#E7E2D9] dark:border-[#2E2A24] bg-[#FFFFFF] dark:bg-[#1A1714] text-[#1A1714] dark:text-[#F5F1E8] hover:bg-[#FAF4E9] dark:hover:bg-[#262118] hover:text-[#C5A059] dark:hover:text-[#C5A059] hover:border-[#C5A059]/50 transition-all duration-300 shadow-xs flex items-center justify-center cursor-pointer relative overflow-hidden"
    >
      <div className="relative w-4 h-4 flex items-center justify-center pointer-events-none">
        <Sun
          size={16}
          className={`absolute transition-all duration-300 transform ${
            isDark
              ? "rotate-0 scale-100 opacity-100 text-[#C5A059]"
              : "rotate-90 scale-0 opacity-0 text-[#1A1714]"
          }`}
        />
        <Moon
          size={16}
          className={`absolute transition-all duration-300 transform ${
            isDark
              ? "-rotate-90 scale-0 opacity-0 text-[#F5F1E8]"
              : "rotate-0 scale-100 opacity-100 text-[#1A1714]"
          }`}
        />
      </div>
    </button>
  );
}
