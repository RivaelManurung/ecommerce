import { ProductListing } from "@/components/product/product-listing";
import { products } from "@/lib/data/products";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = params.q ?? "";
  return <ProductListing products={products} title={`Hasil pencarian "${q || "produk"}"`} subtitle="Cari berdasarkan nama produk, kategori, atau concern kulit." query={q} />;
}
