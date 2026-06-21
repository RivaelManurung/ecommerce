"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Ticket, Plus, Trash2 } from "lucide-react";
import { listCoupons, deleteCoupon, type Coupon } from "@/features/admin-coupons/api";
import type { PaginationMeta } from "@/lib/admin-types";
import { ApiError } from "@/lib/api-client";
import { PageHeader } from "@/components/admin/page-header";
import { ErrorState, EmptyState, TableSkeleton } from "@/components/admin/data-state";
import { PaginationBar } from "@/components/admin/pagination-bar";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "@/components/admin/toast";
import { formatIDR } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

const LIMIT = 10;

export default function CouponsPage() {
  const [items, setItems] = useState<Coupon[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<Coupon | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, meta } = await listCoupons({ page, limit: LIMIT });
      setItems(data);
      setMeta(meta);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load coupons");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteCoupon(toDelete.id);
      toast.success("Coupon deleted");
      setToDelete(null);
      void load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupons"
        description="Discount codes for checkout."
        actions={
          <Link href="/admin/coupons/create" className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md bg-zinc-900 px-4 text-sm font-semibold text-zinc-50 transition hover:bg-zinc-800">
            <Plus size={15} /> New coupon
          </Link>
        }
      />

      <Card>
        {loading ? (
          <div className="p-4"><TableSkeleton rows={5} cols={5} /></div>
        ) : error ? (
          <div className="p-4"><ErrorState message={error} onRetry={load} /></div>
        ) : items.length === 0 ? (
          <div className="p-4"><EmptyState icon={<Ticket size={28} />} title="No coupons" description="Create a discount code to get started." /></div>
        ) : (
          <>
            <Table>
              <THead>
                <TR>
                  <TH>Code</TH>
                  <TH>Discount</TH>
                  <TH>Min spend</TH>
                  <TH>Usage</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {items.map((c) => (
                  <TR key={c.id}>
                    <TD>
                      <Link href={`/admin/coupons/${c.id}`} className="font-mono font-medium text-zinc-900 hover:underline">{c.code}</Link>
                    </TD>
                    <TD className="text-zinc-700">{c.type === "percent" ? `${c.value}%` : formatIDR(c.value)}</TD>
                    <TD className="text-zinc-500">{c.minSpend ? formatIDR(c.minSpend) : "—"}</TD>
                    <TD className="text-zinc-500">{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</TD>
                    <TD><Badge tone={c.active ? "green" : "neutral"}>{c.active ? "Active" : "Inactive"}</Badge></TD>
                    <TD className="text-right">
                      <Button variant="ghost" size="icon" aria-label="Delete coupon" onClick={() => setToDelete(c)}>
                        <Trash2 size={15} className="text-red-600" />
                      </Button>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
            <PaginationBar meta={meta} onPage={setPage} />
          </>
        )}
      </Card>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title={`Delete coupon ${toDelete?.code ?? ""}?`}
        description="This cannot be undone. Existing orders keep their applied discount."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
