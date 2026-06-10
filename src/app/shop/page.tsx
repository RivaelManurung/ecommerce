import { ProductListing } from "@/components/product/product-listing";
import { products } from "@/lib/data/products";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; q?: string }>;
}) {
  const params = await searchParams;
  return <ProductListing products={products} query={params.query ?? params.q ?? ""} />;
}
