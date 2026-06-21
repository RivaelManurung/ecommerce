"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createCoupon, updateCoupon, type Coupon } from "@/features/admin-coupons/api";
import { ApiError } from "@/lib/api-client";
import { toast } from "@/components/admin/toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type FormValues = {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minSpend: number;
  maxDiscount: number;
  usageLimit: number;
  active: "true" | "false";
  startsAt: string;
  endsAt: string;
};

// ISO (with time) → value for <input type="date">.
function toDateInput(iso?: string | null): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}
// date input → RFC3339 at midnight UTC, or null.
function toIso(date: string): string | null {
  return date ? new Date(date + "T00:00:00Z").toISOString() : null;
}

export function CouponForm({ existing }: { existing?: Coupon }) {
  const router = useRouter();
  const isEdit = Boolean(existing);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      code: existing?.code ?? "",
      type: existing?.type ?? "percent",
      value: existing?.value ?? 10,
      minSpend: existing?.minSpend ?? 0,
      maxDiscount: existing?.maxDiscount ?? 0,
      usageLimit: existing?.usageLimit ?? 0,
      active: existing ? (existing.active ? "true" : "false") : "true",
      startsAt: toDateInput(existing?.startsAt),
      endsAt: toDateInput(existing?.endsAt),
    },
  });

  const type = watch("type");

  const onSubmit = async (v: FormValues) => {
    setServerError(null);
    setSubmitting(true);
    const input = {
      code: v.code,
      type: v.type,
      value: Number(v.value),
      minSpend: Number(v.minSpend),
      maxDiscount: Number(v.maxDiscount),
      usageLimit: Number(v.usageLimit),
      active: v.active === "true",
      startsAt: toIso(v.startsAt),
      endsAt: toIso(v.endsAt),
    };
    try {
      if (isEdit && existing) {
        await updateCoupon(existing.id, input);
        toast.success("Coupon updated");
      } else {
        await createCoupon(input);
        toast.success("Coupon created");
      }
      router.push("/admin/coupons");
      router.refresh();
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-5" noValidate>
        {serverError ? (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="code">Code</Label>
            <Input id="code" className="uppercase" {...register("code", { required: "Code is required", minLength: { value: 3, message: "Min 3 chars" } })} />
            {errors.code && <p className="text-xs text-red-600">{errors.code.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="type">Type</Label>
            <Select id="type" {...register("type")}>
              <option value="percent">Percentage (%)</option>
              <option value="fixed">Fixed amount (IDR)</option>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="value">{type === "percent" ? "Percent (1–100)" : "Amount (IDR)"}</Label>
            <Input id="value" type="number" min={1} {...register("value", { required: true, valueAsNumber: true, min: 1 })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="minSpend">Minimum spend (IDR)</Label>
            <Input id="minSpend" type="number" min={0} {...register("minSpend", { valueAsNumber: true })} />
          </div>
          {type === "percent" ? (
            <div className="space-y-1.5">
              <Label htmlFor="maxDiscount">Max discount cap (IDR, 0 = none)</Label>
              <Input id="maxDiscount" type="number" min={0} {...register("maxDiscount", { valueAsNumber: true })} />
            </div>
          ) : null}
          <div className="space-y-1.5">
            <Label htmlFor="usageLimit">Usage limit (0 = unlimited)</Label>
            <Input id="usageLimit" type="number" min={0} {...register("usageLimit", { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="startsAt">Starts at (optional)</Label>
            <Input id="startsAt" type="date" {...register("startsAt")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="endsAt">Ends at (optional)</Label>
            <Input id="endsAt" type="date" {...register("endsAt")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="active">Status</Label>
            <Select id="active" {...register("active")}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-zinc-100 pt-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/coupons")} disabled={submitting}>Cancel</Button>
          <Button type="submit" variant="default" disabled={submitting}>{submitting ? "Saving…" : isEdit ? "Save changes" : "Create coupon"}</Button>
        </div>
      </form>
    </Card>
  );
}
