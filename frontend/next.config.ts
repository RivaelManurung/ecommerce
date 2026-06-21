import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server output for small production Docker images.
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      // Retired mock storefront routes → API-backed catalog. NOTE: /cart and
      // /checkout are real pages now and must NOT be redirected here.
      { source: "/shop", destination: "/catalog", permanent: false },
      { source: "/search", destination: "/catalog", permanent: false },
      { source: "/category/:slug", destination: "/catalog?category=:slug", permanent: false },
      { source: "/product/:slug", destination: "/catalog/:slug", permanent: false },
      { source: "/account", destination: "/orders", permanent: false },
    ];
  },
};

export default nextConfig;
