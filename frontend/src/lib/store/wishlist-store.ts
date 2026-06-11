"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Lightweight product snapshot so the wishlist page can render without
// re-fetching every saved product from the API.
export type WishlistItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  category: string;
};

type WishlistState = {
  items: WishlistItem[];
  add: (item: WishlistItem) => void;
  remove: (id: string) => void;
  toggle: (item: WishlistItem) => void;
  exists: (id: string) => boolean;
  clear: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((state) =>
          state.items.some((i) => i.id === item.id)
            ? state
            : { items: [...state.items, item] },
        ),
      remove: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      toggle: (item) =>
        get().exists(item.id) ? get().remove(item.id) : get().add(item),
      exists: (id) => get().items.some((i) => i.id === id),
      clear: () => set({ items: [] }),
    }),
    { name: "ek-wishlist" },
  ),
);
