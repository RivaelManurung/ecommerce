"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAdminUser } from "@/features/admin-users/api";
import { AdminUserForm } from "@/features/admin-users/admin-user-form";
import type { User } from "@/lib/admin-types";
import { ApiError } from "@/lib/api-client";
import { PageHeader } from "@/components/admin/page-header";
import { ErrorState, TableSkeleton } from "@/components/admin/data-state";
import { Card } from "@/components/ui/card";

export default function EditAdminUserPage() {
  const params = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setUser(await getAdminUser(params.id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load admin");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <Link href="/admin/admin-users" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900">
        <ArrowLeft size={14} /> Back to admins
      </Link>
      <PageHeader title={user ? user.name || user.email : "Admin"} description="Update role or status." />
      {loading ? (
        <Card><div className="p-4"><TableSkeleton rows={3} cols={2} /></div></Card>
      ) : error || !user ? (
        <Card><div className="p-4"><ErrorState message={error ?? "Not found"} onRetry={load} /></div></Card>
      ) : (
        <AdminUserForm existing={user} />
      )}
    </div>
  );
}
