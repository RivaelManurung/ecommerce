"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { SectionHeading } from "@/components/shared/section-heading";

const heroCards = [
  {
    title: "Complexion",
    subtitle: "Glowy base, cushion, and skin tint essentials",
    href: "/category/makeup",
    image: "/images/category-complexion-person.png",
    surface: "from-[#E8D0C4] via-[#F8DDE2] to-[#FFF7F3]",
    accent: "bg-[#FFFDF9]/45",
    photo: true,
  },
  {
    title: "Decorative",
    subtitle: "Soft color stories for every expression",
    href: "/shop",
    image: "/images/category-decorative-person.png",
    surface: "from-[#F4D4C9] via-[#F3E6D8] to-[#FFFDF9]",
    accent: "bg-[#C95F72]/15",
    photo: true,
  },
  {
    title: "Skincare",
    subtitle: "Fresh prep for calm luminous skin",
    href: "/category/skincare",
    image: "/images/category-skincare-person.png",
    surface: "from-[#DDE8D5] via-[#F4F0E6] to-[#FFFDF9]",
    accent: "bg-[#DDE8D5]/60",
    photo: true,
  },
  {
    title: "Eyes",
    subtitle: "Precise lines and lifted lashes",
    href: "/category/eyes",
    image: "/images/category-eyes-person.png",
    surface: "from-[#282423] via-[#8E766D] to-[#F3E6D8]",
    accent: "bg-white/14",
    photo: true,
  },
  {
    title: "Lips",
    subtitle: "Juicy tints, oils, and velvet color",
    href: "/category/lips",
    image: "/images/category-lips-person.png",
    surface: "from-[#C95F72] via-[#F8DDE2] to-[#FFF4F4]",
    accent: "bg-[#A9445A]/18",
    photo: true,
  },
  {
    title: "Tools",
    subtitle: "Brushes and finishers for a seamless look",
    href: "/category/tools",
    image: "/images/category-tools-person.png",
    surface: "from-[#D8C2B4] via-[#F3E6D8] to-[#DDE8D5]",
    accent: "bg-white/35",
    photo: true,
  },
];

export function HeroCategoryGrid() {
  return (
    <section className="container-page py-9 md:py-11">
      <SectionHeading
        eyebrow="Belanja per Kategori"
        title="Temukan Ritualmu"
        copy="Dari base mulus hingga warna bibir favorit — semua kebutuhan kecantikanmu dalam satu tempat."
        href="/shop"
      />
      <motion.div
        className="hide-scrollbar grid auto-cols-[76vw] grid-flow-col gap-4 overflow-x-auto scroll-smooth pb-2 sm:auto-cols-[42vw] lg:grid-flow-row lg:grid-cols-6 lg:overflow-visible"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {heroCards.map((card, index) => (
          <motion.div key={card.title} variants={fadeUp}>
            <Link
              href={card.href}
              className={`group relative block min-h-[360px] snap-start overflow-hidden rounded-2xl bg-gradient-to-br ${card.surface} p-5 soft-shadow`}
            >
              <span className={`absolute -right-12 top-10 z-10 h-36 w-36 rounded-full blur-2xl ${card.accent}`} />
              <span className="absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-[#231A18]/62 to-transparent transition duration-500 group-hover:from-[#231A18]/76" />
              {card.photo ? (
                <Image
                  src={card.image}
                  alt={`${card.title} Veloura Beauty`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 76vw, 16vw"
                  className="z-0 object-cover object-center transition duration-700 group-hover:scale-[1.06]"
                />
              ) : (
                <Image
                  src={card.image}
                  alt={`${card.title} Veloura Beauty`}
                  width={360}
                  height={360}
                  priority={index < 2}
                  className="absolute bottom-14 right-[-38px] h-[235px] w-[235px] object-contain drop-shadow-[0_22px_28px_rgba(73,45,38,0.18)] transition duration-700 group-hover:scale-[1.06] group-hover:rotate-1"
                />
              )}
              <div className="absolute bottom-6 left-5 right-5 z-20 text-white">
                <h2 className="font-serif-display text-4xl leading-none">{card.title}</h2>
                <p className="mt-2 min-h-10 text-sm leading-5 text-white/86">{card.subtitle}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]">
                  Shop Now <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
