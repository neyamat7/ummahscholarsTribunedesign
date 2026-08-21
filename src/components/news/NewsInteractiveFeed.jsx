"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Grid,
  List,
  ArrowUpDown,
  Filter,
  Flame,
  Calendar,
  Clock,
  Eye,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  CheckCircle2,
  Share2,
  Copy,
  Sparkles,
  Award,
  BookOpen,
  Send,
  Building,
  TrendingUp,
  Tag,
  Check,
  Radio,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getMediaUrl } from "@/lib/api";
import { useDebounce } from "@/lib/useDebounce";
import { toast } from "sonner";

/**
 * Dynamic Date Formatter: min -> hour -> days -> "Aug 18, 2026"
 */
export function formatDynamicDate(dateInput, isRtl = false) {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  // Under 1 minute
  if (diffSec < 60 && diffSec >= 0) {
    return isRtl ? "الآن" : "Just now";
  }

  // Under 60 minutes
  if (diffMin < 60 && diffMin >= 1) {
    if (isRtl) {
      if (diffMin === 1) return "منذ دقيقة";
      if (diffMin === 2) return "منذ دقيقتين";
      if (diffMin <= 10) return `منذ ${diffMin} دقائق`;
      return `منذ ${diffMin} دقيقة`;
    }
    return `${diffMin} min ago`;
  }

  // Under 24 hours
  if (diffHour < 24 && diffHour >= 1) {
    if (isRtl) {
      if (diffHour === 1) return "منذ ساعة";
      if (diffHour === 2) return "منذ ساعتين";
      if (diffHour <= 10) return `منذ ${diffHour} ساعات`;
      return `منذ ${diffHour} ساعة`;
    }
    return `${diffHour} ${diffHour === 1 ? "hour" : "hours"} ago`;
  }

  // Under 7 days
  if (diffDay < 7 && diffDay >= 1) {
    if (isRtl) {
      if (diffDay === 1) return "منذ يوم";
      if (diffDay === 2) return "منذ يومين";
      if (diffDay <= 10) return `منذ ${diffDay} أيام`;
      return `منذ ${diffDay} يوم`;
    }
    return `${diffDay} ${diffDay === 1 ? "day" : "days"} ago`;
  }

  // Older than 7 days: formatted full date like "Aug 18, 2026"
  return date.toLocaleDateString(isRtl ? "ar-SA" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NewsInteractiveFeed({
  initialPosts = [],
  categories = [],
  trendingPosts = [],
}) {
  const { isRtl } = useLanguage();

  // Search & Filter state (debounced)
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [viewMode, setViewMode] = useState("list"); // "list" (default) | "grid"
  const [sortBy, setSortBy] = useState("newest"); // "newest" | "views" | "oldest"
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Copy state for press desk email and card share
  const [pressEmailCopied, setPressEmailCopied] = useState(false);
  const [copiedCardId, setCopiedCardId] = useState(null);

  const feedRef = useRef(null);

  // Bilingual UI Dictionary
  const dict = {
    searchPlaceholder: isRtl ? "ابحث في الأخبار والبيانات الصحفية..." : "Search news, press releases, dispatches...",
    allTopics: isRtl ? "جميع المواضيع" : "All Topics",
    sortBy: isRtl ? "الترتيب:" : "Sort by:",
    newest: isRtl ? "الأحدث أولاً" : "Latest First",
    mostRead: isRtl ? "الأكثر قراءة" : "Most Read",
    oldest: isRtl ? "الأقدم" : "Oldest",
    gridView: isRtl ? "عرض الشبكة" : "Grid View",
    listView: isRtl ? "عرض القائمة" : "List View",
    trendingHeader: isRtl ? "الأخبار الأكثر تداولاً" : "Trending Dispatches",
    pressDeskTitle: isRtl ? "المكتب الإعلامي والصحفي" : "Press & Media Inquiries",
    pressDeskDesc: isRtl
      ? "للتواصل مع هيئة التحرير والتنسيق الصحفي للبيانات الرسمية:"
      : "For press credentials, official statements, and media coordination:",
    copyEmail: isRtl ? "نسخ البريد الصحفي" : "Copy Press Email",
    emailCopied: isRtl ? "تم نسخ البريد الصحفي" : "Press email copied",
    newsletterTitle: isRtl ? "النشرة الإخبارية التنفيذية" : "Executive Press Dispatch",
    newsletterDesc: isRtl
      ? "اشترك لتصلك البيانات والقرارات الأكاديمية الصادرة عن المنبر فور اعتمادها."
      : "Subscribe to receive verified academic declarations and official releases directly in your inbox.",
    emailPlaceholder: isRtl ? "أدخل بريدك الإلكتروني" : "Enter your official email",
    subscribeBtn: isRtl ? "اشتراك فوري" : "Subscribe",
    subscribedSuccess: isRtl ? "تم تسجيل اشتراكك في النشرة الإخبارية بنجاح" : "Successfully subscribed to the Executive Press Dispatch",
    topicsTitle: isRtl ? "مواضيع شائعة" : "Popular Topics",
    readFull: isRtl ? "اقرأ البيان كاملاً" : "Read Full Dispatch",
    minRead: isRtl ? "دقائق قراءة" : "min read",
    views: isRtl ? "مشاهدة" : "views",
    officialRelease: isRtl ? "بيان رسمي" : "Official Release",
    noResults: isRtl ? "لم يتم العثور على أي أخبار أو بيانات مطابقة" : "No matching dispatches or announcements found",
    noResultsDesc: isRtl
      ? "حاول تعديل كلمات البحث أو تصفية التصنيفات للحصول على نتائج أدق."
      : "Try adjusting your search query or selecting another topic filter.",
    resetFilters: isRtl ? "إعادة ضبط الفلاتر" : "Reset Filters",
    showing: isRtl ? "عرض" : "Showing",
    to: isRtl ? "إلى" : "to",
    of: isRtl ? "من أصل" : "of",
    results: isRtl ? "إعلان وبيان" : "dispatches",
    prev: isRtl ? "السابق" : "Previous",
    next: isRtl ? "التالي" : "Next",
  };

  // Filter & Sort logic
  const filteredPosts = useMemo(() => {
    let result = [...initialPosts];

    // 1. Category Filter
    if (selectedCategory !== "ALL") {
      result = result.filter((p) => {
        const catId = p.categoryId || p.category?.id || p.category?.slug;
        return catId === selectedCategory;
      });
    }

    // 2. Search Filter (debounced for smooth performance)
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter((p) => {
        const title = (p.titleEn || p.titleAr || "").toLowerCase();
        const excerpt = (p.excerptEn || p.excerptAr || "").toLowerCase();
        const catName = (p.category?.nameEn || p.category?.nameAr || "").toLowerCase();
        return title.includes(q) || excerpt.includes(q) || catName.includes(q);
      });
    }

    // 3. Sort Order
    result.sort((a, b) => {
      if (sortBy === "views") {
        return (b.viewCount || 0) - (a.viewCount || 0);
      }
      if (sortBy === "oldest") {
        const dateA = new Date(a.publishedAt || a.createdAt).getTime();
        const dateB = new Date(b.publishedAt || b.createdAt).getTime();
        return dateA - dateB;
      }
      const dateA = new Date(a.publishedAt || a.createdAt).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt).getTime();
      return dateB - dateA;
    });

    return result;
  }, [initialPosts, selectedCategory, debouncedSearch, sortBy]);

  // Pagination calculation
  const totalItems = filteredPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + pageSize);

  // Derive ONLY categories that actually exist in this page's posts
  const availableCategories = useMemo(() => {
    const map = new Map();

    initialPosts.forEach((post) => {
      const catObj = post.category;
      const catId = post.categoryId || catObj?.id || catObj?.slug;
      if (!catId) return;

      if (!map.has(catId)) {
        const matchingCat = categories.find((c) => c.id === catId || c.slug === catId);
        map.set(catId, {
          id: catId,
          nameEn: catObj?.nameEn || matchingCat?.nameEn || catId,
          nameAr: catObj?.nameAr || matchingCat?.nameAr || catId,
          count: 1,
        });
      } else {
        map.get(catId).count += 1;
      }
    });

    return Array.from(map.values()).filter((c) => c.count > 0);
  }, [initialPosts, categories]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory, sortBy, pageSize]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (feedRef.current) {
      feedRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      setNewsletterEmail("");
      toast.success(dict.subscribedSuccess);
    }, 600);
  };

  const handleCopyPressEmail = () => {
    navigator.clipboard.writeText("press@ummahscholar.com");
    setPressEmailCopied(true);
    toast.success(dict.emailCopied);
    setTimeout(() => setPressEmailCopied(false), 2500);
  };

  const handleShareCard = async (e, post) => {
    e.preventDefault();
    e.stopPropagation();
    const postUrl = `/${post.pageCategory?.slug || "news-announcements"}/${post.slug || post.id}`;
    if (typeof window !== "undefined") {
      const fullUrl = `${window.location.origin}${postUrl}`;
      try {
        await navigator.clipboard.writeText(fullUrl);
        setCopiedCardId(post.id);
        toast.success(isRtl ? "تم نسخ رابط الإعلان" : "Link copied to clipboard");
        setTimeout(() => setCopiedCardId(null), 2000);
      } catch (err) {
        toast.error(isRtl ? "تعذر نسخ الرابط" : "Failed to copy link");
      }
    }
  };

  return (
    <div ref={feedRef} className="bg-[#FBF9F6] dark:bg-[#0F0D0B] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* INTERACTIVE CONTROLS HUB */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#161412] border border-[#E5DCCB] dark:border-[#2E2A24] shadow-md space-y-5 mb-10"
        >
          {/* Row 1: Search & View Modes & Sort */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Live Search Input */}
            <div className="relative flex-1">
              <Search
                size={18}
                className={`absolute top-1/2 -translate-y-1/2 text-[#78716C] dark:text-[#A39B8B] ${
                  isRtl ? "right-3.5" : "left-3.5"
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={dict.searchPlaceholder}
                className={`w-full py-2.5 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-[#FBF9F6] dark:bg-[#0F0D0B] text-sm text-[#1C1917] dark:text-[#F5F1E8] placeholder-[#78716C] dark:placeholder-[#A39B8B] focus:outline-hidden focus:ring-2 focus:ring-[#B88A2B] dark:focus:ring-[#D4AF37] transition-all ${
                  isRtl ? "pr-10 pl-9" : "pl-10 pr-9"
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className={`absolute top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer ${
                    isRtl ? "left-3" : "right-3"
                  }`}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* View Switcher & Sort Selector */}
            <div className="flex items-center gap-3 self-end md:self-auto shrink-0 flex-wrap">
              {/* Sort Dropdown */}
              <div className="relative flex items-center gap-1.5 bg-[#FBF9F6] dark:bg-[#0F0D0B] border border-[#E5DCCB] dark:border-[#2E2A24] px-3 py-1.5 rounded-xl text-xs font-semibold text-[#57534E] dark:text-[#C5BEB3]">
                <ArrowUpDown size={13} className="text-[#B88A2B] dark:text-[#D4AF37]" />
                <span className="hidden sm:inline">{dict.sortBy}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-[#1C1917] dark:text-[#F5F1E8] font-bold focus:outline-hidden cursor-pointer"
                >
                  <option value="newest" className="dark:bg-neutral-900">{dict.newest}</option>
                  <option value="views" className="dark:bg-neutral-900">{dict.mostRead}</option>
                  <option value="oldest" className="dark:bg-neutral-900">{dict.oldest}</option>
                </select>
              </div>

              {/* View Toggle Buttons */}
              <div className="flex items-center bg-[#FBF9F6] dark:bg-[#0F0D0B] p-1 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24]">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-[#1E1B18] text-[#B88A2B] dark:text-[#D4AF37] shadow-xs"
                      : "text-[#78716C] dark:text-[#A39B8B] hover:text-[#1C1917] dark:hover:text-[#F5F1E8]"
                  }`}
                  title={dict.gridView}
                  aria-label={dict.gridView}
                >
                  <Grid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === "list"
                      ? "bg-white dark:bg-[#1E1B18] text-[#B88A2B] dark:text-[#D4AF37] shadow-xs"
                      : "text-[#78716C] dark:text-[#A39B8B] hover:text-[#1C1917] dark:hover:text-[#F5F1E8]"
                  }`}
                  title={dict.listView}
                  aria-label={dict.listView}
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Sub-category / Topic Filter Pills with Animated Slider */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory("ALL")}
              className={`relative px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 z-10 ${
                selectedCategory === "ALL"
                  ? "text-white"
                  : "text-[#57534E] dark:text-[#C5BEB3] hover:text-[#B88A2B] dark:hover:text-[#D4AF37]"
              }`}
            >
              {selectedCategory === "ALL" && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 bg-gradient-to-r from-[#B88A2B] to-[#C5A059] rounded-xl shadow-md -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {selectedCategory !== "ALL" && (
                <div className="absolute inset-0 bg-[#FBF9F6] dark:bg-[#0F0D0B] border border-[#E5DCCB] dark:border-[#2E2A24] rounded-xl -z-10" />
              )}
              <span>{dict.allTopics}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedCategory === "ALL" ? "bg-white/20 text-white" : "bg-[#E5DCCB]/60 dark:bg-[#2E2A24] text-[#78716C] dark:text-[#A39B8B]"
              }`}>
                {initialPosts.length}
              </span>
            </button>

            {availableCategories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const catName = isRtl ? cat.nameAr || cat.nameEn : cat.nameEn || cat.nameAr;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 z-10 ${
                    isSelected
                      ? "text-white"
                      : "text-[#57534E] dark:text-[#C5BEB3] hover:text-[#B88A2B] dark:hover:text-[#D4AF37]"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeCategoryPill"
                      className="absolute inset-0 bg-gradient-to-r from-[#B88A2B] to-[#C5A059] rounded-xl shadow-md -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {!isSelected && (
                    <div className="absolute inset-0 bg-[#FBF9F6] dark:bg-[#0F0D0B] border border-[#E5DCCB] dark:border-[#2E2A24] rounded-xl -z-10" />
                  )}
                  <span>{catName}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? "bg-white/20 text-white" : "bg-[#E5DCCB]/60 dark:bg-[#2E2A24] text-[#78716C] dark:text-[#A39B8B]"
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* FEED LAYOUT WITH COMPANION SIDEBAR */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT: MAIN ARTICLE FEED (8 COLS) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Results Count Header */}
            <div className="flex items-center justify-between text-xs text-[#78716C] dark:text-[#A39B8B] font-medium border-b border-[#E5DCCB]/60 dark:border-[#2E2A24]/60 pb-3">
              <span>
                {dict.showing} <strong className="text-[#1C1917] dark:text-[#F5F1E8] font-mono">{totalItems > 0 ? startIndex + 1 : 0}</strong> - <strong className="text-[#1C1917] dark:text-[#F5F1E8] font-mono">{Math.min(startIndex + pageSize, totalItems)}</strong> {dict.of} <strong className="text-[#1C1917] dark:text-[#F5F1E8] font-mono">{totalItems}</strong> {dict.results}
              </span>
            </div>

            {/* EMPTY STATE */}
            {paginatedPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 px-6 text-center rounded-3xl bg-white dark:bg-[#161412] border border-[#E5DCCB] dark:border-[#2E2A24] shadow-md space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#FAF0D7] dark:bg-[#262118] text-[#B88A2B] dark:text-[#D4AF37] flex items-center justify-center mx-auto shadow-inner">
                  <Search size={26} />
                </div>
                <h3 className="font-serif font-bold text-xl text-[#1C1917] dark:text-[#F5F1E8]">
                  {dict.noResults}
                </h3>
                <p className="text-sm text-[#78716C] dark:text-[#A39B8B] max-w-md mx-auto">
                  {dict.noResultsDesc}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("ALL");
                    setSortBy("newest");
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#B88A2B] hover:bg-[#9B7220] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {dict.resetFilters}
                </button>
              </motion.div>
            ) : viewMode === "grid" ? (
              /* MAGAZINE GRID VIEW WITH LONG SMOOTH IN-VIEW GLIDE */
              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                {paginatedPosts.map((item, index) => {
                  const title = isRtl ? item.titleAr || item.titleEn : item.titleEn || item.titleAr;
                  const excerpt = isRtl ? item.excerptAr || item.excerptEn : item.excerptEn || item.excerptAr;
                  const catName = item.category
                    ? isRtl
                      ? item.category.nameAr || item.category.nameEn || "إعلان"
                      : item.category.nameEn || item.category.nameAr || "Announcement"
                    : dict.officialRelease;

                  const rawImage =
                    (item.featuredImage && typeof item.featuredImage === "object"
                      ? item.featuredImage.url || item.featuredImage.thumbnailUrl
                      : typeof item.featuredImage === "string"
                      ? item.featuredImage
                      : null) ||
                    item.featuredImageUrl ||
                    item.image ||
                    "/news/news1.avif";

                  const imageUrl = getMediaUrl(rawImage, "/news/news1.avif");
                  const itemUrl = `/${item.pageCategory?.slug || "news-announcements"}/${item.slug || item.id}`;
                  const formattedDate = formatDynamicDate(item.publishedAt || item.createdAt, isRtl);

                  const readTime = Math.max(3, Math.ceil((item.contentEn?.length || item.contentAr?.length || 1500) / 750));

                  // Long Smooth Alternating Scroll View Entrance
                  const isOdd = index % 2 === 0;
                  const initialX = isOdd ? (isRtl ? 50 : -50) : (isRtl ? -50 : 50);

                  return (
                    <motion.article
                      key={item.id}
                      initial={{ opacity: 0, x: initialX, filter: "blur(8px)" }}
                      whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: (index % 2) * 0.1 }}
                      className="group relative flex flex-col justify-between rounded-3xl overflow-hidden bg-white dark:bg-[#161412] border border-[#E5DCCB] dark:border-[#2E2A24] shadow-md hover:shadow-2xl hover:border-[#C5A059]/60 transition-all duration-500"
                    >
                      <div>
                        {/* Visual Image with Zoom on Hover */}
                        <Link href={itemUrl} className="block relative h-56 overflow-hidden bg-neutral-900">
                          <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                          {/* Category Tag */}
                          <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-2 z-10">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#B88A2B] text-white shadow-md">
                              {catName}
                            </span>
                          </div>

                          {/* Quick Share Button */}
                          <button
                            type="button"
                            onClick={(e) => handleShareCard(e, item)}
                            className="absolute top-3 right-3 rtl:right-auto rtl:left-3 p-2 rounded-full bg-black/50 hover:bg-[#B88A2B] text-white backdrop-blur-md transition-colors z-10 cursor-pointer"
                            title={isRtl ? "مشاركة الإعلان" : "Share dispatch"}
                          >
                            {copiedCardId === item.id ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
                          </button>
                        </Link>

                        {/* Card Content */}
                        <div className="p-5 sm:p-6 space-y-3">
                          {/* Date & Reading Time */}
                          <div className="flex items-center justify-between text-[11px] text-[#78716C] dark:text-[#A39B8B] font-medium">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={12} className="text-[#B88A2B] dark:text-[#D4AF37]" />
                              <span>{formattedDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={12} />
                              <span>{readTime} {dict.minRead}</span>
                            </div>
                          </div>

                          {/* Title */}
                          <Link href={itemUrl} className="block">
                            <h3 className="font-serif font-bold text-lg sm:text-xl leading-snug text-[#1C1917] dark:text-[#F5F1E8] group-hover:text-[#B88A2B] dark:group-hover:text-[#D4AF37] transition-colors duration-200 line-clamp-2">
                              {title}
                            </h3>
                          </Link>

                          {/* Excerpt */}
                          {excerpt && (
                            <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#C5BEB3] line-clamp-3 leading-relaxed font-sans">
                              {excerpt}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Card Footer CTA */}
                      <div className="p-5 sm:p-6 pt-0 mt-auto border-t border-[#E5DCCB]/60 dark:border-[#2E2A24]/60 flex items-center justify-between gap-3 text-xs font-bold text-[#B88A2B] dark:text-[#D4AF37]">
                        <div className="flex items-center gap-1 text-[11px] text-[#78716C] dark:text-[#A39B8B] font-normal">
                          <Eye size={12} />
                          <span>{item.viewCount || 1} {dict.views}</span>
                        </div>

                        <Link
                          href={itemUrl}
                          className="inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all text-xs font-bold cursor-pointer"
                        >
                          <span>{dict.readFull}</span>
                          {isRtl ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
                        </Link>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            ) : (
              /* COMPACT PRESS WIRE LIST VIEW WITH SMOOTH SCROLL IN-VIEW */
              <div className="space-y-4">
                {paginatedPosts.map((item, index) => {
                  const title = isRtl ? item.titleAr || item.titleEn : item.titleEn || item.titleAr;
                  const excerpt = isRtl ? item.excerptAr || item.excerptEn : item.excerptEn || item.excerptAr;
                  const catName = item.category
                    ? isRtl
                      ? item.category.nameAr || item.category.nameEn || "إعلان"
                      : item.category.nameEn || item.category.nameAr || "Announcement"
                    : dict.officialRelease;

                  const rawImage =
                    (item.featuredImage && typeof item.featuredImage === "object"
                      ? item.featuredImage.url || item.featuredImage.thumbnailUrl
                      : typeof item.featuredImage === "string"
                      ? item.featuredImage
                      : null) ||
                    item.featuredImageUrl ||
                    item.image ||
                    "/news/news1.avif";

                  const imageUrl = getMediaUrl(rawImage, "/news/news1.avif");
                  const itemUrl = `/${item.pageCategory?.slug || "news-announcements"}/${item.slug || item.id}`;

                  const formattedDate = formatDynamicDate(item.publishedAt || item.createdAt, isRtl);

                  const readTime = Math.max(3, Math.ceil((item.contentEn?.length || item.contentAr?.length || 1500) / 750));

                  const isOdd = index % 2 === 0;
                  const initialX = isOdd ? (isRtl ? 40 : -40) : (isRtl ? -40 : 40);

                  return (
                    <motion.article
                      key={item.id}
                      initial={{ opacity: 0, x: initialX, filter: "blur(6px)" }}
                      whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      className="group p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#161412] border border-[#E5DCCB] dark:border-[#2E2A24] shadow-sm hover:shadow-xl hover:border-[#C5A059]/60 transition-all duration-300 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6"
                    >
                      {/* Thumbnail */}
                      <Link href={itemUrl} className="block relative w-full sm:w-48 h-40 sm:h-32 rounded-2xl overflow-hidden shrink-0 bg-neutral-900">
                        <Image
                          src={imageUrl}
                          alt={title}
                          fill
                          sizes="200px"
                          className="object-cover object-center group-hover:scale-108 transition-transform duration-600 ease-out"
                        />
                      </Link>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2.5 text-[11px] text-[#78716C] dark:text-[#A39B8B] flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full font-bold text-[#B88A2B] dark:text-[#D4AF37] bg-[#FAF0D7] dark:bg-[#262118] border border-[#C5A059]/20">
                            {catName}
                          </span>
                          <span>•</span>
                          <span>{formattedDate}</span>
                          <span>•</span>
                          <span>{readTime} {dict.minRead}</span>
                        </div>

                        <Link href={itemUrl} className="block">
                          <h3 className="font-serif font-bold text-base sm:text-lg leading-snug text-[#1C1917] dark:text-[#F5F1E8] group-hover:text-[#B88A2B] dark:group-hover:text-[#D4AF37] transition-colors truncate">
                            {title}
                          </h3>
                        </Link>

                        {excerpt && (
                          <p className="text-xs text-[#57534E] dark:text-[#C5BEB3] line-clamp-1 sm:line-clamp-2 leading-relaxed">
                            {excerpt}
                          </p>
                        )}
                      </div>

                      {/* Arrow CTA */}
                      <Link
                        href={itemUrl}
                        className="self-end sm:self-center p-3 rounded-2xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-[#FBF9F6] dark:bg-[#1E1B18] group-hover:bg-[#B88A2B] group-hover:text-white dark:group-hover:bg-[#C5A059] dark:group-hover:text-neutral-950 transition-all shrink-0 cursor-pointer shadow-xs"
                        aria-label={dict.readFull}
                      >
                        {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                      </Link>
                    </motion.article>
                  );
                })}
              </div>
            )}

            {/* NUMBERED PAGINATION */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="pt-6 border-t border-[#E5DCCB] dark:border-[#2E2A24] flex items-center justify-between gap-4 flex-wrap"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#78716C] dark:text-[#A39B8B]">
                    {dict.showing} {pageSize} / page
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3.5 py-2 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-white dark:bg-[#161412] text-xs font-bold text-[#1C1917] dark:text-[#F5F1E8] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF0D7] dark:hover:bg-[#262118] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {isRtl ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    <span>{dict.prev}</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? "bg-[#B88A2B] text-white shadow-md"
                          : "bg-white dark:bg-[#161412] border border-[#E5DCCB] dark:border-[#2E2A24] text-[#57534E] dark:text-[#C5BEB3] hover:bg-[#FAF0D7] dark:hover:bg-[#262118]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3.5 py-2 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-white dark:bg-[#161412] text-xs font-bold text-[#1C1917] dark:text-[#F5F1E8] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF0D7] dark:hover:bg-[#262118] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>{dict.next}</span>
                    {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT: COMPANION SIDEBAR (4 COLS) */}
          <div className="lg:col-span-4 space-y-8 sticky top-24">
            {/* WIDGET 1: TRENDING & MOST READ */}
            {trendingPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#161412] border border-[#E5DCCB] dark:border-[#2E2A24] shadow-md space-y-5"
              >
                <div className="flex items-center gap-2 pb-3.5 border-b border-[#E5DCCB] dark:border-[#2E2A24]">
                  <TrendingUp size={18} className="text-[#B88A2B] dark:text-[#D4AF37]" />
                  <h3 className="font-serif font-bold text-lg text-[#1C1917] dark:text-[#F5F1E8]">
                    {dict.trendingHeader}
                  </h3>
                </div>

                <div className="space-y-4">
                  {trendingPosts.slice(0, 4).map((tp, idx) => {
                    const title = isRtl ? tp.titleAr || tp.titleEn : tp.titleEn || tp.titleAr;
                    const tpUrl = `/${tp.pageCategory?.slug || "news-announcements"}/${tp.slug || tp.id}`;
                    return (
                      <Link
                        key={tp.id || idx}
                        href={tpUrl}
                        className="group flex items-start gap-3.5 pb-3.5 border-b border-[#E5DCCB]/40 dark:border-[#2E2A24]/40 last:border-0 last:pb-0 cursor-pointer"
                      >
                        <span className="font-serif font-black text-2xl text-[#B88A2B] dark:text-[#D4AF37] opacity-70 group-hover:opacity-100 shrink-0 font-mono transition-opacity">
                          0{idx + 1}
                        </span>
                        <div className="min-w-0 space-y-1">
                          <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1C1917] dark:text-[#F5F1E8] group-hover:text-[#B88A2B] dark:group-hover:text-[#D4AF37] transition-colors line-clamp-2 leading-snug">
                            {title}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-[#78716C] dark:text-[#A39B8B]">
                            <Eye size={11} />
                            <span>{tp.viewCount || 1} {dict.views}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* WIDGET 2: PRESS & MEDIA DESK */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="p-6 sm:p-7 rounded-3xl bg-linear-to-br from-[#FAF0D7] to-[#F5EFEB] dark:from-[#1E1B17] dark:to-[#141210] border border-[#E5DCCB] dark:border-[#2E2A24] shadow-md space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#B88A2B] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Building size={19} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1C1917] dark:text-[#F5F1E8]">
                    {dict.pressDeskTitle}
                  </h3>
                  <p className="text-[11px] text-[#78716C] dark:text-[#A39B8B]">
                    {isRtl ? "مكتب التنسيق الصحفي والبيانات" : "Official Press Bureau"}
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#57534E] dark:text-[#C5BEB3] leading-relaxed">
                {dict.pressDeskDesc}
              </p>

              <div className="p-3 rounded-2xl bg-white dark:bg-[#0F0D0B] border border-[#E5DCCB] dark:border-[#2E2A24] flex items-center justify-between gap-2 shadow-2xs">
                <span className="font-mono text-xs text-[#1C1917] dark:text-[#F5F1E8] font-bold truncate">
                  press@ummahscholar.com
                </span>
                <button
                  type="button"
                  onClick={handleCopyPressEmail}
                  className="p-2 rounded-xl bg-[#FAF0D7] dark:bg-[#262118] text-[#B88A2B] dark:text-[#D4AF37] hover:bg-[#B88A2B] hover:text-white transition-colors cursor-pointer shrink-0"
                  title={dict.copyEmail}
                >
                  {pressEmailCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </motion.div>

            {/* WIDGET 3: EXECUTIVE NEWSLETTER */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="p-6 sm:p-7 rounded-3xl bg-neutral-900 text-white dark:bg-[#161412] dark:text-[#F5F1E8] border border-neutral-800 dark:border-[#2E2A24] shadow-2xl space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2 relative z-10">
                <Mail size={18} className="text-[#C5A059]" />
                <h3 className="font-serif font-bold text-base text-white dark:text-[#F5F1E8]">
                  {dict.newsletterTitle}
                </h3>
              </div>

              <p className="text-xs text-neutral-300 dark:text-[#A39B8B] leading-relaxed relative z-10">
                {dict.newsletterDesc}
              </p>

              <form onSubmit={handleNewsletterSubmit} className="space-y-2.5 relative z-10">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={dict.emailPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 dark:bg-[#0F0D0B] border border-neutral-700 dark:border-[#2E2A24] text-xs text-white placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-[#C5A059]"
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="w-full py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#B88A2B] text-neutral-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Send size={13} />
                  <span>{dict.subscribeBtn}</span>
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
