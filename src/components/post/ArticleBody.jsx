"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { FileText, Download, ExternalLink, Globe, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import ImageLightbox from "./ImageLightbox";
import YouTubeFacade from "./YouTubeFacade";

export default function ArticleBody({ post, onHeadingsFound, onActiveHeadingChange }) {
  const { isRtl, setLocale } = useLanguage();
  const [lightboxState, setLightboxState] = useState({ isOpen: false, src: "", alt: "" });
  const contentRef = useRef(null);

  // Select active language content
  const rawContent = isRtl ? post.contentAr || "" : post.contentEn || "";
  const fallbackAvailable = isRtl ? Boolean(post.contentEn) : Boolean(post.contentAr);

  // Extract headings (H2, H3) and prepare enhanced HTML with slug IDs
  const { processedHtml, headings } = useMemo(() => {
    if (!rawContent) return { processedHtml: "", headings: [] };

    const extracted = [];
    let headingIndex = 0;

    // Replace <h2> and <h3> tags to inject unique IDs
    const transformed = rawContent.replace(
      /<(h[23])([^>]*)>(.*?)<\/\1>/gi,
      (match, tag, attrs, text) => {
        const cleanText = text.replace(/<[^>]+>/g, "").trim();
        const slug =
          cleanText
            .toLowerCase()
            .replace(/[^\w\u0600-\u06FF]+/g, "-")
            .replace(/^-+|-+$/g, "") || `heading-${++headingIndex}`;

        const level = parseInt(tag.replace(/h/i, ""), 10);
        extracted.push({ id: slug, text: cleanText, level });

        return `<${tag}${attrs} id="${slug}" class="scroll-mt-28">${text}</${tag}>`;
      }
    );

    return { processedHtml: transformed, headings: extracted };
  }, [rawContent]);

  useEffect(() => {
    if (onHeadingsFound) {
      onHeadingsFound(headings);
    }
  }, [headings, onHeadingsFound]);

  // Track active heading on scroll
  useEffect(() => {
    if (!headings.length || !onActiveHeadingChange) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onActiveHeadingChange(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0.1 }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings, onActiveHeadingChange]);

  // Intercept inline image clicks to open the high-res Lightbox
  const handleContentClick = (e) => {
    const target = e.target;
    if (target.tagName === "IMG") {
      e.preventDefault();
      setLightboxState({
        isOpen: true,
        src: target.src,
        alt: target.alt || "",
      });
    }
  };

  return (
    <div className="w-full">
      {/* Content Missing in Active Language Warning Banner */}
      {!rawContent && fallbackAvailable && (
        <div className="mb-8 p-5 rounded-2xl bg-[#FAF0D7]/70 dark:bg-[#262118] border border-[#B88A2B]/30 dark:border-[#C5A059]/30 flex items-start gap-3.5">
          <AlertCircle className="text-[#B88A2B] dark:text-[#C5A059] shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-serif font-bold text-sm text-[#1C1917] dark:text-[#F5F1E8]">
              {isRtl ? "المقال متوفر باللغة الإنجليزية حالياً" : "This article is currently available in Arabic"}
            </h4>
            <p className="text-xs text-[#78716C] dark:text-[#A39B8B] mt-1 leading-relaxed">
              {isRtl
                ? "لم تتم ترجمة هذا البحث إلى العربية بعد. يمكنك قراءة النسخة الإنجليزية الأصلية بالنقر على الزر أدناه."
                : "This scholarly inquiry is not yet translated into English. You can switch to the Arabic version."}
            </p>
            <button
              onClick={() => setLocale(isRtl ? "en" : "ar")}
              className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#B88A2B] dark:bg-[#C5A059] text-white text-xs font-bold shadow-xs hover:brightness-105 transition-all cursor-pointer"
            >
              <Globe size={13} />
              <span>{isRtl ? "قراءة باللغة الإنجليزية" : "Read in Arabic"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Prose Body */}
      <article
        ref={contentRef}
        onClick={handleContentClick}
        dangerouslySetInnerHTML={{ __html: processedHtml || "<p>Article content coming soon...</p>" }}
        className="scholarly-prose text-[#292524] dark:text-[#E7E2D8] font-sans leading-[1.85] text-base sm:text-[1.08rem]
          [&>p]:mb-6 [&>p]:leading-[1.85]
          [&>h2]:font-serif [&>h2]:font-bold [&>h2]:text-2xl [&>h2]:sm:text-3xl [&>h2]:text-[#1A1714] [&>h2]:dark:text-[#F5F1E8] [&>h2]:mt-12 [&>h2]:mb-5 [&>h2]:tracking-tight
          [&>h3]:font-serif [&>h3]:font-bold [&>h3]:text-xl [&>h3]:sm:text-2xl [&>h3]:text-[#1A1714] [&>h3]:dark:text-[#F5F1E8] [&>h3]:mt-8 [&>h3]:mb-4
          [&>ul]:list-disc [&>ul]:ps-6 [&>ul]:mb-6 [&>ul]:space-y-2.5
          [&>ol]:list-decimal [&>ol]:ps-6 [&>ol]:mb-6 [&>ol]:space-y-2.5
          [&>blockquote]:my-8 [&>blockquote]:p-6 [&>blockquote]:rounded-2xl [&>blockquote]:bg-[#FAF0D7]/50 [&>blockquote]:dark:bg-[#1A1714] [&>blockquote]:border-s-4 [&>blockquote]:border-[#B88A2B] [&>blockquote]:dark:border-[#C5A059] [&>blockquote]:font-serif [&>blockquote]:italic [&>blockquote]:text-lg [&>blockquote]:text-[#1C1917] [&>blockquote]:dark:text-[#F5F1E8]
          [&>img]:rounded-2xl [&>img]:my-8 [&>img]:cursor-zoom-in [&>img]:shadow-md [&>img]:border [&>img]:border-[#E5DCCB] [&>img]:dark:border-[#2E2A24]
          [&_a]:text-[#B88A2B] [&_a]:dark:text-[#C5A059] [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-4
        "
      />

      {/* PDF & Attached Media Attachments */}
      {post.attachedMedia && post.attachedMedia.length > 0 && (
        <div className="mt-12 pt-8 border-t border-[#E5DCCB]/80 dark:border-[#2E2A24]/80">
          <h3 className="font-serif font-bold text-lg text-[#1C1917] dark:text-[#F5F1E8] mb-4 flex items-center gap-2">
            <FileText size={18} className="text-[#B88A2B] dark:text-[#C5A059]" />
            <span>{isRtl ? "المستندات والأوراق البحثية المرفقة" : "Attached Research Documents & PDFs"}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {post.attachedMedia.map((media, idx) => (
              <div
                key={media.id || idx}
                className="p-4 rounded-2xl bg-[#FAF0D7]/40 dark:bg-[#1A1714] border border-[#E5DCCB] dark:border-[#2E2A24] flex items-center justify-between gap-3 hover:border-[#B88A2B]/40 transition-all shadow-2xs"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-[#1C1917] dark:text-[#F5F1E8] truncate">
                      {media.originalFilename || `Research-Document-${idx + 1}.pdf`}
                    </p>
                    <p className="text-[10px] text-[#78716C] dark:text-[#A39B8B] uppercase">
                      {media.sizeBytes ? `${Math.round(media.sizeBytes / 1024)} KB` : "PDF Document"}
                    </p>
                  </div>
                </div>

                <a
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#B88A2B]/15 dark:bg-[#C5A059]/20 text-[#B88A2B] dark:text-[#C5A059] hover:bg-[#B88A2B] hover:text-white dark:hover:bg-[#C5A059] dark:hover:text-[#0F0D0B] transition-colors shrink-0"
                  title="Download / View Document"
                >
                  <Download size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <ImageLightbox
        isOpen={lightboxState.isOpen}
        src={lightboxState.src}
        alt={lightboxState.alt}
        onClose={() => setLightboxState({ isOpen: false, src: "", alt: "" })}
      />
    </div>
  );
}
