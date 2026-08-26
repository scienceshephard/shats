import { NextResponse, type NextRequest } from "next/server";
import {
  DEMO_USERS,
  ROLE_HOME,
  SESSION_COOKIE,
  encodeSession,
  isRole,
  type SessionRole,
} from "@/lib/session";

/**
 * Establishes a session and sends the visitor on.
 *
 * A route handler rather than a page so the cookie is set before anything
 * renders — no flash of a redirect, and no client-side auth state to get out of
 * sync with what the proxy sees.
 *
 * When `identity-service` exists this is where its token lands, instead of the
 * fabricated one below.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ role: string }> },
) {
  const { role: raw } = await params;
  const role = raw.toUpperCase();
  if (!isRole(role)) return NextResponse.redirect(new URL("/", request.url));

  const typed = role as SessionRole;
  const next = request.nextUrl.searchParams.get("next");
  // Only same-site paths, so `next` cannot be used to bounce someone off-site.
  const destination = next?.startsWith("/") ? next : ROLE_HOME[typed];

  const response = NextResponse.redirect(new URL(destination, request.url));
  response.cookies.set({
    name: SESSION_COOKIE,
    value: encodeSession({
      role: typed,
      name: DEMO_USERS[typed].name,
      token: `demo.${typed.toLowerCase()}.not-a-real-token`,
    }),
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
