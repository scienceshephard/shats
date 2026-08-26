import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, PhoneIcon } from "./ui";

/**
 * The three states a screen has to have once its data comes over a network
 * instead of out of a file: still loading, nothing to show, and it went wrong.
 *
 * The copy matters more than the layout here. Someone on a 2G connection in a
 * village needs to be told what happened and what to do about it — never a
 * spinner with no explanation, and never the word "error".
 */

/* ---------------------------------------------------------------- loading -- */

/** A grey block standing in for content that has not arrived yet. */
export function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span className={`block animate-pulse rounded-[8px] bg-line ${className}`} style={style} />
  );
}

/** Rows of skeletons shaped like the list they are standing in for. */
export function SkeletonList({ rows = 3, height = 96 }: { rows?: number; height?: number }) {
  return (
    <div className="mt-6 space-y-3" aria-hidden>
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="w-full" style={{ height }} />
      ))}
    </div>
  );
}

/** Full-screen wait. Announced, so a screen reader does not sit in silence. */
export function PageLoading({ label = "Loading" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6"
    >
      <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-line-strong border-t-pine" />
      <p className="text-[15px] text-ink-soft">{label}…</p>
    </div>
  );
}

/* ------------------------------------------------------------------ empty -- */

/**
 * Nothing to show, which is usually not a failure — no doctors free today is a
 * real answer. So it always offers the next thing to try.
 */
export function Empty({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mt-6 rounded-[14px] border border-dashed border-line-strong bg-surface p-8 text-center">
      <p className="font-display text-[21px] font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-[420px] text-[15px] leading-relaxed text-ink-soft">{body}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-pine px-6 py-3 text-[15px] font-semibold text-white"
        >
          {action.label} <ArrowRight size={17} />
        </Link>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ error -- */

/**
 * Something broke. Says so plainly, offers the retry, and gives the way through
 * that does not need the internet at all — which for this product is the point.
 */
export function ErrorState({
  title = "We could not reach SHATS",
  body = "Your phone may have lost the network. Nothing you did is lost — try again in a moment.",
  onRetry,
  children,
}: {
  title?: string;
  body?: string;
  onRetry?: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="mt-6 rounded-[14px] border border-alert bg-alert-wash p-6">
      <p className="font-display text-[21px] font-semibold text-ink">{title}</p>
      <p className="mt-2 max-w-[480px] text-[15px] leading-relaxed text-ink-soft">{body}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-full bg-pine px-6 py-3 text-[15px] font-semibold text-white"
          >
            Try again
          </button>
        )}
        {children}
      </div>

      <p className="mt-5 flex items-center gap-2.5 border-t border-[#E9C9C4] pt-4 text-[14px] text-ink-soft">
        <PhoneIcon size={16} />
        No network at all? Dial <span className="font-semibold text-ink">*737#</span> — it works on
        any phone.
      </p>
    </div>
  );
}
