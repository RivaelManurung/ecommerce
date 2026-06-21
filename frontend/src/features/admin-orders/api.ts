import { api } from "@/lib/api-client";
import type { Order, OrderStatus } from "@/features/orders/api";

export type AdminOrderListParams = {
  page?: number;
  limit?: number;
  status?: string;
};

export function listAdminOrders(params: AdminOrderListParams = {}) {
  return api.get<Order[]>("/admin/orders", { query: { ...params } });
}

export async function getAdminOrder(id: string): Promise<Order> {
  const { data } = await api.get<Order>(`/admin/orders/${id}`);
  return data;
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const { data } = await api.patch<Order>(`/admin/orders/${id}/status`, { status });
  return data;
}

export async function updateOrderShipment(
  id: string,
  input: { courier: string; service: string; trackingNumber: string },
) {
  const { data } = await api.patch<Order>(`/admin/orders/${id}/shipment`, input);
  return data;
}
