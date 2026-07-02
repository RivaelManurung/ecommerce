"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { Product } from "@/lib/admin-types";
import { formatIDR } from "@/lib/format";
import { primaryImage, toWishlistItem } from "@/lib/catalog";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { hoverLift, imageZoom } from "@/lib/animations";

export function CatalogCard({ product }: { product: Product }) {
  const img = primaryImage(product);
  const toggle = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => s.exists(product.id));
  const [pop, setPop] = useState(false);
  const reduceMotion = useReducedMotion();

  function onWishlist(e: React.MouseEvent) {
    e.preventDefault();
    toggle(toWishlistItem(product));
    setPop(true);
    window.setTimeout(() => setPop(false), 260);
  }

  return (
    <motion.article
      initial="rest"
      animate="rest"
      whileHover={reduceMotion ? undefined : "hover"}
      variants={{ rest: { y: 0 }, hover: hoverLift }}
      className="group relative overflow-hidden rounded-2xl border border-[#EEE7E2] bg-white shadow-[0_12px_36px_rgba(73,45,38,0.035)] transition-[box-shadow,border-color] duration-300 hover:border-[#E8BBC4] hover:shadow-[0_22px_54px_rgba(169,68,90,0.12)]"
    >
      <Link href={`/catalog/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[#FAF4EF]">
          <motion.div
            className="absolute inset-0"
            variants={{ rest: { scale: 1 }, hover: imageZoom }}
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </Link>
      <motion.button
        whileTap={{ scale: 0.9 }}
        animate={pop ? { scale: [1, 1.2, 1] } : undefined}
        className="focus-ring absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/92 text-[#737373] shadow-[0_10px_26px_rgba(73,45,38,0.09)] transition hover:text-[#C95F72]"
        aria-label={wished ? "Hapus dari wishlist" : "Tambah ke wishlist"}
        onClick={onWishlist}
        type="button"
      >
        <Heart size={17} className={wished ? "fill-[#C95F72] text-[#C95F72]" : ""} />
      </motion.button>
      <div className="p-4">
        {product.category?.name ? (
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#A58C82]">{product.category.name}</p>
        ) : null}
        <Link href={`/catalog/${product.slug}`} className="line-clamp-2 min-h-10 text-[15px] font-semibold leading-5 hover:text-[#A9445A]">
          {product.name}
        </Link>
        <p className="mt-3 text-lg font-bold text-[#C95F72]">{formatIDR(product.basePrice)}</p>
      </div>
    </motion.article>
  );
}
