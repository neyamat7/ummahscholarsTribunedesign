"use client";

import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, X, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { scaleIn, EXPO_EASE } from "@/lib/animations";
import { useLanguage } from "@/context/LanguageContext";

const CLUBS = [
  {
    id: 1,
    title: "Ummah Scholars Tribune Introduction",
    titleAr: "مقدمة عن منبر أعلام الأمة",
    description: "An overview of our global academic platform, connecting contemporary jurisprudence with classical scholarship.",
    descriptionAr: "نظرة عامة على منصتنا الأكاديمية العالمية للربط بين الفقه المعاصر والاجتهاد الكلاسيكي.",
    speaker: "Dr. Ahmad Al-Mansoor",
    duration: "12:45",
    image: "/1.png",
    video: "https://www.youtube.com/embed/MZbwu3-uz3Y",
  },
  {
    id: 2,
    title: "Classical Legal Treatises & Jurisprudence",
    titleAr: "الرسائل القانونية الكلاسيكية والفقه",
    description: "In-depth analysis of foundational legal maxims and historical treatises across major legal schools.",
    descriptionAr: "تحليل تعمقي للقواعد الفقهية التأسيسية والرسائل التاريخية عبر المدارس الفقهية الرئيسية.",
    speaker: "Prof. Tariq Al-Bukhari",
    duration: "18:20",
    image: "/2.png",
    video: "https://www.youtube.com/embed/MZbwu3-uz3Y",
  },
  {
    id: 3,
    title: "Contemporary Islamic Governance Studies",
    titleAr: "دراسات الحوكمة الإسلامية المعاصرة",
    description: "Examining public policy, institutional ethics, and modern constitutional frameworks through Shariah methodology.",
    descriptionAr: "دراسة السياسة العامة والأخلاقيات المؤسسية والأطر الدستورية الحديثة عبر المنهجية الشرعية.",
    speaker: "Dr. Fatima Al-Zahra",
    duration: "15:10",
    image: "/3.png",
    video: "https://www.youtube.com/embed/MZbwu3-uz3Y",
  },
  {
    id: 4,
    title: "Global Scholarly Symposium 2026",
    titleAr: "المؤتمر العلمي العالمي ٢٠٢٦",
    description: "Keynote addresses and research papers presented at the international conference in Cairo.",
    descriptionAr: "الكلمات الرئيسية والأوراق البحثية المقدمة في المؤتمر الدولي بالقاهرة.",
    speaker: "Executive Committee",
    duration: "24:30",
    image: "/4.png",
    video: "https://www.youtube.com/embed/MZbwu3-uz3Y",
  },
  {
    id: 5,
    title: "Ethical Leadership & Social Impact",
    titleAr: "القيادة الأخلاقية والأثر المجتمعي",
    description: "Discussions on scholar responsibilities, moral accountability, and civilizational renewal.",
    descriptionAr: "مناقشات حول مسؤوليات العلماء والمساءلة الأخلاقية والتجديد الحضاري.",
    speaker: "Sh. Ibrahim Al-Qasimi",
    duration: "14:15",
    image: "/5.png",
    video: "https://www.youtube.com/embed/MZbwu3-uz3Y",
  },
  {
    id: 6,
    title: "Research Methodology in Modern Fatwas",
    titleAr: "منهجية البحث في الفتاوى المعاصرة",
    description: "Textual extrapolation, contextual reasoning, and legal verification techniques in contemporary fatwas.",
    descriptionAr: "الاستنباط النصي والاستدلال السياقي وتقنيات التثبت القانوني في الفتاوى المعاصرة.",
    speaker: "Dr. Yusuf Al-Hassan",
    duration: "20:00",
    image: "/6.png",
    video: "https://www.youtube.com/embed/MZbwu3-uz3Y",
  },
  {
    id: 7,
    title: "Institutional Excellence & Sustainable Knowledge",
    titleAr: "التميز المؤسسي والمعرفة المستدامة",
    description: "Building resilient academic institutions, endowments (Waqf), and scholarly repositories.",
    descriptionAr: "بناء المؤسسات الأكاديمية الصامدة والأوقاف والمستودعات العلمية.",
    speaker: "Dr. Omar Al-Farooq",
    duration: "16:40",
    image: "/7.png",
    video: "https://www.youtube.com/embed/MZbwu3-uz3Y",
  },
];

