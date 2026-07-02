import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicProduct, getPublicProducts, getPublicSettings } from "@/features/public/api";
import { ApiError } from "@/lib/api-client";
import type { Product, Setting } from "@/lib/admin-types";
import { FALLBACK_SETTINGS } from "@/lib/site-config";
import { primaryImage } from "@/lib/catalog";
import { ProductDetail } from "@/components/catalog/product-detail";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ekatalog.vandev.my.id";

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
  const title = product ? `${product.name} | Veloura Beauty` : "Produk | Veloura Beauty";
  return {
    title,
    description: product?.description,
    openGraph: product
      ? {
          title,
          description: product.description,
          type: "website",
          url: `${SITE_URL}/catalog/${product.slug}`,
          images: [{ url: primaryImage(product).url, alt: product.name }],
        }
      : undefined,
  };
}

// Derive a Product JSON-LD payload from the catalog product for rich results.
function productJsonLd(product: Product) {
  const prices = product.variants.length
    ? product.variants.map((v) => v.price || product.basePrice)
    : [product.basePrice];
  const lowPrice = Math.min(...prices);
  const inStock = product.variants.length
    ? product.variants.some((v) => v.stock > 0)
    : true;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    image: product.images.length ? product.images.map((i) => i.url) : [primaryImage(product).url],
    ...(product.category ? { category: product.category.name } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency || "IDR",
      price: lowPrice,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/catalog/${product.slug}`,
    },
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <ProductDetail product={product} related={relatedProducts} settings={settings} />
    </>
  );
}
