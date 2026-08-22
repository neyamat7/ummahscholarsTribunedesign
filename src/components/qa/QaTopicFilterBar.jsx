"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { LayoutGrid, ListFilter, SlidersHorizontal, Sparkles } from "lucide-react";

export default function QaTopicFilterBar({
  categories = [],
  selectedCategory = "ALL",
  onSelectCategory = () => {},
  viewMode = "accordion",
  onViewModeChange = () => {},
  sortBy = "newest",
  onSortChange = () => {},
  totalCount = 0,
}) {
  const { isRtl } = useLanguage();

  return (
    <div className="bg-white dark:bg-[#161412] border border-[#E5DCCB] dark:border-[#2E2A24] rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top Row: Topic Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
        {/* All Topics Pill */}
        <button
          type="button"
          onClick={() => onSelectCategory("ALL")}
          className={`relative px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            selectedCategory === "ALL"
              ? "bg-[#B88A2B] text-white shadow-md"
              : "bg-[#FBF9F6] dark:bg-[#1E1B18] text-[#78716C] dark:text-[#A39B8B] hover:text-[#1C1917] dark:hover:text-white border border-[#E5DCCB]/60 dark:border-[#2E2A24]"
          }`}
        >
          <span>{isRtl ? "جميع المسائل والأبواب" : "All Inquiries"}</span>
        </button>

        {/* Dynamic Category Pills */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id || selectedCategory === cat.slug;
          const name = isRtl ? cat.nameAr || cat.nameEn : cat.nameEn || cat.nameAr;

          return (
            <button
              key={cat.id || cat.slug}
              type="button"
              onClick={() => onSelectCategory(cat.id || cat.slug)}
              className={`relative px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-[#B88A2B] text-white shadow-md"
                  : "bg-[#FBF9F6] dark:bg-[#1E1B18] text-[#78716C] dark:text-[#A39B8B] hover:text-[#1C1917] dark:hover:text-white border border-[#E5DCCB]/60 dark:border-[#2E2A24]"
              }`}
            >
              <span>{name}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Row: Results Count + Sort + View Mode Switcher */}
      <div className="pt-3 border-t border-[#E5DCCB]/60 dark:border-[#2E2A24]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Counter */}
        <div className="text-[#78716C] dark:text-[#A39B8B] font-medium flex items-center gap-1.5">
          <Sparkles size={14} className="text-[#B88A2B]" />
          <span>
            {isRtl
              ? `عرض ${totalCount} مسألة وفتاوى معتمدة`
              : `Showing ${totalCount} verified advisories`}
          </span>
        </div>

        {/* Controls: Sort + View Mode */}
        <div className="flex items-center gap-3">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-[#78716C] dark:text-[#A39B8B]">
            <span className="hidden sm:inline font-bold">{isRtl ? "الترتيب:" : "Sort:"}</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#FBF9F6] dark:bg-[#1E1B18] border border-[#E5DCCB] dark:border-[#2E2A24] text-xs font-semibold text-[#1C1917] dark:text-[#F5F1E8] focus:outline-hidden cursor-pointer"
            >
              <option value="newest">{isRtl ? "الأحدث" : "Newest"}</option>
              <option value="views">{isRtl ? "الأكثر قراءة" : "Most Viewed"}</option>
              <option value="helpful">{isRtl ? "الأعلى فائدة" : "Most Helpful"}</option>
              <option value="oldest">{isRtl ? "الأقدم" : "Oldest"}</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-[#FBF9F6] dark:bg-[#1E1B18] border border-[#E5DCCB] dark:border-[#2E2A24]">
            <button
              type="button"
              onClick={() => onViewModeChange("accordion")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "accordion"
                  ? "bg-[#B88A2B] text-white shadow-xs"
                  : "text-[#78716C] dark:text-[#A39B8B] hover:text-[#1C1917] dark:hover:text-white"
              }`}
              title={isRtl ? "عرض القائمة السريعة" : "Accordion View"}
              aria-label="Accordion View"
            >
              <ListFilter size={15} />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-[#B88A2B] text-white shadow-xs"
                  : "text-[#78716C] dark:text-[#A39B8B] hover:text-[#1C1917] dark:hover:text-white"
              }`}
              title={isRtl ? "عرض البطاقات" : "Grid Card View"}
              aria-label="Grid Card View"
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
