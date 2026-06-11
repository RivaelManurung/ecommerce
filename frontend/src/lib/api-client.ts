// Centralized API client. This is the ONLY module that talks to the backend.
// It attaches the bearer token, unwraps the standard envelope, and throws a
// typed ApiError on failure.

import type { PaginationMeta } from "./admin-types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

export const TOKEN_COOKIE = "ek_token";

export class ApiError extends Error {
  status: number;
  code: string;
  details?: Record<string, string>;

  constructor(status: number, code: string, message: string, details?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface SuccessEnvelope<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}
interface ErrorEnvelope {
  success: false;
  error: { code: string; message: string; details?: Record<string, string> };
}

export interface Result<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** Attach the bearer token (default true). Public endpoints pass false. */
  auth?: boolean;
  /** Optional explicit token (used on the server where cookies aren't ambient). */
  token?: string;
  query?: Record<string, unknown>;
  signal?: AbortSignal;
}

function readTokenFromCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

export async function request<T>(path: string, opts: RequestOptions = {}): Promise<Result<T>> {
  const { method = "GET", body, auth = true, token, query, signal } = opts;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const bearer = token ?? (auth ? readTokenFromCookie() : undefined);
  if (auth && bearer) headers["Authorization"] = `Bearer ${bearer}`;

  let res: Response;
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      signal,
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Cannot reach the server. Is the backend running?");
  }

  let payload: SuccessEnvelope<T> | ErrorEnvelope | null = null;
  try {
    payload = (await res.json()) as SuccessEnvelope<T> | ErrorEnvelope;
  } catch {
    payload = null;
  }

  if (!res.ok || !payload || payload.success === false) {
    const err = payload && payload.success === false ? payload.error : undefined;
    throw new ApiError(
      res.status,
      err?.code ?? "INTERNAL",
      err?.message ?? "Something went wrong",
      err?.details,
    );
  }

  return { data: payload.data, meta: payload.meta };
}

export const api = {
  get: <T>(path: string, opts?: RequestOptions) => request<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "POST", body }),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "PATCH", body }),
  delete: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "DELETE" }),
};
