import type { OrderStatus } from "@/features/orders/api";

// Indonesian labels + badge styles for each order status.
export const ORDER_STATUS_META: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: "Menunggu Pembayaran", className: "bg-[#FBF0DC] text-[#9A6B12]" },
  paid: { label: "Sudah Dibayar", className: "bg-[#E3F0E6] text-[#3A7A4E]" },
  processing: { label: "Diproses", className: "bg-[#E6EEF7] text-[#3C6098]" },
  shipped: { label: "Dikirim", className: "bg-[#E8E6F7] text-[#5B4FA0]" },
  delivered: { label: "Tiba di Tujuan", className: "bg-[#E3F0E6] text-[#3A7A4E]" },
  completed: { label: "Selesai", className: "bg-[#E3F0E6] text-[#2F6B43]" },
  cancelled: { label: "Dibatalkan", className: "bg-[#FBEAEA] text-[#B23B3B]" },
};

export function orderStatusMeta(status: OrderStatus) {
  return ORDER_STATUS_META[status] ?? ORDER_STATUS_META.pending;
}
