"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/features/auth/api";
import { ApiError } from "@/lib/api-client";

type Values = { password: string; confirm: string };

export function ResetPasswordView() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Values>();

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token"));
    setReady(true);
  }, []);

  const onSubmit = async (values: Values) => {
    if (!token) return;
    setError(null);
    setSubmitting(true);
    try {
      await resetPassword(token, values.password);
      setDone(true);
      setTimeout(() => router.push("/login"), 1800);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Tautan tidak valid atau kedaluwarsa.");
      setSubmitting(false);
    }
  };

  return (
    <main className="container-page grid min-h-[70vh] place-items-center py-12">
      <div className="w-full max-w-md rounded-[28px] border border-[#EEE7E2] bg-white p-8 soft-shadow">
        <Link href="/login" className="focus-ring -ml-1.5 mb-6 inline-flex items-center gap-1.5 rounded-full py-1.5 pl-1.5 pr-3 text-sm font-medium text-[#737373] transition hover:bg-[#F7F1ED] hover:text-[#A9445A]">
          <ArrowLeft size={16} /> Kembali ke masuk
        </Link>

        {done ? (
          <div className="text-center">
            <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-[#EEF8F0] text-[#0E7A53]">
              <CheckCircle2 size={30} />
            </span>
            <h1 className="font-serif-display text-3xl">Password diperbarui</h1>
            <p className="mt-3 text-sm leading-6 text-[#737373]">Mengalihkan ke halaman masuk…</p>
          </div>
        ) : ready && !token ? (
          <div className="text-center">
            <h1 className="font-serif-display text-3xl">Tautan tidak valid</h1>
            <p className="mt-3 text-sm leading-6 text-[#737373]">
              Tautan reset tidak lengkap atau sudah kedaluwarsa. Silakan minta tautan baru.
            </p>
            <Link href="/forgot-password" className="mt-6 inline-block font-semibold text-[#A9445A] hover:underline">
              Minta tautan baru
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-[#C95F72]">Reset Password</p>
            <h1 className="font-serif-display text-4xl leading-none">Buat password baru</h1>
            <p className="mt-3 text-sm leading-6 text-[#737373]">Masukkan password baru untuk akunmu.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4" noValidate>
              {error ? (
                <p role="alert" className="rounded-xl border border-[#E7B2BD] bg-[#FBEEF1] px-3.5 py-2.5 text-sm text-[#A9445A]">{error}</p>
              ) : null}
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-[#3f3a37]">Password Baru</span>
                <div className="flex items-center gap-2.5 rounded-xl border border-[#E4DBD5] bg-white px-3.5 focus-within:border-[#C95F72] focus-within:ring-2 focus-within:ring-[#C95F72]/25">
                  <Lock size={17} className="text-[#B8AFA9]" />
                  <input
                    type={show ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="h-12 w-full border-0 bg-transparent text-sm text-[#262626] outline-none placeholder:text-[#B8AFA9]"
                    {...register("password", { required: "Password wajib diisi", minLength: { value: 6, message: "Minimal 6 karakter" } })}
                  />
                  <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Sembunyikan" : "Tampilkan"} className="focus-ring grid h-7 w-7 place-items-center rounded-md text-[#9B918A] hover:text-[#A9445A]">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password ? <span className="mt-1 block text-xs text-[#C0445E]">{errors.password.message}</span> : null}
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-[#3f3a37]">Ulangi Password</span>
                <div className="flex items-center gap-2.5 rounded-xl border border-[#E4DBD5] bg-white px-3.5 focus-within:border-[#C95F72] focus-within:ring-2 focus-within:ring-[#C95F72]/25">
                  <Lock size={17} className="text-[#B8AFA9]" />
                  <input
                    type={show ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="h-12 w-full border-0 bg-transparent text-sm text-[#262626] outline-none placeholder:text-[#B8AFA9]"
                    {...register("confirm", {
                      required: "Ulangi password",
                      validate: (v) => v === watch("password") || "Password tidak sama",
                    })}
                  />
                </div>
                {errors.confirm ? <span className="mt-1 block text-xs text-[#C0445E]">{errors.confirm.message}</span> : null}
              </label>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Menyimpan…" : "Simpan Password Baru"}
              </Button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
