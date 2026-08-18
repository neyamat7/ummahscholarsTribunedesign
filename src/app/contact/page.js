"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function ContactPage() {
  const goldColor = "#C5A059";
  const textColor = "#1A1A1A";

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-stone-950 py-20 px-6 md:px-12 text-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/contact.jpeg"
            alt="Contact Banner"
            fill
            priority
            className="object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <span
            className="inline-block px-4 py-1 rounded-full text-xs uppercase tracking-[0.25em] font-semibold border border-white/10 bg-black/30"
            style={{ color: goldColor }}
          >
            Get In Touch
          </span>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mt-5">
            Contact <span style={{ color: goldColor }}>Us</span>
          </h1>

          <p className="mt-5 text-gray-200 leading-relaxed">
            We welcome your questions, research inquiries, collaborations,
            and feedback. Feel free to reach out to our team.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid lg:grid-cols-2 gap-12">

          {/* Contact Info */}
          <div>
            <h2
              className="text-3xl font-serif font-bold mb-6"
              style={{ color: textColor }}
            >
              Contact Information
            </h2>

            <p className="text-gray-600 leading-8 mb-10">
              Whether you have questions regarding publications, academic
              research, partnerships, or events, our team is always happy to
              assist you.
            </p>

            <div className="space-y-6">

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h4
                  className="font-semibold mb-2"
                  style={{ color: goldColor }}
                >
                  Office Address
                </h4>

                <p className="text-gray-600">
                 
                  
                  Ummah Scholars Tribune (UST)
                  <br />
Kuala Lumpur, Malaysia
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h4
                  className="font-semibold mb-2"
                  style={{ color: goldColor }}
                >
                  Email
                </h4>

                <p className="text-gray-600">
                  info@ummahscholarstribune.com
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h4
                  className="font-semibold mb-2"
                  style={{ color: goldColor }}
                >
                  Phone
                </h4>

                <p className="text-gray-600">
+8801719758581
                </p>
              </div>

            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2
              className="text-3xl font-serif font-bold mb-8"
              style={{ color: textColor }}
            >
              Send a Message
            </h2>

            <form className="space-y-6">

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Subject
                </label>

                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Message
                </label>

                <textarea
                  rows={6}
                  placeholder="Write your message..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 resize-none focus:outline-none focus:ring-2"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3 rounded-lg text-white font-semibold transition hover:opacity-90"
                style={{ backgroundColor: goldColor }}
              >
                Send Message
              </button>

            </form>

          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}