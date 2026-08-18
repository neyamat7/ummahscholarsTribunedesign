"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { fadeUp } from "@/lib/animations";

export default function SubHeroSection() {
  const { isRtl, t } = useLanguage();

  return (
    <section className="py-12 bg-[#F7F4EE] dark:bg-[#0F0D0B]">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        className="text-center max-w-4xl mx-auto px-4 space-y-3"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#1C1917] dark:text-[#F5F1E8] tracking-tight">
          {isRtl ? (
            <>
              منبر علماء{" "}
              <span className="italic text-[#B88A2B] dark:text-[#C5A059]">
                الأمة
              </span>
            </>
          ) : (
            <>
              Ummah Scholars{" "}
              <span className="italic text-[#B88A2B] dark:text-[#C5A059]">
                Tribune
              </span>
            </>
          )}
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-[#57534E] dark:text-[#A39B8B] font-serif max-w-xl mx-auto leading-relaxed">
          {t("site.subtitle") ||
            (isRtl
              ? "منصة عالمية للمعرفة الرصينة، والوعي المسؤول، والكلمة الهادفة، خدمةً للأمة والإنسانية."
              : "A global scholarly platform dedicated to classical jurisprudence, legal methodologies, and civilizational renewal.")}
        </p>
      </motion.div>
    </section>
  );
}
