"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { getProduct, updateProduct, deleteProduct } from "@/features/products/api";
import type { Product, ProductStatus } from "@/lib/admin-types";
import { ApiError } from "@/lib/api-client";
import { PageHeader } from "@/components/admin/page-header";
import { ProductStatusBadge } from "@/components/admin/status-badge";
import { ErrorState } from "@/components/admin/data-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "@/components/admin/toast";
import { formatIDR, formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { ImageManager } from "@/features/products/image-manager";
import { VariantManager } from "@/features/products/variant-manager";

// Allowed forward actions per the backend status workflow.
const actions: Record<ProductStatus, { label: string; to: ProductStatus }[]> = {
  draft: [{ label: "Publish", to: "published" }],
  published: [
    { label: "Archive", to: "archived" },
    { label: "Unpublish", to: "draft" },
  ],
  archived: [{ label: "Republish", to: "published" }],
};

export function ProductDetail({ id }: { id: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [changing, setChanging] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getProduct(id)
      .then(setProduct)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load product"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  async function changeStatus(to: ProductStatus) {
    if (!product) return;
    setChanging(true);
    try {
      const updated = await updateProduct(product.id, {
        name: product.name,
        categoryId: product.categoryId,
        description: product.description,
        status: to,
        basePrice: product.basePrice,
        currency: product.currency,
      });
      setProduct(updated);
      toast.success(`Product ${to}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to change status");
    } finally {
      setChanging(false);
    }
  }

  async function onDelete() {
    if (!product) return;
    setDeleting(true);
    try {
      await deleteProduct(product.id);
      toast.success("Product deleted");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete");
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  if (loading) return <Skeleton className="h-96 w-full" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!product) return null;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft size={14} /> Back to products
      </Link>

      <PageHeader
        title={product.name}
        description={`${product.category?.name ?? "Uncategorized"} · ${product.slug}`}
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/admin/products/${product.id}/edit`}>
              <Button variant="outline" size="sm">
                <Pencil size={14} /> Edit
              </Button>
            </Link>
            <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(true)}>
              <Trash2 size={14} /> Delete
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-5">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-400">Status</p>
              <div className="mt-1">
                <ProductStatusBadge status={product.status} />
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-400">Base price</p>
              <p className="mt-1 font-semibold text-zinc-900">{formatIDR(product.basePrice)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-400">Updated</p>
              <p className="mt-1 text-sm text-zinc-600">{formatDateTime(product.updatedAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {actions[product.status].map((a) => (
              <Button
                key={a.to}
                variant={a.to === "published" ? "default" : "outline"}
                size="sm"
                disabled={changing}
                onClick={() => changeStatus(a.to)}
              >
                {changing && <Spinner size={13} />}
                {a.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {product.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-sm text-zinc-600">{product.description}</p>
          </CardContent>
        </Card>
      )}

      <ImageManager product={product} onChange={setProduct} />
      <VariantManager product={product} onChange={setProduct} />

      <ConfirmDialog
        open={confirmDelete}
        title="Delete product"
        description={`Delete "${product.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={onDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
