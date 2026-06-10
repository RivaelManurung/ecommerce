import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Newsletter } from "@/components/layout/newsletter";
import { PromoBar } from "@/components/layout/promo-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${cormorant.variable}`}>
      <body>
        <PromoBar />
        <SiteHeader />
        {children}
        <Newsletter />
        <SiteFooter />
      </body>
    </html>
  );
}
