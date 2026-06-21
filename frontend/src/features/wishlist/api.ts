import { api } from "@/lib/api-client";
import type { WishlistItem } from "@/lib/store/wishlist-store";

// Server wishlist line (mirrors backend wishlist.WishlistItem). `available`
// flags products that are no longer published; the UI can keep showing them.
interface ServerWishlistItem {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  category: string;
  available: boolean;
}

function toItem(s: ServerWishlistItem): WishlistItem {
  return { id: s.id, slug: s.slug, name: s.name, image: s.image, price: s.price, category: s.category };
}

export async function getWishlist(): Promise<WishlistItem[]> {
  const { data } = await api.get<{ items: ServerWishlistItem[] }>("/wishlist");
  return data.items.map(toItem);
}

export async function addWishlistItem(productId: string): Promise<WishlistItem[]> {
  const { data } = await api.post<{ items: ServerWishlistItem[] }>("/wishlist/items", { productId });
  return data.items.map(toItem);
}

export async function removeWishlistItem(productId: string): Promise<WishlistItem[]> {
  const { data } = await api.delete<{ items: ServerWishlistItem[] }>(`/wishlist/items/${productId}`);
  return data.items.map(toItem);
}

export async function mergeWishlist(productIds: string[]): Promise<WishlistItem[]> {
  const { data } = await api.post<{ items: ServerWishlistItem[] }>("/wishlist/merge", { productIds });
  return data.items.map(toItem);
}
