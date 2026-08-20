"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Mail, User, ArrowRight, ArrowLeft, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export default function AuthModal({
  isOpen,
  onClose,
  actionType = "login",
  initialMode = "signin",
}) {
  const { isRtl } = useLanguage();
  const { login, register } = useAuth();

  const [isSignUp, setIsSignUp] = useState(initialMode === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (password.length < 6) {
          setError(isRtl ? "يجب أن لا تقل كلمة المرور عن 6 أحرف" : "Password must be at least 6 characters");
          setLoading(false);
          return;
        }
        const loggedUser = await register({ name, email, password, rememberMe });
        if (onClose) onClose(loggedUser);
      } else {
        const loggedUser = await login({ email, password, rememberMe });
        if (onClose) onClose(loggedUser);
      }
    } catch (err) {
      setError(err?.message || (isRtl ? "حدث خطأ أثناء المصادقة" : "Authentication failed"));
    } finally {
      setLoading(false);
    }
  };

  const getHeaderInfo = () => {
    if (actionType === "like") {
      return {
        title: isRtl ? "سجّل الدخول للإعجاب بالمقال" : "Sign in to Like this Article",
        desc: isRtl ? "انضم إلى مجتمع قراء وباحثي منبر الأمة." : "Join our community of scholars and readers.",
      };
    }
    if (actionType === "save" || actionType === "bookmark") {
      return {
        title: isRtl ? "سجّل الدخول لحفظ المقال" : "Sign in to Bookmark Article",
        desc: isRtl ? "احفظ المقالات للرجوع إليها لاحقاً من ملفك الشخصي." : "Save articles to access anytime from your profile.",
      };
    }
    if (actionType === "comment") {
      return {
        title: isRtl ? "سجّل الدخول للمشاركة في النقاش" : "Sign in to Join Discussion",
        desc: isRtl ? "شارك رأيك الأكاديمي مع نخبة العلماء والباحثين." : "Share your perspective with our scholarly community.",
      };
    }
    return {
      title: isSignUp
        ? (isRtl ? "انضم إلى منبر علماء الأمة (UST)" : "Join Ummah Scholars Tribune (UST)")
        : (isRtl ? "تسجيل الدخول إلى حسابك" : "Welcome Back, Scholar"),
      desc: isRtl
        ? "بوابتك لمتابعة الدراسات والأبحاث الإسلامية والمقالات الفكرية الرصينة."
        : "Your portal to classical legal studies, Islamic thought, and contemporary discourse.",
    };
  };

  const headerInfo = getHeaderInfo();

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        onClick={() => onClose && onClose(null)}
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
            onClick={() => onClose && onClose(null)}
            className="absolute top-5 right-5 p-2 rounded-full text-[#78716C] hover:text-[#1C1917] dark:text-[#A39B8B] dark:hover:text-[#F5F1E8] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* Header Icon + Title */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#B88A2B]/15 dark:bg-[#C5A059]/20 text-[#B88A2B] dark:text-[#C5A059] flex items-center justify-center mx-auto mb-3">
              <Lock size={22} />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#1C1917] dark:text-[#F5F1E8]">
              {headerInfo.title}
            </h3>
            <p className="text-xs text-[#78716C] dark:text-[#A39B8B] mt-1.5 leading-relaxed">
              {headerInfo.desc}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex bg-[#FAF0D7]/60 dark:bg-[#262118] p-1 rounded-xl mb-5 border border-[#E5DCCB]/60 dark:border-[#2E2A24]">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                !isSignUp
                  ? "bg-white dark:bg-[#1A1714] text-[#B88A2B] dark:text-[#C5A059] shadow-xs"
                  : "text-[#78716C] dark:text-[#A39B8B] hover:text-[#1C1917]"
              }`}
            >
              {isRtl ? "تسجيل الدخول" : "Sign In"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                isSignUp
                  ? "bg-white dark:bg-[#1A1714] text-[#B88A2B] dark:text-[#C5A059] shadow-xs"
                  : "text-[#78716C] dark:text-[#A39B8B] hover:text-[#1C1917]"
              }`}
            >
              {isRtl ? "حساب جديد" : "Create Account"}
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-300 text-xs"
            >
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-[#57534E] dark:text-[#A39B8B] mb-1">
                  {isRtl ? "الاسم الكامل" : "Full Name"}
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                  <input
                    type="text"
                    required
                    placeholder={isRtl ? "د. أحمد المنصوري" : "Dr. Ahmad Mansoor"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-[#FBF9F6] dark:bg-[#0F0D0B] text-sm text-[#1C1917] dark:text-[#F5F1E8] focus:outline-none focus:border-[#B88A2B] dark:focus:border-[#C5A059] disabled:opacity-60"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#57534E] dark:text-[#A39B8B] mb-1">
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
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-[#FBF9F6] dark:bg-[#0F0D0B] text-sm text-[#1C1917] dark:text-[#F5F1E8] focus:outline-none focus:border-[#B88A2B] dark:focus:border-[#C5A059] disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#57534E] dark:text-[#A39B8B] mb-1">
                {isRtl ? "كلمة المرور" : "Password"}
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-[#FBF9F6] dark:bg-[#0F0D0B] text-sm text-[#1C1917] dark:text-[#F5F1E8] focus:outline-none focus:border-[#B88A2B] dark:focus:border-[#C5A059] disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#57534E] cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {isSignUp && (
                <p className="text-[10px] text-[#A8A29E] mt-1">
                  {isRtl ? "يجب أن تحتوي على 6 أحرف على الأقل" : "Must be at least 6 characters"}
                </p>
              )}
            </div>

            {/* REMEMBER ME CHECKBOX */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-[#E5DCCB] dark:border-[#2E2A24] text-[#B88A2B] dark:text-[#C5A059] focus:ring-[#B88A2B] cursor-pointer accent-[#B88A2B]"
                />
                <span className="text-xs text-[#78716C] dark:text-[#A39B8B] group-hover:text-[#1C1917] dark:group-hover:text-[#F5F1E8] transition-colors">
                  {isRtl ? "تذكر هذا الجهاز" : "Remember this device"}
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#B88A2B] to-[#C5A059] text-white font-bold text-sm shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{isRtl ? "جارٍ التحقق..." : "Please wait..."}</span>
                </>
              ) : (
                <>
                  <span>
                    {isSignUp
                      ? (isRtl ? "إنشاء حساب الآن" : "Create Account")
                      : (isRtl ? "تسجيل الدخول" : "Sign In")}
                  </span>
                  {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
