"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Copy,
  Check,
  BookOpen,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  HelpCircle,
  Clock,
} from "lucide-react";

// Subtle Motion Variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      delay: custom * 0.08,
    },
  }),
};

export default function ContactPage() {
  const { isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Copy State
  const [copiedKey, setCopiedKey] = useState(null);

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState(0);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(
      isRtl ? "تم النسخ بنجاح" : "Copied to clipboard successfully"
    );
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error(
        isRtl
          ? "يرجى ملء جميع الحقول المطلوبة"
          : "Please fill in all required fields"
      );
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success(
      isRtl
        ? "تم إرسال رسالتكم بنجاح"
        : "Your message has been sent successfully"
    );
  };

  // Content
  const content = {
    heroTitlePrefix: isRtl ? "تواصل مع " : "Contact ",
    heroTitleHighlight: isRtl ? "منبر علماء الأمة" : "Ummah Scholars Tribune",
    heroSubtitle: isRtl
      ? "يسعدنا استقبال استفساراتكم، مقترحاتكم البحثية، وتواصلكم العلمي مع الهيئة واللجان المختصة."
      : "We welcome your inquiries, research proposals, and scholarly communications with our faculty and editorial board.",

    channels: [
      {
        id: "email-general",
        title: isRtl ? "البريد الإلكتروني" : "Email Address",
        value: "info@ummahscholarstribune.com",
        icon: Mail,
        href: "mailto:info@ummahscholarstribune.com",
        copyable: true,
      },
      {
        id: "email-editorial",
        title: isRtl ? "أمانة البحوث والدراسات" : "Research & Submissions",
        value: "research@ummahscholar.com",
        icon: BookOpen,
        href: "mailto:research@ummahscholar.com",
        copyable: true,
      },
      {
        id: "phone",
        title: isRtl ? "الهاتف وواتساب" : "Phone & WhatsApp",
        value: "+8801719758581",
        icon: Phone,
        href: "https://wa.me/8801719758581",
        copyable: true,
      },
      {
        id: "location",
        title: isRtl ? "المقر الرئيسي" : "Headquarters",
        value: isRtl ? "شيتاغونغ، بنغلاديش" : "Chattogram, Bangladesh",
        icon: MapPin,
        href: undefined,
        copyable: false,
      },
    ],

    formTitle: isRtl ? "إرسال رسالة" : "Send a Message",
    formSubtitle: isRtl
      ? "تفضل بكتابة استفسارك وسيقوم الفريق بالرد عليك في أقرب وقت ممكن."
      : "Fill in the form below and our team will get back to you promptly.",

    labels: {
      name: isRtl ? "الاسم الكامل *" : "Full Name *",
      namePlaceholder: isRtl ? "أدخل اسمك الكريم" : "Enter your full name",
      email: isRtl ? "البريد الإلكتروني *" : "Email Address *",
      emailPlaceholder: isRtl ? "example@domain.com" : "example@domain.com",
      subject: isRtl ? "الموضوع *" : "Subject *",
      subjectPlaceholder: isRtl ? "عنوان الاستفسار أو الرسالة" : "Subject of your message",
      message: isRtl ? "الرسالة *" : "Message *",
      messagePlaceholder: isRtl ? "اكتب رسالتك هنا..." : "Write your message here...",
      submitBtn: isRtl ? "إرسال الرسالة" : "Send Message",
      submitting: isRtl ? "جاري الإرسال..." : "Sending...",
      successTitle: isRtl ? "تم استلام رسالتكم بنجاح" : "Message Sent Successfully",
      successDesc: isRtl
        ? "شكراً لتواصلكم معنا. سنقوم بمراجعة رسالتكم والرد عليها في أقرب وقت."
        : "Thank you for reaching out. We have received your message and will respond shortly.",
      sendAnother: isRtl ? "إرسال رسالة أخرى" : "Send Another Message",
    },

    faqTitle: isRtl ? "الأسئلة الشائعة" : "Frequently Asked Questions",
    faqSubtitle: isRtl
      ? "إجابات موجزة عن أهم الاستفسارات الأكاديمية والتواصل مع المنبر."
      : "Brief answers to common scholarly and communication inquiries.",

    faqs: [
      {
        q: isRtl ? "كيف يمكنني تقديم بحث أو مقال للنشر؟" : "How can I submit a research paper or article?",
        a: isRtl
          ? "يمكنك إرسال مسودة البحث مع ملخص تنفيذي عبر نموذج التواصل واختيار موضوع البحث، أو مراسلة بريد البحوث مباشرة: research@ummahscholar.com"
          : "You can submit your paper abstract and draft via the contact form or by emailing our Research Desk directly at research@ummahscholar.com.",
      },
      {
        q: isRtl ? "ما هو زمن الرد المتوقع على الاستفسارات؟" : "What is the expected response time?",
        a: isRtl
          ? "يتم الرد على معظم الاستفسارات والمراسلات الأكاديمية خلال 24 إلى 48 ساعة عمل."
          : "Most inquiries and academic communications receive a response within 24 to 48 business hours.",
      },
      {
        q: isRtl ? "هل يمكن إعادة نشر المواد المنشورة في المنبر؟" : "Can articles from the Tribune be republished?",
        a: isRtl
          ? "يسمح بإعادة النشر للأغراض الأكاديمية والتثقيفية غير التجارية مع الإشارة الواضحة لمنبر علماء الأمة ووضع رابط المصدر."
          : "Republishing for educational and non-commercial purposes is permitted with full attribution to Ummah Scholars Tribune and a direct link to the original article.",
      },
      {
        q: isRtl ? "كيف يمكن التنسيق بشأن الفعاليات والمؤتمرات؟" : "How to coordinate on conferences and events?",
        a: isRtl
          ? "يسعدنا التعاون مع الجامعات والمراكز العلمية. يرجى إرسال مقترح الفعالية عبر النموذج أو التواصل معنا هاتفياً وعبر واتساب."
          : "We welcome collaboration with academic institutions. Please share your event proposal via the form or reach out directly on WhatsApp.",
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#FBF9F6] dark:bg-[#0F0D0B] text-[#1C1917] dark:text-[#F5F1E8] transition-colors">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-5 sm:px-8 overflow-hidden bg-gradient-to-b from-[#1C1917] via-[#221D18] to-[#161412] text-white">
        {/* Background Subtle Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/contact.jpeg"
            alt="Contact Banner"
            fill
            priority
            className="object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161412] via-[#161412]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h1
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-[#FAF0D7] mb-4"
          >
            {content.heroTitlePrefix}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#C5A059]">
              {content.heroTitleHighlight}
            </span>
          </motion.h1>

          <motion.p
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-base sm:text-lg text-[#D6CEBF] font-sans max-w-2xl mx-auto leading-relaxed"
          >
            {content.heroSubtitle}
          </motion.p>
        </div>
      </section>

      {/* 2. FOUR CLEAN CONTACT CARDS */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 -mt-8 md:-mt-12 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {content.channels.map((channel, idx) => {
            const Icon = channel.icon;
            const isCopied = copiedKey === channel.id;

            return (
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.07 }}
                className="group p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#161412] border border-[#E5DCCB] dark:border-[#2E2A24] shadow-md hover:shadow-xl hover:border-[#C5A059]/60 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#FAF0D7] dark:bg-[#262118] text-[#B88A2B] dark:text-[#D4AF37] flex items-center justify-center shadow-xs">
                      <Icon size={20} />
                    </div>

                    {channel.copyable && (
                      <button
                        type="button"
                        onClick={() => handleCopy(channel.value, channel.id)}
                        className="p-2 rounded-xl bg-[#FBF9F6] dark:bg-[#1E1B18] border border-[#E5DCCB] dark:border-[#2E2A24] hover:bg-[#FAF0D7] dark:hover:bg-[#262118] text-[#78716C] dark:text-[#A39B8B] hover:text-[#B88A2B] dark:hover:text-[#D4AF37] transition-colors cursor-pointer"
                        title={isRtl ? "نسخ" : "Copy"}
                        aria-label="Copy"
                      >
                        {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#1C1917] dark:text-[#F5F1E8] mb-1">
                    {channel.title}
                  </h3>
                </div>

                <div className="mt-3 pt-3 border-t border-[#E5DCCB]/60 dark:border-[#2E2A24]/60">
                  {channel.href ? (
                    <a
                      href={channel.href}
                      target={channel.href.startsWith("http") ? "_blank" : undefined}
                      rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-xs font-semibold text-[#B88A2B] dark:text-[#D4AF37] hover:underline block truncate"
                      dir={channel.id === "phone" ? "ltr" : undefined}
                    >
                      {channel.value}
                    </a>
                  ) : (
                    <span className="text-xs font-semibold text-[#57534E] dark:text-[#C5BEB3] block truncate">
                      {channel.value}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. MAIN FORM & FAQ GRID */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Form Column (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-white dark:bg-[#161412] border border-[#E5DCCB] dark:border-[#2E2A24] rounded-3xl p-6 sm:p-10 shadow-lg"
          >
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] dark:text-[#F5F1E8] mb-2">
                {content.formTitle}
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A39B8B] leading-relaxed">
                {content.formSubtitle}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 px-6 text-center rounded-2xl bg-[#FAF0D7]/40 dark:bg-[#1E1B18] border border-[#C5A059]/40 space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1C1917] dark:text-[#F5F1E8]">
                    {content.labels.successTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#C5BEB3] max-w-md mx-auto leading-relaxed">
                    {content.labels.successDesc}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: "", email: "", subject: "", message: "" });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-[#B88A2B] hover:bg-[#9E7422] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    {content.labels.sendAnother}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#1C1917] dark:text-[#F5F1E8] mb-2">
                        {content.labels.name}
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={content.labels.namePlaceholder}
                        className="w-full px-4 py-3 rounded-xl bg-[#FBF9F6] dark:bg-[#1E1B18] border border-[#E5DCCB] dark:border-[#2E2A24] focus:border-[#B88A2B] dark:focus:border-[#C5A059] focus:outline-hidden text-sm text-[#1C1917] dark:text-[#F5F1E8] placeholder-[#A8A29E] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1C1917] dark:text-[#F5F1E8] mb-2">
                        {content.labels.email}
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={content.labels.emailPlaceholder}
                        className="w-full px-4 py-3 rounded-xl bg-[#FBF9F6] dark:bg-[#1E1B18] border border-[#E5DCCB] dark:border-[#2E2A24] focus:border-[#B88A2B] dark:focus:border-[#C5A059] focus:outline-hidden text-sm text-[#1C1917] dark:text-[#F5F1E8] placeholder-[#A8A29E] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] dark:text-[#F5F1E8] mb-2">
                      {content.labels.subject}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder={content.labels.subjectPlaceholder}
                      className="w-full px-4 py-3 rounded-xl bg-[#FBF9F6] dark:bg-[#1E1B18] border border-[#E5DCCB] dark:border-[#2E2A24] focus:border-[#B88A2B] dark:focus:border-[#C5A059] focus:outline-hidden text-sm text-[#1C1917] dark:text-[#F5F1E8] placeholder-[#A8A29E] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] dark:text-[#F5F1E8] mb-2">
                      {content.labels.message}
                    </label>
                    <textarea
                      rows={5}
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={content.labels.messagePlaceholder}
                      className="w-full px-4 py-3 rounded-xl bg-[#FBF9F6] dark:bg-[#1E1B18] border border-[#E5DCCB] dark:border-[#2E2A24] focus:border-[#B88A2B] dark:focus:border-[#C5A059] focus:outline-hidden text-sm text-[#1C1917] dark:text-[#F5F1E8] placeholder-[#A8A29E] transition-all resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#B88A2B] hover:bg-[#A07722] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{content.labels.submitting}</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} className={isRtl ? "rotate-180" : ""} />
                        <span>{content.labels.submitBtn}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Column: FAQs Accordion (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 bg-white dark:bg-[#161412] border border-[#E5DCCB] dark:border-[#2E2A24] rounded-3xl p-6 sm:p-8 shadow-lg space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 text-[#B88A2B] dark:text-[#D4AF37] mb-2">
                <HelpCircle size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {isRtl ? "إجابات وإرشادات" : "Help & Guidance"}
                </span>
              </div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1C1917] dark:text-[#F5F1E8] mb-1">
                {content.faqTitle}
              </h3>
              <p className="text-xs text-[#78716C] dark:text-[#A39B8B] leading-relaxed">
                {content.faqSubtitle}
              </p>
            </div>

            <div className="space-y-3">
              {content.faqs.map((faq, idx) => {
                const isOpen = expandedFaq === idx;

                return (
                  <div
                    key={idx}
                    className="rounded-2xl overflow-hidden border border-[#E5DCCB]/80 dark:border-[#2E2A24] bg-[#FBF9F6] dark:bg-[#1E1B18] transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isOpen ? -1 : idx)}
                      className="w-full p-4 text-start flex items-center justify-between gap-3 cursor-pointer hover:bg-black/2 dark:hover:bg-white/2 transition-colors"
                    >
                      <span className="font-semibold text-xs sm:text-sm text-[#1C1917] dark:text-[#F5F1E8] leading-snug">
                        {faq.q}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0 w-6 h-6 rounded-full bg-[#FAF0D7] dark:bg-[#262118] text-[#B88A2B] dark:text-[#D4AF37] flex items-center justify-center"
                      >
                        <ChevronDown size={13} />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="p-4 pt-0 text-xs text-[#57534E] dark:text-[#C5BEB3] leading-relaxed border-t border-[#E5DCCB]/40 dark:border-[#2E2A24]/40 font-sans">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>

        </div>
      </section>

      <Footer />
    </main>
  );
}