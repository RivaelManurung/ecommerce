"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/features/cart/api";
import * as cartApi from "@/features/cart/api";
import { TOKEN_COOKIE } from "@/lib/api-client";

// A guest line carries the same display fields as a server line; lineTotal and
// availability are derived locally so the guest cart renders identically.
export type GuestLine = Omit<CartLine, "lineTotal" | "available">;

function loggedIn(): boolean {
  if (typeof document === "undefined") return false;
  return new RegExp(`(?:^|; )${TOKEN_COOKIE}=`).test(document.cookie);
}

// withDerived recomputes availability + line totals for the guest cart, matching
// what the backend computes for a signed-in cart.
function withDerived(items: CartLine[]): CartLine[] {
  return items.map((i) => {
    const available = i.stock > 0;
    return { ...i, available, lineTotal: available ? i.price * i.quantity : 0 };
  });
}

function toInput(items: CartLine[]): cartApi.CartItemInput[] {
  return items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity }));
}

interface CartState {
  items: CartLine[];
  loading: boolean;
  count: () => number;
  subtotal: () => number;
  /** Pull the authoritative server cart when signed in; no-op for guests. */
  refresh: () => Promise<void>;
  add: (line: GuestLine) => Promise<void>;
  setQty: (variantId: string, quantity: number) => Promise<void>;
  remove: (variantId: string) => Promise<void>;
  clear: () => Promise<void>;
  /** Merge the local guest cart into the server cart after sign-in. */
  syncOnLogin: () => Promise<void>;
  /** Drop local state (used on sign-out). */
  resetLocal: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,

      count: () => get().items.reduce((n, i) => n + i.quantity, 0),
      subtotal: () => get().items.reduce((s, i) => s + (i.available ? i.lineTotal : 0), 0),

      refresh: async () => {
        if (!loggedIn()) return;
        set({ loading: true });
        try {
          const view = await cartApi.getCart();
          set({ items: view.items, loading: false });
        } catch {
          set({ loading: false });
        }
      },

      add: async (line) => {
        if (loggedIn()) {
          const view = await cartApi.addItem({
            productId: line.productId,
            variantId: line.variantId,
            quantity: line.quantity,
          });
          set({ items: view.items });
          return;
        }
        // Guest: merge into the local cart, capped at known stock.
        const items = [...get().items];
        const idx = items.findIndex((i) => i.variantId === line.variantId);
        if (idx >= 0) {
          const next = Math.min(items[idx].quantity + line.quantity, line.stock || 99);
          items[idx] = { ...items[idx], quantity: next };
        } else {
          items.push({ ...line, lineTotal: 0, available: line.stock > 0 });
        }
        set({ items: withDerived(items) });
      },

      setQty: async (variantId, quantity) => {
        if (loggedIn()) {
          const view = await cartApi.updateItem(variantId, quantity);
          set({ items: view.items });
          return;
        }
        let items = get().items;
        if (quantity <= 0) {
          items = items.filter((i) => i.variantId !== variantId);
        } else {
          items = items.map((i) =>
            i.variantId === variantId
              ? { ...i, quantity: Math.min(quantity, i.stock || 99) }
              : i,
          );
        }
        set({ items: withDerived(items) });
      },

      remove: async (variantId) => {
        if (loggedIn()) {
          const view = await cartApi.removeItem(variantId);
          set({ items: view.items });
          return;
        }
        set({ items: get().items.filter((i) => i.variantId !== variantId) });
      },

      clear: async () => {
        if (loggedIn()) {
          await cartApi.clearCart();
        }
        set({ items: [] });
      },

      syncOnLogin: async () => {
        const guest = get().items;
        try {
          const view = guest.length
            ? await cartApi.mergeCart(toInput(guest))
            : await cartApi.getCart();
          set({ items: view.items });
        } catch {
          // Leave the guest cart in place if the merge fails; it can retry later.
        }
      },

      resetLocal: () => set({ items: [] }),
    }),
    {
      name: "ek-cart",
      // Same hydration discipline as the wishlist: render empty on the server and
      // first client paint, then rehydrate via CartHydrator to avoid a mismatch.
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
