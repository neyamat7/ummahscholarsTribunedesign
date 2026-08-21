import React from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryBlogListClient from "@/components/blog/CategoryBlogListClient";
import { fetchCategories, fetchPosts } from "@/lib/api";

/**
 * Dynamic SEO Metadata for Category Listing Page (/categories/[categorySlug])
 */
export async function generateMetadata({ params }) {
  const { categorySlug } = await params;
  const categories = await fetchCategories();
  const category = (categories || []).find(
    (c) => c.slug === categorySlug || c.id === categorySlug
  );

  if (!category) {
    return {
      title: "Category Not Found | Ummah Scholars Tribune",
      description: "The requested scholarly discipline could not be found.",
    };
  }

  const title = `${category.nameEn || category.nameAr || "Category"} | Ummah Scholars Tribune`;
  const description =
    category.descriptionEn ||
    category.descriptionAr ||
    `Explore peer-curated scholarly articles and research studies in ${category.nameEn || category.nameAr}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://ummahscholar.com/categories/${categorySlug}`,
      siteName: "Ummah Scholars Tribune",
      images: [
        {
          url: "/home.jpeg",
          width: 1200,
          height: 630,
          alt: category.nameEn || "Category",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/home.jpeg"],
    },
    alternates: {
      canonical: `/categories/${categorySlug}`,
    },
  };
}

export default async function CategoryPostListPage({ params }) {
  const { categorySlug } = await params;

  // 1. Fetch all categories and find matching category
  const allCategories = await fetchCategories();
  const category = (allCategories || []).find(
    (c) => c.slug === categorySlug || c.id === categorySlug
  );

  if (!category) {
    notFound();
  }

  // 2. Fetch posts belonging to this category & trending posts in parallel
  const [postsRes, trendingRes] = await Promise.all([
    fetchPosts({
      category: category.id,
      status: "PUBLISHED",
      limit: 60,
      sort: "newest",
    }),
    fetchPosts({
      status: "PUBLISHED",
      limit: 4,
      sort: "views",
    }),
  ]);

  const posts = postsRes?.posts || [];
  const trendingPosts = trendingRes?.posts || [];

  // JSON-LD Structured Data Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.nameEn || category.nameAr} Articles`,
    description: category.descriptionEn || category.descriptionAr || "",
    url: `https://ummahscholar.com/categories/${categorySlug}`,
    publisher: {
      "@type": "Organization",
      name: "Ummah Scholars Tribune",
      logo: {
        "@type": "ImageObject",
        url: "https://ummahscholar.com/icon.jpeg",
      },
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: post.titleEn || post.titleAr,
        url: `https://ummahscholar.com/${post.pageCategory?.slug || "research-studies"}/${post.slug}`,
      })),
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation */}
      <Navbar />

      {/* Main Interactive Category Post Listing */}
      <div className="flex-grow">
        <CategoryBlogListClient
          category={category}
          initialPosts={posts}
          allCategories={allCategories || []}
          trendingPosts={trendingPosts}
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
