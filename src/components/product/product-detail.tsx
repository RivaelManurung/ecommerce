"use client";

import { Heart, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { formatCurrency } from "@/lib/utils/format-currency";
import type { Product } from "@/types/product";
import { ProductCard } from "./product-card";
import { QuantityStepper } from "./quantity-stepper";
import { RatingStars } from "./rating-stars";
import { ShadeSelector } from "./shade-selector";

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const [image, setImage] = useState(product.images[0]);
  const [shade, setShade] = useState(product.selectedShade);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggle);

  return (
    <main className="container-page py-8">
      <p className="mb-5 text-sm text-[#737373]">Beranda / {product.category} / {product.name}</p>
      <section className="grid gap-10 lg:grid-cols-[1.05fr_.95fr]">
        <div className="grid gap-4 md:grid-cols-[92px_1fr]">
          <div className="order-2 grid grid-cols-4 gap-3 md:order-1 md:grid-cols-1">
            {[...product.images, product.images[0]].map((src, index) => (
              <button key={`${src}-${index}`} className="focus-ring relative aspect-square overflow-hidden rounded-xl border border-[#EEE7E2] bg-white shadow-[0_10px_26px_rgba(73,45,38,0.045)] transition hover:border-[#E8BBC4]" onClick={() => setImage(src)}>
                <Image src={src} alt={`${product.name} thumbnail ${index + 1}`} fill className="object-cover" />
                {index === product.images.length ? <span className="absolute inset-0 grid place-items-center bg-black/25 text-xs font-bold text-white">VIDEO</span> : null}
              </button>
            ))}
          </div>
          <div className="order-1 relative aspect-square overflow-hidden rounded-3xl border border-[#EEE7E2] bg-[#FFF7F3] shadow-[0_22px_70px_rgba(73,45,38,0.08)] md:order-2">
            <AnimatePresence mode="wait">
              <motion.div key={image} className="absolute inset-0" initial={{ opacity: 0, scale: 1.015 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}>
                <Image src={image} alt={product.name} fill priority className="object-cover" />
              </motion.div>
            </AnimatePresence>
            <button className="focus-ring absolute bottom-4 right-4 rounded-full bg-white/92 px-4 py-2 text-sm shadow-[0_10px_24px_rgba(73,45,38,0.08)]">Perbesar</button>
          </div>
        </div>
        <div className="h-fit rounded-3xl border border-[#EEE7E2] bg-white/78 p-6 shadow-[0_18px_60px_rgba(73,45,38,0.055)] backdrop-blur">
          {product.badge ? <span className="rounded-full bg-[#F8DDE2] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#C95F72]">{product.badge}</span> : null}
          <h1 className="mt-4 font-serif-display text-5xl leading-[0.95] md:text-6xl">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <RatingStars rating={product.rating} count={product.reviewCount} />
            <span className="text-sm text-[#737373]">{product.soldCount.toLocaleString("id-ID")}+ terjual</span>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <p className="text-3xl font-bold text-[#C95F72]">{formatCurrency(product.price)}</p>
            {product.originalPrice ? <p className="text-lg text-[#9B918A] line-through">{formatCurrency(product.originalPrice)}</p> : null}
            {product.discountPercent ? <span className="rounded bg-[#F8DDE2] px-2 py-1 text-xs font-bold text-[#C95F72]">-{product.discountPercent}%</span> : null}
          </div>
          <p className="mt-5 leading-7 text-[#737373]">{product.description}</p>
          <ul className="mt-5 grid gap-3 text-sm text-[#525252]">
            {product.benefits.map((benefit) => <li key={benefit}>• {benefit}</li>)}
          </ul>
          <div className="mt-7">
            <div className="mb-3 flex justify-between text-sm font-bold uppercase"><span>Pilih shade</span><span className="text-[#737373]">Lihat panduan shade</span></div>
            <ShadeSelector shades={product.shades} selected={shade} onSelect={setShade} />
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <QuantityStepper value={quantity} onChange={setQuantity} />
            <Button variant="secondary" onClick={() => toggleWishlist(product.id)}><Heart size={18} /> Tambah ke Wishlist</Button>
          </div>
          <div className="mt-5 grid gap-3">
            <Button className="min-h-12" onClick={() => addItem(product, shade, quantity)}><ShoppingBag size={18} /> Tambah ke Keranjang</Button>
            <Link href="/checkout" onClick={() => addItem(product, shade, quantity)} className="focus-ring inline-flex min-h-12 items-center justify-center rounded-md border border-[#C95F72] bg-white px-5 text-sm font-semibold text-[#A9445A] transition hover:bg-[#FFF1F3]">Beli Sekarang</Link>
          </div>
          <div className="mt-5 grid gap-2 rounded-2xl border border-[#EEE7E2] bg-[#FFF8F5] p-4 text-sm md:grid-cols-3">
            <span className="inline-flex gap-2"><Truck size={18} /> Estimasi 2-4 hari</span>
            <span className="inline-flex gap-2"><ShoppingBag size={18} /> Gratis ongkir Rp150.000</span>
            <span className="inline-flex gap-2"><ShieldCheck size={18} /> Garansi 7 hari</span>
          </div>
        </div>
      </section>
      <section className="my-10 grid gap-5 rounded-3xl border border-[#EEE7E2] bg-[#FFF8F5] p-6 md:grid-cols-4">
        <Info title="Key Ingredients" items={product.ingredients} />
        <Info title="Finish & Coverage" items={[product.finish, product.coverage]} />
        <Info title="Cocok Untuk" items={product.skinConcerns} />
        <div>
          <h2 className="mb-3 text-sm font-bold uppercase">Before - After</h2>
          <div className="grid grid-cols-2 gap-2">
            <Image src="/images/veloura-editorial-banner.png" alt="Before" width={160} height={120} className="h-28 rounded-md object-cover" />
            <Image src="/images/veloura-editorial-banner.png" alt="After" width={160} height={120} className="h-28 rounded-md object-cover" />
          </div>
        </div>
      </section>
      <section className="rounded-3xl border border-[#EEE7E2] bg-white p-6">
        <div className="flex gap-3 overflow-x-auto text-sm font-bold uppercase">
          {["Deskripsi", "Cara Pakai", "Ingredients", `Ulasan (${product.reviewCount})`].map((tab, index) => <span key={tab} className={`rounded-full px-4 py-2 ${index === 0 ? "bg-[#F8DDE2] text-[#A9445A]" : "bg-[#FAF4EF] text-[#737373]"}`}>{tab}</span>)}
        </div>
        <p className="mt-5 max-w-4xl leading-7 text-[#737373]">{product.description} Formulanya dirancang untuk iklim Indonesia, nyaman dipakai seharian, dan mudah dipadukan dengan rutinitas Veloura lainnya.</p>
      </section>
      <section className="mt-10 rounded-3xl border border-[#EEE7E2] bg-white p-6 shadow-[0_16px_52px_rgba(73,45,38,0.05)]">
        <h2 className="text-xl font-bold uppercase">Frequently Bought Together</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="grid gap-3 md:grid-cols-3">
            {[product, ...related.slice(0, 2)].map((item) => <ProductCard key={item.id} product={item} compact />)}
          </div>
          <div className="self-center">
            <p className="text-sm text-[#737373]">Total Harga</p>
            <p className="text-2xl font-bold text-[#C95F72]">{formatCurrency([product, ...related.slice(0, 2)].reduce((sum, item) => sum + item.price, 0))}</p>
            <Button className="mt-4">Tambah semua</Button>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="mb-5 text-xl font-bold uppercase">You May Also Like</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {related.slice(0, 6).map((item) => <ProductCard key={item.id} product={item} compact />)}
        </div>
      </section>
    </main>
  );
}

function Info({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-bold uppercase">{title}</h2>
      <ul className="grid gap-2 text-sm text-[#737373]">
        {items.map((item) => <li key={item}>• {item}</li>)}
      </ul>
    </div>
  );
}
