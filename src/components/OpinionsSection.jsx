"use client";

import { useLanguage } from "@/context/LanguageContext";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";

/* ---------------------------------------------------------------------- */
/*  Shared card — image on top (rounded, normal flow), content below.      */
/*  "featured" renders a taller image + larger type for the bento's        */
/*  primary slot; regular cards are compact for the side stack.            */
/* ---------------------------------------------------------------------- */
function BlogCard({ post, isRtl, featured = false }) {
  const title = isRtl
    ? post.titleAr || post.titleEn || post.title
    : post.titleEn || post.titleAr || post.title;

  const excerpt = isRtl
    ? post.excerptAr || post.excerptEn
    : post.excerptEn || post.excerptAr;

  const kicker = isRtl
    ? post.category?.nameAr || post.author?.nameAr || "رأي"
    : post.category?.nameEn || post.author?.nameEn || "Perspective";

  const date = post.date;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group h-full"
    >
      <Link href={`/blog/post-${post.id}`} className="flex flex-col h-full">
        {/* Image */}
        <div
          className={`relative w-full overflow-hidden rounded-2xl bg-[#EDE6D6] dark:bg-[#1A1714] ${
            featured ? "aspect-[16/11]" : "aspect-[16/10]"
          }`}
        >
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={post.featuredImageUrl || post.image || "/news/news1.avif"}
              fill
              alt={title || "Blog cover image"}
              className="object-cover"
            />
          </motion.div>

          {/* Category chip, floating on the image */}
          <span className="absolute top-4 left-4 rtl:left-auto rtl:right-4 text-[10px] font-bold uppercase tracking-widest text-[#1C1917] bg-[#F5F1E8]/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
            {kicker}
          </span>

          {/* Arrow button, bottom-right, slides in on hover */}
          <motion.span
            initial={{ opacity: 0, x: isRtl ? -8 : 8 }}
            whileHover={{ opacity: 1 }}
            className="absolute bottom-4 right-4 rtl:right-auto rtl:left-4 w-10 h-10 rounded-full bg-[#F5F1E8] flex items-center justify-center text-[#1C1917] opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 rtl:-translate-x-2 group-hover:rtl:translate-x-0 transition-all duration-300"
          >
            <ArrowUpRight size={16} />
          </motion.span>
        </div>

        {/* Content below image, normal flow */}
        <div className={`flex-1 flex flex-col ${featured ? "pt-6" : "pt-4"}`}>
          <h3
            className={`font-serif font-bold text-[#1C1917] dark:text-[#F5F1E8] leading-snug group-hover:text-[#B88A2B] dark:group-hover:text-[#C5A059] transition-colors duration-300 ${
              featured
                ? "text-2xl sm:text-3xl line-clamp-2"
                : "text-base sm:text-lg line-clamp-2"
            }`}
          >
            {title}
          </h3>

          {featured && excerpt && (
            <p className="text-sm text-[#57534E] dark:text-[#A39B8B] mt-3 leading-relaxed line-clamp-2 max-w-lg">
              {excerpt}
            </p>
          )}

          <div className="flex items-center gap-2 mt-auto pt-4 text-xs text-[#78716C] dark:text-[#8A8175]">
            {date && <span>{date}</span>}
            {date && <span className="w-1 h-1 rounded-full bg-[#B88A2B]/50 dark:bg-[#C5A059]/50" />}
            <span className="font-semibold text-[#B88A2B] dark:text-[#C5A059] group-hover:underline underline-offset-2">
              {isRtl ? "اقرأ المزيد" : "Read more"}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function OpinionsSection({
  titleEn,
  titleAr,
  highlightEn,
  highlightAr,
  descriptionEn,
  descriptionAr,
  categorySlug,
  posts = [],
}) {
  const { isRtl } = useLanguage();

  if (!posts || posts.length === 0) return null;

  const displayPosts = posts.slice(0, 3);
  const [featuredPost, ...restPosts] = displayPosts;

  const sectionDesc = isRtl ? descriptionAr : descriptionEn;
  const rawTitle = isRtl ? titleAr : titleEn;
  const highlight = isRtl ? highlightAr : highlightEn;
  const words = (rawTitle || "").trim().split(" ");
  const highlightWord = highlight || words[words.length - 1] || "";
  const leadingWords = highlight ? rawTitle : words.slice(0, -1).join(" ");

  return (
    <section className="py-20 sm:py-28 bg-[#F7F4EE] dark:bg-[#0F0D0B] transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-5">
        {/* Common Section Header */}
        <SectionHeader
          title={leadingWords}
          highlight={highlightWord}
          description={sectionDesc}
          action={{
            href: `/blog/${categorySlug}`,
            label: isRtl ? "عرض الكل" : "View All",
          }}
          borderBottom={true}
        />

        {/* Bento grid: large featured card + two stacked compact cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer(0.12, 0.08)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12"
        >
          {featuredPost && (
            <motion.div variants={fadeUp} className="lg:col-span-2">
              <BlogCard post={featuredPost} isRtl={isRtl} featured />
            </motion.div>
          )}

          <div className="flex flex-col gap-10">
            {restPosts.map((post) => (
              <motion.div key={post.id} variants={fadeUp}>
                <BlogCard post={post} isRtl={isRtl} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}