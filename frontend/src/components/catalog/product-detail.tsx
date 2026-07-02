"use client";

import { Check, ChevronRight, Heart, Mail, MessageCircle, Minus, Plus, ShieldCheck, ShoppingBag, Truck, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { Product, Setting } from "@/lib/admin-types";
import { ApiError } from "@/lib/api-client";
import { formatIDR } from "@/lib/format";
import { primaryImage, toWishlistItem } from "@/lib/catalog";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useCartStore } from "@/lib/store/cart-store";
import { waLink } from "@/lib/wa";
import { cn } from "@/lib/utils/cn";
import { tapScale } from "@/lib/animations";
import { Stagger, StaggerItem } from "@/components/shared/stagger";
import { CatalogCard } from "./catalog-card";

type Tab = "deskripsi" | "varian" | "inquiry";

export function ProductDetail({
  product,
  related,
  settings,
}: {
  product: Product;
  related: Product[];
  settings: Setting;
}) {
  const images = product.images.length ? product.images : [{ id: "ph", url: primaryImage(product).url, alt: product.name, isPrimary: true, sortOrder: 1 }];
  const [active, setActive] = useState(images[0].url);
  const [zoom, setZoom] = useState(false);
  const [tab, setTab] = useState<Tab>("deskripsi");
  const reduceMotion = useReducedMotion();

  const toggle = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => s.exists(product.id));
  const addToCart = useCartStore((s) => s.add);

  const hasVariants = product.variants.length > 0;
  const prices = hasVariants ? product.variants.map((v) => v.price) : [product.basePrice];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Cart selection state. Variants are the purchasable units; default to the
  // first in-stock one so the primary CTA is immediately actionable.
  const firstSellable = product.variants.find((v) => v.stock > 0) ?? product.variants[0];
  const [variantId, setVariantId] = useState(firstSellable?.id ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);

  const selected = product.variants.find((v) => v.id === variantId);
  const selectedStock = selected?.stock ?? 0;
  const selectedPrice = selected ? selected.price || product.basePrice : product.basePrice;
  const canAddToCart = hasVariants && selectedStock > 0;
  const cappedQty = Math.min(qty, Math.max(selectedStock, 1));

  const onAddToCart = async () => {
    if (!selected || selectedStock <= 0) return;
    setAdding(true);
    setCartError(null);
    try {
      await addToCart({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: primaryImage(product).url,
        variantId: selected.id,
        variantName: selected.name,
        price: selectedPrice,
        quantity: cappedQty,
        stock: selected.stock,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      setCartError(err instanceof ApiError ? err.message : "Gagal menambahkan ke keranjang");
    } finally {
      setAdding(false);
    }
  };

  const wa = waLink(
    settings.whatsapp,
    `Halo, saya tertarik dengan produk *${product.name}* (${formatIDR(product.basePrice)}). Apakah masih tersedia?`,
  );

  return (
    <main className="container-page py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-[#737373]">
        <Link href="/" className="hover:text-[#A9445A]">Beranda</Link>
        <ChevronRight size={14} />
        {product.category ? (
          <>
            <Link href={`/catalog?category=${product.category.slug}`} className="hover:text-[#A9445A]">{product.category.name}</Link>
            <ChevronRight size={14} />
          </>
        ) : null}
        <span className="text-[#262626]">{product.name}</span>
      </nav>

      <section className="grid gap-10 lg:grid-cols-[1.05fr_.95fr]">
        {/* Gallery */}
        <div className={cn("grid gap-4", images.length > 1 ? "md:grid-cols-[92px_1fr]" : "w-full max-w-[480px]")}>
          {images.length > 1 ? (
            <div className="order-2 grid grid-cols-4 gap-3 md:order-1 md:grid-cols-1">
              {images.map((img) => (
                <motion.button
                  key={img.id}
                  onClick={() => setActive(img.url)}
                  whileTap={reduceMotion ? undefined : tapScale}
                  className={cn(
                    "focus-ring relative aspect-square overflow-hidden rounded-xl border bg-white transition-[border-color,box-shadow] duration-300",
                    active === img.url ? "border-[#C95F72] ring-2 ring-[#C95F72]/25" : "border-[#EEE7E2] hover:border-[#E8BBC4]",
                  )}
                >
                  <Image src={img.url} alt={img.alt} fill sizes="92px" className="object-cover" />
                </motion.button>
              ))}
            </div>
          ) : null}
          <div className="order-1 relative w-full aspect-square overflow-hidden rounded-3xl border border-[#EEE7E2] bg-[#FAF4EF] shadow-[0_22px_70px_rgba(73,45,38,0.08)] md:order-2">
            <AnimatePresence mode="wait">
              <motion.div key={active} className="absolute inset-0" initial={{ opacity: 0, scale: 1.015 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}>
                <Image src={active} alt={product.name} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </motion.div>
            </AnimatePresence>
            <button onClick={() => setZoom(true)} className="focus-ring absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-4 py-2 text-sm shadow-[0_10px_24px_rgba(73,45,38,0.08)] hover:text-[#A9445A]">
              <ZoomIn size={15} /> Perbesar
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="h-fit">
          <Stagger>
            {product.category ? (
              <StaggerItem>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A58C82]">{product.category.name}</p>
              </StaggerItem>
            ) : null}
            <StaggerItem>
              <h1 className="mt-2 font-serif-display text-4xl leading-[1.02] md:text-5xl">{product.name}</h1>
            </StaggerItem>

            <StaggerItem>
              <div className="mt-5 flex items-end gap-3">
                <p className="text-3xl font-bold text-[#C95F72]">
                  {minPrice === maxPrice ? formatIDR(product.basePrice) : `${formatIDR(minPrice)} – ${formatIDR(maxPrice)}`}
                </p>
              </div>
            </StaggerItem>

            {product.description ? (
              <StaggerItem>
                <p className="mt-5 leading-7 text-[#737373]">{product.description}</p>
              </StaggerItem>
            ) : null}
          </Stagger>

          {/* Variant + quantity + add to cart */}
          {hasVariants ? (
            <div className="mt-7 grid gap-4">
              {product.variants.length > 1 ? (
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#A58C82]">Pilih Varian</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => {
                      const out = v.stock <= 0;
                      const isActive = v.id === variantId;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          disabled={out}
                          onClick={() => {
                            setVariantId(v.id);
                            setQty(1);
                          }}
                          className={cn(
                            "focus-ring rounded-xl border px-4 py-2.5 text-sm font-medium transition",
                            isActive
                              ? "border-[#C95F72] bg-[#FFF1F3] text-[#A9445A]"
                              : "border-[#EEE7E2] bg-white text-[#5f5853] hover:border-[#E8BBC4]",
                            out && "cursor-not-allowed opacity-45 line-through",
                          )}
                        >
                          {v.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center rounded-xl border border-[#EEE7E2] bg-white">
                  <button
                    type="button"
                    aria-label="Kurangi jumlah"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={cappedQty <= 1}
                    className="focus-ring grid h-11 w-11 place-items-center rounded-l-xl text-[#5f5853] transition hover:text-[#A9445A] disabled:opacity-40"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="grid h-11 w-12 place-items-center text-sm font-semibold tabular-nums">{cappedQty}</span>
                  <button
                    type="button"
                    aria-label="Tambah jumlah"
                    onClick={() => setQty((q) => Math.min(selectedStock || 1, q + 1))}
                    disabled={cappedQty >= selectedStock}
                    className="focus-ring grid h-11 w-11 place-items-center rounded-r-xl text-[#5f5853] transition hover:text-[#A9445A] disabled:opacity-40"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className={cn("text-sm", selectedStock > 0 ? "text-[#60775C]" : "text-[#C0445E]")}>
                  {selectedStock > 0 ? `Stok tersedia: ${selectedStock}` : "Stok habis"}
                </span>
              </div>

              <motion.button
                type="button"
                onClick={onAddToCart}
                disabled={!canAddToCart || adding}
                whileTap={reduceMotion || !canAddToCart ? undefined : tapScale}
                animate={reduceMotion || !added ? { scale: 1 } : { scale: [1, 1.035, 1] }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-6 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                  added ? "bg-[#0E7A53]" : "bg-[#C95F72] hover:bg-[#A9445A]",
                )}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {added ? (
                    <motion.span
                      key="added"
                      className="inline-flex items-center gap-2"
                      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Check size={18} /> Ditambahkan ke keranjang
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      className="inline-flex items-center gap-2"
                      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <ShoppingBag size={18} /> {canAddToCart ? "Tambah ke Keranjang" : "Stok Habis"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {cartError ? (
                <p role="alert" className="rounded-lg border border-[#F0C7CF] bg-[#FBEEF1] px-3 py-2 text-sm text-[#C0445E]">
                  {cartError}
                </p>
              ) : null}
            </div>
          ) : null}

          {/* CTAs */}
          <div className="mt-5 grid gap-3">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#0E7A53] px-6 text-sm font-semibold text-white transition hover:bg-[#0b6444]"
            >
              <MessageCircle size={18} /> Pesan via WhatsApp
            </a>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href={`/contact?product=${encodeURIComponent(product.slug)}`}
                className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#C95F72] bg-white px-5 text-sm font-semibold text-[#A9445A] transition hover:bg-[#FFF1F3]"
              >
                <Mail size={17} /> Kirim Pertanyaan
              </Link>
              <motion.button
                type="button"
                onClick={() => toggle(toWishlistItem(product))}
                whileTap={reduceMotion ? undefined : tapScale}
                className={cn(
                  "focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-md border px-5 text-sm font-semibold transition-colors",
                  wished ? "border-[#C95F72] bg-[#FFF1F3] text-[#A9445A]" : "border-[#EEE7E2] bg-white text-[#5f5853] hover:border-[#E8BBC4]",
                )}
              >
                <motion.span
                  key={wished ? "on" : "off"}
                  initial={reduceMotion ? false : { scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-flex"
                >
                  <Heart size={17} className={wished ? "fill-[#C95F72] text-[#C95F72]" : ""} />
                </motion.span>
                {wished ? "Tersimpan" : "Wishlist"}
              </motion.button>
            </div>
          </div>

          {/* Trust strip */}
          <div className="mt-6 grid gap-2 rounded-2xl border border-[#EEE7E2] bg-[#FFF8F5] p-4 text-sm text-[#5f5853] sm:grid-cols-3">
            <span className="inline-flex items-center gap-2"><Truck size={17} className="text-[#A9445A]" /> Respons cepat</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck size={17} className="text-[#A9445A]" /> Produk original</span>
            <span className="inline-flex items-center gap-2"><MessageCircle size={17} className="text-[#A9445A]" /> Konsultasi gratis</span>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="mt-12 rounded-3xl border border-[#EEE7E2] bg-white p-6 md:p-8">
        <div className="flex flex-wrap gap-2 text-sm font-bold uppercase tracking-[0.04em]">
          <TabButton active={tab === "deskripsi"} onClick={() => setTab("deskripsi")}>Deskripsi</TabButton>
          {hasVariants ? <TabButton active={tab === "varian"} onClick={() => setTab("varian")}>Varian ({product.variants.length})</TabButton> : null}
          <TabButton active={tab === "inquiry"} onClick={() => setTab("inquiry")}>Pengiriman & Inquiry</TabButton>
        </div>

        <div className="mt-6 text-[#5f5853]">
          {tab === "deskripsi" ? (
            <p className="max-w-3xl leading-7">
              {product.description || "Belum ada deskripsi untuk produk ini."}
            </p>
          ) : null}

          {tab === "varian" ? (
            <ul className="grid gap-2 sm:max-w-xl">
              {product.variants.map((v) => (
                <li key={v.id} className="flex items-center justify-between rounded-xl border border-[#EEE7E2] px-4 py-3 text-sm">
                  <span className="font-medium text-[#262626]">{v.name}{v.sku ? <span className="ml-2 text-xs text-[#9B918A]">{v.sku}</span> : null}</span>
                  <span className="flex items-center gap-3">
                    <span className={cn("text-xs", v.stock > 0 ? "text-[#60775C]" : "text-[#C0445E]")}>
                      {v.stock > 0 ? `Stok ${v.stock}` : "Habis"}
                    </span>
                    <span className="font-semibold text-[#A9445A]">{formatIDR(v.price)}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          {tab === "inquiry" ? (
            <div className="grid gap-3 leading-7 sm:max-w-2xl">
              <p>Tertarik dengan produk ini? Hubungi kami untuk ketersediaan stok, pilihan varian, dan estimasi pengiriman.</p>
              <ul className="grid gap-2 text-sm">
                <li className="inline-flex items-center gap-2"><MessageCircle size={16} className="text-[#0E7A53]" /> WhatsApp: balasan tercepat</li>
                <li className="inline-flex items-center gap-2"><Mail size={16} className="text-[#A9445A]" /> Formulir pertanyaan: <Link href={`/contact?product=${encodeURIComponent(product.slug)}`} className="font-semibold text-[#A9445A] hover:underline">kirim di sini</Link></li>
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      {/* Related */}
      {related.length ? (
        <section className="mt-12">
          <h2 className="mb-5 font-serif-display text-3xl">Produk Serupa</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => <CatalogCard key={p.id} product={p} />)}
          </div>
        </section>
      ) : null}

      {/* Zoom lightbox */}
      <AnimatePresence>
        {zoom ? (
          <motion.div
            className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(false)}
          >
            <button onClick={() => setZoom(false)} aria-label="Tutup" className="focus-ring absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25">
              <X />
            </button>
            <motion.div
              className="relative aspect-square w-full max-w-2xl overflow-hidden rounded-2xl"
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={active} alt={product.name} fill sizes="640px" className="object-contain" />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 transition",
        active ? "bg-[#F8DDE2] text-[#A9445A]" : "bg-[#FAF4EF] text-[#737373] hover:text-[#A9445A]",
      )}
    >
      {children}
    </button>
  );
}
