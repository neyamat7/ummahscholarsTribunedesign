"use client";

import {
  BookOpen,
  Search,
  Lightbulb,
  Megaphone,
  Scale,
  Sprout,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import SectionHeader from "@/components/SectionHeader";
import { fadeUp, scaleIn, staggerContainer, cardHoverAnimation } from "@/lib/animations";

const features = [
  {
    id: 1,
    titleEn: "Authentic Knowledge",
    titleAr: "المعرفة الأصيلة",
    icon: BookOpen,
    descEn: "Preserving classical legal scholarship and rigorous methodologies.",
    descAr: "الحفاظ على الفقه الكلاسيكي والمناهج الدراسية الصارمة.",
    featured: true,
    colorLight: "bg-[#1B4D3E] text-white",
  },
  {
    id: 2,
    titleEn: "Scholarly Research",
    titleAr: "البحث العلمي",
    icon: Search,
    descEn: "Peer-reviewed studies on governance, ethics, and contemporary law.",
    descAr: "دراسات محكّمة حول الحوكمة والأخلاقيات والقانون المعاصر.",
    colorLight: "bg-[#1E3A8A] text-white",
  },
  {
    id: 3,
    titleEn: "Insightful Perspectives",
    titleAr: "رؤى عميقة",
    icon: Lightbulb,
    descEn: "Fostering intellectual discourse and forward-looking vision.",
    descAr: "تعزيز الخطاب الفكري والرؤية المستقبلية.",
    colorLight: "bg-[#D97706] text-white",
  },
  {
    id: 4,
    titleEn: "Responsible Awareness",
    titleAr: "الوعي المسؤول",
    icon: Megaphone,
    descEn: "Promoting ethical engagement and civilizational clarity.",
    descAr: "تعزيز التفاعل الأخلاقي والوضوح الحضاري.",
    colorLight: "bg-[#991B1B] text-white",
  },
  {
    id: 5,
    titleEn: "Reliable Fatwas",
    titleAr: "فتاوى موثوقة",
    icon: Scale,
    descEn: "Methodological jurisprudence addressing modern life challenges.",
    descAr: "اجتهاد منهجي يعالج تحديات الحياة المعاصرة.",
    colorLight: "bg-[#B88A2B] text-white",
  },
  {
    id: 6,
    titleEn: "Sustainable Development",
    titleAr: "التنمية المستدامة",
    icon: Sprout,
    descEn: "Aligning classical ethics with human advancement.",
    descAr: "ربط الأخلاقيات الكلاسيكية بالتقدم البشري.",
    colorLight: "bg-[#0D9488] text-white",
  },
  {
    id: 7,
    titleEn: "Global Engagement",
    titleAr: "التواصل العالمي",
    icon: Globe,
    descEn: "Connecting international scholars and academic institutions.",
    descAr: "ربط العلماء والمؤسسات الأكاديمية الدولية.",
    colorLight: "bg-[#6D28D9] text-white",
  },
];

export default function ResearchFeatures() {
  const { isRtl } = useLanguage();

  return (
    <section className="py-16 lg:py-24 bg-[#F7F4EE] dark:bg-[#0F0D0B] transition-colors border-t border-b border-[#E5DCCB] dark:border-[#2E2A24]">
      <div className="max-w-7xl mx-auto px-5">
        {/* Common Section Header */}
        <SectionHeader
          title={isRtl ? "ركائز الفكر والمنهج العلمي" : "Pillars of Scholarly Inquiry"}
          description={
            isRtl
              ? "إطار علمي يجمع بين أصالة التراث ومرونة المعاصرة لبناء الوعي وإحداث الأثر المستدام."
              : "A scholarly framework combining classical heritage with contemporary rigor to foster knowledge and lasting impact."
          }
        />

        {/* Staggered Bento Grid Layout (Total cascade tuned <1.2s) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer(0.08, 0.05)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {features.map((item) => {
            const Icon = item.icon;
            const title = isRtl ? item.titleAr : item.titleEn;
            const desc = isRtl ? item.descAr : item.descEn;

            return (
              <motion.div
                key={item.id}
                variants={item.featured ? scaleIn : fadeUp}
                whileHover={cardHoverAnimation}
                className={`group relative rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between border ${
                  item.featured
                    ? "sm:col-span-2 bg-[#FAF0D7] dark:bg-[#262118] border-[#B88A2B]/60 dark:border-[#C5A059]/40 shadow-sm hover:shadow-md"
                    : "bg-white dark:bg-[#1A1714] border-[#E5DCCB] dark:border-[#2E2A24] shadow-xs hover:border-[#B88A2B]/60 dark:hover:border-[#C5A059]/50 hover:shadow-md"
                }`}
              >
                <div>
                  {/* Top Bar: Colorful Icon Badge + ID */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-xs ${
                        item.colorLight
                      } dark:bg-[#FAF4E9]/10 dark:text-[#C5A059]`}
                    >
                      <Icon size={24} strokeWidth={1.8} />
                    </div>

                    <span className="text-xs font-mono font-bold text-[#B88A2B] dark:text-[#A39B8B]/60 bg-[#FAF0D7] dark:bg-[#262118] px-2.5 py-1 rounded-md">
                      0{item.id}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className={`font-serif font-bold text-lg mb-2 text-[#1C1917] dark:text-[#F5F1E8] ${
                      item.featured ? "text-xl sm:text-2xl" : ""
                    }`}
                  >
                    {title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A39B8B] leading-relaxed">
                    {desc}
                  </p>
                </div>

                {/* Decorative Bottom Accent Line */}
                <div className="mt-6 pt-4 border-t border-[#E5DCCB]/70 dark:border-[#2E2A24]/60 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#B88A2B] dark:text-[#C5A059] uppercase tracking-wider">
                    {isRtl ? "محور أساسي" : "Core Focus"}
                  </span>
                  <span className="text-xs text-[#B88A2B] dark:text-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity">
                    ✦
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}