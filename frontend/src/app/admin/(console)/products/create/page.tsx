"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/features/products/product-form";

export default function CreateProductPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft size={14} /> Back to products
      </Link>
      <PageHeader
        title="New product"
        description="Products start as a draft. Add images and variants, then publish."
      />
      <ProductForm />
    </div>
  );
}
