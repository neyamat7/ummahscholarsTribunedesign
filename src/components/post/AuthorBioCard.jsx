"use client";

import React from "react";
import Image from "next/image";
import { User, Award, Mail, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getMediaUrl } from "@/lib/api";

export default function AuthorBioCard({ author, onAuthorClick }) {
  const { isRtl } = useLanguage();

  const authorName = isRtl
    ? author?.nameAr || author?.name || "د. زبير سلطان رباني"
    : author?.name || author?.nameAr || "Dr. Zobair Sultan Rabbani";

  const rawAuthorAvatar =
    author?.avatarUrl ||
    author?.avatar ||
    author?.image ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(author?.id || authorName)}`;
  const authorAvatar = getMediaUrl(rawAuthorAvatar, rawAuthorAvatar);

  const authorTitle = isRtl
    ? author?.titleAr || author?.title || "كاتب المقال والباحث الرئيسي"
    : author?.title || author?.titleAr || "Author & Senior Fellow";

  const bio = isRtl
    ? author?.bioAr || author?.bio || "باحث ومفكر متخصص في الفلسفة القانونية الإسلامية ونظم الحكم الراشد الأخلاقي، صاحب عدة دراسات وأبحاث تأصيلية في فقه المعاملات والمقاصد الدستورية وتطبيقاتها المعاصرة."
    : author?.bio || author?.bioAr || "Distinguished scholar and senior researcher in Islamic legal philosophy and contemporary ethical governance, author of multiple critical treatises on classical jurisprudence.";

  return (
    <section className="my-10 p-6 sm:p-8 rounded-3xl bg-[#FAF0D7]/50 dark:bg-[#1A1714] border border-[#E5DCCB] dark:border-[#2E2A24] shadow-xs">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-start">
        {/* Avatar */}
        <button
          type="button"
          onClick={onAuthorClick}
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-[#B88A2B]/40 dark:border-[#C5A059]/40 bg-[#FAF0D7] dark:bg-[#262118] shrink-0 shadow-sm cursor-pointer hover:scale-105 transition-transform"
          title={isRtl ? "عرض الملف التعريفي للباحث" : "View scholar biography"}
        >
          <Image
            src={authorAvatar}
            alt={authorName}
            fill
            className="object-cover"
            sizes="96px"
          />
        </button>

        {/* Info */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2 mb-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#B88A2B] dark:text-[#C5A059] block">
                {authorTitle}
              </span>
              <button
                type="button"
                onClick={onAuthorClick}
                className="font-serif font-bold text-xl text-[#1C1917] dark:text-[#F5F1E8] hover:text-[#B88A2B] dark:hover:text-[#C5A059] transition-colors cursor-pointer text-start"
              >
                {authorName}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {author?.email && (
                <a
                  href={`mailto:${author.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-[#78716C] dark:text-[#A39B8B] bg-black/5 dark:bg-white/5 hover:text-[#B88A2B] dark:hover:text-[#C5A059] transition-colors"
                >
                  <Mail size={12} />
                  <span>{author.email}</span>
                </a>
              )}
              {onAuthorClick && (
                <button
                  type="button"
                  onClick={onAuthorClick}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-[#B88A2B] dark:text-[#C5A059] bg-[#FAF0D7] dark:bg-[#262118] border border-[#E5DCCB] dark:border-[#2E2A24] hover:scale-105 transition-all cursor-pointer"
                >
                  <ExternalLink size={11} />
                  <span>{isRtl ? "السيرة العلمية" : "Profile Details"}</span>
                </button>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A39B8B] leading-relaxed font-sans mt-2">
            {bio}
          </p>
        </div>
      </div>
    </section>
  );
}
