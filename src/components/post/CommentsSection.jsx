"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { MessageSquare, Send, Reply, User, Mail, CheckCircle2, Clock, CornerDownRight, CornerDownLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createPostComment } from "@/lib/api";

export default function CommentsSection({ postId, initialComments = [] }) {
  const { isRtl } = useLanguage();
  const [comments, setComments] = useState(initialComments);
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" | "oldest"
  const [replyingToId, setReplyingToId] = useState(null);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Reply form state
  const [replyContent, setReplyContent] = useState("");
  const [replyName, setReplyName] = useState("");
  const [replyEmail, setReplyEmail] = useState("");
  const [isReplyingSubmitting, setIsReplyingSubmitting] = useState(false);

  // Thread comments: Top-level vs replies
  const { topLevelComments, repliesMap } = useMemo(() => {
    const topLevel = [];
    const replies = {};

    comments.forEach((c) => {
      if (c.parentId) {
        if (!replies[c.parentId]) replies[c.parentId] = [];
        replies[c.parentId].push(c);
      } else {
        topLevel.push(c);
      }
    });

    // Sort top level comments
    topLevel.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return { topLevelComments: topLevel, repliesMap: replies };
  }, [comments, sortOrder]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await createPostComment({
        postId,
        content: content.trim(),
        authorName: name.trim() || (isRtl ? "باحث زائر" : "Guest Scholar"),
        authorEmail: email.trim() || undefined,
      });

      // Optimistically add to list with PENDING badge
      const newComment = res?.data || {
        id: "temp-" + Date.now(),
        content: content.trim(),
        authorName: name.trim() || (isRtl ? "باحث زائر" : "Guest Scholar"),
        createdAt: new Date().toISOString(),
        status: "PENDING",
        author: {
          name: name.trim() || (isRtl ? "باحث زائر" : "Guest Scholar"),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || "guest"}`,
        },
      };

      setComments((prev) => [newComment, ...prev]);
      setContent("");
      setSuccessMessage(
        isRtl
          ? "شكراً لمشاركتك! تم إرسال تعليقك وهو بانتظار المراجعة قبل نشره."
          : "Thank you! Your comment has been submitted and is awaiting moderation before public display."
      );
      setTimeout(() => setSuccessMessage(""), 7000);
    } catch (err) {
      console.error("Comment submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (parentId) => {
    if (!replyContent.trim()) return;

    setIsReplyingSubmitting(true);
    try {
      const res = await createPostComment({
        postId,
        parentId,
        content: replyContent.trim(),
        authorName: replyName.trim() || (isRtl ? "باحث زائر" : "Guest Scholar"),
        authorEmail: replyEmail.trim() || undefined,
      });

      const newReply = res?.data || {
        id: "temp-reply-" + Date.now(),
        parentId,
        content: replyContent.trim(),
        authorName: replyName.trim() || (isRtl ? "باحث زائر" : "Guest Scholar"),
        createdAt: new Date().toISOString(),
        status: "PENDING",
        author: {
          name: replyName.trim() || (isRtl ? "باحث زائر" : "Guest Scholar"),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${replyName || "guest"}`,
        },
      };

      setComments((prev) => [...prev, newReply]);
      setReplyContent("");
      setReplyingToId(null);
      setSuccessMessage(
        isRtl
          ? "تم إرسال ردك وهو قيد المراجعة."
          : "Your reply has been submitted for moderation."
      );
      setTimeout(() => setSuccessMessage(""), 6000);
    } catch (err) {
      console.error("Reply submission failed:", err);
    } finally {
      setIsReplyingSubmitting(false);
    }
  };

  const CornerIcon = isRtl ? CornerDownLeft : CornerDownRight;

  return (
    <section id="comments-section" className="my-14 pt-10 border-t border-[#E5DCCB] dark:border-[#2E2A24]">
      {/* Header with Count and Sort */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#B88A2B]/15 dark:bg-[#C5A059]/20 text-[#B88A2B] dark:text-[#C5A059] flex items-center justify-center">
            <MessageSquare size={18} />
          </div>
          <h2 className="font-serif font-bold text-2xl text-[#1C1917] dark:text-[#F5F1E8]">
            {isRtl ? "التعليقات والمناقشات العلمية" : "Scholarly Discussions"}
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF0D7] dark:bg-[#262118] text-[#B88A2B] dark:text-[#C5A059] border border-[#E5DCCB] dark:border-[#2E2A24]">
            {comments.length}
          </span>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 text-xs text-[#78716C] dark:text-[#A39B8B] bg-[#FAF0D7]/50 dark:bg-[#1A1714] border border-[#E5DCCB] dark:border-[#2E2A24] p-1 rounded-xl">
          <button
            onClick={() => setSortOrder("newest")}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              sortOrder === "newest"
                ? "bg-white dark:bg-[#262118] text-[#1C1917] dark:text-[#F5F1E8] shadow-2xs font-bold"
                : "hover:text-[#1C1917] dark:hover:text-[#F5F1E8]"
            }`}
          >
            {isRtl ? "الأحدث" : "Newest"}
          </button>
          <button
            onClick={() => setSortOrder("oldest")}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              sortOrder === "oldest"
                ? "bg-white dark:bg-[#262118] text-[#1C1917] dark:text-[#F5F1E8] shadow-2xs font-bold"
                : "hover:text-[#1C1917] dark:hover:text-[#F5F1E8]"
            }`}
          >
            {isRtl ? "الأقدم" : "Oldest"}
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm flex items-center gap-3">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Comment Form */}
      <form
        onSubmit={handleSubmitComment}
        className="mb-10 p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1A1714] border border-[#E5DCCB] dark:border-[#2E2A24] shadow-xs"
      >
        <h3 className="font-serif font-bold text-base sm:text-lg text-[#1C1917] dark:text-[#F5F1E8] mb-4">
          {isRtl ? "أضف تعليقك أو استفسارك العلمي" : "Leave a Scholarly Comment"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
            <input
              type="text"
              placeholder={isRtl ? "اسم الباحث الكريم" : "Your Name / Title"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-[#FBF9F6] dark:bg-[#0F0D0B] text-xs sm:text-sm text-[#1C1917] dark:text-[#F5F1E8] focus:outline-none focus:border-[#B88A2B] dark:focus:border-[#C5A059]"
            />
          </div>

          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
            <input
              type="email"
              placeholder={isRtl ? "البريد الإلكتروني (لن ينشر)" : "Email address (will not be published)"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-[#FBF9F6] dark:bg-[#0F0D0B] text-xs sm:text-sm text-[#1C1917] dark:text-[#F5F1E8] focus:outline-none focus:border-[#B88A2B] dark:focus:border-[#C5A059]"
            />
          </div>
        </div>

        <textarea
          required
          rows={4}
          placeholder={isRtl ? "اكتب تعليقك أو إضافتك العلمية هنا..." : "Write your thoughts, references, or inquiries here..."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-4 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-[#FBF9F6] dark:bg-[#0F0D0B] text-xs sm:text-sm text-[#1C1917] dark:text-[#F5F1E8] focus:outline-none focus:border-[#B88A2B] dark:focus:border-[#C5A059] leading-relaxed resize-y mb-4"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B88A2B] to-[#C5A059] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Send size={14} className={isRtl ? "rotate-180" : ""} />
            <span>{isSubmitting ? (isRtl ? "جاري الإرسال..." : "Submitting...") : (isRtl ? "نشر التعليق" : "Submit Comment")}</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {topLevelComments.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-3xl bg-[#FAF0D7]/30 dark:bg-[#1A1714]/40 border border-dashed border-[#E5DCCB] dark:border-[#2E2A24]">
            <MessageSquare size={32} className="mx-auto text-[#B88A2B]/60 dark:text-[#C5A059]/60 mb-3" />
            <h4 className="font-serif font-bold text-base text-[#1C1917] dark:text-[#F5F1E8]">
              {isRtl ? "كن أول من يبدأ الحوار العلمي" : "Be the first to share a scholarly reflection"}
            </h4>
            <p className="text-xs text-[#78716C] dark:text-[#A39B8B] mt-1">
              {isRtl ? "شارك برأيك أو استفسارك حول موضوع هذا البحث." : "Engage with the arguments and perspectives presented in this article."}
            </p>
          </div>
        ) : (
          topLevelComments.map((comment) => {
            const replies = repliesMap[comment.id] || [];
            const authorName = comment.author?.name || comment.authorName || (isRtl ? "باحث زائر" : "Guest Scholar");
            const avatar = comment.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`;
            const dateStr = new Date(comment.createdAt).toLocaleDateString(isRtl ? "ar-SA" : "en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={comment.id}
                className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1A1714] border border-[#E5DCCB] dark:border-[#2E2A24] shadow-2xs"
              >
                {/* Author row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#B88A2B]/30 dark:border-[#C5A059]/30 bg-[#FAF0D7] dark:bg-[#262118] shrink-0">
                      <Image src={avatar} alt={authorName} fill className="object-cover" sizes="36px" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-[#1C1917] dark:text-[#F5F1E8]">
                        {authorName}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#A8A29E] dark:text-[#78716C]">
                        <Clock size={11} />
                        <span>{dateStr}</span>
                        {comment.status === "PENDING" && (
                          <span className="ms-1.5 px-2 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                            {isRtl ? "قيد المراجعة" : "Pending Review"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Reply trigger */}
                  <button
                    onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#B88A2B] dark:text-[#C5A059] hover:underline cursor-pointer"
                  >
                    <Reply size={13} className={isRtl ? "rotate-180" : ""} />
                    <span>{isRtl ? "رد" : "Reply"}</span>
                  </button>
                </div>

                {/* Comment Content */}
                <p className="text-xs sm:text-sm text-[#292524] dark:text-[#E7E2D8] leading-relaxed font-sans ps-12">
                  {comment.content}
                </p>

                {/* Inline Reply Form */}
                {replyingToId === comment.id && (
                  <div className="mt-4 pt-4 ps-12 border-t border-[#E5DCCB]/60 dark:border-[#2E2A24]/60">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2.5">
                      <input
                        type="text"
                        placeholder={isRtl ? "اسمك الكريم" : "Your Name"}
                        value={replyName}
                        onChange={(e) => setReplyName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-[#FBF9F6] dark:bg-[#0F0D0B] text-xs text-[#1C1917] dark:text-[#F5F1E8] focus:outline-none focus:border-[#B88A2B]"
                      />
                      <input
                        type="email"
                        placeholder={isRtl ? "البريد الإلكتروني" : "Email"}
                        value={replyEmail}
                        onChange={(e) => setReplyEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-[#FBF9F6] dark:bg-[#0F0D0B] text-xs text-[#1C1917] dark:text-[#F5F1E8] focus:outline-none focus:border-[#B88A2B]"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder={isRtl ? `اكتب ردك على ${authorName}...` : `Write your reply to ${authorName}...`}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-[#FBF9F6] dark:bg-[#0F0D0B] text-xs text-[#1C1917] dark:text-[#F5F1E8] focus:outline-none focus:border-[#B88A2B] resize-y mb-2"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setReplyingToId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs text-[#78716C] hover:text-[#1C1917] dark:hover:text-[#F5F1E8] cursor-pointer"
                      >
                        {isRtl ? "إلغاء" : "Cancel"}
                      </button>
                      <button
                        type="button"
                        disabled={isReplyingSubmitting || !replyContent.trim()}
                        onClick={() => handleReplySubmit(comment.id)}
                        className="px-4 py-1.5 rounded-lg bg-[#B88A2B] text-white text-xs font-bold hover:brightness-105 disabled:opacity-50 cursor-pointer"
                      >
                        {isReplyingSubmitting ? (isRtl ? "إرسال..." : "Sending...") : (isRtl ? "إرسال الرد" : "Post Reply")}
                      </button>
                    </div>
                  </div>
                )}

                {/* Nested Replies */}
                {replies.length > 0 && (
                  <div className="mt-4 pt-4 ps-6 sm:ps-12 space-y-3.5 border-t border-[#E5DCCB]/60 dark:border-[#2E2A24]/60">
                    {replies.map((reply) => {
                      const replyAuthor = reply.author?.name || reply.authorName || (isRtl ? "باحث زائر" : "Guest Scholar");
                      const replyAvatar = reply.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${replyAuthor}`;
                      const replyDate = new Date(reply.createdAt).toLocaleDateString(isRtl ? "ar-SA" : "en-US", {
                        month: "short",
                        day: "numeric",
                      });

                      return (
                        <div
                          key={reply.id}
                          className="relative p-4 rounded-2xl bg-[#FAF0D7]/40 dark:bg-[#262118]/60 border border-[#E5DCCB]/80 dark:border-[#2E2A24]/80 flex items-start gap-3"
                        >
                          <CornerIcon size={14} className="text-[#B88A2B] dark:text-[#C5A059] shrink-0 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-xs text-[#1C1917] dark:text-[#F5F1E8]">
                                {replyAuthor}
                              </span>
                              <span className="text-[10px] text-[#A8A29E] dark:text-[#78716C]">
                                {replyDate}
                              </span>
                            </div>
                            <p className="text-xs text-[#292524] dark:text-[#E7E2D8] leading-relaxed font-sans">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
