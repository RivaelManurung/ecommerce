"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Loader2, Lock, Minus, MessageCircle, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { TOKEN_COOKIE } from "@/lib/api-client";
import { formatIDR } from "@/lib/format";
import { waLink } from "@/lib/wa";
import { cn } from "@/lib/utils/cn";
import { listItem, premiumEase } from "@/lib/animations";
import { Reveal } from "@/components/shared/reveal";

export function CartView({ whatsapp }: { whatsapp: string }) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const loading = useCartStore((s) => s.loading);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const refresh = useCartStore((s) => s.refresh);
  const error = useCartStore((s) => s.error);
  const clearError = useCartStore((s) => s.clearError);

  const [authed, setAuthed] = useState(false);
  const reduce = useReducedMotion();

  // Read auth + pull the server cart after mount (avoids a hydration mismatch).
  useEffect(() => {
    setAuthed(new RegExp(`(?:^|; )${TOKEN_COOKIE}=`).test(document.cookie));
    void refresh();
  }, [refresh]);

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + (i.available ? i.lineTotal : 0), 0);

  if (items.length === 0) {
    return (
      <main className="container-page py-16">
        <Reveal className="mx-auto grid max-w-md place-items-center gap-5 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-[#FAF4EF] text-[#C95F72]">
            <ShoppingBag size={34} />
          </span>
          <h1 className="font-serif-display text-3xl">Keranjangmu masih kosong</h1>
          <p className="text-sm leading-6 text-[#737373]">
            Jelajahi katalog kami dan tambahkan produk favoritmu ke keranjang.
          </p>
          <Link
            href="/catalog"
            className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md bg-[#C95F72] px-6 text-sm font-semibold text-white transition hover:bg-[#A9445A]"
          >
            Mulai Belanja <ArrowRight size={17} />
          </Link>
        </Reveal>
      </main>
    );
  }

  const waMessage =
    "Halo, saya ingin memesan:\n" +
    items
      .filter((i) => i.available)
      .map((i) => `• ${i.quantity}x ${i.name} (${i.variantName}) — ${formatIDR(i.lineTotal)}`)
      .join("\n") +
    `\n\nTotal: ${formatIDR(subtotal)}`;

  return (
    <main className="container-page py-8 md:py-12">
      <div className="mb-7 flex items-end justify-between">
        <div>
          <h1 className="font-serif-display text-4xl leading-none">Keranjang</h1>
          <p className="mt-2 text-sm text-[#737373]">{count} item dalam keranjangmu</p>
        </div>
        <button
          type="button"
          onClick={() => void clear()}
          className="focus-ring text-sm font-medium text-[#9B918A] transition hover:text-[#C0445E]"
        >
          Kosongkan
        </button>
      </div>

      <AnimatePresence>
        {error ? (
          <motion.div
            key="cart-error"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            exit={reduce ? {} : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: premiumEase }}
            className="mb-6 flex items-start justify-between gap-3 rounded-2xl border border-[#F0C7CF] bg-[#FBEEF1] px-4 py-3 text-sm text-[#C0445E]"
          >
            <span role="alert">{error}</span>
            <button
              type="button"
              onClick={() => clearError()}
              className="focus-ring shrink-0 font-semibold underline hover:text-[#A9445A]"
            >
              Tutup
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!authed ? (
        <div className="mb-6 rounded-2xl border border-[#E7D9CF] bg-[#FFF8F5] px-4 py-3 text-sm text-[#7a6a60]">
          <Link href="/login" className="font-semibold text-[#A9445A] hover:underline">
            Masuk
          </Link>{" "}
          untuk menyimpan keranjang dan menyelesaikan pesanan.
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Line items */}
        <ul className="grid gap-3">
          <AnimatePresence initial={false}>
          {items.map((line) => (
            <motion.li
              key={line.variantId}
              layout={reduce ? false : true}
              variants={reduce ? undefined : listItem}
              initial={reduce ? false : "hidden"}
              animate={reduce ? undefined : "show"}
              exit={reduce ? undefined : "exit"}
              className={cn(
                "flex gap-4 overflow-hidden rounded-2xl border border-[#EEE7E2] bg-white p-3 sm:p-4",
                !line.available && "opacity-70",
              )}
            >
              <Link
                href={`/catalog/${line.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-[#EEE7E2] bg-[#FAF4EF]"
              >
                {line.image ? (
                  <Image src={line.image} alt={line.name} fill sizes="96px" className="object-cover" />
                ) : null}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/catalog/${line.slug}`} className="line-clamp-2 font-medium text-[#262626] hover:text-[#A9445A]">
                      {line.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-[#9B918A]">{line.variantName}</p>
                    {!line.available ? (
                      <p className="mt-1 text-xs font-medium text-[#C0445E]">Tidak tersedia — hapus dari keranjang</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    aria-label="Hapus item"
                    onClick={() => void remove(line.variantId)}
                    className="focus-ring grid h-8 w-8 shrink-0 place-items-center rounded-md text-[#B8AFA9] transition hover:bg-[#FBEEF1] hover:text-[#C0445E]"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mt-auto flex items-end justify-between gap-3 pt-2">
                  <div className="inline-flex items-center rounded-lg border border-[#EEE7E2]">
                    <button
                      type="button"
                      aria-label="Kurangi"
                      onClick={() => void setQty(line.variantId, line.quantity - 1)}
                      className="focus-ring grid h-9 w-9 place-items-center rounded-l-lg text-[#5f5853] transition hover:text-[#A9445A]"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="grid h-9 w-10 place-items-center overflow-hidden text-sm font-semibold tabular-nums">
                      {reduce ? (
                        line.quantity
                      ) : (
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.span
                            key={line.quantity}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2, ease: premiumEase }}
                          >
                            {line.quantity}
                          </motion.span>
                        </AnimatePresence>
                      )}
                    </span>
                    <button
                      type="button"
                      aria-label="Tambah"
                      onClick={() => void setQty(line.variantId, line.quantity + 1)}
                      disabled={line.available && line.quantity >= line.stock}
                      className="focus-ring grid h-9 w-9 place-items-center rounded-r-lg text-[#5f5853] transition hover:text-[#A9445A] disabled:opacity-40"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#262626]">{formatIDR(line.available ? line.lineTotal : 0)}</p>
                    <p className="text-xs text-[#9B918A]">{formatIDR(line.price)} / item</p>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
          </AnimatePresence>
        </ul>

        {/* Summary */}
        <aside className="h-fit rounded-2xl border border-[#EEE7E2] bg-white p-5 lg:sticky lg:top-24">
          <h2 className="font-serif-display text-2xl">Ringkasan</h2>
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between text-[#737373]">
              <dt>Subtotal ({count} item)</dt>
              <dd className="font-semibold text-[#262626]">{formatIDR(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-[#737373]">
              <dt>Ongkir</dt>
              <dd className="text-[#9B918A]">Dihitung saat checkout</dd>
            </div>
          </dl>
          <div className="mt-4 flex items-center justify-between border-t border-[#EEE7E2] pt-4">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold text-[#C95F72]">{formatIDR(subtotal)}</span>
          </div>

          <button
            type="button"
            onClick={() => router.push(authed ? "/checkout" : "/login?next=/checkout")}
            disabled={subtotal === 0}
            className="focus-ring mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#C95F72] px-6 text-sm font-semibold text-white transition hover:bg-[#A9445A] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Lock size={16} /> Lanjut ke Checkout
          </button>
          <a
            href={waLink(whatsapp, waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-[#0E7A53] bg-white px-6 text-sm font-semibold text-[#0E7A53] transition hover:bg-[#EEF8F2]"
          >
            <MessageCircle size={16} /> Pesan via WhatsApp
          </a>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-[#9B918A]">
            {loading ? <Loader2 size={13} className="animate-spin" /> : null}
            {authed ? "Pembayaran online otomatis segera hadir." : "Masuk untuk checkout & menyimpan pesanan."}
          </p>
          <Link
            href="/catalog"
            className="focus-ring mt-2 inline-flex w-full items-center justify-center text-sm font-medium text-[#A9445A] hover:underline"
          >
            Lanjut belanja <ArrowRight size={15} className="ml-1" />
          </Link>
        </aside>
      </div>
    </main>
  );
}
