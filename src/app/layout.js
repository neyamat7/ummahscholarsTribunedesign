import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./style.css";
import { LanguageProvider } from "@/context/LanguageContext";
import FontLoader from "@/components/FontLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ummah Scholars Tribune | Voice of Intellectual & Classical Scholarship",
  description: "Classical legal scholarship, Islamic jurisprudence, modern governance, and ethical research.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <FontLoader />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
