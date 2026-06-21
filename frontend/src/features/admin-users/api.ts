import { api } from "@/lib/api-client";
import type { User } from "@/lib/admin-types";

export type AdminUserListParams = { page?: number; limit?: number; search?: string };

export interface CreateAdminInput {
  name: string;
  email: string;
  password: string;
  role: "admin" | "super_admin";
}

export interface UpdateAdminInput {
  name: string;
  role: "admin" | "super_admin";
  active: boolean;
}

export function listAdminUsers(params: AdminUserListParams = {}) {
  return api.get<User[]>("/admin/admin-users", { query: { ...params } });
}

export async function getAdminUser(id: string): Promise<User> {
  const { data } = await api.get<User>(`/admin/admin-users/${id}`);
  return data;
}

export async function createAdminUser(input: CreateAdminInput): Promise<User> {
  const { data } = await api.post<User>("/admin/admin-users", input);
  return data;
}

export async function updateAdminUser(id: string, input: UpdateAdminInput): Promise<User> {
  const { data } = await api.patch<User>(`/admin/admin-users/${id}`, input);
  return data;
}
