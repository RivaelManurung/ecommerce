import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  return (
    <section className="mt-12 border-y border-[#EEE7E2] bg-[#F8DDE2]/55">
      <div className="container-page grid items-center gap-7 py-8 md:grid-cols-[1fr_1.25fr_320px]">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.28em]">Jadi yang pertama tahu</h2>
          <p className="mt-2 text-sm text-[#737373]">Dapatkan update terbaru, promo eksklusif, dan tips kecantikan langsung ke emailmu.</p>
        </div>
        <form className="grid gap-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input className="focus-ring h-12 min-w-0 flex-1 rounded-full border border-[#EEE7E2] bg-white/94 px-5 text-sm shadow-[0_10px_32px_rgba(73,45,38,0.05)]" placeholder="Masukkan alamat emailmu" type="email" />
            <Button type="button" className="rounded-full px-7">Subscribe</Button>
          </div>
          <label className="flex items-center gap-2 text-xs text-[#737373]">
            <input type="checkbox" className="h-4 w-4 accent-[#C95F72]" /> Saya setuju menerima email promosi dari Veloura Beauty.
          </label>
        </form>
        <div className="relative hidden h-32 overflow-hidden rounded-2xl border border-white/70 md:block">
          <Image src="/images/veloura-editorial-banner.png" alt="Veloura gift box" fill className="object-cover" />
        </div>
      </div>
    </section>
  );
}
