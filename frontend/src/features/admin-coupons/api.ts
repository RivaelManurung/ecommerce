import { api } from "@/lib/api-client";

export interface Coupon {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  minSpend: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  active: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CouponInput {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minSpend: number;
  maxDiscount: number;
  usageLimit: number;
  active: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
}

export type CouponListParams = { page?: number; limit?: number; search?: string; status?: string };

export function listCoupons(params: CouponListParams = {}) {
  return api.get<Coupon[]>("/admin/coupons", { query: { ...params } });
}

export async function getCoupon(id: string): Promise<Coupon> {
  const { data } = await api.get<Coupon>(`/admin/coupons/${id}`);
  return data;
}

export async function createCoupon(input: CouponInput): Promise<Coupon> {
  const { data } = await api.post<Coupon>("/admin/coupons", input);
  return data;
}

export async function updateCoupon(id: string, input: CouponInput): Promise<Coupon> {
  const { data } = await api.put<Coupon>(`/admin/coupons/${id}`, input);
  return data;
}

export async function deleteCoupon(id: string): Promise<void> {
  await api.delete(`/admin/coupons/${id}`);
}

// Storefront: preview a discount for a subtotal (used at checkout).
export async function validateCoupon(code: string, subtotal: number) {
  const { data } = await api.post<{ code: string; type: "percent" | "fixed"; value: number; discount: number }>(
    "/coupons/validate",
    { code, subtotal },
  );
  return data;
}
