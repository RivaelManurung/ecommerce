"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, ChevronLeft, Circle, Loader2, MessageCircle, Truck } from "lucide-react";
import { getOrder, getTracking, type Order, type TrackingView } from "@/features/orders/api";
import { TOKEN_COOKIE, ApiError } from "@/lib/api-client";
import { orderStatusMeta } from "@/lib/order-status";
import { formatIDR } from "@/lib/format";
import { premiumEase } from "@/lib/animations";
import { Reveal } from "@/components/shared/reveal";
import { Stagger, StaggerItem } from "@/components/shared/stagger";

export function OrderDetailView({ id, whatsapp }: { id: string; whatsapp: string }) {
  const router = useRouter();
  const reduce = useReducedMotion();

  const [justPlaced, setJustPlaced] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [tracking, setTracking] = useState<TrackingView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setJustPlaced(new URLSearchParams(window.location.search).get("placed") === "1");
    const authed = new RegExp(`(?:^|; )${TOKEN_COOKIE}=`).test(document.cookie);
    if (!authed) {
      router.replace(`/login?next=/orders/${id}`);
      return;
    }
    let active = true;
    getOrder(id)
      .then((o) => active && setOrder(o))
      .catch((e) => active && setError(e instanceof ApiError ? e.message : "Gagal memuat pesanan"))
      .finally(() => active && setLoading(false));
    getTracking(id)
      .then((t) => active && setTracking(t))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [id, router]);

  const stateKey = loading ? "loading" : error || !order ? "error" : "loaded";

  const content = loading ? (
    <main className="container-page grid min-h-[40vh] place-items-center py-16">
      <Loader2 className="animate-spin text-[#C95F72]" />
    </main>
  ) : error || !order ? (
    <main className="container-page py-16 text-center">
      <h1 className="font-serif-display text-3xl">Pesanan tidak ditemukan</h1>
      <p className="mt-2 text-sm text-[#737373]">{error ?? "Pesanan ini tidak tersedia."}</p>
      <Link href="/orders" className="mt-5 inline-block font-semibold text-[#A9445A] hover:underline">
        Lihat pesanan saya
      </Link>
    </main>
  ) : (
    <OrderDetailBody order={order} tracking={tracking} justPlaced={justPlaced} whatsapp={whatsapp} />
  );

  if (reduce) return content;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stateKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: premiumEase }}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
}

