import { MessageCircle, Sparkles } from "lucide-react";
import type { Setting } from "@/lib/admin-types";
import { waLink } from "@/lib/wa";

export function PromoBar({ settings }: { settings: Setting }) {
  return (
    <div className="bg-[#231A18] text-white/90">
      <div className="container-page flex h-9 items-center justify-center gap-2 text-center text-[11px] md:justify-between md:text-xs">
        <span className="inline-flex items-center gap-2">
          <Sparkles size={13} className="text-[#F0C9D2]" />
          {settings.tagline || "Katalog produk pilihan — tanya & pesan langsung."}
        </span>
        {settings.whatsapp ? (
          <a
            href={waLink(settings.whatsapp, "Halo, saya ingin bertanya tentang produk Anda.")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 transition hover:text-white md:inline-flex"
          >
            <MessageCircle size={13} /> {settings.whatsapp}
          </a>
        ) : null}
      </div>
    </div>
  );
}
