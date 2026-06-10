"use client";

import { Grid2X2, List, SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { drawerPanelVariants, drawerVariants } from "@/lib/animations";
import { filterProducts } from "@/lib/utils/product-filter";
import type { Product } from "@/types/product";

const concerns = ["Sensitive Skin", "Acne-Prone", "Dry", "Oily", "Dullness"];
const finishes = ["Dewy", "Natural", "Matte", "Radiant", "Satin"];

export function ProductListing({
  products,
  title = "Shop All Makeup",
  subtitle = "Menampilkan pilihan produk Veloura Beauty.",
  query = "",
  category,
}: {
  products: Product[];
  title?: string;
  subtitle?: string;
  query?: string;
  category?: string;
}) {
  const [concern, setConcern] = useState("");
  const [finish, setFinish] = useState("");
  const [sort, setSort] = useState("popular");
  const [drawer, setDrawer] = useState(false);
  const reset = () => {
    setConcern("");
    setFinish("");
  };
  const filtered = useMemo(() => filterProducts(products, { query, category, concern, finish, sort }), [products, query, category, concern, finish, sort]);

  const filters = (
    <div className="grid gap-7 text-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-bold uppercase tracking-[0.16em]">Filters</h2>
        <button className="text-xs font-bold uppercase tracking-[0.12em] text-[#C95F72]" onClick={reset}>Reset</button>
      </div>
      <div>
        <h3 className="mb-3 font-bold uppercase">Skin Concern</h3>
        <div className="grid gap-2">
          {concerns.map((item) => (
            <label key={item} className="flex cursor-pointer items-center justify-between rounded-lg border border-transparent px-3 py-2 text-[#737373] transition hover:border-[#EEE7E2] hover:bg-[#FFF8F5] has-[:checked]:border-[#E8BBC4] has-[:checked]:bg-[#FFF8F9] has-[:checked]:text-[#A9445A]">
              <span>{item}</span>
              <input type="radio" checked={concern === item} onChange={() => setConcern(item)} className="accent-[#C95F72]" />
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 font-bold uppercase">Finish</h3>
        <div className="grid gap-2">
          {finishes.map((item) => (
            <label key={item} className="flex cursor-pointer items-center justify-between rounded-lg border border-transparent px-3 py-2 text-[#737373] transition hover:border-[#EEE7E2] hover:bg-[#FFF8F5] has-[:checked]:border-[#E8BBC4] has-[:checked]:bg-[#FFF8F9] has-[:checked]:text-[#A9445A]">
              <span>{item}</span>
              <input type="radio" checked={finish === item} onChange={() => setFinish(item)} className="accent-[#C95F72]" />
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 font-bold uppercase">Shade</h3>
        <div className="flex flex-wrap gap-2">
          {["#F4C7A6", "#E9B88F", "#D05C60", "#A84B5F", "#111111", "#F1DFCF"].map((color) => (
            <span key={color} className="h-8 w-8 rounded-full border border-white shadow-[0_0_0_1px_#EEE7E2]" style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 font-bold uppercase">Rating</h3>
        <p className="text-amber-500">★★★★★ <span className="text-[#737373]">dan ke atas</span></p>
      </div>
    </div>
  );

  return (
    <main className="container-page py-7">
      <section className="editorial-surface relative mb-8 min-h-72 overflow-hidden rounded-3xl border border-[#EEE7E2] p-8 md:p-12">
        <Image src="/images/veloura-editorial-banner.png" alt="" fill className="object-cover opacity-28 mix-blend-multiply" priority />
        <div className="relative max-w-xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#A58C82]">Beranda / Makeup / Shop</p>
          <h1 className="font-serif-display text-6xl leading-none md:text-7xl">{title}</h1>
          <p className="mt-4 max-w-md leading-7 text-[#A9445A]">{subtitle}</p>
        </div>
      </section>
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="premium-card hidden h-fit rounded-2xl p-5 lg:sticky lg:top-32 lg:block">{filters}</aside>
        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#EEE7E2] bg-white/82 p-3">
            <div>
              <h2 className="text-lg font-bold uppercase tracking-[0.14em]">{title}</h2>
              <p className="text-sm text-[#737373]">Menampilkan {filtered.length} dari {products.length} produk</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="lg:hidden" onClick={() => setDrawer(true)}><SlidersHorizontal size={16} /> Filter</Button>
              <select className="focus-ring h-11 rounded-md border border-[#EEE7E2] bg-white px-4 text-sm" value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="popular">Terpopuler</option>
                <option value="price-low">Harga Terendah</option>
                <option value="price-high">Harga Tertinggi</option>
                <option value="new">Terbaru</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
              <div className="hidden overflow-hidden rounded-md border border-[#EEE7E2] bg-white md:flex">
                <button className="grid h-11 w-11 place-items-center bg-[#F8DDE2] text-[#A9445A]" aria-label="Grid view"><Grid2X2 size={17} /></button>
                <button className="grid h-11 w-11 place-items-center text-[#737373]" aria-label="List view"><List size={17} /></button>
              </div>
            </div>
          </div>
          <ProductGrid products={filtered} />
          <div className="mt-8 flex justify-center gap-2 text-sm">
            {[1, 2, 3, 4].map((page) => <button key={page} className="focus-ring h-10 w-10 rounded-md border border-[#EEE7E2] bg-white aria-[current=page]:bg-[#F8DDE2]" aria-current={page === 1 ? "page" : undefined}>{page}</button>)}
          </div>
        </section>
      </div>
      <AnimatePresence>
        {drawer ? (
          <motion.div className="fixed inset-0 z-50 bg-black/25 lg:hidden" variants={drawerVariants} initial="hidden" animate="show" exit="exit" onClick={() => setDrawer(false)}>
            <motion.aside className="h-full w-[86%] max-w-sm overflow-y-auto bg-white p-5" variants={drawerPanelVariants} onClick={(event) => event.stopPropagation()}>
              <div className="mb-5 flex items-center justify-between">
                <span className="font-serif-display text-3xl">Filter</span>
                <button className="grid h-10 w-10 place-items-center" aria-label="Tutup filter" onClick={() => setDrawer(false)}><X /></button>
              </div>
              {filters}
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
