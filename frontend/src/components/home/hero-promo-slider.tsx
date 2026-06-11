"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
  type Variants,
} from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { premiumEase } from "@/lib/animations";

type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  highlight: string;
  copy: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  image: string;
  /** focal point for object-position so the model stays framed */
  focus: string;
  /** tailwind gradient stops for the colour wash behind the photo */
  wash: string;
  /** small pill colour token */
  accent: string;
};

const slides: Slide[] = [
  {
    id: "raya",
    eyebrow: "Penawaran Spesial · Juni",
    title: "Diskon Hingga",
    highlight: "40% Off",
    copy: "Koleksi makeup pilihan dengan harga terbaik. Gratis ongkir ke seluruh Indonesia dengan kode VELOURA20.",
    primaryLabel: "Belanja Sekarang",
    primaryHref: "/catalog",
    secondaryLabel: "Lihat Best Seller",
    secondaryHref: "/catalog?category=complexion",
    image: "/images/veloura-editorial-banner.png",
    focus: "50% 35%",
    wash: "from-[#A9445A] via-[#C95F72] to-[#E8A7B4]",
    accent: "#FFE3E9",
  },
  {
    id: "lips",
    eyebrow: "Baru Rilis",
    title: "Velvet",
    highlight: "Lip Series",
    copy: "Tints juicy, lip oil melembap, dan velvet matte yang ringan seharian. Temukan warna sempurnamu.",
    primaryLabel: "Jelajahi Lips",
    primaryHref: "/catalog?category=lips",
    secondaryLabel: "Cari Warnamu",
    secondaryHref: "/catalog?category=lips",
    image: "/images/category-lips-person.png",
    focus: "50% 22%",
    wash: "from-[#8E2E45] via-[#C95F72] to-[#F8DDE2]",
    accent: "#FFD8E0",
  },
  {
    id: "complexion",
    eyebrow: "Glow Essentials",
    title: "Cushion &",
    highlight: "Skin Tint",
    copy: "Base mulus dengan hasil dewy alami yang menyatu di kulit. Untuk glow sehat setiap hari.",
    primaryLabel: "Lihat Complexion",
    primaryHref: "/catalog?category=complexion",
    secondaryLabel: "Pelajari Rutinitas",
    secondaryHref: "/catalog?category=skincare",
    image: "/images/category-complexion-person.png",
    focus: "50% 20%",
    wash: "from-[#7A4A3C] via-[#C99383] to-[#F3E6D8]",
    accent: "#FBE7DA",
  },
  {
    id: "skincare",
    eyebrow: "Rutinitas Tenang",
    title: "Luminous",
    highlight: "Skincare",
    copy: "Persiapan kulit yang menenangkan untuk wajah kalem dan bercahaya. Mulai ritual harianmu.",
    primaryLabel: "Mulai Rutinitas",
    primaryHref: "/catalog?category=skincare",
    secondaryLabel: "Konsultasi Concern",
    secondaryHref: "/catalog",
    image: "/images/category-skincare-person.png",
    focus: "50% 22%",
    wash: "from-[#3F5A3A] via-[#7E9A6E] to-[#DDE8D5]",
    accent: "#E3F0DA",
  },
];

const AUTOPLAY_MS = 6500;

/* Directional slide for the photo + colour panel */
const panelVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, scale: 1.04, x: dir > 0 ? 64 : -64 }),
  center: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.85, ease: premiumEase } },
  exit: (dir: number) => ({
    opacity: 0,
    scale: 1.02,
    x: dir > 0 ? -52 : 52,
    transition: { duration: 0.6, ease: premiumEase },
  }),
};

const copyContainer: Variants = {
  enter: {},
  center: { transition: { staggerChildren: 0.085, delayChildren: 0.18 } },
  exit: {},
};

const copyItem: Variants = {
  enter: { opacity: 0, y: 26 },
  center: { opacity: 1, y: 0, transition: { duration: 0.6, ease: premiumEase } },
  exit: { opacity: 0, y: -14, transition: { duration: 0.3, ease: premiumEase } },
};

