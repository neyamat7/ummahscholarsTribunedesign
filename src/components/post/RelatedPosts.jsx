"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import ArticleCard from "@/components/ArticleCard";

export default function RelatedPosts({ posts = [], categoryName, pageCategorySlug }) {
  const { isRtl } = useLanguage();

  if (!posts || posts.length === 0) return null;

  const displayCategory = categoryName || (isRtl ? "هذا القسم" : "This Category");
  const categoryLink = pageCategorySlug ? `/${pageCategorySlug}` : "/research";

  return (
    <section className="my-16 pt-12 border-t border-[#E5DCCB] dark:border-[#2E2A24]">
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0D7] dark:bg-[#262118] text-[#B88A2B] dark:text-[#C5A059] border border-[#E5DCCB] dark:border-[#2E2A24] text-xs font-bold uppercase tracking-wider mb-2.5">
            <Sparkles size={13} />
            <span>{isRtl ? "قراءات موصى بها" : "Recommended Reading"}</span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1C1917] dark:text-[#F5F1E8]">
            {isRtl ? `المزيد في ${displayCategory}` : `More in ${displayCategory}`}
          </h2>
        </div>

        <Link
          href={categoryLink}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#B88A2B] dark:text-[#C5A059] hover:underline"
        >
          <span>{isRtl ? "عرض كل المقالات" : "Browse Category Archive"}</span>
          {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((item, idx) => (
          <ArticleCard key={item.id || idx} item={item} />
        ))}
      </div>
    </section>
  );
}
