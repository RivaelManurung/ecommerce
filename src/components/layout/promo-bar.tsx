import { Truck } from "lucide-react";

export function PromoBar() {
  return (
    <div className="bg-[#F8DDE2] text-[#A9445A]">
      <div className="container-page flex h-8 items-center justify-center gap-2 text-center text-[11px] md:justify-between md:text-xs">
        <span className="inline-flex items-center gap-2">
          <Truck size={14} /> <b>GRATIS ONGKIR</b> untuk semua pesanan di Indonesia | Gunakan kode: <b>VELOURA20</b>
        </span>
        <span className="hidden md:block">Belanja sekarang {`->`}</span>
      </div>
    </div>
  );
}
