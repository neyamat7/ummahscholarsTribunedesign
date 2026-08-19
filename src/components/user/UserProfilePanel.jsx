"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  Heart,
  MessageSquare,
  LogOut,
  X,
  ExternalLink,
  BookOpen,
  Calendar,
  Edit3,
  Camera,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { fetchUserBookmarks, fetchUserLikes, fetchUserComments, getMediaUrl } from "@/lib/api";

const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=ScholarAhmad",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=ScholarFatima",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=ScholarZaid",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=ScholarMariam",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=ScholarTariq",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=ScholarYusuf",
];

export default function UserProfilePanel({ isOpen, onClose }) {
  const { isRtl } = useLanguage();
  const { user, logout, updateProfile } = useAuth();
  const panelRef = useRef(null);
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("bookmarks"); // 'bookmarks' | 'likes' | 'comments'
  const [bookmarks, setBookmarks] = useState([]);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);

  // Sync edit form with current user on open or user change
  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditAvatarUrl(user.avatarUrl || "");
    }
  }, [user, isOpen]);

  // Close panel on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (panelRef.current && panelRef.current.contains(e.target)) {
        return;
      }
      if (e.target.closest && e.target.closest('[data-profile-trigger="true"]')) {
        return;
      }
      if (onClose) onClose();
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Fetch activity data when panel opens
  useEffect(() => {
    if (!isOpen || !user?.id) return;

    let isMounted = true;
    setLoading(true);

    Promise.all([
      fetchUserBookmarks(user.id, 1, 20).catch(() => ({ data: [] })),
      fetchUserLikes(user.id, 1, 20).catch(() => ({ data: [] })),
      fetchUserComments(user.id, 1, 20).catch(() => ({ data: [] })),
    ]).then(([bRes, lRes, cRes]) => {
      if (!isMounted) return;
      setBookmarks(bRes.data || []);
      setLikes(lRes.data || []);
      setComments(cRes.data || []);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, user?.id]);

  if (!isOpen || !user) return null;

  const handleSignOut = () => {
    logout();
    if (onClose) onClose();
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setEditError(isRtl ? "حجم الصورة يجب أن لا يتجاوز 2 ميغابايت" : "Image size must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result;
      if (dataUrl) {
        setEditAvatarUrl(dataUrl);
        setEditError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      setEditError(isRtl ? "الاسم مطلوب" : "Name cannot be empty");
      return;
    }

    setEditError(null);
    setIsSaving(true);

    try {
      await updateProfile({
        name: editName.trim(),
        avatarUrl: editAvatarUrl || undefined,
      });
      setEditSuccess(true);
      setTimeout(() => {
        setEditSuccess(false);
        setIsEditing(false);
      }, 1000);
    } catch (err) {
      setEditError(err?.message || (isRtl ? "فشل تحديث الملف الشخصي" : "Failed to update profile"));
    } finally {
      setIsSaving(false);
    }
  };

  const userAvatar =
    editAvatarUrl ||
    user.avatarUrl ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.id || user.email)}`;

  const tabs = [
    {
      id: "bookmarks",
      label: isRtl ? "المحفوظات" : "Bookmarks",
      icon: Bookmark,
      count: bookmarks.length,
    },
    {
      id: "likes",
      label: isRtl ? "المعجبات" : "Liked",
      icon: Heart,
      count: likes.length,
    },
    {
      id: "comments",
      label: isRtl ? "التعليقات" : "Comments",
      icon: MessageSquare,
      count: comments.length,
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        ref={panelRef}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className={`absolute top-full mt-2.5 ${
          isRtl ? "left-4 sm:left-6 lg:left-8" : "right-4 sm:right-6 lg:right-8"
        } z-50 w-[360px] sm:w-[410px] max-w-[calc(100vw-32px)] bg-white dark:bg-[#1A1714] border border-[#E5DCCB] dark:border-[#2E2A24] rounded-3xl shadow-2xl overflow-hidden flex flex-col`}
      >
        {/* Header: User Info / Edit Mode Toggle */}
        <div className="p-4 sm:p-5 bg-[#FAF0D7]/40 dark:bg-[#262118]/60 border-b border-[#E5DCCB] dark:border-[#2E2A24]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-[#B88A2B]/40 bg-white dark:bg-[#1A1714] shrink-0 shadow-xs">
                <Image
                  src={user.avatarUrl || userAvatar}
                  alt={user.name || "User Avatar"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-serif font-bold text-sm sm:text-base text-[#1C1917] dark:text-[#F5F1E8] truncate">
                    {user.name || "Reader & Scholar"}
                  </h4>
                  {user.role === "VERIFIED_SCHOLAR" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FAF0D7] text-[#B88A2B] dark:bg-[#262118] dark:text-[#C5A059] border border-[#E5DCCB] dark:border-[#3E3A36] text-[10px] font-bold">
                      <Check size={10} />
                      <span>{isRtl ? "عالم معتمد" : "Verified Scholar"}</span>
                    </span>
                  ) : user.role === "ACADEMIC" ? (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 text-[10px] font-bold">
                      {isRtl ? "باحث أكاديمي" : "Academic"}
                    </span>
                  ) : user.role === "CONTRIBUTOR" ? (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 text-[10px] font-bold">
                      {isRtl ? "مساهم" : "Contributor"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-[#B88A2B]/10 text-[#B88A2B] dark:text-[#C5A059] text-[10px] font-bold">
                      {isRtl ? "عضو" : "Member"}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#78716C] dark:text-[#A39B8B] truncate mt-0.5">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsEditing((prev) => !prev);
                  setEditError(null);
                }}
                className={`p-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  isEditing
                    ? "bg-[#B88A2B] text-white"
                    : "text-[#B88A2B] dark:text-[#C5A059] hover:bg-[#FAF0D7] dark:hover:bg-[#262118]"
                }`}
                title={isEditing ? (isRtl ? "إلغاء التعديل" : "Cancel Edit") : (isRtl ? "تعديل الملف الشخصي" : "Edit Profile")}
              >
                <Edit3 size={15} />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-[#78716C] hover:text-[#1C1917] dark:text-[#A39B8B] dark:hover:text-[#F5F1E8] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Close profile panel"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* EDIT PROFILE FORM DRAWER */}
          <AnimatePresence>
            {isEditing && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSaveProfile}
                className="mt-4 pt-4 border-t border-[#E5DCCB]/80 dark:border-[#2E2A24]/80 space-y-3.5 overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1C1917] dark:text-[#F5F1E8]">
                    {isRtl ? "تعديل الصورة والاسم" : "Edit Name & Avatar"}
                  </span>
                  {editSuccess && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <Check size={13} />
                      <span>{isRtl ? "تم الحفظ بنجاح" : "Saved successfully"}</span>
                    </span>
                  )}
                </div>

                {/* Avatar Chooser & Upload */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#78716C] dark:text-[#A39B8B] mb-1.5">
                    {isRtl ? "اختر صورة أو ارفع صورتك الخاصة" : "Choose Avatar or Upload Photo"}
                  </label>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#B88A2B] bg-white shrink-0 shadow-2xs">
                      <Image src={userAvatar} alt="Selected Avatar" fill className="object-cover" />
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-dashed border-[#B88A2B] text-[#B88A2B] dark:text-[#C5A059] bg-[#FAF0D7]/40 dark:bg-[#262118] text-xs font-bold hover:bg-[#FAF0D7] dark:hover:bg-[#262118]/80 transition-colors cursor-pointer"
                    >
                      <Camera size={14} />
                      <span>{isRtl ? "رفع صورة من جهازك" : "Upload Custom Photo"}</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageFileUpload}
                    />
                  </div>

                  {/* Preset Avatars */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {PRESET_AVATARS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditAvatarUrl(preset)}
                        className={`relative w-8 h-8 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                          editAvatarUrl === preset
                            ? "border-2 border-[#B88A2B] scale-110 shadow-xs"
                            : "border-[#E5DCCB] dark:border-[#2E2A24] opacity-75 hover:opacity-100"
                        }`}
                      >
                        <Image src={preset} alt={`Avatar preset ${idx + 1}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#78716C] dark:text-[#A39B8B] mb-1">
                    {isRtl ? "الاسم الكامل" : "Display Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder={isRtl ? "اسمك الكريم" : "Your Name"}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E5DCCB] dark:border-[#2E2A24] bg-[#FBF9F6] dark:bg-[#0F0D0B] text-xs text-[#1C1917] dark:text-[#F5F1E8] focus:outline-none focus:border-[#B88A2B]"
                  />
                </div>

                {editError && (
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-[11px]">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{editError}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(user.name || "");
                      setEditAvatarUrl(user.avatarUrl || "");
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#78716C] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    {isRtl ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#B88A2B] to-[#C5A059] text-white text-xs font-bold shadow-xs hover:brightness-105 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>{isRtl ? "جارٍ الحفظ..." : "Saving..."}</span>
                      </>
                    ) : (
                      <>
                        <Check size={13} />
                        <span>{isRtl ? "حفظ التغييرات" : "Save Changes"}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#E5DCCB] dark:border-[#2E2A24] bg-[#FBF9F6] dark:bg-[#0F0D0B] p-1.5 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-white dark:bg-[#1A1714] text-[#B88A2B] dark:text-[#C5A059] shadow-2xs"
                    : "text-[#78716C] dark:text-[#A39B8B] hover:text-[#1C1917] dark:hover:text-[#F5F1E8]"
                }`}
              >
                <Icon size={14} className={isActive ? "fill-current" : ""} />
                <span>{tab.label}</span>
                {!loading && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? "bg-[#FAF0D7] dark:bg-[#262118] text-[#B88A2B] dark:text-[#C5A059]"
                        : "bg-black/5 dark:bg-white/5 text-[#78716C]"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body (Scrollable, Max Height ~340px) */}
        <div className="p-3 sm:p-4 max-h-[340px] overflow-y-auto space-y-2.5">
          {loading ? (
            /* Dedicated Shimmer Skeleton Loaders */
            <div className="space-y-2.5">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="p-3 rounded-2xl border border-[#E5DCCB]/60 dark:border-[#2E2A24]/60 bg-white/60 dark:bg-[#1A1714]/60 animate-pulse flex items-start gap-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-stone-200 dark:bg-stone-800 shrink-0" />
                  <div className="flex-1 space-y-2 py-0.5">
                    <div className="h-3.5 bg-stone-200 dark:bg-stone-800 rounded w-3/4" />
                    <div className="h-2.5 bg-stone-200 dark:bg-stone-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === "bookmarks" ? (
            /* Bookmarks List */
            bookmarks.length > 0 ? (
              bookmarks.map((item) => {
                const post = item.post || {};
                const pageCategory = post.pageCategory?.slug || "research";
                const postTitle = isRtl ? post.titleAr || post.titleEn || post.title : post.titleEn || post.titleAr || post.title;
                const categoryName = isRtl
                  ? post.category?.nameAr || post.pageCategory?.nameAr || "دراسات"
                  : post.category?.nameEn || post.pageCategory?.nameEn || "Studies";
                const postImageUrl = getMediaUrl(post.featuredImage?.url || post.featuredImage || post.image, "/news/news1.avif");

                return (
                  <Link
                    key={item.id}
                    href={`/${pageCategory}/${post.slug}`}
                    onClick={onClose}
                    className="group block p-3 rounded-2xl border border-[#E5DCCB]/80 dark:border-[#2E2A24] bg-white dark:bg-[#1A1714] hover:border-[#B88A2B] dark:hover:border-[#C5A059] hover:shadow-xs transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 border border-stone-200/60 dark:border-stone-800">
                        <Image
                          src={postImageUrl}
                          alt={postTitle || "Post thumbnail"}
                          fill
                          sizes="48px"
                          className="object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.currentTarget.srcset = "";
                            e.currentTarget.src = "/news/news1.avif";
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#B88A2B] dark:text-[#C5A059] block truncate">
                          {categoryName}
                        </span>
                        <h5 className="font-serif font-bold text-xs sm:text-sm text-[#1C1917] dark:text-[#F5F1E8] line-clamp-2 mt-0.5 group-hover:text-[#B88A2B] dark:group-hover:text-[#C5A059] transition-colors">
                          {postTitle}
                        </h5>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <EmptyState
                icon={Bookmark}
                title={isRtl ? "لا توجد محفوظات حتى الآن" : "No saved bookmarks yet"}
                desc={isRtl ? "احفظ المقالات لقراءتها ومراجعتها لاحقاً." : "Bookmark articles while reading to review them here."}
                isRtl={isRtl}
                onClose={onClose}
              />
            )
          ) : activeTab === "likes" ? (
            /* Liked Posts List */
            likes.length > 0 ? (
              likes.map((item) => {
                const post = item.post || {};
                const pageCategory = post.pageCategory?.slug || "research";
                const postTitle = isRtl ? post.titleAr || post.titleEn || post.title : post.titleEn || post.titleAr || post.title;
                const categoryName = isRtl
                  ? post.category?.nameAr || post.pageCategory?.nameAr || "دراسات"
                  : post.category?.nameEn || post.pageCategory?.nameEn || "Studies";
                const postImageUrl = getMediaUrl(post.featuredImage?.url || post.featuredImage || post.image, "/news/news1.avif");

                return (
                  <Link
                    key={item.id}
                    href={`/${pageCategory}/${post.slug}`}
                    onClick={onClose}
                    className="group block p-3 rounded-2xl border border-[#E5DCCB]/80 dark:border-[#2E2A24] bg-white dark:bg-[#1A1714] hover:border-[#B88A2B] dark:hover:border-[#C5A059] hover:shadow-xs transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 border border-stone-200/60 dark:border-stone-800">
                        <Image
                          src={postImageUrl}
                          alt={postTitle || "Post thumbnail"}
                          fill
                          sizes="48px"
                          className="object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.currentTarget.srcset = "";
                            e.currentTarget.src = "/news/news1.avif";
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#B88A2B] dark:text-[#C5A059] block truncate">
                          {categoryName}
                        </span>
                        <h5 className="font-serif font-bold text-xs sm:text-sm text-[#1C1917] dark:text-[#F5F1E8] line-clamp-2 mt-0.5 group-hover:text-[#B88A2B] dark:group-hover:text-[#C5A059] transition-colors">
                          {postTitle}
                        </h5>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <EmptyState
                icon={Heart}
                title={isRtl ? "لم تقم بالإعجاب بأي مقال بعد" : "No liked articles yet"}
                desc={isRtl ? "أعجب بالمقالات التي تثري معرفتك لدعم الباحثين." : "Articles you like will be organized here."}
                isRtl={isRtl}
                onClose={onClose}
              />
            )
          ) : (
            /* Comments & Replies List */
            comments.length > 0 ? (
              comments.map((comment) => {
                const post = comment.post || {};
                const pageCategory = post.pageCategory?.slug || "research";
                const postTitle = isRtl ? post.titleAr || post.titleEn || "مقال علمي" : post.titleEn || post.titleAr || "Article";

                return (
                  <Link
                    key={comment.id}
                    href={`/${pageCategory}/${post.slug}#comments`}
                    onClick={onClose}
                    className="group block p-3 rounded-2xl border border-[#E5DCCB]/80 dark:border-[#2E2A24] bg-white dark:bg-[#1A1714] hover:border-[#B88A2B] dark:hover:border-[#C5A059] hover:shadow-xs transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold text-[#B88A2B] dark:text-[#C5A059] truncate max-w-[200px]">
                        {postTitle}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          comment.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                        }`}
                      >
                        {comment.status === "APPROVED" ? (isRtl ? "معتمد" : "Approved") : (isRtl ? "قيد المراجعة" : "In Review")}
                      </span>
                    </div>

                    <p className="text-xs text-[#57534E] dark:text-[#A39B8B] line-clamp-2 leading-relaxed">
                      &ldquo;{comment.content}&rdquo;
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E5DCCB]/50 dark:border-[#2E2A24]/50 text-[10px] text-[#A8A29E]">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </span>
                      <span className="flex items-center gap-1 text-[#B88A2B] dark:text-[#C5A059] font-semibold group-hover:underline">
                        <span>{isRtl ? "الانتقال للتعليق" : "Go to discussion"}</span>
                        <ExternalLink size={10} />
                      </span>
                    </div>
                  </Link>
                );
              })
            ) : (
              <EmptyState
                icon={MessageSquare}
                title={isRtl ? "لم تشارك بأي تعليق حتى الآن" : "No discussions joined yet"}
                desc={isRtl ? "شارك بآرائك الأكاديمية واستفساراتك في نقاشات المقالات." : "Your comments and replies will appear here."}
                isRtl={isRtl}
                onClose={onClose}
              />
            )
          )}
        </div>

        {/* Footer: Sign Out Action */}
        <div className="p-3 bg-[#FAF0D7]/40 dark:bg-[#262118]/60 border-t border-[#E5DCCB] dark:border-[#2E2A24]">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>{isRtl ? "تسجيل الخروج" : "Sign Out"}</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function EmptyState({ icon: Icon, title, desc, isRtl, onClose }) {
  return (
    <div className="text-center py-8 px-4">
      <div className="w-10 h-10 rounded-2xl bg-[#FAF0D7] dark:bg-[#262118] text-[#B88A2B] dark:text-[#C5A059] flex items-center justify-center mx-auto mb-2.5">
        <Icon size={18} />
      </div>
      <h6 className="font-serif font-bold text-xs sm:text-sm text-[#1C1917] dark:text-[#F5F1E8]">
        {title}
      </h6>
      <p className="text-[11px] text-[#78716C] dark:text-[#A39B8B] mt-1 max-w-[240px] mx-auto leading-relaxed">
        {desc}
      </p>
      <Link
        href="/research"
        onClick={onClose}
        className="inline-flex items-center gap-1 mt-3 px-3 py-1.5 rounded-xl bg-[#B88A2B]/10 text-[#B88A2B] dark:text-[#C5A059] text-xs font-bold hover:bg-[#B88A2B]/20 transition-colors"
      >
        <BookOpen size={12} />
        <span>{isRtl ? "تصفح الأبحاث" : "Explore Studies"}</span>
      </Link>
    </div>
  );
}
