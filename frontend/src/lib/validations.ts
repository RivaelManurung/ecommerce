// Zod schemas mirroring the backend validation rules (kept in sync with
// docs/workflow/02-backend-contract.md §Validation rules).

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  description: z.string().max(1000).optional().default(""),
  status: z.enum(["active", "inactive"]).default("active"),
  sortOrder: z.coerce.number().int().min(0, "Must be 0 or greater").default(0),
});
export type CategoryValues = z.infer<typeof categorySchema>;

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(140),
  categoryId: z.string().min(1, "Choose a category"),
  description: z.string().max(5000).optional().default(""),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  basePrice: z.coerce.number().int().min(0, "Price cannot be negative").default(0),
  currency: z.string().max(8).optional().default("IDR"),
});
export type ProductValues = z.infer<typeof productSchema>;

export const imageSchema = z.object({
  url: z.string().min(1, "Image URL is required").url("Enter a valid URL"),
  alt: z.string().max(140).optional().default(""),
  isPrimary: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
});
export type ImageValues = z.infer<typeof imageSchema>;

export const variantSchema = z.object({
  name: z.string().min(1, "Variant name is required").max(140),
  sku: z.string().max(60).optional().default(""),
  price: z.coerce.number().int().min(0, "Price cannot be negative").default(0),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative").default(0),
});
export type VariantValues = z.infer<typeof variantSchema>;

export const settingSchema = z.object({
  companyName: z.string().min(2, "Company name is required").max(120),
  tagline: z.string().max(200).optional().default(""),
  email: z.string().email("Enter a valid email").or(z.literal("")).optional(),
  phone: z.string().max(40).optional().default(""),
  whatsapp: z.string().max(40).optional().default(""),
  address: z.string().max(400).optional().default(""),
  logoUrl: z.string().url("Enter a valid URL").or(z.literal("")).optional(),
  socials: z
    .object({
      instagram: z.string().max(120).optional().default(""),
      facebook: z.string().max(120).optional().default(""),
      tiktok: z.string().max(120).optional().default(""),
    })
    .default({ instagram: "", facebook: "", tiktok: "" }),
});
export type SettingValues = z.infer<typeof settingSchema>;

export const inquirySchema = z.object({
  name: z.string().min(2, "Name is required").max(120),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z.string().max(40).optional().default(""),
  productId: z.string().max(40).optional().default(""),
  message: z.string().min(5, "Message must be at least 5 characters").max(2000),
});
export type InquiryValues = z.infer<typeof inquirySchema>;

// Input (pre-resolver) types — fields with `.default()`/coercion are optional on
// input but required on output, so forms type useForm<Input, unknown, Output>.
export type CategoryInput = z.input<typeof categorySchema>;
export type ProductInput = z.input<typeof productSchema>;
export type ImageInput = z.input<typeof imageSchema>;
export type VariantInput = z.input<typeof variantSchema>;
export type SettingInput = z.input<typeof settingSchema>;
export type InquiryInput = z.input<typeof inquirySchema>;
