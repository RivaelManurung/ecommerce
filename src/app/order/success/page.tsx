import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;
  const order = params.order ?? "VLR-2026-1001";
  return (
    <main className="container-page grid min-h-[55vh] place-items-center py-14 text-center">
      <div className="max-w-xl rounded-lg border border-[#EEE7E2] bg-white p-10 soft-shadow">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#C95F72]">Order berhasil</p>
        <h1 className="mt-4 font-serif-display text-5xl">Terima kasih</h1>
        <p className="mt-4 text-[#737373]">Pesanan {order} sudah kami terima. Ringkasan pembayaran dan instruksi berikutnya akan dikirim ke emailmu.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button">Lihat Pesanan</Button>
          <Link href="/shop" className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md border border-[#C95F72] px-5 text-sm font-semibold text-[#A9445A]">Lanjut Belanja</Link>
        </div>
      </div>
    </main>
  );
}
