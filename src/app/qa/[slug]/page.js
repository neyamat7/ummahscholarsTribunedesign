"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { fetchQuestionBySlug, voteQuestionHelpful, getMediaUrl } from "@/lib/api";
import { formatDynamicDate } from "@/lib/dateUtils";
import { toast } from "sonner";
import {
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  ThumbsUp,
  Share2,
  Check,
  Calendar,
  Eye,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  BookOpen,
  Loader2,
} from "lucide-react";

export default function SingleQuestionDetailPage() {
  const params = useParams();
  const slug = params?.slug;
  const { isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [question, setQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      setIsLoading(true);
      fetchQuestionBySlug(slug)
        .then((res) => {
          if (res) {
            setQuestion(res);
            setHelpfulCount(res.helpfulCount || 0);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [slug]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FBF9F6] dark:bg-[#0F0D0B] flex flex-col justify-between">
        <Navbar />
        <div className="py-40 text-center text-[#78716C]">
          <Loader2 size={36} className="animate-spin mx-auto text-[#B88A2B] mb-3" />
          <p className="text-sm font-semibold">{isRtl ? "جاري تحميل نص الفتوى..." : "Loading advisory..."}</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!question) {
    return (
      <main className="min-h-screen bg-[#FBF9F6] dark:bg-[#0F0D0B] flex flex-col justify-between">
        <Navbar />
        <div className="py-40 text-center px-4 space-y-4">
          <HelpCircle size={48} className="mx-auto text-[#B88A2B]" />
          <h1 className="text-2xl font-serif font-bold text-[#1C1917] dark:text-[#F5F1E8]">
            {isRtl ? "لم يتم العثور على الفتوى المطلوبة" : "Advisory Not Found"}
          </h1>
          <p className="text-xs text-[#78716C] max-w-sm mx-auto">
            {isRtl ? "قد تكون المسألة قيد التحكيم أو تم نقلها." : "This advisory may still be under review or has been moved."}
          </p>
          <Link
            href="/qa"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#B88A2B] text-white text-xs font-bold shadow-md"
          >
            <ArrowIcon size={14} className={isRtl ? "" : "rotate-180"} />
            <span>{isRtl ? "العودة لبنك الأسئلة" : "Back to Q&A Hub"}</span>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const title = isRtl ? question.titleAr || question.titleEn : question.titleEn || question.titleAr;
  const content = isRtl ? question.contentAr || question.contentEn : question.contentEn || question.contentAr;
  const answer = isRtl ? question.answerAr || question.answerEn : question.answerEn || question.answerAr;
  const categoryName = isRtl ? question.category?.nameAr || question.category?.nameEn : question.category?.nameEn || question.category?.nameAr;

  const scholar = question.answeredBy;
  const scholarName = isRtl ? scholar?.nameAr || scholar?.name || "هيئة الفتوى والتحكيم" : scholar?.name || "Scholarly Advisory Board";
  const scholarTitle = isRtl ? scholar?.titleAr || scholar?.title || "عضو المجلس العلمي" : scholar?.title || "UST Senior Faculty";
  const scholarAvatar = getMediaUrl(scholar?.avatarUrl, "/avatar.svg");
  const formattedDate = formatDynamicDate(question.answeredAt || question.createdAt, isRtl);

  const handleHelpfulVote = async () => {
    if (hasVoted) return;
    setHasVoted(true);
    setHelpfulCount((prev) => prev + 1);
    toast.success(isRtl ? "شكراً لتقييمك!" : "Thank you for your feedback!");
    try {
      await voteQuestionHelpful(question.id, true);
    } catch {}
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    toast.success(isRtl ? "تم نسخ رابط الفتوى" : "Link copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#FBF9F6] dark:bg-[#0F0D0B] text-[#1C1917] dark:text-[#F5F1E8] transition-colors selection:bg-[#B88A2B]/20 selection:text-[#B88A2B]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-32 pb-20 md:pt-40 md:pb-28 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#78716C] dark:text-[#A39B8B]">
          <Link href="/qa" className="hover:text-[#B88A2B] transition-colors">
            {isRtl ? "الأسئلة والأجوبة" : "Questions & Answers"}
          </Link>
          <span>/</span>
          {categoryName && (
            <>
              <span>{categoryName}</span>
              <span>/</span>
            </>
          )}
          <span className="text-[#1C1917] dark:text-[#F5F1E8] truncate max-w-[200px] sm:max-w-xs">{title}</span>
        </div>

        {/* Question Header Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#161412] border border-[#E5DCCB] dark:border-[#2E2A24] shadow-md space-y-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {categoryName && (
              <span className="px-3 py-1 rounded-full text-xs font-bold text-[#B88A2B] dark:text-[#D4AF37] bg-[#FAF0D7] dark:bg-[#262118] border border-[#C5A059]/20">
                {categoryName}
              </span>
            )}
            <div className="flex items-center gap-3 text-xs text-[#78716C] dark:text-[#A39B8B]">
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={13} />
                {question.viewCount}
              </span>
            </div>
          </div>

          <h1 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-[#1C1917] dark:text-[#FAF0D7] leading-tight">
            {title}
          </h1>

          {content && content !== title && (
            <div className="p-5 rounded-2xl bg-[#FAF0D7]/20 dark:bg-[#1E1B18] border border-[#E5DCCB]/60 dark:border-[#2E2A24] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B88A2B] dark:text-[#C5A059] block">
                {isRtl ? "نص السؤال بالتفصيل:" : "Inquirer Context & Question:"}
              </span>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#C5BEB3] leading-relaxed whitespace-pre-line font-sans">
                {content}
              </p>
            </div>
          )}
        </div>

        {/* Scholar Verified Answer Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#161412] border border-[#C5A059]/40 shadow-xl space-y-8">
          {/* Answering Scholar Banner */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF0D7]/40 dark:bg-[#1E1B18] border border-[#C5A059]/30 flex-wrap">
            <div className="flex items-center gap-3.5">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-[#C5A059]">
                <Image
                  src={scholarAvatar}
                  alt={scholarName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-bold text-sm sm:text-base text-[#1C1917] dark:text-[#F5F1E8]">
                    {scholarName}
                  </span>
                  <ShieldCheck size={16} className="text-[#B88A2B]" />
                </div>
                <span className="text-xs text-[#78716C] dark:text-[#A39B8B] block">
                  {scholarTitle}
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              <CheckCircle2 size={13} />
              <span>{isRtl ? "فتوى صادرة ومعتمدة" : "Official Scholarly Ruling"}</span>
            </span>
          </div>

          {/* Ruling & Body */}
          <div className="space-y-4 text-sm sm:text-base text-[#1C1917] dark:text-[#F5F1E8] leading-relaxed font-sans">
            {answer ? (
              answer.startsWith("<") ? (
                <div
                  className="prose dark:prose-invert max-w-none leading-relaxed text-sm sm:text-base"
                  dangerouslySetInnerHTML={{ __html: answer }}
                />
              ) : (
                <p className="whitespace-pre-line leading-relaxed">{answer}</p>
              )
            ) : (
              <p className="text-[#78716C] italic">{isRtl ? "جاري تحرير الفتوى..." : "Drafting ruling..."}</p>
            )}
          </div>

          {/* Interactive Footer: Helpful & Share */}
          <div className="pt-6 border-t border-[#E5DCCB]/60 dark:border-[#2E2A24]/60 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleHelpfulVote}
              disabled={hasVoted}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all cursor-pointer ${
                hasVoted
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-600 dark:text-emerald-400 font-bold"
                  : "bg-[#FBF9F6] dark:bg-[#1E1B18] border-[#E5DCCB] dark:border-[#2E2A24] text-[#78716C] dark:text-[#A39B8B] hover:text-[#B88A2B] hover:border-[#B88A2B]"
              }`}
            >
              <ThumbsUp size={15} />
              <span className="text-xs font-bold">{isRtl ? "هل كانت هذه الفتوى نافعة؟" : "Was this helpful?"}</span>
              <span className="font-mono text-xs font-bold">({helpfulCount})</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FBF9F6] dark:bg-[#1E1B18] border border-[#E5DCCB] dark:border-[#2E2A24] text-[#78716C] dark:text-[#A39B8B] hover:text-[#B88A2B] transition-colors cursor-pointer text-xs font-bold"
            >
              {isCopied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
              <span>{isRtl ? "مشاركة رابط الفتوى" : "Share Ruling"}</span>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
