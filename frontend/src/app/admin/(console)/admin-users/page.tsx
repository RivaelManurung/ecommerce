"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Plus } from "lucide-react";
import { listAdminUsers } from "@/features/admin-users/api";
import type { User, PaginationMeta } from "@/lib/admin-types";
import { ApiError } from "@/lib/api-client";
import { PageHeader } from "@/components/admin/page-header";
import { ErrorState, EmptyState, TableSkeleton } from "@/components/admin/data-state";
import { PaginationBar } from "@/components/admin/pagination-bar";
import { CustomerStatusBadge } from "@/components/admin/customer-status-badge";
import { formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

const LIMIT = 10;

export default function AdminUsersPage() {
  const [items, setItems] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, meta } = await listAdminUsers({ page, limit: LIMIT });
      setItems(data);
      setMeta(meta);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load admins");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin users"
        description="Back-office staff accounts and their roles."
        actions={
          <Link
            href="/admin/admin-users/create"
            className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md bg-zinc-900 px-4 text-sm font-semibold text-zinc-50 transition hover:bg-zinc-800"
          >
            <Plus size={15} /> New admin
          </Link>
        }
      />

      <Card>
        {loading ? (
          <div className="p-4"><TableSkeleton rows={5} cols={4} /></div>
        ) : error ? (
          <div className="p-4"><ErrorState message={error} onRetry={load} /></div>
        ) : items.length === 0 ? (
          <div className="p-4">
            <EmptyState icon={<ShieldCheck size={28} />} title="No admins" description="Create a staff account to get started." />
          </div>
        ) : (
          <>
            <Table>
              <THead>
                <TR>
                  <TH>Name</TH>
                  <TH>Role</TH>
                  <TH>Created</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                {items.map((u) => (
                  <TR key={u.id}>
                    <TD>
                      <Link href={`/admin/admin-users/${u.id}`} className="font-medium text-zinc-900 hover:underline">
                        {u.name || "—"}
                      </Link>
                      <p className="text-xs text-zinc-500">{u.email}</p>
                    </TD>
                    <TD>
                      <Badge tone={u.role === "super_admin" ? "blue" : "neutral"}>
                        {u.role === "super_admin" ? "Super Admin" : "Admin"}
                      </Badge>
                    </TD>
                    <TD className="text-zinc-500">{formatDateTime(u.createdAt)}</TD>
                    <TD><CustomerStatusBadge active={u.active} /></TD>
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
