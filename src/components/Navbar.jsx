"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { Menu, X } from "lucide-react";
import { EXPO_EASE } from "@/lib/animations";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, isRtl } = useLanguage();
  const pathname = usePathname();

  const lastScrollY = useRef(0);
  const timeoutRef = useRef(null);

  // Scroll detection for smooth sticky transition
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
        setIsVisible(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        return;
      }

      // Hide navbar when scrolling down past 150px
      if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
        setIsVisible(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // Slide smoothly back into view after scroll delay
        timeoutRef.current = setTimeout(() => {
          setIsVisible(true);
        }, 500);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Primary Category Nav Items for Zone 2 (Must never wrap)
  const primaryNavItems = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.news"), path: "/news" },
    { name: t("nav.research"), path: "/research" },
    { name: t("nav.opinions"), path: "/opinions" },
    { name: t("nav.events"), path: "/events" },
  ];

  // Secondary Utility Pages for Zone 3
  const utilityNavItems = [
    { name: t("nav.about"), path: "/about" },
    { name: t("nav.contact"), path: "/contact" },
  ];

  /*
   * Breakpoint Decision Note:
   * We use the standard `lg` (1024px) breakpoint for collapsing Zone 2 into the mobile drawer.
   * At 1024px+ width, the 3-zone layout has sufficient horizontal margin for Zone 1 stacked logo,
   * Zone 2 single-line category links, and Zone 3 utility controls without crowding.
   */

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out transform ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        isScrolled
          ? "bg-[#FFFFFF]/95 dark:bg-[#1A1714]/95 backdrop-blur-md border-b border-[#E7E2D9] dark:border-[#2E2A24] shadow-xs"
          : "bg-[#FFFFFF] dark:bg-[#1A1714] border-b border-[#E7E2D9] dark:border-[#2E2A24]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">
          
          {/* =================================================================
              ZONE 1: Logo + Two-Line Stacked Site Name
              ================================================================= */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 16 : -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: EXPO_EASE }}
          >
            <Link href="/" className="flex items-center gap-3.5 group flex-shrink-0">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#C5A059]/60 shadow-xs transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo/logo.jpeg"
                  alt="Ummah Scholars Tribune Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Two-Line Stacked Site Name Lockup */}
              <div className="flex flex-col text-left rtl:text-right leading-none justify-center">
                {isRtl ? (
                  <>
                    <span className="font-serif font-bold text-sm sm:text-base text-[#1A1714] dark:text-[#F5F1E8] tracking-tight leading-tight">
                      منبر أعلام
                    </span>
                    <span className="font-serif font-semibold text-xs text-[#C5A059] tracking-wider leading-tight mt-0.5">
                      الأمة
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-serif font-bold text-sm sm:text-base text-[#1A1714] dark:text-[#F5F1E8] tracking-tight leading-tight">
                      Ummah Scholars
                    </span>
                    <span className="font-serif font-semibold text-xs text-[#C5A059] tracking-wider leading-tight mt-0.5">
                      Tribune
                    </span>
                  </>
                )}
              </div>
            </Link>
          </motion.div>

          {/* =================================================================
              ZONE 2: Primary Category Nav (Centered, Single Line, Never Wraps)
              ================================================================= */}
          <motion.nav
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
            }}
            className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 flex-grow mx-4"
          >
            {primaryNavItems.map((item, index) => {
              const isActive = pathname === item.path;

              return (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: -8 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EXPO_EASE } },
                  }}
                >
                  <Link
                    href={item.path}
                    className={`text-sm font-medium whitespace-nowrap py-1 relative transition-colors duration-200 group ${
                      isActive
                        ? "text-[#C5A059] font-bold"
                        : "text-[#1A1714] dark:text-[#F5F1E8] hover:text-[#C5A059] dark:hover:text-[#C5A059]"
                    }`}
                  >
                    {item.name}
                    {/* Smooth Underline Grow Animation */}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-[#C5A059] transition-all duration-300 ease-out ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </motion.nav>

          {/* =================================================================
              ZONE 3: Utility Cluster — About, Contact, Language, Theme Toggle
              ================================================================= */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -16 : 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: EXPO_EASE, delay: 0.2 }}
            className="hidden lg:flex items-center gap-3.5 flex-shrink-0"
          >
            {/* Secondary Page Links: About & Contact */}
            <div className="flex items-center gap-3 text-xs sm:text-sm font-medium">
              {utilityNavItems.map((item, index) => {
                const isActive = pathname === item.path;

                return (
                  <Link
                    key={index}
                    href={item.path}
                    className={`whitespace-nowrap transition-colors duration-200 ${
                      isActive
                        ? "text-[#C5A059] font-bold"
                        : "text-[#6B6459] dark:text-[#A39B8B] hover:text-[#1A1714] dark:hover:text-[#F5F1E8]"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Vertical Divider 1 */}
            <div className="h-4 w-px bg-[#E7E2D9] dark:bg-[#2E2A24] mx-0.5" />

            {/* Language Switcher Dropdown (Globe + Code + Dropdown) */}
            <LanguageSwitcher />

            {/* Vertical Divider 2 */}
            <div className="h-4 w-px bg-[#E7E2D9] dark:bg-[#2E2A24] mx-0.5" />

            {/* Theme Toggle Button (Sun/Moon Morph with 40x40px Target) */}
            <ThemeToggle />
          </motion.div>

          {/* =================================================================
              MOBILE: Utility Controls & Hamburger Button (< lg)
              ================================================================= */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <ThemeToggle />

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 rounded-lg text-[#1A1714] dark:text-[#F5F1E8] hover:text-[#C5A059] hover:bg-[#FAF4E9] dark:hover:bg-[#262118] border border-[#E7E2D9] dark:border-[#2E2A24] flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* =================================================================
          MOBILE DRAWER MENU WITH SMOOTH ANIMATION (< lg)
          ================================================================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EXPO_EASE }}
            className="lg:hidden bg-[#FFFFFF] dark:bg-[#1A1714] border-t border-[#E7E2D9] dark:border-[#2E2A24] overflow-hidden shadow-xl"
          >
            <div className="px-5 pt-4 pb-6 space-y-2">
              {/* Primary Category Links */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] block px-3 py-1">
                  {isRtl ? "التصفح الرئيسي" : "Main Navigation"}
                </span>
                {primaryNavItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.path}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === item.path
                        ? "bg-[#FAF4E9] dark:bg-[#262118] text-[#C5A059] font-bold"
                        : "text-[#1A1714] dark:text-[#F5F1E8] hover:bg-[#FAF4E9]/60 dark:hover:bg-[#262118]/60"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-[#E7E2D9] dark:border-[#2E2A24] my-3" />

              {/* Secondary Utility Links */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B6459] dark:text-[#A39B8B] block px-3 py-1">
                  {isRtl ? "صفحات إضافية" : "Pages & Info"}
                </span>
                {utilityNavItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.path}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === item.path
                        ? "bg-[#FAF4E9] dark:bg-[#262118] text-[#C5A059] font-bold"
                        : "text-[#6B6459] dark:text-[#A39B8B] hover:text-[#1A1714] dark:hover:text-[#F5F1E8]"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}