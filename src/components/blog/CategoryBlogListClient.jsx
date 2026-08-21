"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import {
  Search,
  Grid,
  List,
  ArrowUpDown,
  BookOpen,
  Pin,
  Clock,
  Eye,
  Calendar,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Compass,
  Sparkles,
  Mail,
  CheckCircle,
  FolderOpen,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useDebounce } from "@/lib/useDebounce";
import { getMediaUrl } from "@/lib/api";
import { formatDynamicDate } from "@/lib/dateUtils";
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
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const superFeedContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
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

// Alternating Dynamic Entrance for Articles (Odd from Left, Even from Right with de-blur)
const getAlternatingArticleVariants = (index, isRtl) => {
  const isOdd = index % 2 === 0;
  const offset = isOdd ? -40 : 40;
  const initialX = isRtl ? -offset : offset;

  return {
    hidden: {
      opacity: 0,
      x: initialX,
      y: 26,
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

const sidebarWidgetVariants = {
  hidden: { opacity: 0, x: 30, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function CategoryBlogListClient({
  category,
  initialPosts = [],
  allCategories = [],
  trendingPosts = [],
}) {
  const { isRtl, locale } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const [sortOption, setSortOption] = useState("newest"); // 'newest' | 'views' | 'oldest'
  const [viewMode, setViewMode] = useState("list"); // 'list' (default) | 'grid'

  // Pagination state (default: 25 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Helper functions for strict database bilingual resolution
  function catNameAr(cat) {
    return cat?.nameAr && cat.nameAr.trim() !== "" ? cat.nameAr.trim() : null;
  }
  function catDescAr(cat) {
    return cat?.descriptionAr && cat.descriptionAr.trim() !== "" ? cat.descriptionAr.trim() : null;
  }
  function postTitleAr(p) {
    return p?.titleAr && p.titleAr.trim() !== "" ? p.titleAr.trim() : null;
  }
  function postExcerptAr(p) {
    return p?.excerptAr && p.excerptAr.trim() !== "" ? p.excerptAr.trim() : null;
  }

  // Category Icon & Names
  const Icon = resolveCategoryIcon(category?.icon);
  const categoryName = isRtl
    ? catNameAr(category) || category?.nameEn || "قسم المقالات"
    : category?.nameEn || catNameAr(category) || "Scholarly Category";

  const categoryDesc = isRtl
    ? catDescAr(category) || category?.descriptionEn || "استكشف كافة المقالات والأبحاث المنشورة في هذا القسم الأكاديمي."
    : category?.descriptionEn || catDescAr(category) || "Explore all research inquiries and scholarly papers curated in this discipline.";

  // Sub-categories / child disciplines if any
  const childCategories = useMemo(() => {
    if (!category?.id) return [];
    return allCategories.filter((c) => c.parentId === category.id);
  }, [category, allCategories]);

  // Filter and Sort posts
  const filteredPosts = useMemo(() => {
    let result = [...initialPosts];

    // Search filter
    if (debouncedSearch.trim() !== "") {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter((p) => {
        const titleEn = (p.titleEn || "").toLowerCase();
        const titleAr = (p.titleAr || "").toLowerCase();
        const excerptEn = (p.excerptEn || "").toLowerCase();
        const excerptAr = (p.excerptAr || "").toLowerCase();
        const authorName = (p.author?.name || "").toLowerCase();
        return (
          titleEn.includes(q) ||
          titleAr.includes(q) ||
          excerptEn.includes(q) ||
          excerptAr.includes(q) ||
          authorName.includes(q)
        );
      });
    }

    // Sort
    if (sortOption === "newest") {
      result.sort((a, b) => {
        // Pinned first, then publication date
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return (
          new Date(b.publishedAt || b.createdAt).getTime() -
          new Date(a.publishedAt || a.createdAt).getTime()
        );
      });
    } else if (sortOption === "views") {
      result.sort((a, b) => (b.views || b.viewCount || 0) - (a.views || a.viewCount || 0));
    } else if (sortOption === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.publishedAt || a.createdAt).getTime() -
          new Date(b.publishedAt || b.createdAt).getTime()
      );
    }

    return result;
  }, [initialPosts, debouncedSearch, sortOption]);

  // Spotlight Article (The first pinned article, or the leading newest article if none pinned)
  const spotlightPost = useMemo(() => {
    if (debouncedSearch.trim() !== "") return null; // Hide spotlight when searching
    if (filteredPosts.length === 0) return null;
    const pinned = filteredPosts.find((p) => p.isPinned);
    return pinned || (filteredPosts.length > 2 ? filteredPosts[0] : null);
  }, [filteredPosts, debouncedSearch]);

  // Articles to show in standard grid/list (exclude spotlight if it is displayed)
  const displayedPosts = useMemo(() => {
    if (spotlightPost && debouncedSearch.trim() === "") {
      return filteredPosts.filter((p) => p.id !== spotlightPost.id);
    }
    return filteredPosts;
  }, [filteredPosts, spotlightPost, debouncedSearch]);

  // Pagination calculation
  const totalItems = displayedPosts.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const paginatedPosts = useMemo(() => {
    return displayedPosts.slice(startIndex, startIndex + pageSize);
  }, [displayedPosts, startIndex, pageSize]);

  // Change page and smoothly scroll to the top of the article feed
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (typeof window !== "undefined") {
      const el = document.getElementById("category-feed-top");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setIsSubscribed(true);
      setNewsletterEmail("");
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0C0A09] text-stone-900 dark:text-stone-100 transition-colors">
      {/* 1. BALANCED CATEGORY HERO HEADER WITH FLOATING ORB ANIMATION */}
      <section className="relative bg-[#12100E] text-white pt-36 sm:pt-40 lg:pt-44 pb-16 sm:pb-20 lg:pb-24 px-5 overflow-hidden border-b border-[#C5A059]/30">
        {/* Ambient background glow & geometry */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.18, 0.35, 0.18],
              x: [0, 25, -25, 0],
              y: [0, -18, 18, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[620px] h-[620px] rounded-full blur-[120px]"
            style={{ backgroundColor: category?.color || "#C5A059" }}
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
          className="max-w-7xl mx-auto relative z-10"
        >
          {/* Breadcrumb Navigation */}
          <motion.div
            variants={heroItemVariants}
            className="flex items-center gap-2 text-xs font-semibold text-[#C5A059] uppercase tracking-wider mb-6"
          >
            <Link href="/" className="hover:underline transition-all">
              {isRtl ? "الرئيسية" : "Home"}
            </Link>
            <span>/</span>
            <Link href="/categories" className="hover:underline transition-all">
              {isRtl ? "دليل الأقسام" : "Categories"}
            </Link>
            <span>/</span>
            <span className="text-stone-400 truncate max-w-xs">{categoryName}</span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              {/* Category Icon Badge & Status */}
              <motion.div variants={heroItemVariants} className="flex items-center gap-3 mb-4">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 4 }}
                  transition={{ duration: 0.25 }}
                  style={category?.color ? { backgroundColor: category.color, color: "#ffffff" } : undefined}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#C5A059] text-white shadow-md cursor-pointer"
                >
                  <Icon size={24} strokeWidth={1.8} />
                </motion.div>

                {category?.isPinned && (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#FAF0D7] dark:bg-[#262118] text-[#B88A2B] dark:text-[#C5A059] border border-[#B88A2B]/30 flex items-center gap-1.5 shadow-xs"
                    title={isRtl ? "ركيزة علمية مثبتة" : "Pinned Strategic Pillar"}
                  >
                    <Pin size={12} className="fill-[#B88A2B] dark:fill-[#C5A059]" />
                    <span>{isRtl ? "ركيزة فكرية مثبتة" : "Strategic Pillar"}</span>
                  </span>
                )}
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={heroItemVariants}
                className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight mb-4"
              >
                {categoryName}
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={heroItemVariants}
                className="text-sm sm:text-base text-stone-300 dark:text-stone-400 leading-relaxed font-sans max-w-2xl"
              >
                {categoryDesc}
              </motion.p>

              {/* Child categories / Sub-disciplines pills if any */}
              {childCategories.length > 0 && (
                <motion.div
                  variants={heroItemVariants}
                  className="flex items-center gap-2 flex-wrap mt-6 pt-4 border-t border-white/10"
                >
                  <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                    {isRtl ? "التخصصات الفرعية:" : "Sub-disciplines:"}
                  </span>
                  {childCategories.map((sub) => {
                    const subName = isRtl
                      ? catNameAr(sub) || sub.nameEn
                      : sub.nameEn || catNameAr(sub);
                    return (
                      <Link
                        key={sub.id}
                        href={`/categories/${sub.slug}`}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 hover:bg-[#C5A059] text-white border border-white/15 transition-all hover:scale-105"
                      >
                        {subName}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* Metrics Badge */}
            <motion.div
              variants={heroItemVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.25 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-row md:flex-col items-center md:items-start justify-between gap-4 shrink-0"
            >
              <div>
                <span className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider block">
                  {isRtl ? "الأبحاث المنشورة" : "Published Papers"}
                </span>
                <p className="text-3xl font-serif font-bold text-white mt-0.5">
                  {initialPosts.length}
                </p>
              </div>

              <div className="border-s md:border-s-0 md:border-t border-white/10 ps-4 md:ps-0 md:pt-3">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  {isRtl ? "المستوى العلمي" : "Curation Standard"}
                </span>
                <span className="text-xs font-semibold text-stone-200 mt-0.5 inline-block">
                  {isRtl ? "محكّم وأصيل" : "Peer-Reviewed"}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 2. SPOTLIGHT LEAD ARTICLE (FEATURED / PINNED BANNER WITH CINEMATIC REVEAL) */}
      {spotlightPost && (
        <section className="max-w-7xl mx-auto px-5 -mt-8 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.96, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white dark:bg-[#141210] border border-[#C5A059]/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all group"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Cover Image */}
              <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto min-h-[260px] overflow-hidden bg-stone-100 dark:bg-stone-900">
                <Image
                  src={getMediaUrl(spotlightPost.featuredImage || spotlightPost.featuredImageUrl)}
                  alt={postTitleAr(spotlightPost) || spotlightPost.titleEn || "Featured Article"}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />

                {/* Spotlight Badge */}
                <div className="absolute top-4 start-4">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#FAF0D7] dark:bg-[#262118] text-[#B88A2B] dark:text-[#C5A059] border border-[#B88A2B]/40 shadow-sm flex items-center gap-1.5 backdrop-blur-md">
                    <Sparkles size={13} className="fill-[#B88A2B] dark:fill-[#C5A059]" />
                    <span>{isRtl ? "بحث مميز في القسم" : "Featured Spotlight"}</span>
                  </span>
                </div>
              </div>

              {/* Text & Content */}
              <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400 mb-3">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar size={13} />
                      {formatDynamicDate(spotlightPost.publishedAt || spotlightPost.createdAt, isRtl)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock size={13} /> 8 {isRtl ? "دقائق قراءة" : "min read"}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-stone-900 dark:text-white group-hover:text-[#B88A2B] dark:group-hover:text-[#C5A059] transition-colors leading-snug mb-3">
                    <Link
                      href={`/${spotlightPost.pageCategory?.slug || "research-studies"}/${spotlightPost.slug}`}
                    >
                      {isRtl
                        ? postTitleAr(spotlightPost) || spotlightPost.titleEn
                        : spotlightPost.titleEn || postTitleAr(spotlightPost)}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed mb-6">
                    {isRtl
                      ? postExcerptAr(spotlightPost) || spotlightPost.excerptEn
                      : spotlightPost.excerptEn || postExcerptAr(spotlightPost)}
                  </p>
                </div>

                {/* Footer: Author info + CTA */}
                <div className="flex items-center justify-between pt-5 border-t border-[#E5DCCB] dark:border-[#26221C] flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#C5A059]/40 bg-stone-100">
                      <Image
                        src={spotlightPost.author?.avatar || "/logo/logo.jpeg"}
                        alt={spotlightPost.author?.name || "Author"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-stone-900 dark:text-stone-100 block">
                        {spotlightPost.author?.name || (isRtl ? "أعلام الأمة" : "UST Scholar")}
                      </span>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400">
                        {isRtl ? "باحث ومفكر إسلامي" : "Senior Academic Fellow"}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/${spotlightPost.pageCategory?.slug || "research-studies"}/${spotlightPost.slug}`}
                    className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#B88A2B] text-white text-xs font-bold rounded-xl transition-all shadow-xs hover:shadow-md inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>{isRtl ? "قراءة البحث كاملاً" : "Read Full Inquiry"}</span>
                    {isRtl ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* 3. INTERACTIVE CONTROL TOOLBAR */}
      <section
        id="category-feed-top"
        className="sticky top-0 z-30 bg-white/90 dark:bg-[#12100E]/90 backdrop-blur-md border-b border-[#E5DCCB] dark:border-[#2E2A24] shadow-xs mt-10 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-5 py-3.5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
            {/* Search within Category */}
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
                    ? `ابحث داخل ${categoryName}...`
                    : `Search in ${categoryName}...`
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

            {/* Right: Results Count + Sort + View Mode */}
            <div className="flex items-center gap-2 justify-between sm:justify-end flex-wrap">
              <span className="text-xs text-stone-500 dark:text-stone-400 font-mono hidden md:inline-block">
                {totalItems} {isRtl ? "أبحاث متوفرة" : "articles"}
              </span>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 text-xs bg-[#F7F4EE] dark:bg-[#1A1714] border border-[#E5DCCB] dark:border-[#2E2A24] rounded-xl px-2.5 py-1.5">
                <ArrowUpDown size={13} className="text-stone-400 shrink-0" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-transparent text-xs font-bold text-stone-700 dark:text-stone-300 focus:outline-none cursor-pointer"
                >
                  <option value="newest">{isRtl ? "الأحدث نشراً" : "Newest"}</option>
                  <option value="views">{isRtl ? "الأكثر قراءة" : "Most Viewed"}</option>
                  <option value="oldest">{isRtl ? "الأقدم نشراً" : "Oldest"}</option>
                </select>
              </div>

              {/* Grid / List View Toggle */}
              <div className="flex items-center p-0.5 bg-[#F7F4EE] dark:bg-[#1A1714] rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24]">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  title={isRtl ? "عرض مجلة (قائمة)" : "Magazine List View"}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "list"
                      ? "bg-white dark:bg-[#262118] text-[#C5A059] shadow-2xs"
                      : "text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                  }`}
                >
                  <List size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  title={isRtl ? "عرض شبكي" : "Grid View"}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-[#262118] text-[#C5A059] shadow-2xs"
                      : "text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                  }`}
                >
                  <Grid size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MAIN ARTICLE FEED & STICKY SIDEBAR WITH SUPER ALTERNATING & FADE-OUT ANIMATIONS */}
      <main className="max-w-7xl mx-auto px-5 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* =========================================================================
              COL 1-8: ARTICLE FEED
              ========================================================================= */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {totalItems === 0 ? (
                /* Empty State */
                <motion.div
                  key="empty-posts"
                  initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white dark:bg-[#141210] border border-[#E5DCCB] dark:border-[#26221C] rounded-2xl p-16 text-center max-w-lg mx-auto shadow-xs"
                >
                  <div className="w-16 h-16 rounded-full bg-[#FAF0D7] dark:bg-[#262118] text-[#C5A059] mx-auto flex items-center justify-center mb-4">
                    <FolderOpen size={28} />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white mb-2">
                    {isRtl ? "لا توجد أبحاث حالياً في هذا القسم" : "No Articles in this Discipline"}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mb-6 leading-relaxed">
                    {isRtl
                      ? "لم يتم العثور على أبحاث تطابق البحث. تصفح باقي الأقسام والمحاور العلمية للمنبر."
                      : "No published papers match your inquiry. Explore our full taxonomy of disciplines."}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="px-4 py-2 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        {isRtl ? "مسح البحث" : "Clear Search"}
                      </button>
                    )}
                    <Link
                      href="/categories"
                      className="px-5 py-2 bg-[#C5A059] hover:bg-[#B88A2B] text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
                    >
                      {isRtl ? "عرض كل الأقسام" : "All Categories"}
                    </Link>
                  </div>
                </motion.div>
              ) : viewMode === "grid" ? (
                /* BENTO GRID OF POSTS (ALTERNATING ENTRANCE + FADE-OUT) */
                <motion.div
                  key={`grid-posts-${currentPage}-${debouncedSearch}-${sortOption}`}
                  variants={superFeedContainerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                  {paginatedPosts.map((post, idx) => {
                    const postTitle = isRtl
                      ? postTitleAr(post) || post.titleEn
                      : post.titleEn || postTitleAr(post);

                    const postExcerpt = isRtl
                      ? postExcerptAr(post) || post.excerptEn
                      : post.excerptEn || postExcerptAr(post);

                    const postUrl = `/${post.pageCategory?.slug || "research-studies"}/${post.slug}`;
                    const postViews = post.views || post.viewCount || 0;
                    const cardVariants = getAlternatingArticleVariants(idx, isRtl);

                    return (
                      <motion.article
                        key={post.id || idx}
                        variants={cardVariants}
                        whileHover={{
                          y: -8,
                          scale: 1.018,
                          transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white dark:bg-[#141210] border border-[#E5DCCB] dark:border-[#26221C] rounded-2xl overflow-hidden shadow-2xs hover:shadow-xl hover:border-[#C5A059]/80 transition-all flex flex-col justify-between group cursor-pointer"
                      >
                        <Link href={postUrl} className="flex flex-col justify-between h-full">
                          <div>
                            {/* Image Container */}
                            <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100 dark:bg-stone-900">
                              <Image
                                src={getMediaUrl(post.featuredImage || post.featuredImageUrl)}
                                alt={postTitle || "Article"}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              {post.isPinned && (
                                <div className="absolute top-2.5 end-2.5">
                                  <span className="p-1.5 rounded-lg bg-[#FAF0D7] dark:bg-[#262118] text-[#B88A2B] dark:text-[#C5A059] border border-[#B88A2B]/40 shadow-xs flex items-center justify-center">
                                    <Pin size={12} className="fill-[#B88A2B] dark:fill-[#C5A059]" />
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Content Body */}
                            <div className="p-5 space-y-2.5">
                              {/* Metadata Line */}
                              <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                                <span className="flex items-center gap-1">
                                  <Calendar size={12} />
                                  {formatDynamicDate(post.publishedAt || post.createdAt, isRtl)}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock size={12} /> 6 {isRtl ? "د" : "min"}
                                </span>
                              </div>

                              {/* Title */}
                              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 group-hover:text-[#B88A2B] dark:group-hover:text-[#C5A059] transition-colors line-clamp-2 leading-snug">
                                {postTitle}
                              </h3>

                              {/* Excerpt */}
                              <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                                {postExcerpt}
                              </p>
                            </div>
                          </div>

                          {/* Card Footer: Author + Views */}
                          <div className="p-5 pt-0 border-t border-[#E5DCCB]/60 dark:border-[#26221C] mt-2 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                            <div className="flex items-center gap-2 pt-3">
                              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[#C5A059]/40 bg-stone-100">
                                <Image
                                  src={post.author?.avatar || "/logo/logo.jpeg"}
                                  alt={post.author?.name || "Author"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="font-semibold text-stone-800 dark:text-stone-200 text-xs truncate max-w-[120px]">
                                {post.author?.name || (isRtl ? "أعلام الأمة" : "UST Scholar")}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 pt-3 font-mono text-[11px]">
                              <span className="flex items-center gap-1">
                                <Eye size={12} /> {postViews}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    );
                  })}
                </motion.div>
              ) : (
                /* MAGAZINE / EDITORIAL LIST VIEW (ALTERNATING SLIDE-IN + FADE-OUT) */
                <motion.div
                  key={`list-posts-${currentPage}-${debouncedSearch}-${sortOption}`}
                  variants={superFeedContainerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4"
                >
                  {paginatedPosts.map((post, idx) => {
                    const postTitle = isRtl
                      ? postTitleAr(post) || post.titleEn
                      : post.titleEn || postTitleAr(post);

                    const postExcerpt = isRtl
                      ? postExcerptAr(post) || post.excerptEn
                      : post.excerptEn || postExcerptAr(post);

                    const postUrl = `/${post.pageCategory?.slug || "research-studies"}/${post.slug}`;
                    const rowVariants = getAlternatingArticleVariants(idx, isRtl);

                    return (
                      <motion.article
                        key={post.id || idx}
                        variants={rowVariants}
                        whileHover={{
                          x: isRtl ? -6 : 6,
                          backgroundColor: "rgba(197, 160, 89, 0.04)",
                          transition: { duration: 0.25 },
                        }}
                        className="bg-white dark:bg-[#141210] border border-[#E5DCCB] dark:border-[#26221C] rounded-2xl p-4 sm:p-5 hover:border-[#C5A059]/80 hover:shadow-xl transition-all group"
                      >
                        <Link href={postUrl} className="flex flex-col sm:flex-row items-stretch gap-5">
                          {/* Thumbnail */}
                          <div className="relative w-full sm:w-48 aspect-[16/10] sm:aspect-square rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-900 shrink-0">
                            <Image
                              src={getMediaUrl(post.featuredImage || post.featuredImageUrl)}
                              alt={postTitle || "Article"}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>

                          {/* Body Details */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 font-mono mb-1.5">
                                <span className="flex items-center gap-1">
                                  <Calendar size={12} />
                                  {formatDynamicDate(post.publishedAt || post.createdAt, isRtl)}
                                </span>
                                <span>•</span>
                                <span>6 {isRtl ? "دقائق قراءة" : "min read"}</span>
                                {post.isPinned && (
                                  <>
                                    <span>•</span>
                                    <span className="text-[#B88A2B] dark:text-[#C5A059] font-bold flex items-center gap-0.5">
                                      <Pin size={10} className="fill-[#B88A2B] dark:fill-[#C5A059]" />
                                      {isRtl ? "مثبت" : "Pinned"}
                                    </span>
                                  </>
                                )}
                              </div>

                              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 group-hover:text-[#B88A2B] dark:group-hover:text-[#C5A059] transition-colors leading-snug mb-2">
                                {postTitle}
                              </h3>

                              <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                                {postExcerpt}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#E5DCCB]/60 dark:border-[#26221C] text-xs">
                              <span className="font-semibold text-stone-700 dark:text-stone-300">
                                {isRtl
                                  ? post.author?.nameAr || post.author?.name || "هيئة التحرير"
                                  : post.author?.name || post.author?.nameAr || "Editorial Board"}
                              </span>
                              <span className="text-[#B88A2B] dark:text-[#C5A059] font-bold inline-flex items-center gap-1 group-hover:underline">
                                <span>{isRtl ? "قراءة" : "Read"}</span>
                                {isRtl ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 5. MODERN NUMBERED PAGINATION WITH SMOOTH FADE-UP */}
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
                      <span className="font-bold text-stone-800 dark:text-stone-200">{totalItems}</span> مقالاً
                    </>
                  ) : (
                    <>
                      Showing <span className="font-bold text-stone-800 dark:text-stone-200">{startIndex + 1}</span>–
                      <span className="font-bold text-stone-800 dark:text-stone-200">{endIndex}</span> of{" "}
                      <span className="font-bold text-stone-800 dark:text-stone-200">{totalItems}</span> articles
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
          </div>

          {/* =========================================================================
              COL 9-12: STICKY SIDEBAR WITH CASCADING SLIDE-IN
              ========================================================================= */}
          <aside className="lg:col-span-4 space-y-6 sticky top-20">
            {/* Widget 1: Other Scholarly Disciplines */}
            <motion.div
              variants={sidebarWidgetVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="bg-white dark:bg-[#141210] border border-[#E5DCCB] dark:border-[#26221C] rounded-2xl p-6 shadow-2xs hover:border-[#C5A059]/50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E5DCCB] dark:border-[#26221C]">
                <Compass size={16} className="text-[#C5A059]" />
                <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white uppercase tracking-wider">
                  {isRtl ? "أقسام وتخصصات أخرى" : "Other Disciplines"}
                </h4>
              </div>

              <div className="space-y-2.5">
                {allCategories
                  .filter((c) => (c.type || "POST").toUpperCase() === "POST" && c.id !== category?.id)
                  .slice(0, 6)
                  .map((otherCat, i) => {
                    const OtherIcon = resolveCategoryIcon(otherCat.icon);
                    const name = isRtl
                      ? catNameAr(otherCat) || otherCat.nameEn
                      : otherCat.nameEn || catNameAr(otherCat);

                    return (
                      <motion.div
                        key={otherCat.id}
                        initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: i * 0.05 }}
                      >
                        <Link
                          href={`/categories/${otherCat.slug}`}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF0D7]/50 dark:hover:bg-[#1E1A14]/70 transition-colors group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              style={otherCat.color ? { backgroundColor: otherCat.color, color: "#fff" } : undefined}
                              className="w-7 h-7 rounded-lg flex items-center justify-center bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 shrink-0 transition-transform group-hover:scale-110"
                            >
                              <OtherIcon size={14} />
                            </div>
                            <span className="text-xs font-medium text-stone-800 dark:text-stone-200 group-hover:text-[#B88A2B] dark:group-hover:text-[#C5A059] transition-colors truncate">
                              {name}
                            </span>
                          </div>

                          <span className="text-[10px] font-mono font-bold text-stone-400 group-hover:text-[#B88A2B] dark:group-hover:text-[#C5A059] shrink-0">
                            {otherCat.postCount || 0}
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
              </div>

              <div className="pt-4 mt-2 border-t border-[#E5DCCB]/60 dark:border-[#26221C]">
                <Link
                  href="/categories"
                  className="text-xs font-bold text-[#B88A2B] dark:text-[#C5A059] hover:underline flex items-center justify-between"
                >
                  <span>{isRtl ? "عرض دليل الأقسام الكامل" : "Explore All Categories"}</span>
                  {isRtl ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
                </Link>
              </div>
            </motion.div>

            {/* Widget 2: Most Read in the Tribune */}
            {trendingPosts.length > 0 && (
              <motion.div
                variants={sidebarWidgetVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="bg-white dark:bg-[#141210] border border-[#E5DCCB] dark:border-[#26221C] rounded-2xl p-6 shadow-2xs hover:border-[#C5A059]/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E5DCCB] dark:border-[#26221C]">
                  <Sparkles size={16} className="text-[#C5A059]" />
                  <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white uppercase tracking-wider">
                    {isRtl ? "الأكثر قراءة في المنبر" : "Trending Inquiries"}
                  </h4>
                </div>

                <div className="space-y-3.5">
                  {trendingPosts.slice(0, 4).map((trend, i) => {
                    const title = isRtl
                      ? postTitleAr(trend) || trend.titleEn
                      : trend.titleEn || postTitleAr(trend);
                    const url = `/${trend.pageCategory?.slug || "research-studies"}/${trend.slug}`;

                    return (
                      <motion.div
                        key={trend.id || i}
                        initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: i * 0.05 }}
                      >
                        <Link
                          href={url}
                          className="flex items-start gap-3 group block"
                        >
                          <span className="text-sm font-serif font-bold text-[#C5A059] shrink-0 pt-0.5">
                            0{i + 1}
                          </span>
                          <div className="min-w-0">
                            <h5 className="text-xs font-serif font-bold text-stone-900 dark:text-stone-100 group-hover:text-[#B88A2B] dark:group-hover:text-[#C5A059] transition-colors line-clamp-2 leading-snug">
                              {title}
                            </h5>
                            <span className="text-[10px] text-stone-400 font-mono mt-1 block">
                              {new Date(trend.publishedAt || trend.createdAt).toLocaleDateString(
                                isRtl ? "ar-EG" : "en-US",
                                { month: "short", day: "numeric" }
                              )}
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Widget 3: Academic Newsletter Callout */}
            <motion.div
              variants={sidebarWidgetVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-[#12100E] to-[#1E1A14] text-white border border-[#C5A059]/40 rounded-2xl p-6 shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center mb-3">
                <Mail size={20} />
              </div>
              <h4 className="font-serif font-bold text-base text-white mb-1.5">
                {isRtl ? "النشرة العلمية الدورية" : "Discipline Dispatch"}
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed mb-4">
                {isRtl
                  ? `اشترك لتصلك أحدث أبحاث ودراسات ${categoryName} فور صدورها.`
                  : `Get notifications when new academic inquiries are published in ${categoryName}.`}
              </p>

              {isSubscribed ? (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle size={14} />
                  <span>{isRtl ? "تم الاشتراك بنجاح!" : "Subscribed successfully!"}</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder={isRtl ? "بريدك الإلكتروني..." : "Enter your email..."}
                    className="w-full py-2 px-3 text-xs bg-white/10 border border-white/20 rounded-xl text-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#C5A059] hover:bg-[#B88A2B] text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
                  >
                    {isRtl ? "اشتراك" : "Subscribe"}
                  </button>
                </form>
              )}
            </motion.div>
          </aside>
        </div>
      </main>
    </div>
  );
}
