"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { submitQuestion, fetchSimilarQuestions } from "@/lib/api";
import { useDebounce } from "@/lib/useDebounce";
import { toast } from "sonner";
import {
  X,
  Send,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Lock,
  User,
  Mail,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Flame,
} from "lucide-react";

export default function AskScholarModal({
  isOpen = false,
  onClose = () => {},
  categories = [],
  onSubmitted = () => {},
}) {
  const { isRtl } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    categoryId: "",
    isAnonymous: false,
    guestName: "",
    guestEmail: "",
  });

  const [similarQuestions, setSimilarQuestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const debouncedTitle = useDebounce(formData.title, 400);

  // Set default category when categories load
  useEffect(() => {
    if (categories.length > 0 && !formData.categoryId) {
      setFormData((prev) => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories]);

  // Live Smart Similar Questions Matching
  useEffect(() => {
    let isCancelled = false;
    async function searchSimilar() {
      if (!debouncedTitle || debouncedTitle.trim().length < 4) {
        setSimilarQuestions([]);
        return;
      }
      try {
        const results = await fetchSimilarQuestions(debouncedTitle, 3);
        if (!isCancelled) {
          setSimilarQuestions(results || []);
        }
      } catch {
        // Silent fallback
      }
    }
    searchSimilar();
    return () => {
      isCancelled = true;
    };
  }, [debouncedTitle]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error(
        isRtl
          ? "يرجى كتابة عنوان السؤال ونص المسألة بالتفصيل"
          : "Please enter your question title and details"
      );
      return;
    }

    if (!formData.categoryId) {
      toast.error(
        isRtl ? "يرجى تحديد الباب أو القسم الفقهي" : "Please select a category"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await submitQuestion({
        titleEn: formData.title,
        titleAr: formData.title,
        contentEn: formData.content,
        contentAr: formData.content,
        categoryId: formData.categoryId,
        isAnonymous: formData.isAnonymous,
        guestName: isAuthenticated ? user?.name : formData.guestName,
        guestEmail: isAuthenticated ? user?.email : formData.guestEmail,
        userId: user?.id,
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success(
        isRtl
          ? "تم إرسال سؤالك إلى هيئة الفتوى بنجاح"
          : "Your question has been submitted for scholarly review"
      );
      onSubmitted();
    } catch (err) {
      setIsSubmitting(false);
      toast.error(err?.message || "Failed to submit question");
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setFormData({
      title: "",
      content: "",
      categoryId: categories[0]?.id || "",
      isAnonymous: false,
      guestName: "",
      guestEmail: "",
    });
    setSimilarQuestions([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#161412] border border-[#E5DCCB] dark:border-[#2E2A24] shadow-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#FAF0D7]/70 to-white dark:from-[#221D18] dark:to-[#161412] border-b border-[#E5DCCB] dark:border-[#2E2A24] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#B88A2B] text-white flex items-center justify-center shadow-md">
              <HelpCircle size={22} />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#1C1917] dark:text-[#F5F1E8]">
                {isRtl ? "طرح سؤال أو استشارة علمية" : "Ask a Scholarly Question"}
              </h2>
              <p className="text-xs text-[#78716C] dark:text-[#A39B8B]">
                {isRtl
                  ? "تُحال المسائل إلى العلماء والباحثين المتخصصين للتحكيم والإجابة"
                  : "Assigned directly to authorized scholars and faculty"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-2 rounded-xl bg-white dark:bg-[#1E1B18] border border-[#E5DCCB] dark:border-[#2E2A24] text-[#78716C] dark:text-[#A39B8B] hover:text-[#1C1917] dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-serif font-bold text-2xl text-[#1C1917] dark:text-[#F5F1E8]">
                  {isRtl ? "تم استلام سؤالك بنجاح" : "Question Received"}
                </h3>
                <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#C5BEB3] max-w-md mx-auto leading-relaxed">
                  {isRtl
                    ? "بارك الله فيك، تم إدراج سؤالك في جدول مراجعة الهيئة العلمية. ستتم مراجعة المسألة وصياغة الفتوى المعتمدة ونشرها بعد التحكيم."
                    : "Your inquiry has been submitted. Our scholars will review the matter and formulate the authoritative advisory with proper citations."}
                </p>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="px-6 py-2.5 rounded-xl bg-[#B88A2B] hover:bg-[#9E7422] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    {isRtl ? "تم / إغلاق النافذة" : "Done / Close Window"}
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Category Selection Chips */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-[#C5BEB3] mb-2.5">
                    {isRtl ? "اختر الباب أو التخصص الفقهي *" : "Select Topic / Category *"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => {
                      const isSelected = formData.categoryId === cat.id;
                      const name = isRtl
                        ? cat.nameAr || cat.nameEn
                        : cat.nameEn || cat.nameAr;

                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, categoryId: cat.id }))
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#B88A2B] text-white shadow-xs border border-[#B88A2B]"
                              : "bg-[#FBF9F6] dark:bg-[#1E1B18] text-[#78716C] dark:text-[#A39B8B] border border-[#E5DCCB] dark:border-[#2E2A24] hover:border-[#B88A2B]"
                          }`}
                        >
                          {name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title Input */}
                <div>
                  <label className="block text-xs font-bold text-[#1C1917] dark:text-[#F5F1E8] mb-2">
                    {isRtl ? "عنوان السؤال / المسألة *" : "Question Title / Summary *"}
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder={
                      isRtl
                        ? "مثال: حكم التعامل بالعقود الرقمية والذكاء الاصطناعي في المعاملات المالية"
                        : "e.g. Ruling on algorithmic trading and smart contracts in Islamic finance"
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#FBF9F6] dark:bg-[#1E1B18] border border-[#E5DCCB] dark:border-[#2E2A24] focus:border-[#B88A2B] dark:focus:border-[#C5A059] focus:outline-hidden text-sm text-[#1C1917] dark:text-[#F5F1E8] placeholder-[#A8A29E] transition-all"
                  />
                </div>

                {/* Live Smart Similar Suggestions Box */}
                {similarQuestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3.5 rounded-2xl bg-[#FAF0D7]/60 dark:bg-[#262118] border border-[#C5A059]/40 space-y-2"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#B88A2B] dark:text-[#D4AF37]">
                      <Sparkles size={14} />
                      <span>
                        {isRtl
                          ? "مسائل مشابهة تمت الإجابة عنها بالفعل (قد تجد إجابتك فوراً):"
                          : "Similar already-answered questions found:"}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {similarQuestions.map((q) => {
                        const simTitle = isRtl
                          ? q.titleAr || q.titleEn
                          : q.titleEn || q.titleAr;
                        return (
                          <Link
                            key={q.id}
                            href={`/qa/${q.slug}`}
                            target="_blank"
                            className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#161412] hover:bg-[#FAF0D7] text-xs font-medium text-[#1C1917] dark:text-[#F5F1E8] transition-colors"
                          >
                            <span className="truncate pr-2">{simTitle}</span>
                            <ExternalLink size={12} className="shrink-0 text-[#B88A2B]" />
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Detailed Content */}
                <div>
                  <label className="block text-xs font-bold text-[#1C1917] dark:text-[#F5F1E8] mb-2">
                    {isRtl ? "تفاصيل السؤال والظروف المحيطة به *" : "Detailed Context & Question *"}
                  </label>
                  <textarea
                    rows={4}
                    name="content"
                    required
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder={
                      isRtl
                        ? "اكتب تفاصيل المسألة والسياق بدقة حتى يتمكن العلماء من تقديم الفتوى الأنسب..."
                        : "Explain the circumstances, specific conditions, and question clearly for the reviewing scholars..."
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#FBF9F6] dark:bg-[#1E1B18] border border-[#E5DCCB] dark:border-[#2E2A24] focus:border-[#B88A2B] dark:focus:border-[#C5A059] focus:outline-hidden text-sm text-[#1C1917] dark:text-[#F5F1E8] placeholder-[#A8A29E] transition-all resize-none leading-relaxed"
                  />
                </div>

                {/* Guest Inputs if not logged in */}
                {!isAuthenticated && (
                  <div className="grid sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-[#1C1917] dark:text-[#F5F1E8] mb-1.5">
                        {isRtl ? "اسمك الكريم (اختياري)" : "Your Name (Optional)"}
                      </label>
                      <input
                        type="text"
                        name="guestName"
                        value={formData.guestName}
                        onChange={handleInputChange}
                        placeholder={isRtl ? "أدخل اسمك" : "Your name"}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F6] dark:bg-[#1E1B18] border border-[#E5DCCB] dark:border-[#2E2A24] text-xs text-[#1C1917] dark:text-[#F5F1E8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1C1917] dark:text-[#F5F1E8] mb-1.5">
                        {isRtl ? "البريد الإلكتروني للإشعار" : "Email for Notification"}
                      </label>
                      <input
                        type="email"
                        name="guestEmail"
                        value={formData.guestEmail}
                        onChange={handleInputChange}
                        placeholder="email@domain.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F6] dark:bg-[#1E1B18] border border-[#E5DCCB] dark:border-[#2E2A24] text-xs text-[#1C1917] dark:text-[#F5F1E8]"
                      />
                    </div>
                  </div>
                )}

                {/* Anonymous Toggle */}
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FBF9F6] dark:bg-[#1E1B18] border border-[#E5DCCB]/60 dark:border-[#2E2A24]/60">
                  <input
                    type="checkbox"
                    id="isAnonymous"
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded-md text-[#B88A2B] focus:ring-[#B88A2B] cursor-pointer"
                  />
                  <label htmlFor="isAnonymous" className="text-xs text-[#57534E] dark:text-[#C5BEB3] cursor-pointer">
                    <span className="font-bold text-[#1C1917] dark:text-[#F5F1E8]">
                      {isRtl ? "إخفاء اسمي عند نشر الفتوى" : "Publish Anonymously"}
                    </span>{" "}
                    — {isRtl ? "(لن يظهر اسمك للعامة حفاظاً على الخصوصية)" : "(Your name will not appear publicly)"}
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#B88A2B] via-[#C5A059] to-[#9E7422] hover:brightness-108 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{isRtl ? "جاري إرسال المسألة..." : "Submitting Question..."}</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} className={isRtl ? "rotate-180" : ""} />
                      <span>{isRtl ? "إرسال السؤال إلى هيئة الفتوى" : "Submit Question to Scholars"}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
