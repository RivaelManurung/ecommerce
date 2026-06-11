import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({ onReset }: { onReset?: () => void }) {
  return (
    <div className="rounded-2xl border border-[#EEE7E2] bg-white p-10 text-center soft-shadow">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#F8DDE2] text-[#A9445A]">
        <SearchX />
      </div>
      <h2 className="mt-5 font-serif-display text-4xl">Produk tidak ditemukan</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#737373]">Coba ubah filter, kata kunci, atau jelajahi koleksi Veloura lainnya.</p>
      {onReset ? <Button className="mt-6" variant="secondary" onClick={onReset}>Reset filter</Button> : null}
    </div>
  );
}
