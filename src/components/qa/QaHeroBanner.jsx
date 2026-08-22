"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  Search,
  HelpCircle,
  Sparkles,
  Send,
  UserCheck,
  BookOpen,
  MessageSquareQuote,
  Flame,
  CheckCircle2,
} from "lucide-react";

export default function QaHeroBanner({
  searchQuery = "",
  onSearchChange = () => {},
  onAskClick = () => {},
  onMyQuestionsClick = () => {},
  totalAnswered = 0,
}) {
  const { isRtl } = useLanguage();
  const { isAuthenticated } = useAuth();

  const titlePrefix = isRtl ? "الأسئلة " : "Questions & ";
  const titleHighlight = isRtl ? "والأجوبة" : "Answers";
  
  const description = isRtl
    ? "إجاباتٌ وفتاوى يقدمها العلماء والمتخصصون عن الأسئلة والقضايا الشرعية والفكرية والاجتماعية والإنسانية والمعاصرة."
    : "Answers and fatwas provided by qualified scholars and specialists on Islamic, intellectual, social, humanitarian, and contemporary questions and issues.";

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-5 sm:px-8 overflow-hidden bg-gradient-to-b from-[#1C1917] via-[#221D18] to-[#161412] text-white">
      {/* Background Graphic & Atmosphere */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/home.jpeg"
          alt="Questions & Answers Banner"
          fill
          priority
          className="object-cover object-center opacity-20 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#161412] via-[#161412]/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#B88A2B]/20 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Top Header Pill */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#FAF0D7]/10 backdrop-blur-md border border-[#C5A059]/30 text-[#C5A059] shadow-lg mb-6"
        >
          <Sparkles size={14} className="animate-spin" style={{ animationDuration: "10s" }} />
          <span>{isRtl ? "بنك الفتاوى والاستشارات العلمية" : "Scholarly Advisory & Inquiries"}</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-[#FAF0D7] mb-5 leading-tight"
        >
          {titlePrefix}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#E8D28B] to-[#C5A059]">
            {titleHighlight}
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-sm sm:text-base md:text-lg text-[#D6CEBF] font-sans max-w-3xl mx-auto leading-relaxed mb-8 font-normal"
        >
          {description}
        </motion.p>

        {/* Interactive Search Bar & Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto space-y-4"
        >
          {/* Live Search Input */}
          <div className="relative flex items-center">
            <div className="absolute left-4 rtl:left-auto rtl:right-4 pointer-events-none text-[#B88A2B]">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                isRtl
                  ? "ابحث في الفتاوى والأجوبة والمسائل الشرعية والفكرية..."
                  : "Search questions, rulings, topics, and scholarly answers..."
              }
              className="w-full pl-12 pr-4 rtl:pl-4 rtl:pr-12 py-3.5 sm:py-4 rounded-2xl bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 text-white placeholder-white/50 text-sm sm:text-base focus:outline-hidden focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/30 transition-all shadow-xl"
            />
          </div>

          {/* Action Button Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onAskClick}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#B88A2B] via-[#C5A059] to-[#9E7422] hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-2xl hover:scale-103 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send size={15} className={isRtl ? "rotate-180" : ""} />
              <span>{isRtl ? "اطرح سؤالك على العلماء" : "Ask a Scholar"}</span>
            </button>

            {isAuthenticated && (
              <button
                type="button"
                onClick={onMyQuestionsClick}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-[#FAF0D7] font-semibold text-xs sm:text-sm backdrop-blur-md hover:scale-103 transition-all flex items-center gap-2 cursor-pointer"
              >
                <UserCheck size={15} className="text-[#C5A059]" />
                <span>{isRtl ? "متابعة أسئلتي" : "My Inquiries"}</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
