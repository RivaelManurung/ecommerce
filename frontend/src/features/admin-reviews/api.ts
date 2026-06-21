import { api } from "@/lib/api-client";

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface Review {
  id: string;
  productId: string;
  userId: string;
  authorName: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

export type ReviewListParams = { page?: number; limit?: number; status?: string };

export function listReviews(params: ReviewListParams = {}) {
  return api.get<Review[]>("/admin/reviews", { query: { ...params } });
}

export async function moderateReview(id: string, status: ReviewStatus): Promise<Review> {
  const { data } = await api.patch<Review>(`/admin/reviews/${id}/status`, { status });
  return data;
}

export async function deleteReview(id: string): Promise<void> {
  await api.delete(`/admin/reviews/${id}`);
}
