import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeroBanner from "@/components/section-page/SectionHeroBanner";
import SectionInteractiveFeed from "@/components/section-page/SectionInteractiveFeed";
import { fetchCategories, fetchPosts } from "@/lib/api";

/**
 * Dynamic SEO Metadata for Opinions & Perspectives Page
 */
export async function generateMetadata() {
  const title = "Opinions & Perspectives | الآراء والرؤى | Ummah Scholars Tribune";
  const description =
    "Responsible perspectives and analyses engaging with intellectual, societal, Ummah-related, and global issues while advancing awareness, dialogue, and reform.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://ummahscholar.com/opinions",
      siteName: "Ummah Scholars Tribune",
      images: [
        {
          url: "/opinions.jpeg",
          width: 1200,
          height: 630,
          alt: "Opinions & Perspectives",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opinions.jpeg"],
    },
    alternates: {
      canonical: "/opinions",
    },
  };
}

export default async function OpinionsPage() {
  // 1. Parallel Server-Side Data Fetching
  const [opinionsPostsRes, categoriesRes, trendingRes] = await Promise.all([
    fetchPosts({
      pageCategory: "opinions-perspectives",
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

  let allPosts = opinionsPostsRes?.posts || [];
  const categories = categoriesRes || [];
  const trendingPosts = trendingRes?.posts || [];

  // Fallback sample opinion posts if backend has no records yet
  if (allPosts.length === 0) {
    allPosts = [
      {
        id: "opinion-spotlight-1",
        slug: "navigating-ai-machine-learning-islamic-ethical-paradigm",
        titleEn: "Navigating Artificial Intelligence & Machine Learning: An Islamic Ethical Paradigm",
        titleAr: "الذكاء الاصطناعي وتعلم الآلة: نحو نموذج إرشادي وأخلاقي إسلامي معاصر",
        excerptEn: "As artificial intelligence reshapes human civilization, we must look into the core philosophical frameworks of Islamic jurisprudence to establish clear ethical guidelines.",
        excerptAr: "مع التحول الجذري الذي يفرضه الذكاء الاصطناعي على الحضارة الإنسانية، تبرز الحاجة الماسة إلى تأصيل ضوابط أخلاقية وفقهية ترشد التطور التقني.",
        contentEn: "Detailed perspective on technological guardianship and Islamic ethical theory...",
        contentAr: "قراءة فكرية متعمقة في أخلاقيات الذكاء الاصطناعي ومقاصد الشريعة...",
        publishedAt: new Date().toISOString(),
        viewCount: 55,
        category: { nameEn: "Ethics & Morality", nameAr: "الأخلاق والقيم الفكرية", slug: "ethics-morality" },
        pageCategory: { slug: "opinions-perspectives" },
        featuredImageUrl: "/opinions.jpeg",
      },
      {
        id: "opinion-post-2",
        slug: "crisis-individualism-revival-community-ummah",
        titleEn: "The Crisis of Hyper-Individualism and the Renewal of Prophetic Community (Ummah)",
        titleAr: "أزمة الفردانية المفرطة وإعادة بناء الوعي الجمعي في ضوء الهدي النبوي",
        excerptEn: "Modernity often prioritizes extreme individualism, fracturing social well-being. This perspective piece analyzes how prophetic social models restore stability.",
        excerptAr: "تسببت الحداثة في ترسيخ فردانية مفرطة أضرت بالنسيج الاجتماعي؛ ويستعرض هذا المقال نماذج التكافل والتماسك في الفكر الإسلامي.",
        contentEn: "Comprehensive essay examining communal solidarity and social cohesion...",
        contentAr: "مقال فكري يستشرف سبل استعادة التوازن الاجتماعي وبناء مجتمع متماسك...",
        publishedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        viewCount: 41,
        category: { nameEn: "Socio-Cultural Thought", nameAr: "الفكر الاجتماعي والثقافي", slug: "socio-cultural-thought" },
        pageCategory: { slug: "opinions-perspectives" },
        featuredImageUrl: "/opinions.jpeg",
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
    name: "Opinions & Perspectives - Ummah Scholars Tribune",
    description:
      "Responsible perspectives and analyses engaging with intellectual, societal, Ummah-related, and global issues while advancing awareness, dialogue, and reform.",
    url: "https://ummahscholar.com/opinions",
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
        {/* Opinions Hero Banner with Specified Bilingual Title & Description */}
        <SectionHeroBanner
          pageTitleEn="Opinions & Perspectives"
          pageTitleAr="الآراء والرؤى"
          pageTitleHighlightEn="Perspectives"
          pageTitleHighlightAr="والرؤى"
          heroDescriptionAr="رؤى وتحليلات مسؤولة تقرأ قضايا الفكر والمجتمع والأمة والعالم، وتسهم في بناء الوعي وترسيخ الحوار واستشراف الإصلاح."
          heroDescriptionEn="Responsible perspectives and analyses engaging with intellectual, societal, Ummah-related, and global issues while advancing awareness, dialogue, and reform."
          pageCategorySlug="opinions-perspectives"
          bgImage="/opinions.jpeg"
          spotlightPost={spotlightPost}
          badgeTextEn="Featured Perspective"
          badgeTextAr="رأي تحريري مختار"
          searchPlaceholderEn="Search essays, thought-leadership pieces, and analyses..."
          searchPlaceholderAr="ابحث في الرؤى الفكرية والمقالات والتحليلات النقدية..."
          archiveLabelEn="Opinions Archive"
          archiveLabelAr="أرشيف الآراء والرؤى"
        />

        {/* Interactive Feed Hub with Remaining Opinions Posts */}
        <SectionInteractiveFeed
          initialPosts={feedPosts}
          categories={categories}
          trendingPosts={trendingPosts.length > 0 ? trendingPosts : allPosts.slice(0, 4)}
          pageCategorySlug="opinions-perspectives"
          deskConfig={{
            titleEn: "Columnists & Opinion Desk",
            titleAr: "منبر الكتّاب والمقالات الفكرية",
            descEn: "Pitch your essays, intellectual perspectives, and thought-leadership articles directly to the editorial team:",
            descAr: "لتقديم المقالات الفكرية والرؤى التحليلية والمشاركات الفكرية لهيئة التحرير:",
            email: "opinions@ummahscholar.com",
            buttonTextEn: "Copy Columnist Email",
            buttonTextAr: "نسخ بريد هيئة المقالات",
            iconName: "sparkles",
          }}
          searchPlaceholderEn="Filter opinions by author, title, or topic..."
          searchPlaceholderAr="تصفية الآراء حسب الكاتب، العنوان، أو الموضوع..."
        />
      </main>
      <Footer />
    </>
  );
}