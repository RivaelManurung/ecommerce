"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, Lock, Truck } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { TOKEN_COOKIE, ApiError } from "@/lib/api-client";
import { checkout, quoteShipping, type CheckoutInput, type ShippingOption } from "@/features/orders/api";
import { validateCoupon } from "@/features/admin-coupons/api";
import { formatIDR } from "@/lib/format";
import { cn } from "@/lib/utils/cn";

type FormValues = {
  fullName: string;
  phone: string;
  address: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  notes: string;
  paymentMethod: "bank" | "ewallet" | "cod";
};

const PAYMENT_OPTIONS: { value: FormValues["paymentMethod"]; label: string; desc: string }[] = [
  { value: "bank", label: "Transfer Bank", desc: "BCA / BNI / Mandiri (verifikasi manual)" },
  { value: "ewallet", label: "E-Wallet", desc: "GoPay / OVO / DANA" },
  { value: "cod", label: "Bayar di Tempat", desc: "COD (area tertentu)" },
];

export function CheckoutView() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const resetLocal = useCartStore((s) => s.resetLocal);

  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Shipping selection (resolved from the server quote, not user-entered).
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);

  // Coupon.
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { paymentMethod: "bank" } });

  const province = watch("province");
  const city = watch("city");

  const fetchShipping = async () => {
    if (!province?.trim()) {
      setShippingError("Isi provinsi dulu untuk menghitung ongkir.");
      return;
    }
    setShippingError(null);
    setShippingLoading(true);
    try {
      const { options } = await quoteShipping(province, city);
      setShippingOptions(options);
      setSelectedShipping(options[0] ?? null);
    } catch (error) {
      setShippingError(error instanceof ApiError ? error.message : "Gagal menghitung ongkir.");
      setShippingOptions([]);
      setSelectedShipping(null);
    } finally {
      setShippingLoading(false);
    }
  };

  // Guard: checkout requires a signed-in customer and a non-empty cart.
  useEffect(() => {
    const authed = new RegExp(`(?:^|; )${TOKEN_COOKIE}=`).test(document.cookie);
    if (!authed) {
      router.replace("/login?next=/checkout");
      return;
    }
    setReady(true);
  }, [router]);

  const available = items.filter((i) => i.available);
  const subtotal = available.reduce((s, i) => s + i.lineTotal, 0);
  const count = available.reduce((n, i) => n + i.quantity, 0);
  const shippingCost = selectedShipping?.cost ?? 0;
  const discount = appliedCoupon?.discount ?? 0;
  const total = Math.max(0, subtotal - discount) + shippingCost;

  const applyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) return;
    setCouponError(null);
    setCouponLoading(true);
    try {
      const res = await validateCoupon(code, subtotal);
      setAppliedCoupon({ code: res.code, discount: res.discount });
    } catch (error) {
      setAppliedCoupon(null);
      setCouponError(error instanceof ApiError ? error.message : "Coupon could not be applied.");
    } finally {
      setCouponLoading(false);
    }
  };

  useEffect(() => {
    if (ready && items.length === 0) router.replace("/cart");
  }, [ready, items.length, router]);

  if (!ready) {
    return (
      <main className="container-page grid min-h-[40vh] place-items-center py-16">
        <Loader2 className="animate-spin text-[#C95F72]" />
      </main>
    );
  }

  const onSubmit = async (values: FormValues) => {
    if (!selectedShipping) {
      setShippingError("Pilih metode pengiriman terlebih dahulu.");
      return;
    }
    setServerError(null);
    setSubmitting(true);
    try {
      const input: CheckoutInput = {
        address: {
          fullName: values.fullName,
          phone: values.phone,
          address: values.address,
          province: values.province,
          city: values.city,
          district: values.district,
          postalCode: values.postalCode,
          notes: values.notes,
        },
        courier: selectedShipping.courier,
        service: selectedShipping.service,
        couponCode: appliedCoupon?.code,
        paymentMethod: values.paymentMethod,
      };
      const order = await checkout(input);
      resetLocal();
      router.push(`/orders/${order.id}?placed=1`);
    } catch (error) {
      setServerError(
        error instanceof ApiError ? error.message : "Gagal membuat pesanan. Coba lagi.",
      );
      setSubmitting(false);
    }
  };

  return (
    <main className="container-page py-8 md:py-12">
      <h1 className="font-serif-display text-4xl leading-none">Checkout</h1>
      <p className="mt-2 text-sm text-[#737373]">Lengkapi alamat pengiriman untuk menyelesaikan pesanan.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]" noValidate>
        {/* Address + payment */}
        <div className="grid gap-6">
          {serverError ? (
            <p role="alert" className="rounded-xl border border-[#E7B2BD] bg-[#FBEEF1] px-4 py-3 text-sm text-[#A9445A]">
              {serverError}
            </p>
          ) : null}

          <section className="rounded-2xl border border-[#EEE7E2] bg-white p-5">
            <h2 className="font-serif-display text-2xl">Alamat Pengiriman</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Nama Lengkap" error={errors.fullName?.message}>
                <input className={inputCls} placeholder="Nama penerima" {...register("fullName", { required: "Wajib diisi", minLength: { value: 2, message: "Min. 2 karakter" } })} />
              </Field>
              <Field label="No. HP / WhatsApp" error={errors.phone?.message}>
                <input className={inputCls} placeholder="0812xxxxxxxx" inputMode="tel" {...register("phone", { required: "Wajib diisi", minLength: { value: 6, message: "Nomor tidak valid" } })} />
              </Field>
              <Field label="Alamat Lengkap" error={errors.address?.message} full>
                <textarea rows={2} className={inputCls} placeholder="Jalan, nomor rumah, RT/RW" {...register("address", { required: "Wajib diisi", minLength: { value: 5, message: "Terlalu pendek" } })} />
              </Field>
              <Field label="Provinsi" error={errors.province?.message}>
                <input className={inputCls} placeholder="Provinsi" {...register("province")} />
              </Field>
              <Field label="Kota / Kabupaten" error={errors.city?.message}>
                <input className={inputCls} placeholder="Kota" {...register("city", { required: "Wajib diisi" })} />
              </Field>
              <Field label="Kecamatan" error={errors.district?.message}>
                <input className={inputCls} placeholder="Kecamatan" {...register("district")} />
              </Field>
              <Field label="Kode Pos" error={errors.postalCode?.message}>
                <input className={inputCls} placeholder="12345" inputMode="numeric" {...register("postalCode", { maxLength: { value: 12, message: "Maks. 12 digit" } })} />
              </Field>
              <Field label="Catatan (opsional)" error={errors.notes?.message} full>
                <textarea rows={2} className={inputCls} placeholder="Patokan / instruksi pengiriman" {...register("notes")} />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-[#EEE7E2] bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif-display text-2xl">Pengiriman</h2>
              <button
                type="button"
                onClick={fetchShipping}
                disabled={shippingLoading}
                className="focus-ring inline-flex items-center gap-2 rounded-full border border-[#C95F72] px-4 py-2 text-sm font-semibold text-[#A9445A] transition hover:bg-[#FFF1F3] disabled:opacity-50"
              >
                {shippingLoading ? <Loader2 size={15} className="animate-spin" /> : <Truck size={15} />}
                Hitung Ongkir
              </button>
            </div>
            {shippingError ? <p className="mt-3 text-sm text-[#C0445E]">{shippingError}</p> : null}
            {shippingOptions.length > 0 ? (
              <div className="mt-4 grid gap-3">
                {shippingOptions.map((opt) => {
                  const key = `${opt.courier}-${opt.service}`;
                  const active = selectedShipping?.courier === opt.courier && selectedShipping?.service === opt.service;
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setSelectedShipping(opt)}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition",
                        active ? "border-[#C95F72] bg-[#FFF1F3]" : "border-[#EEE7E2] hover:border-[#E8BBC4]",
                      )}
                    >
                      <span>
                        <span className="block text-sm font-semibold text-[#262626]">{opt.courier} · {opt.service}</span>
                        <span className="block text-xs text-[#9B918A]">Estimasi {opt.eta}</span>
                      </span>
                      <span className="text-sm font-bold text-[#A9445A]">{formatIDR(opt.cost)}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 text-sm text-[#9B918A]">Isi provinsi & kota lalu klik “Hitung Ongkir” untuk melihat pilihan kurir.</p>
            )}
          </section>

          <section className="rounded-2xl border border-[#EEE7E2] bg-white p-5">
            <h2 className="font-serif-display text-2xl">Metode Pembayaran</h2>
            <div className="mt-4 grid gap-3">
              {PAYMENT_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#EEE7E2] px-4 py-3 transition has-[:checked]:border-[#C95F72] has-[:checked]:bg-[#FFF1F3]">
                  <input type="radio" value={opt.value} className="mt-1 h-4 w-4 accent-[#C95F72]" {...register("paymentMethod")} />
                  <span>
                    <span className="block text-sm font-semibold text-[#262626]">{opt.label}</span>
                    <span className="block text-xs text-[#9B918A]">{opt.desc}</span>
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs leading-5 text-[#9B918A]">
              Pembayaran online otomatis sedang disiapkan. Untuk saat ini pesanan dibuat dengan status
              <span className="font-medium text-[#7a6a60]"> menunggu pembayaran</span> dan tim kami akan menghubungimu untuk konfirmasi.
            </p>
          </section>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-2xl border border-[#EEE7E2] bg-white p-5 lg:sticky lg:top-24">
          <h2 className="font-serif-display text-2xl">Ringkasan</h2>
          <ul className="mt-4 grid gap-3">
            {available.map((line) => (
              <li key={line.variantId} className="flex gap-3">
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[#EEE7E2] bg-[#FAF4EF]">
                  {line.image ? <Image src={line.image} alt={line.name} fill sizes="56px" className="object-cover" /> : null}
                  <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#C95F72] px-1 text-[10px] font-bold text-white">{line.quantity}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-1 text-sm font-medium text-[#262626]">{line.name}</span>
                  <span className="block text-xs text-[#9B918A]">{line.variantName}</span>
                </span>
                <span className="text-sm font-semibold text-[#262626]">{formatIDR(line.lineTotal)}</span>
              </li>
            ))}
          </ul>
          {/* Coupon */}
          <div className="mt-4 border-t border-[#EEE7E2] pt-4">
            <label className="mb-1.5 block text-sm font-medium text-[#3f3a37]">Kode Kupon</label>
            <div className="flex gap-2">
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="MISAL: HEMAT10"
                className="h-11 w-full rounded-xl border border-[#E4DBD5] bg-white px-3.5 text-sm uppercase outline-none transition focus:border-[#C95F72] focus:ring-2 focus:ring-[#C95F72]/20 placeholder:text-[#B8AFA9]"
              />
              <button
                type="button"
                onClick={applyCoupon}
                disabled={couponLoading || !couponInput.trim()}
                className="focus-ring shrink-0 rounded-xl border border-[#C95F72] px-4 text-sm font-semibold text-[#A9445A] transition hover:bg-[#FFF1F3] disabled:opacity-50"
              >
                {couponLoading ? "…" : "Pakai"}
              </button>
            </div>
            {couponError ? <p className="mt-1.5 text-xs text-[#C0445E]">{couponError}</p> : null}
            {appliedCoupon ? (
              <p className="mt-1.5 text-xs text-[#0E7A53]">
                Kupon {appliedCoupon.code} diterapkan: −{formatIDR(appliedCoupon.discount)}{" "}
                <button type="button" onClick={() => { setAppliedCoupon(null); setCouponInput(""); }} className="underline">hapus</button>
              </p>
            ) : null}
          </div>

          <dl className="mt-4 grid gap-2 border-t border-[#EEE7E2] pt-4 text-sm">
            <div className="flex justify-between text-[#737373]"><dt>Subtotal ({count} item)</dt><dd className="font-semibold text-[#262626]">{formatIDR(subtotal)}</dd></div>
            {discount > 0 ? (
              <div className="flex justify-between text-[#0E7A53]"><dt>Diskon ({appliedCoupon?.code})</dt><dd className="font-semibold">−{formatIDR(discount)}</dd></div>
            ) : null}
            <div className="flex justify-between text-[#737373]">
              <dt>Ongkir{selectedShipping ? ` (${selectedShipping.courier})` : ""}</dt>
              <dd className={selectedShipping ? "font-semibold text-[#262626]" : "text-[#9B918A]"}>
                {selectedShipping ? formatIDR(shippingCost) : "Belum dipilih"}
              </dd>
            </div>
          </dl>
          <div className="mt-4 flex items-center justify-between border-t border-[#EEE7E2] pt-4">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold text-[#C95F72]">{formatIDR(total)}</span>
          </div>
          <button
            type="submit"
            disabled={submitting || count === 0}
            className="focus-ring mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#C95F72] px-6 text-sm font-semibold text-white transition hover:bg-[#A9445A] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? <Loader2 size={17} className="animate-spin" /> : <Lock size={16} />}
            {submitting ? "Memproses…" : "Buat Pesanan"}
          </button>
          <Link href="/cart" className="focus-ring mt-3 inline-flex w-full items-center justify-center text-sm font-medium text-[#A9445A] hover:underline">
            Kembali ke keranjang
          </Link>
        </aside>
      </form>
    </main>
  );
}

const inputCls =
  "h-11 w-full rounded-xl border border-[#E4DBD5] bg-white px-3.5 text-sm text-[#262626] outline-none transition focus:border-[#C95F72] focus:ring-2 focus:ring-[#C95F72]/20 placeholder:text-[#B8AFA9]";

function Field({
  label,
  error,
  full,
  children,
}: {
  label: string;
  error?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", full && "sm:col-span-2")}>
      <span className="mb-1.5 block text-sm font-medium text-[#3f3a37]">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-[#C0445E]">{error}</span> : null}
    </label>
  );
}
