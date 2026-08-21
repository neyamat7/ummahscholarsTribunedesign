import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsHeroBanner from "@/components/news/NewsHeroBanner";
import NewsInteractiveFeed from "@/components/news/NewsInteractiveFeed";
import { fetchCategories, fetchPosts } from "@/lib/api";

/**
 * Dynamic SEO Metadata for News & Announcements Page
 */
export async function generateMetadata() {
  const title = "News & Announcements | Ummah Scholars Tribune";
  const description =
    "Updates on UST news, announcements, scholars, institutions, activities, and developments relevant to the Ummah and the world.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://ummahscholar.com/news",
      siteName: "Ummah Scholars Tribune",
      images: [
        {
          url: "/news/news.jpeg",
          width: 1200,
          height: 630,
          alt: "News & Announcements",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/news/news.jpeg"],
    },
    alternates: {
      canonical: "/news",
    },
  };
}

export default async function NewsPage() {
  // 1. Parallel Server-Side Data Fetching
  const [newsPostsRes, categoriesRes, trendingRes] = await Promise.all([
    fetchPosts({
      pageCategory: "news-announcements",
      status: "PUBLISHED",
      limit: 100,
      sort: "newest",
    }),
    fetchCategories(),
    fetchPosts({
      status: "PUBLISHED",
      limit: 5,
      sort: "views",
    }),
  ]);

  let allNewsPosts = newsPostsRes?.posts || [];
  const categories = categoriesRes || [];
  const trendingPosts = trendingRes?.posts || [];

  // Fallback sample news posts if backend has no records yet
  if (allNewsPosts.length === 0) {
    allNewsPosts = [
      {
        id: "news-spotlight-1",
        slug: "islamic-principle-justice-foundations-ethics",
        titleEn: "The Islamic Principle of Justice: Foundations, Ethics, and Its Role in Contemporary Societies",
        titleAr: "مبدأ العدالة في الفكر الإسلامي: الأسس والأخلاق ودوره في المجتمعات المعاصرة",
        excerptEn: "Justice (al-'adl) occupies a central position in Islamic thought, extending beyond courts and political institutions into family life, economic relations, and social cohesion.",
        excerptAr: "تحتل العدالة مكانة مركزية في الفكر الإسلامي، متجاوزة المحاكم والمؤسسات السياسية لتمتد إلى الأسرة والعلاقات الاقتصادية والتماسك الاجتماعي.",
        contentEn: "Comprehensive academic treatise exploring the civilizational jurisprudence of social justice...",
        contentAr: "أطروحة أكاديمية شاملة تبحث في فقه العدالة الاجتماعية ومقاصد الشريعة...",
        publishedAt: new Date().toISOString(),
        viewCount: 42,
        category: { nameEn: "Islamic & Shariah Studies", nameAr: "الدراسات الإسلامية والشرعية", slug: "islamic-shariah-studies" },
        pageCategory: { slug: "news-announcements" },
        featuredImageUrl: "/news/news1.avif",
      },
      {
        id: "news-post-2",
        slug: "inauguration-global-research-council-declarations",
        titleEn: "Inauguration of the Global Scholarly Research Council: Strategic Declarations and Resolutions",
        titleAr: "تدشين مجلس البحوث العلمية العالمي: إعلانات وقرارات استراتيجية للأمة",
        excerptEn: "The Ummah Scholars Tribune convenes international delegates to establish an authoritative academic council.",
        excerptAr: "انعقاد المؤتمر التأسيسي لمجلس البحوث العلمية بمشاركة كبار علماء الأمة وباحثيها.",
        contentEn: "Official communiqué detailing resolutions passed during the inaugural summit...",
        contentAr: "البيان الختامي والقرارات الصادرة عن المؤتمر التأسيسي...",
        publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        viewCount: 38,
        category: { nameEn: "Official Resolutions", nameAr: "القرارات والبيانات", slug: "official-resolutions" },
        pageCategory: { slug: "news-announcements" },
        featuredImageUrl: "/news/news2.avif",
      },
      {
        id: "news-post-3",
        slug: "annual-scholarly-fellowship-announcement-2026",
        titleEn: "Annual Scholarly Fellowship Program 2026: Call for Academic Submissions & Applications",
        titleAr: "برنامج الزمالة العلمية لعام 2026: فتح باب التقديم والبحوث الأكاديمية",
        excerptEn: "Applications are now open for senior research fellowships in contemporary Islamic jurisprudence and civilizational thought.",
        excerptAr: "فتح باب التقديم لبرنامج الزمالة البحثية للأكاديميين والباحثين في الفكر الإسلامي المعاصر.",
        contentEn: "Full criteria, eligibility requirements, and application guidelines...",
        contentAr: "الشروط ومعايير القبول ومواعيد التقديم لبرنامج الزمالة...",
        publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        viewCount: 29,
        category: { nameEn: "Academic Initiatives", nameAr: "المبادرات الأكاديمية", slug: "academic-initiatives" },
        pageCategory: { slug: "news-announcements" },
        featuredImageUrl: "/news/news3.avif",
      },
    ];
  }

  // 2. Select primary spotlight post (first item in the collection)
  const spotlightPost = allNewsPosts.length > 0 ? allNewsPosts[0] : null;

  // 3. Exclude the hero spotlight post from the below feed list so it does not duplicate
  const feedPosts = spotlightPost
    ? allNewsPosts.filter((p) => p.id !== spotlightPost.id && (!spotlightPost.slug || p.slug !== spotlightPost.slug))
    : allNewsPosts;

  // JSON-LD Structured Data Schema for News Media
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "News & Announcements - Ummah Scholars Tribune",
    description:
      "Updates on UST news, announcements, scholars, institutions, activities, and developments relevant to the Ummah and the world.",
    url: "https://ummahscholar.com/news",
    publisher: {
      "@type": "Organization",
      name: "Ummah Scholars Tribune",
      url: "https://ummahscholar.com",
      logo: {
        "@type": "ImageObject",
        url: "https://ummahscholar.com/favicon/favicon.jpeg",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen bg-[#FBF9F6] dark:bg-[#0F0D0B]">
        {/* Modern Centered Hero Banner with Exact Arabic & English Content */}
        <NewsHeroBanner spotlightPost={spotlightPost} />

        {/* Interactive Feed Hub with Remaining Posts (Excluding the Spotlight Post) */}
        <NewsInteractiveFeed
          initialPosts={feedPosts}
          categories={categories}
          trendingPosts={trendingPosts.length > 0 ? trendingPosts : allNewsPosts.slice(0, 4)}
        />
      </main>
      <Footer />
    </>
  );
}