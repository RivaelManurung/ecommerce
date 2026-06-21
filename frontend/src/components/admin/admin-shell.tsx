"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, LogOut, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/lib/auth";
import { me, logout } from "@/features/auth/api";
import { navItems } from "./nav";
import { Spinner } from "@/components/ui/spinner";

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, hydrated, hydrate, setUser, clear } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    me()
      .then((u) => {
        if (!cancelled) {
          setUser(u);
          setChecking(false);
        }
      })
      .catch(() => {
        clear();
        router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  useEffect(() => {
    const t = setTimeout(() => setOpen(false), 0);
    return () => clearTimeout(t);
  }, [pathname]);

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // ignore network errors on logout
    }
    clear();
    router.replace("/admin/login");
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-500">
        <Spinner size={20} />
        <span className="ml-2 text-sm">Loading workspace…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-zinc-200 bg-white transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-zinc-200 px-5">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-zinc-900 text-zinc-50">
            <ShoppingBag size={16} />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">E-Katalog</p>
            <p className="text-xs text-zinc-400">Admin Console</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {navItems
            .filter((item) => !item.superAdminOnly || user?.role === "super_admin")
            .map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-zinc-900 text-zinc-50"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-zinc-900/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button
            className="rounded-md p-2 text-zinc-600 hover:bg-zinc-100 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
            View storefront →
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-zinc-900">{user?.name ?? "Admin"}</p>
              <p className="text-xs capitalize text-zinc-400">
                {user?.role?.replace("_", " ") ?? ""}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 transition hover:bg-zinc-50"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
