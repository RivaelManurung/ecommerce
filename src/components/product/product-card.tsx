"use client";

import { Check, Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/shared/price";
import { cardHover } from "@/lib/animations";
import { useCartStore } from "@/lib/store/cart-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { cn } from "@/lib/utils/cn";
import type { Product } from "@/types/product";
import { RatingStars } from "./rating-stars";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const [added, setAdded] = useState(false);
  const [heartPop, setHeartPop] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const wished = useWishlistStore((state) => state.exists(product.id));
  const badge = product.discountPercent ? `-${product.discountPercent}%` : product.badge;

  function handleAdd() {
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  function handleWishlist() {
    toggleWishlist(product.id);
    setHeartPop(true);
    window.setTimeout(() => setHeartPop(false), 260);
  }

  return (
    <motion.article
      whileHover={cardHover}
      className="group relative overflow-hidden rounded-2xl border border-[#EEE7E2] bg-white p-3 shadow-[0_12px_36px_rgba(73,45,38,0.035)] transition duration-300 hover:border-[#E8BBC4] hover:shadow-[0_22px_54px_rgba(169,68,90,0.12)]"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-[radial-gradient(circle_at_42%_18%,#FFFDF9_0%,#F8DDE2_42%,#FAF4EF_100%)]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover p-2 transition duration-700 group-hover:scale-[1.055]"
          />
          <span className="absolute inset-x-3 bottom-3 h-12 rounded-full bg-white/32 blur-xl" />
          {badge ? (
            <span className={cn("absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em]", product.discountPercent ? "bg-[#F8DDE2] text-[#C95F72]" : "bg-[#DDE8D5] text-[#60775C]")}>
              {badge}
            </span>
          ) : null}
        </div>
      </Link>
      <motion.button
        whileTap={{ scale: 0.9 }}
        animate={heartPop ? { scale: [1, 1.2, 1] } : undefined}
        className="focus-ring absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white/92 text-[#737373] shadow-[0_10px_26px_rgba(73,45,38,0.09)] transition hover:text-[#C95F72]"
        aria-label="Toggle wishlist"
        onClick={handleWishlist}
        type="button"
      >
        <Heart size={18} className={wished ? "fill-[#C95F72] text-[#C95F72]" : ""} />
      </motion.button>
      <div className="pt-4">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#A58C82]">{product.subcategory}</p>
        <Link href={`/product/${product.slug}`} className="line-clamp-2 min-h-10 text-[15px] font-semibold leading-5 hover:text-[#A9445A]">
          {product.name}
        </Link>
        {!compact && <p className="mt-1 text-xs text-[#737373]">{product.selectedShade}</p>}
        <div className="mt-2">
          <RatingStars rating={product.rating} count={compact ? undefined : product.reviewCount} />
        </div>
        <div className="mt-3 flex items-end justify-between gap-3">
          <Price price={product.price} originalPrice={product.originalPrice} />
          <Button
            className={cn(
              "h-10 min-h-0 rounded-full px-3 transition-all md:w-10 md:px-0 md:group-hover:w-32",
              added && "bg-[#60775C] hover:bg-[#60775C]",
            )}
            aria-label="Tambah ke keranjang"
            onClick={handleAdd}
          >
            {added ? <Check size={16} /> : <ShoppingBag size={16} />}
            <span className="hidden whitespace-nowrap text-xs md:group-hover:inline">{added ? "Added" : "Add"}</span>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#EEE7E2] bg-white p-3">
      <div className="shimmer aspect-square rounded-xl" />
      <div className="mt-4 h-3 w-20 rounded shimmer" />
      <div className="mt-3 h-4 w-full rounded shimmer" />
      <div className="mt-2 h-4 w-2/3 rounded shimmer" />
      <div className="mt-4 flex items-center justify-between">
        <div className="h-5 w-24 rounded shimmer" />
        <div className="h-10 w-10 rounded-full shimmer" />
      </div>
    </div>
  );
}
