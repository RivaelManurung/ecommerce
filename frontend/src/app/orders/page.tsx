import type { Metadata } from "next";
import { OrdersView } from "@/components/catalog/orders-view";

export const metadata: Metadata = {
  title: "Pesanan Saya | Veloura Beauty",
};

export default function OrdersPage() {
  return <OrdersView />;
}
