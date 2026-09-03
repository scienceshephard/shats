/**
 * Which mode the app is running in.
 *
 * `development` is for walking the design: every screen is reachable without
 * signing in, and every form uses the built-in sample data instead of calling a
 * back end that does not exist yet. `production` restores the role guards in
 * `proxy.ts` and sends form submissions to the API gateway.
 *
 * Set it in `.env.local`:
 *
 *     NEXT_PUBLIC_MODE=development
 *
 * Unset, it follows the build: `next dev` is development, a production build is
 * production. That way running the project needs no configuration at all, but a
 * deploy never falls open just because nobody set a variable.
 *
 * It must carry the `NEXT_PUBLIC_` prefix because `lib/submit.ts` reads it in
 * the browser, and Next only inlines prefixed variables into the client bundle.
 * The comparisons below are written against `process.env.NEXT_PUBLIC_MODE` in
 * full on purpose: the inlining is textual, so reading it through a local
 * variable would leave `undefined` in the client bundle.
 */

export type Mode = "development" | "production";

export const MODE: Mode =
  process.env.NEXT_PUBLIC_MODE === "production"
    ? "production"
    : process.env.NEXT_PUBLIC_MODE === "development"
      ? "development"
      : process.env.NODE_ENV === "production"
        ? "production"
        : "development";

/** Guards are off, forms are simulated, every page is reachable. */
export const IS_DEVELOPMENT = MODE === "development";

/** Guards are on and the API gateway is called, if one is configured. */
export const IS_PRODUCTION = MODE === "production";
