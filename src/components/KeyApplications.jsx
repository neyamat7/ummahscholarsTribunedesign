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
      className="w-full lg:w-1/2 p-6 md:p-8 bg-[#FAF4E9] dark:bg-[#1A1714] border border-[#B88A2B]/30 dark:border-[#2E2A24] rounded-2xl shadow-xs relative overflow-hidden bg-arabesque-pattern flex flex-col justify-between"
    >
      {/* Decorative Accent Header */}
      <div className="flex items-center justify-between border-b border-[#E5DCCB] dark:border-[#2E2A24] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1B4D3E] text-white dark:bg-[#262118] dark:text-[#C5A059] border border-[#1B4D3E]/20 flex items-center justify-center shadow-xs">
            <BookMarked size={18} />
          </div>
          <h3 className="text-lg md:text-xl font-serif font-bold text-[#1C1917] dark:text-[#F5F1E8]">
            {isRtl ? "منبر أعلام الأمة" : "Ummah Scholars Tribune"}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#B88A2B]/10 text-[#B88A2B] dark:bg-[#C5A059]/10 dark:text-[#C5A059]">
            {isRtl ? "الرؤية والرسالة" : "Vision & Mission"}
          </span>
          <Globe2 className="w-5 h-5 text-[#B88A2B] dark:text-[#C5A059]/60" />
        </div>
      </div>

      {/* Structured Content (Strictly in active language) */}
      <div className="space-y-4 relative z-10 my-auto">
        <div className="inline-block px-3 py-0.5 rounded-full bg-[#1B4D3E] text-white dark:bg-[#262118] dark:text-[#C5A059] text-xs font-bold font-serif shadow-2xs">
          {isRtl ? "رسالتنا" : "Our Mission"}
        </div>
        
        <p className="text-[#1C1917] dark:text-[#F5F1E8] text-base md:text-lg font-serif leading-relaxed font-bold">
          {isRtl
            ? "منصة عالمية للمعرفة الرصينة، والوعي المسؤول، والكلمة الهادفة، خدمةً للأمة والإنسانية."
            : "A global platform for authentic knowledge, responsible awareness, and purposeful communication in the service of the Ummah and humanity."}
        </p>

        <p className="text-[#57534E] dark:text-[#A39B8B] text-xs md:text-sm font-sans leading-relaxed">
          {isRtl
            ? "منبر علمي وإعلامي يُعنى بنشر البحوث والدراسات، والمقالات، والأخبار، والفتاوى، والفعاليات، والمبادرات، في إطارٍ يجمع بين الأصالة، والمنهجية، والمهنية، والرؤية الحضارية، لبناء المعرفة، وتعزيز الوعي، وإحداث أثرٍ إيجابي ومستدام."
            : "A scholarly and media platform dedicated to publishing research, studies, articles, news, fatwas, events, and initiatives within a framework that combines authenticity, academic rigor, professionalism, and a forward-looking civilizational vision to foster knowledge, strengthen awareness, and create lasting impact."}
        </p>
      </div>

      {/* Decorative Footnote Feature Points */}
      <div className="pt-4 mt-6 border-t border-[#E5DCCB]/60 dark:border-[#2E2A24]/60 grid grid-cols-2 gap-3 text-xs text-[#57534E] dark:text-[#A39B8B]">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B88A2B] dark:bg-[#C5A059]" />
          <span>{isRtl ? "الأصالة والمنهجية" : "Authenticity & Rigor"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1B4D3E] dark:bg-[#C5A059]" />
          <span>{isRtl ? "أثر معرفي مستدام" : "Sustainable Impact"}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default KeyApplications;
