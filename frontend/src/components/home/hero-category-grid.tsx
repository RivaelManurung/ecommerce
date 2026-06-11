"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Category } from "@/lib/admin-types";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { SectionHeading } from "@/components/shared/section-heading";

// Map known category slugs to the existing editorial photography + colour wash.
const STYLES: Record<string, { image: string; surface: string; accent: string }> = {
  complexion: { image: "/images/category-complexion-person.png", surface: "from-[#E8D0C4] via-[#F8DDE2] to-[#FFF7F3]", accent: "bg-[#FFFDF9]/45" },
  skincare: { image: "/images/category-skincare-person.png", surface: "from-[#DDE8D5] via-[#F4F0E6] to-[#FFFDF9]", accent: "bg-[#DDE8D5]/60" },
  eyes: { image: "/images/category-eyes-person.png", surface: "from-[#282423] via-[#8E766D] to-[#F3E6D8]", accent: "bg-white/14" },
  lips: { image: "/images/category-lips-person.png", surface: "from-[#C95F72] via-[#F8DDE2] to-[#FFF4F4]", accent: "bg-[#A9445A]/18" },
  tools: { image: "/images/category-tools-person.png", surface: "from-[#D8C2B4] via-[#F3E6D8] to-[#DDE8D5]", accent: "bg-white/35" },
};

const FALLBACK = { image: "/images/category-decorative-person.png", surface: "from-[#F4D4C9] via-[#F3E6D8] to-[#FFFDF9]", accent: "bg-[#C95F72]/15" };

export function HeroCategoryGrid({ categories }: { categories: Category[] }) {
  if (!categories.length) return null;
  const cards = categories.slice(0, 6);

  return (
    <section className="container-page py-9 md:py-11">
      <SectionHeading
        eyebrow="Belanja per kategori"
        title="Telusuri Kategori"
        copy="Temukan produk sesuai kebutuhanmu — dari skincare hingga tools."
        href="/catalog"
      />
      <motion.div
        className="hide-scrollbar grid auto-cols-[76vw] grid-flow-col gap-4 overflow-x-auto scroll-smooth pb-2 sm:auto-cols-[42vw] lg:grid-flow-row lg:grid-cols-6 lg:overflow-visible"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {cards.map((category, index) => {
          const style = STYLES[category.slug] ?? FALLBACK;
          return (
            <motion.div key={category.id} variants={fadeUp}>
              <Link
                href={`/catalog?category=${category.slug}`}
                className={`group relative block min-h-[360px] snap-start overflow-hidden rounded-2xl bg-gradient-to-br ${style.surface} p-5 soft-shadow`}
              >
                <span className={`absolute -right-12 top-10 z-10 h-36 w-36 rounded-full blur-2xl ${style.accent}`} />
                <span className="absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-[#231A18]/62 to-transparent transition duration-500 group-hover:from-[#231A18]/76" />
                <Image
                  src={style.image}
                  alt={category.name}
                  fill
                  loading={index < 2 ? "eager" : "lazy"}
                  priority={index < 2}
                  sizes="(max-width: 1024px) 76vw, 16vw"
                  className="z-0 object-cover object-center transition duration-700 group-hover:scale-[1.06]"
                />
                <div className="absolute bottom-6 left-5 right-5 z-20 text-white">
                  <h2 className="font-serif-display text-4xl leading-none">{category.name}</h2>
                  <p className="mt-2 min-h-10 text-sm leading-5 text-white/86">{category.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]">
                    Lihat produk <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
