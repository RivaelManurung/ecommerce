"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, Plus, Boxes } from "lucide-react";
import { variantSchema, type VariantInput, type VariantValues } from "@/lib/validations";
import { addVariant, deleteVariant } from "@/features/products/api";
import { ApiError } from "@/lib/api-client";
import type { Product } from "@/lib/admin-types";
import { toast } from "@/components/admin/toast";
import { formatIDR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/admin/data-state";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

export function VariantManager({
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
  } = useForm<VariantInput, unknown, VariantValues>({
    resolver: zodResolver(variantSchema),
    defaultValues: { name: "", sku: "", price: 0, stock: 0, weight: 0 },
  });

  async function onAdd(values: VariantValues) {
    try {
      const updated = await addVariant(product.id, values);
      onChange(updated);
      reset();
      toast.success("Variant added");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to add variant");
    }
  }

  async function onRemove(variantId: string) {
    setRemoving(variantId);
    try {
      const updated = await deleteVariant(product.id, variantId);
      onChange(updated);
      toast.success("Variant removed");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to remove variant");
    } finally {
      setRemoving(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Variants</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {product.variants.length === 0 ? (
          <EmptyState icon={<Boxes size={24} />} title="No variants" description="Add a variant below." />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>SKU</TH>
                <TH className="text-right">Price</TH>
                <TH className="text-right">Stock</TH>
                <TH className="text-right">Weight (g)</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {product.variants.map((v) => (
                <TR key={v.id}>
                  <TD className="font-medium text-zinc-900">{v.name}</TD>
                  <TD className="text-zinc-500">{v.sku || "—"}</TD>
                  <TD className="text-right">{formatIDR(v.price)}</TD>
                  <TD className="text-right">{v.stock}</TD>
                  <TD className="text-right">{v.weight || "—"}</TD>
                  <TD className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Remove variant"
                      disabled={removing === v.id}
                      onClick={() => onRemove(v.id)}
                    >
                      {removing === v.id ? (
                        <Spinner size={14} />
                      ) : (
                        <Trash2 size={15} className="text-red-600" />
                      )}
                    </Button>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}

        <form onSubmit={handleSubmit(onAdd)} className="space-y-3 border-t border-zinc-100 pt-4" noValidate>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-1.5">
              <Label htmlFor="v-name">Name</Label>
              <Input id="v-name" {...register("name")} />
              {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="v-sku">SKU</Label>
              <Input id="v-sku" {...register("sku")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="v-price">Price</Label>
              <Input id="v-price" type="number" min={0} {...register("price")} />
              {errors.price && <p className="text-xs text-red-600">{errors.price.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="v-stock">Stock</Label>
              <Input id="v-stock" type="number" min={0} {...register("stock")} />
              {errors.stock && <p className="text-xs text-red-600">{errors.stock.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="v-weight">Weight (g)</Label>
              <Input id="v-weight" type="number" min={0} {...register("weight")} />
              {errors.weight && <p className="text-xs text-red-600">{errors.weight.message}</p>}
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="outline" size="sm" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size={14} /> : <Plus size={14} />}
              Add variant
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
