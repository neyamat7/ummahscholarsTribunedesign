"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QaHeroBanner from "@/components/qa/QaHeroBanner";
import QaFeedView from "@/components/qa/QaFeedView";
import AskScholarModal from "@/components/qa/AskScholarModal";
import MyInquiriesModal from "@/components/qa/MyInquiriesModal";
import { fetchQuestions, fetchCategories } from "@/lib/api";

export default function QuestionsAndAnswersPage() {
  const [initialData, setInitialData] = useState({ items: [], total: 0 });
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [isMyInquiriesOpen, setIsMyInquiriesOpen] = useState(false);

  useEffect(() => {
    // Initial fetch
    Promise.all([
      fetchQuestions({ page: 1, limit: 10 }),
      fetchCategories(),
    ]).then(([qRes, catRes]) => {
      if (qRes) setInitialData(qRes);
      if (Array.isArray(catRes)) setCategories(catRes);
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#FBF9F6] dark:bg-[#0F0D0B] text-[#1C1917] dark:text-[#F5F1E8] transition-colors selection:bg-[#B88A2B]/20 selection:text-[#B88A2B]">
      <Navbar />

      {/* 1. HERO BANNER */}
      <QaHeroBanner
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAskClick={() => setIsAskModalOpen(true)}
        onMyQuestionsClick={() => setIsMyInquiriesOpen(true)}
        totalAnswered={initialData.total}
      />

      {/* 2. MAIN INTERACTIVE FEED */}
      <QaFeedView
        initialQuestions={initialData.items}
        initialTotal={initialData.total}
        categories={categories}
        searchQuery={searchQuery}
        onAskClick={() => setIsAskModalOpen(true)}
      />

      {/* 3. MODALS */}
      <AskScholarModal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        categories={categories}
        onSubmitted={() => {
          fetchQuestions({ page: 1, limit: 10 }).then((res) => {
            if (res) setInitialData(res);
          });
        }}
      />

      <MyInquiriesModal
        isOpen={isMyInquiriesOpen}
        onClose={() => setIsMyInquiriesOpen(false)}
      />

      <Footer />
    </main>
  );
}
