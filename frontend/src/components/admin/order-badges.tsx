import type { OrderStatus } from "@/features/orders/api";

// Neutral, shadcn-style badges for the admin order screens (no storefront rose).
const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_CLASS: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  processing: "bg-blue-50 text-blue-700 ring-blue-600/20",
  shipped: "bg-violet-50 text-violet-700 ring-violet-600/20",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  completed: "bg-zinc-100 text-zinc-700 ring-zinc-500/20",
  cancelled: "bg-red-50 text-red-700 ring-red-600/20",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_CLASS[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function PaymentBadge({ status }: { status: "unpaid" | "paid" | "failed" }) {
  const map = {
    paid: { label: "Paid", cls: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
    unpaid: { label: "Unpaid", cls: "bg-amber-50 text-amber-700 ring-amber-600/20" },
    failed: { label: "Failed", cls: "bg-red-50 text-red-700 ring-red-600/20" },
  }[status] ?? { label: status, cls: "bg-zinc-100 text-zinc-700 ring-zinc-500/20" };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${map.cls}`}>
      {map.label}
    </span>
  );
}
