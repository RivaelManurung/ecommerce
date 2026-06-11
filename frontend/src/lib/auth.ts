"use client";

// Auth state: a zustand store holding the current user + token, mirrored to a
// cookie so the `proxy.ts` middleware can guard /admin server-side.

import { create } from "zustand";
import { TOKEN_COOKIE } from "./api-client";
import type { User } from "./admin-types";

const TOKEN_MAX_AGE = 60 * 60 * 24; // 24h, matches backend default TTL

function writeCookie(token: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${TOKEN_MAX_AGE}; samesite=lax`;
}
function clearCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

interface AuthState {
  user: User | null;
  token: string | null;
  hydrated: boolean;
  setSession: (token: string, user: User) => void;
  setUser: (user: User | null) => void;
  hydrate: () => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  hydrated: false,
  setSession: (token, user) => {
    writeCookie(token);
    set({ token, user, hydrated: true });
  },
  setUser: (user) => set({ user }),
  hydrate: () => {
    if (typeof document === "undefined") return;
    const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
    const token = match ? decodeURIComponent(match[1]) : null;
    set({ token, hydrated: true });
  },
  clear: () => {
    clearCookie();
    set({ token: null, user: null });
  },
}));
