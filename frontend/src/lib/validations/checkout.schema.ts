import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(3, "Nama minimal 3 karakter"),
  phone: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, "Nomor HP Indonesia tidak valid"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
  province: z.string().min(1, "Provinsi wajib diisi"),
  city: z.string().min(1, "Kota wajib diisi"),
  district: z.string().min(1, "Kecamatan wajib diisi"),
  postalCode: z.string().regex(/^\d{5}$/, "Kode pos harus 5 digit"),
  shippingMethod: z.enum(["regular", "express", "same-day"]),
  paymentMethod: z.enum(["bank", "ewallet", "card"]),
  notes: z.string().max(250, "Catatan maksimal 250 karakter").optional(),
});
