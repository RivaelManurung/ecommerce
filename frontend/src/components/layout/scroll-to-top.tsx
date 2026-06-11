"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Forces the window to scroll to the top on every route change.
 *
 * Next.js' default <Link> behavior keeps the scroll position as long as the
 * new page is still visible in the viewport, so navigation doesn't always land
 * at the top. This component restores the "always start at the top" behavior.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
