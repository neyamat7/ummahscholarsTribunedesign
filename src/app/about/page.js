"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AboutSlider from "@/components/AboutSlider";
import SectionHeader from "@/components/SectionHeader";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { 
  BookOpen, 
  Award, 
  Compass, 
  Sparkles, 
  Feather, 
  Globe2, 
  ShieldCheck, 
  GraduationCap, 
  Library, 
  ScrollText,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

export default function AboutPage() {
  const { isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // Content for English mode
  const contentEn = {
    title: "Ummah Scholars Tribune (UST)",
    subtitle: "A global intellectual and scholarly platform uniting classical wisdom with contemporary foresight.",
    paragraphs: [
      "Ummah Scholars Tribune (UST) is an international intellectual and academic institution committed to constructing rigorous Islamic knowledge, elevating responsible awareness, and spotlighting the transformative contributions of esteemed scholars worldwide.",
      "Rooted in a balanced civilizational vision, the Tribune harmonizes the authenticity of traditional Islamic heritage with the depth of academic inquiry and the demands of modern reality. We produce and publish peer-reviewed research papers, legal and theological treatises, scholarly opinions (Fatawa), academic bulletins, and major intellectual initiatives.",
      "UST aspires to serve as an authoritative global benchmark for research, ethics, and scholarly thought—standing as an authentic voice for the Ummah's scholars and an incubator for groundbreaking initiatives that serve humanity, foster universal values, and enrich human civilization."
    ],
    highlights: [
      {
        icon: Feather,
        title: "Scholarly Authenticity",
        desc: "Deeply rooted in classical Islamic epistemological frameworks and traditional methodologies."
      },
      {
        icon: Globe2,
        title: "Global Reach & Impact",
        desc: "Connecting international researchers, academic institutions, and readers across continents."
      },
      {
        icon: ShieldCheck,
        title: "Peer-Reviewed Integrity",
        desc: "Adhering to the highest academic standards of vetting, verification, and critical review."
      }
    ],
    pillarsTitle: "Four Core Strategic Pillars",
    pillarsSubtitle: "The foundational principles guiding every publication, symposium, and initiative at UST.",
    pillars: [
      {
        icon: Library,
        title: "Classical Rigor & Usul",
        desc: "Preserving the timeless methodologies of Islamic jurisprudence (Fiqh), theology (Kalam), and exegesis (Tafsir)."
      },
      {
        icon: Compass,
        title: "Civilizational Renewal",
        desc: "Offering visionary, constructive perspectives that empower communities to navigate contemporary global challenges."
      },
      {
        icon: ScrollText,
        title: "Academic Research",
        desc: "Publishing specialized monographs, peer-reviewed journals, and interdisciplinary theological studies."
      },
      {
        icon: Award,
        title: "Ethical & Human Flourishing",
        desc: "Advancing knowledge that elevates moral conscience, defends human dignity, and promotes justice."
      }
    ],
    editorTitle: "Editor-in-Chief: Dr. Zubair Sultan Rabbani",
    editorSubtitle: "Founder & Editor-in-Chief of Ummah Scholars Tribune (UST)",
    editorBio: "Dr. Zubair Sultan Rabbani is a distinguished scholar, researcher, and author specializing in Islamic thought, human development, and civilizational dynamics. He holds four doctorates across Arabic Linguistics & Philology, Quranic Exegesis & Sciences, Shariah Law & Legal Systems, and Principles of Islamic Jurisprudence (Usul al-Fiqh).",
    editorBioExtended: "He has contributed prolifically to contemporary Islamic literature through academic treatises, published volumes, and the spearheading of influential academic, media, and cultural initiatives. His overarching vision bridges the authenticity of sacred heritage with the pressing intellectual imperatives of our time.",
    degrees: [
      "Ph.D. in Arabic Language & Philological Sciences",
      "Ph.D. in Quranic Exegesis (Tafsir) & Quranic Sciences",
      "Ph.D. in Shariah Law & Comparative Jurisprudence",
      "Ph.D. in Usul al-Fiqh (Principles of Jurisprudence)"
    ],
    ctaTitle: "Join Our Scholarly Community",
    ctaSubtitle: "Explore our archive of research, subscribe to scholarly bulletins, or connect with our editorial team.",
    ctaResearch: "Explore Research",
    ctaContact: "Get in Touch"
  };

  // Content for Arabic mode
  const contentAr = {
    title: "منبر أعلام الأمة (UST)",
    subtitle: "منصة علمية وفكرية عالمية تجمع بين أصالة التراث وعمق البحث واستشراف المستقبل.",
    paragraphs: [
      "منبر أعلام الأمة (Ummah Scholars Tribune - UST) منصة علمية وفكرية عالمية تُعنى ببناء المعرفة الرصينة، وتعزيز الوعي المسؤول، وإبراز إسهامات علماء الأمة ومفكريها برؤيةٍ حضاريةٍ تجمع أصالة التراث، وعمق البحث، واحترافية الطرح، واستشراف المستقبل.",
      "تُقدِّم المنصة البحوث والدراسات المحكّمة، والمقالات الفكرية، والفتاوى المؤصلة، والأخبار والفعاليات، والمبادرات العلمية، وفق منهجيةٍ راسخة ومعاييرَ عاليةٍ من الموثوقية والجودة؛ لتُنتج معرفةً رصينة، وتنمّي وعيًا رشيدًا، وتصنع أثرًا علميًا وفكريًا مستدامًا.",
      "وتطمح إلى أن تكون مرجعًا عالميًا موثوقًا للعلم والفكر، وصوتًا أمينًا لعلماء الأمة، وحاضنةً للمبادرات النوعية التي تُسهم في خدمة الإنسان، وتعزيز القيم الأخلاقية، وإثراء الحضارة بالكلمة الصادقة، والعلم النافع، والرؤية البصيرة."
    ],
    highlights: [
      {
        icon: Feather,
        title: "الأصالة والرصانة",
        desc: "التزام راسخ بالأصول المعرفية والمناهج العلمية المعتمدة لدى محققي الأمة."
      },
      {
        icon: Globe2,
        title: "الامتداد العالمي",
        desc: "شبكة فكرية وثيقة تربط بين الباحثين والمؤسسات الأكاديمية والمهتمين حول العالم."
      },
      {
        icon: ShieldCheck,
        title: "التحكيم والجودة",
        desc: "معايير تدقيق ومراجعة صارمة تضمن دقة المحتوى وعمقه الفكري واللغوي."
      }
    ],
    pillarsTitle: "أربعة مرتكزات استراتيجية كبرى",
    pillarsSubtitle: "المبادئ والقيم الحاكمة التي تصوغ كافة إصدارات ومبادرات منبر أعلام الأمة.",
    pillars: [
      {
        icon: Library,
        title: "الأصالة الفقهية والمنهجية",
        desc: "ترسيخ مناهج الاستدلال الفقهي والأصولي وعلوم الوحي الشريف برؤية جامعة."
      },
      {
        icon: Compass,
        title: "التجديد الحضاري الرشيد",
        desc: "تقديم مقاربات فكرية معاصرة تجيب عن أسئلة العصر دون تفريط في الثوابت."
      },
      {
        icon: ScrollText,
        title: "البحث الأكاديمي المحكّم",
        desc: "نشر الأبحاث والدراسات التخصصية التي تثري المكتبة الإسلامية والإنسانية."
      },
      {
        icon: Award,
        title: "خدمة الإنسان وبناء القيم",
        desc: "إعلاء الكرامة الإنسانية ونشر معاني العدل والرحمة والسلام في المجتمعات."
      }
    ],
    editorTitle: "رئيس التحرير: د. زبير سلطان ربّاني",
    editorSubtitle: "مؤسس ورئيس تحرير منبر أعلام الأمة (UST)",
    editorBio: "كاتب وباحث في الفكر الإسلامي، وقضايا الإنسان، والتحولات الحضارية. حاصل على أربع درجات دكتوراه في: اللغة العربية وعلومها، التفسير وعلوم القرآن الكريم، الشريعة والقانون، والفقه وأصوله.",
    editorBioExtended: "له إسهامات علمية وفكرية واسعة في التأليف والبحث الأكاديمي، وإطلاق المبادرات الفكرية والإعلامية والمجتمعية برؤية حضارية تعلي قيمة الإنسان وتربط أصالة المعرفة بمتطلبات العصر.",
    degrees: [
      "دكتوراه في اللغة العربية وعلومها اللسانية",
      "دكتوراه في التفسير وعلوم القرآن الكريم",
      "دكتوراه في الشريعة الإسلامية والقانون المقارن",
      "دكتوراه في الفقه الإسلامي وأصول الفقه"
    ],
    ctaTitle: "كن جزءاً من مسيرتنا الفكرية",
    ctaSubtitle: "اطلع على أرشيف البحوث والدراسات، أو تواصل مباشرة مع فريق التحرير العلمي.",
    ctaResearch: "تصفح البحوث والدراسات",
    ctaContact: "تواصل معنا"
  };

  const content = isRtl ? contentAr : contentEn;

  return (
    <main className="min-h-screen bg-[#FBF9F6] dark:bg-[#0F0D0B] text-[#1A1714] dark:text-[#F5F1E8] transition-colors duration-300">
      {/* 1. Global Navigation Bar */}
      <Navbar />

      {/* 2. Hero Section */}
      <AboutSlider />

      {/* 3. Main Tribune Story & Vision Section */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Main Text Content */}
          <div className="lg:col-span-7 space-y-5">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#1C1917] dark:text-[#F5F1E8] tracking-tight leading-[1.2]">
              {content.title}
            </h2>

            <p className="text-sm sm:text-base font-serif italic text-[#B88A2B] dark:text-[#C5A059] leading-relaxed">
              "{content.subtitle}"
            </p>

            <div className="space-y-4 text-xs sm:text-sm md:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
              {content.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Feature Highlight Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {content.highlights.map((h, idx) => {
                const IconComponent = h.icon;
                return (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-white dark:bg-[#1A1714] border border-[#E8E2D5] dark:border-[#2E2A24] shadow-xs hover:border-[#C5A059]/50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center mb-3">
                      <IconComponent size={18} />
                    </div>
                    <h3 className="font-serif font-bold text-xs sm:text-sm text-[#1A1714] dark:text-[#F5F1E8] mb-1">
                      {h.title}
                    </h3>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal">
                      {h.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Logo Showcase Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[400px] p-6 rounded-3xl bg-white dark:bg-[#1A1714] border border-[#E8E2D5] dark:border-[#2E2A24] shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 end-0 w-32 h-32 bg-[#C5A059]/10 rounded-full blur-3xl" />
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-[#C5A059]/30 bg-neutral-900 shadow-inner">
                <Image
                  src="/logo.jpeg"
                  alt="Ummah Scholars Tribune Official Emblem"
                  fill
                  priority
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="mt-5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
                  {isRtl ? "شعار المنبر الرسمي" : "Official Tribune Emblem"}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Ummah Scholars Tribune • International Publication
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Strategic Pillars Section (Using Unified SectionHeader) */}
      <section className="bg-neutral-100/70 dark:bg-[#14120F] border-y border-[#E8E2D5] dark:border-[#2E2A24] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          
          <SectionHeader
            title={content.pillarsTitle}
            description={content.pillarsSubtitle}
            align="center"
            borderBottom={false}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.pillars.map((pillar, idx) => {
              const IconComponent = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white dark:bg-[#1A1714] border border-[#E8E2D5] dark:border-[#2E2A24] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center mb-4 border border-[#C5A059]/20">
                      <IconComponent size={22} />
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#1A1714] dark:text-[#F5F1E8] mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800 text-[10px] font-bold text-[#C5A059] uppercase tracking-wider">
                    0{idx + 1} • {isRtl ? "ركيزة أساسية" : "Core Principle"}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. Editor-in-Chief Spotlight Section */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-24">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#1A1714] border border-[#E8E2D5] dark:border-[#2E2A24] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 start-0 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Editor Image Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-2xl overflow-hidden border-2 border-[#C5A059]/40 shadow-2xl group">
                <Image
                  src="/editor.jpeg"
                  alt="Dr. Zubair Sultan Rabbani - Editor-in-Chief"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 start-4 end-4 text-white">
                  <p className="text-sm font-serif font-bold text-[#C5A059]">
                    {isRtl ? "د. زبير سلطان ربّاني" : "Dr. Zubair Sultan Rabbani"}
                  </p>
                  <p className="text-[11px] text-neutral-300">
                    {isRtl ? "رئيس التحرير والمؤسس" : "Founder & Editor-in-Chief"}
                  </p>
                </div>
              </div>
            </div>

            {/* Editor Biography & Credentials Column */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#1C1917] dark:text-[#F5F1E8] tracking-tight leading-[1.2]">
                {content.editorTitle}
              </h2>

              <p className="text-sm sm:text-base font-serif text-[#B88A2B] dark:text-[#C5A059] font-medium">
                {content.editorSubtitle}
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                <p>{content.editorBio}</p>
                <p>{content.editorBioExtended}</p>
              </div>

              {/* Degrees & Qualifications Grid */}
              <div className="pt-3">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3 flex items-center gap-2">
                  <Award size={14} className="text-[#C5A059]" />
                  <span>{isRtl ? "المؤهلات الأكاديمية والدرجات العلمية:" : "Academic Doctoral Qualifications:"}</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {content.degrees.map((degree, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-start gap-2 text-xs font-medium text-neutral-800 dark:text-neutral-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{degree}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pb-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#1A1714] via-[#241F1A] to-[#1A1714] border border-[#C5A059]/30 text-white text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#F5F1E8] tracking-tight leading-[1.2]">
              {content.ctaTitle}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {content.ctaSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/research"
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-[#C5A059] text-black hover:bg-[#D8B46E] transition-all flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <span>{content.ctaResearch}</span>
              <ArrowIcon size={15} />
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold border border-[#C5A059]/60 text-[#F5F1E8] hover:bg-white/10 transition-all cursor-pointer"
            >
              <span>{content.ctaContact}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Scholarly Universal Footer */}
      <Footer />
    </main>
  );
}