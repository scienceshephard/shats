import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, HeartIcon, Logo, PillIcon, SirenIcon, StethoscopeIcon } from "./ui";

/* -------------------------------------------------------------------------- */
/* Patient shell                                                               */
/* -------------------------------------------------------------------------- */

/**
 * The patient top bar. There is deliberately no bottom tab bar: that is a
 * native-mobile OS convention, and four equal tabs would flatten four unequal
 * destinations (Home is a hub, Medicines and Health are references, Profile is
 * settings). Navigation happens from the hub and from the block at the foot of
 * each page instead.
 */
export function PatientTop({ language = "Igbo" }: { language?: string }) {
  return (
    <header className="flex h-[68px] items-center justify-between border-b border-line bg-surface px-6">
      <Link href="/home" className="flex items-center gap-3">
        <Logo height={30} />
      </Link>
      <div className="flex items-center gap-3">
        <span className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft">
          {language}
        </span>
        <Link
          href="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-pine text-sm font-bold text-white"
        >
          E
        </Link>
      </div>
    </header>
  );
}

interface Destination {
  href: string;
  title: string;
  sub: string;
  icon: ReactNode;
}

const destinations: Destination[] = [
  { href: "/medicines", title: "My medicines", sub: "What to take, and when", icon: <PillIcon /> },
  { href: "/health", title: "My health", sub: "Visits, results and papers", icon: <HeartIcon /> },
  { href: "/learn", title: "Learn about health", sub: "Short answers, read aloud", icon: <StethoscopeIcon /> },
];

/**
 * Closes every patient page. One promoted destination, then the rest — the
 * hierarchy the tab bar could not express.
 */
export function GoNext({ exclude }: { exclude?: string }) {
  const rest = destinations.filter((d) => d.href !== exclude);
  return (
    <section className="mt-14 border-t border-line pt-10">
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted">
        Where do you want to go next?
      </p>

      <Link
        href="/symptoms"
        className="mt-5 flex items-center justify-between rounded-[14px] bg-pine p-6 text-white"
      >
        <span>
          <span className="block font-display text-[26px] font-semibold">See a doctor</span>
          <span className="mt-1 block text-sm text-white/75">
            Talk by video, voice or writing. Most people wait 14 minutes.
          </span>
        </span>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
          <ArrowRight />
        </span>
      </Link>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {rest.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            className="rounded-[14px] border border-line bg-surface p-5 transition-colors hover:border-line-strong"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-pine-wash text-pine">
              {d.icon}
            </span>
            <span className="mt-3 block text-[17px] font-semibold text-ink">{d.title}</span>
            <span className="mt-1 block text-sm text-muted">{d.sub}</span>
          </Link>
        ))}
      </div>

      <Link
        href="/emergency"
        className="mt-3 flex items-center justify-between rounded-[14px] border border-alert bg-alert-wash p-5"
      >
        <span>
          <span className="block text-[17px] font-semibold text-alert">
            Emergency — I need help now
          </span>
          <span className="mt-1 block text-sm text-ink-soft">
            Free, always. A health worker comes to you.
          </span>
        </span>
        <SirenIcon />
      </Link>
    </section>
  );
}

/** Wraps patient page content in the single centred column the flow uses. */
export function PatientPage({
  children,
  goNextExclude,
  showGoNext = true,
}: {
  children: ReactNode;
  goNextExclude?: string;
  showGoNext?: boolean;
}) {
  return (
    <div className="min-h-screen bg-paper">
      <PatientTop />
      <main className="mx-auto w-full max-w-[720px] px-6 py-10">
        {children}
        {showGoNext && <GoNext exclude={goNextExclude} />}
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Professional shell (doctor + CHW)                                           */
/* -------------------------------------------------------------------------- */

export function ProTop({
  links,
  right,
  badge,
}: {
  links: { href: string; label: string; active?: boolean }[];
  right?: ReactNode;
  badge?: string;
}) {
  return (
    <header className="flex h-[64px] items-center justify-between border-b border-line bg-surface px-7">
      <div className="flex items-center gap-7">
        <div className="flex items-center gap-3">
          <Logo height={32} />
          {badge && (
            <span className="rounded-full bg-clay-wash px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-clay">
              {badge}
            </span>
          )}
        </div>
        <nav className="flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                l.active
                  ? "text-sm font-semibold text-ink"
                  : "text-sm text-ink-soft hover:text-ink"
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3">{right}</div>
    </header>
  );
}
