"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import HeroSlider from "@/components/HeroSlider";
import KeyApplications from "@/components/KeyApplications";
import Navbar from "@/components/Navbar";
import SliderSwiper from "@/components/SliderSwiper";
import ResearchFeatures from "@/components/ResearchFeatures";
import UpcomingEvents from "@/components/UpcomingEvents";
import CategoryShowcase from "@/components/CategoryShowcase";
import OpinionsSection from "@/components/OpinionsSection";
import NewsSection from "@/components/NewsSection";
import LatestBlogsSection from "@/components/LatestBlogsSection";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Mail } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function Home() {
  const { isRtl, t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("http://localhost:3000/api/v1/posts");
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : data.data || [];
          if (items.length > 0) {
            setPosts(items);
          }
        }
      } catch (err) {
        // Fallback default demo articles
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Demo fallback articles categorized for preview
  const fallbackResearch = [
    {
      id: 101,
      titleEn: "Global Classical Legal Systems & Jurisprudence Reform",
      titleAr: "الأنظمة القانونية الكلاسيكية وإصلاح الفقه الإسلامي المعاصر",
      excerptEn: "The study of jurisprudence in classical scholarship offers crucial insights into modern governance and ethical frameworks.",
      excerptAr: "تقدم دراسة الفقه في المنح الدراسية الكلاسيكية رؤى حاسمة للحوكمة الحديثة والأطر الأخلاقية.",
      category: { nameEn: "Research & Studies", nameAr: "البحوث والدراسات" },
      date: "August 11, 2026",
      image: "/news/news1.avif",
    },
    {
      id: 102,
      titleEn: "Methodological Paradigms in Comparative Usul al-Fiqh",
      titleAr: "النماذج المنهجية في أصول الفقه المقارن",
      excerptEn: "An analytical examination of textual extrapolation and contextual reasoning across classical legal schools.",
      excerptAr: "فحص تحليلي للاستنباط النصي والاستدلال السياقي عبر المدارس القانونية الكلاسيكية.",
      category: { nameEn: "Research & Studies", nameAr: "البحوث والدراسات" },
      date: "August 08, 2026",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: 103,
      titleEn: "Ethical Dimensions of Artificial Intelligence in Shariah Discourse",
      titleAr: "الأبعاد الأخلاقية للذكاء الاصطناعي في الخطاب الشرعي",
      excerptEn: "Evaluating contemporary technological advancements through traditional ethical and legal maxims.",
      excerptAr: "تقييم التطورات التكنولوجية المعاصرة من خلال القواعد الأخلاقية والقانونية التقليدية.",
      category: { nameEn: "Research & Studies", nameAr: "البحوث والدراسات" },
      date: "August 04, 2026",
      image: "/news/news1.avif",
    },
    {
      id: 104,
      titleEn: "Institutional Governance & Endowments (Waqf) in Classical Law",
      titleAr: "الحوكمة المؤسسية والأوقاف الإسلامية في القانون الكلاسيكي",
      excerptEn: "Exploring the economic and legal frameworks of Waqf institutions in historical and modern societies.",
      excerptAr: "استكشاف الأطر الاقتصادية والقانونية لمؤسسات الوقف في المجتمعات التاريخية والمعاصرة.",
      category: { nameEn: "Research & Studies", nameAr: "البحوث والدراسات" },
      date: "August 01, 2026",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80",
    },
  ];

  const fallbackOpinions = [
    {
      id: 201,
      titleEn: "Preserving Intellectual Clarity Amidst Global Complexity",
      titleAr: "الحفاظ على الوضوح الفكري وسط التعقيد العالمي",
      excerptEn: "Knowledge is the preservation of clarity amidst complexity — commentary on contemporary scholarly responsibility.",
      excerptAr: "المعرفة هي حفظ الوضوح في التعقيد — تعليق على المسؤولية العلمية المعاصرة.",
      category: { nameEn: "Opinions & Perspectives", nameAr: "الآراء ووجهات النظر" },
      date: "August 10, 2026",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: 202,
      titleEn: "The Scholar's Role in Civilizational Renewal",
      titleAr: "دور العالم في التجديد الحضاري والأخلاقي",
      excerptEn: "How classical scholars navigated periods of transformation and maintained societal trust.",
      excerptAr: "كيف وجه العلماء الكلاسيكيون فترات التحول وحافظوا على الثقة المجتمعية.",
      category: { nameEn: "Opinions & Perspectives", nameAr: "الآراء ووجهات النظر" },
      date: "August 06, 2026",
      image: "/news/news1.avif",
    },
    {
      id: 203,
      titleEn: "Fostering Ethical Governance in Public Institutions",
      titleAr: "تعزيز الحوكمة الأخلاقية في المؤسسات العامة",
      excerptEn: "Perspectives on applying Islamic ethical principles to modern institutional frameworks.",
      excerptAr: "وجهات نظر حول تطبيق المبادئ الأخلاقية الإسلامية على الأطر المؤسسية الحديثة.",
      category: { nameEn: "Opinions & Perspectives", nameAr: "الآراء ووجهات النظر" },
      date: "August 02, 2026",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80",
    },
  ];

  const fallbackNews = [
    {
      id: 301,
      titleEn: "International Islamic Governance Conference Concludes in Cairo",
      titleAr: "اختتام المؤتمر الدولي للحوكمة الإسلامية والفكر المعاصر بالقاهرة",
      excerptEn: "Prominent scholars gathered to discuss legal methodologies and contemporary jurisprudence challenges.",
      excerptAr: "اجتمع كبار العلماء لمناقشة المناهج القانونية وتحديات الفقه المعاصر.",
      category: { nameEn: "News & Announcements", nameAr: "الأخبار والإعلانات" },
      date: "August 09, 2026",
      image: "/news/news1.avif",
    },
    {
      id: 302,
      titleEn: "New Comparative Analysis Published on Legislative Reform",
      titleAr: "نشر تحليل مقارن جديد حول الإصلاح التشريعي",
      excerptEn: "By examining historical treatises, scholars discern patterns of continuity and adaptation across generations.",
      excerptAr: "من خلال فحص الرسائل التاريخية، يميز العلماء أنماط استمرارية التكيف عبر الأجيال.",
      category: { nameEn: "News & Announcements", nameAr: "الأخبار والإعلانات" },
      date: "August 05, 2026",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: 303,
      titleEn: "Tribune Launches Global Fellowship Program for Young Researchers",
      titleAr: "المنبر يطلق برنامج الزمالة العالمي للباحثين الشباب",
      excerptEn: "Supporting academic research and scholarship in classical jurisprudence and contemporary legal studies.",
      excerptAr: "دعم البحث العلمي والمنح الدراسية في الفقه الكلاسيكي والدراسات القانونية المعاصرة.",
      category: { nameEn: "News & Announcements", nameAr: "الأخبار والإعلانات" },
      date: "August 01, 2026",
      image: "/news/news1.avif",
    },
    {
      id: 304,
      titleEn: "Annual Academic Publishing & Research Grant Applications Open",
      titleAr: "فتح باب التقدم لمنح النشر الأكاديمي والبحث العلمي السنوية",
      excerptEn: "Scholars are invited to submit original manuscripts for upcoming peer-reviewed monographs.",
      excerptAr: "دعوة الباحثين لتقديم مخطوطاتهم الأصلية للسلسلة العلمية المحكّمة القادمة.",
      category: { nameEn: "News & Announcements", nameAr: "الأخبار والإعلانات" },
      date: "July 28, 2026",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80",
    },
  ];

  const researchPosts = useMemo(() => {
    if (posts.length === 0) return fallbackResearch;
    const filtered = posts.filter(
      (p) =>
        p.category?.slug === "research-studies" ||
        p.category?.nameEn?.toLowerCase().includes("research") ||
        p.category === "Research"
    );
    return filtered.length >= 4 ? filtered : [...filtered, ...fallbackResearch].slice(0, 4);
  }, [posts]);

  const opinionPosts = useMemo(() => {
    if (posts.length === 0) return fallbackOpinions;
    return posts.filter(
      (p) =>
        p.category?.slug === "opinions-perspectives" ||
        p.category?.nameEn?.toLowerCase().includes("opinion") ||
        p.category === "Opinions"
    );
  }, [posts]);

  const newsPosts = useMemo(() => {
    if (posts.length === 0) return fallbackNews;
    return posts.filter(
      (p) =>
        p.category?.slug === "news-announcements" ||
        p.category?.nameEn?.toLowerCase().includes("news") ||
        p.category === "News"
    );
  }, [posts]);

  return (
    <div className="min-h-screen bg-[#F7F4EE] dark:bg-[#0F0D0B] text-[#1C1917] dark:text-[#F5F1E8] font-sans antialiased transition-colors overflow-x-clip">
      {/* 1. Sticky 3-Zone Navigation Bar */}
      <Navbar />

      {/* 2. Asymmetric Editorial Hero Banner */}
      <HeroSlider />

      {/* 3. Sub-Hero Title & Tagline Block */}
      <section className="py-12 bg-[#F7F4EE] dark:bg-[#0F0D0B]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="text-center max-w-4xl mx-auto px-4 space-y-3"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-[#B88A2B] dark:text-[#C5A059] block">
            {isRtl ? "المنصة العالمية الأصيلة" : "Authentic Global Platform"}
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1C1917] dark:text-[#F5F1E8] tracking-tight">
            <span className="italic text-[#B88A2B] dark:text-[#C5A059]">
              {isRtl ? "منبر علماء الأمة" : "Ummah Scholars Tribune"}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A39B8B] font-serif max-w-xl mx-auto leading-relaxed">
            {t("site.subtitle")}
          </p>
        </motion.div>
      </section>

      {/* 4. Bilingual Mission Statement & Video Carousel Row */}
      <section className="max-w-7xl mx-auto px-5 py-6">
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6">
          <KeyApplications />
          <SliderSwiper />
        </div>
      </section>

      {/* 5. Academic Pillars Bento Grid */}
      <ResearchFeatures />

      {/* 6. Upcoming Events Preview Strip */}
      <UpcomingEvents />

      {/* 7. Pin-Scrubbed Category Showcase (Research & Studies) */}
      <CategoryShowcase
        titleEn="Research & Studies"
        titleAr="البحوث والدراسات"
        descriptionEn="Peer-reviewed academic research on classical jurisprudence, legal methodologies, and contemporary governance."
        descriptionAr="بحوث أكاديمية محكّمة حول الفقه الكلاسيكي والمناهج القانونية والحوكمة المعاصرة."
        categorySlug="research-studies"
        posts={researchPosts}
      />

      {/* 8. Opinions Spotlight & Standard News Section */}
      <OpinionsSection
        titleEn="Opinions & Perspectives"
        titleAr="الآراء ووجهات النظر"
        descriptionEn="Thoughtful commentaries and analytical perspectives from esteemed scholars on societal challenges."
        descriptionAr="تعليقات فكرية ووجهات نظر تحليلية من كبار العلماء حول التحديات المجتمعية."
        categorySlug="opinions-perspectives"
        posts={opinionPosts.length > 0 ? opinionPosts : fallbackOpinions}
      />

      <NewsSection
        titleEn="News & Announcements"
        titleAr="الأخبار والإعلانات"
        descriptionEn="Updates on international scholarly conferences, publications, academic initiatives, and tribune events."
        descriptionAr="مستجدات المؤتمرات العلمية الدولية والمنشورات والمبادرات الأكاديمية وفعاليات المنبر."
        categorySlug="news-announcements"
        posts={newsPosts.length > 0 ? newsPosts : fallbackNews}
      />

      {/* 9. Latest From the Tribune (Aggregated Latest Posts Spotlight) */}
      <LatestBlogsSection
        posts={posts.length > 0 ? posts : [...fallbackResearch, ...fallbackOpinions, ...fallbackNews]}
      />

      {/* 10. Search & Newsletter Callout Section */}
      <section className="py-16 bg-[#1A1714] text-[#F5F1E8] border-t border-[#2E2A24] overflow-hidden">
        <div className="max-w-7xl mx-auto px-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer(0.12, 0.05)}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Newsletter Callout */}
            <motion.div variants={fadeUp} className="lg:col-span-7 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
                {t("nav.subscribe")}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F1E8]">
                {isRtl ? "اشترك في نشرتنا العلمية الدورية" : "Subscribe to Our Scholarly Digest"}
              </h3>
              <p className="text-xs sm:text-sm text-[#A39B8B] leading-relaxed max-w-xl font-sans">
                {t("footer.tagline")}
              </p>
            </motion.div>

            {/* Subscription Form */}
            <motion.div variants={fadeUp} className="lg:col-span-5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(isRtl ? "شكراً لاشتراكك في منبر العلماء!" : "Thank you for subscribing to Ummah Scholars Tribune!");
                }}
                className="flex flex-col sm:flex-row gap-3 bg-[#0F0D0B] p-2 rounded-xl border border-[#2E2A24]"
              >
                <div className="flex items-center gap-2 px-3 py-2 flex-grow">
                  <Mail className="w-4 h-4 text-[#A39B8B]" />
                  <input
                    type="email"
                    required
                    placeholder={isRtl ? "أدخل بريدك الإلكتروني" : "Enter your email address"}
                    className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-[#F5F1E8] placeholder-[#A39B8B]"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-[#C5A059] hover:bg-[#A37F3D] text-[#0F0D0B] font-bold text-xs sm:text-sm transition-colors whitespace-nowrap shadow-sm cursor-pointer"
                >
                  {t("nav.subscribe")}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 10. Scholarly Footer */}
      <Footer />
    </div>
  );
}
