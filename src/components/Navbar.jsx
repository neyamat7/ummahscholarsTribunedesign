"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import AuthModal from "./auth/AuthModal";
import UserProfilePanel from "./user/UserProfilePanel";
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import { EXPO_EASE } from "@/lib/animations";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { t, isRtl } = useLanguage();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const pathname = usePathname();

  const lastScrollY = useRef(0);
  const timeoutRef = useRef(null);
  const moreRef = useRef(null);

  // Close "More" dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setIsMoreOpen(false);
      }
    };
    if (isMoreOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isMoreOpen]);

  // Scroll detection for sticky transition and scroll-down hide
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
        setIsMoreOpen(false);
        setIsProfileOpen(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

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

  // Primary Category Nav Items
  const primaryNavItems = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.news"), path: "/news" },
    { name: t("nav.research"), path: "/research" },
    { name: t("nav.opinions"), path: "/opinions" },
    { name: t("nav.events"), path: "/events" },
  ];

  // Secondary Pages for "More ▾" dropdown (Q&A before About & Contact)
  const moreNavItems = [
    { name: t("nav.qa") || (isRtl ? "الأسئلة والأجوبة" : "Questions & Answers"), path: "/qa" },
    { name: t("nav.about"), path: "/about" },
    { name: t("nav.contact"), path: "/contact" },
  ];

  // Helper to determine active state for all primary & secondary routes
  const isNavItemActive = (itemPath) => {
    if (!pathname) return false;
    const cleanPath = pathname.replace(/\/+$/, "") || "/";

    if (itemPath === "/") {
      return cleanPath === "/";
    }

    if (itemPath === "/news") {
      return (
        cleanPath === "/news" ||
        cleanPath.startsWith("/news/") ||
        cleanPath === "/news-announcements" ||
        cleanPath.startsWith("/news-announcements/") ||
        cleanPath === "/blog/news-announcements" ||
        cleanPath.startsWith("/blog/news-announcements/")
      );
    }

    if (itemPath === "/research") {
      return (
        cleanPath === "/research" ||
        cleanPath.startsWith("/research/") ||
        cleanPath === "/research-studies" ||
        cleanPath.startsWith("/research-studies/") ||
        cleanPath === "/blog/research-studies" ||
        cleanPath.startsWith("/blog/research-studies/")
      );
    }

    if (itemPath === "/opinions") {
      return (
        cleanPath === "/opinions" ||
        cleanPath.startsWith("/opinions/") ||
        cleanPath === "/opinions-perspectives" ||
        cleanPath.startsWith("/opinions-perspectives/") ||
        cleanPath === "/blog/opinions-perspectives" ||
        cleanPath.startsWith("/blog/opinions-perspectives/")
      );
    }

    if (itemPath === "/events") {
      return (
        cleanPath === "/events" ||
        cleanPath.startsWith("/events/") ||
        cleanPath === "/events-initiatives" ||
        cleanPath.startsWith("/events-initiatives/") ||
        cleanPath === "/blog/events-initiatives" ||
        cleanPath.startsWith("/blog/events-initiatives/")
      );
    }

    if (itemPath === "/qa") {
      return (
        cleanPath === "/qa" ||
        cleanPath.startsWith("/qa/") ||
        cleanPath === "/questions" ||
        cleanPath.startsWith("/questions/")
      );
    }

    return cleanPath === itemPath || cleanPath.startsWith(`${itemPath}/`);
  };

  const userAvatar =
    user?.avatarUrl ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.id || user?.email || "guest")}`;

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: isVisible ? 0 : "-100%" }}
        transition={{ duration: 0.35, ease: EXPO_EASE }}
        className={`fixed top-0 left-0 right-0 z-50 ${
          isScrolled
            ? "bg-[#FFFFFF]/95 dark:bg-[#1A1714]/95 backdrop-blur-md border-b border-[#E7E2D9] dark:border-[#2E2A24] shadow-xs"
            : "bg-[#FFFFFF] dark:bg-[#1A1714] border-b border-[#E7E2D9] dark:border-[#2E2A24]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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

                {/* Two-Line Stacked Site Name */}
                <div className="flex flex-col text-left rtl:text-right leading-none justify-center">
                  {isRtl ? (
                    <>
                      <span className="font-serif font-bold text-sm sm:text-base text-[#1A1714] dark:text-[#F5F1E8] tracking-tight leading-tight whitespace-nowrap">
                        منبر أعلام
                      </span>
                      <span className="font-serif font-semibold text-xs text-[#C5A059] tracking-wider leading-tight mt-0.5 whitespace-nowrap">
                        الأمة
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-serif font-bold text-sm sm:text-base text-[#1A1714] dark:text-[#F5F1E8] tracking-tight leading-tight whitespace-nowrap">
                        Ummah Scholars
                      </span>
                      <span className="font-serif font-semibold text-xs text-[#C5A059] tracking-wider leading-tight mt-0.5 whitespace-nowrap">
                        Tribune
                      </span>
                    </>
                  )}
                </div>
              </Link>
            </motion.div>

            {/* =================================================================
                ZONE 2: Primary Nav + "More ▾" Dropdown (Spaced on both sides)
                ================================================================= */}
            <motion.nav
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
              }}
              className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 flex-grow px-4"
            >
              {primaryNavItems.map((item, index) => {
                const isActive = isNavItemActive(item.path);

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

              {/* Dynamic "More ▾" Dropdown */}
              <div ref={moreRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsMoreOpen((p) => !p)}
                  className={`inline-flex items-center gap-1 text-sm font-medium py-1 transition-colors cursor-pointer ${
                    isMoreOpen || moreNavItems.some((m) => isNavItemActive(m.path))
                      ? "text-[#C5A059] font-bold"
                      : "text-[#1A1714] dark:text-[#F5F1E8] hover:text-[#C5A059]"
                  }`}
                  aria-expanded={isMoreOpen}
                >
                  <span>{isRtl ? "المزيد" : "More"}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${isMoreOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isMoreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute top-full mt-2 ${
                        isRtl ? "right-0" : "left-0"
                      } z-50 w-44 bg-white dark:bg-[#1A1714] border border-[#E7E2D9] dark:border-[#2E2A24] rounded-2xl shadow-xl p-2`}
                    >
                      {moreNavItems.map((item, index) => {
                        const isActive = isNavItemActive(item.path);
                        return (
                          <Link
                            key={index}
                            href={item.path}
                            onClick={() => setIsMoreOpen(false)}
                            className={`block px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                              isActive
                                ? "bg-[#FAF4E9] dark:bg-[#262118] text-[#C5A059] font-bold"
                                : "text-[#1A1714] dark:text-[#F5F1E8] hover:bg-[#FAF4E9]/60 dark:hover:bg-[#262118]/60"
                            }`}
                          >
                            {item.name}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.nav>

            {/* =================================================================
                ZONE 3: Utility Cluster — Language, Theme, Divider, Auth Button/Avatar
                ================================================================= */}
            <motion.div
              initial={{ opacity: 0, x: isRtl ? -16 : 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: EXPO_EASE, delay: 0.2 }}
              className="hidden lg:flex items-center gap-3.5 flex-shrink-0"
            >
              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Theme Toggle Button */}
              <ThemeToggle />

              {/* Vertical Divider */}
              <div className="h-5 w-px bg-[#E7E2D9] dark:bg-[#2E2A24] mx-1" />

              {/* Visitor Authentication State */}
              {isLoading ? (
                /* Hydration skeleton loader */
                <div className="w-24 h-9 rounded-xl bg-stone-200 dark:bg-stone-800 animate-pulse" />
              ) : isAuthenticated && user ? (
                /* Authenticated User Avatar Trigger */
                <button
                  data-profile-trigger="true"
                  type="button"
                  onClick={() => setIsProfileOpen((p) => !p)}
                  className="relative flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 border border-[#E7E2D9] dark:border-[#2E2A24] transition-colors cursor-pointer"
                  aria-label="Open profile panel"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#B88A2B]/50 bg-white dark:bg-[#1A1714] shrink-0">
                    <Image
                      src={userAvatar}
                      alt={user.name || "User Avatar"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs font-bold text-[#1A1714] dark:text-[#F5F1E8] max-w-[90px] truncate hidden xl:inline pr-1">
                    {user.name?.split(" ")[0] || "Scholar"}
                  </span>
                  <ChevronDown size={13} className="text-[#A8A29E] pr-1 hidden xl:inline" />
                </button>
              ) : (
                /* Unauthenticated Login Button */
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#B88A2B] to-[#C5A059] hover:brightness-105 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  <User size={14} />
                  <span>{isRtl ? "تسجيل الدخول" : "Login"}</span>
                </button>
              )}
            </motion.div>

            {/* =================================================================
                MOBILE CONTROLS: Utility & Hamburger (< lg)
                ================================================================= */}
            <div className="flex items-center gap-2 lg:hidden">
              <LanguageSwitcher />
              <ThemeToggle />

              {/* Mobile Auth Button */}
              {isAuthenticated && user ? (
                <button
                  data-profile-trigger="true"
                  type="button"
                  onClick={() => setIsProfileOpen((p) => !p)}
                  className="relative w-9 h-9 rounded-full overflow-hidden border border-[#B88A2B] bg-white dark:bg-[#1A1714] flex items-center justify-center cursor-pointer"
                  aria-label="User Profile"
                >
                  <Image
                    src={userAvatar}
                    alt={user.name || "User"}
                    fill
                    className="object-cover"
                  />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-9 h-9 rounded-lg text-[#B88A2B] dark:text-[#C5A059] bg-[#FAF0D7]/40 dark:bg-[#262118] border border-[#E7E2D9] dark:border-[#2E2A24] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Login"
                >
                  <User size={18} />
                </button>
              )}

              {/* Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-lg text-[#1A1714] dark:text-[#F5F1E8] hover:text-[#C5A059] hover:bg-[#FAF4E9] dark:hover:bg-[#262118] border border-[#E7E2D9] dark:border-[#2E2A24] flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* SINGLE Global User Profile Dropdown Panel */}
          {isAuthenticated && user && (
            <UserProfilePanel
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
            />
          )}
        </div>

        {/* =================================================================
            MOBILE DRAWER MENU (< lg)
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
                {/* Authenticated User Banner inside mobile drawer */}
                {isAuthenticated && user && (
                  <div className="p-3 rounded-2xl bg-[#FAF0D7]/40 dark:bg-[#262118] border border-[#E5DCCB] dark:border-[#2E2A24] flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#B88A2B]/40 shrink-0">
                        <Image src={userAvatar} alt="User" fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#1C1917] dark:text-[#F5F1E8] truncate">
                          {user.name}
                        </p>
                        <p className="text-[10px] text-[#78716C] dark:text-[#A39B8B] truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span className="text-[11px]">{isRtl ? "خروج" : "Logout"}</span>
                    </button>
                  </div>
                )}

                {/* Primary Category Links */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] block px-3 py-1">
                    {isRtl ? "التصفح الرئيسي" : "Main Navigation"}
                  </span>
                  {primaryNavItems.map((item, index) => {
                    const isActive = isNavItemActive(item.path);
                    return (
                      <Link
                        key={index}
                        href={item.path}
                        className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-[#FAF4E9] dark:bg-[#262118] text-[#C5A059] font-bold"
                            : "text-[#1A1714] dark:text-[#F5F1E8] hover:bg-[#FAF4E9]/60 dark:hover:bg-[#262118]/60"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="border-t border-[#E7E2D9] dark:border-[#2E2A24] my-3" />

                {/* Secondary Utility Links */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B6459] dark:text-[#A39B8B] block px-3 py-1">
                    {isRtl ? "صفحات إضافية" : "Pages & Info"}
                  </span>
                  {moreNavItems.map((item, index) => {
                    const isActive = isNavItemActive(item.path);
                    return (
                      <Link
                        key={index}
                        href={item.path}
                        className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-[#FAF4E9] dark:bg-[#262118] text-[#C5A059] font-bold"
                            : "text-[#6B6459] dark:text-[#A39B8B] hover:text-[#1A1714] dark:hover:text-[#F5F1E8]"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Global Auth Modal Triggered from Navbar */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        actionType="login"
      />
    </>
  );
}