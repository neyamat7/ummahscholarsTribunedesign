"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("Upcoming");

  const goldColor = "#C5A059";
  const textColor = "#1A1A1A";

  // ইভেন্টের ডামি ডাটা (বই ও একাডেমিক থিমে সাজানো)
  const eventsData = [
    {
      id: 1,
      title: "Annual Islamic Book Fair & Manuscript Exhibition",
      date: "July 25, 2026",
      time: "10:00 AM - 08:00 PM",
      location: "Main Academic Hall & Library Lounge",
      type: "Upcoming",
      description: "Join us for a grand exhibition of classical Islamic manuscripts, newly published research journals, and interactive book discussion circles with renowned authors.",
    },
    {
      id: 2,
      title: "Distribution of Educational Kits & Islamic Literature",
      date: "August 05, 2026",
      time: "09:00 AM",
      location: "Community Center Auditorium",
      type: "Upcoming",
      description: "An initiative focused on providing academic books, essential learning tools, and foundational Islamic literature to students and families in need.",
    },
    {
      id: 3,
      title: "International Seminar on Classical Text Preservation",
      date: "May 12, 2026",
      time: "Completed",
      location: "Online (Zoom Webinar)",
      type: "Past",
      description: "A successful global gathering of archivists and scholars discussing modern methodologies for digitizing and preserving ancient Islamic library texts.",
    }
  ];

  // ফিল্টারিং লজিক (Upcoming বনাম Past ইভেন্ট)
  const filteredEvents = eventsData.filter(event => event.type === activeTab);

  return (
    <main className="min-h-screen bg-gray-50/50">
      {/* নেভিগেশন বার */}
      <Navbar />

     {/* ইমেজ সেকশন ছোট করা হয়েছে (কন্ট্যাক্ট পেজের মতো প্যাডিং ব্যবহার করে) */}
<div className="relative bg-stone-950 py-20 px-6 md:px-12 text-center overflow-hidden border-b" style={{ borderColor: `${goldColor}44` }}>
  
  {/* ব্যাকগ্রাউন্ড বইয়ের ছবি */}
  <div className="absolute inset-0 w-full h-full">
    <Image
      src="/events.jpeg" 
      alt="Islamic Books Background"
      fill
      priority
      className="opacity-45 object-cover object-center" 
    />
    {/* হালকা স্মুথ ওভারলে */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
  </div>

  {/* হেডার কনটেন্ট */}
  <div className="relative z-10 max-w-2xl mx-auto">
    <span 
      className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] mb-4 inline-block bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10" 
      style={{ color: goldColor }}
    >
      Social & Academic Initiatives
    </span>
    
    <h1 className="text-2xl md:text-4xl font-serif font-bold mb-3 text-white drop-shadow-md">
      Events & <span style={{ color: goldColor }}>Initiatives</span>
    </h1>
    
    <p className="text-gray-200 text-xs md:text-sm max-w-lg mx-auto leading-relaxed drop-shadow-sm opacity-90">
      Stay updated with our upcoming seminars, book fairs, and community welfare initiatives designed to spread knowledge and support the Ummah.
    </p>
  </div>
</div>

      {/* মেইন কন্টেন্ট সেকশন */}
      <div className="w-full max-w-4xl mx-auto px-6 py-12">
        
        {/* ফিল্টার ট্যাব (Upcoming vs Past) */}
        <div className="flex justify-center border-b mb-12" style={{ borderColor: `${goldColor}22` }}>
          {["Upcoming", "Past"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-8 py-3 text-sm font-medium transition-all duration-300 relative focus:outline-none -mb-[1px]"
              style={{ color: activeTab === tab ? goldColor : '#6B7280' }}
            >
              {tab} Initiatives
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: goldColor }} />
              )}
            </button>
          ))}
        </div>

        {/* ইভেন্টカード লিস্ট */}
        <div className="space-y-6">
          {filteredEvents.map((event) => (
            <div 
              key={event.id}
              className="bg-white rounded-2xl p-6 md:p-8 border shadow-sm hover:shadow-md transition-all duration-300"
              style={{ borderColor: `${goldColor}15` }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                {/* তারিখ ও সময় */}
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold" style={{ color: goldColor }}>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{event.date}</span>
                  <span className="text-gray-300">|</span>
                  <span>{event.time}</span>
                </div>

                {/* লোকেশন ট্যাগ */}
                <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{event.location}</span>
                </div>
              </div>

              {/* টাইটেল এবং ডেসক্রিপশন */}
              <h3 className="text-xl md:text-2xl font-serif font-bold mb-3" style={{ color: textColor }}>
                {event.title}
              </h3>
              
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                {event.description}
              </p>

              {/* অ্যাকশন বাটন */}
              {event.type === "Upcoming" && (
                <div className="flex justify-end">
                  <Link 
                    href={`/events/register/${event.id}`}
                    className="px-6 py-2.5 rounded-full font-medium text-xs md:text-sm text-white transition-all duration-300 shadow-md"
                    style={{ backgroundColor: goldColor }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#A37F3D'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = goldColor}
                  >
                    Register / Join Event
                  </Link>
                </div>
              )}
            </div>
          ))}

          {/* খালি থাকলে মেসেজ */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No initiatives found in this section.</p>
            </div>
          )}
        </div>

      </div>

      <Footer />
    </main>
  );
}