// Next.js 16 middleware replacement (`middleware.ts` is deprecated → `proxy.ts`).
// Guards the admin area: requests without a session cookie are redirected to
// the admin login page. Token validity itself is enforced by the backend on
// every API call; this only blocks unauthenticated navigation.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_COOKIE = "ek_token";
const ADMIN_LOGIN = "/admin/login";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The admin login page itself must stay reachable without a session,
  // otherwise the redirect below would loop.
  if (pathname === ADMIN_LOGIN) return NextResponse.next();

  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) {
    const url = new URL(ADMIN_LOGIN, request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
