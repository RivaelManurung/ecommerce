"use client";

import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { premiumEase } from "@/lib/animations";

const SHOW_AFTER_PX = 600;

/**
 * Two responsibilities:
 *  1. Restores "always start at the top" scroll behavior on every route change
 *     (Next.js' <Link> otherwise keeps the previous scroll position when the
 *     new page is still visible).
 *  2. Renders a floating back-to-top button that gently fades + scales in once
 *     the user has scrolled past a threshold, with a subtle tap response. The
 *     button is suppressed on the admin console (kept clean per AGENTS.md) and
 *     for reduced-motion users the entrance/exit animation is skipped.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  if (isAdmin) return null;

  const scrollUp = () =>
    window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? "instant" : "smooth" });

  const className =
    "focus-ring fixed bottom-24 right-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-[#EEE7E2] bg-[#FFFDF9]/95 text-[#492D26] shadow-[0_10px_30px_rgba(73,45,38,0.14)] backdrop-blur transition hover:border-[#E8BBC4] hover:text-[#A9445A] lg:bottom-8";

  if (reduceMotion) {
    return visible ? (
      <button type="button" aria-label="Kembali ke atas" onClick={scrollUp} className={className}>
        <ArrowUp size={18} />
      </button>
    ) : null;
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          aria-label="Kembali ke atas"
          onClick={scrollUp}
          className={className}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.28, ease: premiumEase }}
        >
          <ArrowUp size={18} />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
