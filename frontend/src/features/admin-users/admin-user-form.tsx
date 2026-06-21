"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createAdminUser, updateAdminUser } from "@/features/admin-users/api";
import type { User } from "@/lib/admin-types";
import { ApiError } from "@/lib/api-client";
import { toast } from "@/components/admin/toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type FormValues = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "super_admin";
  active: "true" | "false";
};

// Shared create/edit form. When `existing` is passed it edits (no email/password
// fields); otherwise it creates a new staff account.
export function AdminUserForm({ existing }: { existing?: User }) {
  const router = useRouter();
  const isEdit = Boolean(existing);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: existing?.name ?? "",
      email: existing?.email ?? "",
      password: "",
      role: (existing?.role as "admin" | "super_admin") ?? "admin",
      active: existing ? (existing.active ? "true" : "false") : "true",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setSubmitting(true);
    try {
      if (isEdit && existing) {
        await updateAdminUser(existing.id, {
          name: values.name,
          role: values.role,
          active: values.active === "true",
        });
        toast.success("Admin updated");
      } else {
        await createAdminUser({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
        });
        toast.success("Admin created");
      }
      router.push("/admin/admin-users");
      router.refresh();
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-5" noValidate>
        {serverError ? (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {serverError}
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name", { required: "Name is required", minLength: { value: 2, message: "Too short" } })} />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>

          {!isEdit ? (
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email", { required: "Email is required" })} />
              {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
            </div>
          ) : null}

          {!isEdit ? (
            <div className="space-y-1.5">
              <Label htmlFor="password">Temporary password</Label>
              <Input id="password" type="text" autoComplete="off" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })} />
              {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
            </div>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="role">Role</Label>
            <Select id="role" {...register("role")}>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </Select>
          </div>

          {isEdit ? (
            <div className="space-y-1.5">
              <Label htmlFor="active">Status</Label>
              <Select id="active" {...register("active")}>
                <option value="true">Active</option>
                <option value="false">Disabled</option>
              </Select>
            </div>
          ) : null}
        </div>

        <div className="flex justify-end gap-2 border-t border-zinc-100 pt-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/admin-users")} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="default" disabled={submitting}>
            {submitting ? "Saving…" : isEdit ? "Save changes" : "Create admin"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
