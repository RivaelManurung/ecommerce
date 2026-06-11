"use client";

import { usePathname } from "next/navigation";

/**
 * Hides storefront chrome (promo bar, header, newsletter, footer) on focused
 * routes where it only adds noise — auth pages, the admin console, and
 * transactional flows like cart / checkout.
 *
 * `hideOn` is a list of path prefixes; the gate hides its children when the
 * current pathname matches one of them. The children are passed in
 * already-rendered, so they can be Server Components — this gate only decides
 * whether to show them.
 */
export function ChromeGate({
  children,
  hideOn,
}: {
  children: React.ReactNode;
  hideOn: string[];
}) {
  const pathname = usePathname();
  const hidden = hideOn.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (hidden) return null;
  return <>{children}</>;
}
