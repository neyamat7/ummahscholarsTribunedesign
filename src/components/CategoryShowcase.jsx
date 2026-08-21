"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { BookOpen, ArrowUpRight, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// This category's assigned jewel tone (per the site-wide category color
// mapping: Research & Studies = jewel-blue). Change this single value if
// this component is reused for a different category.
const CATEGORY_COLOR = "#1E3A8A";
const CATEGORY_COLOR_DARK = "#3B5FCC"; // slightly lightened for dark-mode contrast

// Final resting positions for each of the 4 images, as percentages of the
// showcase container's width/height. Kept clear of top navbar height (~80px).
const POSITIONS = [
  { left: "2%", top: "14%", rotate: -4 }, // top-left (safely below navbar)
  { right: "2%", top: "12%", rotate: 3 }, // top-right (safely below navbar)
  { left: "4%", bottom: "4%", rotate: 3 }, // bottom-left
  { right: "1%", bottom: "5%", rotate: -3 }, // bottom-right
];

// Mirrored positions for RTL — left/right swap so the composition reads
// correctly for Arabic. NOTE: these are applied manually via inline
// left/right/top/bottom styles, independent of the ambient `dir` attribute
// — see the `dir="ltr"` fix below for why that separation matters.
const POSITIONS_RTL = [
  { right: "2%", top: "14%", rotate: 4 },
  { left: "2%", top: "12%", rotate: -3 },
  { right: "4%", bottom: "4%", rotate: -3 },
  { left: "1%", bottom: "5%", rotate: 3 },
];

