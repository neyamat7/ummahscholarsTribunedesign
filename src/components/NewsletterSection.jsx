"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function NewsletterSection() {
  const { isRtl, t } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setIsSubscribed(false);
      setEmail("");
    }, 4000);
  };

  return (
    <section className="py-16 bg-[#1A1714] text-[#F5F1E8] border-t border-[#2E2A24] overflow-hidden">
      <div className="max-w-7xl mx-auto px-5">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer(0.12, 0.05)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          {/* Newsletter Callout */}
          <motion.div variants={fadeUp} className="lg:col-span-7 space-y-3">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#F5F1E8] tracking-tight leading-[1.2]">
              {isRtl ? (
                <>
                  اشترك في نشرتنا العلمية{" "}
                  <span className="italic text-[#B88A2B] dark:text-[#C5A059]">
                    الدورية
                  </span>
                </>
              ) : (
                <>
                  Subscribe to Our Scholarly{" "}
                  <span className="italic text-[#B88A2B] dark:text-[#C5A059]">
                    Digest
                  </span>
                </>
              )}
            </h3>
            <p className="text-xs sm:text-sm text-[#A39B8B] leading-relaxed max-w-xl font-sans">
              {t("footer.tagline") ||
                (isRtl
                  ? "تصلك أحدث الأبحاث والدراسات والمقالات الفكرية المحكّمة مباشرة إلى بريدك الإلكتروني."
                  : "Receive the latest peer-reviewed studies, articles, and scholarly insights directly in your inbox.")}
            </p>
          </motion.div>

          {/* Subscription Form */}
          <motion.div variants={fadeUp} className="lg:col-span-5">
            {isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-4 bg-[#1B4D3E]/30 border border-[#1B4D3E] text-[#C5A059] rounded-xl text-xs sm:text-sm font-semibold"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  {isRtl
                    ? "شكراً لاشتراكك في منبر علماء الأمة! تم تسجيل بريدك بنجاح."
                    : "Thank you for subscribing to Ummah Scholars Tribune!"}
                </span>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 bg-[#0F0D0B] p-2 rounded-xl border border-[#2E2A24]"
              >
                <div className="flex items-center gap-2 px-3 py-2 flex-grow">
                  <Mail className="w-4 h-4 text-[#A39B8B]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={
                      isRtl
                        ? "أدخل بريدك الإلكتروني"
                        : "Enter your email address"
                    }
                    className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-[#F5F1E8] placeholder-[#A39B8B]"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-[#C5A059] hover:bg-[#A37F3D] text-[#0F0D0B] font-bold text-xs sm:text-sm transition-colors whitespace-nowrap shadow-sm cursor-pointer"
                >
                  {t("nav.subscribe") || (isRtl ? "اشتراك" : "Subscribe")}
                </motion.button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
