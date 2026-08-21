import React from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PostDetailClient from "@/components/post/PostDetailClient";
import { fetchPostBySlug, fetchPostComments, fetchRelatedPosts } from "@/lib/api";

/**
 * Dynamic SEO Metadata Generator for Next.js App Router
 */
export async function generateMetadata({ params }) {
  const { slug, pageCategory } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | Ummah Scholars Tribune",
      description: "The requested scholarly article could not be found.",
    };
  }

  const title = post.metaTitleEn || post.titleEn || post.titleAr || "Scholarly Article";
  const description =
    post.metaDescriptionEn ||
    post.excerptEn ||
    post.excerptAr ||
    "Read this in-depth inquiry on Ummah Scholars Tribune.";
  const ogImage = post.featuredImageUrl || post.featuredImage?.url || "/home.jpeg";

  return {
    title: `${title} | Ummah Scholars Tribune`,
    description,
    openGraph: {
      title: `${title} | Ummah Scholars Tribune`,
      description,
      url: `https://ummahscholar.com/${pageCategory}/${slug}`,
      siteName: "Ummah Scholars Tribune",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "article",
      publishedTime: post.publishedAt || post.createdAt,
      authors: [post.author?.name || post.author?.nameAr || "Dr. Zobair Sultan Rabbani"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Ummah Scholars Tribune`,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `/${pageCategory}/${slug}`,
    },
  };
}

export default async function PostDetailPage({ params }) {
  const { slug, pageCategory } = await params;

  // Fetch post details
  const post = await fetchPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch comments and related posts in parallel
  const [commentsRes, relatedPosts] = await Promise.all([
    fetchPostComments(post.id),
    fetchRelatedPosts({
      categoryId: post.category?.id || post.categoryId,
      pageCategory: pageCategory || post.pageCategory?.slug,
      currentPostId: post.id,
      limit: 3,
    }),
  ]);

  // JSON-LD Structured Data Schema for Article
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.titleEn || post.titleAr || "Scholarly Article",
    description: post.excerptEn || post.excerptAr || "",
    image: post.featuredImageUrl || post.featuredImage?.url || "https://ummahscholar.com/home.jpeg",
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: {
      "@type": "Person",
      name: post.author?.name || post.author?.nameAr || "Dr. Zobair Sultan Rabbani",
      url: "https://ummahscholar.com/about",
    },
    publisher: {
      "@type": "Organization",
      name: "Ummah Scholars Tribune",
      logo: {
        "@type": "ImageObject",
        url: "https://ummahscholar.com/logo/logo.jpeg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://ummahscholar.com/${pageCategory}/${slug}`,
    },
  };

  return (
    <>
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen flex flex-col bg-[#FBF9F6] dark:bg-[#0F0D0B]">
        <Navbar />

        <div className="flex-1">
          <PostDetailClient
            post={post}
            pageCategorySlug={pageCategory}
            initialComments={commentsRes.comments}
            relatedPosts={relatedPosts}
          />
        </div>

        <Footer />
      </div>
    </>
  );
}
