// Shared API types mirroring the Go backend contract (docs/workflow/02-backend-contract.md).

export type Role = "admin" | "super_admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CategoryStatus = "active" | "inactive";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: CategoryStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type ProductStatus = "draft" | "published" | "archived";

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  status: ProductStatus;
  basePrice: number;
  currency: string;
  images: ProductImage[];
  variants: ProductVariant[];
  category?: CategorySummary | null;
  createdAt: string;
  updatedAt: string;
}

export type InquiryStatus = "new" | "contacted" | "closed";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  productId: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Setting {
  id: string;
  companyName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  logoUrl: string;
  socials: { instagram: string; facebook: string; tiktok: string };
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  entity: string;
  entityId: string;
  summary: string;
  createdAt: string;
}

export interface StatusCounts {
  draft: number;
  published: number;
  archived: number;
  total: number;
}

export interface DashboardStats {
  products: StatusCounts;
  categories: number;
  inquiriesNew: number;
  recentInquiries: Inquiry[];
  recentAudit: AuditLog[];
}

export interface PaginationMeta {
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}
