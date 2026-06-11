import { api } from "@/lib/api-client";
import type { Category, Paginated, Product, Setting } from "@/lib/admin-types";
import type { InquiryValues } from "@/lib/validations";
import { FALLBACK_SETTINGS } from "@/lib/site-config";

export type PublicProductParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
  order?: string;
};

export async function getPublicProducts(params: PublicProductParams = {}): Promise<Paginated<Product>> {
  const { data, meta } = await api.get<Product[]>("/public/products", {
    query: { ...params },
    auth: false,
  });
  return {
    data,
    meta: meta ?? { pagination: { page: 1, limit: data.length, total: data.length, totalPages: 1 } },
  };
}

export async function getPublicProduct(slug: string) {
  const { data } = await api.get<Product>(`/public/products/${slug}`, { auth: false });
  return data;
}

export async function getPublicCategories() {
  const { data } = await api.get<Category[]>("/public/categories", { auth: false });
  return data;
}

export async function getPublicSettings(): Promise<Setting> {
  const { data } = await api.get<Setting>("/public/settings", { auth: false });
  return data;
}

// Settings + active categories with a graceful fallback — used by the layout
// chrome so a backend hiccup never blanks the whole site.
export async function getChromeData(): Promise<{ settings: Setting; categories: Category[] }> {
  const [settings, categories] = await Promise.all([
    getPublicSettings().catch(() => FALLBACK_SETTINGS),
    getPublicCategories().catch(() => [] as Category[]),
  ]);
  return { settings, categories };
}

export async function submitInquiry(values: InquiryValues) {
  await api.post<{ message: string }>("/public/inquiries", values, { auth: false });
}
