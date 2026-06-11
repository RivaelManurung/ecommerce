"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSettings, updateSettings } from "@/features/settings/api";
import { settingSchema, type SettingInput, type SettingValues } from "@/lib/validations";
import { ApiError } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth";
import { PageHeader } from "@/components/admin/page-header";
import { ErrorState } from "@/components/admin/data-state";
import { toast } from "@/components/admin/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
  const role = useAuthStore((s) => s.user?.role);
  const canEdit = role === "super_admin";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm<SettingInput, unknown, SettingValues>({ resolver: zodResolver(settingSchema) });

  function load() {
    setLoading(true);
    setError(null);
    getSettings()
      .then((s) =>
        reset({
          companyName: s.companyName,
          tagline: s.tagline,
          email: s.email,
          phone: s.phone,
          whatsapp: s.whatsapp,
          address: s.address,
          logoUrl: s.logoUrl,
          socials: s.socials ?? { instagram: "", facebook: "", tiktok: "" },
        }),
      )
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load settings"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

  async function onSubmit(values: SettingValues) {
    try {
      await updateSettings(values);
      toast.success("Settings saved");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.details) {
          for (const [field, message] of Object.entries(err.details)) {
            setFieldError(field as keyof SettingValues, { message });
          }
        }
        toast.error(err.message);
      } else {
        toast.error("Unexpected error");
      }
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Company profile shown across the storefront." />

      {!canEdit && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Only a Super Admin can change company settings. You have read-only access.
        </div>
      )}

      {loading ? (
        <Skeleton className="h-96 w-full" />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <Card>
            <CardHeader>
              <CardTitle>Company</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="companyName">Company name</Label>
                <Input id="companyName" disabled={!canEdit} {...register("companyName")} />
                {errors.companyName && (
                  <p className="text-xs text-red-600">{errors.companyName.message}</p>
                )}
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" disabled={!canEdit} {...register("tagline")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" disabled={!canEdit} {...register("email")} />
                {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" disabled={!canEdit} {...register("phone")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input id="whatsapp" disabled={!canEdit} {...register("whatsapp")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input id="logoUrl" disabled={!canEdit} {...register("logoUrl")} />
                {errors.logoUrl && <p className="text-xs text-red-600">{errors.logoUrl.message}</p>}
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" rows={2} disabled={!canEdit} {...register("address")} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social profiles</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="instagram">Instagram</Label>
                <Input id="instagram" disabled={!canEdit} {...register("socials.instagram")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="facebook">Facebook</Label>
                <Input id="facebook" disabled={!canEdit} {...register("socials.facebook")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tiktok">TikTok</Label>
                <Input id="tiktok" disabled={!canEdit} {...register("socials.tiktok")} />
              </div>
            </CardContent>
          </Card>

          {canEdit && (
            <div className="flex justify-end">
              <Button type="submit" variant="default" disabled={isSubmitting}>
                {isSubmitting && <Spinner size={14} />}
                Save settings
              </Button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
