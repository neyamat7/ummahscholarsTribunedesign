"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { voteQuestionHelpful, getMediaUrl } from "@/lib/api";
import { formatDynamicDate } from "@/lib/dateUtils";
import { toast } from "sonner";
import {
  HelpCircle,
  CheckCircle2,
  ThumbsUp,
  Share2,
  Check,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Calendar,
  Eye,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function QaAnswerCard({
  question,
  isAccordion = false,
  isExpanded = false,
  onToggleExpand = () => {},
}) {
  const { isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [hasVoted, setHasVoted] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(question.helpfulCount || 0);
  const [isCopied, setIsCopied] = useState(false);

  const title = isRtl
    ? question.titleAr || question.titleEn
    : question.titleEn || question.titleAr;

  const content = isRtl
    ? question.contentAr || question.contentEn
    : question.contentEn || question.contentAr;

  const answer = isRtl
    ? question.answerAr || question.answerEn
    : question.answerEn || question.answerAr;

  const categoryName = isRtl
    ? question.category?.nameAr || question.category?.nameEn
    : question.category?.nameEn || question.category?.nameAr;

  const scholar = question.answeredBy;
  const scholarName = isRtl
    ? scholar?.nameAr || scholar?.name || "هيئة الفتوى والتحكيم"
    : scholar?.name || "Scholarly Advisory Board";
  const scholarTitle = isRtl
    ? scholar?.titleAr || scholar?.title || "عضو المجلس العلمي"
    : scholar?.title || "UST Senior Faculty";
  const scholarAvatar = getMediaUrl(scholar?.avatarUrl, "/avatar.svg");

  const formattedDate = formatDynamicDate(
    question.answeredAt || question.createdAt,
    isRtl
  );

  const handleHelpfulVote = async (e) => {
    e.stopPropagation();
    if (hasVoted) return;

    setHasVoted(true);
    setHelpfulCount((prev) => prev + 1);
    toast.success(
      isRtl
        ? "شكراً لتقييمك، نسأل الله أن ينفع بهذه الإجابة"
        : "Thank you for your feedback!"
    );

    try {
      await voteQuestionHelpful(question.id, true);
    } catch (err) {
      console.warn("Vote recording error:", err);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/qa/${question.slug}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    toast.success(
      isRtl ? "تم نسخ رابط المسألة بنجاح" : "Question link copied to clipboard"
    );
    setTimeout(() => setIsCopied(false), 2000);
  };

  /* =========================================================================
     MODE 1: ACCORDION VIEW (Rapid Browsing & Smooth Reveal)
     ========================================================================= */
  if (isAccordion) {
    return (
      <motion.article
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-3xl bg-white dark:bg-[#161412] border border-[#E5DCCB] dark:border-[#2E2A24] shadow-sm hover:shadow-md hover:border-[#C5A059]/60 transition-all overflow-hidden"
      >
        {/* Accordion Header */}
        <button
          type="button"
          onClick={onToggleExpand}
          className="w-full p-5 sm:p-6 text-start flex items-start justify-between gap-4 cursor-pointer hover:bg-[#FAF0D7]/20 dark:hover:bg-[#1A1714] transition-colors"
        >
          <div className="flex-1 space-y-2">
            {/* Meta Row */}
            <div className="flex items-center gap-2.5 text-xs text-[#78716C] dark:text-[#A39B8B] flex-wrap">
              {categoryName && (
                <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] text-[#B88A2B] dark:text-[#D4AF37] bg-[#FAF0D7] dark:bg-[#262118] border border-[#C5A059]/20">
                  {categoryName}
                </span>
              )}
              {formattedDate && (
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {formattedDate}
                </span>
              )}
              {typeof question.viewCount === "number" && (
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  {question.viewCount}
                </span>
              )}
            </div>

            {/* Question Title */}
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#1C1917] dark:text-[#F5F1E8] leading-snug">
              {title}
            </h3>
          </div>

          {/* Expand Icon */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="w-8 h-8 rounded-2xl bg-[#FAF0D7] dark:bg-[#262118] text-[#B88A2B] dark:text-[#D4AF37] flex items-center justify-center shrink-0 mt-1 shadow-xs"
          >
            <ChevronDown size={16} />
          </motion.div>
        </button>

        {/* Expandable Answer Body */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-[#E5DCCB]/60 dark:border-[#2E2A24]/60"
            >
              <div className="p-5 sm:p-7 space-y-5 bg-[#FAF0D7]/15 dark:bg-[#13110F]">
                {/* Full Question Text (if detailed) */}
                {content && content !== title && (
                  <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1714] border border-[#E5DCCB]/60 dark:border-[#2E2A24] space-y-1">
                    <span className="text-[11px] font-bold text-[#B88A2B] uppercase tracking-wider block">
                      {isRtl ? "تفصيل السؤال والاستفسار:" : "Question Detail:"}
                    </span>
                    <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#C5BEB3] leading-relaxed">
                      {content}
                    </p>
                  </div>
                )}

                {/* Verified Scholar Badge */}
                <div className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-white dark:bg-[#1A1714] border border-[#C5A059]/30">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#C5A059]">
                      <Image
                        src={scholarAvatar}
                        alt={scholarName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif font-bold text-xs sm:text-sm text-[#1C1917] dark:text-[#F5F1E8]">
                          {scholarName}
                        </span>
                        <ShieldCheck size={14} className="text-[#B88A2B]" />
                      </div>
                      <span className="text-[11px] text-[#78716C] dark:text-[#A39B8B] block">
                        {scholarTitle}
                      </span>
                    </div>
                  </div>

                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                    <CheckCircle2 size={12} />
                    {isRtl ? "فتوى / إجابة معتمدة" : "Verified Advisory"}
                  </span>
                </div>

                {/* Answer Content */}
                <div className="space-y-3 text-xs sm:text-sm text-[#1C1917] dark:text-[#F5F1E8] leading-relaxed font-sans">
                  {answer ? (
                    answer.startsWith("<") ? (
                      <div
                        className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: answer }}
                      />
                    ) : (
                      <p className="whitespace-pre-line">{answer}</p>
                    )
                  ) : (
                    <p className="text-[#78716C] italic">
                      {isRtl ? "جاري تحرير الفتوى..." : "Drafting scholarly response..."}
                    </p>
                  )}
                </div>

                {/* Footer Controls: Helpful Voting + Share */}
                <div className="pt-3 border-t border-[#E5DCCB]/60 dark:border-[#2E2A24]/60 flex items-center justify-between gap-3 text-xs">
                  {/* Helpful Button */}
                  <button
                    type="button"
                    onClick={handleHelpfulVote}
                    disabled={hasVoted}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      hasVoted
                        ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-600 dark:text-emerald-400 font-bold"
                        : "bg-white dark:bg-[#1A1714] border-[#E5DCCB] dark:border-[#2E2A24] text-[#78716C] dark:text-[#A39B8B] hover:text-[#B88A2B] hover:border-[#B88A2B]"
                    }`}
                  >
                    <ThumbsUp size={13} />
                    <span>{isRtl ? "إجابة نافعة" : "Helpful"}</span>
                    <span className="font-mono text-[11px] font-bold">({helpfulCount})</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleShare}
                      className="p-2 rounded-xl bg-white dark:bg-[#1A1714] border border-[#E5DCCB] dark:border-[#2E2A24] hover:bg-[#FAF0D7] text-[#78716C] dark:text-[#A39B8B] transition-colors cursor-pointer"
                      title={isRtl ? "مشاركة" : "Share"}
                      aria-label="Share question"
                    >
                      {isCopied ? <Check size={13} className="text-emerald-500" /> : <Share2 size={13} />}
                    </button>

                    <Link
                      href={`/qa/${question.slug}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#B88A2B] hover:bg-[#9E7422] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                    >
                      <span>{isRtl ? "صفحة الفتوى" : "Permalink"}</span>
                      <ArrowIcon size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>
    );
  }

  /* =========================================================================
     MODE 2: GRID CARD VIEW (Rich Magazine Bento Card)
     ========================================================================= */
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-[#161412] border border-[#E5DCCB] dark:border-[#2E2A24] shadow-md hover:shadow-xl hover:border-[#C5A059]/60 transition-all duration-300"
    >
      <div className="space-y-4">
        {/* Top Tag & Date Row */}
        <div className="flex items-center justify-between gap-2">
          {categoryName && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FAF0D7] dark:bg-[#262118] text-[#B88A2B] dark:text-[#D4AF37] border border-[#C5A059]/20">
              {categoryName}
            </span>
          )}
          <span className="text-[11px] text-[#78716C] dark:text-[#A39B8B]">
            {formattedDate}
          </span>
        </div>

        {/* Title */}
        <Link href={`/qa/${question.slug}`} className="block">
          <h3 className="font-serif font-bold text-lg text-[#1C1917] dark:text-[#F5F1E8] group-hover:text-[#B88A2B] dark:group-hover:text-[#D4AF37] transition-colors leading-snug line-clamp-2">
            {title}
          </h3>
        </Link>

        {/* Answer Excerpt */}
        <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#C5BEB3] leading-relaxed line-clamp-3 font-sans">
          {answer ? answer.replace(/<[^>]+>/g, "") : content}
        </p>

        {/* Scholar Attribution */}
        <div className="flex items-center gap-2.5 pt-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#C5A059]">
            <Image
              src={scholarAvatar}
              alt={scholarName}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <span className="font-serif font-bold text-xs text-[#1C1917] dark:text-[#F5F1E8] block truncate">
              {scholarName}
            </span>
            <span className="text-[10px] text-[#78716C] dark:text-[#A39B8B] block truncate">
              {scholarTitle}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="mt-5 pt-3 border-t border-[#E5DCCB]/60 dark:border-[#2E2A24]/60 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleHelpfulVote}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#78716C] dark:text-[#A39B8B] hover:text-[#B88A2B] transition-colors cursor-pointer"
        >
          <ThumbsUp size={12} className={hasVoted ? "text-emerald-500 fill-emerald-500" : ""} />
          <span>({helpfulCount})</span>
        </button>

        <Link
          href={`/qa/${question.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B88A2B] dark:text-[#D4AF37] group-hover:underline cursor-pointer"
        >
          <span>{isRtl ? "قراءة الفتوى كاملة" : "Read Full Ruling"}</span>
          <ArrowIcon size={12} />
        </Link>
      </div>
    </motion.article>
  );
}
