"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Mail, User, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AuthModal({ isOpen, onClose, actionType = "save" }) {
  const { isRtl } = useLanguage();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // For demo/scholar visitor session, we can save visitor credentials to localStorage
    const visitorUser = {
      id: "visitor-" + Date.now(),
      name: name || email.split("@")[0] || "Guest Scholar",
      email,
    };
    localStorage.setItem("scholar_visitor_user", JSON.stringify(visitorUser));
    onClose(visitorUser);
  };

  const actionTitle = isRtl
    ? actionType === "like"
      ? "سجّل الدخول للإعجاب بالمقال"
      : "سجّل الدخول لحفظ المقال"
    : actionType === "like"
      ? "Sign in to Like this Article"
      : "Sign in to Bookmark this Article";

  const actionDesc = isRtl
    ? "انضم إلى مجتمع علماء الأمة لحفظ المقالات والمشاركة في النقاشات العلمية."
    : "Join the Ummah Scholars community to save bookmarks and engage in scholastic dialogue.";

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-white dark:bg-[#1A1714] border border-[#E5DCCB] dark:border-[#2E2A24] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-[#78716C] hover:text-[#1C1917] dark:text-[#A39B8B] dark:hover:text-[#F5F1E8] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#B88A2B]/15 dark:bg-[#C5A059]/20 text-[#B88A2B] dark:text-[#C5A059] flex items-center justify-center mx-auto mb-3">
              <Lock size={22} />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#1C1917] dark:text-[#F5F1E8]">
              {actionTitle}
            </h3>
            <p className="text-xs text-[#78716C] dark:text-[#A39B8B] mt-1.5 leading-relaxed">
              {actionDesc}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-[#57534E] dark:text-[#A39B8B] mb-1.5">
                  {isRtl ? "الاسم الكريم" : "Your Name"}
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                  <input
                    type="text"
                    required
                    placeholder={isRtl ? "د. أحمد المنصوري" : "Dr. Ahmad Mansoor"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-[#FBF9F6] dark:bg-[#0F0D0B] text-sm text-[#1C1917] dark:text-[#F5F1E8] focus:outline-none focus:border-[#B88A2B] dark:focus:border-[#C5A059]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#57534E] dark:text-[#A39B8B] mb-1.5">
                {isRtl ? "البريد الإلكتروني" : "Email Address"}
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                <input
                  type="email"
                  required
                  placeholder="scholar@ummahscholar.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-[#FBF9F6] dark:bg-[#0F0D0B] text-sm text-[#1C1917] dark:text-[#F5F1E8] focus:outline-none focus:border-[#B88A2B] dark:focus:border-[#C5A059]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#B88A2B] to-[#C5A059] text-white font-bold text-sm shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{isSignUp ? (isRtl ? "إنشاء حساب ومتابعة" : "Create Account & Continue") : (isRtl ? "متابعة" : "Continue")}</span>
              {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </button>
          </form>

          {/* Toggle */}
          <div className="text-center mt-5 pt-4 border-t border-[#E5DCCB]/60 dark:border-[#2E2A24]/60">
            <button
              type="button"
              onClick={() => setIsSignUp((p) => !p)}
              className="text-xs text-[#B88A2B] dark:text-[#C5A059] hover:underline font-semibold cursor-pointer"
            >
              {isSignUp
                ? (isRtl ? "لديك حساب بالفعل؟ تسجيل الدخول" : "Already have an account? Sign In")
                : (isRtl ? "جديد هنا؟ تسجيل حساب سريع" : "New to Ummah Scholars? Quick Register")}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
