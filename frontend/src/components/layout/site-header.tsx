"use client";

import { Heart, Menu, MessageCircle, Search, ShoppingBag, User, X } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Category, Setting } from "@/lib/admin-types";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useCartStore } from "@/lib/store/cart-store";
import { cn } from "@/lib/utils/cn";
import { waLink } from "@/lib/wa";
import {
  drawerPanelVariants,
  drawerVariants,
  premiumEase,
  staggerContainer,
  staggerItem,
} from "@/lib/animations";

/**
 * Count badge that gently pops each time its value changes. Remounting on the
 * `count` key restarts the entrance; reduced-motion users get a static badge.
 */
function CountBadge({ count }: { count: number }) {
  const reduceMotion = useReducedMotion();
  const className =
    "absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#C95F72] px-1 text-[10px] font-bold text-white";

  if (reduceMotion) {
    return <span className={className}>{count}</span>;
  }

  return (
    <motion.span
      key={count}
      className={className}
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.32, ease: premiumEase }}
    >
      {count}
    </motion.span>
  );
}

export function SiteHeader({
  settings,
  categories,
}: {
  settings: Setting;
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const cartCount = useCartStore((state) => state.items.reduce((n, i) => n + i.quantity, 0));
  const [authed, setAuthed] = useState(false);
  const reduceMotion = useReducedMotion();

  // Switch the account entry between sign-in and order history after mount
  // (cookie read is client-only; default false keeps SSR/CSR markup in sync).
  useEffect(() => {
    setAuthed(/(?:^|; )ek_token=/.test(document.cookie));
  }, []);
  const accountHref = authed ? "/orders" : "/login";
  const accountLabel = authed ? "Pesanan" : "Masuk";

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // While the drawer is open, lock body scroll and allow Escape to close it.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const nav = [
    { label: "Semua Produk", href: "/catalog" },
    ...categories.map((c) => ({ label: c.name, href: `/catalog?category=${c.slug}` })),
  ];

  const wa = waLink(settings.whatsapp, "Halo, saya ingin bertanya tentang produk Anda.");

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-[#EEE7E2] bg-[#FFFDF9]/88 backdrop-blur-xl transition-all duration-300",
        scrolled && "shadow-[0_12px_40px_rgba(73,45,38,0.08)]",
      )}
    >
      <div className={cn("container-page grid grid-cols-[auto_1fr_auto] items-center gap-3 py-2 transition-all duration-300 md:min-h-[76px]", scrolled && "md:min-h-[66px]")}>
        <button className="focus-ring grid h-10 w-10 place-items-center md:hidden" aria-label="Buka menu" onClick={() => setOpen(true)}>
          <Menu />
        </button>
        <Link href="/" className="justify-self-start font-serif-display text-3xl leading-none tracking-normal md:w-56 md:text-4xl">
          {settings.companyName.split(" ")[0] || "Katalog"}
          <span className="block font-sans text-[10px] uppercase tracking-[0.4em] text-[#9B918A]">
            {settings.companyName.split(" ").slice(1).join(" ") || "Catalog"}
          </span>
        </Link>
        <form action="/catalog" className="hidden w-full max-w-[620px] justify-self-center md:flex">
          <label className="relative w-full">
            <span className="sr-only">Cari produk</span>
            <input name="search" className="focus-ring h-11 w-full rounded-full border border-[#EEE7E2] bg-white/90 px-5 pr-12 text-sm shadow-[0_8px_28px_rgba(73,45,38,0.04)] transition focus:border-[#E8BBC4]" placeholder="Cari produk, kategori, atau kebutuhanmu..." />
            <button type="submit" aria-label="Cari" className="focus-ring absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-[#737373] hover:text-[#A9445A]">
              <Search size={18} />
            </button>
          </label>
        </form>
        <div className="flex items-center justify-end gap-1.5 md:w-auto">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring hidden h-11 items-center gap-2 rounded-full bg-[#0E7A53] px-4 text-sm font-semibold text-white transition hover:bg-[#0b6444] lg:inline-flex"
          >
            <MessageCircle size={17} /> WhatsApp
          </a>
          <Link className="focus-ring group hidden h-12 items-center gap-2 rounded-full border border-transparent px-2.5 text-left transition hover:border-[#EEE7E2] hover:bg-white hover:shadow-[0_10px_24px_rgba(73,45,38,0.06)] md:flex" href={accountHref} aria-label={accountLabel}>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#FAF4EF] text-[#262626] transition group-hover:bg-[#F8DDE2] group-hover:text-[#A9445A]">
              <User size={18} />
            </span>
            <span className="leading-none">
              <span className="block text-[10px] uppercase tracking-[0.16em] text-[#9B918A]">{accountLabel}</span>
              <span className="text-xs font-semibold">Akun</span>
            </span>
          </Link>
          <Link className="focus-ring group relative flex h-12 items-center gap-2 rounded-full border border-transparent px-2.5 text-left transition hover:border-[#EEE7E2] hover:bg-white hover:shadow-[0_10px_24px_rgba(73,45,38,0.06)] hover:text-[#A9445A]" href="/cart" aria-label="Keranjang">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#FAF4EF] text-[#262626] transition group-hover:bg-[#F8DDE2] group-hover:text-[#A9445A]">
              <ShoppingBag size={18} />
            </span>
            <span className="hidden leading-none md:block">
              <span className="block text-[10px] uppercase tracking-[0.16em] text-[#9B918A]">Belanja</span>
              <span className="text-xs font-semibold">Keranjang</span>
            </span>
            {cartCount ? <CountBadge count={cartCount} /> : null}
          </Link>
          <Link className="focus-ring group relative flex h-12 items-center gap-2 rounded-full border border-[#EEE7E2] bg-white px-2.5 text-left shadow-[0_10px_24px_rgba(73,45,38,0.05)] transition hover:border-[#E8BBC4] hover:text-[#A9445A]" href="/wishlist" aria-label="Wishlist">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#F8DDE2] text-[#A9445A]">
              <Heart size={18} />
            </span>
            <span className="hidden leading-none md:block">
              <span className="block text-[10px] uppercase tracking-[0.16em] text-[#9B918A]">Favorit</span>
              <span className="text-xs font-semibold">Wishlist</span>
            </span>
            {wishlistCount ? <CountBadge count={wishlistCount} /> : null}
          </Link>
        </div>
      </div>
      <form action="/catalog" className="container-page pb-3 md:hidden">
        <label className="relative block">
          <span className="sr-only">Cari produk</span>
          <input name="search" className="focus-ring h-11 w-full rounded-full border border-[#EEE7E2] bg-white px-4 pr-11 text-sm" placeholder="Cari produk..." />
          <button type="submit" aria-label="Cari" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373]"><Search size={18} /></button>
        </label>
      </form>
      <nav className="container-page hidden h-10 items-center justify-center gap-9 text-[12px] font-bold uppercase tracking-[0.12em] md:flex">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className="group relative py-3 transition hover:text-[#A9445A]">
            {item.label}
            <span className="absolute bottom-1 left-0 h-px w-0 bg-[#C95F72] transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
      </nav>
      <AnimatePresence>
        {open ? (
          <motion.div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px] md:hidden" variants={drawerVariants} initial="hidden" animate="show" exit="exit" onClick={() => setOpen(false)}>
            <motion.div
              className="flex h-full w-[86%] max-w-sm flex-col bg-[#FFFDF9] shadow-2xl"
              variants={drawerPanelVariants}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Menu navigasi"
            >
              <div className="flex items-center justify-between border-b border-[#EEE7E2] px-6 py-4">
                <span className="font-serif-display text-3xl leading-none">{settings.companyName.split(" ")[0]}</span>
                <button className="focus-ring grid h-10 w-10 place-items-center rounded-full hover:bg-[#FAF4EF]" aria-label="Tutup menu" onClick={() => setOpen(false)}>
                  <X />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-6 py-5">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#9B918A]">Kategori</p>
                <motion.div
                  className="grid gap-2 text-sm font-semibold uppercase"
                  variants={reduceMotion ? undefined : staggerContainer}
                  initial={reduceMotion ? undefined : "hidden"}
                  animate={reduceMotion ? undefined : "show"}
                >
                  {nav.map((item) => (
                    <motion.div key={item.href} variants={reduceMotion ? undefined : staggerItem}>
                      <Link href={item.href} className="block rounded-lg border border-[#EEE7E2] bg-white px-4 py-3 transition hover:border-[#E8BBC4] hover:text-[#A9445A]" onClick={() => setOpen(false)}>
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </nav>
              <div className="grid gap-2 border-t border-[#EEE7E2] px-6 py-5">
                <Link href={accountHref} onClick={() => setOpen(false)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#EEE7E2] bg-white px-4 py-3 text-sm font-semibold transition hover:border-[#E8BBC4]">
                  <User size={16} /> {authed ? "Pesanan Saya" : "Masuk / Akun"}
                </Link>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0E7A53] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b6444]">
                  <MessageCircle size={16} /> Chat WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
