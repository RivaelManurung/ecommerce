import type { Metadata } from "next";
import { WishlistView } from "@/components/catalog/wishlist-view";

export const metadata: Metadata = {
  title: "Wishlist | Veloura Beauty",
};

export default function WishlistPage() {
  return <WishlistView />;
}
