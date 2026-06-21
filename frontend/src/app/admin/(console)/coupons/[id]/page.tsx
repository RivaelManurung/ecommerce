"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCoupon, type Coupon } from "@/features/admin-coupons/api";
import { CouponForm } from "@/features/admin-coupons/coupon-form";
import { ApiError } from "@/lib/api-client";
import { PageHeader } from "@/components/admin/page-header";
import { ErrorState, TableSkeleton } from "@/components/admin/data-state";
import { Card } from "@/components/ui/card";

export default function EditCouponPage() {
  const params = useParams<{ id: string }>();
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCoupon(await getCoupon(params.id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load coupon");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <Link href="/admin/coupons" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900">
        <ArrowLeft size={14} /> Back to coupons
      </Link>
      <PageHeader title={coupon ? coupon.code : "Coupon"} description="Edit discount settings." />
      {loading ? (
        <Card><div className="p-4"><TableSkeleton rows={3} cols={2} /></div></Card>
      ) : error || !coupon ? (
        <Card><div className="p-4"><ErrorState message={error ?? "Not found"} onRetry={load} /></div></Card>
      ) : (
        <CouponForm existing={coupon} />
      )}
    </div>
  );
}
