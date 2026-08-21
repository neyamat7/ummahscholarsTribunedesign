"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Eye,
  Share2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Flame,
  Check,
  Award,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getMediaUrl } from "@/lib/api";
import { toast } from "sonner";

export default function NewsHeroSpotlight({ post }) {
  const { isRtl } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!post) return null;

  const title = isRtl
    ? post.titleAr || post.titleEn || "بيان صحفي وإعلان رسمي"
    : post.titleEn || post.titleAr || "Official Press Release & Dispatch";

  const excerpt = isRtl
    ? post.excerptAr || post.excerptEn || ""
    : post.excerptEn || post.excerptAr || "";

  const categoryName = post.category
    ? isRtl
      ? post.category.nameAr || post.category.nameEn || "إعلان"
      : post.category.nameEn || post.category.nameAr || "Announcement"
    : isRtl
    ? "بيان عاجل"
    : "Press Release";

  const rawImage =
    (post.featuredImage && typeof post.featuredImage === "object"
      ? post.featuredImage.url || post.featuredImage.thumbnailUrl
      : typeof post.featuredImage === "string"
      ? post.featuredImage
      : null) ||
    post.featuredImageUrl ||
    post.image ||
    "/news/news1.avif";

  const imageUrl = getMediaUrl(rawImage, "/news/news1.avif");

  const formattedDate = post.publishedAt || post.createdAt
    ? new Date(post.publishedAt || post.createdAt).toLocaleDateString(
        isRtl ? "ar-SA" : "en-US",
        { month: "short", day: "numeric", year: "numeric" }
      )
    : "";

  const readTime = Math.max(3, Math.ceil((post.contentEn?.length || post.contentAr?.length || 1500) / 750));
  const postUrl = `/${post.pageCategory?.slug || "news-announcements"}/${post.slug || post.id}`;

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined") {
      const fullUrl = `${window.location.origin}${postUrl}`;
      try {
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        toast.success(isRtl ? "تم نسخ رابط الإعلان إلى الحافظة" : "Dispatch link copied to clipboard");
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        toast.error(isRtl ? "تعذر نسخ الرابط" : "Failed to copy link");
      }
    }
  };

  return (
    <section className="relative overflow-hidden bg-radial from-[#F4EFE6] via-[#FBF9F6] to-[#F5EFEB] dark:from-[#181512] dark:via-[#0F0D0B] dark:to-[#141210] border-b border-[#E5DCCB] dark:border-[#2E2A24] pt-8 pb-14 sm:pb-20">
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C5A059]/10 dark:bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between gap-4 mb-6 flex-wrap"
        >
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 dark:border-amber-400/20 text-[#B88A2B] dark:text-[#E6C678] text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <Sparkles size={13} className="text-amber-500" />
            <span>{isRtl ? "البيان البارز والتغطية الخاصة" : "Featured Editorial Spotlight"}</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-[#78716C] dark:text-[#A39B8B]">
            <Calendar size={13} />
            <span>{formattedDate}</span>
          </div>
        </motion.div>

        {/* Featured Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 35, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="group relative rounded-3xl overflow-hidden border border-[#E5DCCB] dark:border-[#2E2A24] bg-white dark:bg-[#161412] shadow-xl hover:shadow-2xl transition-all duration-500"
        >
          <div className="grid lg:grid-cols-12 items-stretch min-h-[460px] lg:min-h-[500px]">
            {/* Visual Hero Image Column */}
            <div className="relative lg:col-span-7 min-h-[300px] lg:min-h-full overflow-hidden bg-neutral-900">
              <Image
                src={imageUrl}
                alt={title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/20 lg:to-black/60 rtl:lg:bg-gradient-to-l" />

              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex items-center gap-2 z-10">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#B88A2B] text-white shadow-md flex items-center gap-1.5">
                  <Flame size={12} className="text-white animate-bounce" />
                  <span>{categoryName}</span>
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white/90 border border-white/10">
                  {readTime} {isRtl ? "دقائق قراءة" : "min read"}
                </span>
              </div>
            </div>

            {/* Content & Metadata Column */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white dark:bg-[#161412] relative z-10">
              <div className="space-y-4">
                {/* Topic & View Count */}
                <div className="flex items-center justify-between gap-3 text-xs text-[#78716C] dark:text-[#A39B8B] font-medium border-b border-[#E5DCCB]/60 dark:border-[#2E2A24]/60 pb-3">
                  <span className="font-mono uppercase tracking-wider text-[#B88A2B] dark:text-[#D4AF37] font-bold">
                    {isRtl ? "بيان رسمي معتمد" : "Official Tribune Dispatch"}
                  </span>
                  <div className="flex items-center gap-1">
                    <Eye size={13} />
                    <span>{post.viewCount || 1} {isRtl ? "مشاهدة" : "views"}</span>
                  </div>
                </div>

                {/* Headline */}
                <Link href={postUrl} className="block group/link">
                  <h1 className="font-serif font-black text-2xl sm:text-3xl lg:text-[32px] leading-tight text-[#1C1917] dark:text-[#F5F1E8] group-hover/link:text-[#B88A2B] dark:group-hover/link:text-[#D4AF37] transition-colors duration-200">
                    {title}
                  </h1>
                </Link>

                {/* Excerpt */}
                {excerpt && (
                  <p className="text-sm sm:text-base text-[#57534E] dark:text-[#C5BEB3] line-clamp-3 sm:line-clamp-4 leading-relaxed font-sans">
                    {excerpt}
                  </p>
                )}
              </div>

              {/* Action Buttons & Author Bar */}
              <div className="pt-6 mt-6 border-t border-[#E5DCCB] dark:border-[#2E2A24] flex items-center justify-between gap-4 flex-wrap">
                {/* Author Avatar Pill */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FAF0D7] dark:bg-[#262118] border border-[#C5A059]/30 flex items-center justify-center text-[#B88A2B] dark:text-[#D4AF37] font-bold text-sm shrink-0 shadow-xs">
                    <Award size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1C1917] dark:text-[#F5F1E8] leading-tight">
                      {isRtl ? "هيئة تحرير المنبر" : "Tribune Editorial Board"}
                    </p>
                    <p className="text-[11px] text-[#78716C] dark:text-[#A39B8B] mt-0.5">
                      {isRtl ? "مكتب التوثيق والنشر" : "Press & Publications Desk"}
                    </p>
                  </div>
                </div>

                {/* Interactive CTAs */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Share Dispatch"
                    className="p-2.5 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-[#FBF9F6] dark:bg-[#1E1B18] hover:bg-[#FAF0D7] dark:hover:bg-[#2A241B] text-[#57534E] dark:text-[#C5BEB3] hover:text-[#B88A2B] dark:hover:text-[#D4AF37] transition-all cursor-pointer shadow-2xs"
                    title={isRtl ? "مشاركة الإعلان" : "Share announcement"}
                  >
                    {copied ? <Check size={16} className="text-emerald-600" /> : <Share2 size={16} />}
                  </button>

                  <Link
                    href={postUrl}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B88A2B] hover:bg-[#9B7220] dark:bg-[#C5A059] dark:hover:bg-[#B88A2B] text-white dark:text-neutral-950 font-bold text-xs shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>{isRtl ? "اقرأ التغطية كاملة" : "Read Full Dispatch"}</span>
                    {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