const SliderSwiperVideo = () => {
  const { isRtl } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [videoURL, setVideoURL] = useState("");
  const swiperRef = useRef(null);

  const activeVideo = CLUBS[activeIndex] || CLUBS[0];

  const handleOpenModal = (url) => {
    setVideoURL(url + "?autoplay=1");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setVideoURL("");
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={scaleIn}
      className="w-full lg:w-1/2 bg-[#FAF4E9] dark:bg-[#1A1714] border border-[#B88A2B]/30 dark:border-[#2E2A24] rounded-2xl p-6 shadow-xs flex flex-col justify-between overflow-hidden"
    >
      {/* Top Header & Navigation Buttons */}
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-base md:text-lg font-serif font-bold text-[#1C1917] dark:text-[#F5F1E8]">
          {isRtl ? "المكتبة المرئية العلمية" : "Scholarly Media Gallery"}
        </h4>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous slide"
            className="p-2 rounded-lg border border-[#E5DCCB] dark:border-[#2E2A24] bg-white dark:bg-[#0F0D0B] hover:bg-[#FAF0D7] dark:hover:bg-[#262118] text-[#1C1917] dark:text-[#F5F1E8] transition-colors cursor-pointer"
          >
            {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next slide"
            className="p-2 rounded-lg border border-[#E5DCCB] dark:border-[#2E2A24] bg-white dark:bg-[#0F0D0B] hover:bg-[#FAF0D7] dark:hover:bg-[#262118] text-[#1C1917] dark:text-[#F5F1E8] transition-colors cursor-pointer"
          >
            {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </motion.button>
        </div>
      </div>

      {/* Active Video Detailed Info Banner (Fades in on focus change) */}
      <div className="my-3 min-h-[76px] bg-white/80 dark:bg-[#0F0D0B]/70 p-3.5 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] backdrop-blur-xs flex items-center justify-between shadow-xs">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeVideo.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EXPO_EASE }}
            className="flex-grow pr-3 rtl:pr-0 rtl:pl-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B88A2B] dark:text-[#C5A059] bg-[#B88A2B]/10 dark:bg-[#C5A059]/10 px-2 py-0.5 rounded flex items-center gap-1">
                <Video size={10} />
                <span>{activeVideo.speaker}</span>
              </span>
              <span className="text-[10px] text-[#A39B8B] font-semibold">
                • {activeVideo.duration}
              </span>
            </div>
            <h5 className="font-serif font-bold text-sm text-[#1C1917] dark:text-[#F5F1E8] line-clamp-1">
              {isRtl ? activeVideo.titleAr : activeVideo.title}
            </h5>
            <p className="text-xs text-[#57534E] dark:text-[#A39B8B] font-sans line-clamp-1 mt-0.5 leading-relaxed">
              {isRtl ? activeVideo.descriptionAr : activeVideo.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Swiper Carousel Container */}
      <div className="w-full">
        <Swiper
          modules={[Navigation]}
          onBeforeInit={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          centeredSlides={false}
          initialSlide={0}
          slidesPerView="auto"
          spaceBetween={12}
          className="w-full !overflow-visible"
        >
          {CLUBS.map((slide, index) => {
            const isActive = activeIndex === index;
            const slideTitle = isRtl ? slide.titleAr : slide.title;

            return (
              <SwiperSlide key={slide.id} className="!w-auto !flex items-center">
                <div
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => isActive && handleOpenModal(slide.video)}
                  className={`
                    relative flex-shrink-0 rounded-xl shadow-xs border overflow-hidden cursor-pointer
                    ${isActive ? "w-[260px] sm:w-[320px] h-[190px] border-[#B88A2B] dark:border-[#C5A059]" : "w-[64px] sm:w-[76px] h-[190px] border-[#E5DCCB] dark:border-[#2E2A24]"}
                    transition-all duration-500 ease-out
                  `}
                >
                  {/* Slide Image */}
                  <img
                    src={slide.image}
                    alt={slideTitle}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
                      isActive ? "scale-100" : "scale-125 filter grayscale-[20%]"
                    }`}
                  />

                  {/* Neutral Warm Overlay */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      isActive ? "bg-gradient-to-t from-[#1C1917]/85 via-[#1C1917]/20 to-transparent" : "bg-[#1C1917]/60 hover:bg-[#1C1917]/35"
                    }`}
                  />

                  {/* Play Button on Active Card */}
                  {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, ease: EXPO_EASE }}
                        className="w-12 h-12 bg-[#B88A2B] dark:bg-[#C5A059] text-white dark:text-[#0F0D0B] rounded-full flex items-center justify-center shadow-md transform transition-transform duration-300 hover:scale-110"
                      >
                        <Play size={20} className="fill-current ml-0.5" />
                      </motion.div>
                    </div>
                  )}

                  {/* Active Slide Title */}
                  {isActive && (
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-white text-xs font-serif font-bold bg-[#1C1917]/85 backdrop-blur-xs px-2.5 py-1.5 rounded-md line-clamp-1 border border-white/10">
                        {slideTitle}
                      </h4>
                    </div>
                  )}

                  {/* Vertical Title for Inactive Collapsed Cards */}
                  {!isActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="text-white/80 text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap"
                        style={{
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                        }}
                      >
                        {slideTitle}
                      </span>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Video Modal with Smooth Framer Motion AnimatePresence */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0F0D0B]/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease: EXPO_EASE }}
              className="bg-[#1A1714] border border-[#2E2A24] rounded-2xl overflow-hidden relative max-w-3xl w-full shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#2E2A24]">
                <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                  {isRtl ? "عرض الفيديو" : "Video Presentation"}
                </span>
                <button
                  onClick={handleCloseModal}
                  className="p-1 rounded-lg hover:bg-[#262118] text-[#F5F1E8] transition-colors cursor-pointer"
                  aria-label="Close video"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="relative aspect-video w-full">
                <iframe
                  width="100%"
                  height="100%"
                  src={videoURL}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SliderSwiperVideo;
