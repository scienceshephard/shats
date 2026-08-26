import { NextResponse, type NextRequest } from "next/server";
import { ROLE_HOME, SESSION_COOKIE, decodeSession, type SessionRole } from "@/lib/session";

/**
 * The auth boundary. Runs before a protected page renders, so a signed-out
 * visitor never sees a flash of someone else's schedule.
 *
 * Anything not listed here is public: the landing page, sign-up, and the health
 * library, which is deliberately readable without an account.
 */
const GUARDED: { prefix: string; role: SessionRole }[] = [
  { prefix: "/doctor", role: "DOCTOR" },
  { prefix: "/chw", role: "CHW" },
];

const PATIENT_ONLY = [
  "/home",
  "/symptoms",
  "/doctors",
  "/time",
  "/pay",
  "/booked",
  "/consultation",
  "/medicines",
  "/health",
  "/profile",
  "/emergency",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = decodeSession(request.cookies.get(SESSION_COOKIE)?.value);

  const guard = GUARDED.find((g) => pathname === g.prefix || pathname.startsWith(g.prefix + "/"));
  const needsPatient = PATIENT_ONLY.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (!guard && !needsPatient) return NextResponse.next();

  const wanted: SessionRole = guard ? guard.role : "PATIENT";

  if (!session) {
    // Remember where they were headed so the entry point can return them.
    const url = new URL("/welcome", request.url);
    url.searchParams.set("next", pathname);
    url.searchParams.set("as", wanted);
    return NextResponse.redirect(url);
  }

  if (session.role !== wanted) {
    // Signed in, wrong role — send them to their own home rather than a wall.
    return NextResponse.redirect(new URL(ROLE_HOME[session.role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Everything except Next internals and the icon files.
  matcher: ["/((?!_next/|favicon.ico|icon.png|apple-icon.png|img/|brand/).*)"],
};
