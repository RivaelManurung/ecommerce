import { api } from "@/lib/api-client";
import type { Product } from "@/lib/admin-types";
import type { ImageValues, ProductValues, VariantValues } from "@/lib/validations";

export type ProductListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  categoryId?: string;
  sort?: string;
  order?: string;
};

export function listProducts(params: ProductListParams = {}) {
  return api.get<Product[]>("/admin/products", { query: { ...params } });
}

export async function getProduct(id: string) {
  const { data } = await api.get<Product>(`/admin/products/${id}`);
  return data;
}

export async function createProduct(values: ProductValues) {
  const { data } = await api.post<Product>("/admin/products", values);
  return data;
}

export async function updateProduct(id: string, values: ProductValues) {
  const { data } = await api.put<Product>(`/admin/products/${id}`, values);
  return data;
}

export async function deleteProduct(id: string) {
  await api.delete(`/admin/products/${id}`);
}

export async function addImage(productId: string, values: ImageValues) {
  const { data } = await api.post<Product>(`/admin/products/${productId}/images`, values);
  return data;
}

export async function deleteImage(productId: string, imageId: string) {
  const { data } = await api.delete<Product>(`/admin/products/${productId}/images/${imageId}`);
  return data;
}

export async function addVariant(productId: string, values: VariantValues) {
  const { data } = await api.post<Product>(`/admin/products/${productId}/variants`, values);
  return data;
}

export async function updateVariant(productId: string, variantId: string, values: VariantValues) {
  const { data } = await api.put<Product>(
    `/admin/products/${productId}/variants/${variantId}`,
    values,
  );
  return data;
}

export async function deleteVariant(productId: string, variantId: string) {
  const { data } = await api.delete<Product>(
    `/admin/products/${productId}/variants/${variantId}`,
  );
  return data;
}
