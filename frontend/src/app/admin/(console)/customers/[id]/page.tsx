"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Ban, ChevronLeft, ShoppingBag, CircleDollarSign, Clock, ShieldCheck, Activity } from "lucide-react";
import { getCustomer, setCustomerStatus, type CustomerProfile } from "@/features/admin-customers/api";
import { ApiError } from "@/lib/api-client";
import { PageHeader } from "@/components/admin/page-header";
import { ErrorState, EmptyState, TableSkeleton } from "@/components/admin/data-state";
import { CustomerStatusBadge } from "@/components/admin/customer-status-badge";
import { OrderStatusBadge, PaymentBadge } from "@/components/admin/order-badges";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "@/components/admin/toast";
import { formatDateTime, formatIDR } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

// Read the signed-in admin's role from the JWT (signature checked server-side;
// this only gates UI affordances — the API enforces super_admin on block).
function readAdminRole(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|; )ek_token=([^;]*)/);
  if (!m) return null;
  try {
    const body = decodeURIComponent(m[1]).split(".")[0];
    const b64 = body.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(body.length / 4) * 4, "=");
    return (JSON.parse(atob(b64)) as { role?: string }).role ?? null;
  } catch {
    return null;
  }
}

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuper, setIsSuper] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [working, setWorking] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProfile(await getCustomer(id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load customer");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setIsSuper(readAdminRole() === "super_admin");
    void load();
  }, [load]);

  async function toggleBlock() {
    if (!profile) return;
    setWorking(true);
    try {
      const updated = await setCustomerStatus(profile.user.id, !profile.user.active);
      setProfile({ ...profile, user: updated });
      toast.success(updated.active ? "Customer reactivated" : "Customer blocked");
      setConfirmOpen(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update");
    } finally {
      setWorking(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Customer" />
        <Card><div className="p-4"><TableSkeleton rows={5} cols={3} /></div></Card>
      </div>
    );
  }
  if (error || !profile) {
    return (
      <div className="space-y-6">
        <PageHeader title="Customer" />
        <Card><div className="p-4"><ErrorState message={error ?? "Not found"} onRetry={load} /></div></Card>
      </div>
    );
  }

  const { user, stats, orders, activity } = profile;

  return (
    <div className="space-y-6">
      <Link href="/admin/customers" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900">
        <ChevronLeft size={16} /> Customers
      </Link>

      <PageHeader
        title={user.name || user.email}
        description={user.email}
        actions={
          isSuper ? (
            <Button
              variant={user.active ? "destructive" : "default"}
              onClick={() => setConfirmOpen(true)}
            >
              <Ban size={15} /> {user.active ? "Block customer" : "Reactivate"}
            </Button>
          ) : undefined
        }
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<ShoppingBag size={18} />} label="Total orders" value={String(stats.orderCount)} />
        <StatCard icon={<ShieldCheck size={18} />} label="Paid orders" value={String(stats.paidOrders)} />
        <StatCard icon={<CircleDollarSign size={18} />} label="Lifetime value" value={formatIDR(stats.totalSpent)} />
        <StatCard icon={<Clock size={18} />} label="Last order" value={stats.lastOrderAt ? formatDateTime(stats.lastOrderAt) : "—"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Order history */}
        <Card>
          <div className="flex items-center justify-between border-b border-zinc-100 p-4">
            <span className="text-sm font-medium text-zinc-700">Order history</span>
            <CustomerStatusBadge active={user.active} />
          </div>
          {orders.length === 0 ? (
            <div className="p-4">
              <EmptyState icon={<ShoppingBag size={26} />} title="No orders yet" description="This customer hasn't placed an order." />
            </div>
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Order</TH>
                  <TH>Date</TH>
                  <TH>Payment</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Total</TH>
                </TR>
              </THead>
              <TBody>
                {orders.map((o) => (
                  <TR key={o.id}>
                    <TD>
                      <Link href={`/admin/orders/${o.id}`} className="font-medium text-zinc-900 hover:underline">
                        {o.orderNumber}
                      </Link>
                      {o.shipment.trackingNumber ? (
                        <p className="text-xs text-zinc-500">AWB {o.shipment.trackingNumber}</p>
                      ) : null}
                    </TD>
                    <TD className="text-zinc-500">{formatDateTime(o.createdAt)}</TD>
                    <TD><PaymentBadge status={o.payment.status} /></TD>
                    <TD><OrderStatusBadge status={o.status} /></TD>
                    <TD className="text-right font-medium text-zinc-900">{formatIDR(o.total)}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </Card>

        {/* Account + activity */}
        <div className="space-y-6">
          <Card>
            <div className="border-b border-zinc-100 p-4 text-sm font-medium text-zinc-700">Account</div>
            <dl className="grid gap-2 p-4 text-sm">
              <Row label="Joined" value={formatDateTime(user.createdAt)} />
              <Row label="Role" value={user.role} />
              <Row label="Status" value={user.active ? "Active" : "Blocked"} />
            </dl>
          </Card>

          <Card>
            <div className="flex items-center gap-2 border-b border-zinc-100 p-4 text-sm font-medium text-zinc-700">
              <Activity size={15} /> Recent activity
            </div>
            {activity.length === 0 ? (
              <p className="p-4 text-sm text-zinc-500">No recorded activity yet.</p>
            ) : (
              <ol className="divide-y divide-zinc-100">
                {activity.map((a) => (
                  <li key={a.id} className="p-4">
                    <p className="text-sm text-zinc-800">{a.summary || a.action}</p>
                    <p className="mt-0.5 text-xs text-zinc-400">{formatDateTime(a.createdAt)}</p>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={user.active ? "Block this customer?" : "Reactivate this customer?"}
        description={
          user.active
            ? "They will be signed out and unable to log in or check out until reactivated."
            : "They will regain access to sign in and place orders."
        }
        loading={working}
        onConfirm={toggleBlock}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <div className="flex items-center gap-3 p-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-zinc-100 text-zinc-600">{icon}</span>
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-zinc-900">{value}</p>
          <p className="text-xs text-zinc-500">{label}</p>
        </div>
      </div>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="font-medium text-zinc-900">{value}</dd>
    </div>
  );
}
