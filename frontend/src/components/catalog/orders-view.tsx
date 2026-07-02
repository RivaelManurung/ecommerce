"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, ChevronRight, Loader2, PackageX } from "lucide-react";
import { getMyOrders, type Order } from "@/features/orders/api";
import { ApiError, TOKEN_COOKIE } from "@/lib/api-client";
import { orderStatusMeta } from "@/lib/order-status";
import { formatIDR } from "@/lib/format";
import { premiumEase } from "@/lib/animations";
import { Stagger, StaggerItem } from "@/components/shared/stagger";

export function OrdersView() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getMyOrders()
      .then(setOrders)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Gagal memuat pesanan"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const authed = new RegExp(`(?:^|; )${TOKEN_COOKIE}=`).test(document.cookie);
    if (!authed) {
      router.replace("/login?next=/orders");
      return;
    }
    // Defer to a macrotask so the synchronous state resets in load() don't run
    // inside the effect body (matches the admin ProductDetail pattern).
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [router, load]);

  const stateKey = loading ? "loading" : error ? "error" : orders.length === 0 ? "empty" : "list";

  const content = loading ? (
    <main className="container-page grid min-h-[40vh] place-items-center py-16">
      <Loader2 className="animate-spin text-[#C95F72]" />
    </main>
  ) : error ? (
      <main className="container-page py-16">
        <div className="mx-auto grid max-w-md place-items-center gap-5 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-[#FBEEF1] text-[#C0445E]">
            <AlertCircle size={32} />
          </span>
          <h1 className="font-serif-display text-3xl">Gagal memuat pesanan</h1>
          <p className="text-sm leading-6 text-[#737373]">{error} — silakan coba lagi.</p>
          <button
            type="button"
            onClick={() => load()}
            className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md bg-[#C95F72] px-6 text-sm font-semibold text-white transition hover:bg-[#A9445A]"
          >
            Coba Lagi
          </button>
        </div>
      </main>
  ) : orders.length === 0 ? (
      <main className="container-page py-16">
        <div className="mx-auto grid max-w-md place-items-center gap-5 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-[#FAF4EF] text-[#C95F72]">
            <PackageX size={32} />
          </span>
          <h1 className="font-serif-display text-3xl">Belum ada pesanan</h1>
          <p className="text-sm leading-6 text-[#737373]">Pesananmu akan muncul di sini setelah checkout.</p>
          <Link href="/catalog" className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md bg-[#C95F72] px-6 text-sm font-semibold text-white transition hover:bg-[#A9445A]">
            Mulai Belanja
          </Link>
        </div>
      </main>
  ) : (
    <main className="container-page py-8 md:py-12">
      <h1 className="font-serif-display text-4xl leading-none">Pesanan Saya</h1>
      <p className="mt-2 text-sm text-[#737373]">{orders.length} pesanan</p>

      <Stagger as="ul" className="mt-7 grid gap-3">
        {orders.map((order) => {
          const status = orderStatusMeta(order.status);
          const created = new Date(order.createdAt).toLocaleDateString("id-ID", { dateStyle: "medium" });
          const count = order.items.reduce((n, i) => n + i.quantity, 0);
          return (
            <StaggerItem as="li" key={order.id}>
              <Link
                href={`/orders/${order.id}`}
                className="focus-ring flex items-center gap-4 rounded-2xl border border-[#EEE7E2] bg-white p-4 transition hover:border-[#E8BBC4] hover:shadow-[0_10px_24px_rgba(73,45,38,0.05)]"
              >
                <div className="flex -space-x-3">
                  {order.items.slice(0, 3).map((line) => (
                    <span key={line.variantId} className="relative h-14 w-14 overflow-hidden rounded-xl border-2 border-white bg-[#FAF4EF] shadow-sm">
                      {line.image ? <Image src={line.image} alt={line.name} fill sizes="56px" className="object-cover" /> : null}
                    </span>
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#262626]">{order.orderNumber}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${status.className}`}>{status.label}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-[#9B918A]">{created} · {count} item</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#C95F72]">{formatIDR(order.total)}</p>
                </div>
                <ChevronRight size={18} className="text-[#B8AFA9]" />
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>
    </main>
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
