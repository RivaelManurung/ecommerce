import { api } from "@/lib/api-client";
import type { DashboardStats } from "@/lib/admin-types";

export async function getDashboardStats() {
  const { data } = await api.get<DashboardStats>("/admin/dashboard/stats");
  return data;
}
