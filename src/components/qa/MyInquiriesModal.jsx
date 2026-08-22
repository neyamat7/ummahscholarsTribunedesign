"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { fetchUserQuestions } from "@/lib/api";
import { formatDynamicDate } from "@/lib/dateUtils";
import {
  X,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Calendar,
} from "lucide-react";

export default function MyInquiriesModal({
  isOpen = false,
  onClose = () => {},
}) {
  const { isRtl } = useLanguage();
  const { user } = useAuth();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user?.id) {
      setIsLoading(true);
      fetchUserQuestions(user.id)
        .then((res) => {
          setQuestions(res?.items || []);
        })
        .catch(() => {
          setQuestions([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, user?.id]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#161412] border border-[#E5DCCB] dark:border-[#2E2A24] shadow-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#FAF0D7]/70 to-white dark:from-[#221D18] dark:to-[#161412] border-b border-[#E5DCCB] dark:border-[#2E2A24] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#B88A2B] text-white flex items-center justify-center shadow-md">
              <UserCheck size={22} />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#1C1917] dark:text-[#F5F1E8]">
                {isRtl ? "متابعة أسئلتي واستشاراتي" : "My Inquiries Status"}
              </h2>
              <p className="text-xs text-[#78716C] dark:text-[#A39B8B]">
                {isRtl
                  ? "تتبع حالة المراجعة والإجابة على المسائل المقدمة"
                  : "Track the review and advisory progress of your submissions"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white dark:bg-[#1E1B18] border border-[#E5DCCB] dark:border-[#2E2A24] text-[#78716C] dark:text-[#A39B8B] hover:text-[#1C1917] dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* List Content */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-4">
          {isLoading ? (
            <div className="py-12 text-center text-[#78716C] dark:text-[#A39B8B]">
              <Loader2 size={28} className="animate-spin mx-auto mb-2 text-[#B88A2B]" />
              <p className="text-xs">{isRtl ? "جاري تحميل سجل الأسئلة..." : "Loading inquiries history..."}</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="py-12 text-center text-[#78716C] dark:text-[#A39B8B] space-y-3">
              <HelpCircle size={36} className="mx-auto text-[#B88A2B]/60" />
              <p className="text-sm font-semibold">
                {isRtl ? "لم تقم بتقديم أي أسئلة سابقة" : "You haven't submitted any questions yet"}
              </p>
              <p className="text-xs max-w-sm mx-auto">
                {isRtl
                  ? "يمكنك استخدام زر (اطرح سؤالك على العلماء) لتقديم مسألتك الفقهية أو الفكرية."
                  : "You can use the 'Ask a Scholar' button to submit an inquiry."}
              </p>
            </div>
          ) : (
            questions.map((q) => {
              const title = isRtl ? q.titleAr || q.titleEn : q.titleEn || q.titleAr;
              const date = formatDynamicDate(q.createdAt, isRtl);

              return (
                <div
                  key={q.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#FBF9F6] dark:bg-[#1E1B18] border border-[#E5DCCB]/80 dark:border-[#2E2A24] space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs text-[#78716C] dark:text-[#A39B8B] flex items-center gap-1">
                      <Calendar size={12} />
                      {date}
                    </span>

                    {/* Status Badge */}
                    {q.status === "ANSWERED" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                        <CheckCircle2 size={12} />
                        {isRtl ? "تمت الإجابة والنشر" : "Answered & Published"}
                      </span>
                    ) : q.status === "REJECTED" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-500/20">
                        <AlertCircle size={12} />
                        {isRtl ? "غير موافق للشروط" : "Declined"}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-500/20 animate-pulse">
                        <Clock size={12} />
                        {isRtl ? "قيد المراجعة والتحكيم" : "Under Scholarly Review"}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#1C1917] dark:text-[#F5F1E8]">
                    {title}
                  </h3>

                  {q.status === "ANSWERED" && (
                    <div className="pt-2 border-t border-[#E5DCCB]/60 dark:border-[#2E2A24]/60 flex items-center justify-end">
                      <Link
                        href={`/qa/${q.slug}`}
                        onClick={onClose}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#B88A2B] hover:underline"
                      >
                        <span>{isRtl ? "عرض الإجابة والفتوى" : "View Advisory"}</span>
                        <ArrowIcon size={12} />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}
