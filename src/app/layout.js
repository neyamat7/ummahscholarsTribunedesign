import { Fraunces, Inter, Amiri, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import "./style.css";
import { LanguageProvider } from "@/context/LanguageContext";
import FontLoader from "@/components/FontLoader";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-amiri",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
});

export const metadata = {
  title: "Ummah Scholars Tribune | Voice of Intellectual & Classical Scholarship",
  description: "Classical legal scholarship, Islamic jurisprudence, modern governance, and ethical research.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${fraunces.variable} ${inter.variable} ${amiri.variable} ${ibmPlexArabic.variable} antialiased bg-[#FBF9F6] dark:bg-[#0F0D0B] text-[#1A1714] dark:text-[#F5F1E8] transition-colors duration-300`}
      >
        <LanguageProvider>
          <FontLoader />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
