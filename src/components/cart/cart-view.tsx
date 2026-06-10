"use client";

import { Heart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/cart-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { formatCurrency } from "@/lib/utils/format-currency";
import { QuantityStepper } from "@/components/product/quantity-stepper";
import { ProductCard } from "@/components/product/product-card";

export function CartView() {
  const { items, removeItem, updateQuantity, subtotal, discount, total } = useCartStore();
  const addWishlist = useWishlistStore((state) => state.add);

  if (!items.length) {
    return (
      <main className="container-page py-14 text-center">
        <h1 className="font-serif-display text-5xl">Keranjang kosong</h1>
        <p className="mt-3 text-[#737373]">Produk favoritmu menunggu untuk ditemukan.</p>
        <Link href="/shop" className="mt-6 inline-flex"><Button>Mulai Belanja</Button></Link>
      </main>
    );
  }

  return (
    <main className="container-page py-8">
      <div className="mb-8 flex items-center justify-between border-b border-[#EEE7E2] pb-5">
        <h1 className="font-serif-display text-5xl">Keranjang Belanja</h1>
        <span className="text-sm text-[#737373]">Secure Checkout</span>
      </div>
      <div className="grid gap-7 lg:grid-cols-[1fr_420px]">
        <section className="grid gap-4">
          {items.map((item) => (
            <article key={`${item.product.id}-${item.shade}`} className="grid gap-4 rounded-2xl border border-[#EEE7E2] bg-white p-4 shadow-[0_12px_36px_rgba(73,45,38,0.035)] md:grid-cols-[140px_1fr_auto]">
              <Image src={item.product.images[0]} alt={item.product.name} width={140} height={140} className="rounded-xl bg-[#FFF7F3]" />
              <div>
                <h2 className="font-semibold">{item.product.name}</h2>
                <p className="mt-1 text-sm text-[#737373]">Shade: {item.shade}</p>
                <div className="mt-5"><QuantityStepper value={item.quantity} onChange={(value) => updateQuantity(item.product.id, item.shade, value)} /></div>
                <div className="mt-5 flex gap-4 text-sm text-[#C95F72]">
                  <button className="inline-flex gap-1" onClick={() => removeItem(item.product.id, item.shade)}><Trash2 size={16} /> Hapus</button>
                  <button className="inline-flex gap-1" onClick={() => addWishlist(item.product.id)}><Heart size={16} /> Simpan untuk nanti</button>
                </div>
              </div>
              <p className="font-bold">{formatCurrency(item.product.price * item.quantity)}</p>
            </article>
          ))}
          <div className="grid gap-4 rounded-2xl border border-[#EEE7E2] bg-white p-4 md:grid-cols-[180px_1fr_auto]">
            <p className="font-semibold">Punya kode promo?</p>
            <input className="focus-ring h-11 rounded-md border border-[#EEE7E2] px-4" placeholder="Masukkan kode promo" />
            <Button>Terapkan</Button>
          </div>
        </section>
        <aside className="premium-card h-fit rounded-3xl p-6 lg:sticky lg:top-32">
          <h2 className="mb-5 text-lg font-bold uppercase">Ringkasan Pesanan</h2>
          <Row label={`Subtotal (${items.length} item)`} value={formatCurrency(subtotal())} />
          <Row label="Diskon (VELOURA20)" value={`-${formatCurrency(discount())}`} />
          <Row label="Ongkos Kirim" value="Gratis" />
          <div className="mt-5 border-t border-[#EEE7E2] pt-5">
            <Row label="Total" value={formatCurrency(total())} big />
          </div>
          <Link href="/checkout" className="mt-6 block"><Button className="min-h-12 w-full">Place Order</Button></Link>
        </aside>
      </div>
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold uppercase">Lengkapi rutinitas kecantikanmu</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.slice(10, 14).map((product) => <ProductCard key={product.id} product={product} compact />)}
        </div>
      </section>
    </main>
  );
}

function Row({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return <div className={`mb-3 flex justify-between ${big ? "text-xl font-bold text-[#C95F72]" : "text-sm"}`}><span>{label}</span><span>{value}</span></div>;
}
