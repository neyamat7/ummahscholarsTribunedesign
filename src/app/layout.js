import { Fraunces, Inter, Amiri, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import "./style.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
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
  icons: {
    icon: "/favicon/favicon.jpeg",
    shortcut: "/favicon/favicon.jpeg",
    apple: "/favicon/favicon.jpeg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon/favicon.jpeg" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon/favicon.jpeg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = theme === 'dark' || (!theme && prefersDark);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${fraunces.variable} ${inter.variable} ${amiri.variable} ${ibmPlexArabic.variable} antialiased bg-[#FBF9F6] dark:bg-[#0F0D0B] text-[#1A1714] dark:text-[#F5F1E8] transition-colors duration-300`}
      >
        <LanguageProvider>
          <AuthProvider>
            <FontLoader />
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
