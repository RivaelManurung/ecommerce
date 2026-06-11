"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { Category } from "@/lib/admin-types";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export interface CatalogQuery {
  search?: string;
  category?: string;
  sort?: string;
}

export function CatalogFilters({
  categories,
  current,
}: {
  categories: Category[];
  current: CatalogQuery;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(current.search ?? "");

  function apply(next: CatalogQuery) {
    const params = new URLSearchParams();
    const merged = { ...current, ...next };
    if (merged.search) params.set("search", merged.search);
    if (merged.category) params.set("category", merged.category);
    if (merged.sort) params.set("sort", merged.sort);
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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative sm:max-w-xs sm:flex-1">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <Input
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        value={current.category ?? ""}
        onChange={(e) => apply({ category: e.target.value })}
        className="sm:max-w-[200px]"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>
            {c.name}
          </option>
        ))}
      </Select>
      <Select
        value={current.sort ?? "newest"}
        onChange={(e) => apply({ sort: e.target.value })}
        className="sm:max-w-[180px]"
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
        <option value="name">Name A–Z</option>
      </Select>
    </div>
  );
}
