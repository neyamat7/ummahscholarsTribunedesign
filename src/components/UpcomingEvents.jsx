"use client";

import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Globe, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import SectionHeader from "@/components/SectionHeader";
import { fadeUp, staggerContainer, cardHoverAnimation } from "@/lib/animations";

export default function UpcomingEvents() {
  const { isRtl, t } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("http://localhost:3000/api/v1/events?status=UPCOMING&limit=4");
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : data.data || [];
          if (items.length > 0) {
            setEvents(items);
          }
        }
      } catch (err) {
        // Fallback default demo events
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const fallbackEvents = [
    {
      id: "ev-1",
      titleEn: "International Islamic Jurisprudence & Governance Symposium",
      titleAr: "المؤتمر الدولي للفقه الإسلامي والحوكمة المعاصرة",
      eventDate: "2026-09-15T09:00:00.000Z",
      location: "Oxford Islamic Studies Center, UK",
      isOnline: false,
    },
    {
      id: "ev-2",
      titleEn: "Global Webinar: Classical Legal Treatises in Modern Society",
      titleAr: "ندوة عالمية: الرسائل القانونية الكلاسيكية في المجتمع الحديث",
      eventDate: "2026-09-28T14:00:00.000Z",
      location: "Online Broadcast",
      isOnline: true,
    },
    {
      id: "ev-3",
      titleEn: "Contemporary Fatwa Methodologies Annual Conference",
      titleAr: "المؤتمر السنوي لمناهج الفتاوى المعاصرة",
      eventDate: "2026-10-12T10:00:00.000Z",
      location: "Al-Azhar Academic Hall, Cairo",
      isOnline: false,
    },
  ];

  const displayEvents = events.length > 0 ? events : fallbackEvents;

  if (!loading && displayEvents.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-5 py-8 text-center text-xs text-[#57534E] dark:text-[#A39B8B]">
        {t("site.noUpcomingEvents")}
      </section>
    );
  }

  return (
    <section className="py-14 bg-[#FFFFFF] dark:bg-[#1A1714] border-b border-[#E5DCCB] dark:border-[#2E2A24] transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-5">
        {/* Common Section Header */}
        <SectionHeader
          title={t("site.upcomingEvents")}
          action={{
            href: "/events",
            label: t("site.viewAllEvents"),
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
          {displayEvents.slice(0, 3).map((event, idx) => {
            const dateObj = new Date(event.eventDate || Date.now());
            const dayNum = dateObj.getDate();
            const monthName = dateObj.toLocaleDateString(isRtl ? "ar" : "en-US", { month: "short" });

            const title = isRtl
              ? event.titleAr || event.titleEn || event.title
              : event.titleEn || event.titleAr || event.title;

            // Vibrant tile color variants for light mode
            const tileBg = idx === 0 ? "bg-[#B88A2B]" : idx === 1 ? "bg-[#1B4D3E]" : "bg-[#1E3A8A]";

            return (
              <motion.div
                key={event.id}
                variants={fadeUp}
                whileHover={cardHoverAnimation}
                className="group bg-[#F7F4EE] dark:bg-[#0F0D0B] border border-[#E5DCCB] dark:border-[#2E2A24] hover:border-[#B88A2B]/60 dark:hover:border-[#C5A059]/50 rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-300 flex items-start gap-4 cursor-pointer"
              >
                {/* Colorful Date Tile Badge */}
                <div className={`flex-shrink-0 w-14 h-16 rounded-xl ${tileBg} text-white shadow-xs flex flex-col items-center justify-center`}>
                  <span className="text-[10px] uppercase font-bold tracking-widest leading-none">
                    {monthName}
                  </span>
                  <span className="text-xl font-serif font-extrabold leading-none mt-1">
                    {dayNum}
                  </span>
                </div>

                {/* Content Details */}
                <div className="flex-grow space-y-2">
                  <div className="flex items-center gap-2">
                    {event.isOnline ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1B4D3E]/15 text-[#1B4D3E] dark:bg-[#34D399]/20 dark:text-[#34D399]">
                        <Globe size={11} /> {t("site.online")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#B88A2B]/15 text-[#B88A2B] dark:bg-[#C5A059]/20 dark:text-[#C5A059]">
                        <MapPin size={11} /> {t("site.inPerson")}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#1C1917] dark:text-[#F5F1E8] group-hover:text-[#B88A2B] dark:group-hover:text-[#C5A059] transition-colors line-clamp-2 leading-snug">
                    {title}
                  </h3>

                  <p className="text-xs text-[#57534E] dark:text-[#A39B8B] flex items-center gap-1 line-clamp-1">
                    <MapPin size={12} className="text-[#B88A2B] dark:text-[#C5A059] flex-shrink-0" />
                    {event.location || "Location TBD"}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
