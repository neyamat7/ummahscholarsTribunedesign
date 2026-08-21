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
import { formatDynamicDate } from "@/lib/dateUtils";
import { toast } from "sonner";

const DESK_ICONS = {
  book: BookOpen,
  sparkles: Sparkles,
  calendar: Calendar,
  mail: Mail,
  building: Building,
};

export default function SectionInteractiveFeed({
  initialPosts = [],
  categories = [],
  trendingPosts = [],
  pageCategorySlug = "research-studies",
  deskConfig = {
    titleEn: "Academic Submissions Desk",
    titleAr: "هيئة التحرير والبحوث",
    descEn: "Submit your scholarly papers, peer-reviews, and inquiries directly to the editorial board:",
    descAr: "لتقديم الأبحاث ومقترحات الدراسات والتواصل مع هيئة التحرير الأكاديمية:",
    email: "submissions@ummahscholar.com",
    buttonTextEn: "Copy Submission Email",
    buttonTextAr: "نسخ بريد التقديم",
    iconName: "book",
  },
  searchPlaceholderEn = "Search articles, papers, topics, and authors...",
  searchPlaceholderAr = "ابحث في المقالات والأبحاث والمواضيع والكتّاب...",
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

  // Copy state for desk email and card share
  const [deskEmailCopied, setDeskEmailCopied] = useState(false);
  const [copiedCardId, setCopiedCardId] = useState(null);

  const feedRef = useRef(null);

  // Bilingual UI Dictionary
  const dict = {
    searchPlaceholder: isRtl ? searchPlaceholderAr : searchPlaceholderEn,
    allTopics: isRtl ? "جميع المواضيع" : "All Topics",
    sortBy: isRtl ? "الترتيب:" : "Sort by:",
    newest: isRtl ? "الأحدث أولاً" : "Latest First",
    mostRead: isRtl ? "الأكثر قراءة" : "Most Read",
    oldest: isRtl ? "الأقدم" : "Oldest",
    gridView: isRtl ? "عرض الشبكة" : "Grid View",
    listView: isRtl ? "عرض القائمة" : "List View",
    trendingHeader: isRtl ? "الأكثر تداولاً وقراءة" : "Trending & Most Read",
    deskTitle: isRtl ? deskConfig.titleAr : deskConfig.titleEn,
    deskDesc: isRtl ? deskConfig.descAr : deskConfig.descEn,
    deskButton: isRtl ? deskConfig.buttonTextAr : deskConfig.buttonTextEn,
    emailCopied: isRtl ? "تم نسخ البريد بنجاح" : "Email address copied to clipboard",
    newsletterTitle: isRtl ? "النشرة العلمية الدورية" : "Scholarly Intelligence Digest",
    newsletterDesc: isRtl
      ? "اشترك ليصلك جديد الأبحاث والدراسات والمستجدات الفكرية أسبوعياً."
      : "Subscribe to receive weekly peer-reviewed dispatches, essays, and scholarly updates.",
    subscribePlaceholder: isRtl ? "أدخل بريدك الإلكتروني..." : "Enter your scholarly email...",
    subscribeBtn: isRtl ? "اشتراك" : "Subscribe",
    subscribedSuccess: isRtl ? "شكراً لاشتراكك في النشرة الدورية" : "Successfully subscribed to digest",
    showing: isRtl ? "عرض" : "Showing",
    of: isRtl ? "من أصل" : "of",
    results: isRtl ? "مادة علمية" : "articles",
    noResults: isRtl ? "لم يتم العثور على أي مواد مطابقة" : "No articles found matching your criteria",
    noResultsDesc: isRtl
      ? "جرّب تغيير كلمات البحث أو استعراض تصنيف آخر"
      : "Try adjusting your search terms or selecting another topic filter",
    readMore: isRtl ? "قراءة المقال" : "Read Article",
    minRead: isRtl ? "دقائق" : "min read",
    previous: isRtl ? "السابق" : "Previous",
    next: isRtl ? "التالي" : "Next",
  };

  // 1. Filter and sort posts
  const filteredPosts = useMemo(() => {
    let result = [...initialPosts];

    // Category Filter
    if (selectedCategory !== "ALL") {
      result = result.filter((p) => {
        const catId = p.categoryId || p.category?.id || p.category?.slug;
        return catId === selectedCategory;
      });
    }

    // Search Filter (debounced)
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter((p) => {
        const title = (p.titleEn || p.titleAr || "").toLowerCase();
        const excerpt = (p.excerptEn || p.excerptAr || "").toLowerCase();
        const catName = (p.category?.nameEn || p.category?.nameAr || "").toLowerCase();
        return title.includes(q) || excerpt.includes(q) || catName.includes(q);
      });
    }

    // Sort Order
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

  const handleCopyDeskEmail = () => {
    navigator.clipboard.writeText(deskConfig.email);
    setDeskEmailCopied(true);
    toast.success(dict.emailCopied);
    setTimeout(() => setDeskEmailCopied(false), 2500);
  };

  const handleShareCard = async (e, post) => {
    e.preventDefault();
    e.stopPropagation();
    const postUrl = `/${post.pageCategory?.slug || pageCategorySlug}/${post.slug || post.id}`;
    if (typeof window !== "undefined") {
      const fullUrl = `${window.location.origin}${postUrl}`;
      try {
        await navigator.clipboard.writeText(fullUrl);
        setCopiedCardId(post.id);
        toast.success(isRtl ? "تم نسخ الرابط" : "Link copied to clipboard");
        setTimeout(() => setCopiedCardId(null), 2000);
      } catch (err) {
        toast.error(isRtl ? "تعذر نسخ الرابط" : "Failed to copy link");
      }
    }
  };

  const DeskIcon = (deskConfig.iconName && DESK_ICONS[deskConfig.iconName]) || BookOpen;

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
                  layoutId="activeSectionTopicPill"
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
              const catTitle = isRtl ? cat.nameAr || cat.nameEn : cat.nameEn || cat.nameAr;

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
                      layoutId="activeSectionTopicPill"
                      className="absolute inset-0 bg-gradient-to-r from-[#B88A2B] to-[#C5A059] rounded-xl shadow-md -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {!isSelected && (
                    <div className="absolute inset-0 bg-[#FBF9F6] dark:bg-[#0F0D0B] border border-[#E5DCCB] dark:border-[#2E2A24] rounded-xl -z-10" />
                  )}
                  <span>{catTitle}</span>
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

        {/* FEED CONTENT GRID (9 COLS ARTICLES + 3 COLS SIDEBAR) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* MAIN ARTICLES COLUMN (8 OR 9 COLS) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Results Counter Bar */}
            <div className="flex items-center justify-between text-xs text-[#78716C] dark:text-[#A39B8B] px-1">
              <span>
                {dict.showing} <strong className="text-[#1C1917] dark:text-[#F5F1E8] font-mono">{filteredPosts.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + pageSize, totalItems)}</strong> {dict.of} <strong className="text-[#1C1917] dark:text-[#F5F1E8] font-mono">{totalItems}</strong> {dict.results}
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-[#B88A2B] dark:text-[#D4AF37] hover:underline cursor-pointer"
                >
                  {isRtl ? "مسح البحث" : "Clear search filter"}
                </button>
              )}
            </div>

            {/* Empty State */}
            {filteredPosts.length === 0 && (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#161412] border border-[#E5DCCB] dark:border-[#2E2A24] space-y-3">
                <Search className="w-12 h-12 text-[#B88A2B] dark:text-[#D4AF37] mx-auto opacity-70" />
                <h3 className="font-serif font-bold text-lg text-[#1C1917] dark:text-[#F5F1E8]">
                  {dict.noResults}
                </h3>
                <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A39B8B] max-w-sm mx-auto">
                  {dict.noResultsDesc}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("ALL");
                  }}
                  className="mt-2 px-5 py-2 rounded-xl bg-[#B88A2B] hover:bg-[#A07621] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  {isRtl ? "إعادة ضبط الفلاتر" : "Reset Filters"}
                </button>
              </div>
            )}

            {/* ARTICLES: LIST VIEW */}
            {viewMode === "list" && (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {paginatedPosts.map((post, idx) => {
                    const title = isRtl
                      ? post.titleAr || post.titleEn || post.title
                      : post.titleEn || post.titleAr || post.title;
                    const excerpt = isRtl
                      ? post.excerptAr || post.excerptEn || ""
                      : post.excerptEn || post.excerptAr || "";
                    const categoryName = isRtl
                      ? post.category?.nameAr || post.category?.nameEn || ""
                      : post.category?.nameEn || post.category?.nameAr || "";
                    const postDate = formatDynamicDate(post.publishedAt || post.createdAt, isRtl);
                    const readTime = Math.max(
                      2,
                      Math.ceil((post.contentEn?.length || post.contentAr?.length || 1200) / 750)
                    );
                    const postUrl = `/${post.pageCategory?.slug || pageCategorySlug}/${post.slug || post.id}`;

                    const rawImage =
                      (post.featuredImage && typeof post.featuredImage === "object"
                        ? post.featuredImage.url || post.featuredImage.thumbnailUrl
                        : typeof post.featuredImage === "string"
                        ? post.featuredImage
                        : null) ||
                      post.featuredImageUrl ||
                      post.image ||
                      "/home.jpeg";

                    const imageUrl = getMediaUrl(rawImage, "/home.jpeg");

                    return (
                      <motion.article
                        key={post.id || idx}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.35, delay: idx * 0.03 }}
                        className="group relative rounded-2xl overflow-hidden bg-white dark:bg-[#161412] border border-[#E5DCCB] dark:border-[#2E2A24] hover:border-[#B88A2B]/60 dark:hover:border-[#C5A059]/60 shadow-xs hover:shadow-lg transition-all duration-300 p-4 sm:p-5"
                      >
                        <div className="flex flex-col sm:flex-row gap-5 items-stretch">
                          {/* Thumbnail Image */}
                          <div className="relative sm:w-52 h-44 sm:h-auto rounded-xl overflow-hidden shrink-0 bg-neutral-900">
                            <Image
                              src={imageUrl}
                              alt={title}
                              fill
                              sizes="(max-width: 640px) 100vw, 220px"
                              className="object-cover group-hover:scale-106 transition-transform duration-500"
                            />
                            {categoryName && (
                              <div className="absolute top-2 start-2">
                                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-black/70 backdrop-blur-md text-white border border-white/20">
                                  {categoryName}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Content Body */}
                          <div className="flex-1 flex flex-col justify-between space-y-3">
                            <div className="space-y-2">
                              {/* Metadata */}
                              <div className="flex items-center gap-3 text-xs text-[#78716C] dark:text-[#A39B8B] font-mono flex-wrap">
                                {postDate && (
                                  <span className="flex items-center gap-1">
                                    <Calendar size={12} className="text-[#B88A2B] dark:text-[#D4AF37]" />
                                    {postDate}
                                  </span>
                                )}
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock size={12} />
                                  {readTime} {dict.minRead}
                                </span>
                                {typeof post.viewCount === "number" && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <Eye size={12} />
                                      {post.viewCount}
                                    </span>
                                  </>
                                )}
                              </div>

                              {/* Title */}
                              <Link href={postUrl} className="block group/link">
                                <h3 className="font-serif font-bold text-base sm:text-lg text-[#1C1917] dark:text-[#F5F1E8] group-hover/link:text-[#B88A2B] dark:group-hover/link:text-[#D4AF37] transition-colors leading-snug">
                                  {title}
                                </h3>
                              </Link>

                              {/* Excerpt */}
                              <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#C5BEB3] font-sans line-clamp-2 leading-relaxed">
                                {excerpt}
                              </p>
                            </div>

                            {/* Action Bar */}
                            <div className="pt-3 border-t border-[#E5DCCB]/60 dark:border-[#2E2A24]/60 flex items-center justify-between gap-3">
                              <Link
                                href={postUrl}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B88A2B] dark:text-[#D4AF37] hover:underline"
                              >
                                <span>{dict.readMore}</span>
                                {isRtl ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
                              </Link>

                              <button
                                type="button"
                                onClick={(e) => handleShareCard(e, post)}
                                className="p-1.5 rounded-lg border border-[#E5DCCB] dark:border-[#2E2A24] hover:bg-[#FAF0D7] dark:hover:bg-[#262118] text-[#78716C] dark:text-[#A39B8B] transition-colors cursor-pointer"
                                title={isRtl ? "مشاركة" : "Share"}
                              >
                                {copiedCardId === post.id ? (
                                  <Check size={14} className="text-emerald-600" />
                                ) : (
                                  <Share2 size={14} />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* ARTICLES: GRID VIEW */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {paginatedPosts.map((post, idx) => {
                    const title = isRtl
                      ? post.titleAr || post.titleEn || post.title
                      : post.titleEn || post.titleAr || post.title;
                    const excerpt = isRtl
                      ? post.excerptAr || post.excerptEn || ""
                      : post.excerptEn || post.excerptAr || "";
                    const categoryName = isRtl
                      ? post.category?.nameAr || post.category?.nameEn || ""
                      : post.category?.nameEn || post.category?.nameAr || "";
                    const postDate = formatDynamicDate(post.publishedAt || post.createdAt, isRtl);
                    const readTime = Math.max(
                      2,
                      Math.ceil((post.contentEn?.length || post.contentAr?.length || 1200) / 750)
                    );
                    const postUrl = `/${post.pageCategory?.slug || pageCategorySlug}/${post.slug || post.id}`;

                    const rawImage =
                      (post.featuredImage && typeof post.featuredImage === "object"
                        ? post.featuredImage.url || post.featuredImage.thumbnailUrl
                        : typeof post.featuredImage === "string"
                        ? post.featuredImage
                        : null) ||
                      post.featuredImageUrl ||
                      post.image ||
                      "/home.jpeg";

                    const imageUrl = getMediaUrl(rawImage, "/home.jpeg");

                    return (
                      <motion.article
                        key={post.id || idx}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.35, delay: idx * 0.03 }}
                        className="group relative rounded-2xl overflow-hidden bg-white dark:bg-[#161412] border border-[#E5DCCB] dark:border-[#2E2A24] hover:border-[#B88A2B]/60 dark:hover:border-[#C5A059]/60 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                      >
                        <div>
                          {/* Image Container */}
                          <div className="relative h-48 w-full overflow-hidden bg-neutral-900">
                            <Image
                              src={imageUrl}
                              alt={title}
                              fill
                              sizes="(max-width: 640px) 100vw, 400px"
                              className="object-cover group-hover:scale-106 transition-transform duration-500"
                            />
                            {categoryName && (
                              <div className="absolute top-3 start-3">
                                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-black/70 backdrop-blur-md text-white border border-white/20">
                                  {categoryName}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Card Content */}
                          <div className="p-5 space-y-3">
                            {/* Metadata */}
                            <div className="flex items-center gap-2.5 text-xs text-[#78716C] dark:text-[#A39B8B] font-mono">
                              {postDate && (
                                <span className="flex items-center gap-1">
                                  <Calendar size={12} className="text-[#B88A2B] dark:text-[#D4AF37]" />
                                  {postDate}
                                </span>
                              )}
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {readTime} {dict.minRead}
                              </span>
                            </div>

                            {/* Title */}
                            <Link href={postUrl} className="block group/link">
                              <h3 className="font-serif font-bold text-base text-[#1C1917] dark:text-[#F5F1E8] group-hover/link:text-[#B88A2B] dark:group-hover/link:text-[#D4AF37] transition-colors leading-snug line-clamp-2">
                                {title}
                              </h3>
                            </Link>

                            {/* Excerpt */}
                            <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#C5BEB3] font-sans line-clamp-2 leading-relaxed">
                              {excerpt}
                            </p>
                          </div>
                        </div>

                        {/* Action footer */}
                        <div className="p-5 pt-3 border-t border-[#E5DCCB]/60 dark:border-[#2E2A24]/60 flex items-center justify-between gap-3">
                          <Link
                            href={postUrl}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B88A2B] dark:text-[#D4AF37] hover:underline"
                          >
                            <span>{dict.readMore}</span>
                            {isRtl ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
                          </Link>

                          <button
                            type="button"
                            onClick={(e) => handleShareCard(e, post)}
                            className="p-1.5 rounded-lg border border-[#E5DCCB] dark:border-[#2E2A24] hover:bg-[#FAF0D7] dark:hover:bg-[#262118] text-[#78716C] dark:text-[#A39B8B] transition-colors cursor-pointer"
                            title={isRtl ? "مشاركة" : "Share"}
                          >
                            {copiedCardId === post.id ? (
                              <Check size={14} className="text-emerald-600" />
                            ) : (
                              <Share2 size={14} />
                            )}
                          </button>
                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* PAGINATION TOOLBAR */}
            {totalPages > 1 && (
              <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E5DCCB] dark:border-[#2E2A24]">
                {/* Page Size Selector */}
                <div className="flex items-center gap-2 text-xs text-[#78716C] dark:text-[#A39B8B]">
                  <span>{isRtl ? "لكل صفحة:" : "Per page:"}</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="bg-white dark:bg-[#161412] border border-[#E5DCCB] dark:border-[#2E2A24] px-2.5 py-1 rounded-lg text-xs font-bold text-[#1C1917] dark:text-[#F5F1E8] focus:outline-hidden cursor-pointer"
                  >
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                </div>

                {/* Numbered Page Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-white dark:bg-[#161412] text-[#1C1917] dark:text-[#F5F1E8] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FAF0D7] dark:hover:bg-[#262118] transition-colors cursor-pointer"
                    title={dict.previous}
                  >
                    {isRtl ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isActive = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer font-mono ${
                          isActive
                            ? "bg-[#B88A2B] text-white shadow-md"
                            : "bg-white dark:bg-[#161412] border border-[#E5DCCB] dark:border-[#2E2A24] text-[#1C1917] dark:text-[#F5F1E8] hover:bg-[#FAF0D7] dark:hover:bg-[#262118]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-white dark:bg-[#161412] text-[#1C1917] dark:text-[#F5F1E8] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FAF0D7] dark:hover:bg-[#262118] transition-colors cursor-pointer"
                    title={dict.next}
                  >
                    {isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR COLUMN (4 COLS) */}
          <div className="lg:col-span-4 space-y-6">
            {/* WIDGET 1: Section Specific Editorial / Submissions Desk */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FAF0D7] via-white to-[#F7F2E7] dark:from-[#262118] dark:via-[#161412] dark:to-[#1A1714] border border-[#B88A2B]/40 dark:border-[#C5A059]/30 shadow-md space-y-4">
              <div className="flex items-center gap-2.5 text-[#B88A2B] dark:text-[#D4AF37]">
                <DeskIcon size={18} />
                <h4 className="font-serif font-bold text-sm tracking-tight text-[#1C1917] dark:text-[#F5F1E8]">
                  {dict.deskTitle}
                </h4>
              </div>
              <p className="text-xs text-[#57534E] dark:text-[#C5BEB3] font-sans leading-relaxed">
                {dict.deskDesc}
              </p>
              <div className="p-3 rounded-xl bg-white/80 dark:bg-black/30 border border-[#E5DCCB] dark:border-[#2E2A24] flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-[#1C1917] dark:text-[#F5F1E8] truncate font-medium">
                  {deskConfig.email}
                </span>
                <button
                  type="button"
                  onClick={handleCopyDeskEmail}
                  className="shrink-0 p-1.5 rounded-lg bg-[#B88A2B] hover:bg-[#A07621] text-white transition-colors cursor-pointer"
                  title={dict.deskButton}
                >
                  {deskEmailCopied ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>
            </div>

            {/* WIDGET 2: Trending & Popular Articles in this section */}
            {trendingPosts.length > 0 && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#161412] border border-[#E5DCCB] dark:border-[#2E2A24] shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-[#B88A2B] dark:text-[#D4AF37]">
                  <TrendingUp size={16} />
                  <h4 className="font-serif font-bold text-sm text-[#1C1917] dark:text-[#F5F1E8]">
                    {dict.trendingHeader}
                  </h4>
                </div>

                <div className="divide-y divide-[#E5DCCB]/60 dark:divide-[#2E2A24]/60">
                  {trendingPosts.slice(0, 4).map((tp, idx) => {
                    const title = isRtl
                      ? tp.titleAr || tp.titleEn || tp.title
                      : tp.titleEn || tp.titleAr || tp.title;
                    const date = formatDynamicDate(tp.publishedAt || tp.createdAt, isRtl);
                    const postUrl = `/${tp.pageCategory?.slug || pageCategorySlug}/${tp.slug || tp.id}`;

                    return (
                      <Link
                        key={tp.id || idx}
                        href={postUrl}
                        className="block py-3 group first:pt-0 last:pb-0"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-lg font-serif font-bold text-[#C5A059]/60 group-hover:text-[#B88A2B] transition-colors shrink-0">
                            0{idx + 1}
                          </span>
                          <div className="space-y-1">
                            <h5 className="font-serif font-bold text-xs text-[#1C1917] dark:text-[#F5F1E8] group-hover:text-[#B88A2B] dark:group-hover:text-[#D4AF37] transition-colors leading-snug line-clamp-2">
                              {title}
                            </h5>
                            {date && (
                              <span className="text-[10px] text-[#78716C] dark:text-[#A39B8B] font-mono">
                                {date}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* WIDGET 3: Scholarly Intelligence Digest / Newsletter */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#161412] border border-[#E5DCCB] dark:border-[#2E2A24] shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#B88A2B] dark:text-[#D4AF37]">
                <Mail size={16} />
                <h4 className="font-serif font-bold text-sm text-[#1C1917] dark:text-[#F5F1E8]">
                  {dict.newsletterTitle}
                </h4>
              </div>
              <p className="text-xs text-[#57534E] dark:text-[#C5BEB3] font-sans leading-relaxed">
                {dict.newsletterDesc}
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2.5">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={dict.subscribePlaceholder}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FBF9F6] dark:bg-[#0F0D0B] border border-[#E5DCCB] dark:border-[#2E2A24] text-[#1C1917] dark:text-[#F5F1E8] placeholder-[#78716C] dark:placeholder-[#A39B8B] focus:outline-hidden focus:ring-2 focus:ring-[#B88A2B]"
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="w-full py-2 rounded-xl bg-[#B88A2B] hover:bg-[#A07621] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer disabled:opacity-60"
                >
                  <Send size={12} />
                  <span>{isSubscribing ? "..." : dict.subscribeBtn}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
