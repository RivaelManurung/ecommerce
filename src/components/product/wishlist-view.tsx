"use client";

import { Heart } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/data/products";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import Link from "next/link";

export function WishlistView() {
  const ids = useWishlistStore((state) => state.ids);
  const wished = products.filter((product) => ids.includes(product.id));

  return (
    <main className="container-page py-10">
      <section className="flex flex-col justify-between gap-4 rounded-3xl border border-[#EEE7E2] bg-[#FFF8F5] p-8 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#C95F72]">Saved beauty edit</p>
          <h1 className="mt-3 font-serif-display text-6xl leading-none">Wishlist</h1>
          <p className="mt-3 text-sm text-[#737373]">{wished.length ? `${wished.length} produk tersimpan untuk checkout berikutnya.` : "Simpan shade dan formula favoritmu di sini."}</p>
        </div>
        <Link href="/shop" className="inline-flex"><Button variant="secondary" className="rounded-full">Tambah Produk</Button></Link>
      </section>
      {wished.length ? (
        <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {wished.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-[#EEE7E2] bg-white p-10 text-center shadow-[0_14px_44px_rgba(73,45,38,0.045)]">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#F8DDE2] text-[#A9445A]"><Heart /></div>
          <h2 className="mt-5 font-serif-display text-4xl">Belum ada produk</h2>
          <p className="mt-2 text-[#737373]">Pilih produk favoritmu agar mudah ditemukan lagi.</p>
          <Link href="/shop" className="mt-5 inline-flex"><Button>Jelajahi Produk</Button></Link>
        </div>
      )}
    </main>
  );
}
