"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, isRtl } = useLanguage();

  const goldColor = "#C5A059";
  const textColor = "#1A1A1A";

  const menuItems = [
    { name: t('nav.home'), path: "/" },
    { name: t('nav.about'), path: "/about" },
    { name: t('nav.news'), path: "/news" },
    { name: t('nav.research'), path: "/research" },
    { name: t('nav.opinions'), path: "/opinions" },
    { name: t('nav.events'), path: "/events" },
    { name: t('nav.contact'), path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-xs" style={{ borderColor: `${goldColor}33` }}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div 
              className="relative w-12 h-12 rounded-full overflow-hidden border-2 transition-transform duration-300 group-hover:scale-105"
              style={{ borderColor: goldColor, boxShadow: `0 0 10px ${goldColor}33` }}
            >
              <Image 
                src="/logo.jpeg" 
                alt="Ummah Scholars Tribune Logo" 
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span 
                className="font-serif font-bold text-sm sm:text-base tracking-wide leading-none transition-colors"
                style={{ color: textColor }}
              >
                {t('site.title')}
              </span>
              <span 
                className="font-serif text-[10px] sm:text-xs tracking-widest font-medium uppercase mt-0.5"
                style={{ color: goldColor }}
              >
                {isRtl ? "تريبون" : "TRIBUNE"}
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            {menuItems.map((item, index) => (
              <Link 
                key={index} 
                href={item.path}
                className="text-[15px] font-medium transition-all duration-200 relative py-1 hover:opacity-80"
                style={{ color: textColor }}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Action & Language Switcher */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher />

            <Link 
              href="/subscribe"
              className="px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 shadow-2xs hover:shadow-xs"
              style={{ 
                backgroundColor: goldColor,
                color: '#ffffff',
              }}
            >
              {t('nav.subscribe')}
            </Link>
          </div>

          {/* Mobile Hamburger & Lang Switcher */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md transition-colors focus:outline-none"
              style={{ color: goldColor }}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t transition-all duration-300" style={{ borderColor: `${goldColor}22` }}>
          <div className="px-4 pt-3 pb-6 space-y-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.path}
                className="block px-3 py-2.5 rounded-md text-base font-medium transition-colors"
                style={{ color: textColor }}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t px-3" style={{ borderColor: `${goldColor}11` }}>
              <Link
                href="/subscribe"
                className="block text-center py-2.5 rounded-full font-medium transition-colors"
                style={{ 
                  backgroundColor: goldColor, 
                  color: '#ffffff' 
                }}
                onClick={() => setIsOpen(false)}
              >
                {t('nav.subscribe')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}