function useIsDesktop(breakpoint = 1024) {
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpoint}px)`);
    setIsDesktop(mq.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);
  return isDesktop;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function ShowcaseImage({ post, index, scrollYProgress, isRtl, title }) {
  // IMPORTANT: positions are still selected from POSITIONS_RTL when isRtl
  // is true — mirroring is preserved. The fix below only concerns the
  // ancestor `dir` attribute breaking CSS `position: sticky`, not this
  // manual position-swap logic, which stays exactly as before.
  const positions = isRtl ? POSITIONS_RTL : POSITIONS;
  const pos = positions[index];

  const startDelay = index * 0.02;

  const left =
    "left" in pos
      ? useTransform(scrollYProgress, [0.1 + startDelay, 0.75 + startDelay], ["38%", pos.left])
      : undefined;
  const right =
    "right" in pos
      ? useTransform(scrollYProgress, [0.1 + startDelay, 0.75 + startDelay], ["38%", pos.right])
      : undefined;
  const top =
    "top" in pos
      ? useTransform(scrollYProgress, [0.1 + startDelay, 0.75 + startDelay], ["36%", pos.top])
      : undefined;
  const bottom =
    "bottom" in pos
      ? useTransform(scrollYProgress, [0.1 + startDelay, 0.75 + startDelay], ["36%", pos.bottom])
      : undefined;

  const scale = useTransform(scrollYProgress, [0.1, 0.75 + startDelay], [0.88, 1]);
  const rotate = useTransform(scrollYProgress, [0.1, 0.75 + startDelay], [0, pos.rotate]);
  const opacity = useTransform(scrollYProgress, [0.05, 0.25], [0.3, 1]);

  const badgeOpacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1]);
  const badgeY = useTransform(scrollYProgress, [0.55, 0.75], [10, 0]);

  const slug = post.slug || post.id;
  const pageCategorySlug = post.pageCategory?.slug || post.category?.slug || "research-studies";

  return (
    <motion.div
      style={{ left, right, top, bottom, scale, rotate, opacity, zIndex: 10 + index }}
      className="absolute w-[46%] sm:w-[38%] lg:w-[26%] max-w-[300px]"
    >
      <Link
        href={`/${pageCategorySlug}/${slug}`}
        className="group block relative rounded-2xl overflow-hidden shadow-lg shadow-black/10 border border-white/40 dark:border-white/10 transition-transform duration-300 hover:scale-[1.03]"
      >
        <div className="relative w-full aspect-[4/3] bg-neutral-200 dark:bg-neutral-800">
          <Image
            src={post.featuredImage?.url || post.image || post.featuredImageUrl || "/news/news1.avif"}
            alt={title}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 768px) 46vw, (max-width: 1024px) 38vw, 300px"
          />
        </div>

        {/* Floating info badge — dir set explicitly since this now sits
            inside an ancestor forced to dir="ltr" (see PinnedShowcase) */}
        <motion.div
          style={{ opacity: badgeOpacity, y: badgeY }}
          dir={isRtl ? "rtl" : "ltr"}
          className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 rounded-xl bg-white/90 dark:bg-[#1A1714]/90 backdrop-blur-md px-3.5 py-2.5 shadow-md"
        >
          <span className="text-xs sm:text-sm font-serif font-bold text-[#1A1714] dark:text-[#F5F1E8] line-clamp-1">
            {title}
          </span>
          <span
            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-45"
            style={{ backgroundColor: `${CATEGORY_COLOR}1A`, color: CATEGORY_COLOR }}
          >
            <ArrowUpRight size={13} strokeWidth={2.5} />
          </span>
        </motion.div>
      </Link>
    </motion.div>
  );
}

function PinnedShowcase({ titleEn, titleAr, descriptionEn, descriptionAr, categorySlug, posts }) {
  const { isRtl } = useLanguage();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const title = isRtl ? titleAr : titleEn;
  const description = isRtl ? descriptionAr : descriptionEn;

  const rawTitle = title || "";
  const words = rawTitle.trim().split(" ");
  const highlightWord = words[words.length - 1] || "";
  const leadingWords = words.slice(0, -1).join(" ");

  const textOpacity = useTransform(scrollYProgress, [0.35, 0.65], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.35, 0.65], [24, 0]);

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const targetUrl =
    categorySlug === "research-studies" || categorySlug === "research"
      ? "/research"
      : categorySlug === "opinions-perspectives" || categorySlug === "opinions"
      ? "/opinions"
      : categorySlug === "events-initiatives" || categorySlug === "events"
      ? "/events"
      : categorySlug === "news-announcements" || categorySlug === "news"
      ? "/news"
      : `/categories/${categorySlug}`;

  return (
    // FIX: dir="ltr" forced here and on the sticky child below. This is
    // the actual fix for the RTL bug — `position: sticky` breaks/silently
    // fails inside ancestors with `direction: rtl` in Chromium and
    // Firefox, which is exactly why the section rendered as duplicated,
    // non-pinned content only when the language was switched to Arabic.
    // The manual POSITIONS_RTL mirroring above is unaffected by this and
    // continues to produce the correct visually-mirrored layout.
    <div ref={containerRef} dir="ltr" className="relative h-[130vh]">
      <div dir="ltr" className="sticky top-0 h-screen w-full overflow-hidden bg-[#F7F4EE] dark:bg-[#0F0D0B] flex items-center justify-center">
        <div className="relative w-full h-full max-w-7xl mx-auto px-5">
          {posts.slice(0, 4).map((post, i) => {
            const postTitle = isRtl
              ? post.titleAr || post.titleEn || post.title
              : post.titleEn || post.titleAr || post.title;
            return (
              <ShowcaseImage
                key={post.id}
                post={post}
                index={i}
                scrollYProgress={scrollYProgress}
                isRtl={isRtl}
                title={postTitle}
              />
            );
          })}

          {/* Center text block — dir set explicitly here too, since its
              ancestor chain is now forced to dir="ltr" for the sticky
              fix above; without this, Arabic text would lose its correct
              right-to-left alignment even though the characters
              themselves would still render via Unicode bidi. */}
          <motion.div
            style={{ opacity: textOpacity, y: textY }}
            dir={isRtl ? "rtl" : "ltr"}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20 pointer-events-none"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#1C1917] dark:text-[#F5F1E8] mb-4 max-w-2xl tracking-tight leading-[1.2]">
              {leadingWords}{" "}
              <span className="italic text-[#B88A2B] dark:text-[#C5A059]">
                {highlightWord}
              </span>
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-[#57534E] dark:text-[#A39B8B] max-w-lg mb-7 leading-relaxed font-sans">
              {description}
            </p>

            <Link
              href={targetUrl}
              className="pointer-events-auto inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm text-white shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.03]"
              style={{ backgroundColor: CATEGORY_COLOR }}
            >
              {isRtl ? `عرض الكل (${title})` : `View All (${title})`}
              <ArrowIcon size={15} />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Simple, non-pinned fallback for mobile/tablet and reduced-motion users —
// a static 2x2 grid with a standard one-time fade-up entrance instead of
// scroll-scrubbing, which doesn't translate well to touch scrolling.
// (Unaffected by the sticky/RTL bug since it uses no sticky positioning.)
function StaticShowcase({ titleEn, titleAr, descriptionEn, descriptionAr, categorySlug, posts }) {
  const { isRtl } = useLanguage();
  const title = isRtl ? titleAr : titleEn;
  const description = isRtl ? descriptionAr : descriptionEn;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const rawTitle = title || "";
  const words = rawTitle.trim().split(" ");
  const highlightWord = words[words.length - 1] || "";
  const leadingWords = words.slice(0, -1).join(" ");

  const targetUrl =
    categorySlug === "research-studies" || categorySlug === "research"
      ? "/research"
      : categorySlug === "opinions-perspectives" || categorySlug === "opinions"
      ? "/opinions"
      : categorySlug === "events-initiatives" || categorySlug === "events"
      ? "/events"
      : categorySlug === "news-announcements" || categorySlug === "news"
      ? "/news"
      : `/categories/${categorySlug}`;

  return (
    <section className="py-16 bg-[#F7F4EE] dark:bg-[#0F0D0B] px-5">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#1C1917] dark:text-[#F5F1E8] mb-3 tracking-tight leading-[1.2]">
          {leadingWords}{" "}
          <span className="italic text-[#B88A2B] dark:text-[#C5A059]">
            {highlightWord}
          </span>
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-[#57534E] dark:text-[#A39B8B] leading-relaxed mb-6 font-sans">{description}</p>
        <Link
          href={targetUrl}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm text-white shadow-md"
          style={{ backgroundColor: CATEGORY_COLOR }}
        >
          {isRtl ? `عرض الكل (${title})` : `View All (${title})`}
          <ArrowIcon size={15} />
        </Link>
      </div>

      <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4">
        {posts.slice(0, 4).map((post) => {
          const postTitle = isRtl
            ? post.titleAr || post.titleEn || post.title
            : post.titleEn || post.titleAr || post.title;
            const mobilePageCat = post.pageCategory?.slug || post.category?.slug || "research-studies";
            return (
              <Link
                key={post.id}
                href={`/${mobilePageCat}/${post.slug || post.id}`}
                className="group relative rounded-2xl overflow-hidden shadow-md border border-black/5 dark:border-white/10"
              >
              <div className="relative w-full aspect-[4/3] bg-neutral-200 dark:bg-neutral-800">
                <Image
                  src={post.featuredImage?.url || post.image || post.featuredImageUrl || "/news/news1.avif"}
                  alt={postTitle}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="45vw"
                />
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2 rounded-lg bg-white/90 dark:bg-[#1A1714]/90 backdrop-blur-md px-2.5 py-2">
                <span className="text-xs font-serif font-bold text-[#1A1714] dark:text-[#F5F1E8] line-clamp-1">
                  {postTitle}
                </span>
                <ArrowUpRight size={13} style={{ color: CATEGORY_COLOR }} className="flex-shrink-0" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function CategoryShowcase(props) {
  const isDesktop = useIsDesktop(1024);
  const reducedMotion = usePrefersReducedMotion();
  const { isRtl } = useLanguage();

  if (!props.posts || props.posts.length === 0) return null;

  if (!isDesktop || reducedMotion) {
    return <StaticShowcase {...props} />;
  }

  // FIX: key forces a full remount on language change, discarding any
  // stale scroll ref / motion-value state from before the switch, rather
  // than trying to reconcile a sticky-positioned, scroll-linked component
  // across a direction change in place. This is a defensive second layer
  // on top of the dir="ltr" fix above — together they resolve both the
  // root cause (sticky breaking under rtl) and any leftover stale state
  // from before the fix was in place.
  return <PinnedShowcase key={isRtl ? "ar" : "en"} {...props} />;
}