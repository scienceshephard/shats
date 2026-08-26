import type { Role } from "./types";

/**
 * The session, kept in a cookie so `middleware.ts` can read it before a page
 * ever renders — localStorage is invisible to middleware, which is why the
 * boundary lives here.
 *
 * DEMO CAVEAT: the payload is base64 JSON with a fabricated token, and it is
 * not signed. That is fine for a design project with no server, and is exactly
 * what must change when `identity-service` exists: the cookie should then carry
 * a signed JWT issued by that service, and this file should verify rather than
 * mint. The cookie is already httpOnly, so the token is passed to the client
 * through the root layout instead of being read from `document.cookie`.
 */

export const SESSION_COOKIE = "shats_session";

export type SessionRole = Extract<Role, "PATIENT" | "DOCTOR" | "CHW">;

export type Session = {
  role: SessionRole;
  name: string;
  token: string;
};

/** Where each role belongs once signed in. */
export const ROLE_HOME: Record<SessionRole, string> = {
  PATIENT: "/home",
  DOCTOR: "/doctor",
  CHW: "/chw",
};

/** Demo identities, so the entry points have a name to greet. */
export const DEMO_USERS: Record<SessionRole, { name: string }> = {
  PATIENT: { name: "Emeka Obi" },
  DOCTOR: { name: "Dr. Chidi Okonkwo" },
  CHW: { name: "Blessing Uche" },
};

/**
 * base64url via the Web APIs rather than `Buffer`. Middleware runs on the Edge
 * runtime, where `Buffer` does not exist — using it there makes the middleware
 * throw and every guarded route silently fall open.
 */
function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): string {
  const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeSession(session: Session): string {
  return toBase64Url(JSON.stringify(session));
}

export function decodeSession(raw: string | undefined | null): Session | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(fromBase64Url(raw));
    if (parsed && parsed.role in ROLE_HOME && typeof parsed.token === "string") {
      return parsed as Session;
    }
    return null;
  } catch {
    // A malformed cookie is treated as no session rather than a crash.
    return null;
  }
}

export function isRole(value: string): value is SessionRole {
  return value in ROLE_HOME;
}
