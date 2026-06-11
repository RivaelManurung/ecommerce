import type { Setting } from "@/lib/admin-types";

// Fallback branding used when the public /settings fetch fails (e.g. backend
// down) so the storefront chrome always renders something sensible.
export const FALLBACK_SETTINGS: Setting = {
  id: "",
  companyName: "Veloura Beauty",
  tagline: "Premium Indonesian Beauty Essentials",
  email: "hello@veloura.test",
  phone: "+62 21 5000 1234",
  whatsapp: "+62 812 0000 1234",
  address: "Jakarta, Indonesia",
  logoUrl: "",
  socials: { instagram: "veloura.beauty", facebook: "", tiktok: "veloura.beauty" },
  updatedAt: "",
};

// Static helper links for the footer (these map to existing static pages).
export const FOOTER_HELP_LINKS: { label: string; href: string }[] = [
  { label: "Cara Pemesanan", href: "/faq" },
  { label: "Pengiriman", href: "/shipping" },
  { label: "Retur & Refund", href: "/returns" },
  { label: "FAQ", href: "/faq" },
  { label: "Wishlist", href: "/wishlist" },
];

export const FOOTER_CARE_LINKS: { label: string; href: string }[] = [
  { label: "Hubungi Kami", href: "/contact" },
  { label: "Tentang Kami", href: "/about" },
  { label: "Syarat & Ketentuan", href: "/terms" },
  { label: "Kebijakan Privasi", href: "/privacy" },
];
