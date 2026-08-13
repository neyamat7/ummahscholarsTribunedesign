"use client";

import React from "react";
import { BookMarked, Globe2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { fadeUp } from "@/lib/animations";

const KeyApplications = () => {
  const { isRtl } = useLanguage();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      className="w-full lg:w-1/2 p-6 md:p-8 bg-[#FAF4E9] dark:bg-[#1A1714] border border-[#B88A2B]/30 dark:border-[#2E2A24] rounded-2xl shadow-xs relative overflow-hidden bg-arabesque-pattern"
    >
      {/* Decorative Accent Header */}
      <div className="flex items-center justify-between border-b border-[#E5DCCB] dark:border-[#2E2A24] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1B4D3E] text-white dark:bg-[#262118] dark:text-[#C5A059] border border-[#1B4D3E]/20 flex items-center justify-center shadow-xs">
            <BookMarked size={18} />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#B88A2B] dark:text-[#C5A059] block">
              Mission & Vision
            </span>
            <h3 className="text-lg md:text-xl font-serif font-bold text-[#1C1917] dark:text-[#F5F1E8]">
              Ummah Scholars Tribune <span className="text-[#57534E] dark:text-[#A39B8B] text-sm font-normal">(منبر أعلام الأمة)</span>
            </h3>
          </div>
        </div>
        <Globe2 className="w-5 h-5 text-[#B88A2B] dark:text-[#C5A059]/60" />
      </div>

      {/* Structured Bilingual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Arabic Column */}
        <div className="space-y-3 text-right rtl:text-right border-b md:border-b-0 md:border-l rtl:md:border-l-0 rtl:md:border-r border-[#E5DCCB] dark:border-[#2E2A24] pb-6 md:pb-0 md:pl-6 rtl:md:pl-0 rtl:md:pr-6">
          <div className="inline-block px-3 py-0.5 rounded-full bg-[#1B4D3E] text-white dark:bg-[#262118] dark:text-[#C5A059] text-xs font-bold font-serif mb-1 shadow-2xs">
            العربية
          </div>
          <p className="text-[#1C1917] dark:text-[#F5F1E8] text-sm md:text-base font-serif leading-relaxed font-semibold">
            منصة عالمية للمعرفة الرصينة، والوعي المسؤول، والكلمة الهادفة، خدمةً للأمة والإنسانية.
          </p>
          <p className="text-[#57534E] dark:text-[#A39B8B] text-xs md:text-sm font-sans leading-relaxed">
            منبر علمي وإعلامي يُعنى بنشر البحوث والدراسات، والمقالات، والأخبار، والفتاوى، والفعاليات، والمبادرات، في إطارٍ يجمع بين الأصالة، والمنهجية، والمهنية، والرؤية الحضارية، لبناء المعرفة، وتعزيز الوعي، وإحداث أثرٍ إيجابي ومستدام.
          </p>
        </div>

        {/* English Column */}
        <div className="space-y-3 text-left rtl:text-left">
          <div className="inline-block px-3 py-0.5 rounded-full bg-[#1E3A8A] text-white dark:bg-[#262118] dark:text-[#C5A059] text-xs font-bold tracking-wider mb-1 shadow-2xs">
            English
          </div>
          <p className="text-[#1C1917] dark:text-[#F5F1E8] text-sm md:text-base font-serif leading-relaxed font-semibold">
            A global platform for authentic knowledge, responsible awareness, and purposeful communication in the service of the Ummah and humanity.
          </p>
          <p className="text-[#57534E] dark:text-[#A39B8B] text-xs md:text-sm font-sans leading-relaxed">
            A scholarly and media platform dedicated to publishing research, studies, articles, news, fatwas, events, and initiatives within a framework that combines authenticity, academic rigor, professionalism, and a forward-looking civilizational vision to foster knowledge, strengthen awareness, and create lasting impact.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default KeyApplications;
