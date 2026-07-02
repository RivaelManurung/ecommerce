import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ekatalog.vandev.my.id";

// Keep authenticated / transactional surfaces out of the index; everything else
// (storefront + informational pages) is crawlable.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/cart", "/checkout", "/orders", "/wishlist"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
