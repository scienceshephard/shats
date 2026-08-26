"use client";

import { useEffect } from "react";
import { setTokenProvider } from "@/lib/api";

/**
 * Registers the bearer token with the API client once, at start-up.
 *
 * `lib/api.ts` deliberately knows nothing about where the token comes from —
 * it just asks its provider. This is the one place that answers, which keeps
 * the contract file free of session concerns.
 */
export function SessionBridge() {
  useEffect(() => {
    let token: string | null = null;
    setTokenProvider(() => token);

    const controller = new AbortController();
    fetch("/api/session", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => {
        if (s?.signedIn) token = s.token;
      })
      .catch(() => {
        // Signed out, or offline. Requests will fail their own way and the
        // screens show the error state; there is nothing to recover here.
      });

    return () => controller.abort();
  }, []);

  return null;
}
