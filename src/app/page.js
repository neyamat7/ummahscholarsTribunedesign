"use client";

import { useEffect, useState } from "react";
import HeroSlider from "@/components/HeroSlider";
import KeyApplications from "@/components/KeyApplications";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import SliderSwiper from "@/components/SliderSwiper";
import ResearchFeatures from "../components/ResearchFeatures";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { locale, isRtl, t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('http://localhost:3000/api/v1/posts');
        if (res.ok) {
          const data = await res.json();
          // Adjust for NestJS paginated or array response
          const items = Array.isArray(data) ? data : (data.data || []);
          if (items.length > 0) {
            setPosts(items);
          }
        }
      } catch (err) {
        // Handle error silently or fall back to default demo articles
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Demo fallback articles if backend database is empty or starting up
  const fallbackNews = [
    {
      id: 1,
      titleEn: "Global Classical Legal Systems & Jurisprudence Reform",
      titleAr: "الأنظمة القانونية الكلاسيكية وإصلاح الفقه الإسلامي المعاصر",
      excerptEn: "The study of jurisprudence in classical scholarship offers crucial insights into modern governance and ethical frameworks.",
      excerptAr: "تقدم دراسة الفقه في المنح الدراسية الكلاسيكية رؤى حاسمة للحوكمة الحديثة والأطر الأخلاقية.",
      category: "Research",
      date: "August 11, 2026",
      image: "/news/news1.avif",
    },
    {
      id: 2,
      titleEn: "New Comparative Analysis Published on Ethical Governance",
      titleAr: "نشر تحليل مقارن جديد حول الحوكمة الأخلاقية والإصلاح التشريعي",
      excerptEn: "By examining historical treatises, scholars discern patterns of continuity and adaptation across generations.",
      excerptAr: "من خلال فحص الرسائل التاريخية، يميز العلماء أنماط استمرارية التكيف عبر الأجيال.",
      category: "Publication",
      date: "August 09, 2026",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: 3,
      titleEn: "International Islamic Governance Conference Concludes",
      titleAr: "اختتام المؤتمر الدولي للحوكمة الإسلامية والفكر المعاصر",
      excerptEn: "Prominent scholars gathered to discuss legal methodologies and contemporary jurisprudence challenges.",
      excerptAr: "اجتمع كبار العلماء لمناقشة المناهج القانونية وتحديات الفقه المعاصر.",
      category: "Conference",
      date: "August 05, 2026",
      image: "/news/news1.avif",
    }
  ];

  const displayList = posts.length > 0 ? posts : fallbackNews;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"> 
      {/* Navbar Header */}
      <Navbar />
      <HeroSlider />

      <div className="text-center max-w-4xl mx-auto px-4 space-y-4 z-10 mt-8 mb-3">
        <h1 className="text-xl lg:text-4xl font-bold font-serif text-black dark:text-white">
          <span className="italic text-[#C5A059]">
            {isRtl ? "منبر علماء الأمة" : "Ummah Scholars Tribune"}
          </span>
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 font-serif">
          {t('site.subtitle')}
        </p>
      </div>

      <div className="flex flex-col-reverse lg:flex-row items-center justify-center max-w-[1300px] mx-auto px-2 py-2 md:py-4">
        <KeyApplications />
        <SliderSwiper />
      </div>

      <ResearchFeatures />

      {/* Main Articles Section */}
      <section className="max-w-7xl mx-auto px-5 py-12">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-2xl font-bold font-serif text-neutral-900 dark:text-white">
            {t('site.latestNews')}
          </h2>
          <span className="text-xs font-semibold text-[#C5A059]">
            {t('site.viewAll')}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left Grid */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-8">
              {displayList.map((item) => {
                const title = isRtl 
                  ? (item.titleAr || item.titleEn || item.title) 
                  : (item.titleEn || item.titleAr || item.title);

                const excerpt = isRtl 
                  ? (item.excerptAr || item.excerptEn || item.excerpt) 
                  : (item.excerptEn || item.excerptAr || item.excerpt);

                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs hover:shadow-md duration-300 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative w-full h-52 overflow-hidden bg-neutral-100">
                        <Image
                          src={item.featuredImageUrl || item.image || "/news/news1.avif"}
                          width={500}
                          height={350}
                          alt={title || "Article Image"}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="p-6">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                          {item.category?.nameEn || item.category || "Research"}
                        </span>

                        <h3 className="text-lg font-bold mt-2 text-neutral-900 dark:text-white hover:text-[#C5A059] cursor-pointer line-clamp-2 leading-snug">
                          {title}
                        </h3>

                        <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-xs line-clamp-3 leading-relaxed">
                          {excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-0 flex items-center justify-between text-xs border-t border-neutral-100 dark:border-neutral-800/60 mt-4">
                      <span className="text-neutral-400">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : (item.date || "2026")}
                      </span>

                      <button className="text-[#C5A059] font-bold hover:underline">
                        {t('site.readMore')} →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Search */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-xs">
              <h3 className="font-bold font-serif text-lg mb-4 text-neutral-900 dark:text-white">
                {t('site.search')}
              </h3>

              <input
                className="w-full border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3 text-xs outline-none focus:ring-1 focus:ring-[#C5A059]"
                placeholder={t('site.search')}
              />
            </div>

            {/* Newsletter */}
            <div className="bg-neutral-900 text-white rounded-xl p-6 shadow-md border border-neutral-800">
              <h3 className="text-xl font-bold font-serif text-[#C5A059]">
                {t('nav.subscribe')}
              </h3>

              <p className="text-neutral-300 mt-2 text-xs leading-relaxed">
                {t('footer.tagline')}
              </p>

              <input
                className="mt-4 w-full rounded-lg p-2.5 text-xs text-black bg-white focus:outline-none"
                placeholder="Email Address"
              />

              <button className="w-full mt-3 bg-[#C5A059] text-white py-2.5 rounded-lg text-xs font-bold hover:bg-[#A37F3D] duration-300">
                {t('nav.subscribe')}
              </button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
