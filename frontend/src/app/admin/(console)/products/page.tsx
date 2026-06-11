"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, Package } from "lucide-react";
import { listProducts, deleteProduct } from "@/features/products/api";
import { listCategories } from "@/features/categories/api";
import type { Category, PaginationMeta, Product } from "@/lib/admin-types";
import { ApiError } from "@/lib/api-client";
import { PageHeader } from "@/components/admin/page-header";
import { ProductStatusBadge } from "@/components/admin/status-badge";
import { ErrorState, EmptyState, TableSkeleton } from "@/components/admin/data-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PaginationBar } from "@/components/admin/pagination-bar";
import { toast } from "@/components/admin/toast";
import { formatIDR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

const LIMIT = 10;

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    listCategories({ limit: 100, sort: "name", order: "asc" })
      .then(({ data }) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, meta } = await listProducts({
        page,
        limit: LIMIT,
        search,
        status,
        categoryId,
        sort: "createdAt",
        order: "desc",
      });
      setItems(data);
      setMeta(meta);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, search, status, categoryId]);

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  async function confirmDelete() {
    if (!pending) return;
    setDeleting(true);
    try {
      await deleteProduct(pending.id);
      toast.success("Product deleted");
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
        title="Products"
        description="Create, publish and manage catalog products."
        actions={
          <Link href="/admin/products/create">
            <Button variant="default" size="sm">
              <Plus size={15} /> New product
            </Button>
          </Link>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Input
          placeholder="Search products…"
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
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </Select>
        <Select
          value={categoryId}
          onChange={(e) => {
            setPage(1);
            setCategoryId(e.target.value);
          }}
          className="sm:max-w-[200px]"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <Card>
        {loading ? (
          <div className="p-4">
            <TableSkeleton rows={6} cols={5} />
          </div>
        ) : error ? (
          <div className="p-4">
            <ErrorState message={error} onRetry={load} />
          </div>
        ) : items.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={<Package size={28} />}
              title="No products found"
              description="Adjust your filters or create a new product."
              action={
                <Link href="/admin/products/create">
                  <Button variant="default" size="sm">
                    <Plus size={15} /> New product
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
                  <TH>Category</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Price</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {items.map((p) => (
                  <TR key={p.id}>
                    <TD className="font-medium text-zinc-900">
                      <Link href={`/admin/products/${p.id}`} className="hover:underline">
                        {p.name}
                      </Link>
                    </TD>
                    <TD className="text-zinc-500">{p.category?.name ?? "—"}</TD>
                    <TD>
                      <ProductStatusBadge status={p.status} />
                    </TD>
                    <TD className="text-right">{formatIDR(p.basePrice)}</TD>
                    <TD className="text-right">
                      <div className="flex justify-end gap-1">
                        <Link href={`/admin/products/${p.id}`}>
                          <Button variant="ghost" size="icon" aria-label="View">
                            <Eye size={15} />
                          </Button>
                        </Link>
                        <Link href={`/admin/products/${p.id}/edit`}>
                          <Button variant="ghost" size="icon" aria-label="Edit">
                            <Pencil size={15} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete"
                          onClick={() => setPending(p)}
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
        title="Delete product"
        description={`Delete "${pending?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
