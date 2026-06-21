"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Truck } from "lucide-react";
import { getAdminOrder, updateOrderStatus, updateOrderShipment } from "@/features/admin-orders/api";
import type { Order, OrderStatus } from "@/features/orders/api";
import { ApiError } from "@/lib/api-client";
import { PageHeader } from "@/components/admin/page-header";
import { ErrorState, TableSkeleton } from "@/components/admin/data-state";
import { OrderStatusBadge, PaymentBadge } from "@/components/admin/order-badges";
import { toast } from "@/components/admin/toast";
import { formatDateTime, formatIDR } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

// Mirrors backend domain.OrderStatusTransitions.
const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid", "cancelled"],
  paid: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: ["completed"],
  completed: [],
  cancelled: [],
};

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextStatus, setNextStatus] = useState<OrderStatus | "">("");
  const [savingStatus, setSavingStatus] = useState(false);

  const [courier, setCourier] = useState("");
  const [service, setService] = useState("");
  const [awb, setAwb] = useState("");
  const [savingShipment, setSavingShipment] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const o = await getAdminOrder(id);
      setOrder(o);
      setCourier(o.shipment.courier);
      setService(o.shipment.service);
      setAwb(o.shipment.trackingNumber);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function applyStatus() {
    if (!order || !nextStatus) return;
    setSavingStatus(true);
    try {
      const updated = await updateOrderStatus(order.id, nextStatus);
      setOrder(updated);
      setNextStatus("");
      toast.success(`Status → ${nextStatus}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update status");
    } finally {
      setSavingStatus(false);
    }
  }

  async function saveShipment() {
    if (!order || !awb.trim()) {
      toast.error("Tracking number is required");
      return;
    }
    setSavingShipment(true);
    try {
      const updated = await updateOrderShipment(order.id, { courier, service, trackingNumber: awb.trim() });
      setOrder(updated);
      toast.success("Shipment saved");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save shipment");
    } finally {
      setSavingShipment(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Order" />
        <Card>
          <div className="p-4">
            <TableSkeleton rows={5} cols={3} />
          </div>
        </Card>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <PageHeader title="Order" />
        <Card>
          <div className="p-4">
            <ErrorState message={error ?? "Not found"} onRetry={load} />
          </div>
        </Card>
      </div>
    );
  }

  const allowed = TRANSITIONS[order.status];

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900">
        <ChevronLeft size={16} /> Orders
      </Link>
      <PageHeader title={order.orderNumber} description={`Placed ${formatDateTime(order.createdAt)}`} />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <div className="border-b border-zinc-100 p-4 text-sm font-medium text-zinc-700">Items</div>
            <div className="divide-y divide-zinc-100">
              {order.items.map((line) => (
                <div key={line.variantId} className="flex items-center justify-between gap-3 p-4 text-sm">
                  <div>
                    <p className="font-medium text-zinc-900">{line.name}</p>
                    <p className="text-xs text-zinc-500">{line.variantName} · {line.quantity} × {formatIDR(line.price)}</p>
                  </div>
                  <span className="font-medium text-zinc-900">{formatIDR(line.lineTotal)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1 border-t border-zinc-100 p-4 text-sm">
              <div className="flex justify-between text-zinc-500"><span>Subtotal</span><span>{formatIDR(order.subtotal)}</span></div>
              <div className="flex justify-between text-zinc-500"><span>Shipping</span><span>{formatIDR(order.shippingCost)}</span></div>
              <div className="flex justify-between font-semibold text-zinc-900"><span>Total</span><span>{formatIDR(order.total)}</span></div>
            </div>
          </Card>

          <Card>
            <div className="border-b border-zinc-100 p-4 text-sm font-medium text-zinc-700">Shipping address</div>
            <div className="p-4 text-sm leading-6 text-zinc-600">
              <p className="font-medium text-zinc-900">{order.address.fullName}</p>
              <p>{order.address.phone}</p>
              <p>{order.address.address}</p>
              <p>{[order.address.district, order.address.city, order.address.province, order.address.postalCode].filter(Boolean).join(", ")}</p>
              {order.address.notes ? <p className="mt-1 text-zinc-500">Note: {order.address.notes}</p> : null}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-700">Status</span>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-700">Payment</span>
                <PaymentBadge status={order.payment.status} />
              </div>
              {allowed.length > 0 ? (
                <div className="space-y-2 border-t border-zinc-100 pt-3">
                  <Label htmlFor="next-status">Change status</Label>
                  <Select id="next-status" value={nextStatus} onChange={(e) => setNextStatus(e.target.value as OrderStatus)}>
                    <option value="">Select…</option>
                    {allowed.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </Select>
                  <Button variant="default" className="w-full" disabled={!nextStatus || savingStatus} onClick={applyStatus}>
                    {savingStatus ? "Saving…" : "Apply"}
                  </Button>
                </div>
              ) : (
                <p className="border-t border-zinc-100 pt-3 text-xs text-zinc-500">No further status changes available.</p>
              )}
            </div>
          </Card>

          <Card>
            <div className="space-y-3 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                <Truck size={15} /> Shipment / AWB
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="courier">Courier</Label>
                <Input id="courier" value={courier} onChange={(e) => setCourier(e.target.value)} placeholder="JNE" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="service">Service</Label>
                <Input id="service" value={service} onChange={(e) => setService(e.target.value)} placeholder="REG" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="awb">Tracking number</Label>
                <Input id="awb" value={awb} onChange={(e) => setAwb(e.target.value)} placeholder="JP1234567890" />
              </div>
              <Button variant="default" className="w-full" disabled={savingShipment} onClick={saveShipment}>
                {savingShipment ? "Saving…" : "Save shipment"}
              </Button>
              <p className="text-xs text-zinc-500">Saving an AWB on a paid/processing order marks it as shipped.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
