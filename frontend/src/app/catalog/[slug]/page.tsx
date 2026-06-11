import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicProduct, getPublicProducts, getPublicSettings } from "@/features/public/api";
import { ApiError } from "@/lib/api-client";
import type { Product, Setting } from "@/lib/admin-types";
import { FALLBACK_SETTINGS } from "@/lib/site-config";
import { ProductDetail } from "@/components/catalog/product-detail";

async function load(slug: string): Promise<Product | null> {
  try {
    return await getPublicProduct(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await load(slug).catch(() => null);
  return {
    title: product ? `${product.name} | Veloura Beauty` : "Produk | Veloura Beauty",
    description: product?.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await load(slug);
  if (!product) notFound();

  let settings: Setting = FALLBACK_SETTINGS;
  let related: Product[] = [];
  try {
    [settings, related] = await Promise.all([
      getPublicSettings().catch(() => FALLBACK_SETTINGS),
      product.category
        ? getPublicProducts({ category: product.category.slug, limit: 8 }).then((r) => r.data)
        : Promise.resolve<Product[]>([]),
    ]);
  } catch {
    /* keep fallbacks */
  }

  const relatedProducts = related.filter((p) => p.id !== product.id).slice(0, 4);

  return <ProductDetail product={product} related={relatedProducts} settings={settings} />;
}
