import { api } from "@/lib/api-client";
import type { Category } from "@/lib/admin-types";
import type { CategoryValues } from "@/lib/validations";

export type CategoryListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
  order?: string;
};

export function listCategories(params: CategoryListParams = {}) {
  return api.get<Category[]>("/admin/categories", { query: { ...params } });
}

export async function getCategory(id: string) {
  const { data } = await api.get<Category>(`/admin/categories/${id}`);
  return data;
}

export async function createCategory(values: CategoryValues) {
  const { data } = await api.post<Category>("/admin/categories", values);
  return data;
}

export async function updateCategory(id: string, values: CategoryValues) {
  const { data } = await api.put<Category>(`/admin/categories/${id}`, values);
  return data;
}

export async function deleteCategory(id: string) {
  await api.delete(`/admin/categories/${id}`);
}
