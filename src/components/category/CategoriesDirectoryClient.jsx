"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import {
  Search,
  Grid,
  List,
  ArrowUpDown,
  BookOpen,
  Pin,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Compass,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useDebounce } from "@/lib/useDebounce";
import { EXPO_EASE } from "@/lib/animations";

// Fallback palette cycle matching the Tribune's brand identity
const DEFAULT_PALETTES = [
  { color: "bg-[#1E3A8A] text-white", icon: "BookOpen", accent: "#1E3A8A" },
  { color: "bg-[#065F46] text-white", icon: "Scale", accent: "#065F46" },
  { color: "bg-[#92400E] text-white", icon: "Compass", accent: "#92400E" },
  { color: "bg-[#4C1D95] text-white", icon: "Globe", accent: "#4C1D95" },
  { color: "bg-[#991B1B] text-white", icon: "Landmark", accent: "#991B1B" },
  { color: "bg-[#0F766E] text-white", icon: "Scroll", accent: "#0F766E" },
  { color: "bg-[#374151] text-white", icon: "Sparkles", accent: "#374151" },
];

function resolveCategoryIcon(iconName, fallbackIconName = "BookOpen") {
  if (iconName && typeof iconName === "string" && LucideIcons[iconName]) {
    return LucideIcons[iconName];
  }
  if (fallbackIconName && LucideIcons[fallbackIconName]) {
    return LucideIcons[fallbackIconName];
  }
  return BookOpen;
}

// Super Cinematic Animation Variants
const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

const superContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

