"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { fadeUp, staggerContainer } from "@/lib/animations";
import SectionHeader from "@/components/SectionHeader";

export default function NewsSection({
  titleEn,
  titleAr,
  descriptionEn,
  descriptionAr,
  categorySlug,
  posts = [],
}) {
  const { isRtl } = useLanguage();

  if (!posts || posts.length === 0) return null;

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1, 4);

  const sectionTitle = isRtl ? titleAr : titleEn;
  const sectionDesc = isRtl ? descriptionAr : descriptionEn;

  const featuredTitle = isRtl
    ? featuredPost.titleAr || featuredPost.titleEn || featuredPost.title
    : featuredPost.titleEn || featuredPost.titleAr || featuredPost.title;

  const featuredExcerpt = isRtl
    ? featuredPost.excerptAr || featuredPost.excerptEn || featuredPost.excerpt
    : featuredPost.excerptEn || featuredPost.excerptAr || featuredPost.excerpt;

  const featuredDate =
    featuredPost.date ||
    (featuredPost.publishedAt
      ? new Date(featuredPost.publishedAt).toLocaleDateString(
          isRtl ? "ar-EG" : "en-US",
          { month: "long", day: "numeric", year: "numeric" }
        )
      : isRtl
      ? "أغسطس 2026"
      : "August 2026");

  const featuredImage =
    featuredPost.featuredImage?.url ||
    featuredPost.featuredImageUrl ||
    featuredPost.image ||
    "/news/news1.avif";

  const featuredSlug = featuredPost.slug || featuredPost.id;

  return (
    <section className="py-14 sm:py-18 bg-[#F7F4EE] dark:bg-[#0F0D0B] transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-5">
        {/* Common Section Header */}
        <SectionHeader
          title={sectionTitle}
          description={sectionDesc}
        />

        {/* 2. Featured Asymmetric Banner */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="rounded-2xl overflow-hidden bg-[#1A1714] dark:bg-[#0F0D0B] border border-[#2E2A24] text-[#F5F1E8] mb-10 shadow-lg"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left/Main Content Column (~65%) */}
            <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6">
              <div>
                {/* Featured Tag & Date Row */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="border border-[#B88A2B] dark:border-[#C5A059] text-[#B88A2B] dark:text-[#C5A059] text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full">
                    {isRtl ? "مميز" : "FEATURED"}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-[#A39B8B] font-sans">
                    <Calendar size={13} className="text-[#C5A059]" />
                    <span>{featuredDate}</span>
                  </div>
                </div>

                {/* Post Title */}
                <Link href={`/${featuredPost.pageCategory?.slug || "news-announcements"}/${featuredSlug}`}>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F1E8] leading-tight hover:text-[#C5A059] transition-colors">
                    {featuredTitle}
                  </h3>
                </Link>

                {/* Excerpt */}
                {featuredExcerpt && (
                  <p className="text-xs sm:text-sm text-[#A39B8B] line-clamp-2 leading-relaxed font-sans mt-3">
                    {featuredExcerpt}
                  </p>
                )}
              </div>

              {/* Gold Pill CTA Button */}
              <div>
                <Link href={`/${featuredPost.pageCategory?.slug || "news-announcements"}/${featuredSlug}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C5A059] hover:bg-[#A37F3D] text-[#0F0D0B] text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <span>{isRtl ? "اقرأ المزيد" : "Read More"}</span>
                    {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                  </motion.div>
                </Link>
              </div>
            </div>

            {/* Right Decorative Panel (~35%) */}
            <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-[#F7F4EE] dark:bg-[#1C1917] p-6 flex items-center justify-center border-t lg:border-t-0 border-[#E5DCCB] dark:border-[#2E2A24] rtl:lg:border-r ltr:lg:border-l">
              {/* Subtle Dotted Pattern Overlay */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(#C5A059 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />

              {/* Crop Image into soft rounded shape */}
              <div className="relative w-full h-full min-h-[220px] rounded-xl overflow-hidden shadow-md border border-[#E5DCCB] dark:border-[#2E2A24] group">
                <Image
                  src={featuredImage}
                  fill
                  unoptimized
                  alt={featuredTitle}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. Modern 3-Column Row of supporting cards */}
        {remainingPosts.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer(0.08, 0.04)}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {remainingPosts.map((post, idx) => {
              const cardTitle = isRtl
                ? post.titleAr || post.titleEn || post.title
                : post.titleEn || post.titleAr || post.title;

              const cardExcerpt = isRtl
                ? post.excerptAr || post.excerptEn || post.excerpt
                : post.excerptEn || post.excerptAr || post.excerpt;

              const cardDate =
                post.date ||
                (post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString(
                      isRtl ? "ar-EG" : "en-US",
                      { month: "long", day: "numeric", year: "numeric" }
                    )
                  : isRtl
                  ? "منذ أيام"
                  : "Recent");

              const cardImage =
                post.featuredImage?.url ||
                post.featuredImageUrl ||
                post.image ||
                "/news/news1.avif";

              const cardCategory = isRtl
                ? post.category?.nameAr || post.pageCategory?.nameAr || "أخبار"
                : post.category?.nameEn || post.pageCategory?.nameEn || "News";

              const cardSlug = post.slug || post.id;
              const cardPageCat = post.pageCategory?.slug || "news-announcements";

              return (
                <motion.div key={post.id || idx} variants={fadeUp} className="group h-full">
                  <Link
                    href={`/${cardPageCat}/${cardSlug}`}
                    className="block bg-white dark:bg-[#161412] rounded-2xl overflow-hidden border border-[#E5DCCB] dark:border-[#2E2A24] hover:border-[#B88A2B]/40 dark:hover:border-[#C5A059]/40 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-between h-full"
                  >
                    {/* Image Top Container */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1A1714]">
                      <Image
                        src={cardImage}
                        fill
                        unoptimized
                        alt={cardTitle}
                        className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-75 pointer-events-none" />

                      {/* Top Date Overlay Badge */}
                      <span className="absolute top-3 left-3 bg-[#0F0D0B]/80 backdrop-blur-md text-[#C5A059] border border-[#C5A059]/30 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                        <Calendar size={11} />
                        <span>{cardDate}</span>
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex flex-col justify-between flex-grow">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88A2B] dark:text-[#C5A059] block mb-2">
                          {cardCategory}
                        </span>

                        <h4 className="font-serif font-bold text-base text-[#1C1917] dark:text-[#F5F1E8] line-clamp-2 mb-2 group-hover:text-[#B88A2B] dark:group-hover:text-[#C5A059] transition-colors leading-snug">
                          {cardTitle}
                        </h4>

                        {cardExcerpt && (
                          <p className="text-xs text-[#57534E] dark:text-[#A39B8B] line-clamp-2 leading-relaxed font-sans">
                            {cardExcerpt}
                          </p>
                        )}
                      </div>

                      {/* Card Footer Row */}
                      <div className="pt-4 mt-4 border-t border-[#E5DCCB]/60 dark:border-[#2E2A24] flex items-center justify-between text-xs font-bold text-[#B88A2B] dark:text-[#C5A059]">
                        <span>{isRtl ? "اقرأ الخبر" : "Read Article"}</span>
                        <span className="transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                          {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
