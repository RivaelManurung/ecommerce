import {
  LayoutDashboard,
  BarChart3,
  Tags,
  Package,
  Boxes,
  ClipboardList,
  Ticket,
  Star,
  Users,
  ShieldCheck,
  Inbox,
  Settings,
  ScrollText,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  superAdminOnly?: boolean;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Inventory", href: "/admin/inventory", icon: Boxes },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Inquiries", href: "/admin/inquiries", icon: Inbox },
  { label: "Admin Users", href: "/admin/admin-users", icon: ShieldCheck, superAdminOnly: true },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
];