function OrderDetailBody({
  order,
  tracking,
  justPlaced,
  whatsapp,
}: {
  order: Order;
  tracking: TrackingView | null;
  justPlaced: boolean;
  whatsapp: string;
}) {
  const status = orderStatusMeta(order.status);
  const created = new Date(order.createdAt).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });
  const waMessage =
    `Halo, saya ingin konfirmasi pesanan *${order.orderNumber}* (${formatIDR(order.total)}).`;

  return (
    <main className="container-page py-8 md:py-12">
      <Link href="/orders" className="focus-ring mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#737373] hover:text-[#A9445A]">
        <ChevronLeft size={16} /> Pesanan saya
      </Link>

      {justPlaced ? (
        <Reveal direction="scale" className="mb-6 flex items-start gap-3 rounded-2xl border border-[#CBE6D2] bg-[#EEF8F0] px-4 py-3.5">
          <CheckCircle2 className="mt-0.5 shrink-0 text-[#0E7A53]" size={20} />
          <div>
            <p className="font-semibold text-[#23694A]">Pesanan berhasil dibuat!</p>
            <p className="text-sm text-[#3f6b53]">Simpan nomor pesananmu. Tim kami akan menghubungi untuk konfirmasi pembayaran & pengiriman.</p>
          </div>
        </Reveal>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-display text-3xl leading-none">{order.orderNumber}</h1>
          <p className="mt-2 text-sm text-[#737373]">Dibuat {created}</p>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}>{status.label}</span>
      </div>

      <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Items */}
        <ul className="grid gap-3">
          {order.items.map((line) => (
            <li key={line.variantId} className="flex gap-4 rounded-2xl border border-[#EEE7E2] bg-white p-3 sm:p-4">
              <Link href={`/catalog/${line.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#EEE7E2] bg-[#FAF4EF]">
                {line.image ? <Image src={line.image} alt={line.name} fill sizes="80px" className="object-cover" /> : null}
              </Link>
              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <Link href={`/catalog/${line.slug}`} className="line-clamp-2 font-medium text-[#262626] hover:text-[#A9445A]">{line.name}</Link>
                <p className="mt-0.5 text-xs text-[#9B918A]">{line.variantName}</p>
                <p className="mt-1 text-sm text-[#737373]">{line.quantity} × {formatIDR(line.price)}</p>
              </div>
              <div className="self-center text-right font-semibold text-[#262626]">{formatIDR(line.lineTotal)}</div>
            </li>
          ))}
        </ul>

        {/* Summary + address */}
        <aside className="grid h-fit gap-5">
          <div className="rounded-2xl border border-[#EEE7E2] bg-white p-5">
            <h2 className="font-serif-display text-xl">Pembayaran</h2>
            <dl className="mt-3 grid gap-2 text-sm">
              <div className="flex justify-between text-[#737373]"><dt>Subtotal</dt><dd className="font-medium text-[#262626]">{formatIDR(order.subtotal)}</dd></div>
              <div className="flex justify-between text-[#737373]"><dt>Ongkir</dt><dd className="font-medium text-[#262626]">{order.shippingCost ? formatIDR(order.shippingCost) : "—"}</dd></div>
              <div className="mt-1 flex justify-between border-t border-[#EEE7E2] pt-2"><dt className="font-semibold">Total</dt><dd className="text-lg font-bold text-[#C95F72]">{formatIDR(order.total)}</dd></div>
            </dl>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-[#9B918A]">Metode: {paymentLabel(order.paymentMethod)}</span>
              <span className={`rounded-full px-2 py-0.5 font-semibold ${order.payment.status === "paid" ? "bg-[#E3F0E6] text-[#2F6B43]" : "bg-[#FBF0DC] text-[#9A6B12]"}`}>
                {order.payment.status === "paid" ? "Lunas" : "Belum dibayar"}
              </span>
            </div>
            {order.payment.status !== "paid" ? (
              <p className="mt-3 rounded-lg bg-[#FFF8F0] px-3 py-2 text-xs leading-5 text-[#7a6a60]">
                Selesaikan pembayaran sebesar <span className="font-semibold text-[#9A6B12]">{formatIDR(order.total)}</span>, lalu konfirmasi lewat tombol WhatsApp di bawah. Tim kami akan memverifikasi.
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-[#EEE7E2] bg-white p-5">
            <h2 className="font-serif-display text-xl">Dikirim ke</h2>
            <div className="mt-3 text-sm leading-6 text-[#5f5853]">
              <p className="font-semibold text-[#262626]">{order.address.fullName}</p>
              <p>{order.address.phone}</p>
              <p>{order.address.address}</p>
              <p>{[order.address.district, order.address.city, order.address.province, order.address.postalCode].filter(Boolean).join(", ")}</p>
              {order.address.notes ? <p className="mt-1 text-[#9B918A]">Catatan: {order.address.notes}</p> : null}
            </div>
          </div>

          {tracking ? (
            <div className="rounded-2xl border border-[#EEE7E2] bg-white p-5">
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-[#A9445A]" />
                <h2 className="font-serif-display text-xl">Pelacakan</h2>
              </div>
              {tracking.trackingNumber ? (
                <p className="mt-2 text-sm text-[#5f5853]">
                  {tracking.courier} {tracking.service} · No. Resi <span className="font-semibold text-[#262626]">{tracking.trackingNumber}</span>
                </p>
              ) : (
                <p className="mt-2 text-sm text-[#9B918A]">
                  {tracking.courier ? `${tracking.courier} ${tracking.service}` : "Kurir"} · Estimasi {tracking.eta || "—"}. Nomor resi muncul setelah dikirim.
                </p>
              )}
              <Stagger as="ol" className="mt-4 grid gap-0.5">
                {tracking.events.map((ev, idx) => (
                  <StaggerItem as="li" key={ev.status} className="flex gap-3">
                    <span className="flex flex-col items-center">
                      {ev.done ? (
                        <CheckCircle2 size={18} className="text-[#0E7A53]" />
                      ) : (
                        <Circle size={18} className="text-[#D8CFC8]" />
                      )}
                      {idx < tracking.events.length - 1 ? (
                        <span className={`my-0.5 w-px flex-1 ${ev.done ? "bg-[#0E7A53]/40" : "bg-[#EEE7E2]"}`} style={{ minHeight: 18 }} />
                      ) : null}
                    </span>
                    <span className={`pb-3 text-sm ${ev.done ? "font-medium text-[#262626]" : "text-[#9B918A]"}`}>{ev.label}</span>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          ) : null}

          <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(waMessage)}`} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#0E7A53] px-6 text-sm font-semibold text-white transition hover:bg-[#0b6444]">
            <MessageCircle size={17} /> Konfirmasi via WhatsApp
          </a>
        </aside>
      </div>
    </main>
  );
}

function paymentLabel(method: string): string {
  switch (method) {
    case "bank":
      return "Transfer Bank";
    case "ewallet":
      return "E-Wallet";
    case "cod":
      return "Bayar di Tempat (COD)";
    default:
      return method;
  }
}
