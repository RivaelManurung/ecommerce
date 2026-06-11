import type { Product } from "@/lib/admin-types";
import type { WishlistItem } from "@/lib/store/wishlist-store";

// Pick the primary image URL for a product (falls back to first / placeholder).
export function primaryImage(product: Pick<Product, "images" | "name">): {
  url: string;
  alt: string;
} {
  const img = product.images?.find((i) => i.isPrimary) ?? product.images?.[0];
  return { url: img?.url ?? "/images/product-cosmetics.svg", alt: img?.alt ?? product.name };
}

// Build the wishlist snapshot stored locally for a product.
export function toWishlistItem(product: Product): WishlistItem {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    image: primaryImage(product).url,
    price: product.basePrice,
    category: product.category?.name ?? "",
  };
}
