"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // এই ইম্পোর্টটি মিস হয়েছিল, এখন ঠিক করে দেওয়া হয়েছে
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function OpinionsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const goldColor = "#C5A059";
  const textColor = "#1A1A1A";

  const categories = ["All", "Contemporary Thought", "Ethics & Morality", "Global Affairs", "Socio-Cultural"];

  const opinionArticles = [
    {
      id: 1,
      title: "Navigating AI and Machine Learning: An Islamic Ethical Paradigm",
      author: "Shaykh Dr. Yusuf Karim",
      role: "Senior Fellow at Islamic Thought Institute",
      date: "June 28, 2026",
      category: "Ethics & Morality",
      excerpt: "As artificial intelligence reshapes human civilization, we must look into the core philosophical frameworks of Islamic jurisprudence to establish clear guidelines for technological guardianship...",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "The Crisis of Individualism and the Revival of Community (Ummah)",
      author: "Prof. Tariq Al-Mansoor",
      role: "Professor of Sociology",
      date: "June 15, 2026",
      category: "Socio-Cultural",
      excerpt: "Modernity prioritizes the hyper-individual, often fracturing collective well-being. This perspective piece analyzes how prophetic social models can restore psychological and communal stability...",
      readTime: "7 min read"
    }
  ];

  const filteredArticles = activeCategory === "All" 
    ? opinionArticles 
    : opinionArticles.filter(article => article.category === activeCategory);

  return (
    <main className="min-h-screen bg-gray-50/50">
      <Navbar />

      {/* হিরো সেকশন */}
      <div className="relative bg-stone-900 py-24 px-6 md:px-12 text-center overflow-hidden border-b" style={{ borderColor: `${goldColor}44` }}>
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/opinions.jpeg" 
            alt="Opinions Banner"
            fill
            priority
            className="object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/1 via-black/5 to-black/1" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.25em] mb-3 block bg-black/30 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/5 w-fit mx-auto" style={{ color: goldColor }}>
            Voices & Perspectives
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-white">
            Opinions & <span style={{ color: goldColor }}>Perspectives</span>
          </h1>
          <p className="text-gray-200 text-sm md:text-base max-w-2xl mx-auto">
            Critical reflections, thought-provoking essays, and contemporary viewpoints written by leading intellectuals and scholars.
          </p>
        </div>
      </div>

      {/* মেইন কন্টেন্ট */}
      <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(category)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border"
              style={{
                backgroundColor: activeCategory === category ? goldColor : 'transparent',
                color: activeCategory === category ? '#ffffff' : textColor,
                borderColor: activeCategory === category ? goldColor : `${goldColor}44`,
              }}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {filteredArticles.map((article) => (
            <article 
              key={article.id}
              className="bg-white rounded-2xl p-6 md:p-8 border shadow-sm flex flex-col md:flex-row gap-6 items-start justify-between"
              style={{ borderColor: `${goldColor}15` }}
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-stone-100" style={{ color: goldColor }}>
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-400">{article.date}</span>
                </div>

                <h3 className="text-xl md:text-2xl font-serif font-bold mb-3" style={{ color: textColor }}>
                  {article.title}
                </h3>

                <div className="mb-4">
                  <p className="text-sm font-bold text-stone-800">{article.author}</p>
                  <p className="text-xs text-gray-500">{article.role}</p>
                </div>

                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              {/* অ্যাকশন বাটন */}
              <div className="w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 flex justify-end shrink-0">
                <Link 
                  href={`/opinions/${article.id}`}
                  className="px-5 py-2.5 rounded-full font-medium text-xs md:text-sm transition-all duration-300 border"
                  style={{ 
                    borderColor: goldColor,
                    color: goldColor,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = goldColor;
                    e.target.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = goldColor;
                  }}
                >
                  Read Full Article
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12">
        <h3 className='text-xl md:text-3xl font-serif font-bold mb-4' style={{ color: goldColor }}>Editorial Policy</h3>
 <p>
 

1. Publication Standards
Ummah Scholars Tribune (UST) is committed to publishing original scholarly, intellectual, and editorial content that reflects its mission, vision, and values. All submissions are expected to meet the following standards:
Be original, unpublished, and not under review or consideration by any other publisher or platform.
Make a meaningful scholarly or intellectual contribution that advances knowledge in its respective field.
Demonstrate sound methodology, reliable evidence, and accurate referencing where applicable.
Maintain high standards of quality, clarity, coherence, and professional presentation.
Uphold academic integrity, respect intellectual property rights, and comply with internationally recognized publication ethics.
Be free from plagiarism, fabrication, falsification, or any form of academic or professional misconduct.
Disclose any actual or potential conflicts of interest that may affect the integrity or objectivity of the work.
</p>
<p className='mt-4'>
2. Editorial Principles and Disclaimer
Ummah Scholars Tribune (UST) is committed to fostering responsible scholarly dialogue and encouraging evidence-based, constructive discussions grounded in mutual respect, intellectual diversity, and professional ethics. The platform does not publish content that promotes personal abuse, hate speech, defamation, discrimination, or incitement.

The opinions and views expressed in published materials are solely those of their respective authors and do not necessarily reflect the official views, editorial policy, or institutional position of Ummah Scholars Tribune (UST).
 </p>

      </div>

      <Footer />
    </main>
  );
}