import type { Metadata } from "next";
import { OrderDetailView } from "@/components/catalog/order-detail-view";
import { getPublicSettings } from "@/features/public/api";
import { FALLBACK_SETTINGS } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Detail Pesanan | Veloura Beauty",
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const settings = await getPublicSettings().catch(() => FALLBACK_SETTINGS);
  return <OrderDetailView id={id} whatsapp={settings.whatsapp} />;
}
