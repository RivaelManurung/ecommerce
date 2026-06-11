"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, type CategoryInput, type CategoryValues } from "@/lib/validations";
import { createCategory, updateCategory } from "@/features/categories/api";
import { ApiError } from "@/lib/api-client";
import type { Category } from "@/lib/admin-types";
import { toast } from "@/components/admin/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const editing = Boolean(category);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput, unknown, CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
      status: category?.status ?? "active",
      sortOrder: category?.sortOrder ?? 0,
    },
  });

  async function onSubmit(values: CategoryValues) {
    try {
      if (editing && category) {
        await updateCategory(category.id, values);
        toast.success("Category updated");
      } else {
        await createCategory(values);
        toast.success("Category created");
      }
      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.details) {
          for (const [field, message] of Object.entries(err.details)) {
            setError(field as keyof CategoryValues, { message });
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

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} {...register("description")} />
            {errors.description && (
              <p className="text-xs text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select id="status" {...register("status")}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sortOrder">Sort order</Label>
              <Input id="sortOrder" type="number" min={0} {...register("sortOrder")} />
              {errors.sortOrder && (
                <p className="text-xs text-red-600">{errors.sortOrder.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-zinc-100 pt-4">
            <Link href="/admin/categories">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="default" disabled={isSubmitting}>
              {isSubmitting && <Spinner size={14} />}
              {editing ? "Save changes" : "Create category"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
