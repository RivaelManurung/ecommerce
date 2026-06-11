"use client";

import { Heart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatIDR } from "@/lib/format";
import { useWishlistStore } from "@/lib/store/wishlist-store";

export function WishlistView() {
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const clear = useWishlistStore((s) => s.clear);

  if (!items.length) {
    return (
      <main className="container-page py-16">
        <div className="mx-auto grid max-w-md place-items-center rounded-3xl border border-dashed border-[#EEE7E2] bg-white p-12 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-[#F8DDE2] text-[#A9445A]">
            <Heart size={24} />
          </span>
          <h1 className="mt-5 font-serif-display text-3xl">Wishlist masih kosong</h1>
          <p className="mt-2 text-sm text-[#737373]">Simpan produk favoritmu agar mudah ditemukan kembali.</p>
          <Link href="/catalog" className="mt-6 inline-flex rounded-full bg-[#C95F72] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#A9445A]">
            Jelajahi Katalog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container-page py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#C95F72]">Favorit</p>
          <h1 className="mt-2 font-serif-display text-5xl leading-none">Wishlist</h1>
          <p className="mt-3 text-sm text-[#737373]">{items.length} produk tersimpan.</p>
        </div>
        <button onClick={clear} className="inline-flex items-center gap-2 rounded-full border border-[#EEE7E2] px-4 py-2 text-sm text-[#737373] transition hover:border-[#E8BBC4] hover:text-[#A9445A]">
          <Trash2 size={15} /> Kosongkan
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((item) => (
          <article key={item.id} className="group relative overflow-hidden rounded-2xl border border-[#EEE7E2] bg-white shadow-[0_12px_36px_rgba(73,45,38,0.035)] transition hover:border-[#E8BBC4]">
            <Link href={`/catalog/${item.slug}`} className="block">
              <div className="relative aspect-square overflow-hidden bg-[#FAF4EF]">
                <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-[1.05]" />
              </div>
            </Link>
            <button
              onClick={() => remove(item.id)}
              aria-label="Hapus dari wishlist"
              className="focus-ring absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/92 text-[#C95F72] shadow-[0_10px_26px_rgba(73,45,38,0.09)] transition hover:bg-[#FFF1F3]"
            >
              <Heart size={17} className="fill-[#C95F72]" />
            </button>
            <div className="p-4">
              {item.category ? <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#A58C82]">{item.category}</p> : null}
              <Link href={`/catalog/${item.slug}`} className="line-clamp-2 min-h-10 text-[15px] font-semibold leading-5 hover:text-[#A9445A]">{item.name}</Link>
              <p className="mt-3 text-lg font-bold text-[#C95F72]">{formatIDR(item.price)}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
