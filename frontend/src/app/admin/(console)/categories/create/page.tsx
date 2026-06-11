"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { CategoryForm } from "@/features/categories/category-form";

export default function CreateCategoryPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft size={14} /> Back to categories
      </Link>
      <PageHeader title="New category" description="Add a category to your catalog." />
      <CategoryForm />
    </div>
  );
}
