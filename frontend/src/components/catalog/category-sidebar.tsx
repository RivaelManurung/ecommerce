import Link from "next/link";
import type { Category } from "@/lib/admin-types";
import { cn } from "@/lib/utils/cn";

// Server-rendered category filter. Preserves the active search/sort when
// switching categories so the filters compose.
export function CategorySidebar({
  categories,
  current,
  search,
  sort,
}: {
  categories: Category[];
  current: string;
  search?: string;
  sort?: string;
}) {
  function href(categorySlug: string) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categorySlug) params.set("category", categorySlug);
    if (sort && sort !== "newest") params.set("sort", sort);
    return `/catalog${params.toString() ? `?${params}` : ""}`;
  }

  const rows = [{ name: "Semua Produk", slug: "" }, ...categories.map((c) => ({ name: c.name, slug: c.slug }))];

  return (
    <nav className="grid gap-1 text-sm">
      <h2 className="mb-2 px-3 text-xs font-bold uppercase tracking-[0.16em] text-[#9B918A]">Kategori</h2>
      {rows.map((row) => {
        const active = current === row.slug;
        return (
          <Link
            key={row.slug || "all"}
            href={href(row.slug)}
            className={cn(
              "flex items-center justify-between rounded-lg px-3 py-2.5 transition",
              active
                ? "bg-[#FFF1F3] font-semibold text-[#A9445A]"
                : "text-[#5f5853] hover:bg-[#FAF4EF] hover:text-[#A9445A]",
            )}
          >
            {row.name}
          </Link>
        );
      })}
    </nav>
  );
}
