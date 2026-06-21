"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminUserForm } from "@/features/admin-users/admin-user-form";

export default function CreateAdminUserPage() {
  return (
    <div className="space-y-6">
      <Link href="/admin/admin-users" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900">
        <ArrowLeft size={14} /> Back to admins
      </Link>
      <PageHeader title="New admin" description="Create a back-office staff account and assign a role." />
      <AdminUserForm />
    </div>
  );
}
