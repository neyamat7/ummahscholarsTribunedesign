"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import ReadingProgressBar from "./ReadingProgressBar";
import Breadcrumbs from "./Breadcrumbs";
import ArticleHeader from "./ArticleHeader";
import ArticleBody from "./ArticleBody";
import TableOfContents from "./TableOfContents";
import StickyActionRail from "./StickyActionRail";
import TagsList from "./TagsList";
import CommentsSection from "./CommentsSection";
import RelatedPosts from "./RelatedPosts";
import AuthorBioModal from "@/components/author/AuthorBioModal";
import BackToTopButton from "@/components/common/BackToTopButton";
import { recordPostView } from "@/lib/api";
import { extractHeadings } from "@/lib/toc";
import { useLanguage } from "@/context/LanguageContext";

export default function PostDetailClient({
  post,
  pageCategorySlug,
  initialComments = [],
  relatedPosts = [],
}) {
  const articleRef = useRef(null);
  const { isRtl } = useLanguage();
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);

  const activeContent = isRtl ? post.contentAr || post.contentEn || "" : post.contentEn || post.contentAr || "";
  const initialHeadings = useMemo(() => extractHeadings(activeContent), [activeContent]);

  const [headings, setHeadings] = useState(initialHeadings);
  const [activeHeadingId, setActiveHeadingId] = useState("");

  useEffect(() => {
    setHeadings(extractHeadings(activeContent));
  }, [activeContent]);

  // Record view on mount
  useEffect(() => {
    if (post?.id) {
      recordPostView(post.id);
    }
  }, [post?.id]);

  const postTitle = isRtl
    ? post.titleAr || post.titleEn || post.title
    : post.titleEn || post.titleAr || post.title;

  const categoryName = isRtl
    ? post.category?.nameAr || post.pageCategory?.nameAr || "بحوث ودراسات"
    : post.category?.nameEn || post.pageCategory?.nameEn || "Research & Studies";

  return (
    <div ref={articleRef} className="relative min-h-screen bg-[#FBF9F6] dark:bg-[#0F0D0B] text-[#1A1714] dark:text-[#F5F1E8]">
      {/* Top Fixed Reading Progress Bar */}
      <ReadingProgressBar targetRef={articleRef} />

      {/* Viewport-Fixed Left Edge Action Rail (Outside content on the far left edge of the screen) */}
      <StickyActionRail
        post={post}
        initialLikes={post._count?.likes || 0}
        initialBookmarks={post._count?.bookmarks || 0}
      />

      {/* Main Content Area: Synchronized to max-w-7xl to align perfectly with Navbar logo */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20">
        {/* Breadcrumb Navigation (Aligned with Navbar logo) */}
        <Breadcrumbs
          category={post.category || post.pageCategory}
          postTitle={postTitle}
          pageCategorySlug={pageCategorySlug}
        />

        {/* Article Header (Badge, Title, Meta, Bleed Image) */}
        <ArticleHeader
          post={post}
          onAuthorClick={() => setIsAuthorModalOpen(true)}
        />

        {/* Main Content Layout with 2-column balance (Expansive Reading Column + Right TOC) */}
        <div className="relative flex flex-col xl:flex-row items-start justify-between gap-8 xl:gap-12 mt-10">
          {/* Central Expansive Reading Column (820px max width for immersive reading) */}
          <div className="flex-1 max-w-[820px] w-full min-w-0 mx-auto xl:mx-0">
            {/* Mobile / Tablet Collapsible TOC (Hidden on desktop) */}
            <TableOfContents
              headings={headings}
              activeId={activeHeadingId}
              variant="mobile"
            />

            {/* Article Prose & Rich Blocks */}
            <ArticleBody
              post={post}
              onHeadingsFound={setHeadings}
              onActiveHeadingChange={setActiveHeadingId}
            />

            {/* Topic Tags */}
            <TagsList tags={post.tags} />

            {/* Discussions & Threaded Comments */}
            <CommentsSection
              postId={post.id}
              initialComments={initialComments}
            />
          </div>

          {/* Right Column: Desktop Sticky Table of Contents Sidebar */}
          {headings.length >= 3 && (
            <div className="hidden xl:block w-72 shrink-0 sticky top-32">
              <TableOfContents
                headings={headings}
                activeId={activeHeadingId}
                variant="desktop"
              />
            </div>
          )}
        </div>

        {/* Recommended / Related Posts from the Same Category */}
        <RelatedPosts
          posts={relatedPosts}
          categoryName={categoryName}
          pageCategorySlug={pageCategorySlug}
        />
      </main>

      {/* Scholar Bio Modal */}
      <AuthorBioModal
        isOpen={isAuthorModalOpen}
        onClose={() => setIsAuthorModalOpen(false)}
        author={post.author}
      />

      {/* Smooth Floating Scroll-to-Top Button */}
      <BackToTopButton />
    </div>
  );
}
