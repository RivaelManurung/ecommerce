"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCategory } from "@/features/categories/api";
import type { Category } from "@/lib/admin-types";
import { ApiError } from "@/lib/api-client";
import { PageHeader } from "@/components/admin/page-header";
import { CategoryForm } from "@/features/categories/category-form";
import { ErrorState } from "@/components/admin/data-state";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoryEdit({ id }: { id: string }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    setError(null);
    getCategory(id)
      .then(setCategory)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load category"))
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
        href="/admin/categories"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft size={14} /> Back to categories
      </Link>
      <PageHeader title="Edit category" description="Update category details." />
      {loading ? (
        <Skeleton className="h-72 w-full" />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : category ? (
        <CategoryForm category={category} />
      ) : null}
    </div>
  );
}
