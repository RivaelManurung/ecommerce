import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getPublicProducts, getPublicCategories } from "@/features/public/api";
import type { Category, Paginated, Product } from "@/lib/admin-types";
import { CatalogCard } from "@/components/catalog/catalog-card";
import { CatalogToolbar } from "@/components/catalog/catalog-toolbar";
import { CategorySidebar } from "@/components/catalog/category-sidebar";

export const metadata: Metadata = {
  title: "Katalog Produk | Veloura Beauty",
  description: "Jelajahi seluruh katalog produk pilihan kami.",
};

const sortMap: Record<string, { sort: string; order: string }> = {
  newest: { sort: "createdAt", order: "desc" },
  "price-asc": { sort: "basePrice", order: "asc" },
  "price-desc": { sort: "basePrice", order: "desc" },
  name: { sort: "name", order: "asc" },
};

type SP = Record<string, string | string[] | undefined>;
const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const page = Number(str(sp.page)) || 1;
  const search = str(sp.search) ?? "";
  const category = str(sp.category) ?? "";
  const sortKey = str(sp.sort) ?? "newest";
  const { sort, order } = sortMap[sortKey] ?? sortMap.newest;

  let result: Paginated<Product> | null = null;
  let categories: Category[] = [];
  let failed = false;
  try {
    [result, categories] = await Promise.all([
      getPublicProducts({ page, limit: 12, search, category, sort, order }),
      getPublicCategories(),
    ]);
  } catch {
    failed = true;
  }

  const products = result?.data ?? [];
  const meta = result?.meta.pagination;
  const total = meta?.total ?? products.length;
  const activeCategory = categories.find((c) => c.slug === category);

  function pageHref(p: number) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (sortKey !== "newest") params.set("sort", sortKey);
    params.set("page", String(p));
    return `/catalog?${params}`;
  }

  return (
    <main className="container-page py-7">
      {/* Editorial header */}
      <section className="editorial-surface relative mb-8 overflow-hidden rounded-3xl border border-[#EEE7E2] p-8 md:p-12">
        <nav className="mb-3 flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em] text-[#A58C82]">
          <Link href="/" className="hover:text-[#A9445A]">Beranda</Link>
          <ChevronRight size={13} />
          <span className="text-[#A9445A]">{activeCategory?.name ?? "Katalog"}</span>
        </nav>
        <h1 className="font-serif-display text-5xl leading-none md:text-6xl">
          {activeCategory ? activeCategory.name : "Katalog Produk"}
        </h1>
        <p className="mt-4 max-w-md leading-7 text-[#737373]">
          {search
            ? `Hasil pencarian untuk "${search}".`
            : activeCategory?.description || "Jelajahi seluruh koleksi produk pilihan kami — temukan favoritmu lalu tanyakan langsung."}
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="premium-card hidden h-fit rounded-2xl p-4 lg:sticky lg:top-32 lg:block">
          <CategorySidebar categories={categories} current={category} search={search} sort={sortKey} />
        </aside>

        <section>
          <CatalogToolbar current={{ search, category, sort: sortKey }} total={total} />

          {/* Mobile category chips */}
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            <CategoryChip href="/catalog" active={!category}>Semua</CategoryChip>
            {categories.map((c) => (
              <CategoryChip key={c.id} href={`/catalog?category=${c.slug}`} active={category === c.slug}>
                {c.name}
              </CategoryChip>
            ))}
          </div>

          {failed ? (
            <EmptyBox
              title="Tidak dapat memuat katalog"
              copy="Pastikan server backend berjalan, lalu muat ulang halaman."
            />
          ) : products.length === 0 ? (
            <EmptyBox
              title="Produk tidak ditemukan"
              copy="Coba kata kunci atau kategori yang berbeda."
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {products.map((p) => (
                  <CatalogCard key={p.id} product={p} />
                ))}
              </div>

              {meta && meta.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2 text-sm">
                  <PageLink href={pageHref(page - 1)} disabled={page <= 1}>Sebelumnya</PageLink>
                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={pageHref(p)}
                      aria-current={p === page ? "page" : undefined}
                      className={`focus-ring grid h-10 min-w-10 place-items-center rounded-md border px-2 ${
                        p === page ? "border-[#E8BBC4] bg-[#F8DDE2] font-bold text-[#A9445A]" : "border-[#EEE7E2] bg-white hover:bg-[#FAF4EF]"
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                  <PageLink href={pageHref(page + 1)} disabled={page >= meta.totalPages}>Berikutnya</PageLink>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function EmptyBox({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#EEE7E2] bg-white p-12 text-center">
      <p className="text-sm font-semibold text-[#262626]">{title}</p>
      <p className="mt-1 text-sm text-[#737373]">{copy}</p>
    </div>
  );
}

function PageLink({ href, disabled, children }: { href: string; disabled: boolean; children: React.ReactNode }) {
  if (disabled) {
    return <span className="rounded-md border border-[#EEE7E2] px-4 py-2 text-[#C9C2BC]">{children}</span>;
  }
  return (
    <Link href={href} className="rounded-md border border-[#EEE7E2] px-4 py-2 hover:bg-[#FAF4EF]">
      {children}
    </Link>
  );
}

function CategoryChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
        active ? "border-[#E8BBC4] bg-[#F8DDE2] text-[#A9445A]" : "border-[#EEE7E2] bg-white text-[#5f5853] hover:bg-[#FAF4EF]"
      }`}
    >
      {children}
    </Link>
  );
}
