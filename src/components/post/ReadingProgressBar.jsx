"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function ReadingProgressBar({ targetRef }) {
  const { isRtl } = useLanguage();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3.5px] bg-transparent pointer-events-none">
      <motion.div
        className="h-full bg-gradient-to-r from-[#78530D] via-[#9A701E] to-[#78530D] dark:from-[#B88A2B] dark:via-[#C5A059] dark:to-[#E5C177] shadow-[0_1px_6px_rgba(120,83,13,0.5)] dark:shadow-[0_0_8px_rgba(197,160,89,0.6)]"
        style={{
          scaleX,
          transformOrigin: isRtl ? "right" : "left",
        }}
      />
    </div>
  );
}
