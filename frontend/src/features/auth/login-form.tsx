"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingBag } from "lucide-react";
import { loginSchema, type LoginValues } from "@/lib/validations";
import { login } from "@/features/auth/api";
import { useAuthStore } from "@/lib/auth";
import { ApiError } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

export function LoginForm() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    setFormError(null);
    try {
      const { token, user } = await login(values);
      setSession(token, user);
      const next = new URLSearchParams(window.location.search).get("next");
      router.replace(next && next.startsWith("/admin") ? next : "/admin");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.details) {
          for (const [field, message] of Object.entries(err.details)) {
            setError(field as keyof LoginValues, { message });
          }
        }
        setFormError(err.message);
      } else {
        setFormError("Unexpected error. Please try again.");
      }
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-zinc-900 text-zinc-50">
            <ShoppingBag size={18} />
          </span>
          <h1 className="text-lg font-semibold text-zinc-900">Admin sign in</h1>
          <p className="text-sm text-zinc-500">Manage the E-Katalog catalog.</p>
        </div>

        {formError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" {...register("email")} />
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
          </div>
          <Button type="submit" variant="default" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Spinner size={14} />}
            Sign in
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-zinc-400">
          Seed admin: admin@ekatalog.test / admin12345
        </p>
      </div>
    </div>
  );
}
