"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ErrorState } from "@/components/states";
import { Logo } from "@/components/ui";

/**
 * Route-level error boundary. `reset` re-runs the failed render, which is the
 * right retry for a transient network failure — the common case here.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // A real deployment sends this on; the digest is what ties a user's report
    // to the server log entry.
    console.error("[SHATS]", error.digest ?? "", error.message);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6">
      <div className="w-full max-w-[560px]">
        <Logo height={38} />
        <ErrorState onRetry={reset}>
          <Link
            href="/home"
            className="rounded-full border border-line-strong bg-surface px-6 py-3 text-[15px] font-semibold text-ink"
          >
            Go to my home
          </Link>
        </ErrorState>
      </div>
    </div>
  );
}
