"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Loader2, BookOpen, ArrowRight, ArrowLeft, Calendar, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useDebounce } from "@/lib/useDebounce";
import { fetchPosts, getMediaUrl } from "@/lib/api";
import { formatDynamicDate } from "@/lib/dateUtils";
import { EXPO_EASE, fadeUp, staggerContainer } from "@/lib/animations";

export default function HeroSlider() {
  const { isRtl, t } = useLanguage();

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 350);
  const searchContainerRef = useRef(null);

  // Close dropdown on click outside
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

  // Fetch posts globally on debounced search input change
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

    async function executeSearch() {
      try {
        const res = await fetchPosts({
          search: query,
          status: "PUBLISHED",
          limit: 10,
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

    executeSearch();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch]);

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsDropdownOpen(false);
  };

  return (
    <section className="relative z-30 w-full min-h-[580px] lg:min-h-[660px] flex items-center bg-[#0F0D0B] pt-20">
      {/* Background Media with Gradient Mask positioned to clearly showcase image & logo on the right, shifted down */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 md:left-[15%] rtl:md:left-0 rtl:md:right-[15%] top-8 sm:top-10 md:top-14 lg:top-16 w-full h-[calc(100%-32px)] md:h-[calc(100%-60px)]">
          <Image
            src="/home.jpeg"
            alt="Ummah Scholars Tribune Banner"
            fill
            priority
            className="object-cover object-[70%_top] rtl:object-[30%_top] opacity-70 md:opacity-85 transition-transform duration-1000 scale-100"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F0D0B] via-[#0F0D0B]/85 to-transparent rtl:bg-gradient-to-l rtl:from-[#0F0D0B] rtl:via-[#0F0D0B]/85 md:w-3/5 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0D0B] via-transparent to-[#0F0D0B]/50 z-[1]" />
      </div>

      {/* Asymmetric Editorial Hero Content with Cascading Reveal */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28 w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.12, 0.1)}
          className={`max-w-2xl ${isRtl ? "text-right mr-0 ml-auto" : "text-left ml-0 mr-auto"}`}
        >
          {/* Editorial Display Heading */}
          <motion.h1
            variants={fadeUp}
            className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#F5F1E8] leading-[1.15] mb-6 tracking-tight"
          >
            {isRtl ? (
              <>
                تمكين الأمة بـ{" "}
                <span className="text-[#C5A059] italic underline decoration-[#C5A059]/40 underline-offset-8">
                  المعرفة
                </span>{" "}
                والرؤية المستنيرة
              </>
            ) : (
              <>
                Empowering The Ummah With{" "}
                <span className="text-[#C5A059] italic underline decoration-[#C5A059]/40 underline-offset-8">
                  Knowledge
                </span>{" "}
                & Perspective
              </>
            )}
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="text-neutral-300 text-sm sm:text-base lg:text-lg leading-relaxed font-sans mb-10 max-w-xl"
          >
            {isRtl
              ? "استكشف البحوث الأصيلة، والإعلانات العالمية، والدراسات المعاصرة، والرؤى الإسلامية العميقة من كبار العلماء والباحثين حول العالم."
              : "Explore authentic research, global announcements, contemporary legal studies, and profound Islamic insights from esteemed scholars worldwide."}
          </motion.p>

          {/* =================================================================
              LIVE DEBOUNCED GLOBAL SEARCH BAR (WITHOUT BUTTON)
              ================================================================= */}
          <motion.div
            variants={fadeUp}
            ref={searchContainerRef}
            className="relative z-50 max-w-lg w-full"
          >
            <div className="relative flex items-center bg-[#1A1714]/95 backdrop-blur-md border border-[#2E2A24] focus-within:border-[#C5A059] focus-within:ring-1 focus-within:ring-[#C5A059]/40 rounded-xl px-3.5 py-3 transition-all duration-300 shadow-2xl">
              {/* Search Icon or Loading Spinner */}
              <div className="shrink-0 text-[#C5A059] flex items-center justify-center mr-2 rtl:mr-0 rtl:ml-2">
                {isSearching ? (
                  <Loader2 className="w-5 h-5 animate-spin text-[#C5A059]" />
                ) : (
                  <Search className="w-5 h-5 opacity-90" />
                )}
              </div>

              {/* Input Field */}
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
                placeholder={
                  isRtl
                    ? "ابحث فوراً في جميع البحوث والدراسات والمقالات والأخبار..."
                    : "Search all research, articles, opinions, and announcements..."
                }
                className="w-full bg-transparent border-none outline-none text-[#F5F1E8] placeholder-[#8C8476] text-xs sm:text-sm font-sans"
              />

              {/* Clear Search Button */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="shrink-0 p-1 text-[#8C8476] hover:text-[#F5F1E8] rounded-full hover:bg-white/10 transition-colors cursor-pointer"
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
                  transition={{ duration: 0.2, ease: EXPO_EASE }}
                  className={`absolute top-full left-0 right-0 mt-2.5 z-50 bg-[#161412]/98 backdrop-blur-2xl border border-[#C5A059]/40 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden text-left rtl:text-right divide-y divide-[#2E2A24]/60`}
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
                      {isRtl ? "منبر أعلام الأمة" : "Scholarly Archive"}
                    </span>
                  </div>

                  {/* Dropdown Content Body */}
                  <div className="max-h-[380px] overflow-y-auto divide-y divide-[#2E2A24]/40 scrollbar-thin scrollbar-thumb-[#C5A059]/30 scrollbar-track-transparent">
                    {isSearching ? (
                      /* Loading Skeletons */
                      <div className="p-3 space-y-2.5">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-3 p-2 rounded-xl animate-pulse bg-white/5">
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
                          ? post.category?.nameAr || post.category?.nameEn || "دراسات وبحوث"
                          : post.category?.nameEn || post.category?.nameAr || "Research & Studies";

                        const rawImage =
                          (post.featuredImage && typeof post.featuredImage === "object"
                            ? post.featuredImage.url || post.featuredImage.thumbnailUrl
                            : typeof post.featuredImage === "string"
                            ? post.featuredImage
                            : null) ||
                          post.featuredImageUrl ||
                          post.image ||
                          "/news/news1.avif";

                        const imageUrl = getMediaUrl(rawImage, "/news/news1.avif");
                        const postUrl = `/${post.pageCategory?.slug || "research-studies"}/${post.slug || post.id}`;
                        const formattedDate = formatDynamicDate(post.publishedAt || post.createdAt, isRtl);

                        return (
                          <Link
                            key={post.id || post.slug}
                            href={postUrl}
                            onClick={() => {
                              setIsDropdownOpen(false);
                            }}
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

                            {/* Arrow indicator */}
                            <div className="shrink-0 text-[#A39B8B] group-hover:text-[#C5A059] transition-colors">
                              {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                            </div>
                          </Link>
                        );
                      })
                    ) : (
                      /* No Results Empty State */
                      <div className="p-6 text-center space-y-2">
                        <FileText className="w-8 h-8 text-[#A39B8B]/60 mx-auto" />
                        <p className="text-xs sm:text-sm font-serif font-medium text-[#F5F1E8]">
                          {isRtl
                            ? "لم يتم العثور على أي أبحاث أو مقالات مطابقة"
                            : "No articles or studies found matching your query"}
                        </p>
                        <p className="text-[11px] text-[#A39B8B]">
                          {isRtl
                            ? "جرّب البحث بكلمات أخرى أو تصفح الأقسام العلمية"
                            : "Try searching with different keywords or explore categories"}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}