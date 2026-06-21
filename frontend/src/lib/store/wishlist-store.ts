"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as wishlistApi from "@/features/wishlist/api";
import { TOKEN_COOKIE } from "@/lib/api-client";

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

function loggedIn(): boolean {
  if (typeof document === "undefined") return false;
  return new RegExp(`(?:^|; )${TOKEN_COOKIE}=`).test(document.cookie);
}

type WishlistState = {
  items: WishlistItem[];
  add: (item: WishlistItem) => void;
  remove: (id: string) => void;
  toggle: (item: WishlistItem) => void;
  exists: (id: string) => boolean;
  clear: () => void;
  /** Pull the authoritative server wishlist when signed in; no-op for guests. */
  refresh: () => Promise<void>;
  /** Merge the local guest wishlist into the account after sign-in. */
  syncOnLogin: () => Promise<void>;
  /** Drop local state (used on sign-out). */
  resetLocal: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      // Optimistic local update first for snappy hearts; when signed in, the
      // server response (authoritative) replaces local state, and any failure
      // self-heals via refresh().
      add: (item) => {
        set((state) =>
          state.items.some((i) => i.id === item.id)
            ? state
            : { items: [...state.items, item] },
        );
        if (loggedIn()) {
          wishlistApi
            .addWishlistItem(item.id)
            .then((items) => set({ items }))
            .catch(() => void get().refresh());
        }
      },

      remove: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
        if (loggedIn()) {
          wishlistApi
            .removeWishlistItem(id)
            .then((items) => set({ items }))
            .catch(() => void get().refresh());
        }
      },

      toggle: (item) => (get().exists(item.id) ? get().remove(item.id) : get().add(item)),
      exists: (id) => get().items.some((i) => i.id === id),

      clear: () => {
        const ids = get().items.map((i) => i.id);
        set({ items: [] });
        if (loggedIn()) {
          Promise.all(ids.map((id) => wishlistApi.removeWishlistItem(id).catch(() => undefined)))
            .then(() => void get().refresh())
            .catch(() => undefined);
        }
      },

      refresh: async () => {
        if (!loggedIn()) return;
        try {
          set({ items: await wishlistApi.getWishlist() });
        } catch {
          // keep current state
        }
      },

      syncOnLogin: async () => {
        const ids = get().items.map((i) => i.id);
        try {
          const items = ids.length
            ? await wishlistApi.mergeWishlist(ids)
            : await wishlistApi.getWishlist();
          set({ items });
        } catch {
          // leave the guest wishlist in place to retry later
        }
      },

      resetLocal: () => set({ items: [] }),
    }),
    {
      name: "ek-wishlist",
      // Don't read localStorage during the initial render. The server renders
      // with an empty wishlist, so the client must too — otherwise the first
      // client render (badge counts, filled hearts) won't match the server HTML
      // and React tears down the whole tree (hydration error). `WishlistHydrator`
      // calls `.persist.rehydrate()` once mounted, after which state updates
      // normally. See src/components/layout/wishlist-hydrator.tsx.
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
