import { api } from "@/lib/api-client";
import type { Inquiry, InquiryStatus } from "@/lib/admin-types";

export type InquiryListParams = {
  page?: number;
  limit?: number;
  status?: string;
  order?: string;
};

export function listInquiries(params: InquiryListParams = {}) {
  return api.get<Inquiry[]>("/admin/inquiries", { query: { ...params } });
}

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  const { data } = await api.patch<Inquiry>(`/admin/inquiries/${id}/status`, { status });
  return data;
}