export function HeroPromoSlider() {
  const prefersReducedMotion = useReducedMotion();
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const liveRef = useRef<HTMLParagraphElement>(null);

  const slide = slides[index];
  const count = slides.length;

  const go = useCallback(
    (next: number, dir: number) => {
      setState([(next + count) % count, dir]);
    },
    [count],
  );

  const paginate = useCallback((dir: number) => go(index + dir, dir), [go, index]);
  const goTo = useCallback((target: number) => go(target, target > index ? 1 : -1), [go, index]);

  // Autoplay — paused on hover, when the user pauses, or when the tab is hidden.
  const active = isPlaying && !isHovered && !prefersReducedMotion;
  useEffect(() => {
    if (!active) return;
    const id = window.setTimeout(() => paginate(1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [active, index, paginate]);

  // Pause autoplay when the document is hidden so timers don't pile up.
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) setIsPlaying(false);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Announce the active slide for screen readers.
  useEffect(() => {
    if (liveRef.current) liveRef.current.textContent = `Slide ${index + 1} dari ${count}: ${slide.title} ${slide.highlight}`;
  }, [index, count, slide.title, slide.highlight]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      paginate(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      paginate(-1);
    }
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const swipe = info.offset.x + info.velocity.x * 0.18;
    if (swipe < -70) paginate(1);
    else if (swipe > 70) paginate(-1);
  };

  return (
    <section
      className="container-page pt-4 md:pt-6"
      aria-roledescription="carousel"
      aria-label="Promosi unggulan Veloura"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsHovered(true)}
      onBlurCapture={() => setIsHovered(false)}
      onKeyDown={onKeyDown}
    >
      <div className="relative overflow-hidden rounded-[28px] bg-[#1d1513] soft-shadow">
        {/* Slides */}
        <div className="relative h-[480px] sm:h-[520px] lg:h-[580px]">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={slide.id}
              custom={direction}
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragEnd={onDragEnd}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              aria-roledescription="slide"
              aria-label={`${slide.title} ${slide.highlight}`}
            >
              {/* Colour wash */}
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.wash}`} />

              {/* Photo — anchored right on desktop, full-bleed top on mobile */}
              <div className="absolute inset-y-0 right-0 w-full lg:w-[58%]">
                <motion.div
                  className="relative h-full w-full"
                  initial={prefersReducedMotion ? false : { scale: 1.12 }}
                  animate={prefersReducedMotion ? {} : { scale: 1 }}
                  transition={{ duration: AUTOPLAY_MS / 1000 + 1.5, ease: "linear" }}
                >
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                    style={{ objectPosition: slide.focus }}
                  />
                </motion.div>
              </div>

              {/* Legibility scrims */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#1d1513]/88 via-[#1d1513]/55 to-transparent lg:via-[#1d1513]/30" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#1d1513]/70 to-transparent lg:hidden" />

              {/* Copy */}
              <motion.div
                variants={copyContainer}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative flex h-full max-w-xl flex-col justify-end p-7 pb-24 text-white sm:p-10 sm:pb-24 lg:max-w-[46%] lg:justify-center lg:pb-10"
              >
                <motion.span
                  variants={copyItem}
                  className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur-sm"
                  style={{ color: slide.accent }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {slide.eyebrow}
                </motion.span>

                <motion.h1
                  variants={copyItem}
                  className="font-serif-display text-5xl leading-[0.95] sm:text-6xl lg:text-7xl"
                >
                  {slide.title}
                  <span className="block" style={{ color: slide.accent }}>
                    {slide.highlight}
                  </span>
                </motion.h1>

                <motion.p
                  variants={copyItem}
                  className="mt-5 max-w-md text-sm leading-6 text-white/85 sm:text-base"
                >
                  {slide.copy}
                </motion.p>

                <motion.div variants={copyItem} className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href={slide.primaryHref}
                    className="focus-ring group inline-flex min-h-12 items-center gap-2 rounded-full bg-[#C95F72] px-7 text-sm font-bold text-white shadow-lg shadow-[#231A18]/20 transition hover:bg-[#A9445A]"
                  >
                    {slide.primaryLabel}
                    <ArrowRight size={17} className="transition group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href={slide.secondaryHref}
                    className="focus-ring inline-flex min-h-12 items-center gap-2 rounded-full border border-white/40 px-7 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    {slide.secondaryLabel}
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next */}
          <button
            type="button"
            onClick={() => paginate(-1)}
            aria-label="Slide sebelumnya"
            className="focus-ring absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/25 p-2.5 text-white backdrop-blur-md transition hover:bg-black/40 sm:inline-flex"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => paginate(1)}
            aria-label="Slide berikutnya"
            className="focus-ring absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/25 p-2.5 text-white backdrop-blur-md transition hover:bg-black/40 sm:inline-flex"
          >
            <ChevronRight size={20} />
          </button>

          {/* Controls bar: play/pause + dots + counter */}
          <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-4 px-7 pb-6 sm:px-10">
            <div className="flex items-center gap-3">
              {!prefersReducedMotion && (
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  aria-label={isPlaying ? "Jeda putar otomatis" : "Mulai putar otomatis"}
                  className="focus-ring inline-flex items-center justify-center rounded-full border border-white/25 bg-black/25 p-2 text-white backdrop-blur-md transition hover:bg-black/40"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>
              )}
              <div className="flex items-center gap-2" role="tablist" aria-label="Pilih slide">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Ke slide ${i + 1}`}
                    onClick={() => goTo(i)}
                    className="focus-ring group relative h-2.5 overflow-hidden rounded-full bg-white/30 transition-all duration-500"
                    style={{ width: i === index ? 40 : 10 }}
                  >
                    {i === index && (
                      <motion.span
                        key={`${index}-${active}`}
                        className="absolute inset-0 origin-left rounded-full bg-white"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: active ? 1 : 0.35 }}
                        transition={
                          active
                            ? { duration: AUTOPLAY_MS / 1000, ease: "linear" }
                            : { duration: 0.4, ease: premiumEase }
                        }
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <span className="hidden text-xs font-semibold tabular-nums text-white/70 sm:block">
              {String(index + 1).padStart(2, "0")} <span className="text-white/40">/ {String(count).padStart(2, "0")}</span>
            </span>
          </div>
        </div>
      </div>

      <p ref={liveRef} className="sr-only" aria-live="polite" />
    </section>
  );
}
