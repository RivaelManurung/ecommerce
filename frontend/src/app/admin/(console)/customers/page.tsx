"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Users, Search } from "lucide-react";
import { listCustomers } from "@/features/admin-customers/api";
import type { User, PaginationMeta } from "@/lib/admin-types";
import { ApiError } from "@/lib/api-client";
import { PageHeader } from "@/components/admin/page-header";
import { ErrorState, EmptyState, TableSkeleton } from "@/components/admin/data-state";
import { PaginationBar } from "@/components/admin/pagination-bar";
import { CustomerStatusBadge } from "@/components/admin/customer-status-badge";
import { formatDateTime } from "@/lib/format";
import { AdminSelect } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

const LIMIT = 10;

export default function CustomersPage() {
  const [items, setItems] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | "active" | "blocked">("");
  const [page, setPage] = useState(1);

  // Debounce the search box so we don't query on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, meta } = await listCustomers({ page, limit: LIMIT, search, status });
      setItems(data);
      setMeta(meta);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description="Storefront accounts, purchase history, and access control." />

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name or email…"
            className="pl-9"
            aria-label="Search customers"
          />
        </div>
        <AdminSelect
          value={status}
          onChange={(val) => {
            setPage(1);
            setStatus(val as "" | "active" | "blocked");
          }}
          options={[
            { value: "", label: "All statuses" },
            { value: "active", label: "Active" },
            { value: "blocked", label: "Blocked" },
          ]}
          className="w-[160px]"
        />
      </div>

      <Card>
        {loading ? (
          <div className="p-4">
            <TableSkeleton rows={6} cols={4} />
          </div>
        ) : error ? (
          <div className="p-4">
            <ErrorState message={error} onRetry={load} />
          </div>
        ) : items.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={<Users size={28} />}
              title="No customers found"
              description="Customers who register at the storefront appear here."
            />
          </div>
        ) : (
          <>
            <Table>
              <THead>
                <TR>
                  <TH>Customer</TH>
                  <TH>Joined</TH>
                  <TH>Login</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                {items.map((u) => (
                  <TR key={u.id}>
                    <TD>
                      <Link href={`/admin/customers/${u.id}`} className="font-medium text-zinc-900 hover:underline">
                        {u.name || "—"}
                      </Link>
                      <p className="text-xs text-zinc-500">{u.email}</p>
                    </TD>
                    <TD className="text-zinc-500">{formatDateTime(u.createdAt)}</TD>
                    <TD className="text-zinc-500">Email</TD>
                    <TD>
                      <CustomerStatusBadge active={u.active} />
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
