import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeroBanner from "@/components/section-page/SectionHeroBanner";
import SectionInteractiveFeed from "@/components/section-page/SectionInteractiveFeed";
import { fetchCategories, fetchPosts } from "@/lib/api";

/**
 * Dynamic SEO Metadata for Research & Studies Page
 */
export async function generateMetadata() {
  const title = "Research & Studies | البحوث والدراسات | Ummah Scholars Tribune";
  const description =
    "A platform for rigorous research and studies across diverse fields of knowledge, advancing understanding and addressing the concerns of the Ummah, humanity, and contemporary life.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://ummahscholar.com/research",
      siteName: "Ummah Scholars Tribune",
      images: [
        {
          url: "/research.jpeg",
          width: 1200,
          height: 630,
          alt: "Research & Studies",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/research.jpeg"],
    },
    alternates: {
      canonical: "/research",
    },
  };
}

export default async function ResearchPage() {
  // 1. Parallel Server-Side Data Fetching
  const [researchPostsRes, categoriesRes, trendingRes] = await Promise.all([
    fetchPosts({
      pageCategory: "research-studies",
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

  let allPosts = researchPostsRes?.posts || [];
  const categories = categoriesRes || [];
  const trendingPosts = trendingRes?.posts || [];

  // Fallback sample research posts if backend has no records yet
  if (allPosts.length === 0) {
    allPosts = [
      {
        id: "research-spotlight-1",
        slug: "contemporary-islamic-microfinance-models-empirical-study",
        titleEn: "Contemporary Islamic Microfinance Models: An Empirical Study of Shariah Governance in South Asia",
        titleAr: "نماذج التمويل الأصغر الإسلامي المعاصر: دراسة ميدانية في حوكمة الشريعة في جنوب آسيا",
        excerptEn: "This rigorous treatise examines empirical microfinance structures through the lens of Shariah principles, highlighting empirical data from grassroots Muslim communities.",
        excerptAr: "تبحث هذه الدراسة الأكاديمية الرصينة في هياكل التمويل الأصغر ومقاصد الشريعة الاقتصادية عبر بيانات ميدانية من المجتمعات المعاصرة.",
        contentEn: "Comprehensive academic treatise exploring empirical models...",
        contentAr: "أطروحة أكاديمية شاملة تبحث في نماذج التمويل الأصغر المعاصر...",
        publishedAt: new Date().toISOString(),
        viewCount: 64,
        category: { nameEn: "Islamic and Foundational Studies", nameAr: "الدراسات الإسلامية والتأصيلية", slug: "islamic-foundational-studies" },
        pageCategory: { slug: "research-studies" },
        featuredImageUrl: "/research.jpeg",
      },
      {
        id: "research-post-2",
        slug: "urbanization-social-cohesion-sociological-analysis",
        titleEn: "Rapid Urbanization and Social Cohesion: A Sociological Analysis of Community Structures",
        titleAr: "التحضر السريع والتماسك الاجتماعي: تحليل سوسيولوجي للبنى المجتمعية والهوية",
        excerptEn: "An in-depth sociological study exploring how modern urban sprawl impacts collective identity, family ties, and moral frameworks.",
        excerptAr: "دراسة سوسيولوجية معمقة تبحث في أثر التحضر المعاصر على الهوية الجمعية والروابط الأسرية والأخلاقية للأمة.",
        contentEn: "Sociological analysis detailing community cohesion...",
        contentAr: "تحليل سوسيولوجي مفصل حول التماسك المجتمعي والهوية...",
        publishedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        viewCount: 48,
        category: { nameEn: "Humanities and Social Studies", nameAr: "الدراسات الإنسانية والاجتماعية", slug: "humanities-social-studies" },
        pageCategory: { slug: "research-studies" },
        featuredImageUrl: "/research.jpeg",
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
    name: "Research & Studies - Ummah Scholars Tribune",
    description:
      "A platform for rigorous research and studies across diverse fields of knowledge, advancing understanding and addressing the concerns of the Ummah, humanity, and contemporary life.",
    url: "https://ummahscholar.com/research",
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
        {/* Research Hero Banner with Specified Bilingual Title & Description */}
        <SectionHeroBanner
          pageTitleEn="Research & Studies"
          pageTitleAr="البحوث والدراسات"
          pageTitleHighlightEn="Studies"
          pageTitleHighlightAr="والدراسات"
          heroDescriptionAr="فضاءٌ للبحوث والدراسات العلمية الرصينة في مختلف حقول المعرفة، بما يعمّق الفهم ويخدم قضايا الأمة والإنسان والعصر."
          heroDescriptionEn="A platform for rigorous research and studies across diverse fields of knowledge, advancing understanding and addressing the concerns of the Ummah, humanity, and contemporary life."
          pageCategorySlug="research-studies"
          bgImage="/research.jpeg"
          spotlightPost={spotlightPost}
          badgeTextEn="Major Research"
          badgeTextAr="دراسة محكّمة"
          searchPlaceholderEn="Search research papers, empirical studies, and academic treatises..."
          searchPlaceholderAr="ابحث في الأوراق البحثية والدراسات والأطروحات الأكاديمية..."
          archiveLabelEn="Research Archive"
          archiveLabelAr="أرشيف البحوث والدراسات"
        />

        {/* Interactive Feed Hub with Remaining Research Posts */}
        <SectionInteractiveFeed
          initialPosts={feedPosts}
          categories={categories}
          trendingPosts={trendingPosts.length > 0 ? trendingPosts : allPosts.slice(0, 4)}
          pageCategorySlug="research-studies"
          deskConfig={{
            titleEn: "Academic Submissions Desk",
            titleAr: "هيئة التحرير والبحوث العلمية",
            descEn: "Submit your scholarly papers, treatises, and peer-review proposals directly to the academic board:",
            descAr: "لتقديم الأوراق البحثية والأطروحات الأكاديمية ومقترحات التحكيم العلمي:",
            email: "research@ummahscholar.com",
            buttonTextEn: "Copy Submission Email",
            buttonTextAr: "نسخ بريد هيئة البحوث",
            iconName: "book",
          }}
          searchPlaceholderEn="Filter research papers by title, topic, or methodology..."
          searchPlaceholderAr="تصفية الأبحاث حسب العنوان، الموضوع، أو المنهجية..."
        />
      </main>
      <Footer />
    </>
  );
}