"use client";

import { MessageCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Setting } from "@/lib/admin-types";
import { premiumEase } from "@/lib/animations";
import { waLink } from "@/lib/wa";

/**
 * Floating WhatsApp button for phones/tablets. The header's WhatsApp button is
 * only shown from `lg` up, so on smaller screens this gives a persistent,
 * one-tap way to start an inquiry — the primary conversion action of the
 * catalog. Hidden on `lg+` where the header button is visible.
 */
export function WhatsAppFab({ settings }: { settings: Setting }) {
  const reduceMotion = useReducedMotion();
  if (!settings.whatsapp) return null;
  const wa = waLink(settings.whatsapp, "Halo, saya ingin bertanya tentang produk Anda.");

  const className =
    "focus-ring fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#0E7A53] py-3 pl-3.5 pr-4 font-semibold text-white shadow-[0_14px_34px_rgba(14,122,83,0.4)] transition hover:bg-[#0b6444] lg:hidden";

  if (reduceMotion) {
    return (
      <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="Chat WhatsApp" className={className}>
        <span className="grid place-items-center">
          <MessageCircle size={22} />
        </span>
        <span className="text-sm">Chat</span>
      </a>
    );
  }

  return (
    <motion.a
      href={wa}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp"
      initial={{ opacity: 0, y: 16, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.5, ease: premiumEase }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.94 }}
      className={className}
    >
      <span className="relative grid place-items-center">
        <span className="absolute inline-flex h-9 w-9 animate-ping rounded-full bg-white/25" />
        <MessageCircle size={22} />
      </span>
      <span className="text-sm">Chat</span>
    </motion.a>
  );
}
