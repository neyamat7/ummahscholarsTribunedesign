"use client";

import React from "react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import SectionHeader from "@/components/SectionHeader";
import {
  fadeUp,
  scaleIn,
  staggerContainer,
  cardHoverAnimation,
} from "@/lib/animations";

// Curated jewel-tone palettes as default fallback styling
const DEFAULT_PALETTES = [
  { icon: LucideIcons.BookOpen, color: "bg-[#1B4D3E] text-white" },
  { icon: LucideIcons.Search, color: "bg-[#1E3A8A] text-white" },
  { icon: LucideIcons.Lightbulb, color: "bg-[#D97706] text-white" },
  { icon: LucideIcons.Scale, color: "bg-[#B88A2B] text-white" },
  { icon: LucideIcons.Sprout, color: "bg-[#0D9488] text-white" },
  { icon: LucideIcons.Globe, color: "bg-[#6D28D9] text-white" },
  { icon: LucideIcons.Compass, color: "bg-[#991B1B] text-white" },
  { icon: LucideIcons.Landmark, color: "bg-[#334155] text-white" },
];

/**
 * Dynamically resolves a Lucide icon component based on the name stored in the database
 */
function resolveCategoryIcon(iconName, fallbackIcon = LucideIcons.BookOpen) {
  if (!iconName || typeof iconName !== "string") return fallbackIcon;

  // 1. Direct key match (e.g. 'BookOpen', 'Scale', 'Scroll', 'Library')
  if (LucideIcons[iconName]) {
    return LucideIcons[iconName];
  }

  // 2. PascalCase conversion (e.g. 'book-open' -> 'BookOpen', 'graduation_cap' -> 'GraduationCap')
  const pascalCase = iconName
    .split(/[-_ ]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

  if (LucideIcons[pascalCase]) {
    return LucideIcons[pascalCase];
  }

  return fallbackIcon;
}

export default function ResearchFeatures({ categories = [] }) {
  const { isRtl } = useLanguage();

  // Filter to show ONLY POST categories (topic categories)
  const postCategories = (categories || []).filter(
    (c) => (c.type || "").toUpperCase() === "POST"
  );

  // If no categories passed, do not render empty section
  if (postCategories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 bg-[#F7F4EE] dark:bg-[#0F0D0B] transition-colors border-t border-b border-[#E5DCCB] dark:border-[#2E2A24]">
      <div className="max-w-7xl mx-auto px-5">
        {/* Section Header with 'See All Categories' Button */}
        <SectionHeader
          title={isRtl ? "ركائز الفكر والمنهج العلمي" : "Pillars of Scholarly Inquiry"}
          description={
            isRtl
              ? "استكشف الأقسام والمحاور العلمية التي يتناولها المنبر برؤية أصيلة ومنهجية رصينة."
              : "Explore the scholarly disciplines and intellectual pillars curated by the Tribune with methodological rigor."
          }
          action={{
            href: "/categories",
            label: isRtl ? "عرض كل الأقسام" : "See All Categories",
          }}
          borderBottom={true}
        />

        {/* Staggered Bento Grid of Post Categories */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer(0.08, 0.05)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {postCategories.map((cat, index) => {
            const isFeatured = index === 0;
            const fallbackPalette = DEFAULT_PALETTES[index % DEFAULT_PALETTES.length];
            
            // Resolve the exact Lucide icon selected by the admin in DB
            const Icon = resolveCategoryIcon(cat.icon, fallbackPalette.icon);
            
            // Title from database (with language switch)
            const rawTitle = isRtl
              ? (cat.nameAr && cat.nameAr.trim() !== ""
                  ? cat.nameAr.trim()
                  : cat.nameEn || "قسم علمي")
              : (cat.nameEn && cat.nameEn.trim() !== ""
                  ? cat.nameEn.trim()
                  : cat.nameAr || "Scholarly Topic");
            
            const title =
              !isRtl && typeof rawTitle === "string"
                ? rawTitle.replace(/\b\w/g, (char) => char.toUpperCase())
                : rawTitle;
                
            // Description directly from database (with language switch)
            const desc = isRtl
              ? (cat.descriptionAr && cat.descriptionAr.trim() !== ""
                  ? cat.descriptionAr.trim()
                  : cat.descriptionEn && cat.descriptionEn.trim() !== ""
                  ? cat.descriptionEn.trim()
                  : "بحوث ودراسات متخصصة تتناول هذا المجال بمنهجية علمية أصيلة.")
              : (cat.descriptionEn && cat.descriptionEn.trim() !== ""
                  ? cat.descriptionEn.trim()
                  : cat.descriptionAr && cat.descriptionAr.trim() !== ""
                  ? cat.descriptionAr.trim()
                  : "In-depth studies and scholarly treatises addressing this field with academic rigor.");

            const categorySlug = cat.slug || `cat-${cat.id}`;
            const displayIndex = String(index + 1).padStart(2, "0");
            
            // Article count from database
            const count = typeof cat.postCount === "number" ? cat.postCount : 0;
            const countLabel = isRtl
              ? count === 0
                ? "لا توجد مقالات حالياً"
                : count === 1
                ? "مقال وبحث واحد"
                : count === 2
                ? "مقالان وبحثان"
                : count >= 3 && count <= 10
                ? `${count} مقالات وبحوث`
                : `${count} مقال وبحث`
              : count === 1
              ? "1 Article"
              : `${count} Articles`;

            return (
              <motion.div
                key={cat.id || index}
                variants={isFeatured ? scaleIn : fadeUp}
                whileHover={cardHoverAnimation}
                className={`group relative rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between border ${
                  isFeatured
                    ? "sm:col-span-2 bg-[#FAF0D7] dark:bg-[#262118] border-[#B88A2B]/60 dark:border-[#C5A059]/40 shadow-sm hover:shadow-md"
                    : "bg-white dark:bg-[#1A1714] border-[#E5DCCB] dark:border-[#2E2A24] shadow-xs hover:border-[#B88A2B]/60 dark:hover:border-[#C5A059]/50 hover:shadow-md"
                }`}
              >
                <Link
                  href={`/blog/${categorySlug}`}
                  className="flex flex-col justify-between h-full group"
                >
                  <div>
                    {/* Top Bar: Icon Badge + Category Number */}
                    <div className="flex items-center justify-between mb-5">
                      <div
                        style={cat.color ? { backgroundColor: cat.color, color: "#ffffff" } : undefined}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-xs ${
                          !cat.color ? fallbackPalette.color : ""
                        } dark:bg-[#FAF4E9]/10 dark:text-[#C5A059]`}
                      >
                        <Icon size={24} strokeWidth={1.8} />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#B88A2B] dark:text-[#A39B8B]/60 bg-[#FAF0D7] dark:bg-[#262118] px-2.5 py-1 rounded-md">
                          {displayIndex}
                        </span>
                        <span className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowUpRight size={14} />
                        </span>
                      </div>
                    </div>

                    {/* Title (Capitalized in EN, Arabic in AR) */}
                    <h3
                      className={`font-serif font-bold mb-2 text-[#1C1917] dark:text-[#F5F1E8] group-hover:text-[#B88A2B] dark:group-hover:text-[#C5A059] transition-colors capitalize ${
                        isFeatured
                          ? "text-xl sm:text-2xl"
                          : "text-base sm:text-lg"
                      }`}
                    >
                      {title}
                    </h3>

                    {/* Description directly from Database */}
                    <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A39B8B] leading-relaxed line-clamp-3">
                      {desc}
                    </p>
                  </div>

                  {/* Clean Bottom Accent Divider with Dynamic Article Count */}
                  <div className="mt-6 pt-4 border-t border-[#E5DCCB]/70 dark:border-[#2E2A24]/60 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#B88A2B] dark:text-[#C5A059]">
                      {countLabel}
                    </span>
                    <span className="text-xs text-[#B88A2B] dark:text-[#C5A059] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-all">
                      ✦
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}