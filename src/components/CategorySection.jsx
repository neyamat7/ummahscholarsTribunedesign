"use client";

import React from "react";
import ArticleCard from "./ArticleCard";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import SectionHeader from "./SectionHeader";
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
        {/* Common Section Header */}
        <SectionHeader
          title={sectionTitle}
          description={sectionDesc}
          action={{
            href: `/blog/${categorySlug}`,
            label: isRtl ? "عرض المزيد" : "View More",
          }}
        />

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
