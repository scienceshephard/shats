"use client";

import { Children, useEffect, useRef, type ReactNode } from "react";

/**
 * Sections that overlay one another: each pins to the top of the viewport and
 * the next — later in the DOM, higher z-index, opaque — rides up and covers it.
 * The covering itself is pure CSS `sticky`; the script only sinks the panel
 * being covered so it reads as depth rather than as a clipped edge.
 *
 * Every child must fill the screen, or the one underneath shows through. The
 * last child cannot pin at all, because the container ends where it ends —
 * which is what lets the following sections scroll on normally.
 */
export function OverlayStack({ children }: { children: ReactNode }) {
  const items = Children.toArray(children);
  const cells = useRef<(HTMLDivElement | null)[]>([]);
  const veils = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    const clear = () => {
      for (const v of veils.current) if (v) v.style.opacity = "0";
    };

    const paint = () => {
      const vh = window.innerHeight;
      for (let i = 0; i < veils.current.length; i++) {
        const v = veils.current[i];
        const next = cells.current[i + 1];
        if (!v) continue;
        // How far the next panel has climbed over this one, 0 → 1.
        const p = next
          ? Math.min(1, Math.max(0, 1 - next.getBoundingClientRect().top / vh))
          : 0;
        v.style.opacity = (p * 0.6).toFixed(3);
      }
    };

    const sync = () => {
      window.removeEventListener("scroll", paint);
      window.removeEventListener("resize", paint);
      if (!wide.matches || still.matches) {
        clear();
        return;
      }
      window.addEventListener("scroll", paint, { passive: true });
      window.addEventListener("resize", paint);
      paint();
    };

    sync();
    wide.addEventListener("change", sync);
    still.addEventListener("change", sync);

    return () => {
      window.removeEventListener("scroll", paint);
      window.removeEventListener("resize", paint);
      wide.removeEventListener("change", sync);
      still.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div className="relative">
      {items.map((child, i) => (
        <div
          key={i}
          ref={(el) => {
            cells.current[i] = el;
          }}
          className="lg:sticky lg:top-0"
          style={{ zIndex: i + 1 }}
        >
          <div className="relative">
            {child}
            <div
              ref={(el) => {
                veils.current[i] = el;
              }}
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden bg-[#02161A] lg:block"
              style={{ opacity: 0 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
