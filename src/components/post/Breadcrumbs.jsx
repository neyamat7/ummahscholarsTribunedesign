"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Home } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Breadcrumbs({ category, postTitle, pageCategorySlug }) {
  const { isRtl, t } = useLanguage();

  const categoryName = isRtl
    ? category?.nameAr || category?.nameEn || "الأقسام"
    : category?.nameEn || category?.nameAr || "Category";

  const categoryLink = pageCategorySlug
    ? `/${pageCategorySlug}`
    : category?.slug
      ? `/research`
      : "/";

  const Chevron = isRtl ? ChevronLeft : ChevronRight;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 sm:gap-2 text-xs text-[#78716C] dark:text-[#A39B8B] mb-6 overflow-hidden flex-wrap leading-normal"
    >
      <Link
        href="/"
        className="inline-flex items-center gap-1 hover:text-[#B88A2B] dark:hover:text-[#C5A059] transition-colors shrink-0"
      >
        <Home size={13} className="shrink-0" />
        <span>{t("nav.home") || (isRtl ? "الرئيسية" : "Home")}</span>
      </Link>

      <Chevron size={12} className="text-[#A8A29E] dark:text-[#57534E] shrink-0" />

      <Link
        href={categoryLink}
        className="hover:text-[#B88A2B] dark:hover:text-[#C5A059] transition-colors shrink-0 font-medium max-w-[150px] truncate"
      >
        {categoryName}
      </Link>

      <Chevron size={12} className="text-[#A8A29E] dark:text-[#57534E] shrink-0" />

      <span
        className="text-[#1C1917] dark:text-[#F5F1E8] font-semibold truncate max-w-[200px] sm:max-w-[340px]"
        title={postTitle}
      >
        {postTitle}
      </span>
    </nav>
  );
}
