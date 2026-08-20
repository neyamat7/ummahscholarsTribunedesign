import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoriesDirectoryClient from "@/components/category/CategoriesDirectoryClient";
import { fetchCategories } from "@/lib/api";

/**
 * Dynamic SEO Metadata for Categories Directory Page
 */
export async function generateMetadata() {
  const categories = await fetchCategories({ type: "POST" });
  const categoryCount = Array.isArray(categories) ? categories.length : 0;

  const title = "Pillars of Scholarly Inquiry & Academic Disciplines | Ummah Scholars Tribune";
  const description =
    "Explore the complete directory of scholarly disciplines, Islamic studies, civilizational research, and contemporary intellectual pillars curated by the Ummah Scholars Tribune.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://ummahscholar.com/categories",
      siteName: "Ummah Scholars Tribune",
      images: [
        {
          url: "/home.jpeg",
          width: 1200,
          height: 630,
          alt: "Ummah Scholars Tribune Categories Directory",
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
      canonical: "/categories",
    },
  };
}

export default async function CategoriesPage() {
  const rawCategories = await fetchCategories({ type: "POST" });
  const categories = Array.isArray(rawCategories) ? rawCategories : [];

  // JSON-LD Structured Data Schema for CollectionPage / ItemList
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Pillars of Scholarly Inquiry & Categories Directory",
    description:
      "A curated directory of academic disciplines and research pillars published by Ummah Scholars Tribune.",
    url: "https://ummahscholar.com/categories",
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
      itemListElement: categories.map((cat, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: cat.nameEn || cat.nameAr || "Category",
        url: `https://ummahscholar.com/blog/${cat.slug}`,
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

      {/* Main Interactive Categories Directory */}
      <div className="flex-grow">
        <CategoriesDirectoryClient initialCategories={categories} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
