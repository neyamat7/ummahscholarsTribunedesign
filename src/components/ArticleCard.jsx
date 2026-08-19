"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { cardHoverAnimation } from "@/lib/animations";

export default function ArticleCard({ item }) {
  const { isRtl, t } = useLanguage();

  const title = isRtl
    ? item.titleAr || item.titleEn || item.title
    : item.titleEn || item.titleAr || item.title;

  const excerpt = isRtl
    ? item.excerptAr || item.excerptEn || item.excerpt
    : item.excerptEn || item.excerptAr || item.excerpt;

  const categoryName = isRtl
    ? item.category?.nameAr || item.categoryNameAr || item.category || "بحوث"
    : item.category?.nameEn || item.categoryNameEn || item.category || "Research";

  const pageCategorySlug =
    item.pageCategory?.slug ||
    (item.category?.type === "PAGE" ? item.category?.slug : null) ||
    "research-studies";

  const postLink = `/${pageCategorySlug}/${item.slug || item.id}`;

  // Category badge color mapping
  const getBadgeStyle = (cat) => {
    const c = String(cat).toLowerCase();
    if (c.includes("research") || c.includes("بحوث")) {
      return "bg-[#1B4D3E]/12 text-[#1B4D3E] border-[#1B4D3E]/30 dark:bg-[#34D399]/15 dark:text-[#34D399] dark:border-[#34D399]/30";
    }
    if (c.includes("opinion") || c.includes("آراء")) {
      return "bg-[#1E3A8A]/12 text-[#1E3A8A] border-[#1E3A8A]/30 dark:bg-[#60A5FA]/15 dark:text-[#60A5FA] dark:border-[#60A5FA]/30";
    }
    return "bg-[#B88A2B]/15 text-[#B88A2B] border-[#B88A2B]/30 dark:bg-[#C5A059]/20 dark:text-[#C5A059] dark:border-[#C5A059]/30";
  };

  const dateStr = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString(isRtl ? "ar" : "en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : item.date || "2026";

  return (
    <Link href={postLink} className="block h-full">
      <motion.article
        whileHover={cardHoverAnimation}
        className="group bg-white dark:bg-[#1A1714] border border-[#E5DCCB] dark:border-[#2E2A24] rounded-2xl shadow-xs hover:shadow-md hover:border-[#B88A2B]/50 dark:hover:border-[#C5A059]/50 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer h-full"
      >
        <div>
        {/* Article Featured Image */}
        <div className="relative w-full h-48 overflow-hidden bg-[#FAF0D7] dark:bg-[#262118]">
          <Image
            src={item.featuredImageUrl || item.image || "/news/news1.avif"}
            width={500}
            height={320}
            alt={title || "Article thumbnail"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Content Details */}
        <div className="p-5">
          <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-2.5 ${getBadgeStyle(categoryName)}`}>
            {categoryName}
          </span>

          <h3 className="font-serif font-bold text-base sm:text-lg text-[#1C1917] dark:text-[#F5F1E8] group-hover:text-[#B88A2B] dark:group-hover:text-[#C5A059] transition-colors cursor-pointer line-clamp-2 leading-snug">
            {title}
          </h3>

          <p className="text-[#57534E] dark:text-[#A39B8B] mt-2 text-xs leading-relaxed line-clamp-3 font-sans">
            {excerpt}
          </p>
        </div>
      </div>

      {/* Footer Meta Row */}
      <div className="px-5 pb-5 pt-0 flex items-center justify-between text-xs border-t border-[#E5DCCB]/60 dark:border-[#2E2A24]/60 mt-3 pt-3">
        <span className="text-[#57534E] dark:text-[#A39B8B]/80 text-[11px]">
          {dateStr}
        </span>

        <span className="text-[#B88A2B] dark:text-[#C5A059] font-bold group-hover:underline flex items-center gap-1">
          {t("site.readMore")}
          <motion.span
            className="inline-block"
            initial={{ x: 0 }}
            whileHover={{ x: isRtl ? -4 : 4 }}
          >
            {isRtl ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
          </motion.span>
        </span>
      </div>
    </motion.article>
    </Link>
  );
}
