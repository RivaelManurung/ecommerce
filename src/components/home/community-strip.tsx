import Image from "next/image";
import { Camera } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

export function CommunityStrip() {
  return (
    <section className="container-page py-10">
      <SectionHeading eyebrow="@veloura.beauty" title="From Our Community" href="/shop" />
      <div className="grid grid-cols-3 gap-2 md:grid-cols-8">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="group relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image src={index % 2 ? "/images/product-lip.svg" : "/images/veloura-editorial-banner.png"} alt="Veloura community post" fill className="object-cover" />
            <span className="absolute inset-0 grid place-items-center bg-[#A9445A]/0 text-white opacity-0 transition group-hover:bg-[#A9445A]/35 group-hover:opacity-100">
              <Camera />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
