"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

export interface CatalogQuery {
  search?: string;
  category?: string;
  sort?: string;
}

const SORTS = [
  { value: "newest", label: "Terbaru" },
  { value: "price-asc", label: "Harga: terendah" },
  { value: "price-desc", label: "Harga: tertinggi" },
  { value: "name", label: "Nama A–Z" },
];

export function CatalogToolbar({
  current,
  total,
}: {
  current: CatalogQuery;
  total: number;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(current.search ?? "");
  const reduceMotion = useReducedMotion();

  function apply(next: CatalogQuery) {
    const params = new URLSearchParams();
    const merged = { ...current, ...next };
    if (merged.search) params.set("search", merged.search);
    if (merged.category) params.set("category", merged.category);
    if (merged.sort && merged.sort !== "newest") params.set("sort", merged.sort);
    router.push(`/catalog${params.toString() ? `?${params}` : ""}`);
  }

  // Debounce free-text search → URL.
  useEffect(() => {
    if ((current.search ?? "") === search) return;
    const t = setTimeout(() => apply({ search }), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <motion.div
      variants={reduceMotion ? undefined : fadeUp}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? false : "show"}
      className="mb-5 flex flex-col gap-3 rounded-2xl border border-[#EEE7E2] bg-white/82 p-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="relative w-full sm:max-w-xs">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8AFA9]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari produk…"
          className="focus-ring h-11 w-full rounded-full border border-[#EEE7E2] bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#E8BBC4]"
        />
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="text-sm text-[#737373]">{total} produk</span>
        <select
          value={current.sort ?? "newest"}
          onChange={(e) => apply({ sort: e.target.value })}
          className="focus-ring h-11 rounded-full border border-[#EEE7E2] bg-white px-4 text-sm"
          aria-label="Urutkan"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
    </motion.div>
  );
}
