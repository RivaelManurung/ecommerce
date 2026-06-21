"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { listAdminOrders } from "@/features/admin-orders/api";
import type { Order } from "@/features/orders/api";
import type { PaginationMeta } from "@/lib/admin-types";
import { ApiError } from "@/lib/api-client";
import { PageHeader } from "@/components/admin/page-header";
import { ErrorState, EmptyState, TableSkeleton } from "@/components/admin/data-state";
import { PaginationBar } from "@/components/admin/pagination-bar";
import { OrderStatusBadge, PaymentBadge } from "@/components/admin/order-badges";
import { formatDateTime, formatIDR } from "@/lib/format";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

const LIMIT = 10;

export default function AdminOrdersPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, meta } = await listAdminOrders({ page, limit: LIMIT, status });
      setItems(data);
      setMeta(meta);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description="Customer orders from checkout." />

      <div className="flex">
        <Select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="sm:max-w-[200px]"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending payment</option>
          <option value="paid">Paid</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      </div>

      <Card>
        {loading ? (
          <div className="p-4">
            <TableSkeleton rows={6} cols={6} />
          </div>
        ) : error ? (
          <div className="p-4">
            <ErrorState message={error} onRetry={load} />
          </div>
        ) : items.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={<ClipboardList size={28} />}
              title="No orders"
              description="Orders placed at checkout will appear here."
            />
          </div>
        ) : (
          <>
            <Table>
              <THead>
                <TR>
                  <TH>Order</TH>
                  <TH>Customer</TH>
                  <TH>Date</TH>
                  <TH className="text-right">Total</TH>
                  <TH>Payment</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                {items.map((o) => (
                  <TR key={o.id}>
                    <TD>
                      <Link href={`/admin/orders/${o.id}`} className="font-medium text-zinc-900 hover:underline">
                        {o.orderNumber}
                      </Link>
                      <p className="text-xs text-zinc-500">{o.items.length} item</p>
                    </TD>
                    <TD>
                      <p className="text-zinc-900">{o.address.fullName}</p>
                      <p className="text-xs text-zinc-500">{o.address.city}</p>
                    </TD>
                    <TD className="text-zinc-500">{formatDateTime(o.createdAt)}</TD>
                    <TD className="text-right font-medium text-zinc-900">{formatIDR(o.total)}</TD>
                    <TD>
                      <PaymentBadge status={o.payment.status} />
                    </TD>
                    <TD>
                      <OrderStatusBadge status={o.status} />
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
            <PaginationBar meta={meta} onPage={setPage} />
          </>
        )}
      </Card>
    </div>
  );
}
