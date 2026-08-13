"use client";

import React from "react";
import ArticleCard from "./ArticleCard";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function CategorySection({
  titleEn,
  titleAr,
  descriptionEn,
  descriptionAr,
  categorySlug,
  bgVariant = "bg",
  posts = [],
}) {
  const { isRtl } = useLanguage();

  if (!posts || posts.length === 0) return null;

  const sectionTitle = isRtl ? titleAr : titleEn;
  const sectionDesc = isRtl ? descriptionAr : descriptionEn;

  // Rich alternating background style for light & dark modes
  const bgClasses =
    bgVariant === "surface"
      ? "bg-[#F3ECE0] dark:bg-[#1A1714] border-t border-b border-[#E5DCCB] dark:border-[#2E2A24]"
      : "bg-[#F7F4EE] dark:bg-[#0F0D0B]";

  return (
    <section className={`py-14 sm:py-18 transition-colors overflow-hidden ${bgClasses}`}>
      <div className="max-w-7xl mx-auto px-5">
        {/* Section Header Row with fadeUp */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#E5DCCB] dark:border-[#2E2A24]"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#B88A2B] dark:text-[#C5A059] block mb-1">
              {isRtl ? "قسم محدد" : "Category Focus"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] dark:text-[#F5F1E8]">
              {sectionTitle}
            </h2>
            {sectionDesc && (
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A39B8B] mt-1 font-sans max-w-xl">
                {sectionDesc}
              </p>
            )}
          </div>

          <motion.a
            whileHover={{ x: isRtl ? -4 : 4 }}
            href={`/blog/${categorySlug}`}
            className="mt-3 sm:mt-0 text-xs sm:text-sm font-bold text-[#B88A2B] dark:text-[#C5A059] hover:underline flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            {isRtl ? `عرض الكل (${sectionTitle})` : `View All (${sectionTitle})`}
            {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
          </motion.a>
        </motion.div>

        {/* 3-Column Responsive Grid with Staggered Entrance */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer(0.1, 0.05)}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {posts.slice(0, 3).map((post) => (
            <motion.div key={post.id} variants={fadeUp}>
              <ArticleCard item={post} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
