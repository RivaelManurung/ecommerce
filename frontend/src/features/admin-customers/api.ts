import { api } from "@/lib/api-client";
import type { User, AuditLog } from "@/lib/admin-types";
import type { Order } from "@/features/orders/api";

export type CustomerListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "blocked" | "";
};

export interface CustomerStats {
  orderCount: number;
  paidOrders: number;
  totalSpent: number;
  lastOrderAt?: string;
}

export interface CustomerProfile {
  user: User;
  stats: CustomerStats;
  orders: Order[];
  activity: AuditLog[];
}

export function listCustomers(params: CustomerListParams = {}) {
  return api.get<User[]>("/admin/customers", { query: { ...params } });
}

export async function getCustomer(id: string): Promise<CustomerProfile> {
  const { data } = await api.get<CustomerProfile>(`/admin/customers/${id}`);
  return data;
}

export async function setCustomerStatus(id: string, active: boolean): Promise<User> {
  const { data } = await api.patch<User>(`/admin/customers/${id}/status`, { active });
  return data;
}
