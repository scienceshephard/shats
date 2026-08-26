"use client";

import { useEffect, useRef } from "react";

/**
 * Darkens its own parent as the parent's next sibling rides up over it.
 *
 * Drop it in as the last child of a pinned element. Being covered then reads as
 * depth — the pinned block sinking away under the incoming one — instead of the
 * page simply guillotining a static image.
 *
 * It does nothing below the `lg` breakpoint or under reduced motion, where the
 * pin is switched off and there is no covering to describe.
 */
export function CoverVeil() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const veil = ref.current;
    const pinned = veil?.parentElement;
    const cover = pinned?.nextElementSibling;
    if (!veil || !cover) return;

    const wide = window.matchMedia("(min-width: 1024px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Painted straight from the scroll event rather than batched into rAF: it
    // is one rect read followed by one style write, and rAF is paused in
    // background tabs and throttled under power saving, which strands the veil
    // part-faded until some later scroll happens to arrive.
    const paint = () => {
      const p = 1 - cover.getBoundingClientRect().top / window.innerHeight;
      veil.style.opacity = (Math.min(1, Math.max(0, p)) * 0.65).toFixed(3);
    };

    const sync = () => {
      window.removeEventListener("scroll", paint);
      window.removeEventListener("resize", paint);
      if (!wide.matches || still.matches) {
        veil.style.opacity = "0";
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
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 hidden bg-[#02161A] lg:block"
      style={{ opacity: 0 }}
    />
  );
}