// Alternating Dynamic Entrance Variants (Odd from Left, Even from Right with de-blur)
const getAlternatingCardVariants = (index, isRtl) => {
  const isOdd = index % 2 === 0;
  // If LTR: odd comes from left (-36px), even from right (+36px)
  // If RTL: odd comes from right (+36px), even from left (-36px)
  const offset = isOdd ? -36 : 36;
  const initialX = isRtl ? -offset : offset;

  return {
    hidden: {
      opacity: 0,
      x: initialX,
      y: 24,
      scale: 0.94,
      filter: "blur(6px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.94,
      filter: "blur(6px)",
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };
};

export default function CategoriesDirectoryClient({ initialCategories = [] }) {
  const { isRtl, locale } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const [sortOption, setSortOption] = useState("pinned_first"); // 'pinned_first' | 'posts_desc' | 'name_asc'
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'

  // Pagination state (default: 25 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Only consider POST categories (exclude PAGE section categories)
  const postCategories = useMemo(() => {
    return initialCategories.filter((c) => (c.type || "POST").toUpperCase() === "POST");
  }, [initialCategories]);

  // Map parents for sub-category resolution
  const categoryMap = useMemo(() => {
    const map = new Map();
    postCategories.forEach((c) => map.set(c.id, c));
    return map;
  }, [postCategories]);

  // Filter & Sort post categories using debounced search query
  const filteredCategories = useMemo(() => {
    return postCategories
      .filter((cat) => {
        if (debouncedSearch.trim() !== "") {
          const q = debouncedSearch.toLowerCase().trim();
          const matchEn = (cat.nameEn || "").toLowerCase().includes(q);
          const matchAr = (cat.nameAr || "").toLowerCase().includes(q);
          const matchSlug = (cat.slug || "").toLowerCase().includes(q);
          const matchDescEn = (cat.descriptionEn || "").toLowerCase().includes(q);
          const matchDescAr = (cat.descriptionAr || "").toLowerCase().includes(q);
          if (!matchEn && !matchAr && !matchSlug && !matchDescEn && !matchDescAr) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOption === "pinned_first") {
          // Pinned first, then latest pinned (pinnedAt), then post count
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          if (a.isPinned && b.isPinned) {
            const timeA = new Date(a.pinnedAt || a.updatedAt || a.createdAt).getTime();
            const timeB = new Date(b.pinnedAt || b.updatedAt || b.createdAt).getTime();
            return timeB - timeA;
          }
          return (b.postCount || 0) - (a.postCount || 0);
        }
        if (sortOption === "posts_desc") {
          return (b.postCount || 0) - (a.postCount || 0);
        }
        if (sortOption === "name_asc") {
          const nameA = (isRtl
            ? (catNameAr(a) || a.nameEn || "")
            : (a.nameEn || a.nameAr || "")
          ).toLowerCase();
          const nameB = (isRtl
            ? (catNameAr(b) || b.nameEn || "")
            : (b.nameEn || b.nameAr || "")
          ).toLowerCase();
          return nameA.localeCompare(nameB);
        }
        return 0;
      });
  }, [postCategories, debouncedSearch, sortOption, isRtl]);

  // Helpers for bilingual text resolution from database
  function catNameAr(cat) {
    return cat?.nameAr && cat.nameAr.trim() !== "" ? cat.nameAr.trim() : null;
  }
  function catDescAr(cat) {
    return cat?.descriptionAr && cat.descriptionAr.trim() !== "" ? cat.descriptionAr.trim() : null;
  }

  // Pagination calculation
  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const paginatedCategories = useMemo(() => {
    return filteredCategories.slice(startIndex, startIndex + pageSize);
  }, [filteredCategories, startIndex, pageSize]);

  // Change page and smoothly scroll to the top of the directory grid
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (typeof window !== "undefined") {
      const el = document.getElementById("categories-directory-top");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0C0A09] text-stone-900 dark:text-stone-100 transition-colors">
      {/* 1. CENTERED ELEGANT HERO HEADER WITH AMBIENT FLOATING GLOW */}
      <section className="relative bg-[#12100E] text-white pt-36 sm:pt-40 lg:pt-44 pb-16 sm:pb-20 lg:pb-24 px-5 overflow-hidden border-b border-[#C5A059]/30 text-center">
        {/* Continuous breathing glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.3, 0.15],
              x: [0, 20, -20, 0],
              y: [0, -15, 15, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-[#C5A059] rounded-full blur-[110px]"
          />
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: `radial-gradient(#C5A059 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <motion.div
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto relative z-10 text-center"
        >
          <motion.h1
            variants={heroItemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight mb-4 text-center"
          >
            {isRtl ? (
              <>
                ركائز الفكر والمناهج العلمية{" "}
                <span className="text-[#C5A059] italic">المعتمدة</span>
              </>
            ) : (
              <>
                Pillars of Scholarly Inquiry &{" "}
                <span className="text-[#C5A059] italic">Academic Disciplines</span>
              </>
            )}
          </motion.h1>

          <motion.p
            variants={heroItemVariants}
            className="text-sm sm:text-base text-stone-300 dark:text-stone-400 leading-relaxed font-sans max-w-2xl mx-auto text-center"
          >
            {isRtl
              ? "دليل شامل ومصنف للمحاور الفكرية، الدراسات التأسيسية، والقضايا المعاصرة التي يتناولها منبر أعلام الأمة برؤية رصينة ومنهجية محكمة."
              : "A comprehensive taxonomy of intellectual pillars, foundational Islamic studies, civilizational inquiries, and contemporary discourses curated by the Ummah Scholars Tribune."}
          </motion.p>
        </motion.div>
      </section>

      {/* 2. STREAMLINED TOOLBAR */}
      <section
        id="categories-directory-top"
        className="sticky top-0 z-30 bg-white/90 dark:bg-[#12100E]/90 backdrop-blur-md border-b border-[#E5DCCB] dark:border-[#2E2A24] shadow-xs scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-5 py-3.5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
            {/* Debounced Search Input */}
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search
                size={16}
                className={`absolute top-1/2 -translate-y-1/2 text-stone-400 ${
                  isRtl ? "right-3.5" : "left-3.5"
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={
                  isRtl
                    ? "ابحث عن تخصص، ركيزة، أو كلمة مفتاحية..."
                    : "Search categories, pillars, topics..."
                }
                className={`w-full py-2 text-xs font-medium bg-[#F7F4EE] dark:bg-[#1A1714] border border-[#E5DCCB] dark:border-[#2E2A24] rounded-xl text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all ${
                  isRtl ? "pr-10 pl-9" : "pl-10 pr-9"
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className={`absolute top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer ${
                    isRtl ? "left-3" : "right-3"
                  }`}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Right: Sort & View Toggle */}
            <div className="flex items-center gap-2 justify-between sm:justify-end flex-wrap">
              {/* Count Indicator */}
              <span className="text-xs text-stone-500 dark:text-stone-400 font-mono hidden md:inline-block">
                {totalItems} {isRtl ? "قسماً متاحاً" : "categories"}
              </span>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 text-xs bg-[#F7F4EE] dark:bg-[#1A1714] border border-[#E5DCCB] dark:border-[#2E2A24] rounded-xl px-2.5 py-1.5">
                <ArrowUpDown size={13} className="text-stone-400 shrink-0" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-transparent text-xs font-bold text-stone-700 dark:text-stone-300 focus:outline-none cursor-pointer"
                >
                  <option value="pinned_first">
                    {isRtl ? "المثبتة أولاً" : "Pinned First"}
                  </option>
                  <option value="posts_desc">
                    {isRtl ? "الأكثر بحوثاً" : "Most Papers"}
                  </option>
                  <option value="name_asc">
                    {isRtl ? "أبجدياً (A-Z)" : "Alphabetical (A-Z)"}
                  </option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center p-0.5 bg-[#F7F4EE] dark:bg-[#1A1714] rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24]">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  title={isRtl ? "عرض الشبكة" : "Grid View"}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-[#262118] text-[#C5A059] shadow-2xs"
                      : "text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                  }`}
                >
                  <Grid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  title={isRtl ? "عرض القائمة" : "List View"}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "list"
                      ? "bg-white dark:bg-[#262118] text-[#C5A059] shadow-2xs"
                      : "text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                  }`}
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN DIRECTORY CONTENT WITH SUPER ALTERNATING & FADE-OUT ANIMATIONS */}
      <main className="max-w-7xl mx-auto px-5 py-12">
        <AnimatePresence mode="wait">
          {totalItems === 0 ? (
            /* Empty State */
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-[#12100E] border border-[#E5DCCB] dark:border-[#2E2A24] rounded-2xl p-16 text-center max-w-lg mx-auto shadow-xs"
            >
              <div className="w-16 h-16 rounded-full bg-[#FAF0D7] dark:bg-[#262118] text-[#C5A059] mx-auto flex items-center justify-center mb-4">
                <Compass size={28} />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white mb-2">
                {isRtl ? "لم يتم العثور على نتائج" : "No Categories Found"}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-6 leading-relaxed">
                {isRtl
                  ? "لم نتمكن من العثور على أي قسم يطابق معايير البحث الحالية. جرّب استخدام كلمات بحث أخرى."
                  : "No post categories matched your search term. Try searching for a different keyword."}
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#B88A2B] text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                {isRtl ? "مسح البحث" : "Clear Search"}
              </button>
            </motion.div>
          ) : viewMode === "grid" ? (
            /* BENTO GRID VIEW (ALTERNATING LEFT/RIGHT SLIDE-IN + FADE-OUT) */
            <motion.div
              key={`grid-page-${currentPage}-${debouncedSearch}-${sortOption}`}
              variants={superContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {paginatedCategories.map((cat, idx) => {
                const fallbackPalette = DEFAULT_PALETTES[idx % DEFAULT_PALETTES.length];
                const Icon = resolveCategoryIcon(cat.icon, fallbackPalette.icon);

                // Strict bilingual resolution from database
                const displayName = isRtl
                  ? catNameAr(cat) || cat.nameEn || "قسم علمي"
                  : cat.nameEn || catNameAr(cat) || "Scholarly Discipline";

                const displayDesc = isRtl
                  ? catDescAr(cat) || cat.descriptionEn || "استكشف المقالات والبحوث المنشورة في هذا القسم."
                  : cat.descriptionEn || catDescAr(cat) || "Explore scholarly inquiries and publications curated in this discipline.";

                const count = typeof cat.postCount === "number" ? cat.postCount : 0;
                const parent = cat.parentId ? categoryMap.get(cat.parentId) : null;
                const parentName = parent
                  ? isRtl
                    ? catNameAr(parent) || parent.nameEn
                    : parent.nameEn || catNameAr(parent)
                  : null;

                const targetUrl = `/categories/${cat.slug}`;
                const cardVariants = getAlternatingCardVariants(idx, isRtl);

                return (
                  <motion.div
                    key={cat.id || idx}
                    variants={cardVariants}
                    whileHover={{
                      y: -8,
                      scale: 1.018,
                      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`group relative rounded-2xl p-6 transition-colors duration-300 flex flex-col justify-between border cursor-pointer ${
                      cat.isPinned
                        ? "bg-[#FAF0D7] dark:bg-[#1E1A14] border-[#B88A2B]/60 dark:border-[#C5A059]/40 shadow-sm hover:shadow-xl hover:border-[#B88A2B]"
                        : "bg-white dark:bg-[#141210] border-[#E5DCCB] dark:border-[#26221C] shadow-2xs hover:border-[#C5A059]/80 hover:shadow-xl"
                    }`}
                  >
                    <Link href={targetUrl} className="flex flex-col justify-between h-full group">
                      <div>
                        {/* Top Bar: Icon + Pinned Badge */}
                        <div className="flex items-center justify-between mb-5">
                          <motion.div
                            whileHover={{ rotate: 4, scale: 1.12 }}
                            transition={{ duration: 0.2 }}
                            style={cat.color ? { backgroundColor: cat.color, color: "#ffffff" } : undefined}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs ${
                              !cat.color ? fallbackPalette.color : ""
                            }`}
                          >
                            <Icon size={22} strokeWidth={1.8} />
                          </motion.div>

                          {cat.isPinned && (
                            <span
                              className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#FAF0D7] dark:bg-[#262118] text-[#B88A2B] dark:text-[#C5A059] border border-[#B88A2B]/30 flex items-center gap-1.5 ms-auto shadow-2xs"
                              title={isRtl ? "ركيزة علمية مثبتة" : "Pinned Strategic Pillar"}
                            >
                              <Pin size={11} className="fill-[#B88A2B] dark:fill-[#C5A059]" />
                              <span>{isRtl ? "مثبت" : "Pinned"}</span>
                            </span>
                          )}
                        </div>

                        {/* Parent Category Breadcrumb if Nested */}
                        {parentName && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1 block truncate">
                            {isRtl ? `فرع من: ${parentName}` : `Under: ${parentName}`}
                          </span>
                        )}

                        {/* Title */}
                        <h2 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 group-hover:text-[#B88A2B] dark:group-hover:text-[#C5A059] transition-colors line-clamp-1 mb-2">
                          {displayName}
                        </h2>

                        {/* Description */}
                        <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed mb-6">
                          {displayDesc}
                        </p>
                      </div>

                      {/* Card Footer: Article Count & CTA */}
                      <div className="pt-4 border-t border-[#E5DCCB]/60 dark:border-[#26221C] flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-stone-500 dark:text-stone-400">
                          {isRtl
                            ? count === 0
                              ? "لا توجد مقالات"
                              : count === 1
                              ? "مقال وبحث واحد"
                              : count === 2
                              ? "مقالان وبحثان"
                              : count >= 3 && count <= 10
                              ? `${count} مقالات`
                              : `${count} مقالاً`
                            : count === 1
                            ? "1 Paper"
                            : `${count} Papers`}
                        </span>

                        <span className="font-bold text-[#B88A2B] dark:text-[#C5A059] inline-flex items-center gap-1 group-hover:underline">
                          <span>{isRtl ? "تصفح القسم" : "Explore"}</span>
                          {isRtl ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* CATALOG LIST VIEW (ALTERNATING SLIDE-IN + FADE-OUT) */
            <motion.div
              key={`list-page-${currentPage}-${debouncedSearch}-${sortOption}`}
              variants={superContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-[#141210] border border-[#E5DCCB] dark:border-[#26221C] rounded-2xl overflow-hidden shadow-2xs"
            >
              <div className="divide-y divide-[#E5DCCB]/60 dark:divide-[#26221C]">
                {paginatedCategories.map((cat, idx) => {
                  const fallbackPalette = DEFAULT_PALETTES[idx % DEFAULT_PALETTES.length];
                  const Icon = resolveCategoryIcon(cat.icon, fallbackPalette.icon);

                  // Strict bilingual resolution from database
                  const displayName = isRtl
                    ? catNameAr(cat) || cat.nameEn || "قسم علمي"
                    : cat.nameEn || catNameAr(cat) || "Scholarly Discipline";

                  const displayDesc = isRtl
                    ? catDescAr(cat) || cat.descriptionEn || "استكشف المقالات والبحوث المنشورة في هذا القسم."
                    : cat.descriptionEn || catDescAr(cat) || "Explore scholarly inquiries and publications curated in this discipline.";

                  const count = typeof cat.postCount === "number" ? cat.postCount : 0;
                  const parent = cat.parentId ? categoryMap.get(cat.parentId) : null;
                  const parentName = parent
                    ? isRtl
                      ? catNameAr(parent) || parent.nameEn
                      : parent.nameEn || catNameAr(parent)
                    : null;

                  const targetUrl = `/categories/${cat.slug}`;
                  const rowVariants = getAlternatingCardVariants(idx, isRtl);

                  return (
                    <motion.div
                      key={cat.id || idx}
                      variants={rowVariants}
                      whileHover={{
                        x: isRtl ? -6 : 6,
                        backgroundColor: "rgba(197, 160, 89, 0.06)",
                        transition: { duration: 0.2 },
                      }}
                    >
                      <Link
                        href={targetUrl}
                        className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors group block"
                      >
                        {/* Left: Icon + Title + Description */}
                        <div className="flex items-start gap-4 min-w-0 flex-1">
                          <div
                            style={cat.color ? { backgroundColor: cat.color, color: "#ffffff" } : undefined}
                            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-transform duration-300 group-hover:scale-110 ${
                              !cat.color ? fallbackPalette.color : ""
                            }`}
                          >
                            <Icon size={20} strokeWidth={1.8} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 group-hover:text-[#B88A2B] dark:group-hover:text-[#C5A059] transition-colors truncate">
                                {displayName}
                              </h3>

                              {cat.isPinned && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FAF0D7] dark:bg-[#262118] text-[#B88A2B] dark:text-[#C5A059] border border-[#B88A2B]/30 flex items-center gap-1">
                                  <Pin size={9} className="fill-[#B88A2B] dark:fill-[#C5A059]" />
                                  <span>{isRtl ? "مثبت" : "Pinned"}</span>
                                </span>
                              )}
                            </div>

                            {parentName && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1 block">
                                {isRtl ? `فرع من: ${parentName}` : `Under: ${parentName}`}
                              </span>
                            )}

                            <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-1 leading-relaxed">
                              {displayDesc}
                            </p>
                          </div>
                        </div>

                        {/* Right: Article Count & Action */}
                        <div className="flex items-center gap-3 shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[#E5DCCB]/60 text-end min-w-[80px]">
                          <div>
                            <span className="text-xs font-mono font-bold text-stone-800 dark:text-stone-200 block">
                              {isRtl
                                ? count === 0
                                  ? "لا توجد مقالات"
                                  : count === 1
                                  ? "بحث واحد"
                                  : count === 2
                                  ? "بحثان"
                                  : count <= 10
                                  ? `${count} أبحاث`
                                  : `${count} بحثاً`
                                : `${count} ${count === 1 ? "Paper" : "Papers"}`}
                            </span>
                            <span className="text-[10px] text-[#B88A2B] dark:text-[#C5A059] font-semibold group-hover:underline inline-flex items-center gap-1">
                              <span>{isRtl ? "تصفح القسم" : "Explore"}</span>
                              {isRtl ? <ArrowLeft size={10} /> : <ArrowRight size={10} />}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. MODERN NUMBERED PAGINATION WITH SMOOTH FADE-UP */}
        {(totalItems > 10 || totalPages > 1) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 pt-6 border-t border-[#E5DCCB]/60 dark:border-[#26221C] flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            {/* Left: Range Info */}
            <div className="text-xs font-mono text-stone-500 dark:text-stone-400 order-2 sm:order-1">
              {isRtl ? (
                <>
                  عرض <span className="font-bold text-stone-800 dark:text-stone-200">{startIndex + 1}</span>–
                  <span className="font-bold text-stone-800 dark:text-stone-200">{endIndex}</span> من أصل{" "}
                  <span className="font-bold text-stone-800 dark:text-stone-200">{totalItems}</span> قسماً
                </>
              ) : (
                <>
                  Showing <span className="font-bold text-stone-800 dark:text-stone-200">{startIndex + 1}</span>–
                  <span className="font-bold text-stone-800 dark:text-stone-200">{endIndex}</span> of{" "}
                  <span className="font-bold text-stone-800 dark:text-stone-200">{totalItems}</span> categories
                </>
              )}
            </div>

            {/* Middle: Numbered Navigation Buttons */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5 order-1 sm:order-2">
                {/* Previous Button */}
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  title={isRtl ? "الصفحة السابقة" : "Previous Page"}
                  className="p-2 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-white dark:bg-[#1A1714] text-stone-700 dark:text-stone-300 disabled:opacity-35 disabled:cursor-not-allowed hover:bg-[#FAF0D7] dark:hover:bg-[#262118] transition-colors cursor-pointer"
                >
                  {isRtl ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
                </button>

                {/* Page Number Buttons */}
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#C5A059] text-white shadow-xs"
                          : "bg-white dark:bg-[#1A1714] border border-[#E5DCCB] dark:border-[#2E2A24] text-stone-700 dark:text-stone-300 hover:bg-[#FAF0D7] dark:hover:bg-[#262118]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  title={isRtl ? "الصفحة التالية" : "Next Page"}
                  className="p-2 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-white dark:bg-[#1A1714] text-stone-700 dark:text-stone-300 disabled:opacity-35 disabled:cursor-not-allowed hover:bg-[#FAF0D7] dark:hover:bg-[#262118] transition-colors cursor-pointer"
                >
                  {isRtl ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
                </button>
              </div>
            )}

            {/* Right: Page Size Selector */}
            <div className="flex items-center gap-2 text-xs order-3">
              <span className="text-stone-500 dark:text-stone-400 font-medium">
                {isRtl ? "عرض في الصفحة:" : "Show:"}
              </span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white dark:bg-[#1A1714] border border-[#E5DCCB] dark:border-[#2E2A24] rounded-xl px-2.5 py-1 text-xs font-bold text-stone-700 dark:text-stone-300 focus:outline-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </motion.div>
        )}
      </main>

      {/* 5. SCHOLARLY METHODOLOGY CALLOUT */}
      <section className="bg-[#FAF4E9] dark:bg-[#12100E] border-t border-[#E5DCCB] dark:border-[#26221C] py-16 px-5 transition-colors">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="bg-gradient-to-r from-[#12100E] to-[#1E1A14] text-white rounded-3xl p-8 sm:p-12 border border-[#C5A059]/40 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8"
          >
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-3 block">
                {isRtl ? "المنهجية العلمية والتحكيم" : "Methodological Rigor & Curation"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3">
                {isRtl
                  ? "أصالة المنهج، وعمق المعرفة، واستيعاب الواقع"
                  : "Preserving Authentic Inquiry in Contemporary Discourse"}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                {isRtl
                  ? "تخضع كافة المواد المنشورة في هذه الأقسام للتدقيق والتحكيم المنهجي لضمان استيفاء المعايير الأكاديمية والشرعية الرصينة."
                  : "All papers, research studies, and scholarly perspectives in these disciplines undergo rigorous methodological curation to ensure fidelity to foundational Islamic scholarship."}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/research"
                className="px-6 py-3 bg-[#C5A059] hover:bg-[#B88A2B] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                {isRtl ? "تصفح الدراسات والبحوث" : "Explore Research Papers"}
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all cursor-pointer"
              >
                {isRtl ? "عن المنبر ورسالته" : "About the Tribune"}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
