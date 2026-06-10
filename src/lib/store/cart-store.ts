"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

type CartState = {
  items: CartItem[];
  addItem: (product: Product, shade?: string, quantity?: number) => void;
  removeItem: (productId: string, shade: string) => void;
  updateQuantity: (productId: string, shade: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: () => number;
  discount: () => number;
  total: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, shade = product.selectedShade, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.product.id === product.id && item.shade === shade);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id && item.shade === shade
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          }
          return { items: [...state.items, { product, shade, quantity }] };
        }),
      removeItem: (productId, shade) =>
        set((state) => ({
          items: state.items.filter((item) => !(item.product.id === productId && item.shade === shade)),
        })),
      updateQuantity: (productId, shade, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId && item.shade === shade
              ? { ...item, quantity: Math.max(1, quantity) }
              : item,
          ),
        })),
      clearCart: () => set({ items: [] }),
      subtotal: () => get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      discount: () => (get().subtotal() >= 150000 ? 51600 : 0),
      total: () => Math.max(0, get().subtotal() - get().discount()),
    }),
    { name: "veloura-cart" },
  ),
);
