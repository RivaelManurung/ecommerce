import { api } from "@/lib/api-client";

// Mirrors the backend cart.CartLine / cart.CartView contract. The cart stores
// only product/variant/quantity server-side; prices, stock and totals are
// resolved live, so the client treats this view as authoritative when signed in.
export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  image: string;
  variantId: string;
  variantName: string;
  price: number;
  quantity: number;
  stock: number;
  lineTotal: number;
  available: boolean;
}

export interface CartView {
  items: CartLine[];
  subtotal: number;
  count: number;
  currency: string;
}

export interface CartItemInput {
  productId: string;
  variantId: string;
  quantity: number;
}

export async function getCart(): Promise<CartView> {
  const { data } = await api.get<CartView>("/cart");
  return data;
}

export async function addItem(input: CartItemInput): Promise<CartView> {
  const { data } = await api.post<CartView>("/cart/items", input);
  return data;
}

export async function updateItem(variantId: string, quantity: number): Promise<CartView> {
  const { data } = await api.patch<CartView>(`/cart/items/${variantId}`, { quantity });
  return data;
}

export async function removeItem(variantId: string): Promise<CartView> {
  const { data } = await api.delete<CartView>(`/cart/items/${variantId}`);
  return data;
}

export async function clearCart(): Promise<CartView> {
  const { data } = await api.delete<CartView>("/cart");
  return data;
}

export async function mergeCart(items: CartItemInput[]): Promise<CartView> {
  const { data } = await api.post<CartView>("/cart/merge", { items });
  return data;
}
