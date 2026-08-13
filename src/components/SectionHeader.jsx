"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { fadeUp } from "@/lib/animations";

export default function SectionHeader({
  title,
  highlight,
  description,
  action, // { href, label, count, icon } or custom ReactNode
  align = "between", // "between" | "center" | "start"
  borderBottom = true,
  className = "",
  titleClassName = "",
}) {
  const { isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // Auto-split title into primary text color + italic gold accent if not explicitly provided
  let leadingWords = title;
  let highlightWord = highlight;

  if (typeof title === "string" && !highlight) {
    const words = title.trim().split(" ");
    if (words.length > 1) {
      highlightWord = words[words.length - 1];
      leadingWords = words.slice(0, -1).join(" ");
    }
  }

  const renderedTitle = (
    <h2
      className={`text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#1C1917] dark:text-[#F5F1E8] tracking-tight leading-[1.2] ${titleClassName}`}
    >
      {leadingWords}
      {highlightWord && (
        <>
          {" "}
          <span className="italic text-[#B88A2B] dark:text-[#C5A059]">
            {highlightWord}
          </span>
        </>
      )}
    </h2>
  );

  if (align === "center") {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        className={`text-center max-w-3xl mx-auto mb-10 sm:mb-14 ${className}`}
      >
        {renderedTitle}
        {description && (
          <p className="text-xs sm:text-sm md:text-base text-[#57534E] dark:text-[#A39B8B] font-sans mt-3 md:mt-4 leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        )}
        {action && (
          <div className="mt-6 flex justify-center">
            {typeof action === "object" && action.href ? (
              <Link
                href={action.href}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm text-white bg-[#B88A2B] hover:bg-[#9E731E] dark:bg-[#C5A059] dark:hover:bg-[#B88A2B] dark:text-[#0F0D0B] shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
              >
                <span>{action.label}</span>
                <ArrowIcon size={15} />
              </Link>
            ) : (
              action
            )}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-10 sm:mb-12 ${
        borderBottom
          ? "pb-4 sm:pb-5 border-b border-[#E5DCCB] dark:border-[#2E2A24]"
          : ""
      } ${className}`}
    >
      <div className="max-w-2xl">
        {renderedTitle}
        {description && (
          <p className="text-xs sm:text-sm md:text-base text-[#57534E] dark:text-[#A39B8B] font-sans mt-2 sm:mt-3 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="flex-shrink-0 flex items-center">
          {typeof action === "object" && action.href ? (
            <Link
              href={action.href}
              className="group inline-flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[#1C1917] dark:text-[#F5F1E8] hover:text-[#B88A2B] dark:hover:text-[#C5A059] transition-colors"
            >
              <span>{action.label}</span>
              <span className="w-8 h-8 rounded-full border border-[#B88A2B] dark:border-[#C5A059] flex items-center justify-center text-[#B88A2B] dark:text-[#C5A059] group-hover:bg-[#B88A2B] group-hover:dark:bg-[#C5A059] group-hover:text-white group-hover:dark:text-[#0F0D0B] transition-all duration-300">
                <ArrowIcon size={14} />
              </span>
            </Link>
          ) : (
            action
          )}
        </div>
      )}
    </motion.div>
  );
}
