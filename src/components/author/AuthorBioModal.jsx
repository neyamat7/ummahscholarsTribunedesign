"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Award, BookOpen, GraduationCap, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AuthorBioModal({ isOpen, onClose, author }) {
  const { isRtl } = useLanguage();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const authorName =
    author?.name || (isRtl ? "د. زبير سلطان رباني" : "Dr. Zobair Sultan Rabbani");
  const avatarUrl =
    author?.avatarUrl ||
    author?.avatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`;
  const authorEmail = author?.email || "admin@ummahscholar.com";

  const authorTitle = isRtl
    ? "أستاذ الفقه المقارن ومقاصد الشريعة الإسلامية"
    : "Professor of Comparative Jurisprudence & Maqasid al-Shariah";

  const authorBio = isRtl
    ? "باحث ومفكر متخصص في الفلسفة القانونية الإسلامية ونظم الحكم الراشد الأخلاقي، صاحب عدة دراسات وأبحاث تأصيلية في فقه المعاملات والمقاصد الدستورية وتطبيقاتها المعاصرة."
    : "Distinguished scholar and senior researcher in Islamic legal philosophy and contemporary ethical governance. Author of multiple critical treatises on classical jurisprudence, institutional constitutionalism, and contemporary civic ethics.";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-[#1A1714] border border-[#E5DCCB] dark:border-[#2E2A24] p-6 sm:p-8 shadow-2xl z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 rtl:right-auto rtl:left-5 w-8 h-8 rounded-full bg-[#FAF0D7]/60 dark:bg-[#262118] border border-[#E5DCCB] dark:border-[#2E2A24] flex items-center justify-center text-[#78716C] dark:text-[#A39B8B] hover:text-[#1C1917] dark:hover:text-[#F5F1E8] hover:scale-105 transition-all cursor-pointer"
            aria-label="Close author bio"
          >
            <X size={16} />
          </button>

          {/* Header row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-start">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#B88A2B]/40 dark:border-[#C5A059]/40 bg-[#FAF0D7] dark:bg-[#262118] shrink-0 shadow-sm">
              <Image
                src={avatarUrl}
                alt={authorName}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>

            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF0D7] dark:bg-[#262118] border border-[#E5DCCB] dark:border-[#2E2A24] text-[10px] font-bold uppercase tracking-wider text-[#B88A2B] dark:text-[#C5A059] mb-1.5">
                <GraduationCap size={12} />
                <span>{isRtl ? "الهيئة العلمية" : "Scholarly Faculty"}</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-[#1C1917] dark:text-[#F5F1E8]">
                {authorName}
              </h3>
              <p className="text-xs font-medium text-[#78716C] dark:text-[#A39B8B] mt-0.5">
                {authorTitle}
              </p>
            </div>
          </div>

          {/* Bio text */}
          <div className="mt-6 pt-5 border-t border-[#E5DCCB]/80 dark:border-[#2E2A24]/80">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#B88A2B] dark:text-[#C5A059] mb-2 flex items-center gap-1.5">
              <BookOpen size={13} />
              <span>{isRtl ? "نبذة عن الباحث" : "Biographical Overview"}</span>
            </h4>
            <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#D6CEBF] leading-relaxed font-sans">
              {authorBio}
            </p>
          </div>

          {/* Academic credentials strip */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#FAF0D7]/40 dark:bg-[#262118]/60 border border-[#E5DCCB]/60 dark:border-[#2E2A24]/60">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1C1917] dark:text-[#F5F1E8]">
                <Award size={13} className="text-[#B88A2B] dark:text-[#C5A059]" />
                <span>{isRtl ? "التخصص الدقيق" : "Specialization"}</span>
              </div>
              <p className="text-[10px] text-[#78716C] dark:text-[#A39B8B] mt-0.5">
                {isRtl ? "أصول الفقه والمقاصد" : "Jurisprudence & Ethics"}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF0D7]/40 dark:bg-[#262118]/60 border border-[#E5DCCB]/60 dark:border-[#2E2A24]/60">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1C1917] dark:text-[#F5F1E8]">
                <Globe size={13} className="text-[#B88A2B] dark:text-[#C5A059]" />
                <span>{isRtl ? "الموقع الأكاديمي" : "Affiliation"}</span>
              </div>
              <p className="text-[10px] text-[#78716C] dark:text-[#A39B8B] mt-0.5">
                {isRtl ? "منبر علماء الأمة" : "Ummah Scholars Tribune"}
              </p>
            </div>
          </div>

          {/* Contact action */}
          <div className="mt-6 pt-4 border-t border-[#E5DCCB]/80 dark:border-[#2E2A24]/80 flex items-center justify-between">
            <a
              href={`mailto:${authorEmail}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF0D7] dark:bg-[#262118] border border-[#E5DCCB] dark:border-[#2E2A24] text-xs font-semibold text-[#1C1917] dark:text-[#F5F1E8] hover:border-[#B88A2B] dark:hover:border-[#C5A059] transition-all"
            >
              <Mail size={13} className="text-[#B88A2B] dark:text-[#C5A059]" />
              <span>{authorEmail}</span>
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#B88A2B] hover:bg-[#A37F3D] text-white text-xs font-bold transition-all cursor-pointer"
            >
              {isRtl ? "إغلاق" : "Close"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
