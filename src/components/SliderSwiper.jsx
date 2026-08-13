"use client";

import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { scaleIn, EXPO_EASE } from "@/lib/animations";

const CLUBS = [
  {
    id: 1,
    title: "Ummah Scholars Tribune Introduction",
    image: "/1.png",
    video: "https://www.youtube.com/embed/MZbwu3-uz3Y",
  },
  {
    id: 2,
    title: "Classical Legal Treatises & Jurisprudence",
    image: "/2.png",
    video: "https://www.youtube.com/embed/MZbwu3-uz3Y",
  },
  {
    id: 3,
    title: "Contemporary Islamic Governance Studies",
    image: "/3.png",
    video: "https://www.youtube.com/embed/MZbwu3-uz3Y",
  },
  {
    id: 4,
    title: "Global Scholarly Symposium 2026",
    image: "/4.png",
    video: "https://www.youtube.com/embed/MZbwu3-uz3Y",
  },
  {
    id: 5,
    title: "Ethical Leadership & Social Impact",
    image: "/5.png",
    video: "https://www.youtube.com/embed/MZbwu3-uz3Y",
  },
  {
    id: 6,
    title: "Research Methodology in Modern Fatwas",
    image: "/6.png",
    video: "https://www.youtube.com/embed/MZbwu3-uz3Y",
  },
  {
    id: 7,
    title: "Institutional Excellence & Sustainable Knowledge",
    image: "/7.png",
    video: "https://www.youtube.com/embed/MZbwu3-uz3Y",
  },
];

const SliderSwiperVideo = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [videoURL, setVideoURL] = useState("");
  const swiperRef = useRef(null);

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
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#B88A2B] dark:text-[#C5A059]">
            Featured Media
          </span>
          <h4 className="text-base md:text-lg font-serif font-bold text-[#1C1917] dark:text-[#F5F1E8]">
            Scholarly Media Gallery
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous slide"
            className="p-2 rounded-lg border border-[#E5DCCB] dark:border-[#2E2A24] bg-white dark:bg-[#0F0D0B] hover:bg-[#FAF0D7] dark:hover:bg-[#262118] text-[#1C1917] dark:text-[#F5F1E8] transition-colors cursor-pointer"
          >
            <ChevronLeft size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next slide"
            className="p-2 rounded-lg border border-[#E5DCCB] dark:border-[#2E2A24] bg-white dark:bg-[#0F0D0B] hover:bg-[#FAF0D7] dark:hover:bg-[#262118] text-[#1C1917] dark:text-[#F5F1E8] transition-colors cursor-pointer"
          >
            <ChevronRight size={18} />
          </motion.button>
        </div>
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

            return (
              <SwiperSlide key={slide.id} className="!w-auto !flex items-center">
                <div
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => isActive && handleOpenModal(slide.video)}
                  className={`
                    relative flex-shrink-0 rounded-xl shadow-xs border overflow-hidden cursor-pointer
                    ${isActive ? "w-[260px] sm:w-[320px] h-[200px] border-[#B88A2B] dark:border-[#C5A059]" : "w-[64px] sm:w-[76px] h-[200px] border-[#E5DCCB] dark:border-[#2E2A24]"}
                    transition-all duration-500 ease-out
                  `}
                >
                  {/* Slide Image */}
                  <img
                    src={slide.image}
                    alt={slide.title}
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
                        {slide.title}
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
                        {slide.title}
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
                  Video Presentation
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
