"use client";

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function FontLoader() {
  const { locale, isRtl } = useLanguage();
  const [fonts, setFonts] = useState({
    bodyFontEn: 'Inter',
    titleFontEn: 'Playfair Display',
    bodyFontAr: 'Cairo',
    titleFontAr: 'Amiri',
  });

  useEffect(() => {
    // Fetch active typography settings from backend NestJS API
    async function fetchTypography() {
      try {
        const res = await fetch('http://localhost:3000/api/v1/settings/typography');
        if (res.ok) {
          const data = await res.json();
          setFonts(prev => ({
            ...prev,
            ...data,
          }));
        }
      } catch (err) {
        // Fallback default fonts if server is not reachable
      }
    }
    fetchTypography();
  }, []);

  useEffect(() => {
    const fontNames = [fonts.bodyFontEn, fonts.titleFontEn, fonts.bodyFontAr, fonts.titleFontAr]
      .filter(Boolean)
      .map(f => f.replace(/\s+/g, '+'))
      .join('&family=');

    if (!fontNames) return;

    const linkId = 'google-fonts-dynamic';
    let link = document.getElementById(linkId);
    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = `https://fonts.googleapis.com/css2?family=${fontNames}&display=swap`;

    // Combined Dual-Font Stack: Primary font first, secondary font second
    // Allows English text & Arabic quotes to render in their respective fonts simultaneously
    const bodyStack = isRtl
      ? `'${fonts.bodyFontAr}', '${fonts.bodyFontEn}', sans-serif`
      : `'${fonts.bodyFontEn}', '${fonts.bodyFontAr}', sans-serif`;

    const titleStack = isRtl
      ? `'${fonts.titleFontAr}', '${fonts.titleFontEn}', serif`
      : `'${fonts.titleFontEn}', '${fonts.titleFontAr}', serif`;

    document.documentElement.style.setProperty('--font-body', bodyStack);
    document.documentElement.style.setProperty('--font-title', titleStack);

    // Apply combined font family directly to document body
    document.body.style.fontFamily = bodyStack;
  }, [fonts, isRtl]);

  return null;
}
