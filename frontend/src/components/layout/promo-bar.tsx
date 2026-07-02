"use client";

import { MessageCircle, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { Setting } from "@/lib/admin-types";
import { premiumEase } from "@/lib/animations";
import { waLink } from "@/lib/wa";

export function PromoBar({ settings }: { settings: Setting }) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  const content = (
    <div className="bg-[#231A18] text-white/90">
      <div className="container-page flex h-9 items-center justify-center gap-2 text-center text-[11px] md:justify-between md:text-xs">
        <span className="inline-flex items-center gap-2">
          <Sparkles size={13} className="text-[#F0C9D2]" />
          {settings.tagline || "Katalog produk pilihan — tanya & pesan langsung."}
        </span>
        <span className="hidden items-center gap-4 md:inline-flex">
          {settings.whatsapp ? (
            <a
              href={waLink(settings.whatsapp, "Halo, saya ingin bertanya tentang produk Anda.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition hover:text-white"
            >
              <MessageCircle size={13} /> {settings.whatsapp}
            </a>
          ) : null}
          <button
            type="button"
            aria-label="Tutup pengumuman"
            onClick={() => setVisible(false)}
            className="focus-ring grid h-5 w-5 place-items-center rounded-full text-white/50 transition hover:text-white"
          >
            <X size={13} />
          </button>
        </span>
      </div>
    </div>
  );

  if (reduceMotion) {
    return visible ? content : null;
  }

  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: premiumEase }}
          style={{ overflow: "hidden" }}
        >
          {content}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
