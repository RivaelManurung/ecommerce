import { BadgeCheck, LockKeyhole, PackageCheck, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { Stagger, StaggerItem } from "@/components/shared/stagger";

const promises: { title: string; copy: string; Icon: LucideIcon }[] = [
  { title: "100% Original", copy: "Produk resmi Veloura", Icon: BadgeCheck },
  { title: "BPOM Registered", copy: "Terdaftar dan terkurasi", Icon: ShieldCheck },
  { title: "Dermatologically Tested", copy: "Formula nyaman harian", Icon: LockKeyhole },
  { title: "Secure Packaging", copy: "Aman sampai tujuan", Icon: PackageCheck },
];

export function BrandPromiseStrip() {
  return (
    <section className="container-page py-4">
      <Reveal>
        <Stagger className="grid gap-3 rounded-2xl border border-[#EEE7E2] bg-white/80 p-4 shadow-[0_14px_45px_rgba(73,45,38,0.05)] backdrop-blur md:grid-cols-4">
          {promises.map(({ title, copy, Icon }) => (
            <StaggerItem key={title} className="flex items-center gap-3 border-[#EEE7E2] md:border-r md:last:border-0">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#DDE8D5] text-[#60775C]">
                <Icon size={20} />
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.12em]">{title}</p>
                <p className="text-xs text-[#737373]">{copy}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Reveal>
    </section>
  );
}
