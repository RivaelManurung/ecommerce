import { api } from "@/lib/api-client";
import type { User } from "@/lib/admin-types";
import type { LoginValues } from "@/lib/validations";

export async function login(values: LoginValues) {
  const { data } = await api.post<{ token: string; user: User }>("/auth/login", values, {
    auth: false,
  });
  return data;
}

export async function me(token?: string) {
  const { data } = await api.get<{ user: User }>("/auth/me", { token });
  return data.user;
}

export async function logout() {
  await api.post<{ message: string }>("/auth/logout");
}
