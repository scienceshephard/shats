"use client";

import { useEffect, useState } from "react";

/**
 * The landing page's navigation on small screens.
 *
 * The four section links do not fit beside the logo and the call to action
 * below `md`, so above that width they are a plain row and below it they move
 * in here. Without this they were simply hidden, which left a phone with no way
 * to reach any section except by scrolling the whole page.
 *
 * The panel closes on Escape and on choosing a link — an anchor jump leaves the
 * menu covering the thing it just jumped to otherwise.
 */
export function MobileNav({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white"
      >
        <svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          aria-hidden
        >
          {open ? <path d="M5 5l14 14M19 5 5 19" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-30 border-y border-white/10 bg-[#04262C] px-6 py-3 shadow-lg">
          <ul>
            {links.map((l) => (
              <li key={l.href} className="border-b border-white/10 last:border-0">
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3.5 text-[15px] font-semibold text-[#CBDBDD]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
