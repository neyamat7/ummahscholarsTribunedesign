"use client";

import React from "react";
import Link from "next/link";
import { Calendar, MapPin, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import SectionHeader from "@/components/SectionHeader";
import { fadeUp, staggerContainer, cardHoverAnimation } from "@/lib/animations";

export default function UpcomingEvents({ events = [] }) {
  const { isRtl, t } = useLanguage();

  if (!events || events.length === 0) {
    return null;
  }

  const displayEvents = events.slice(0, 3);

  return (
    <section className="py-14 bg-[#FFFFFF] dark:bg-[#1A1714] border-b border-[#E5DCCB] dark:border-[#2E2A24] transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-5">
        {/* Common Section Header */}
        <SectionHeader
          title={t("site.upcomingEvents") || (isRtl ? "الفعاليات والمبادرات القادمة" : "Upcoming Events & Initiatives")}
          description={
            isRtl
              ? "مؤتمرات وندوات علمية وحوارات فكرية متجددة تجمع نخبة من الباحثين والعلماء."
              : "Scholarly symposiums, academic webinars, and international conferences connecting researchers worldwide."
          }
          action={{
            href: "/blog/events-initiatives",
            label: t("site.viewAllEvents") || (isRtl ? "عرض كل الفعاليات" : "View All Events"),
          }}
        />

        {/* Horizontal Event Cards Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer(0.1, 0.05)}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {displayEvents.map((event, idx) => {
            const dateObj = new Date(
              event.eventDate || event.publishedAt || event.createdAt || Date.now()
            );
            const dayNum = isNaN(dateObj.getDate()) ? "—" : dateObj.getDate();
            const monthName = isNaN(dateObj.getTime())
              ? isRtl
                ? "قريباً"
                : "SOON"
              : dateObj.toLocaleDateString(isRtl ? "ar" : "en-US", {
                  month: "short",
                });

            const rawTitle = isRtl
              ? event.titleAr || event.titleEn || event.title
              : event.titleEn || event.titleAr || event.title;

            const title =
              !isRtl && typeof rawTitle === "string"
                ? rawTitle.replace(/\b\w/g, (char) => char.toUpperCase())
                : rawTitle;

            const location =
              event.location ||
              (isRtl ? "منبر علماء الأمة الدولي" : "Ummah Scholars Tribune");

            const isOnline = event.isOnline !== undefined ? event.isOnline : idx % 2 === 1;

            const slug = event.slug || event.id;
            const pageCat = event.pageCategory?.slug || "events-initiatives";
            const targetUrl = event.slug
              ? `/${pageCat}/${slug}`
              : `/${pageCat}`;

            // Vibrant tile color variants for distinct visual hierarchy
            const tileBg =
              idx === 0
                ? "bg-[#B88A2B]"
                : idx === 1
                ? "bg-[#1B4D3E]"
                : "bg-[#1E3A8A]";

            return (
              <motion.div
                key={event.id || idx}
                variants={fadeUp}
                whileHover={cardHoverAnimation}
                className="group bg-[#F7F4EE] dark:bg-[#0F0D0B] border border-[#E5DCCB] dark:border-[#2E2A24] hover:border-[#B88A2B]/60 dark:hover:border-[#C5A059]/50 rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-300"
              >
                <Link
                  href={targetUrl}
                  className="flex items-start gap-4 h-full"
                >
                  {/* Colorful Date Tile Badge */}
                  <div
                    className={`flex-shrink-0 w-14 h-16 rounded-xl ${tileBg} text-white shadow-xs flex flex-col items-center justify-center`}
                  >
                    <span className="text-[10px] uppercase font-bold tracking-widest leading-none">
                      {monthName}
                    </span>
                    <span className="text-xl font-serif font-extrabold leading-none mt-1">
                      {dayNum}
                    </span>
                  </div>

                  {/* Content Details */}
                  <div className="flex-grow space-y-2 min-w-0">
                    <div className="flex items-center gap-2">
                      {isOnline ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1B4D3E]/15 text-[#1B4D3E] dark:bg-[#34D399]/20 dark:text-[#34D399]">
                          <Globe size={11} /> {t("site.online") || (isRtl ? "عبر الإنترنت" : "Online")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#B88A2B]/15 text-[#B88A2B] dark:bg-[#C5A059]/20 dark:text-[#C5A059]">
                          <MapPin size={11} /> {t("site.inPerson") || (isRtl ? "حضوري" : "In Person")}
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-sm sm:text-base text-[#1C1917] dark:text-[#F5F1E8] group-hover:text-[#B88A2B] dark:group-hover:text-[#C5A059] transition-colors line-clamp-2 leading-snug">
                      {title}
                    </h3>

                    <p className="text-xs text-[#57534E] dark:text-[#A39B8B] flex items-center gap-1 line-clamp-1">
                      <MapPin
                        size={12}
                        className="text-[#B88A2B] dark:text-[#C5A059] flex-shrink-0"
                      />
                      <span>{location}</span>
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
