import type { Metadata } from "next";
import { CartView } from "@/components/catalog/cart-view";
import { getPublicSettings } from "@/features/public/api";
import { FALLBACK_SETTINGS } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Keranjang | Veloura Beauty",
};

export default async function CartPage() {
  const settings = await getPublicSettings().catch(() => FALLBACK_SETTINGS);
  return <CartView whatsapp={settings.whatsapp} />;
}
