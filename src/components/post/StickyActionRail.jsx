"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Bookmark,
  Share2,
  Check,
  Copy,
  Twitter,
  Facebook,
  Send,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { togglePostLike, togglePostBookmark } from "@/lib/api";
import AuthModal from "@/components/auth/AuthModal";

export default function StickyActionRail({ post, initialLikes = 0, initialBookmarks = 0 }) {
  const { isRtl } = useLanguage();
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState("like");
  const [user, setUser] = useState(null);
  const shareRef = useRef(null);

  // Close share popover on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setIsShareOpen(false);
      }
    };
    if (isShareOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isShareOpen]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("scholar_visitor_user");
      if (stored) setUser(JSON.parse(stored));

      const likedPosts = JSON.parse(localStorage.getItem("scholar_liked_posts") || "{}");
      const bookmarkedPosts = JSON.parse(localStorage.getItem("scholar_bookmarked_posts") || "{}");
      if (likedPosts[post.id]) setIsLiked(true);
      if (bookmarkedPosts[post.id]) setIsBookmarked(true);
    } catch (e) {}
  }, [post.id]);

  const handleLike = async () => {
    if (!user) {
      setPendingAction("like");
      setAuthModalOpen(true);
      return;
    }

    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      const likedPosts = JSON.parse(localStorage.getItem("scholar_liked_posts") || "{}");
      likedPosts[post.id] = nextState;
      localStorage.setItem("scholar_liked_posts", JSON.stringify(likedPosts));

      await togglePostLike(post.id, user.id);
    } catch (err) {
      console.error("Like toggle error:", err);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      setPendingAction("save");
      setAuthModalOpen(true);
      return;
    }

    const nextState = !isBookmarked;
    setIsBookmarked(nextState);

    try {
      const bookmarkedPosts = JSON.parse(localStorage.getItem("scholar_bookmarked_posts") || "{}");
      bookmarkedPosts[post.id] = nextState;
      localStorage.setItem("scholar_bookmarked_posts", JSON.stringify(bookmarkedPosts));

      await togglePostBookmark(post.id, user.id);
    } catch (err) {
      console.error("Bookmark toggle error:", err);
    }
  };

  const handleAuthSuccess = (loggedUser) => {
    setUser(loggedUser);
    setAuthModalOpen(false);
    if (pendingAction === "like") handleLike();
    if (pendingAction === "save") handleBookmark();
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentUrl = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
  const postTitle = encodeURIComponent(post.titleEn || post.titleAr || "Ummah Scholars Tribune");

  return (
    <>
      {/* Desktop Viewport-Fixed Vertical Action Rail (At the far left edge of the whole screen) */}
      <aside
        aria-label="Article Actions"
        className={`hidden lg:flex fixed top-1/2 -translate-y-1/2 ${
          isRtl ? "right-3 sm:right-5 2xl:right-8" : "left-3 sm:left-5 2xl:left-8"
        } z-40 flex-col items-center gap-3.5 py-4 px-2 bg-white/95 dark:bg-[#1A1714]/95 backdrop-blur-md border border-[#E5DCCB] dark:border-[#2E2A24] rounded-2xl shadow-md`}
      >
        {/* Like Button */}
        <div className="flex flex-col items-center gap-1">
          <motion.button
            whileTap={{ scale: 1.3 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            onClick={handleLike}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              isLiked
                ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                : "text-[#78716C] dark:text-[#A39B8B] hover:text-[#1C1917] dark:hover:text-[#F5F1E8] hover:bg-black/5 dark:hover:bg-white/5"
            }`}
            title={isLiked ? (isRtl ? "إلغاء الإعجاب" : "Unlike") : (isRtl ? "إعجاب" : "Like article")}
          >
            <Heart size={18} className={isLiked ? "fill-current text-rose-500" : ""} />
          </motion.button>
          <span className="text-[11px] font-bold text-[#78716C] dark:text-[#A39B8B]">
            {likesCount}
          </span>
        </div>

        <div className="w-6 h-px bg-[#E5DCCB]/80 dark:bg-[#2E2A24]/80" />

        {/* Bookmark Button */}
        <motion.button
          whileTap={{ scale: 1.3 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          onClick={handleBookmark}
          className={`p-2.5 rounded-xl transition-all cursor-pointer ${
            isBookmarked
              ? "bg-[#FAF0D7] text-[#B88A2B] dark:bg-[#262118] dark:text-[#C5A059]"
              : "text-[#78716C] dark:text-[#A39B8B] hover:text-[#1C1917] dark:hover:text-[#F5F1E8] hover:bg-black/5 dark:hover:bg-white/5"
          }`}
          title={isBookmarked ? (isRtl ? "إزالة الحفظ" : "Remove Bookmark") : (isRtl ? "حفظ في المفضلة" : "Save Bookmark")}
        >
          <Bookmark size={18} className={isBookmarked ? "fill-current text-[#B88A2B] dark:text-[#C5A059]" : ""} />
        </motion.button>

        <div className="w-6 h-px bg-[#E5DCCB]/80 dark:bg-[#2E2A24]/80" />

        {/* Share Button & High Z-Index Popover */}
        <div ref={shareRef} className="relative">
          <button
            onClick={() => setIsShareOpen((p) => !p)}
            className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
              isShareOpen
                ? "bg-[#FAF0D7] text-[#B88A2B] dark:bg-[#262118] dark:text-[#C5A059]"
                : "text-[#78716C] dark:text-[#A39B8B] hover:text-[#1C1917] dark:hover:text-[#F5F1E8] hover:bg-black/5 dark:hover:bg-white/5"
            }`}
            title={isRtl ? "مشاركة المقال" : "Share article"}
          >
            <Share2 size={18} />
          </button>

          <AnimatePresence>
            {isShareOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, x: isRtl ? -10 : 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.92, x: isRtl ? -10 : 10 }}
                transition={{ duration: 0.15 }}
                className={`absolute top-0 ${
                  isRtl ? "right-full mr-3" : "left-full ml-3"
                } z-[100] w-60 bg-white dark:bg-[#1A1714] border border-[#E5DCCB] dark:border-[#2E2A24] rounded-2xl p-3 shadow-2xl`}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E] dark:text-[#78716C] px-2 mb-2">
                  {isRtl ? "مشاركة المقال" : "Share Article"}
                </p>

                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-xl hover:bg-[#FAF0D7] dark:hover:bg-[#262118] text-[#1C1917] dark:text-[#F5F1E8] transition-colors cursor-pointer mb-1"
                >
                  <span className="flex items-center gap-2">
                    {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    <span>{copied ? (isRtl ? "تم النسخ!" : "Copied!") : (isRtl ? "نسخ الرابط" : "Copy Link")}</span>
                  </span>
                </button>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-xl hover:bg-[#FAF0D7] dark:hover:bg-[#262118] text-[#1C1917] dark:text-[#F5F1E8] transition-colors mb-0.5"
                >
                  <Facebook size={14} className="text-[#1877F2]" />
                  <span>Facebook</span>
                </a>

                {/* Twitter / X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${postTitle}&url=${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-xl hover:bg-[#FAF0D7] dark:hover:bg-[#262118] text-[#1C1917] dark:text-[#F5F1E8] transition-colors mb-0.5"
                >
                  <Twitter size={14} className="text-sky-500" />
                  <span>Twitter / X</span>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${postTitle}%20${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-xl hover:bg-[#FAF0D7] dark:hover:bg-[#262118] text-[#1C1917] dark:text-[#F5F1E8] transition-colors mb-0.5"
                >
                  <MessageCircle size={14} className="text-emerald-500" />
                  <span>WhatsApp</span>
                </a>

                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-xl hover:bg-[#FAF0D7] dark:hover:bg-[#262118] text-[#1C1917] dark:text-[#F5F1E8] transition-colors mb-0.5"
                >
                  <Linkedin size={14} className="text-[#0A66C2]" />
                  <span>LinkedIn</span>
                </a>

                {/* Telegram */}
                <a
                  href={`https://t.me/share/url?url=${currentUrl}&text=${postTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-xl hover:bg-[#FAF0D7] dark:hover:bg-[#262118] text-[#1C1917] dark:text-[#F5F1E8] transition-colors"
                >
                  <Send size={14} className="text-sky-500" />
                  <span>Telegram</span>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* Mobile Fixed Bottom Dock (Visible only on mobile/tablet screens) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1A1714]/95 backdrop-blur-md border-t border-[#E5DCCB] dark:border-[#2E2A24] px-6 py-2.5 flex items-center justify-around shadow-lg">
        {/* Like */}
        <button
          onClick={handleLike}
          className="flex items-center gap-1.5 p-2 rounded-xl text-sm font-semibold cursor-pointer"
        >
          <Heart size={20} className={isLiked ? "fill-rose-500 text-rose-500" : "text-[#78716C] dark:text-[#A39B8B]"} />
          <span className="text-xs text-[#78716C] dark:text-[#A39B8B]">{likesCount}</span>
        </button>

        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          className="p-2 rounded-xl text-sm cursor-pointer"
        >
          <Bookmark size={20} className={isBookmarked ? "fill-[#B88A2B] text-[#B88A2B] dark:fill-[#C5A059] dark:text-[#C5A059]" : "text-[#78716C] dark:text-[#A39B8B]"} />
        </button>

        {/* Share */}
        <button
          onClick={handleCopyLink}
          className="p-2 rounded-xl text-sm text-[#78716C] dark:text-[#A39B8B] cursor-pointer flex items-center gap-1"
        >
          {copied ? <Check size={20} className="text-emerald-600" /> : <Share2 size={20} />}
        </button>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={handleAuthSuccess}
        actionType={pendingAction}
      />
    </>
  );
}
