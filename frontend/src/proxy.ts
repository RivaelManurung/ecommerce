// Next.js 16 middleware replacement (`middleware.ts` is deprecated → `proxy.ts`).
// Guards the admin area: requests without a session cookie, or with a non-admin
// (customer) session, are redirected to the admin login page. The backend still
// enforces token validity and role on every API call; this only blocks
// navigation so a logged-in customer can't browse the admin shell.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_COOKIE = "ek_token";
const ADMIN_LOGIN = "/admin/login";
const ADMIN_ROLES = new Set(["admin", "super_admin"]);

// roleFromToken reads the role claim out of the unverified JWT payload. The
// signature is NOT checked here (that's the backend's job on each API call) —
// this is only a navigation hint, so an unreadable token is treated as no role.
function roleFromToken(token: string): string | null {
  const body = token.split(".")[0];
  if (!body) return null;
  try {
    const base64 = body.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(body.length / 4) * 4, "=");
    const json = atob(base64);
    const claims = JSON.parse(json) as { role?: string };
    return typeof claims.role === "string" ? claims.role : null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The admin login page itself must stay reachable without a session,
  // otherwise the redirect below would loop.
  if (pathname === ADMIN_LOGIN) return NextResponse.next();

  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const role = token ? roleFromToken(token) : null;

  if (!token || !role || !ADMIN_ROLES.has(role)) {
    const url = new URL(ADMIN_LOGIN, request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
