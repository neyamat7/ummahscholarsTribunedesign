"use client";

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutSlider() {
  const { isRtl } = useLanguage();

  const heroContent = isRtl
    ? {
        title: "مسيرتنا العلمية والفكرية",
        subtitle: "منصة رائدة لخدمة العلم والعلماء واستشراف المستقبل",
        description: "مرحباً بكم في منبر أعلام الأمة، بوابتكم إلى المعرفة الرصينة، والبحوث المحكمة، والرؤى الحضارية المتجددة بأقلام نخبة من جهابذة الفكر وعلماء الأمة."
      }
    : {
        title: "OUR SCHOLARLY JOURNEY",
        subtitle: "A DEDICATED PLATFORM FOR GLOBAL ISLAMIC SCHOLARSHIP",
        description: "Welcome to the Ummah Scholars Tribune, a premier gateway to authentic knowledge, peer-reviewed research, and forward-looking civilizational discourse from esteemed global scholars."
      };

  return (
    <section className="relative w-full min-h-[620px] md:min-h-[720px] lg:min-h-[780px] flex items-center bg-[#0F0D0B] overflow-hidden pt-20">
      {/* Background Image with increased visibility & balanced framing */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <Image
          src="/about.jpeg"
          alt="Ummah Scholars Tribune Leadership"
          fill
          priority
          className="object-cover opacity-65 md:opacity-75 transition-transform duration-1000 scale-100"
          style={{ objectPosition: 'center top' }}
        />
        {/* Lighter Gradient Overlays so photo details remain clear */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-[#0F0D0B] z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0D0B] via-transparent to-transparent z-[1]" />
      </div>

      {/* Editorial Content Container with crisp typography */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32 w-full flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#F5F1E8] leading-[1.15] mb-6 tracking-tight max-w-3xl drop-shadow-xl">
          {heroContent.title}
        </h1>

        <p className="text-base sm:text-xl lg:text-2xl font-serif font-medium text-[#C5A059] mb-6 tracking-wide max-w-2xl drop-shadow-md">
          {heroContent.subtitle}
        </p>

        <p className="text-neutral-100 text-sm sm:text-base lg:text-lg leading-relaxed font-sans max-w-2xl drop-shadow-md">
          {heroContent.description}
        </p>
      </div>
    </section>
  );
}