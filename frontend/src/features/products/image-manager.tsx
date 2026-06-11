"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, Star, ImageIcon, Plus } from "lucide-react";
import { imageSchema, type ImageInput, type ImageValues } from "@/lib/validations";
import { addImage, deleteImage } from "@/features/products/api";
import { ApiError } from "@/lib/api-client";
import type { Product } from "@/lib/admin-types";
import { toast } from "@/components/admin/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/admin/data-state";

export function ImageManager({
  product,
  onChange,
}: {
  product: Product;
  onChange: (p: Product) => void;
}) {
  const [removing, setRemoving] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ImageInput, unknown, ImageValues>({
    resolver: zodResolver(imageSchema),
    defaultValues: { url: "", alt: "", isPrimary: false, sortOrder: 0 },
  });

  async function onAdd(values: ImageValues) {
    try {
      const updated = await addImage(product.id, values);
      onChange(updated);
      reset();
      toast.success("Image added");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to add image");
    }
  }

  async function onRemove(imageId: string) {
    setRemoving(imageId);
    try {
      const updated = await deleteImage(product.id, imageId);
      onChange(updated);
      toast.success("Image removed");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to remove image");
    } finally {
      setRemoving(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {product.images.length === 0 ? (
          <EmptyState icon={<ImageIcon size={24} />} title="No images" description="Add an image URL below." />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {product.images.map((img) => (
              <li
                key={img.id}
                className="flex items-center gap-3 rounded-lg border border-zinc-200 p-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt}
                  className="h-12 w-12 shrink-0 rounded-md border border-zinc-100 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-zinc-700">{img.alt || img.url}</p>
                  {img.isPrimary && (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                      <Star size={11} /> Primary
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remove image"
                  disabled={removing === img.id}
                  onClick={() => onRemove(img.id)}
                >
                  {removing === img.id ? (
                    <Spinner size={14} />
                  ) : (
                    <Trash2 size={15} className="text-red-600" />
                  )}
                </Button>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleSubmit(onAdd)} className="space-y-3 border-t border-zinc-100 pt-4" noValidate>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="img-url">Image URL</Label>
              <Input id="img-url" placeholder="https://… or /images/…" {...register("url")} />
              {errors.url && <p className="text-xs text-red-600">{errors.url.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="img-alt">Alt text</Label>
              <Input id="img-alt" {...register("alt")} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-600">
            <input type="checkbox" {...register("isPrimary")} className="h-4 w-4" />
            Set as primary image
          </label>
          <div className="flex justify-end">
            <Button type="submit" variant="outline" size="sm" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size={14} /> : <Plus size={14} />}
              Add image
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
