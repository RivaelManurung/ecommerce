import type { MetadataRoute } from "next";
import { getPublicProducts } from "@/features/public/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ekatalog.vandev.my.id";

// Public, indexable static routes (excludes auth + transactional pages, which
// robots.ts also disallows).
const STATIC_PATHS = [
  "/",
  "/catalog",
  "/about",
  "/faq",
  "/contact",
  "/returns",
  "/shipping",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
  }));

  // Best-effort: append published catalog products. A backend hiccup must never
  // break the sitemap, so fall back to the static routes on any failure.
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const { data } = await getPublicProducts({ limit: 200 });
    productEntries = data.map((product) => ({
      url: `${SITE_URL}/catalog/${product.slug}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : now,
    }));
  } catch {
    /* keep static entries only */
  }

  return [...staticEntries, ...productEntries];
}
