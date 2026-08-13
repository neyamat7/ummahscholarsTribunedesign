"use client";

import { useLanguage } from "@/context/LanguageContext";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Staggered heights so the 3 cards align like the reference —
// short / tall / medium — anchored to a common bottom baseline via items-end.
const CARD_HEIGHTS = ["h-[420px]", "h-[480px]", "h-[450px]"];

export default function OpinionsSection({
  titleEn,
  titleAr,
  highlightEn, // optional: the single word to italicize + color gold, e.g. "Yourself"
  highlightAr,
  descriptionEn,
  descriptionAr,
  categorySlug,
  posts = [],
}) {
  const { isRtl } = useLanguage();

  if (!posts || posts.length === 0) return null;

  const sectionDesc = isRtl ? descriptionAr : descriptionEn;

  // Build a two-line heading where the last word (or explicit highlight prop)
  // is italic + gold, matching "Become the Best Version of *Yourself*".
  const rawTitle = isRtl ? titleAr : titleEn;
  const highlight = isRtl ? highlightAr : highlightEn;
  const words = (rawTitle || "").trim().split(" ");
  const highlightWord = highlight || words[words.length - 1] || "";
  const leadingWords = highlight ? rawTitle : words.slice(0, -1).join(" ");

  return (
    <section className="py-14 sm:py-20 bg-[#F7F4EE] dark:bg-[#0F0D0B] transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-5">
        {/* Header row — big two-line heading left, circular "View All" action right */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-10 sm:mb-14"
        >
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B88A2B] dark:text-[#C5A059] block mb-2">
              {isRtl ? "أبرز الآراء" : "Opinion Spotlight"}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-bold leading-[1.15] text-[#1C1917] dark:text-[#F5F1E8]">
              {leadingWords}
              {leadingWords ? " " : ""}
              <span className="italic text-[#B88A2B] dark:text-[#C5A059]">
                {highlightWord}
              </span>
            </h2>
            {sectionDesc && (
              <p className="text-sm text-[#57534E] dark:text-[#A39B8B] mt-3 font-sans leading-relaxed">
                {sectionDesc}
              </p>
            )}
          </div>

          <Link
            href={`/blog/${categorySlug}`}
            className="flex items-center gap-3 flex-shrink-0 self-start sm:self-center group"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.1 }}
              className="w-11 h-11 rounded-full border-2 border-[#B88A2B] dark:border-[#C5A059] flex items-center justify-center flex-shrink-0 text-[#B88A2B] dark:text-[#C5A059]"
            >
              {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </motion.div>
            <span className="text-sm font-bold text-[#1C1917] dark:text-[#F5F1E8] group-hover:text-[#B88A2B] dark:group-hover:text-[#C5A059] transition-colors whitespace-nowrap">
              {isRtl ? "عرض الكل" : "View All"}
            </span>
          </Link>
        </motion.div>

        {/* Staggered photo-card row */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer(0.12, 0.05)}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-end"
        >
          {posts.slice(0, 3).map((post, index) => {
            const title = isRtl
              ? post.titleAr || post.titleEn || post.title
              : post.titleEn || post.titleAr || post.title;

            return (
              <motion.div key={post.id} variants={fadeUp} className="w-full">
                <Link
                  href={`/blog/post-${post.id}`}
                  className={`group block relative w-full ${CARD_HEIGHTS[index % 3]} rounded-t-[2rem] overflow-hidden bg-[#1A1714]`}
                >
                  {/* Cover image — muted by default, brightens to full color on hover */}
                  <Image
                    src={
                      post.featuredImageUrl || post.image || "/news/news1.avif"
                    }
                    fill
                    alt={title || "Opinion cover image"}
                    className="object-cover saturate-[0.65] brightness-[0.92] group-hover:saturate-100 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500 ease-out"
                  />

                  {/* Bottom gradient scrim for text legibility */}
                  <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                  {/* Title overlaid bottom-left */}
                  <div className="absolute bottom-6 left-6 right-6 rtl:left-6 rtl:right-6">
                    <h3 className="font-serif italic font-bold text-xl sm:text-2xl text-white leading-tight line-clamp-2 drop-shadow-md">
                      {title}
                    </h3>
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
