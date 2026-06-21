"use client";

import { useCallback, useEffect, useState } from "react";
import { ScrollText } from "lucide-react";
import { listAuditLogs } from "@/features/audit/api";
import type { AuditLog, PaginationMeta } from "@/lib/admin-types";
import { ApiError } from "@/lib/api-client";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { ErrorState, EmptyState, TableSkeleton } from "@/components/admin/data-state";
import { PaginationBar } from "@/components/admin/pagination-bar";
import { formatDateTime } from "@/lib/format";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

const LIMIT = 15;

export default function AuditLogsPage() {
  const [items, setItems] = useState<AuditLog[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, meta } = await listAuditLogs({ page, limit: LIMIT, action, entity, from: from || undefined, to: to || undefined });
      setItems(data);
      setMeta(meta);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  }, [page, action, entity, from, to]);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" description="Every administrative change, newest first." />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Select
          value={action}
          onChange={(e) => {
            setPage(1);
            setAction(e.target.value);
          }}
          className="sm:max-w-[180px]"
        >
          <option value="">All actions</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
          <option value="status_change">Status change</option>
          <option value="login">Login</option>
          <option value="logout">Logout</option>
        </Select>
        <Select
          value={entity}
          onChange={(e) => {
            setPage(1);
            setEntity(e.target.value);
          }}
          className="sm:max-w-[180px]"
        >
          <option value="">All entities</option>
          <option value="product">Product</option>
          <option value="category">Category</option>
          <option value="order">Order</option>
          <option value="customer">Customer</option>
          <option value="admin_user">Admin user</option>
          <option value="coupon">Coupon</option>
          <option value="review">Review</option>
          <option value="stock">Stock</option>
          <option value="inquiry">Inquiry</option>
          <option value="setting">Setting</option>
          <option value="auth">Auth</option>
          <option value="user">User</option>
        </Select>
        <input
          type="date"
          value={from}
          onChange={(e) => { setPage(1); setFrom(e.target.value); }}
          aria-label="From date"
          className="h-9 rounded-md border border-zinc-200 bg-white px-2 text-sm text-zinc-700 outline-none focus:border-zinc-400 sm:max-w-[150px]"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => { setPage(1); setTo(e.target.value); }}
          aria-label="To date"
          className="h-9 rounded-md border border-zinc-200 bg-white px-2 text-sm text-zinc-700 outline-none focus:border-zinc-400 sm:max-w-[150px]"
        />
      </div>

      <Card>
        {loading ? (
          <div className="p-4">
            <TableSkeleton rows={8} cols={4} />
          </div>
        ) : error ? (
          <div className="p-4">
            <ErrorState message={error} onRetry={load} />
          </div>
        ) : items.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={<ScrollText size={28} />}
              title="No audit entries"
              description="Administrative changes will be recorded here."
            />
          </div>
        ) : (
          <>
            <Table>
              <THead>
                <TR>
                  <TH>Action</TH>
                  <TH>Summary</TH>
                  <TH>Actor</TH>
                  <TH className="text-right">When</TH>
                </TR>
              </THead>
              <TBody>
                {items.map((a) => (
                  <TR key={a.id}>
                    <TD>
                      <Badge tone="neutral">{a.action.replace("_", " ")}</Badge>
                    </TD>
                    <TD className="text-zinc-700">{a.summary}</TD>
                    <TD className="text-zinc-500">{a.actorEmail || "—"}</TD>
                    <TD className="text-right text-zinc-500">{formatDateTime(a.createdAt)}</TD>
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
