"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Home, ArrowLeft, ArrowRight, Compass } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function PostNotFound() {
  const { isRtl } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F6] dark:bg-[#0F0D0B]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-[#B88A2B]/15 dark:bg-[#C5A059]/20 text-[#B88A2B] dark:text-[#C5A059] flex items-center justify-center mb-6 shadow-xs">
          <BookOpen size={36} />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-[#B88A2B] dark:text-[#C5A059] mb-2">
          {isRtl ? "لم يتم العثور على المقال" : "Article Not Found"}
        </span>

        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#1C1917] dark:text-[#F5F1E8] mb-4">
          {isRtl
            ? "عذراً، البحث أو المقال المطلوب غير متوفر"
            : "The Requested Inquiry Could Not Be Found"}
        </h1>

        <p className="text-sm text-[#78716C] dark:text-[#A39B8B] max-w-lg mb-8 leading-relaxed font-sans">
          {isRtl
            ? "ربما تم نقل هذا البحث أو تعديل رابطه، أو قد يكون قيد المراجعة والتدقيق العلمي من قبل هيئة التحرير."
            : "The article you are looking for may have been moved, updated, or is currently undergoing editorial review."}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#B88A2B] to-[#C5A059] text-white text-sm font-bold shadow-md hover:brightness-105 transition-all"
          >
            <Home size={16} />
            <span>{isRtl ? "العودة للرئيسية" : "Return to Homepage"}</span>
          </Link>

          <Link
            href="/research"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FAF0D7] dark:bg-[#1A1714] border border-[#E5DCCB] dark:border-[#2E2A24] text-[#1C1917] dark:text-[#F5F1E8] text-sm font-bold hover:border-[#B88A2B]/50 transition-all"
          >
            <Compass size={16} />
            <span>{isRtl ? "تصفح قسم البحوث" : "Explore Research Archive"}</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
