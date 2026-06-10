import Link from "next/link";
import { Heart, MapPin, PackageCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const cards = [
  {
    title: "Profil Aulia Putri",
    copy: "Member Veloura Glow sejak 2024.",
    icon: User,
  },
  {
    title: "Order History",
    copy: "VLR-2026-0992 • Delivered • Rp328.000",
    icon: PackageCheck,
  },
  {
    title: "Saved Addresses",
    copy: "Jl. Kemang Raya, Jakarta Selatan",
    icon: MapPin,
  },
];

export default function AccountPage() {
  return (
    <main className="container-page py-10">
      <section className="editorial-surface rounded-3xl border border-[#EEE7E2] p-8 md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#C95F72]">Veloura member</p>
        <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="font-serif-display text-6xl leading-none">Akun Saya</h1>
            <p className="mt-3 max-w-xl text-[#737373]">Kelola pesanan, alamat, wishlist, dan preferensi belanja kecantikanmu.</p>
          </div>
          <Link href="/wishlist" className="inline-flex">
            <Button variant="secondary" className="rounded-full"><Heart size={17} /> Buka Wishlist</Button>
          </Link>
        </div>
      </section>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {cards.map(({ title, copy, icon: Icon }) => (
          <section key={title} className="group rounded-3xl border border-[#EEE7E2] bg-white p-6 shadow-[0_14px_44px_rgba(73,45,38,0.045)] transition hover:-translate-y-1 hover:border-[#E8BBC4] hover:shadow-[0_22px_58px_rgba(169,68,90,0.1)]">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#F8DDE2] text-[#A9445A] transition group-hover:scale-105">
              <Icon size={20} />
            </span>
            <h2 className="mt-5 font-bold uppercase tracking-[0.12em]">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-[#737373]">{copy}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
