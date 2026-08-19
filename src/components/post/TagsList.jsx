"use client";

import React from "react";
import Link from "next/link";
import { Tag as TagIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function TagsList({ tags = [] }) {
  const { isRtl } = useLanguage();

  if (!tags || tags.length === 0) return null;

  return (
    <div className="my-8 flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#78716C] dark:text-[#A39B8B] me-2">
        <TagIcon size={14} className="text-[#B88A2B] dark:text-[#C5A059]" />
        <span>{isRtl ? "الوسوم والكلمات المفتاحية:" : "Topic Tags:"}</span>
      </div>

      {tags.map((item, idx) => {
        const tagObj = item.tag || item;
        const tagName = isRtl
          ? tagObj.nameAr || tagObj.nameEn || tagObj.name
          : tagObj.nameEn || tagObj.nameAr || tagObj.name;
        const tagSlug = tagObj.slug || String(tagName).toLowerCase().replace(/\s+/g, "-");

        return (
          <Link
            key={tagObj.id || idx}
            href={`/research?tag=${tagSlug}`}
            className="px-3 py-1 rounded-full text-xs font-medium bg-[#FAF0D7]/60 dark:bg-[#1A1714] border border-[#E5DCCB] dark:border-[#2E2A24] text-[#57534E] dark:text-[#A39B8B] hover:text-[#B88A2B] dark:hover:text-[#C5A059] hover:border-[#B88A2B]/40 dark:hover:border-[#C5A059]/40 transition-all cursor-pointer shadow-2xs"
          >
            #{tagName}
          </Link>
        );
      })}
    </div>
  );
}
