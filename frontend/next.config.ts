import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      // Retired mock storefront routes → API-backed catalog.
      { source: "/shop", destination: "/catalog", permanent: false },
      { source: "/search", destination: "/catalog", permanent: false },
      { source: "/category/:slug", destination: "/catalog?category=:slug", permanent: false },
      { source: "/product/:slug", destination: "/catalog/:slug", permanent: false },
      { source: "/cart", destination: "/catalog", permanent: false },
      { source: "/checkout", destination: "/catalog", permanent: false },
      { source: "/account", destination: "/login", permanent: false },
    ];
  },
};

export default nextConfig;
