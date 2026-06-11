"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProduct } from "@/features/products/api";
import type { Product } from "@/lib/admin-types";
import { ApiError } from "@/lib/api-client";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/features/products/product-form";
import { ErrorState } from "@/components/admin/data-state";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductEdit({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    setError(null);
    getProduct(id)
      .then(setProduct)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load product"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="space-y-6">
      <Link
        href={`/admin/products/${id}`}
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft size={14} /> Back to product
      </Link>
      <PageHeader title="Edit product" description="Update the core product details." />
      {loading ? (
        <Skeleton className="h-96 w-full" />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : product ? (
        <ProductForm product={product} />
      ) : null}
    </div>
  );
}
