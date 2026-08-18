import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

const goldColor = "#C5A059";
const news = [
  {
    id: 1,
    title: "Global Islamic Scholars Unite for Educational Reform",
    category: "Announcement",
    date: "July 28, 2026",
    image: "/news/news1.avif",
  },
  {
    id: 2,
    title: "New Research Published on Islamic Finance",
    category: "Research",
    date: "July 25, 2026",
    image: "/news/news.jpeg",
  },
  {
    id: 3,
    title: "International Quran Conference Held Successfully",
    category: "Conference",
    date: "July 22, 2026",
    image: "/1.png",
  },
  {
    id: 4,
    title: "Modern Challenges and Islamic Perspectives",
    category: "Article",
    date: "July 20, 2026",
    image: "/2.png",
  },
  {
    id: 5,
    title: "Youth Leadership Program Announced",
    category: "Community",
    date: "July 18, 2026",
    image: "/3.png",
  },
  {
    id: 6,
    title: "New Digital Library for Islamic Studies",
    category: "Technology",
    date: "July 15, 2026",
    image: "/4.png",
  },
];

export default function NewsPage() {
  return (
    <>
    <Navbar></Navbar>
      {/* Hero */}
      <section className="relative h-[320px]">

        <Image
          src="/news/news.jpeg"
          alt="News"
          fill
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4">
          

              <span 
      className="text-xs font-bold uppercase tracking-[0.25em] mb-3 bg-black/30 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10 inline-block"
      style={{ color: goldColor }}
    >
      Latest Updates
    </span>

          <h1 className="text-4xl md:text-6xl font-bold mt-4">
            News & Announcements
          </h1>

          <p className="mt-5 max-w-2xl text-gray-200">
            Stay updated with authentic Islamic news, scholarly research,
            community announcements and global events.
          </p>
        </div>
      </section>

      {/* Main */}
      <section className="max-w-7xl mx-auto px-5 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left */}
          <div className="lg:col-span-2">
            {/* Featured */}
            <div className="relative rounded-xl overflow-hidden">
              <Image
                src="/news/news1.avif"
                alt=""
                width={1200}
                height={700}
                className="w-full h-[420px] object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="absolute bottom-8 left-8">
                <span className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold">
                  Featured
                </span>

                <h2 className="text-white text-3xl font-bold mt-4 max-w-xl">
                  Global Islamic Scholars Unite for Educational Reform
                </h2>

                <p className="text-gray-300 mt-3">
                  July 28, 2026
                </p>
              </div>
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow hover:shadow-xl duration-300 overflow-hidden"
                >
                  <Image
                    src={item.image}
                    width={500}
                    height={350}
                    alt={item.title}
                    className="w-full h-56 object-cover"
                  />

                  <div className="p-6">
                    <span className="text-yellow-600 text-sm font-semibold">
                      {item.category}
                    </span>

                    <h3 className="text-xl font-bold mt-3 hover:text-yellow-600 cursor-pointer">
                      {item.title}
                    </h3>

                    <p className="text-gray-500 mt-4 text-sm">
                      {item.date}
                    </p>

                    <button className="mt-5 text-yellow-600 font-semibold hover:underline">
                      Read More →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            {/* Search */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-xl mb-5">
                Search News
              </h3>

              <input
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Search..."
              />
            </div>

            {/* Categories */}
            <div className="bg-white rounded-xl shadow p-6 mt-8">
              <h3 className="font-bold text-xl mb-5">
                Categories
              </h3>

              <ul className="space-y-4">
                <li className="hover:text-yellow-600 cursor-pointer">
                  Announcement
                </li>

                <li className="hover:text-yellow-600 cursor-pointer">
                  Research
                </li>

                <li className="hover:text-yellow-600 cursor-pointer">
                  Community
                </li>

                <li className="hover:text-yellow-600 cursor-pointer">
                  Conference
                </li>

                <li className="hover:text-yellow-600 cursor-pointer">
                  Technology
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="bg-stone-900 text-white rounded-xl p-8 mt-8">
              <h3 className="text-2xl font-bold">
                Subscribe
              </h3>

              <p className="text-gray-300 mt-4">
                Receive the latest Islamic news directly in your inbox.
              </p>

              <input
                className="mt-6 w-full rounded-lg p-3 text-black"
                placeholder="Email Address"
              />

              <button className="w-full mt-4 bg-yellow-500 text-black py-3 rounded-lg font-semibold hover:bg-yellow-600 duration-300">
                Subscribe
              </button>
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </>
  );
}