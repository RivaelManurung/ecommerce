"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils/format-currency";
import { checkoutSchema } from "@/lib/validations/checkout.schema";
import type { CheckoutFormValues } from "@/types/checkout";

const shipping = [
  ["regular", "Reguler", "2-4 hari kerja", 0],
  ["express", "Express", "1-2 hari kerja", 18000],
  ["same-day", "Same Day", "Hari yang sama", 25000],
] as const;

const payments = [
  ["bank", "Transfer Bank", "BCA Mandiri BRI BNI"],
  ["ewallet", "E-Wallet", "OVO DANA GoPay ShopeePay"],
  ["card", "Kartu Kredit / Debit", "VISA Mastercard JCB"],
] as const;

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, discount, total, clearCart } = useCartStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "Aulia Putri",
      phone: "081234567890",
      address: "Jl. Kemang Raya No.72, RT 005/RW 002",
      province: "DKI Jakarta",
      city: "Jakarta Selatan",
      district: "Mampang Prapatan",
      postalCode: "12730",
      shippingMethod: "regular",
      paymentMethod: "bank",
      notes: "",
    },
  });

  function submit() {
    clearCart();
    router.push("/order/success?order=VLR-2026-1048");
  }

  return (
    <main className="container-page py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#EEE7E2] bg-white/82 p-4">
        <div className="flex flex-wrap gap-4 text-sm">
          {["Cart", "Shipping", "Payment", "Review"].map((step, index) => (
            <span key={step} className="inline-flex items-center gap-2"><b className={`grid h-8 w-8 place-items-center rounded-full ${index === 0 ? "bg-[#C95F72] text-white" : "bg-[#F8DDE2] text-[#A9445A]"}`}>{index + 1}</b>{step}</span>
          ))}
        </div>
        <span className="inline-flex items-center gap-2 text-sm text-[#737373]"><Lock size={16} /> Secure Checkout</span>
      </div>
      <form onSubmit={handleSubmit(submit)} className="grid gap-7 lg:grid-cols-[1fr_420px]">
        <section className="grid gap-5">
          <Panel title="Metode Pengiriman">
            <div className="grid gap-3 md:grid-cols-3">
              {shipping.map(([value, label, desc, price]) => (
                <label key={value} className="cursor-pointer rounded-2xl border border-[#EEE7E2] p-4 transition hover:border-[#E8BBC4] has-[:checked]:border-[#C95F72] has-[:checked]:bg-[#FFF8F9]">
                  <input type="radio" value={value} {...register("shippingMethod")} /> <b>{label}</b>
                  <p className="mt-2 text-sm text-[#737373]">{desc}</p>
                  <p className="mt-2 text-sm font-semibold">{price ? formatCurrency(price) : "Gratis"}</p>
                </label>
              ))}
            </div>
          </Panel>
          <Panel title="Alamat Pengiriman">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nama Lengkap" error={errors.fullName?.message} input={<input {...register("fullName")} />} />
              <Field label="No. Handphone" error={errors.phone?.message} input={<input {...register("phone")} />} />
              <Field className="md:col-span-2" label="Alamat Lengkap" error={errors.address?.message} input={<input {...register("address")} />} />
              <Field label="Provinsi" error={errors.province?.message} input={<input {...register("province")} />} />
              <Field label="Kota / Kabupaten" error={errors.city?.message} input={<input {...register("city")} />} />
              <Field label="Kecamatan" error={errors.district?.message} input={<input {...register("district")} />} />
              <Field label="Kode Pos" error={errors.postalCode?.message} input={<input {...register("postalCode")} />} />
            </div>
          </Panel>
          <Panel title="Metode Pembayaran">
            <div className="grid gap-3 md:grid-cols-3">
              {payments.map(([value, label, desc]) => (
                <label key={value} className="cursor-pointer rounded-2xl border border-[#EEE7E2] p-4 transition hover:border-[#E8BBC4] has-[:checked]:border-[#C95F72] has-[:checked]:bg-[#FFF8F9]">
                  <input type="radio" value={value} {...register("paymentMethod")} /> <b>{label}</b>
                  <p className="mt-3 text-sm font-semibold text-[#3861A8]">{desc}</p>
                </label>
              ))}
              <label className="rounded-2xl border border-[#EEE7E2] p-4 opacity-50"><input type="radio" disabled /> Bayar di Tempat (COD)<p className="text-sm">Tidak tersedia</p></label>
            </div>
          </Panel>
          <Panel title="Catatan Pesanan (Opsional)">
            <textarea {...register("notes")} className="focus-ring min-h-24 w-full rounded-md border border-[#EEE7E2] p-4" placeholder="Tulis catatan untuk pesananmu" />
            {errors.notes?.message ? <p className="mt-1 text-xs text-[#C95F72]">{errors.notes.message}</p> : null}
          </Panel>
        </section>
        <aside className="premium-card h-fit rounded-3xl p-6 lg:sticky lg:top-32">
          <h2 className="mb-5 text-lg font-bold uppercase">Ringkasan Pesanan</h2>
          <div className="grid gap-4">
            {items.length ? items.map((item) => (
              <div key={`${item.product.id}-${item.shade}`} className="grid grid-cols-[70px_1fr_auto] gap-3 text-sm">
                <Image src={item.product.images[0]} alt={item.product.name} width={70} height={70} className="rounded-md bg-[#FFF7F3]" />
                <div><p className="font-semibold">{item.product.name}</p><p className="text-[#737373]">{item.shade} x{item.quantity}</p></div>
                <p>{formatCurrency(item.product.price * item.quantity)}</p>
              </div>
            )) : <p className="text-sm text-[#737373]">Keranjang kosong. Submit tetap membuat order dummy.</p>}
          </div>
          <div className="mt-5 border-t border-[#EEE7E2] pt-5 text-sm">
            <Row label="Subtotal" value={formatCurrency(subtotal())} />
            <Row label="Diskon" value={`-${formatCurrency(discount())}`} />
            <Row label="Ongkos Kirim" value="Gratis" />
            <Row label="Total" value={formatCurrency(total())} big />
          </div>
          <Button className="mt-5 min-h-12 w-full" disabled={isSubmitting}>{isSubmitting ? "Processing..." : "Place Order"} <Lock size={16} /></Button>
        </aside>
      </form>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-[#EEE7E2] bg-white p-5 shadow-[0_12px_36px_rgba(73,45,38,0.035)]"><h2 className="mb-4 font-bold uppercase tracking-[0.14em]">{title}</h2>{children}</section>;
}

function Field({ label, input, error, className }: { label: string; input: React.ReactElement<{ className?: string }>; error?: string; className?: string }) {
  return (
    <label className={className}>
      <span className="mb-1 block text-sm text-[#737373]">{label}</span>
      {input}
      {error ? <p className="mt-1 text-xs text-[#C95F72]">{error}</p> : null}
    </label>
  );
}

function Row({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return <div className={`mb-3 flex justify-between ${big ? "text-xl font-bold text-[#C95F72]" : ""}`}><span>{label}</span><span>{value}</span></div>;
}
