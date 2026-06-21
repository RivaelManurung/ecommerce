"use client";

import { useEffect } from "react";
import { useWishlistStore } from "@/lib/store/wishlist-store";

/**
 * Rehydrates the persisted wishlist from localStorage *after* mount. The store
 * is created with `skipHydration: true` so the first client render matches the
 * server's empty-wishlist HTML; this component then pulls the saved items in,
 * triggering a normal re-render. Mounted once at the app root.
 */
export function WishlistHydrator() {
  useEffect(() => {
    void (async () => {
      await useWishlistStore.persist.rehydrate();
      // When signed in, the server wishlist supersedes the local guest cache.
      await useWishlistStore.getState().refresh();
    })();
  }, []);
  return null;
}
