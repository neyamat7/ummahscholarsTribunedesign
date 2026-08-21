"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Eye,
  Share2,
  ArrowRight,
  ArrowLeft,
  Flame,
  Check,
  Award,
  Search,
  X,
  Loader2,
  FileText,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { fetchPosts, getMediaUrl } from "@/lib/api";
import { useDebounce } from "@/lib/useDebounce";
import { formatDynamicDate } from "@/lib/dateUtils";
import { toast } from "sonner";

export default function SectionHeroBanner({
  pageTitleEn = "Research & Studies",
  pageTitleAr = "البحوث والدراسات",
  pageTitleHighlightEn = "Studies",
  pageTitleHighlightAr = "والدراسات",
  heroDescriptionEn = "",
  heroDescriptionAr = "",
  pageCategorySlug = "research-studies",
  bgImage = "/research.jpeg",
  spotlightPost = null,
  badgeTextEn = "Major Feature",
  badgeTextAr = "دراسة مميزة",
  searchPlaceholderEn = "Search articles, studies, and research...",
  searchPlaceholderAr = "ابحث في الدراسات والبحوث والمقالات...",
  archiveLabelEn = "Section Archive",
  archiveLabelAr = "أرشيف القسم",
}) {
  const { isRtl } = useLanguage();
  const [copied, setCopied] = useState(false);

  // Live Scoped Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 350);
  const searchContainerRef = useRef(null);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Fetch posts filtered to this pageCategory
  useEffect(() => {
    const query = debouncedSearch.trim();

    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
      setIsDropdownOpen(false);
      return;
    }

    let isMounted = true;
    setIsSearching(true);
    setIsDropdownOpen(true);

    async function executeSectionSearch() {
      try {
        const res = await fetchPosts({
          pageCategory: pageCategorySlug,
          search: query,
          status: "PUBLISHED",
          limit: 8,
          sort: "newest",
        });

        if (isMounted) {
          setSearchResults(res?.posts || []);
        }
      } catch (err) {
        if (isMounted) {
          setSearchResults([]);
        }
      } finally {
        if (isMounted) {
          setIsSearching(false);
        }
      }
    }

    executeSectionSearch();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, pageCategorySlug]);

  const handleShare = async (e) => {
    if (!spotlightPost) return;
    e.preventDefault();
    e.stopPropagation();
    const postUrl = `/${spotlightPost.pageCategory?.slug || pageCategorySlug}/${spotlightPost.slug || spotlightPost.id}`;
    if (typeof window !== "undefined") {
      const fullUrl = `${window.location.origin}${postUrl}`;
      try {
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        toast.success(isRtl ? "تم نسخ الرابط بنجاح" : "Article link copied to clipboard");
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        toast.error(isRtl ? "تعذر نسخ الرابط" : "Failed to copy link");
      }
    }
  };

  const heroDescription = isRtl ? heroDescriptionAr : heroDescriptionEn;

  const spotlightTitle = spotlightPost
    ? isRtl
      ? spotlightPost.titleAr || spotlightPost.titleEn || "مقال ودراسة بحثية"
      : spotlightPost.titleEn || spotlightPost.titleAr || "Featured Scholarly Treatise"
    : "";

  const spotlightExcerpt = spotlightPost
    ? isRtl
      ? spotlightPost.excerptAr || spotlightPost.excerptEn || ""
      : spotlightPost.excerptEn || spotlightPost.excerptAr || ""
    : "";

  const rawSpotlightImage =
    (spotlightPost?.featuredImage && typeof spotlightPost?.featuredImage === "object"
      ? spotlightPost.featuredImage.url || spotlightPost.featuredImage.thumbnailUrl
      : typeof spotlightPost?.featuredImage === "string"
      ? spotlightPost.featuredImage
      : null) ||
    spotlightPost?.featuredImageUrl ||
    spotlightPost?.image ||
    bgImage;

  const spotlightImageUrl = getMediaUrl(rawSpotlightImage, bgImage);

  const spotlightDate = formatDynamicDate(
    spotlightPost?.publishedAt || spotlightPost?.createdAt,
    isRtl
  );

  const spotlightReadTime = Math.max(
    3,
    Math.ceil(
      (spotlightPost?.contentEn?.length || spotlightPost?.contentAr?.length || 1500) / 750
    )
  );

  const spotlightUrl = spotlightPost
    ? `/${spotlightPost.pageCategory?.slug || pageCategorySlug}/${spotlightPost.slug || spotlightPost.id}`
    : "#";

  // Calculate Title with Golden Highlights
  const rawTitle = isRtl ? pageTitleAr : pageTitleEn;
  const highlightWord = isRtl ? pageTitleHighlightAr : pageTitleHighlightEn;

  return (
    <section className="relative z-30 bg-[#FAF7F2] dark:bg-[#0F0D0B] text-[#1C1917] dark:text-[#F5F1E8] pt-20 sm:pt-28 lg:pt-32 pb-8 sm:pb-12 border-b border-[#E5DCCB] dark:border-[#2E2A24] transition-colors duration-300">
      {/* Background Architectural Image with Full Coverage */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <Image
          src={bgImage}
          alt={isRtl ? pageTitleAr : pageTitleEn}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-85 dark:opacity-45 transition-opacity duration-500"
        />
        {/* Soft, Balanced Ambient Overlay */}
        <div className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-[0.5px] transition-colors duration-300" />
        {/* Ambient Gold Glow blob */}
        <div className="absolute -top-32 right-1/4 w-[480px] h-[480px] bg-gradient-to-br from-[#C5A059]/15 to-transparent rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 space-y-8">
        {/* 1. HERO HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15] drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]"
          >
            {isRtl ? (
              <>
                {pageTitleAr.replace(pageTitleHighlightAr, "").trim()}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F7DF94] via-[#E5BF5A] to-[#C5A059] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                  {pageTitleHighlightAr}
                </span>
              </>
            ) : (
              <>
                {pageTitleEn.replace(pageTitleHighlightEn, "").trim()}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F7DF94] via-[#E5BF5A] to-[#C5A059] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                  {pageTitleHighlightEn}
                </span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            className="text-sm sm:text-base text-white/95 font-sans font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
          >
            {heroDescription}
          </motion.p>

          {/* =================================================================
              LIVE DEBOUNCED SECTION SEARCH BAR (PAGE CATEGORY SCOPED)
              ================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18 }}
            ref={searchContainerRef}
            className="relative max-w-xl mx-auto w-full z-40 pt-2"
          >
            <div className="relative flex items-center bg-[#1A1714]/95 backdrop-blur-xl border border-[#C5A059]/40 focus-within:border-[#C5A059] focus-within:ring-2 focus-within:ring-[#C5A059]/40 rounded-2xl px-4 py-3 shadow-2xl transition-all">
              {/* Search Icon or Loading Spinner */}
              <div className="shrink-0 text-[#C5A059] flex items-center justify-center mr-2.5 rtl:mr-0 rtl:ml-2.5">
                {isSearching ? (
                  <Loader2 className="w-5 h-5 animate-spin text-[#C5A059]" />
                ) : (
                  <Search className="w-5 h-5 opacity-90" />
                )}
              </div>

              {/* Search Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!isDropdownOpen && e.target.value.trim()) {
                    setIsDropdownOpen(true);
                  }
                }}
                onFocus={() => {
                  if (searchQuery.trim() && (searchResults.length > 0 || isSearching)) {
                    setIsDropdownOpen(true);
                  }
                }}
                placeholder={isRtl ? searchPlaceholderAr : searchPlaceholderEn}
                className="w-full bg-transparent border-none outline-none text-[#F5F1E8] placeholder-white/60 text-xs sm:text-sm font-sans"
              />

              {/* Clear Button */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                    setIsDropdownOpen(false);
                  }}
                  className="shrink-0 p-1 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                  title={isRtl ? "مسح البحث" : "Clear search"}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* =================================================================
                LIVE SEARCH RESULTS DROPDOWN
                ================================================================= */}
            <AnimatePresence>
              {isDropdownOpen && searchQuery.trim().length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2.5 z-50 bg-[#161412]/98 backdrop-blur-2xl border border-[#C5A059]/40 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden text-left rtl:text-right divide-y divide-[#2E2A24]/60"
                >
                  {/* Dropdown Header */}
                  <div className="px-4 py-2.5 bg-[#1F1B16] flex items-center justify-between text-[11px] font-mono text-[#A39B8B]">
                    <span>
                      {isSearching
                        ? isRtl
                          ? "جارٍ البحث في الأرشيف..."
                          : "Searching archive..."
                        : isRtl
                        ? `نتائج البحث (${searchResults.length})`
                        : `Search Results (${searchResults.length})`}
                    </span>
                    <span className="text-[10px] text-[#C5A059]/80 uppercase tracking-wider">
                      {isRtl ? archiveLabelAr : archiveLabelEn}
                    </span>
                  </div>

                  {/* Dropdown Content Body */}
                  <div className="max-h-[380px] overflow-y-auto divide-y divide-[#2E2A24]/40 scrollbar-thin scrollbar-thumb-[#C5A059]/30 scrollbar-track-transparent">
                    {isSearching ? (
                      /* Loading Skeletons */
                      <div className="p-3 space-y-2.5">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-2 rounded-xl animate-pulse bg-white/5"
                          >
                            <div className="w-12 h-12 rounded-lg bg-white/10 shrink-0" />
                            <div className="flex-1 space-y-1.5">
                              <div className="h-3 bg-white/10 rounded w-3/4" />
                              <div className="h-2.5 bg-white/5 rounded w-1/2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : searchResults.length > 0 ? (
                      /* List of Matching Posts */
                      searchResults.map((post) => {
                        const title = isRtl
                          ? post.titleAr || post.titleEn || post.title
                          : post.titleEn || post.titleAr || post.title;

                        const catName = isRtl
                          ? post.category?.nameAr || post.category?.nameEn || (isRtl ? pageTitleAr : pageTitleEn)
                          : post.category?.nameEn || post.category?.nameAr || (isRtl ? pageTitleAr : pageTitleEn);

                        const rawImage =
                          (post.featuredImage && typeof post.featuredImage === "object"
                            ? post.featuredImage.url || post.featuredImage.thumbnailUrl
                            : typeof post.featuredImage === "string"
                            ? post.featuredImage
                            : null) ||
                          post.featuredImageUrl ||
                          post.image ||
                          bgImage;

                        const imageUrl = getMediaUrl(rawImage, bgImage);
                        const postUrl = `/${post.pageCategory?.slug || pageCategorySlug}/${post.slug || post.id}`;
                        const formattedDate = formatDynamicDate(
                          post.publishedAt || post.createdAt,
                          isRtl
                        );

                        return (
                          <Link
                            key={post.id || post.slug}
                            href={postUrl}
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3.5 p-3 hover:bg-[#FAF0D7]/10 transition-colors group cursor-pointer"
                          >
                            {/* Thumbnail */}
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-neutral-900 border border-[#2E2A24]">
                              <Image
                                src={imageUrl}
                                alt={title}
                                fill
                                sizes="48px"
                                className="object-cover group-hover:scale-108 transition-transform duration-300"
                              />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 text-[10px] text-[#A39B8B] mb-0.5 flex-wrap">
                                <span className="font-bold text-[#C5A059] truncate max-w-[120px]">
                                  {catName}
                                </span>
                                {formattedDate && (
                                  <>
                                    <span>•</span>
                                    <span>{formattedDate}</span>
                                  </>
                                )}
                              </div>
                              <h4 className="font-serif font-bold text-xs sm:text-sm text-[#F5F1E8] group-hover:text-[#C5A059] transition-colors truncate">
                                {title}
                              </h4>
                            </div>

                            {/* Arrow */}
                            <div className="shrink-0 text-[#A39B8B] group-hover:text-[#C5A059] transition-colors">
                              {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                            </div>
                          </Link>
                        );
                      })
                    ) : (
                      /* Empty State */
                      <div className="p-6 text-center space-y-2">
                        <FileText className="w-8 h-8 text-[#A39B8B]/60 mx-auto" />
                        <p className="text-xs sm:text-sm font-serif font-medium text-[#F5F1E8]">
                          {isRtl
                            ? "لم يتم العثور على أي مواد مطابقة للبحث"
                            : "No articles found matching your query"}
                        </p>
                        <p className="text-[11px] text-[#A39B8B]">
                          {isRtl
                            ? "جرّب استخدام كلمات مفتاحية أخرى"
                            : "Try searching with different keywords"}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* 2. FEATURED SPOTLIGHT ARTICLE CARD */}
        {spotlightPost && (
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            <article className="group relative rounded-3xl overflow-hidden bg-white/95 dark:bg-[#161412]/95 backdrop-blur-md border border-[#E5DCCB] dark:border-[#2E2A24] shadow-xl hover:shadow-2xl hover:border-[#C5A059]/60 transition-all duration-500">
              <div className="grid md:grid-cols-12 items-stretch">
                {/* Visual Image (7 Cols) */}
                <div className="relative md:col-span-7 min-h-[280px] sm:min-h-[380px] overflow-hidden bg-neutral-900">
                  <Image
                    src={spotlightImageUrl}
                    alt={spotlightTitle}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Badges Container */}
                  <div className="absolute top-4 start-4 flex items-center gap-2 flex-wrap z-10">
                    <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#B88A2B] text-white shadow-md flex items-center gap-1.5">
                      <Flame size={13} className="fill-white" />
                      <span>{isRtl ? badgeTextAr : badgeTextEn}</span>
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white/90 border border-white/20">
                      {spotlightPost.category?.nameAr ||
                        spotlightPost.category?.nameEn ||
                        (isRtl ? pageTitleAr : pageTitleEn)}
                    </span>
                  </div>

                  {/* Date & Read time floating over image on mobile */}
                  <div className="absolute bottom-4 start-4 flex items-center gap-3 text-xs text-white/90 z-10 md:hidden">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      {spotlightDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      {spotlightReadTime} {isRtl ? "دقائق" : "min"}
                    </span>
                  </div>
                </div>

                {/* Editorial Content (5 Cols) */}
                <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    {/* Desktop Meta Tag */}
                    <div className="hidden md:flex items-center gap-2.5 text-xs text-[#78716C] dark:text-[#A39B8B]">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar size={13} />
                        {spotlightDate}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock size={13} />
                        {spotlightReadTime} {isRtl ? "دقائق قراءة" : "min read"}
                      </span>
                    </div>

                    {/* Spotlight Headline */}
                    <Link href={spotlightUrl} className="block group/link">
                      <h2 className="font-serif font-black text-xl sm:text-2xl text-[#1C1917] dark:text-[#F5F1E8] group-hover/link:text-[#B88A2B] dark:group-hover/link:text-[#D4AF37] transition-colors leading-snug">
                        {spotlightTitle}
                      </h2>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#C5BEB3] font-sans leading-relaxed line-clamp-3">
                      {spotlightExcerpt}
                    </p>
                  </div>

                  {/* Actions & Attribution */}
                  <div className="pt-4 border-t border-[#E5DCCB] dark:border-[#2E2A24] flex items-center justify-between gap-3">
                    <Link
                      href={spotlightUrl}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B88A2B] hover:bg-[#A07621] text-white text-xs font-bold transition-colors shadow-sm hover:shadow-md cursor-pointer"
                    >
                      <span>{isRtl ? "قراءة المقال كاملاً" : "Read Full Article"}</span>
                      {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                    </Link>

                    <button
                      type="button"
                      onClick={handleShare}
                      className="p-2.5 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] hover:bg-[#FAF0D7] dark:hover:bg-[#262118] text-[#78716C] dark:text-[#A39B8B] transition-colors cursor-pointer"
                      title={isRtl ? "مشاركة المقال" : "Share Article"}
                    >
                      {copied ? (
                        <Check size={16} className="text-emerald-600" />
                      ) : (
                        <Share2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </motion.div>
        )}
      </div>
    </section>
  );
}
