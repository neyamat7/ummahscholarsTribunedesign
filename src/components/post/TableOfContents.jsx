"use client";

import React, { useState, useEffect } from "react";
import { ListFilter, ChevronDown, ChevronUp, Bookmark } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function TableOfContents({ headings = [], activeId = "", variant = "both" }) {
  const { isRtl } = useLanguage();
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  if (!headings || headings.length < 3) return null;

  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90; // Navbar offset
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setIsOpenMobile(false);
    }
  };

  const showMobile = variant === "mobile" || variant === "both";
  const showDesktop = variant === "desktop" || variant === "both";

  return (
    <>
      {/* Mobile Collapsible Drawer */}
      {showMobile && (
        <div className="xl:hidden mb-8 bg-[#FAF0D7]/60 dark:bg-[#1A1714] border border-[#E5DCCB] dark:border-[#2E2A24] rounded-2xl p-4 transition-all">
          <button
            onClick={() => setIsOpenMobile((prev) => !prev)}
            className="w-full flex items-center justify-between font-serif font-bold text-sm text-[#1C1917] dark:text-[#F5F1E8] cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ListFilter size={16} className="text-[#B88A2B] dark:text-[#C5A059]" />
              <span>{isRtl ? "جدول المحتويات" : "Table of Contents"}</span>
              <span className="text-[11px] font-sans font-normal text-[#78716C] dark:text-[#A39B8B]">
                ({headings.length})
              </span>
            </div>
            {isOpenMobile ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {isOpenMobile && (
            <nav className="mt-3 pt-3 border-t border-[#E5DCCB]/80 dark:border-[#2E2A24]/80 space-y-1.5 max-h-60 overflow-y-auto">
              {headings.map((h) => {
                const isActive = activeId === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => scrollToHeading(h.id)}
                    className={`w-full text-start text-xs py-1 px-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? "text-[#B88A2B] dark:text-[#C5A059] font-bold bg-[#B88A2B]/10 dark:bg-[#C5A059]/10"
                        : "text-[#57534E] dark:text-[#A39B8B] hover:text-[#1C1917] dark:hover:text-[#F5F1E8]"
                    } ${h.level === 3 ? (isRtl ? "pe-4" : "ps-4") : ""}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? "bg-[#B88A2B] dark:bg-[#C5A059]" : "bg-transparent"}`} />
                    <span className="truncate">{h.text}</span>
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      )}

      {/* Desktop Sticky Sidebar List */}
      {showDesktop && (
        <div className="w-full">
        <div className="bg-[#FAF0D7]/40 dark:bg-[#1A1714]/80 backdrop-blur-xs border border-[#E5DCCB] dark:border-[#2E2A24] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 font-serif font-bold text-sm text-[#1C1917] dark:text-[#F5F1E8] mb-3.5 pb-2.5 border-b border-[#E5DCCB]/80 dark:border-[#2E2A24]/80">
            <ListFilter size={15} className="text-[#B88A2B] dark:text-[#C5A059]" />
            <span>{isRtl ? "محتويات المقال" : "Article Contents"}</span>
          </div>

          <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
            {headings.map((h) => {
              const isActive = activeId === h.id;
              return (
                <button
                  key={h.id}
                  onClick={() => scrollToHeading(h.id)}
                  className={`w-full text-start text-xs py-1.5 px-2.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? "text-[#B88A2B] dark:text-[#C5A059] font-bold bg-[#B88A2B]/10 dark:bg-[#C5A059]/10"
                      : "text-[#78716C] dark:text-[#A39B8B] hover:text-[#1C1917] dark:hover:text-[#F5F1E8] hover:bg-black/5 dark:hover:bg-white/5"
                  } ${h.level === 3 ? (isRtl ? "pe-3" : "ps-3") : ""}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                      isActive ? "bg-[#B88A2B] dark:bg-[#C5A059]" : "bg-[#D6CEBF] dark:bg-[#443E35]"
                    }`}
                  />
                  <span className="truncate leading-relaxed">{h.text}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
      )}
    </>
  );
}
