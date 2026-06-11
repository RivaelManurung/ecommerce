import Image from "next/image";
import Link from "next/link";
import { Heart, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { StaticPage } from "@/components/static/static-page";
import { Reveal } from "@/components/shared/reveal";

const values = [
  { icon: Leaf, title: "Formula Lembut", copy: "Diformulasikan untuk kulit Asia—ringan, cruelty-free, dan teruji dermatologi." },
  { icon: Sparkles, title: "Hasil Nyata", copy: "Glow yang sehat dan tahan lama, bukan sekadar tren sesaat." },
  { icon: ShieldCheck, title: "Aman & Terdaftar", copy: "Seluruh produk terdaftar BPOM dan melalui kontrol kualitas ketat." },
  { icon: Heart, title: "Dibuat dengan Cinta", copy: "Brand lokal yang tumbuh bersama komunitas kecantikan Indonesia." },
];

const stats = [
  { value: "120K+", label: "Pelanggan bahagia" },
  { value: "4.9/5", label: "Rata-rata rating" },
  { value: "60+", label: "Produk pilihan" },
  { value: "100%", label: "Cruelty-free" },
];

export default function AboutPage() {
  return (
    <StaticPage
      title="Tentang Veloura"
      eyebrow="Cerita Kami"
      intro="Veloura Beauty adalah brand kecantikan Indonesia premium untuk rutinitas harian yang lembut, percaya diri, dan modern."
      contained={false}
    >
      {/* Story + image */}
      <section className="grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-16">
        <Reveal direction="left">
          <div className="rich-content max-w-xl">
            <h2>Kecantikan yang terasa seperti dirimu</h2>
            <p>
              Kami percaya makeup dan skincare terbaik adalah yang membuatmu merasa menjadi versi terbaik diri sendiri—
              bukan menutupi, melainkan menonjolkan. Setiap formula Veloura lahir dari riset, uji klinis, dan masukan
              nyata dari komunitas kami.
            </p>
            <p>
              Dari skin tint yang menyatu sempurna hingga lip series yang melembap seharian, kami merancang produk yang
              ringan dipakai dan ramah untuk iklim tropis Indonesia.
            </p>
            <Link href="/shop" className="inline-block">Jelajahi koleksi →</Link>
          </div>
        </Reveal>
        <Reveal direction="right">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] soft-shadow">
            <Image
              src="/images/veloura-editorial-banner.png"
              alt="Editorial Veloura Beauty"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </section>

      {/* Values */}
      <section className="py-6">
        <Reveal>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-[#C95F72]">Yang Kami Pegang</p>
          <h2 className="font-serif-display text-4xl leading-none md:text-5xl">Nilai yang menuntun kami</h2>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => (
            <Reveal key={value.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-[#EEE7E2] bg-white p-6 soft-shadow transition hover:-translate-y-1">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#F8DDE2] text-[#A9445A]">
                  <value.icon size={20} />
                </span>
                <h3 className="mt-4 text-base font-bold text-[#262626]">{value.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#737373]">{value.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="my-14 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#A9445A] via-[#C95F72] to-[#E8A7B4] px-6 py-12 text-white soft-shadow">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-serif-display text-4xl md:text-5xl">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </StaticPage>
  );
}
