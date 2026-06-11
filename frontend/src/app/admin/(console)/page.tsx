"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Tags, Inbox, FileText } from "lucide-react";
import { getDashboardStats } from "@/features/dashboard/api";
import type { DashboardStats } from "@/lib/admin-types";
import { ApiError } from "@/lib/api-client";
import { PageHeader } from "@/components/admin/page-header";
import { ErrorState } from "@/components/admin/data-state";
import { InquiryStatusBadge } from "@/components/admin/status-badge";
import { formatDateTime } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    setError(null);
    getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, []);

  const cards = [
    { label: "Published products", value: stats?.products.published, icon: Package, href: "/admin/products" },
    { label: "Total products", value: stats?.products.total, icon: Package, href: "/admin/products" },
    { label: "Categories", value: stats?.categories, icon: Tags, href: "/admin/categories" },
    { label: "New inquiries", value: stats?.inquiriesNew, icon: Inbox, href: "/admin/inquiries" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Catalog overview at a glance." />

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c) => {
              const Icon = c.icon;
              return (
                <Link key={c.label} href={c.href}>
                  <Card className="transition hover:border-zinc-300">
                    <CardContent className="flex items-center justify-between pt-5">
                      <div>
                        <p className="text-sm text-zinc-500">{c.label}</p>
                        {loading ? (
                          <Skeleton className="mt-2 h-7 w-12" />
                        ) : (
                          <p className="mt-1 text-2xl font-semibold text-zinc-900">{c.value ?? 0}</p>
                        )}
                      </div>
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-zinc-100 text-zinc-600">
                        <Icon size={18} />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {!loading && stats && (
            <div className="rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
              Product status breakdown:&nbsp;
              <span className="font-medium text-zinc-900">{stats.products.draft}</span> draft ·{" "}
              <span className="font-medium text-zinc-900">{stats.products.published}</span> published ·{" "}
              <span className="font-medium text-zinc-900">{stats.products.archived}</span> archived
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-32 w-full" />
                ) : stats && stats.recentInquiries.length > 0 ? (
                  <Table>
                    <THead>
                      <TR>
                        <TH>From</TH>
                        <TH>Status</TH>
                        <TH className="text-right">Received</TH>
                      </TR>
                    </THead>
                    <TBody>
                      {stats.recentInquiries.map((i) => (
                        <TR key={i.id}>
                          <TD className="font-medium text-zinc-900">{i.name}</TD>
                          <TD>
                            <InquiryStatusBadge status={i.status} />
                          </TD>
                          <TD className="text-right text-zinc-500">{formatDateTime(i.createdAt)}</TD>
                        </TR>
                      ))}
                    </TBody>
                  </Table>
                ) : (
                  <p className="py-6 text-center text-sm text-zinc-400">No inquiries yet.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent activity</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-32 w-full" />
                ) : stats && stats.recentAudit.length > 0 ? (
                  <ul className="space-y-3">
                    {stats.recentAudit.map((a) => (
                      <li key={a.id} className="flex items-start gap-3 text-sm">
                        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-zinc-100 text-zinc-500">
                          <FileText size={13} />
                        </span>
                        <div>
                          <p className="text-zinc-800">{a.summary}</p>
                          <p className="text-xs text-zinc-400">
                            {a.actorEmail} · {formatDateTime(a.createdAt)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="py-6 text-center text-sm text-zinc-400">No activity yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
