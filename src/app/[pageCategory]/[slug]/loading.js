import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PostLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F6] dark:bg-[#0F0D0B] animate-pulse">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 w-full">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-48 bg-[#E5DCCB]/60 dark:bg-[#2E2A24]/60 rounded-md mb-6" />

        {/* Category Badge Skeleton */}
        <div className="h-6 w-32 bg-[#E5DCCB] dark:bg-[#2E2A24] rounded-full mb-4" />

        {/* Title Skeleton */}
        <div className="space-y-3 mb-6">
          <div className="h-10 sm:h-12 w-full max-w-3xl bg-[#E5DCCB] dark:bg-[#2E2A24] rounded-xl" />
          <div className="h-10 sm:h-12 w-2/3 bg-[#E5DCCB] dark:bg-[#2E2A24] rounded-xl" />
        </div>

        {/* Meta Strip Skeleton */}
        <div className="flex items-center gap-4 py-4 border-y border-[#E5DCCB]/60 dark:border-[#2E2A24]/60 mb-8">
          <div className="w-8 h-8 rounded-full bg-[#E5DCCB] dark:bg-[#2E2A24]" />
          <div className="h-4 w-32 bg-[#E5DCCB] dark:bg-[#2E2A24] rounded-md" />
          <div className="h-4 w-24 bg-[#E5DCCB] dark:bg-[#2E2A24] rounded-md" />
          <div className="h-4 w-20 bg-[#E5DCCB] dark:bg-[#2E2A24] rounded-md ms-auto" />
        </div>

        {/* Featured Bleed Image Skeleton */}
        <div className="w-full aspect-[16/9] sm:aspect-[21/9] rounded-3xl bg-[#E5DCCB] dark:bg-[#2E2A24] mb-12" />

        {/* Reading Column & Rail Skeleton */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-12">
          {/* Action Rail Placeholder */}
          <div className="hidden lg:flex flex-col gap-4 w-14 py-4 items-center bg-[#E5DCCB]/40 dark:bg-[#2E2A24]/40 rounded-2xl h-48" />

          {/* Prose lines */}
          <div className="w-full max-w-[720px] mx-auto space-y-4">
            <div className="h-4 w-full bg-[#E5DCCB]/70 dark:bg-[#2E2A24]/70 rounded-md" />
            <div className="h-4 w-11/12 bg-[#E5DCCB]/70 dark:bg-[#2E2A24]/70 rounded-md" />
            <div className="h-4 w-full bg-[#E5DCCB]/70 dark:bg-[#2E2A24]/70 rounded-md" />
            <div className="h-4 w-4/5 bg-[#E5DCCB]/70 dark:bg-[#2E2A24]/70 rounded-md" />

            <div className="h-8 w-1/2 bg-[#E5DCCB] dark:bg-[#2E2A24] rounded-xl mt-8 mb-4" />
            <div className="h-4 w-full bg-[#E5DCCB]/70 dark:bg-[#2E2A24]/70 rounded-md" />
            <div className="h-4 w-full bg-[#E5DCCB]/70 dark:bg-[#2E2A24]/70 rounded-md" />
            <div className="h-4 w-3/4 bg-[#E5DCCB]/70 dark:bg-[#2E2A24]/70 rounded-md" />

            <div className="h-28 w-full bg-[#E5DCCB]/50 dark:bg-[#2E2A24]/50 rounded-2xl my-6" />

            <div className="h-4 w-full bg-[#E5DCCB]/70 dark:bg-[#2E2A24]/70 rounded-md" />
            <div className="h-4 w-5/6 bg-[#E5DCCB]/70 dark:bg-[#2E2A24]/70 rounded-md" />
          </div>

          {/* TOC Placeholder */}
          <div className="hidden xl:block w-64 h-64 bg-[#E5DCCB]/40 dark:bg-[#2E2A24]/40 rounded-2xl" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
