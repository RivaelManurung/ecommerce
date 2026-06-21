"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { CouponForm } from "@/features/admin-coupons/coupon-form";

export default function CreateCouponPage() {
  return (
    <div className="space-y-6">
      <Link href="/admin/coupons" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900">
        <ArrowLeft size={14} /> Back to coupons
      </Link>
      <PageHeader title="New coupon" description="Create a discount code." />
      <CouponForm />
    </div>
  );
}
