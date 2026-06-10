"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  ids: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  exists: (id: string) => boolean;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) => set((state) => ({ ids: Array.from(new Set([...state.ids, id])) })),
      remove: (id) => set((state) => ({ ids: state.ids.filter((item) => item !== id) })),
      toggle: (id) => (get().exists(id) ? get().remove(id) : get().add(id)),
      exists: (id) => get().ids.includes(id),
    }),
    { name: "veloura-wishlist" },
  ),
);
