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
import { AdminDatePicker } from "@/components/ui/date-picker";
import { AdminSelect } from "@/components/ui/select";
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

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <AdminSelect
          value={action}
          onChange={(val) => { setPage(1); setAction(val); }}
          options={[
            { value: "", label: "All actions" },
            { value: "create", label: "Create" },
            { value: "update", label: "Update" },
            { value: "delete", label: "Delete" },
            { value: "status_change", label: "Status change" },
            { value: "login", label: "Login" },
            { value: "logout", label: "Logout" },
          ]}
          className="sm:w-[180px]"
        />
        <AdminSelect
          value={entity}
          onChange={(val) => { setPage(1); setEntity(val); }}
          options={[
            { value: "", label: "All entities" },
            { value: "product", label: "Product" },
            { value: "category", label: "Category" },
            { value: "order", label: "Order" },
            { value: "customer", label: "Customer" },
            { value: "admin_user", label: "Admin user" },
            { value: "coupon", label: "Coupon" },
            { value: "review", label: "Review" },
            { value: "stock", label: "Stock" },
            { value: "inquiry", label: "Inquiry" },
            { value: "setting", label: "Setting" },
            { value: "auth", label: "Auth" },
            { value: "user", label: "User" },
          ]}
          className="sm:w-[180px]"
        />
        <AdminDatePicker
          value={from}
          onChange={(val) => { setPage(1); setFrom(val); }}
          placeholder="Start date"
          className="sm:w-[150px]"
        />
        <AdminDatePicker
          value={to}
          onChange={(val) => { setPage(1); setTo(val); }}
          placeholder="End date"
          className="sm:w-[150px]"
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
