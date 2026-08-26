import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, decodeSession } from "@/lib/session";

/**
 * Hands the client the token from the httpOnly session cookie.
 *
 * The alternative — reading the cookie in the root layout — would make every
 * page dynamic and cost the whole app its static generation, for a value that
 * is only needed once the user actually triggers a request.
 */
export async function GET() {
  const session = decodeSession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ signedIn: false }, { status: 200 });
  return NextResponse.json({
    signedIn: true,
    role: session.role,
    name: session.name,
    token: session.token,
  });
}
