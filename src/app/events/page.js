import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeroBanner from "@/components/section-page/SectionHeroBanner";
import SectionInteractiveFeed from "@/components/section-page/SectionInteractiveFeed";
import { fetchCategories, fetchPosts } from "@/lib/api";

/**
 * Dynamic SEO Metadata for Events & Initiatives Page
 */
export async function generateMetadata() {
  const title = "Events & Initiatives | الفعاليات والمبادرات | Ummah Scholars Tribune";
  const description =
    "Academic, educational, cultural, faith-inspired, humanitarian, and community engagement that translates knowledge and values into impactful initiatives and participation.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://ummahscholar.com/events",
      siteName: "Ummah Scholars Tribune",
      images: [
        {
          url: "/events.jpeg",
          width: 1200,
          height: 630,
          alt: "Events & Initiatives",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/events.jpeg"],
    },
    alternates: {
      canonical: "/events",
    },
  };
}

export default async function EventsPage() {
  // 1. Parallel Server-Side Data Fetching
  const [eventsPostsRes, categoriesRes, trendingRes] = await Promise.all([
    fetchPosts({
      pageCategory: "events-initiatives",
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

  let allPosts = eventsPostsRes?.posts || [];
  const categories = categoriesRes || [];
  const trendingPosts = trendingRes?.posts || [];

  // Fallback sample event posts if backend has no records yet
  if (allPosts.length === 0) {
    allPosts = [
      {
        id: "events-spotlight-1",
        slug: "annual-scholarly-book-fair-manuscript-exhibition-2026",
        titleEn: "Annual Scholarly Book Fair & Manuscript Exhibition 2026: Illuminating Classical Heritage",
        titleAr: "المعرض السنوي للكتاب العلمي والمخطوطات 2026: إحياء التراث وتكريم أعلام الأمة",
        excerptEn: "A grand international gathering exhibiting classical Islamic manuscripts, newly published academic treatises, and scholarly panel sessions.",
        excerptAr: "ملتقى دولي جامع يضم معرضاً للمخطوطات النادرة وأحدث الإصدارات المحكمة وجلسات حوارية مع كبار علماء الأمة وباحثيها.",
        contentEn: "Comprehensive programme for the annual book fair and manuscript symposium...",
        contentAr: "البرنامج الكامل لفعاليات معرض الكتاب العلمي وندوات تحقيق التراث...",
        publishedAt: new Date().toISOString(),
        viewCount: 72,
        category: { nameEn: "Conferences & Symposia", nameAr: "المؤتمرات والندوات", slug: "conferences-symposia" },
        pageCategory: { slug: "events-initiatives" },
        featuredImageUrl: "/events.jpeg",
      },
      {
        id: "events-post-2",
        slug: "international-symposium-classical-text-digitization",
        titleEn: "International Symposium on Classical Text Preservation & Digital Archiving",
        titleAr: "الندوة الدولية لرقمنة النصوص التراثية وحفظ المخطوطات القديمة",
        excerptEn: "Archivists and computational linguists gather to establish ethical digital archives of classical library collections.",
        excerptAr: "ندوة علمية تجمع خبراء الأرشفة الرقمية واللغويات الحاسوبية لحفظ التراث المخطوط وإتاحته للباحثين حول العالم.",
        contentEn: "Proceedings and outcomes of the international digital archiving symposium...",
        contentAr: "أوراق العمل والتوصيات الصادرة عن ندوة رقمنة التراث العلمي...",
        publishedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
        viewCount: 46,
        category: { nameEn: "Academic Initiatives", nameAr: "المبادرات العلمية", slug: "academic-initiatives" },
        pageCategory: { slug: "events-initiatives" },
        featuredImageUrl: "/events.jpeg",
      },
    ];
  }

  // 2. Select primary spotlight post (first item in the collection)
  const spotlightPost = allPosts.length > 0 ? allPosts[0] : null;

  // 3. Exclude the hero spotlight post from the below feed list so it does not duplicate
  const feedPosts = spotlightPost
    ? allPosts.filter(
        (p) => p.id !== spotlightPost.id && (!spotlightPost.slug || p.slug !== spotlightPost.slug)
      )
    : allPosts;

  // JSON-LD Structured Data Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Events & Initiatives - Ummah Scholars Tribune",
    description:
      "Academic, educational, cultural, faith-inspired, humanitarian, and community engagement that translates knowledge and values into impactful initiatives and participation.",
    url: "https://ummahscholar.com/events",
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
        {/* Events Hero Banner with Specified Bilingual Title & Description */}
        <SectionHeroBanner
          pageTitleEn="Events & Initiatives"
          pageTitleAr="الفعاليات والمبادرات"
          pageTitleHighlightEn="Initiatives"
          pageTitleHighlightAr="والمبادرات"
          heroDescriptionAr="حراكٌ علمي وتعليمي وثقافي ودعوي وإنساني ومجتمعي، يجسّد المعرفة والقيم في مبادراتٍ ومشاركاتٍ ذات أثر."
          heroDescriptionEn="Academic, educational, cultural, faith-inspired, humanitarian, and community engagement that translates knowledge and values into impactful initiatives and participation."
          pageCategorySlug="events-initiatives"
          bgImage="/events.jpeg"
          spotlightPost={spotlightPost}
          badgeTextEn="Flagship Initiative"
          badgeTextAr="مبادرة رئيسية"
          searchPlaceholderEn="Search conferences, symposiums, and academic initiatives..."
          searchPlaceholderAr="ابحث في المؤتمرات والندوات ومعارض الكتب والمبادرات العلمية..."
          archiveLabelEn="Events Archive"
          archiveLabelAr="أرشيف الفعاليات والمبادرات"
        />

        {/* Interactive Feed Hub with Remaining Event Posts */}
        <SectionInteractiveFeed
          initialPosts={feedPosts}
          categories={categories}
          trendingPosts={trendingPosts.length > 0 ? trendingPosts : allPosts.slice(0, 4)}
          pageCategorySlug="events-initiatives"
          deskConfig={{
            titleEn: "Events & Coordination Secretariat",
            titleAr: "أمانة الفعاليات والتنسيق الأكاديمي",
            descEn: "For symposium coordination, institutional partnerships, and event co-hosting inquiries:",
            descAr: "للتنسيق العلمي وعقد الشراكات المؤسسية واستضافة الفعاليات والمؤتمرات المشتركة:",
            email: "events@ummahscholar.com",
            buttonTextEn: "Copy Secretariat Email",
            buttonTextAr: "نسخ بريد أمانة الفعاليات",
            iconName: "calendar",
          }}
          searchPlaceholderEn="Filter events by name, location, or format..."
          searchPlaceholderAr="تصفية الفعاليات حسب العنوان، الموقع، أو نوع المبادرة..."
        />
      </main>
      <Footer />
    </>
  );
}