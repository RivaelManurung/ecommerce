import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { PromoBar } from "@/components/layout/promo-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { ChromeGate } from "@/components/layout/chrome-gate";
import { getChromeData } from "@/features/public/api";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Veloura Beauty | Premium Indonesian Beauty Essentials",
  description: "Premium cosmetics and skincare for everyday beauty.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { settings, categories } = await getChromeData();

  return (
    <html lang="id" className={`${inter.variable} ${cormorant.variable}`}>
      <body>
        <ScrollToTop />
        <ChromeGate hideOn={["/login", "/register", "/admin"]}>
          <PromoBar settings={settings} />
          <SiteHeader settings={settings} categories={categories} />
        </ChromeGate>
        {children}
        <ChromeGate hideOn={["/login", "/register", "/admin"]}>
          <SiteFooter settings={settings} categories={categories} />
        </ChromeGate>
      </body>
    </html>
  );
}
