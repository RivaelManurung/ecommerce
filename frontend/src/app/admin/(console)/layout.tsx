import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { Toaster } from "@/components/admin/toast";

export const metadata: Metadata = {
  title: "Admin Console | E-Katalog",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminShell>{children}</AdminShell>
      <Toaster />
    </>
  );
}
