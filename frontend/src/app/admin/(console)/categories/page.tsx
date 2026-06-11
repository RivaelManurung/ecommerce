"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Tags } from "lucide-react";
import { listCategories, deleteCategory } from "@/features/categories/api";
import type { Category, PaginationMeta } from "@/lib/admin-types";
import { ApiError } from "@/lib/api-client";
import { PageHeader } from "@/components/admin/page-header";
import { CategoryStatusBadge } from "@/components/admin/status-badge";
import { ErrorState, EmptyState, TableSkeleton } from "@/components/admin/data-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PaginationBar } from "@/components/admin/pagination-bar";
import { toast } from "@/components/admin/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

const LIMIT = 10;

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, meta } = await listCategories({
        page,
        limit: LIMIT,
        search,
        status,
        sort: "sortOrder",
        order: "asc",
      });
      setItems(data);
      setMeta(meta);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  async function confirmDelete() {
    if (!pending) return;
    setDeleting(true);
    try {
      await deleteCategory(pending.id);
      toast.success("Category deleted");
      setPending(null);
      if (items.length === 1 && page > 1) setPage((p) => p - 1);
      else load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Organize products into browsable groups."
        actions={
          <Link href="/admin/categories/create">
            <Button variant="default" size="sm">
              <Plus size={15} /> New category
            </Button>
          </Link>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search categories…"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="sm:max-w-xs"
        />
        <Select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="sm:max-w-[160px]"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
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
              icon={<Tags size={28} />}
              title="No categories yet"
              description="Create your first category to start grouping products."
              action={
                <Link href="/admin/categories/create">
                  <Button variant="default" size="sm">
                    <Plus size={15} /> New category
                  </Button>
                </Link>
              }
            />
          </div>
        ) : (
          <>
            <Table>
              <THead>
                <TR>
                  <TH>Name</TH>
                  <TH>Slug</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Order</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {items.map((c) => (
                  <TR key={c.id}>
                    <TD className="font-medium text-zinc-900">{c.name}</TD>
                    <TD className="text-zinc-500">{c.slug}</TD>
                    <TD>
                      <CategoryStatusBadge status={c.status} />
                    </TD>
                    <TD className="text-right">{c.sortOrder}</TD>
                    <TD className="text-right">
                      <div className="flex justify-end gap-1">
                        <Link href={`/admin/categories/${c.id}/edit`}>
                          <Button variant="ghost" size="icon" aria-label="Edit">
                            <Pencil size={15} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete"
                          onClick={() => setPending(c)}
                        >
                          <Trash2 size={15} className="text-red-600" />
                        </Button>
                      </div>
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
        open={Boolean(pending)}
        title="Delete category"
        description={`Delete "${pending?.name}"? Categories with products cannot be deleted.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
