"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { PageTransition } from "@/components/shared/page-transition";

/**
 * Applies the storefront route cross-fade (<PageTransition>) to every route
 * EXCEPT the admin console, which must stay static and clean per AGENTS.md.
 *
 * The root layout renders both admin and storefront through the same
 * `{children}` slot, so this gate is the seam that lets storefront pages get
 * motion without ever wrapping the admin panel. PageTransition itself is
 * reduced-motion safe.
 */
export function StorefrontTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdmin) return <>{children}</>;
  return <PageTransition>{children}</PageTransition>;
}
