import { api } from "@/lib/api-client";

export interface DayPoint {
  date: string;
  amount: number;
  orders: number;
}

export interface TopProduct {
  productId: string;
  name: string;
  quantity: number;
  revenue: number;
}

export interface Overview {
  rangeDays: number;
  totalRevenue: number;
  orderCount: number;
  paidOrderCount: number;
  avgOrderValue: number;
  newCustomers: number;
  revenue: DayPoint[];
  statusBreakdown: Record<string, number>;
  topProducts: TopProduct[];
}

export async function getOverview(days = 30): Promise<Overview> {
  const { data } = await api.get<Overview>("/admin/reports/overview", { query: { days } });
  return data;
}
