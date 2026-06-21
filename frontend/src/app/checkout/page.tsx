import type { Metadata } from "next";
import { CheckoutView } from "@/components/catalog/checkout-view";

export const metadata: Metadata = {
  title: "Checkout | Veloura Beauty",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
