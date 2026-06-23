"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  MessageSquare,
  ScrollText,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { getDashboardStats } from "@/features/dashboard/api";
import { getOverview, type Overview } from "@/features/admin-reports/api";
import type { DashboardStats } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/page-header";
import { TableSkeleton, ErrorState } from "@/components/admin/data-state";
import { InquiryStatusBadge } from "@/components/admin/status-badge";
import { formatIDR, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils/cn";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"products" | "inquiries" | "audits">("products");
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [overview, setOverview] = useState<Overview | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getDashboardStats(), getOverview(30)])
      .then(([statsData, overviewData]) => {
        setStats(statsData);
        setOverview(overviewData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load dashboard data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Overview of your business performance." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-5 h-[116px]">
              <TableSkeleton rows={2} cols={1} />
            </Card>
          ))}
        </div>
        <Card className="p-5 h-[360px]"><TableSkeleton rows={6} cols={1} /></Card>
      </div>
    );
  }

  if (error || !stats || !overview) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Overview of your business performance." />
        <Card className="p-6">
          <ErrorState message={error || "Data not available"} onRetry={() => window.location.reload()} />
        </Card>
      </div>
    );
  }

  // 1. KPI Cards Mapping
  const kpiCards = [
    {
      label: "Total Revenue (30d)",
      value: formatIDR(overview.totalRevenue),
      trend: overview.totalRevenue > 0 ? "Trending ↗" : "Stable",
      up: overview.totalRevenue > 0,
      sub: "Paid orders only",
      icon: <CircleDollarSign size={16} className="text-gray-500" />,
    },
    {
      label: "Paid Orders (30d)",
      value: String(overview.paidOrderCount),
      trend: overview.paidOrderCount > 0 ? "Active ↗" : "Stable",
      up: overview.paidOrderCount > 0,
      sub: `Out of ${overview.orderCount} total orders`,
      icon: <ShoppingCart size={16} className="text-gray-500" />,
    },
    {
      label: "New Customers (30d)",
      value: String(overview.newCustomers),
      trend: overview.newCustomers > 0 ? "Growing ↗" : "Stable",
      up: overview.newCustomers > 0,
      sub: "Accounts created recently",
      icon: <Users size={16} className="text-gray-500" />,
    },
    {
      label: "Active Products",
      value: String(stats.products.published),
      trend: `${stats.categories} categories`,
      up: true,
      sub: `${stats.products.draft} drafts, ${stats.products.archived} archived`,
      icon: <Package size={16} className="text-gray-500" />,
    },
  ];

  const maxRevenue = Math.max(1, ...overview.revenue.map((d) => d.amount));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your business performance."
        actions={
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-md shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Live data sync
          </div>
        }
      />

      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpiCards.map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-gray-200 bg-white p-5 space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                  {card.icon}
                  {card.label}
                </p>
                <span
                  className={cn(
                    "flex items-center gap-0.5 text-xs font-semibold",
                    card.up ? "text-green-600" : "text-gray-500",
                  )}
                >
                  {card.up ? <TrendingUp size={12} /> : null}
                  {card.trend}
                </span>
              </div>
              <p className="text-2xl font-semibold text-gray-900 tracking-tight">{card.value}</p>
              <div>
                <p className="text-xs text-gray-500">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Area Chart — Revenue 30 Days */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Revenue Performance</p>
              <p className="text-xs text-gray-500 mt-0.5">Daily paid revenue for the last 30 days</p>
            </div>
            <Link href="/admin/reports" className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
              View full report <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="h-[280px]">
            {overview.revenue.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                No revenue data in this period.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={overview.revenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#111827" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#d1d5db"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={20}
                  />
                  <YAxis
                    stroke="#d1d5db"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `Rp ${(val / 1000).toLocaleString()}k`}
                  />
                  <Tooltip
                    formatter={(value: any) => [formatIDR(Number(value)), "Revenue"]}
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#111827"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#111827", stroke: "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Bottom Section: Tabs + Table */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4">
            <div className="flex">
              {[
                { key: "products", label: "Top Products", icon: <Package size={14} /> },
                { key: "inquiries", label: "Recent Inquiries", icon: <MessageSquare size={14} />, count: stats.inquiriesNew },
                { key: "audits", label: "System Activity", icon: <ScrollText size={14} /> },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={cn(
                    "flex items-center gap-1.5 border-b-2 px-3 py-3 text-xs font-medium transition-colors",
                    activeTab === tab.key
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700",
                  )}
                >
                  <span className={activeTab === tab.key ? "text-gray-900" : "text-gray-400"}>{tab.icon}</span>
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
                      {tab.count} New
                    </span>
                  )}
                </button>
              ))}
            </div>
            {activeTab === "products" && (
              <Link href="/admin/products" className="text-xs font-medium text-blue-600 hover:text-blue-800">
                Manage Catalog &rarr;
              </Link>
            )}
            {activeTab === "inquiries" && (
              <Link href="/admin/inquiries" className="text-xs font-medium text-blue-600 hover:text-blue-800">
                View Inbox &rarr;
              </Link>
            )}
            {activeTab === "audits" && (
              <Link href="/admin/audit-logs" className="text-xs font-medium text-blue-600 hover:text-blue-800">
                View Full Logs &rarr;
              </Link>
            )}
          </div>

          {/* Tables based on active tab */}
          <table className="w-full text-sm">
            {activeTab === "products" && (
              <>
                <thead className="bg-gray-50/50">
                  <tr className="border-b border-gray-200">
                    <th className="py-2.5 pl-5 pr-3 text-left text-xs font-medium text-gray-500">Rank</th>
                    <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500">Product Name</th>
                    <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500">Units Sold</th>
                    <th className="px-3 py-2.5 text-right text-xs font-medium text-gray-500 pr-5">Revenue Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {overview.topProducts.length === 0 ? (
                    <tr><td colSpan={4} className="p-6 text-center text-xs text-gray-500">No sales data yet.</td></tr>
                  ) : (
                    overview.topProducts.slice(0, 5).map((p, idx) => (
                      <tr key={p.productId} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-2.5 pl-5 pr-3">
                          <span className="grid h-6 w-6 place-items-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                            {idx + 1}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-medium text-gray-900 text-xs">{p.name}</td>
                        <td className="px-3 py-2.5 text-xs text-gray-600">{p.quantity} units</td>
                        <td className="px-3 py-2.5 text-xs text-gray-900 font-semibold text-right pr-5">{formatIDR(p.revenue)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </>
            )}

            {activeTab === "inquiries" && (
              <>
                <thead className="bg-gray-50/50">
                  <tr className="border-b border-gray-200">
                    <th className="py-2.5 pl-5 pr-3 text-left text-xs font-medium text-gray-500">Status</th>
                    <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500">Sender</th>
                    <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500">Message Snippet</th>
                    <th className="px-3 py-2.5 text-right text-xs font-medium text-gray-500 pr-5">Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recentInquiries.length === 0 ? (
                    <tr><td colSpan={4} className="p-6 text-center text-xs text-gray-500">No new inquiries.</td></tr>
                  ) : (
                    stats.recentInquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-2.5 pl-5 pr-3"><InquiryStatusBadge status={inq.status} /></td>
                        <td className="px-3 py-2.5">
                          <p className="font-medium text-gray-900 text-xs">{inq.name}</p>
                          <p className="text-[11px] text-gray-500">{inq.email}</p>
                        </td>
                        <td className="px-3 py-2.5 text-xs text-gray-600 max-w-xs truncate" title={inq.message}>
                          {inq.message}
                        </td>
                        <td className="px-3 py-2.5 text-xs text-gray-500 text-right pr-5 whitespace-nowrap">
                          {formatDateTime(inq.createdAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </>
            )}

            {activeTab === "audits" && (
              <>
                <thead className="bg-gray-50/50">
                  <tr className="border-b border-gray-200">
                    <th className="py-2.5 pl-5 pr-3 text-left text-xs font-medium text-gray-500">Action</th>
                    <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500">Summary</th>
                    <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500">Actor</th>
                    <th className="px-3 py-2.5 text-right text-xs font-medium text-gray-500 pr-5">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recentAudit.length === 0 ? (
                    <tr><td colSpan={4} className="p-6 text-center text-xs text-gray-500">No recent activity.</td></tr>
                  ) : (
                    stats.recentAudit.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-2.5 pl-5 pr-3">
                          <Badge tone="neutral" className="capitalize text-[10px]">{log.action.replace("_", " ")}</Badge>
                        </td>
                        <td className="px-3 py-2.5 text-xs text-gray-700">{log.summary}</td>
                        <td className="px-3 py-2.5 text-[11px] text-gray-500">{log.actorEmail || "System"}</td>
                        <td className="px-3 py-2.5 text-[11px] text-gray-400 text-right pr-5 whitespace-nowrap">
                          {formatDateTime(log.createdAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
