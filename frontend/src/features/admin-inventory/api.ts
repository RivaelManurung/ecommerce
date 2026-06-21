import { api } from "@/lib/api-client";

export type StockLevel = "out" | "low" | "ok";

export interface InventoryRow {
  productId: string;
  productName: string;
  slug: string;
  productStatus: string;
  variantId: string;
  variantName: string;
  sku: string;
  price: number;
  stock: number;
  level: StockLevel;
}

export type InventoryParams = { search?: string; low?: boolean; threshold?: number };

export async function listInventory(params: InventoryParams = {}): Promise<{ rows: InventoryRow[]; threshold: number }> {
  const { data } = await api.get<{ rows: InventoryRow[]; threshold: number }>("/admin/inventory", {
    query: { search: params.search, low: params.low ? "true" : undefined, threshold: params.threshold },
  });
  return data;
}

export async function adjustStock(
  productId: string,
  variantId: string,
  input: { mode: "set" | "add"; quantity: number; reason?: string },
) {
  await api.patch(`/admin/products/${productId}/variants/${variantId}/stock`, input);
}
