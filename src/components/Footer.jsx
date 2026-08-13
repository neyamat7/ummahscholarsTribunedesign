"use client";

import React from "react";
import Link from "next/link";
import { Twitter, Facebook, Instagram, Linkedin, Youtube, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { fadeIn } from "@/lib/animations";

export default function Footer() {
  const { isRtl, t } = useLanguage();

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={fadeIn}
      className="bg-[#0F0D0B] text-[#F5F1E8] border-t border-[#2E2A24] pt-16 pb-12 relative overflow-hidden bg-arabesque-pattern"
    >
      <div className="max-w-7xl mx-auto px-5 relative z-10">
        {/* Top & Navigation Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-[#2E2A24]">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FAF4E9]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                <BookOpen size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F1E8]">
                {isRtl ? "منبر علماء الأمة" : "Ummah Scholars Tribune"}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#A39B8B] leading-relaxed max-w-md font-sans">
              {t("footer.tagline")}
            </p>

            {/* Social Icons Row with 150ms hover scale */}
            <div className="pt-2 flex items-center gap-3 text-[#A39B8B]">
              {[
                { icon: Twitter, label: "Twitter / X", href: "https://twitter.com" },
                { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
                { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
                { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
                { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
              ].map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <motion.a
                    key={idx}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="w-8 h-8 rounded-full border border-[#2E2A24] bg-[#1A1714] flex items-center justify-center hover:text-[#C5A059] hover:border-[#C5A059]/40 transition-colors cursor-pointer"
                  >
                    <IconComponent size={15} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Navigation Links (2 Simple Columns) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-2 gap-8 text-xs font-sans">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-4">
                {isRtl ? "أقسام المنبر" : "Categories"}
              </h3>
              <ul className="space-y-2.5 text-[#A39B8B]">
                <li>
                  <Link href="/research" className="hover:text-[#C5A059] transition-colors">
                    {t("nav.research")}
                  </Link>
                </li>
                <li>
                  <Link href="/opinions" className="hover:text-[#C5A059] transition-colors">
                    {t("nav.opinions")}
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="hover:text-[#C5A059] transition-colors">
                    {t("nav.news")}
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="hover:text-[#C5A059] transition-colors">
                    {t("nav.events")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-4">
                {isRtl ? "معلومات وتواصل" : "Platform"}
              </h3>
              <ul className="space-y-2.5 text-[#A39B8B]">
                <li>
                  <Link href="/about" className="hover:text-[#C5A059] transition-colors">
                    {t("nav.about")}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#C5A059] transition-colors">
                    {t("nav.contact")}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-[#C5A059] transition-colors">
                    {t("footer.privacy")}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-[#C5A059] transition-colors">
                    {t("footer.terms")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A39B8B]">
          <p>© 2026 {isRtl ? "منبر علماء الأمة." : "Ummah Scholars Tribune."} {t("footer.rights")}</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[#C5A059] transition-colors">
              {t("footer.privacy")}
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[#C5A059] transition-colors">
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
