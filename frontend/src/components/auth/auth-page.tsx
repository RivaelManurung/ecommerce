"use client";

import { cloneElement, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles, Truck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { premiumEase } from "@/lib/animations";
import { login as loginRequest, register as registerRequest, googleLogin } from "@/features/auth/api";
import { useAuthStore } from "@/lib/auth";
import { useCartStore } from "@/lib/store/cart-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { ApiError } from "@/lib/api-client";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";
import type { User as AuthUser } from "@/lib/admin-types";

type AuthValues = { email: string; password: string; name?: string };

const perks = [
  { icon: Truck, label: "Gratis ongkir min. Rp150.000" },
  { icon: Sparkles, label: "Poin reward setiap belanja" },
  { icon: ShieldCheck, label: "Transaksi aman & terjamin" },
];

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthValues>();

  const isLogin = mode === "login";

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Shared post-auth flow: persist session, merge guest cart/wishlist, redirect.
  // A customer landing here from a guarded link is sent back afterwards; never
  // bounce a customer into the admin area.
  const finishAuth = async (result: { token: string; user: AuthUser }) => {
    setSession(result.token, result.user);
    await Promise.all([
      useCartStore.getState().syncOnLogin(),
      useWishlistStore.getState().syncOnLogin(),
    ]);
    const nextParam =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("next")
        : null;
    const redirectTo =
      nextParam && nextParam.startsWith("/") && !nextParam.startsWith("/admin") ? nextParam : "/";
    router.push(redirectTo);
    router.refresh();
  };

  const onSubmit = async (values: AuthValues) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const result = isLogin
        ? await loginRequest({ email: values.email, password: values.password })
        : await registerRequest({
            name: values.name ?? "",
            email: values.email,
            password: values.password,
          });
      await finishAuth(result);
    } catch (error) {
      setServerError(
        error instanceof ApiError ? error.message : "Terjadi kesalahan. Silakan coba lagi.",
      );
      setSubmitting(false);
    }
  };

  const handleGoogle = async (idToken: string) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const result = await googleLogin(idToken);
      await finishAuth(result);
    } catch (error) {
      setServerError(
        error instanceof ApiError ? error.message : "Gagal masuk dengan Google.",
      );
      setSubmitting(false);
    }
  };

  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.55, ease: premiumEase },
      };

  return (
    <main className="container-page py-8 md:py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[28px] border border-[#EEE7E2] bg-white soft-shadow lg:grid-cols-2">
        {/* Editorial panel */}
        <aside className="relative hidden min-h-[620px] lg:block">
          <Image
            src="/images/category-decorative-person.png"
            alt="Model Veloura Beauty"
            fill
            sizes="(max-width: 1024px) 0px, 40vw"
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#231A18]/85 via-[#231A18]/25 to-[#231A18]/35" />
          <div className="absolute inset-0 flex flex-col justify-between p-10 text-white">
            <Link href="/" className="font-serif-display text-3xl tracking-tight">
              veloura<span className="ml-1 align-top text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70">Beauty</span>
            </Link>
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#FFD8E0]">Veloura Member</p>
              <h2 className="font-serif-display text-4xl leading-tight">
                Kecantikan yang tumbuh bersama rutinitasmu.
              </h2>
              <ul className="mt-7 space-y-3">
                {perks.map((perk) => (
                  <li key={perk.label} className="flex items-center gap-3 text-sm text-white/90">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/25 bg-white/10 backdrop-blur-sm">
                      <perk.icon size={16} />
                    </span>
                    {perk.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Form panel */}
        <motion.div {...motionProps} className="flex flex-col justify-center p-7 sm:p-12">
          <div className="mx-auto w-full max-w-sm">
            {/* Top bar: back to store + mobile logo */}
            <div className="mb-8 flex items-center justify-between">
              <Link
                href="/"
                className="focus-ring -ml-1.5 inline-flex items-center gap-1.5 rounded-full py-1.5 pl-1.5 pr-3 text-sm font-medium text-[#737373] transition hover:bg-[#F7F1ED] hover:text-[#A9445A]"
              >
                <ArrowLeft size={16} />
                Kembali ke toko
              </Link>
              <Link
                href="/"
                aria-label="Veloura Beauty - beranda"
                className="font-serif-display text-2xl tracking-tight text-[#231A18] lg:hidden"
              >
                veloura
                <span className="ml-1 align-top text-[9px] font-semibold uppercase tracking-[0.3em] text-[#C95F72]">
                  Beauty
                </span>
              </Link>
            </div>

            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-[#C95F72]">
              {isLogin ? "Selamat datang kembali" : "Bergabung dengan Veloura"}
            </p>
            <h1 className="font-serif-display text-4xl leading-none sm:text-5xl">
              {isLogin ? "Masuk ke akunmu" : "Buat akun baru"}
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#737373]">
              {isLogin
                ? "Lanjutkan belanja, pantau pesanan, dan simpan produk favoritmu."
                : "Daftar gratis untuk pengalaman belanja yang lebih personal."}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
              {serverError && (
                <p
                  role="alert"
                  className="rounded-xl border border-[#E7B2BD] bg-[#FBEEF1] px-3.5 py-2.5 text-sm text-[#A9445A]"
                >
                  {serverError}
                </p>
              )}
              {!isLogin && (
                <Field
                  label="Nama Lengkap"
                  icon={<User size={17} />}
                  error={errors.name?.message}
                  input={
                    <input
                      type="text"
                      autoComplete="name"
                      placeholder="Nama kamu"
                      {...register("name", { required: "Nama wajib diisi" })}
                    />
                  }
                />
              )}

              <Field
                label="Email"
                icon={<Mail size={17} />}
                error={errors.email?.message}
                input={
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="kamu@email.com"
                    {...register("email", {
                      required: "Email wajib diisi",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Format email tidak valid" },
                    })}
                  />
                }
              />

              <Field
                label="Password"
                icon={<Lock size={17} />}
                error={errors.password?.message}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    className="focus-ring grid h-7 w-7 place-items-center rounded-md text-[#9B918A] transition hover:text-[#A9445A]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                input={
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Password wajib diisi",
                      minLength: { value: 6, message: "Minimal 6 karakter" },
                    })}
                  />
                }
              />

              {isLogin ? (
                <div className="flex items-center justify-between pt-1 text-sm">
                  <label className="inline-flex cursor-pointer items-center gap-2 text-[#737373]">
                    <input type="checkbox" className="h-4 w-4 accent-[#C95F72]" /> Ingat saya
                  </label>
                  <Link href="/forgot-password" className="font-semibold text-[#A9445A] hover:underline">
                    Lupa password?
                  </Link>
                </div>
              ) : (
                <p className="pt-1 text-xs leading-5 text-[#9B918A]">
                  Dengan mendaftar, kamu menyetujui{" "}
                  <Link href="/terms" className="font-semibold text-[#A9445A] hover:underline">Syarat & Ketentuan</Link> dan{" "}
                  <Link href="/privacy" className="font-semibold text-[#A9445A] hover:underline">Kebijakan Privasi</Link>.
                </p>
              )}

              <Button type="submit" className="mt-2 w-full" disabled={submitting}>
                {submitting
                  ? isLogin
                    ? "Memproses…"
                    : "Membuat akun…"
                  : isLogin
                    ? "Masuk"
                    : "Buat Akun"}
              </Button>
            </form>

            <div className="my-7 flex items-center gap-4 text-xs uppercase tracking-[0.18em] text-[#B8AFA9]">
              <span className="h-px flex-1 bg-[#EEE7E2]" /> atau <span className="h-px flex-1 bg-[#EEE7E2]" />
            </div>

            {googleClientId ? (
              <div className="mb-6">
                <GoogleSignInButton clientId={googleClientId} onCredential={handleGoogle} />
              </div>
            ) : null}

            <p className="text-center text-sm text-[#737373]">
              {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
              <Link
                href={isLogin ? "/register" : "/login"}
                className="font-bold text-[#A9445A] hover:underline"
              >
                {isLogin ? "Daftar sekarang" : "Masuk di sini"}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function Field({
  label,
  icon,
  input,
  trailing,
  error,
}: {
  label: string;
  icon: React.ReactNode;
  input: React.ReactElement<{ className?: string }>;
  trailing?: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[#3f3a37]">{label}</span>
      {/* input wrapped in a div so the global `label > input` rule doesn't override our styles */}
      <div
        className={`flex items-center gap-2.5 rounded-xl border bg-white px-3.5 transition focus-within:ring-2 focus-within:ring-[#C95F72]/25 ${
          error ? "border-[#D9647A]" : "border-[#E4DBD5] focus-within:border-[#C95F72]"
        }`}
      >
        <span className="text-[#B8AFA9]">{icon}</span>
        {cloneElement(input, {
          className:
            "h-12 w-full border-0 bg-transparent text-sm text-[#262626] outline-none placeholder:text-[#B8AFA9]",
        })}
        {trailing}
      </div>
      {error ? <span className="mt-1 block text-xs text-[#C0445E]">{error}</span> : null}
    </label>
  );
}
