"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/store/cart-store";

/**
 * Rehydrates the persisted cart from localStorage after mount (the store uses
 * `skipHydration: true` so the first client render matches the server's empty
 * cart). When the visitor is signed in, it then pulls the authoritative server
 * cart, which supersedes any locally cached guest items. Mounted once at root.
 */
export function CartHydrator() {
  useEffect(() => {
    void (async () => {
      await useCartStore.persist.rehydrate();
      await useCartStore.getState().refresh();
    })();
  }, []);
  return null;
}
