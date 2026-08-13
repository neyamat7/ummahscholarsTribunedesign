"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { EXPO_EASE, fadeUp, staggerContainer } from "@/lib/animations";

export default function HeroSlider() {
  const { isRtl, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
    }
  };

  return (
    <section className="relative w-full min-h-[580px] lg:min-h-[660px] flex items-center bg-[#0F0D0B] overflow-hidden pt-20">
      {/* Background Media with Gradient Mask positioned to clearly showcase image & logo on the right, shifted down */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute inset-0 md:left-[15%] rtl:md:left-0 rtl:md:right-[15%] top-8 sm:top-10 md:top-14 lg:top-16 w-full h-[calc(100%-32px)] md:h-[calc(100%-60px)]">
          <Image
            src="/home.jpeg"
            alt="Ummah Scholars Tribune Banner"
            fill
            priority
            className="object-cover object-[70%_top] rtl:object-[30%_top] opacity-70 md:opacity-85 transition-transform duration-1000 scale-100"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F0D0B] via-[#0F0D0B]/85 to-transparent rtl:bg-gradient-to-l rtl:from-[#0F0D0B] rtl:via-[#0F0D0B]/85 md:w-3/5 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0D0B] via-transparent to-[#0F0D0B]/50 z-[1]" />
      </div>

      {/* Asymmetric Editorial Hero Content with Cascading Reveal */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28 w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.12, 0.1)}
          className={`max-w-2xl ${isRtl ? "text-right mr-0 ml-auto" : "text-left ml-0 mr-auto"}`}
        >
          {/* Editorial Display Heading */}
          <motion.h1
            variants={fadeUp}
            className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#F5F1E8] leading-[1.15] mb-6 tracking-tight"
          >
            {isRtl ? (
              <>
                تمكين الأمة بـ{" "}
                <span className="text-[#C5A059] italic underline decoration-[#C5A059]/40 underline-offset-8">
                  المعرفة
                </span>{" "}
                والرؤية المستنيرة
              </>
            ) : (
              <>
                Empowering The Ummah With{" "}
                <span className="text-[#C5A059] italic underline decoration-[#C5A059]/40 underline-offset-8">
                  Knowledge
                </span>{" "}
                & Perspective
              </>
            )}
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="text-neutral-300 text-sm sm:text-base lg:text-lg leading-relaxed font-sans mb-10 max-w-xl"
          >
            {isRtl
              ? "استكشف البحوث الأصيلة، والإعلانات العالمية، والدراسات المعاصرة، والرؤى الإسلامية العميقة من كبار العلماء والباحثين حول العالم."
              : "Explore authentic research, global announcements, contemporary legal studies, and profound Islamic insights from esteemed scholars worldwide."}
          </motion.p>

          {/* Integrated Minimal Search Input */}
          <motion.form
            variants={fadeUp}
            onSubmit={handleSearch}
            className="flex items-center max-w-lg bg-[#1A1714]/90 backdrop-blur-md border border-[#2E2A24] focus-within:border-[#C5A059] rounded-lg p-1.5 transition-all duration-300 shadow-xl"
          >
            <div className="px-3 text-[#A39B8B]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder={t("site.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-[#F5F1E8] placeholder-[#A39B8B] text-xs sm:text-sm px-1 py-2 focus:ring-0"
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-5 py-2.5 rounded-md bg-[#C5A059] hover:bg-[#A37F3D] text-[#0F0D0B] font-bold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap shadow-sm cursor-pointer"
            >
              {isRtl ? "بحث" : "Search"}
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}