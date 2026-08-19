"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, Eye, User, Share2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { fadeUp } from "@/lib/animations";

export default function ArticleHeader({ post, onAuthorClick }) {
  const { isRtl } = useLanguage();

  const title = isRtl
    ? post.titleAr || post.titleEn || post.title
    : post.titleEn || post.titleAr || post.title;

  const categoryName = isRtl
    ? post.category?.nameAr || post.pageCategory?.nameAr || "بحوث ودراسات"
    : post.category?.nameEn || post.pageCategory?.nameEn || "Research & Studies";

  // Category jewel-tone badge styling
  const getBadgeStyle = (cat) => {
    const c = String(cat).toLowerCase();
    if (c.includes("research") || c.includes("بحوث")) {
      return "bg-[#1E3A8A]/12 text-[#1E3A8A] border-[#1E3A8A]/30 dark:bg-[#60A5FA]/15 dark:text-[#60A5FA] dark:border-[#60A5FA]/30";
    }
    if (c.includes("opinion") || c.includes("آراء")) {
      return "bg-[#6D28D9]/12 text-[#6D28D9] border-[#6D28D9]/30 dark:bg-[#A78BFA]/15 dark:text-[#A78BFA] dark:border-[#A78BFA]/30";
    }
    if (c.includes("news") || c.includes("أخبار")) {
      return "bg-[#D97706]/12 text-[#D97706] border-[#D97706]/30 dark:bg-[#FBBF24]/15 dark:text-[#FBBF24] dark:border-[#FBBF24]/30";
    }
    if (c.includes("event") || c.includes("فعاليات") || c.includes("مبادرات")) {
      return "bg-[#1B4D3E]/12 text-[#1B4D3E] border-[#1B4D3E]/30 dark:bg-[#34D399]/15 dark:text-[#34D399] dark:border-[#34D399]/30";
    }
    return "bg-[#B88A2B]/15 text-[#B88A2B] border-[#B88A2B]/30 dark:bg-[#C5A059]/20 dark:text-[#C5A059] dark:border-[#C5A059]/30";
  };

  // Formatted date
  const dateObj = post.publishedAt || post.createdAt ? new Date(post.publishedAt || post.createdAt) : new Date();
  const formattedDate = dateObj.toLocaleDateString(isRtl ? "ar-SA" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const readingTime = post.readingTimeMinutes || Math.max(3, Math.ceil((post.contentEn?.length || 1000) / 1000 * 2));
  const readingTimeText = isRtl ? `${readingTime} دقائق قراءة` : `${readingTime} min read`;

  const authorName = post.author?.name || "Dr. Zobair Sultan Rabbani";
  const authorAvatar = post.author?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`;
  const views = post.viewCount ?? post.views ?? 0;

  const imageUrl = post.featuredImageUrl || post.featuredImage?.url || post.image || "/news/news1.avif";

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className="mb-10 text-start"
    >
      {/* Category Badge */}
      <div className="mb-4">
        <span
          className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-2xs ${getBadgeStyle(categoryName)}`}
        >
          {categoryName}
        </span>
      </div>

      {/* Main Display Heading */}
      <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[2.85rem] leading-[1.2] tracking-tight text-[#1A1714] dark:text-[#F5F1E8] mb-6">
        {title}
      </h1>

      {/* Meta Strip */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 py-4 border-y border-[#E5DCCB]/80 dark:border-[#2E2A24]/80 text-xs sm:text-sm text-[#78716C] dark:text-[#A39B8B] mb-8">
        {/* Author (Clickable to open Scholar Bio Modal) */}
        <button
          type="button"
          onClick={onAuthorClick}
          className="group flex items-center gap-2.5 text-start cursor-pointer hover:opacity-85 transition-opacity"
          title={isRtl ? "عرض السيرة العلمية للمؤلف" : "View scholar biography"}
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#B88A2B]/40 dark:border-[#C5A059]/40 bg-[#FAF0D7] dark:bg-[#262118] shrink-0 group-hover:scale-105 transition-transform">
            <Image
              src={authorAvatar}
              alt={authorName}
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
          <div>
            <span className="text-[11px] block uppercase tracking-wider text-[#A8A29E] dark:text-[#78716C] font-semibold leading-none">
              {isRtl ? "المؤلف" : "Author"}
            </span>
            <span className="font-semibold text-[#1C1917] dark:text-[#F5F1E8] group-hover:text-[#B88A2B] dark:group-hover:text-[#C5A059] transition-colors underline decoration-dotted decoration-[#B88A2B]/40 underline-offset-2">
              {authorName}
            </span>
          </div>
        </button>

        <span className="h-4 w-px bg-[#E5DCCB] dark:bg-[#2E2A24] hidden sm:block" />

        {/* Date */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Calendar size={15} className="text-[#B88A2B] dark:text-[#C5A059]" />
          <span>{formattedDate}</span>
        </div>

        <span className="h-4 w-px bg-[#E5DCCB] dark:bg-[#2E2A24] hidden sm:block" />

        {/* Reading Time */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Clock size={15} className="text-[#B88A2B] dark:text-[#C5A059]" />
          <span>{readingTimeText}</span>
        </div>

        {/* Views */}
        <div className="flex items-center gap-1.5 shrink-0 ms-auto text-xs opacity-90">
          <Eye size={15} className="text-[#A8A29E] dark:text-[#78716C]" />
          <span>{views.toLocaleString(isRtl ? "ar-SA" : "en-US")} {isRtl ? "مشاهدة" : "views"}</span>
        </div>
      </div>

      {/* Featured Bleed Image */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FAF0D7] dark:bg-[#262118] border border-[#E5DCCB] dark:border-[#2E2A24] shadow-sm">
        <Image
          src={imageUrl}
          alt={title || "Featured Article Image"}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>
    </motion.header>
  );
}
