"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { MessageSquare, Send, Reply, User, Mail, CheckCircle2, Clock, CornerDownRight, CornerDownLeft, Award } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { createPostComment } from "@/lib/api";

export default function CommentsSection({ postId, initialComments = [] }) {
  const { isRtl } = useLanguage();
  const { user } = useAuth();

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

  // Load and sync local pending comments for this post on mount or when initialComments update
  useEffect(() => {
    try {
      const storageKey = `scholar_pending_comments_${postId}`;
      const stored = localStorage.getItem(storageKey);
      if (!stored) {
        setComments(initialComments);
        return;
      }

      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        setComments(initialComments);
        return;
      }

      // Filter out any pending comments that have now been approved and included in initialComments
      const remainingPending = parsed.filter(
        (pending) =>
          !initialComments.some(
            (c) => c.id === pending.id || (c.content === pending.content && c.authorName === pending.authorName)
          )
      );

      // Keep storage clean
      localStorage.setItem(storageKey, JSON.stringify(remainingPending));

      // Merge remaining pending comments with initialComments
      const initialIds = new Set(initialComments.map((c) => c.id));
      const pendingToAdd = remainingPending.filter((p) => !initialIds.has(p.id));
      setComments([...pendingToAdd, ...initialComments]);
    } catch (e) {
      console.error("Failed to load local pending comments:", e);
      setComments(initialComments);
    }
  }, [postId, initialComments]);

  // Helper to persist pending comments in localStorage
  const persistPendingComment = (newPendingComment) => {
    try {
      const storageKey = `scholar_pending_comments_${postId}`;
      const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const updated = [newPendingComment, ...existing.filter((c) => c.id !== newPendingComment.id)];
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {}
  };

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
      const authorName = user ? user.name : name.trim() || (isRtl ? "باحث زائر" : "Guest Scholar");
      const authorEmail = user ? user.email : email.trim() || undefined;
      const userId = user ? user.id : undefined;

      const res = await createPostComment({
        postId,
        content: content.trim(),
        authorName,
        authorEmail,
        userId,
      });

      // Optimistically create comment with PENDING badge
      const newComment = res?.data || {
        id: "temp-" + Date.now(),
        content: content.trim(),
        authorName,
        createdAt: new Date().toISOString(),
        status: "PENDING",
        author: {
          name: authorName,
          avatar: user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authorName)}`,
        },
      };

      // Persist in localStorage so it remains visible after refresh
      persistPendingComment(newComment);

      setComments((prev) => [newComment, ...prev]);
      setContent("");
      if (!user) {
        setName("");
        setEmail("");
      }
      setSuccessMessage(
        isRtl
          ? "شكراً لمشاركتك! تم إرسال تعليقك وهو بانتظار المراجعة قبل نشره للعامة."
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
      const authorName = user ? user.name : replyName.trim() || (isRtl ? "باحث زائر" : "Guest Scholar");
      const authorEmail = user ? user.email : replyEmail.trim() || undefined;
      const userId = user ? user.id : undefined;

      const res = await createPostComment({
        postId,
        parentId,
        content: replyContent.trim(),
        authorName,
        authorEmail,
        userId,
      });

      const newReply = res?.data || {
        id: "temp-reply-" + Date.now(),
        parentId,
        content: replyContent.trim(),
        authorName,
        createdAt: new Date().toISOString(),
        status: "PENDING",
        author: {
          name: authorName,
          avatar: user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authorName)}`,
        },
      };

      // Persist in localStorage so it remains visible after refresh
      persistPendingComment(newReply);

      setComments((prev) => [...prev, newReply]);
      setReplyContent("");
      setReplyingToId(null);
      setSuccessMessage(
        isRtl
          ? "تم إرسال ردك وهو قيد المراجعة حالياً."
          : "Your reply has been submitted and is pending moderation."
      );
      setTimeout(() => setSuccessMessage(""), 7000);
    } catch (err) {
      console.error("Reply submission failed:", err);
    } finally {
      setIsReplyingSubmitting(false);
    }
  };

  return (
    <section id="comments" className="pt-12 border-t border-[#E5DCCB] dark:border-[#2E2A24]">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FAF0D7] dark:bg-[#262118] text-[#B88A2B] dark:text-[#C5A059] flex items-center justify-center shadow-xs">
            <MessageSquare size={20} />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#1C1917] dark:text-[#F5F1E8]">
              {isRtl ? "النقاشات والتعليقات العلمية" : "Scholarly Discussions"}
            </h2>
            <p className="text-xs text-[#78716C] dark:text-[#A39B8B]">
              {isRtl
                ? `${comments.length} تعليق ومداخلة`
                : `${comments.length} ${comments.length === 1 ? "contribution" : "contributions"}`}
            </p>
          </div>
        </div>

        {/* Sort Filter */}
        {comments.length > 1 && (
          <div className="flex items-center gap-1.5 self-end sm:self-auto bg-white dark:bg-[#1A1714] border border-[#E5DCCB] dark:border-[#2E2A24] p-1 rounded-xl shadow-2xs">
            <button
              onClick={() => setSortOrder("newest")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                sortOrder === "newest"
                  ? "bg-[#FAF0D7] dark:bg-[#262118] text-[#B88A2B] dark:text-[#C5A059]"
                  : "text-[#78716C] dark:text-[#A39B8B] hover:text-[#1C1917] dark:hover:text-[#F5F1E8]"
              }`}
            >
              {isRtl ? "الأحدث" : "Newest"}
            </button>
            <button
              onClick={() => setSortOrder("oldest")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                sortOrder === "oldest"
                  ? "bg-[#FAF0D7] dark:bg-[#262118] text-[#B88A2B] dark:text-[#C5A059]"
                  : "text-[#78716C] dark:text-[#A39B8B] hover:text-[#1C1917] dark:hover:text-[#F5F1E8]"
              }`}
            >
              {isRtl ? "الأقدم" : "Oldest"}
            </button>
          </div>
        )}
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
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

        {/* User Identity or Guest Form Inputs */}
        {user ? (
          <div className="flex items-center gap-3 p-3 mb-4 rounded-2xl bg-[#FAF0D7]/40 dark:bg-[#262118]/60 border border-[#E5DCCB]/60 dark:border-[#2E2A24]">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#B88A2B]/40 shrink-0">
              <Image
                src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || user.email)}`}
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#1C1917] dark:text-[#F5F1E8] truncate">
                {isRtl ? `المشاركة باسم: ${user.name}` : `Posting as ${user.name}`}
              </p>
              <p className="text-[11px] text-[#78716C] dark:text-[#A39B8B] truncate">
                {user.email}
              </p>
            </div>
          </div>
        ) : (
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
        )}

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
            const avatar = comment.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authorName)}`;
            const dateStr = new Date(comment.createdAt).toLocaleDateString(isRtl ? "ar-SA" : "en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={comment.id}
                id={`comment-${comment.id}`}
                className="p-6 rounded-3xl bg-white dark:bg-[#1A1714] border border-[#E5DCCB] dark:border-[#2E2A24] shadow-xs"
              >
                {/* Author Info Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-[#E5DCCB] dark:border-[#2E2A24] shrink-0">
                      <Image src={avatar} alt={authorName} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif font-bold text-sm text-[#1C1917] dark:text-[#F5F1E8]">
                          {authorName}
                        </h4>
                        {(comment.author?.role === "VERIFIED_SCHOLAR" || comment.user?.role === "VERIFIED_SCHOLAR") && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF0D7] text-[#B88A2B] dark:bg-[#262118] dark:text-[#C5A059] border border-[#E5DCCB] dark:border-[#3E3A36] shrink-0">
                            <CheckCircle2 size={10} className="text-[#B88A2B] dark:text-[#C5A059]" />
                            <span>{isRtl ? "عالم معتمد" : "Verified Scholar"}</span>
                          </span>
                        )}
                        {(comment.author?.role === "ACADEMIC" || comment.user?.role === "ACADEMIC") && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 shrink-0">
                            <span>{isRtl ? "باحث أكاديمي" : "Academic"}</span>
                          </span>
                        )}
                        {(comment.author?.role === "CONTRIBUTOR" || comment.user?.role === "CONTRIBUTOR") && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50 shrink-0">
                            <span>{isRtl ? "مساهم" : "Contributor"}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#78716C] dark:text-[#A39B8B] mt-0.5">
                        {dateStr}
                      </p>
                    </div>
                  </div>

                  {comment.status === "PENDING" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
                      <Clock size={11} />
                      <span>{isRtl ? "قيد المراجعة" : "Pending Moderation"}</span>
                    </span>
                  )}
                </div>

                {/* Comment Content */}
                <div className="text-xs sm:text-sm text-[#3E3A36] dark:text-[#D1CBC1] leading-relaxed mb-4 whitespace-pre-line">
                  {comment.content}
                </div>

                {/* Reply Trigger */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B88A2B] dark:text-[#C5A059] hover:underline cursor-pointer"
                  >
                    <Reply size={13} className={isRtl ? "rotate-180" : ""} />
                    <span>{replyingToId === comment.id ? (isRtl ? "إلغاء الرد" : "Cancel") : (isRtl ? "رد" : "Reply")}</span>
                  </button>
                </div>

                {/* Nested Reply Form */}
                {replyingToId === comment.id && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleReplySubmit(comment.id);
                    }}
                    className="mt-4 p-4 rounded-2xl bg-[#FAF0D7]/30 dark:bg-[#262118]/40 border border-[#E5DCCB] dark:border-[#2E2A24]"
                  >
                    {!user && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <input
                          type="text"
                          placeholder={isRtl ? "اسمك الكريم" : "Your Name"}
                          value={replyName}
                          onChange={(e) => setReplyName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-white dark:bg-[#0F0D0B] text-xs text-[#1C1917] dark:text-[#F5F1E8] focus:outline-none focus:border-[#B88A2B]"
                        />
                        <input
                          type="email"
                          placeholder={isRtl ? "البريد الإلكتروني" : "Your Email"}
                          value={replyEmail}
                          onChange={(e) => setReplyEmail(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-white dark:bg-[#0F0D0B] text-xs text-[#1C1917] dark:text-[#F5F1E8] focus:outline-none focus:border-[#B88A2B]"
                        />
                      </div>
                    )}
                    <textarea
                      required
                      rows={2}
                      placeholder={isRtl ? "اكتب ردك هنا..." : "Write your response..."}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-white dark:bg-[#0F0D0B] text-xs text-[#1C1917] dark:text-[#F5F1E8] focus:outline-none focus:border-[#B88A2B] resize-y mb-3"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setReplyingToId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs text-[#78716C] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                      >
                        {isRtl ? "إلغاء" : "Cancel"}
                      </button>
                      <button
                        type="submit"
                        disabled={isReplyingSubmitting || !replyContent.trim()}
                        className="px-4 py-1.5 rounded-xl bg-[#B88A2B] hover:bg-[#A37820] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        {isReplyingSubmitting ? (isRtl ? "جاري الإرسال..." : "Sending...") : (isRtl ? "إرسال الرد" : "Submit Reply")}
                      </button>
                    </div>
                  </form>
                )}

                {/* Nested Threaded Replies */}
                {replies.length > 0 && (
                  <div className="mt-5 space-y-4 pt-4 border-t border-[#E5DCCB]/60 dark:border-[#2E2A24]/60">
                    {replies.map((reply) => {
                      const replyAuthor = reply.author?.name || reply.authorName || (isRtl ? "باحث زائر" : "Guest Scholar");
                      const replyAvatar = reply.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(replyAuthor)}`;
                      const replyDate = new Date(reply.createdAt).toLocaleDateString(isRtl ? "ar-SA" : "en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                      const CornerIcon = isRtl ? CornerDownLeft : CornerDownRight;

                      return (
                        <div
                          key={reply.id}
                          className="flex items-start gap-3 p-4 rounded-2xl bg-[#FAF0D7]/20 dark:bg-[#262118]/30 border border-[#E5DCCB]/50 dark:border-[#2E2A24]/50 mr-0 rtl:mr-4 ltr:ml-4"
                        >
                          <CornerIcon size={16} className="text-[#B88A2B] shrink-0 mt-2 opacity-60" />
                          <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-[#E5DCCB] dark:border-[#2E2A24] shrink-0">
                            <Image src={replyAvatar} alt={replyAuthor} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
                              <div className="flex items-center gap-2">
                                <h5 className="font-serif font-bold text-xs text-[#1C1917] dark:text-[#F5F1E8]">
                                  {replyAuthor}
                                </h5>
                                {(reply.author?.role === "VERIFIED_SCHOLAR" || reply.user?.role === "VERIFIED_SCHOLAR") && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#FAF0D7] text-[#B88A2B] dark:bg-[#262118] dark:text-[#C5A059] border border-[#E5DCCB] dark:border-[#3E3A36] shrink-0">
                                    <CheckCircle2 size={8} />
                                    <span>{isRtl ? "عالم معتمد" : "Scholar"}</span>
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {reply.status === "PENDING" && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
                                    <Clock size={9} />
                                    <span>{isRtl ? "قيد المراجعة" : "Pending"}</span>
                                  </span>
                                )}
                                <span className="text-[10px] text-[#A8A29E]">
                                  {replyDate}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-[#3E3A36] dark:text-[#D1CBC1] leading-relaxed whitespace-pre-line">
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
