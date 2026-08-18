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
import NewsletterSection from "@/components/NewsletterSection";
import SubHeroSection from "@/components/SubHeroSection";
import Footer from "@/components/Footer";
import {
  fetchCategories,
  fetchPostsByPageCategory,
  fetchLatestPosts,
} from "@/lib/api";

/**
 * Creates a structured dummy post placeholder when a category has fewer posts than required
 */
function createDummyPost(index, sectionNameEn, sectionNameAr, defaultImage = "/news/news1.avif") {
  return {
    id: `dummy-${sectionNameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
    slug: "",
    isDummy: true,
    titleEn: `Academic Treatise in ${sectionNameEn} (Upcoming #${index})`,
    titleAr: `بحث علمي قادم في ${sectionNameAr} (قيد النشر #${index})`,
    excerptEn:
      "A peer-reviewed academic paper is undergoing editorial curation and will be published live soon.",
    excerptAr:
      "دراسة علمية محكّمة قيد المراجعة والتحرير للنشر قريباً على منبر علماء الأمة.",
    category: { nameEn: sectionNameEn, nameAr: sectionNameAr },
    pageCategory: { nameEn: sectionNameEn, nameAr: sectionNameAr },
    author: { nameEn: "Editorial Board", nameAr: "هيئة التحرير" },
    date: "Coming Soon",
    featuredImage: { url: defaultImage },
    image: defaultImage,
    location: "Ummah Scholars Tribune",
    isOnline: index % 2 === 1,
  };
}

/**
 * Ensures an array of posts has at least `requiredCount` items by padding with dummy cards
 */
function ensurePostCount(posts, requiredCount, sectionNameEn, sectionNameAr, defaultImage) {
  const list = Array.isArray(posts) ? [...posts] : [];
  let index = 1;
  while (list.length < requiredCount) {
    list.push(createDummyPost(index, sectionNameEn, sectionNameAr, defaultImage));
    index++;
  }
  return list.slice(0, requiredCount);
}

export default async function Home() {
  // Parallel asynchronous fetching on the server
  const [
    allCategories,
    rawResearchPosts,
    rawOpinionPosts,
    rawNewsPosts,
    rawEventPosts,
    rawLatestPosts,
  ] = await Promise.all([
    fetchCategories({ type: "POST" }),
    fetchPostsByPageCategory("research-studies", 4),
    fetchPostsByPageCategory("opinions-perspectives", 3),
    fetchPostsByPageCategory("news-announcements", 4),
    fetchPostsByPageCategory("events-initiatives", 3),
    fetchLatestPosts(5),
  ]);

  // Filter POST categories for the "Pillars of Scholarly Inquiry" section
  const postCategories = (allCategories || []).filter(
    (c) => (c.type || "").toUpperCase() === "POST"
  );

  // Pad each section with dummy cards if there are fewer posts than required
  const researchPosts = ensurePostCount(
    rawResearchPosts,
    4,
    "Research & Studies",
    "البحوث والدراسات",
    "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80"
  );

  const opinionPosts = ensurePostCount(
    rawOpinionPosts,
    3,
    "Opinions & Perspectives",
    "الآراء ووجهات النظر",
    "/news/news1.avif"
  );

  const newsPosts = ensurePostCount(
    rawNewsPosts,
    4,
    "News & Announcements",
    "الأخبار والإعلانات",
    "/news/news1.avif"
  );

  const eventPosts = ensurePostCount(
    rawEventPosts,
    3,
    "Events & Initiatives",
    "الفعاليات والمبادرات",
    "/news/news1.avif"
  );

  const latestPosts = ensurePostCount(
    rawLatestPosts,
    5,
    "Latest Studies",
    "أحدث الدراسات",
    "/news/news1.avif"
  );

  return (
    <div className="min-h-screen bg-[#F7F4EE] dark:bg-[#0F0D0B] text-[#1C1917] dark:text-[#F5F1E8] font-sans antialiased transition-colors overflow-x-clip">
      {/* 1. Sticky 3-Zone Navigation Bar */}
      <Navbar />

      {/* 2. Asymmetric Editorial Hero Banner */}
      <HeroSlider />

      {/* 3. Sub-Hero Title & Tagline Block */}
      <SubHeroSection />

      {/* 4. Bilingual Mission Statement & Video Carousel Row */}
      <section className="max-w-7xl mx-auto px-5 py-6">
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6">
          <KeyApplications />
          <SliderSwiper />
        </div>
      </section>

      {/* 5. Academic Pillars Bento Grid (Live POST Categories + dynamic DB icons + See All button) */}
      <ResearchFeatures categories={postCategories} />

      {/* 6. Upcoming Events Preview Strip (Live Events & Initiatives page category) */}
      <UpcomingEvents events={eventPosts} />

      {/* 7. Pin-Scrubbed Category Showcase (Research & Studies: exactly 4 posts) */}
      <CategoryShowcase
        titleEn="Research & Studies"
        titleAr="البحوث والدراسات"
        descriptionEn="Peer-reviewed academic research on classical jurisprudence, legal methodologies, and contemporary governance."
        descriptionAr="بحوث أكاديمية محكّمة حول الفقه الكلاسيكي والمناهج القانونية والحوكمة المعاصرة."
        categorySlug="research-studies"
        posts={researchPosts}
      />

      {/* 8. Opinions Spotlight (Opinions & Perspectives: exactly 3 posts) */}
      <OpinionsSection
        titleEn="Opinions & Perspectives"
        titleAr="الآراء ووجهات النظر"
        descriptionEn="Thoughtful commentaries and analytical perspectives from esteemed scholars on societal challenges."
        descriptionAr="تعليقات فكرية ووجهات نظر تحليلية من كبار العلماء حول التحديات المجتمعية."
        categorySlug="opinions-perspectives"
        posts={opinionPosts}
      />

      {/* 9. News & Announcements (News & Announcements: exactly 4 posts) */}
      <NewsSection
        titleEn="News & Announcements"
        titleAr="الأخبار والإعلانات"
        descriptionEn="Updates on international scholarly conferences, publications, academic initiatives, and tribune events."
        descriptionAr="مستجدات المؤتمرات العلمية الدولية والمنشورات والمبادرات الأكاديمية وفعاليات المنبر."
        categorySlug="news-announcements"
        posts={newsPosts}
      />

      {/* 10. Latest From the Tribune (Aggregated 5 Latest Posts Spotlight) */}
      <LatestBlogsSection posts={latestPosts} />

      {/* 11. Search & Newsletter Callout Section */}
      <NewsletterSection />

      {/* 12. Scholarly Footer */}
      <Footer />
    </div>
  );
}
