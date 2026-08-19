"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, Clock, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function LatestBlogsSection({ posts = [] }) {
  const { isRtl } = useLanguage();

  if (!posts || posts.length === 0) return null;

  const featuredPost = posts[0];
  const promoPost = posts[1] || posts[0];
  const sidebarPosts = posts.length > 2 ? posts.slice(2, 5) : posts.slice(1, 4);

  const featuredTitle = isRtl
    ? featuredPost.titleAr || featuredPost.titleEn || featuredPost.title
    : featuredPost.titleEn || featuredPost.titleAr || featuredPost.title;

  const featuredExcerpt = isRtl
    ? featuredPost.excerptAr || featuredPost.excerptEn || featuredPost.excerpt
    : featuredPost.excerptEn || featuredPost.excerptAr || featuredPost.excerpt;

  const featuredCategory = isRtl
    ? featuredPost.category?.nameAr || featuredPost.pageCategory?.nameAr || "دراسات"
    : featuredPost.category?.nameEn || featuredPost.pageCategory?.nameEn || "Studies";

  const featuredAuthor = isRtl
    ? featuredPost.author?.nameAr || featuredPost.author?.name || "هيئة التحرير"
    : featuredPost.author?.nameEn || featuredPost.author?.name || "Editorial Board";

  const featuredImage =
    featuredPost.featuredImage?.url ||
    featuredPost.featuredImageUrl ||
    featuredPost.image ||
    "/news/news1.avif";

  const featuredSlug = featuredPost.slug || featuredPost.id;

  // Promo card blog post details (posts[1])
  const promoTitle = isRtl
    ? promoPost.titleAr || promoPost.titleEn || promoPost.title
    : promoPost.titleEn || promoPost.titleAr || promoPost.title;

  const promoExcerpt = isRtl
    ? promoPost.excerptAr || promoPost.excerptEn || promoPost.excerpt
    : promoPost.excerptEn || promoPost.excerptAr || promoPost.excerpt;

  const promoCategory = isRtl
    ? promoPost.category?.nameAr || promoPost.pageCategory?.nameAr || "آراء وتطلعات"
    : promoPost.category?.nameEn || promoPost.pageCategory?.nameEn || "Featured Spotlight";

  const promoSlug = promoPost.slug || promoPost.id;

  return (
    <section className="py-12 bg-[#F7F4EE] dark:bg-[#0F0D0B] transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-5">
        {/* 1. Centered Horizontal Rule Divider Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="flex items-center my-8 sm:my-12"
        >
          <div className="flex-1 border-t border-[#E5DCCB] dark:border-[#2E2A24]" />
          <h2 className="px-4 sm:px-8 text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#1C1917] dark:text-[#F5F1E8] tracking-tight text-center leading-snug">
            {isRtl ? (
              <>
                أحدث ما نشر في{" "}
                <span className="italic text-[#B88A2B] dark:text-[#C5A059]">
                  المنبر
                </span>
              </>
            ) : (
              <>
                Latest From the{" "}
                <span className="italic text-[#B88A2B] dark:text-[#C5A059]">
                  Tribune
                </span>
              </>
            )}
          </h2>
          <div className="flex-1 border-t border-[#E5DCCB] dark:border-[#2E2A24]" />
        </motion.div>

        {/* 2. Two-Column Layout Container with full-height alignment */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer(0.1, 0.05)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
        >
          {/* LEFT: Featured/Primary Article (lg:col-span-2, grabs full section height) */}
          <motion.div variants={fadeUp} className="lg:col-span-2 group h-full">
            <Link href={`/${featuredPost.pageCategory?.slug || "research-studies"}/${featuredSlug}`} className="block h-full">
              <div className="relative h-full min-h-[360px] sm:min-h-[400px] w-full rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all bg-[#1A1714] flex flex-col justify-between p-6 sm:p-8">
                <Image
                  src={featuredImage}
                  fill
                  unoptimized
                  alt={featuredTitle}
                  className="object-cover group-hover:scale-103 transition-transform duration-500"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-0 pointer-events-none" />

                {/* Top Overlaid Badges */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="bg-[#B88A2B] dark:bg-[#C5A059] text-[#0F0D0B] font-bold text-[10px] uppercase px-3 py-1 rounded-full shadow-sm tracking-wider">
                    {isRtl ? "الأحدث" : "LATEST"}
                  </span>

                  <span className="bg-black/60 backdrop-blur-md text-[#F5F1E8] text-[10px] font-semibold px-3 py-1 rounded-full border border-white/10 shadow-sm">
                    {featuredCategory}
                  </span>
                </div>

                {/* Bottom Overlaid Text Content */}
                <div className="relative z-10 mt-auto pt-12">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white group-hover:text-[#C5A059] transition-colors leading-tight drop-shadow-md">
                    {featuredTitle}
                  </h3>

                  {featuredExcerpt && (
                    <p className="text-xs sm:text-sm text-stone-200 line-clamp-2 leading-relaxed font-sans mt-3 drop-shadow">
                      {featuredExcerpt}
                    </p>
                  )}

                  {/* Byline Row */}
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] mt-4 flex items-center gap-3 drop-shadow">
                    <span className="flex items-center gap-1.5 text-stone-200">
                      <User size={12} className="text-[#C5A059]" />
                      {featuredAuthor}
                    </span>
                    <span className="text-stone-400">•</span>
                    <span className="flex items-center gap-1.5 text-stone-200">
                      <Clock size={12} className="text-[#C5A059]" />
                      {isRtl ? "قراءة ٥ دقائق" : "5 MIN READ"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* RIGHT: Sidebar Stack (lg:col-span-1) */}
          <div className="lg:col-span-1 space-y-4 flex flex-col justify-between h-full">
            {/* a) Compact Blog Post Feature Card in Tinted Box */}
            <motion.div
              variants={fadeUp}
              className="bg-[#F3ECE0] dark:bg-[#1A1714] rounded-xl p-4 border border-[#E5DCCB] dark:border-[#2E2A24] shadow-sm group hover:border-[#B88A2B]/40 dark:hover:border-[#C5A059]/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#B88A2B]/10 dark:bg-[#C5A059]/10 text-[#B88A2B] dark:text-[#C5A059] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Compass size={12} />
                  <span>{promoCategory}</span>
                </span>
                <span className="text-[10px] text-[#A39B8B] font-semibold">
                  {promoPost.date || (isRtl ? "شائع" : "Trending")}
                </span>
              </div>

              <Link href={`/${promoPost.pageCategory?.slug || "research-studies"}/${promoSlug}`}>
                <h4 className="font-serif font-bold text-base text-[#1C1917] dark:text-[#F5F1E8] group-hover:text-[#B88A2B] dark:group-hover:text-[#C5A059] transition-colors leading-snug mb-1.5">
                  {promoTitle}
                </h4>
              </Link>

              {promoExcerpt && (
                <p className="text-xs text-[#57534E] dark:text-[#A39B8B] font-sans leading-relaxed line-clamp-2">
                  {promoExcerpt}
                </p>
              )}
            </motion.div>

            {/* b) Vertical List of Next Posts */}
            {sidebarPosts.length > 0 && (
              <div className="divide-y divide-[#E5DCCB] dark:divide-[#2E2A24] border-t border-b border-[#E5DCCB] dark:border-[#2E2A24]">
                {sidebarPosts.map((post, idx) => {
                  const title = isRtl
                    ? post.titleAr || post.titleEn || post.title
                    : post.titleEn || post.titleAr || post.title;

                  const category = isRtl
                    ? post.category?.nameAr || post.pageCategory?.nameAr || "مقالات"
                    : post.category?.nameEn || post.pageCategory?.nameEn || "Articles";

                  const author = isRtl
                    ? post.author?.nameAr || post.author?.name || "باحث"
                    : post.author?.nameEn || post.author?.name || "Scholar";

                  const image =
                    post.featuredImage?.url ||
                    post.featuredImageUrl ||
                    post.image ||
                    "/news/news1.avif";

                  const postSlug = post.slug || post.id;
                  const sidebarPageCat = post.pageCategory?.slug || "research-studies";

                  return (
                    <motion.div key={post.id || idx} variants={fadeUp}>
                      <Link
                        href={`/${sidebarPageCat}/${postSlug}`}
                        className="p-3 rounded-lg hover:bg-[#E5DCCB]/30 dark:hover:bg-[#1C1917] transition-colors block group flex items-center gap-3.5"
                      >
                        {/* Square Thumbnail */}
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative bg-[#1A1714]">
                          <Image
                            src={image}
                            fill
                            unoptimized
                            alt={title}
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Title & Metadata */}
                        <div className="flex-grow min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B88A2B] dark:text-[#C5A059] block mb-0.5">
                            {category}
                          </span>
                          <h5 className="font-serif font-bold text-sm text-[#1C1917] dark:text-[#F5F1E8] line-clamp-1 group-hover:text-[#B88A2B] dark:group-hover:text-[#C5A059] transition-colors leading-snug">
                            {title}
                          </h5>
                          <span className="text-[11px] text-[#A39B8B] mt-1 block">
                            {author}
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
