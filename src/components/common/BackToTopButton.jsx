"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const { isRtl } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          aria-label={isRtl ? "العودة إلى الأعلى" : "Scroll to top"}
          className={`fixed bottom-6 z-40 w-11 h-11 rounded-full bg-white/90 dark:bg-[#1A1714]/90 backdrop-blur-md border border-[#E5DCCB] dark:border-[#2E2A24] text-[#1C1917] dark:text-[#F5F1E8] hover:text-[#B88A2B] dark:hover:text-[#C5A059] hover:border-[#B88A2B]/60 dark:hover:border-[#C5A059]/60 shadow-lg flex items-center justify-center cursor-pointer transition-colors ${
            isRtl ? "left-6" : "right-6"
          }`}
        >
          <ArrowUp size={18} className="text-[#B88A2B] dark:text-[#C5A059]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
