"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Tags,
  Package,
  Boxes,
  ClipboardList,
  Users,
  Ticket,
  Star,
  Inbox,
  ShieldCheck,
  Settings,
  ScrollText,
  HelpCircle,
  Search,
  LogOut,
  Menu,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/lib/auth";
import { me, logout } from "@/features/auth/api";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const navMain = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Analytics", href: "/admin/reports", icon: BarChart3 },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Inventory", href: "/admin/inventory", icon: Boxes },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
  { label: "Team / Customers", href: "/admin/customers", icon: Users },
];

const navDocuments = [
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Inquiries", href: "/admin/inquiries", icon: Inbox },
];

const navBottom = [
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Admin Users", href: "/admin/admin-users", icon: ShieldCheck, superAdminOnly: true },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, hydrated, hydrate, setUser, clear } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  async function handleLogout() {
    try { await logout(); } catch { /* ignore */ }
    clear();
    router.replace("/admin/login");
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-gray-500">
        <Spinner size={20} />
        <span className="ml-2 text-sm">Loading…</span>
      </div>
    );
  }

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "AD";

  function NavItem({ item }: { item: { label: string; href: string; icon: React.ElementType } }) {
    const active = isActive(pathname, item.href);
    const Icon = item.icon;
    return (
      <Link
        href={item.href}
        className={cn(
          "group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
          active
            ? "bg-gray-100 text-gray-900 font-medium"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-normal",
        )}
      >
        <Icon
          size={14}
          className={cn(
            "shrink-0 transition-colors",
            active ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600",
          )}
        />
        <span>{item.label}</span>
      </Link>
    );
  }

  const Sidebar = () => (
    <aside className="flex h-full w-[220px] flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 px-4 border-b border-gray-200">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-900">
          <span className="text-[9px] font-bold text-white">EK</span>
        </div>
        <span className="text-sm font-semibold text-gray-900">E-Katalog</span>
      </div>

      {/* Quick Create */}
      <div className="px-3 pt-3 pb-1">
        <Link href="/admin/products/create">
          <button className="flex w-full items-center gap-2 rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-800">
            <Pencil size={12} />
            Quick Create
          </button>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {navMain.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}

        {/* Documents section */}
        <div className="pt-4 pb-1 px-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Documents</p>
        </div>
        {navDocuments.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}

        {/* More */}
        <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
          <MoreHorizontal size={14} />
          More
        </button>
      </nav>

      {/* Bottom Nav */}
      <div className="border-t border-gray-200 px-2 py-2 space-y-0.5">
        {navBottom
          .filter((item) => !("superAdminOnly" in item && item.superAdminOnly) || user?.role === "super_admin")
          .map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
          <HelpCircle size={14} className="text-gray-400 shrink-0" />
          Get Help
        </button>
        <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
          <Search size={14} className="text-gray-400 shrink-0" />
          Search
        </button>
      </div>

      {/* User Card */}
      <div className="border-t border-gray-200 px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gray-200 text-[11px] font-semibold text-gray-700">
              {initials}
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-xs font-semibold text-gray-900">{user?.name ?? "Admin"}</p>
              <p className="truncate text-[10px] text-gray-400">{user?.email ?? ""}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            title="Sign out"
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="admin-root flex min-h-screen bg-white">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar />
          </div>
        </>
      )}

      {/* Main Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar – only visible on mobile */}
        <div className="flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1.5 text-gray-600 hover:bg-gray-100"
          >
            <Menu size={18} />
          </button>
          <span className="text-sm font-semibold text-gray-900">E-Katalog Admin</span>
        </div>

        {/* Page Content */}
        <main className="flex-1 bg-white">
          <div className="px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
