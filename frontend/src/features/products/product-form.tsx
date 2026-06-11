"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductInput, type ProductValues } from "@/lib/validations";
import { createProduct, updateProduct } from "@/features/products/api";
import { listCategories } from "@/features/categories/api";
import { ApiError } from "@/lib/api-client";
import type { Category, Product } from "@/lib/admin-types";
import { toast } from "@/components/admin/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const editing = Boolean(product);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    listCategories({ limit: 100, sort: "name", order: "asc" })
      .then(({ data }) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput, unknown, ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      categoryId: product?.categoryId ?? "",
      description: product?.description ?? "",
      status: product?.status ?? "draft",
      basePrice: product?.basePrice ?? 0,
      currency: product?.currency ?? "IDR",
    },
  });

  async function onSubmit(values: ProductValues) {
    try {
      if (editing && product) {
        await updateProduct(product.id, values);
        toast.success("Product updated");
        router.push(`/admin/products/${product.id}`);
      } else {
        const created = await createProduct(values);
        toast.success("Product created");
        router.push(`/admin/products/${created.id}`);
      }
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.details) {
          for (const [field, message] of Object.entries(err.details)) {
            setError(field as keyof ProductValues, { message });
          }
        }
        toast.error(err.message);
      } else {
        toast.error("Unexpected error");
      }
    }
  }

  return (
    <Card>
      <CardContent className="pt-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="categoryId">Category</Label>
              <Select id="categoryId" {...register("categoryId")}>
                <option value="">Select a category…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
              {errors.categoryId && (
                <p className="text-xs text-red-600">{errors.categoryId.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select id="status" {...register("status")}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </Select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="basePrice">Base price (IDR)</Label>
              <Input id="basePrice" type="number" min={0} {...register("basePrice")} />
              {errors.basePrice && (
                <p className="text-xs text-red-600">{errors.basePrice.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" {...register("currency")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={5} {...register("description")} />
            {errors.description && (
              <p className="text-xs text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t border-zinc-100 pt-4">
            <Link href="/admin/products">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="default" disabled={isSubmitting}>
              {isSubmitting && <Spinner size={14} />}
              {editing ? "Save changes" : "Create product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
