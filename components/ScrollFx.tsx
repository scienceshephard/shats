"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Fraction of the way from `a` to `b`, clamped to 0..1. */
export const ramp = (v: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (v - a) / (b - a)));

/**
 * Applies a scroll-position-driven effect to its children.
 *
 * Everything is a pure function of where the element sits in the viewport, so
 * the effect runs backwards when you scroll up and nothing latches on first
 * sight — the difference between this and the one-shot `Reveal`.
 *
 *   fade        opacity in and back out. For the long tail of the page.
 *   blur-grow   unblurs and grows into place, then back out. Suits a section
 *               that is only type and icons, where a slide would look busy.
 *
 * Off below `lg` and under reduced motion, where the page is a plain stack.
 */
export function ScrollFx({
  mode,
  children,
  className = "",
}: {
  mode: "fade" | "blur-grow";
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const wide = window.matchMedia("(min-width: 1024px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    const clear = () => {
      el.style.opacity = "";
      el.style.filter = "";
      el.style.transform = "";
    };

    const paint = () => {
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      // Rises to 1 as the element arrives, falls back to 0 as it leaves.
      const p = Math.min(
        ramp((vh - r.top) / vh, 0.12, 0.5),
        ramp(r.bottom / vh, 0, 0.4),
      );

      if (mode === "blur-grow") {
        // Kept off zero opacity: type that vanishes entirely reads as a bug
        // rather than as depth.
        el.style.opacity = (0.12 + p * 0.88).toFixed(3);
        el.style.filter = `blur(${((1 - p) * 9).toFixed(2)}px)`;
        el.style.transform = `scale(${(0.93 + p * 0.07).toFixed(4)})`;
      } else {
        el.style.opacity = p.toFixed(3);
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
  }, [mode]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
