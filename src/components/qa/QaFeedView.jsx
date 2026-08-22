"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { fetchQuestions } from "@/lib/api";
import { useDebounce } from "@/lib/useDebounce";
import QaTopicFilterBar from "./QaTopicFilterBar";
import QaAnswerCard from "./QaAnswerCard";
import {
  Search,
  HelpCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Loader2,
  BookOpen,
} from "lucide-react";

export default function QaFeedView({
  initialQuestions = [],
  initialTotal = 0,
  categories = [],
  searchQuery = "",
  onAskClick = () => {},
}) {
  const { isRtl } = useLanguage();

  const [questions, setQuestions] = useState(initialQuestions);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("accordion");
  const [expandedId, setExpandedId] = useState(initialQuestions[0]?.id || null);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 350);

  // Re-fetch questions when filter, page, or search changes
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const res = await fetchQuestions({
          page,
          limit,
          category: selectedCategory === "ALL" ? undefined : selectedCategory,
          search: debouncedSearch,
          sort: sortBy,
        });

        if (isMounted && res) {
          setQuestions(res.items || []);
          setTotal(res.total || 0);
        }
      } catch (err) {
        console.warn("Failed to load questions:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [page, limit, selectedCategory, debouncedSearch, sortBy]);

  const totalPages = Math.ceil(total / limit) || 1;

  const handleToggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 md:py-16 space-y-8">
      {/* 1. FILTER CONTROLS BAR */}
      <QaTopicFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setPage(1);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={(sort) => {
          setSortBy(sort);
          setPage(1);
        }}
        totalCount={total}
      />

      {/* 2. MAIN FEED VIEW */}
      {isLoading ? (
        <div className="py-20 text-center text-[#78716C] dark:text-[#A39B8B] space-y-3">
          <Loader2 size={32} className="animate-spin mx-auto text-[#B88A2B]" />
          <p className="text-xs font-semibold">{isRtl ? "جاري تحميل الفتاوى والمسائل..." : "Loading advisories..."}</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-white dark:bg-[#161412] border border-[#E5DCCB] dark:border-[#2E2A24] p-8 space-y-4">
          <HelpCircle size={42} className="mx-auto text-[#B88A2B]/60" />
          <h3 className="font-serif font-bold text-xl text-[#1C1917] dark:text-[#F5F1E8]">
            {isRtl ? "لم يتم العثور على مسائل مطابقة" : "No Matching Advisories Found"}
          </h3>
          <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A39B8B] max-w-md mx-auto">
            {isRtl
              ? "لم نجد نتائج مطابقة لبحثك في هذا الباب. يمكنك طرح مسألتك على العلماء مباشرة ليتم تحكيمها والإجابة عنها."
              : "We could not find matching questions for your query. You can ask our scholars directly."}
          </p>
          <button
            type="button"
            onClick={onAskClick}
            className="px-6 py-2.5 rounded-2xl bg-[#B88A2B] hover:bg-[#9E7422] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            {isRtl ? "طرح هذه المسألة على العلماء" : "Ask This Question to Scholars"}
          </button>
        </div>
      ) : viewMode === "accordion" ? (
        <div className="space-y-4">
          {questions.map((q) => (
            <QaAnswerCard
              key={q.id}
              question={q}
              isAccordion={true}
              isExpanded={expandedId === q.id}
              onToggleExpand={() => handleToggleExpand(q.id)}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((q) => (
            <QaAnswerCard key={q.id} question={q} isAccordion={false} />
          ))}
        </div>
      )}

      {/* 3. NUMBERED PAGINATION */}
      {totalPages > 1 && (
        <div className="pt-8 border-t border-[#E5DCCB]/60 dark:border-[#2E2A24]/60 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-2.5 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-white dark:bg-[#161412] text-[#78716C] dark:text-[#A39B8B] disabled:opacity-40 cursor-pointer"
            aria-label="Previous page"
          >
            {isRtl ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                page === p
                  ? "bg-[#B88A2B] text-white shadow-md"
                  : "bg-white dark:bg-[#161412] border border-[#E5DCCB] dark:border-[#2E2A24] text-[#78716C] dark:text-[#A39B8B] hover:border-[#B88A2B]"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="p-2.5 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-white dark:bg-[#161412] text-[#78716C] dark:text-[#A39B8B] disabled:opacity-40 cursor-pointer"
            aria-label="Next page"
          >
            {isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}
