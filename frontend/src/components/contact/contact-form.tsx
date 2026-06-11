"use client";

import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquirySchema, type InquiryInput, type InquiryValues } from "@/lib/validations";
import { submitInquiry } from "@/features/public/api";
import { ApiError } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

const fieldWrap =
  "flex items-center rounded-xl border border-[#E4DBD5] bg-white px-3.5 transition focus-within:border-[#C95F72] focus-within:ring-2 focus-within:ring-[#C95F72]/25";
const fieldInput =
  "h-12 w-full border-0 bg-transparent text-sm text-[#262626] outline-none placeholder:text-[#B8AFA9]";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<InquiryInput, unknown, InquiryValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { name: "", email: "", phone: "", productId: "", message: "" },
  });

  // Prefill the message when arriving from a product page (?product=slug).
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("product");
    if (slug) setValue("message", `I'm interested in the product: ${slug}\n\n`);
  }, [setValue]);

  async function onSubmit(values: InquiryValues) {
    try {
      await submitInquiry(values);
      reset();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.details) {
          for (const [field, message] of Object.entries(err.details)) {
            setError(field as keyof InquiryValues, { message });
          }
        }
        setError("root", { message: err.message });
      } else {
        setError("root", { message: "Unexpected error. Please try again." });
      }
    }
  }

  if (isSubmitSuccessful) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[24px] border border-[#EEE7E2] bg-white p-10 text-center soft-shadow">
        <CheckCircle2 className="text-emerald-600" size={36} />
        <h2 className="font-serif-display text-2xl">Thank you!</h2>
        <p className="text-sm text-[#737373]">
          Your inquiry has been received. Our team will get back to you shortly.
        </p>
        <Button variant="secondary" onClick={() => reset()}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-[24px] border border-[#EEE7E2] bg-white p-7 soft-shadow sm:p-8"
      noValidate
    >
      <h2 className="font-serif-display text-3xl leading-none">Kirim Pesan</h2>
      <p className="mt-2 text-sm text-[#737373]">
        Isi formulir di bawah dan kami akan segera menghubungimu.
      </p>

      {errors.root && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errors.root.message}
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className="mb-1.5 block text-sm font-medium text-[#3f3a37]">Nama</span>
            <div className={fieldWrap}>
              <input className={fieldInput} type="text" placeholder="Nama kamu" autoComplete="name" {...register("name")} />
            </div>
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-medium text-[#3f3a37]">Email</span>
            <div className={fieldWrap}>
              <input className={fieldInput} type="email" placeholder="kamu@email.com" autoComplete="email" {...register("email")} />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
        </div>
        <div>
          <span className="mb-1.5 block text-sm font-medium text-[#3f3a37]">No. Telepon (opsional)</span>
          <div className={fieldWrap}>
            <input className={fieldInput} type="tel" placeholder="08xx xxxx xxxx" autoComplete="tel" {...register("phone")} />
          </div>
        </div>
        <div>
          <span className="mb-1.5 block text-sm font-medium text-[#3f3a37]">Pesan</span>
          <div className={`${fieldWrap} items-start py-1`}>
            <textarea
              className={`${fieldInput} min-h-28 resize-y py-3`}
              placeholder="Tulis pesanmu di sini..."
              {...register("message")}
            />
          </div>
          {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Mengirim…" : "Kirim Pesan"}
        </Button>
      </div>
    </form>
  );
}
