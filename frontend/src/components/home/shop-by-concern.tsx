import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Stagger, StaggerItem } from "@/components/shared/stagger";

const concerns = [
  {
    title: "Untuk kulit berminyak",
    text: "Kontrol minyak, bebas kilap",
    color: "bg-[#DDE8D5]",
    image: "/images/product-cosmetics.svg",
  },
  {
    title: "Glass skin routine",
    text: "Kulit halus, lembap, bercahaya",
    color: "bg-[#F8DDE2]",
    image: "/images/product-cushion.svg",
  },
  {
    title: "Daily glam look",
    text: "Makeup natural untuk setiap hari",
    color: "bg-[#F3E6D8]",
    image: "/images/product-eye.svg",
  },
  {
    title: "Travel essentials",
    text: "Ringkas, praktis, tetap on point",
    color: "bg-[#E8EDE0]",
    image: "/images/product-lip.svg",
  },
];

export function ShopByConcern() {
  return (
    <section className="container-page py-10">
      <Reveal>
        <SectionHeading eyebrow="Shop by need" title="Curated Beauty Edits" copy="Temukan rangkaian produk yang sesuai dengan kebutuhan kulit dan ritme harianmu." />
      </Reveal>
      <Stagger className="grid gap-4 md:grid-cols-4">
        {concerns.map((concern) => (
          <StaggerItem key={concern.title}>
            <Link href="/catalog" className={`group relative block min-h-44 overflow-hidden rounded-2xl ${concern.color} p-6 shadow-[0_16px_42px_rgba(73,45,38,0.055)] transition hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(73,45,38,0.095)]`}>
              <div className="relative z-10 max-w-[62%]">
                <h3 className="text-sm font-bold uppercase tracking-[0.12em]">{concern.title}</h3>
                <p className="mt-2 text-sm leading-5 text-[#65605B]">{concern.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#A9445A]">
                  Shop Now <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                </span>
              </div>
              <Image src={concern.image} alt="" width={180} height={180} className="absolute -bottom-8 -right-4 w-40 transition duration-500 group-hover:scale-105" />
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
