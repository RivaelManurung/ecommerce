import { api } from "@/lib/api-client";
import type { User } from "@/lib/admin-types";
import type { LoginValues, RegisterValues } from "@/lib/validations";

export async function login(values: LoginValues) {
  const { data } = await api.post<{ token: string; user: User }>("/auth/login", values, {
    auth: false,
  });
  return data;
}

export async function register(values: RegisterValues) {
  const { data } = await api.post<{ token: string; user: User }>("/auth/register", values, {
    auth: false,
  });
  return data;
}

export async function googleLogin(idToken: string) {
  const { data } = await api.post<{ token: string; user: User }>("/auth/google", { idToken }, {
    auth: false,
  });
  return data;
}

export async function forgotPassword(email: string) {
  await api.post<{ message: string }>("/auth/forgot-password", { email }, { auth: false });
}

export async function resetPassword(token: string, password: string) {
  await api.post<{ message: string }>("/auth/reset-password", { token, password }, { auth: false });
}

export async function me(token?: string) {
  const { data } = await api.get<{ user: User }>("/auth/me", { token });
  return data.user;
}

export async function logout() {
  await api.post<{ message: string }>("/auth/logout");
}
