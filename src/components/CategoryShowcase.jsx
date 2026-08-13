"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowLeft, BookOpen, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import ArticleCard from "./ArticleCard";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function CategoryShowcase({
  titleEn = "Research & Studies",
  titleAr = "البحوث والدراسات",
  descriptionEn = "Peer-reviewed academic research on classical jurisprudence, legal methodologies, and contemporary governance.",
  descriptionAr = "بحوث أكاديمية محكّمة حول الفقه الكلاسيكي والمناهج القانونية والحوكمة المعاصرة.",
  categorySlug = "research-studies",
  posts = [],
}) {
  const { isRtl } = useLanguage();
  const containerRef = useRef(null);

  // Set up Framer Motion scroll-linked progress starting when container enters viewport from screen bottom ("start end")
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  /*
   * Extended Scroll Stage Breakdown (start end -> end end):
   * Stage A (0% - 15%): As section enters from screen bottom ("belly"), 4 full images are immediately 100% visible & centered in a stacked deck.
   * Stage B (15% - 35%): Section pins sticky (top-0). Images fan out smoothly towards the 4 corners.
   * Stage C (20% - 35%): Center text block (Headline, Description, CTA) fades & slides up into the vacated center space.
   * Stage D (35% - 88%): EXTENDED PINNED HOLD — Section stays 100% pinned & still. All text, images, and floating badges remain 100% visible for comfortable reading and clicking.
   * Stage E (88% - 100%): Unpins cleanly as visitor continues scrolling down.
   */

  const isRtlFactor = isRtl ? -1 : 1;

  // 1. Top-Left Image Transformations
  const img1X = useTransform(scrollYProgress, [0.12, 0.35, 0.88], [0, -340 * isRtlFactor, -340 * isRtlFactor]);
  const img1Y = useTransform(scrollYProgress, [0.12, 0.35, 0.88], [0, -170, -170]);
  const img1Rotate = useTransform(scrollYProgress, [0.12, 0.35, 0.88], [0, -4, -4]);

  // 2. Top-Right Image Transformations
  const img2X = useTransform(scrollYProgress, [0.14, 0.37, 0.88], [0, 340 * isRtlFactor, 340 * isRtlFactor]);
  const img2Y = useTransform(scrollYProgress, [0.14, 0.37, 0.88], [0, -170, -170]);
  const img2Rotate = useTransform(scrollYProgress, [0.14, 0.37, 0.88], [0, 4, 4]);

  // 3. Bottom-Left Image Transformations
  const img3X = useTransform(scrollYProgress, [0.16, 0.39, 0.88], [0, -340 * isRtlFactor, -340 * isRtlFactor]);
  const img3Y = useTransform(scrollYProgress, [0.16, 0.39, 0.88], [0, 170, 170]);
  const img3Rotate = useTransform(scrollYProgress, [0.16, 0.39, 0.88], [0, 3, 3]);

  // 4. Bottom-Right Image Transformations
  const img4X = useTransform(scrollYProgress, [0.18, 0.41, 0.88], [0, 340 * isRtlFactor, 340 * isRtlFactor]);
  const img4Y = useTransform(scrollYProgress, [0.18, 0.41, 0.88], [0, 170, 170]);
  const img4Rotate = useTransform(scrollYProgress, [0.18, 0.41, 0.88], [0, -4, -4]);

  // Shared Scale for Images (Full size opacity 1 from initial appearance)
  const imgScale = useTransform(scrollYProgress, [0.0, 0.35, 0.88], [0.95, 1, 1]);

  // Central Text Block Transformations (Fades in smoothly between 0.18 and 0.35, holds until 0.88)
  const textOpacity = useTransform(scrollYProgress, [0.18, 0.35, 0.88, 0.98], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0.18, 0.35], [32, 0]);

  // Floating Info Badges Transformations (Fade in smoothly between 0.28 and 0.42, hold until 0.88)
  const badgeOpacity = useTransform(scrollYProgress, [0.28, 0.42, 0.88, 0.98], [0, 1, 1, 0]);
  const badgeScale = useTransform(scrollYProgress, [0.28, 0.42], [0.88, 1]);

  const displayPosts = posts.slice(0, 4);
  const sectionTitle = isRtl ? titleAr : titleEn;
  const sectionDesc = isRtl ? descriptionAr : descriptionEn;

  return (
    <>
      {/* =================================================================
          DESKTOP PINNED SCROLL-SCRUBBED REVEAL (lg:block, h-[320vh] Runway)
          ================================================================= */}
      <div ref={containerRef} className="relative hidden lg:block h-[320vh] bg-[#FAF4E9] dark:bg-[#0F0D0B]">
        <div className="sticky top-0 h-screen w-full overflow-hidden border-t border-b border-[#E5DCCB] dark:border-[#2E2A24] flex items-center justify-center bg-arabesque-pattern">
          
          {/* Central Text Block (Stage C Fade & Slide Up + Extended Reading Hold) */}
          <motion.div
            style={{ opacity: textOpacity, y: textY }}
            className="relative z-20 max-w-xl text-center px-6 pointer-events-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B4D3E] text-white dark:bg-[#262118] dark:text-[#C5A059] text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <BookOpen size={14} />
              <span>{isRtl ? "عرض خاص بالمحور العلمي" : "Category Showcase"}</span>
            </div>

            <h2 className="text-3xl lg:text-5xl font-serif font-bold text-[#1C1917] dark:text-[#F5F1E8] mb-4 tracking-tight leading-tight">
              {sectionTitle}
            </h2>

            <p className="text-sm lg:text-base text-[#57534E] dark:text-[#A39B8B] font-sans leading-relaxed mb-8 max-w-lg mx-auto">
              {sectionDesc}
            </p>

            <Link
              href={`/blog/${categorySlug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1B4D3E] dark:bg-[#C5A059] text-white dark:text-[#0F0D0B] font-bold text-sm hover:bg-[#153e32] dark:hover:bg-[#A37F3D] transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>{isRtl ? `عرض جميع بحوث (${sectionTitle})` : `View All (${sectionTitle})`}</span>
              {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </Link>
          </motion.div>

          {/* =================================================================
              4 SCROLL-SCRUBBED FEATURED IMAGES & FLOATING BADGES
              ================================================================= */}
          {displayPosts.map((post, idx) => {
            const title = isRtl
              ? post.titleAr || post.titleEn || post.title
              : post.titleEn || post.titleAr || post.title;

            const transforms = [
              { x: img1X, y: img1Y, rotate: img1Rotate },
              { x: img2X, y: img2Y, rotate: img2Rotate },
              { x: img3X, y: img3Y, rotate: img3Rotate },
              { x: img4X, y: img4Y, rotate: img4Rotate },
            ][idx % 4];

            return (
              <motion.div
                key={post.id || idx}
                style={{
                  x: transforms.x,
                  y: transforms.y,
                  rotate: transforms.rotate,
                  scale: imgScale,
                }}
                className="absolute z-10 w-[300px] xl:w-[340px] h-[210px] xl:h-[230px] rounded-2xl overflow-hidden shadow-xl border-2 border-white dark:border-[#2E2A24] bg-white dark:bg-[#1A1714] group"
              >
                <Link href={`/blog/post-${post.id}`} className="block w-full h-full relative">
                  <Image
                    src={post.featuredImageUrl || post.image || "/news/news1.avif"}
                    fill
                    alt={title || "Featured Research Image"}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </Link>

                {/* Stage D Floating Info Badge Card (Extended Hold Window) */}
                <motion.div
                  style={{ opacity: badgeOpacity, scale: badgeScale }}
                  className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-[#1A1714]/95 backdrop-blur-md p-2.5 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] shadow-lg pointer-events-auto"
                >
                  <Link
                    href={`/blog/post-${post.id}`}
                    className="flex items-center justify-between gap-2 group/link"
                  >
                    <span className="text-xs font-serif font-bold text-[#1C1917] dark:text-[#F5F1E8] line-clamp-1 group-hover/link:text-[#1B4D3E] dark:group-hover/link:text-[#C5A059] transition-colors">
                      {title}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-[#FAF0D7] dark:bg-[#262118] text-[#1B4D3E] dark:text-[#C5A059] flex items-center justify-center flex-shrink-0">
                      <ExternalLink size={12} />
                    </div>
                  </Link>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* =================================================================
          MOBILE RESPONSIVE FALLBACK GRID (lg:hidden)
          ================================================================= */}
      <section className="lg:hidden py-14 bg-[#FAF4E9] dark:bg-[#1A1714] border-t border-b border-[#E5DCCB] dark:border-[#2E2A24]">
        <div className="max-w-7xl mx-auto px-5">
          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#E5DCCB] dark:border-[#2E2A24]"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1B4D3E] dark:text-[#C5A059] block mb-1">
                {isRtl ? "محور بارز" : "Featured Showcase"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] dark:text-[#F5F1E8]">
                {sectionTitle}
              </h2>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A39B8B] mt-1 font-sans max-w-xl">
                {sectionDesc}
              </p>
            </div>

            <Link
              href={`/blog/${categorySlug}`}
              className="mt-3 sm:mt-0 text-xs sm:text-sm font-bold text-[#1B4D3E] dark:text-[#C5A059] hover:underline flex items-center gap-1 transition-colors whitespace-nowrap"
            >
              {isRtl ? `عرض الكل (${sectionTitle})` : `View All (${sectionTitle})`}
              {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
            </Link>
          </motion.div>

          {/* Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer(0.1, 0.05)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {displayPosts.map((post) => (
              <motion.div key={post.id} variants={fadeUp}>
                <ArticleCard item={post} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
