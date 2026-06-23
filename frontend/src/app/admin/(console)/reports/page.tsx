"use client";

import { useCallback, useEffect, useState } from "react";
import { TrendingUp, ShoppingCart, CircleDollarSign, Users, BadgeCheck } from "lucide-react";
import { getOverview, type Overview } from "@/features/admin-reports/api";
import { ApiError } from "@/lib/api-client";
import { PageHeader } from "@/components/admin/page-header";
import { ErrorState, TableSkeleton } from "@/components/admin/data-state";
import { OrderStatusBadge } from "@/components/admin/order-badges";
import { formatIDR } from "@/lib/format";
import type { OrderStatus } from "@/features/orders/api";
import { Card } from "@/components/ui/card";
import { AdminSelect } from "@/components/ui/select";

const RANGES = [
  { value: 7, label: "Last 7 days" },
  { value: 30, label: "Last 30 days" },
  { value: 90, label: "Last 90 days" },
];

export default function ReportsPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getOverview(days));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    void load();
  }, [load]);

  const maxRevenue = data ? Math.max(1, ...data.revenue.map((d) => d.amount)) : 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Sales and customer performance overview."
        actions={
          <AdminSelect
            value={String(days)}
            onChange={(val) => setDays(Number(val))}
            options={RANGES.map((r) => ({ value: String(r.value), label: r.label }))}
            className="w-[160px]"
          />
        }
      />

      {loading ? (
        <Card><div className="p-4"><TableSkeleton rows={6} cols={4} /></div></Card>
      ) : error || !data ? (
        <Card><div className="p-4"><ErrorState message={error ?? "No data"} onRetry={load} /></div></Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Stat icon={<CircleDollarSign size={18} />} label="Revenue (paid)" value={formatIDR(data.totalRevenue)} />
            <Stat icon={<ShoppingCart size={18} />} label="Orders" value={String(data.orderCount)} />
            <Stat icon={<BadgeCheck size={18} />} label="Paid orders" value={String(data.paidOrderCount)} />
            <Stat icon={<TrendingUp size={18} />} label="Avg order value" value={formatIDR(data.avgOrderValue)} />
            <Stat icon={<Users size={18} />} label="New customers" value={String(data.newCustomers)} />
          </div>

          <Card>
            <div className="border-b border-zinc-100 p-4 text-sm font-medium text-zinc-700">Revenue (paid orders)</div>
            <div className="p-4">
              {data.totalRevenue === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">No paid revenue in this period yet.</p>
              ) : (
                <div className="flex h-48 items-end gap-[3px]" role="img" aria-label="Daily revenue bar chart">
                  {data.revenue.map((d) => (
                    <div key={d.date} className="group relative flex-1" title={`${d.date}: ${formatIDR(d.amount)}`}>
                      <div
                        className="w-full rounded-t bg-zinc-900/85 transition group-hover:bg-zinc-900"
                        style={{ height: `${Math.max(2, (d.amount / maxRevenue) * 100)}%` }}
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-2 flex justify-between text-[11px] text-zinc-400">
                <span>{data.revenue[0]?.date}</span>
                <span>{data.revenue[data.revenue.length - 1]?.date}</span>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <div className="border-b border-zinc-100 p-4 text-sm font-medium text-zinc-700">Top products</div>
              {data.topProducts.length === 0 ? (
                <p className="p-4 text-sm text-zinc-500">No sales yet.</p>
              ) : (
                <ul className="divide-y divide-zinc-100">
                  {data.topProducts.map((p, i) => (
                    <li key={p.productId} className="flex items-center justify-between gap-3 p-4 text-sm">
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-600">{i + 1}</span>
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-zinc-900">{p.name}</span>
                          <span className="text-xs text-zinc-500">{p.quantity} sold</span>
                        </span>
                      </span>
                      <span className="font-semibold text-zinc-900">{formatIDR(p.revenue)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card>
              <div className="border-b border-zinc-100 p-4 text-sm font-medium text-zinc-700">Orders by status</div>
              {Object.keys(data.statusBreakdown).length === 0 ? (
                <p className="p-4 text-sm text-zinc-500">No orders in this period.</p>
              ) : (
                <ul className="divide-y divide-zinc-100">
                  {Object.entries(data.statusBreakdown).map(([status, count]) => (
                    <li key={status} className="flex items-center justify-between p-4 text-sm">
                      <OrderStatusBadge status={status as OrderStatus} />
                      <span className="font-semibold text-zinc-900">{count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <div className="flex items-center gap-3 p-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-zinc-100 text-zinc-600">{icon}</span>
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-zinc-900">{value}</p>
          <p className="text-xs text-zinc-500">{label}</p>
        </div>
      </div>
    </Card>
  );
}
