"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Reveals its children once they scroll into view.
 *
 * The reveal is written straight to the node rather than held in React state:
 * a one-way visual transition is not something the rest of the tree needs to
 * re-render for, and setting state synchronously inside an effect triggers a
 * cascading render for no benefit. This also matches how ScrollFx, CoverVeil
 * and JourneyPanel already drive their own motion.
 *
 * IntersectionObserver rather than a scroll listener so the work happens off
 * the main thread, and it disconnects after firing because the transition only
 * ever runs once.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const show = () => {
      node.style.opacity = "1";
      node.style.transform = "none";
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        show();
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: "translateY(28px)",
        transition: `opacity .9s cubic-bezier(.22,1,.36,1) ${delay}ms, transform .9s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/** Counts up to a number when it scrolls into view. */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const render = (v: number) => {
      node.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`;
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      render(value);
      return;
    }

    let raf = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const duration = 1500;
      // rAF is paused in background tabs, so guarantee the final value lands
      // rather than leaving a zero on screen.
      const settle = setTimeout(() => render(value), duration + 700);
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        render(value * (1 - Math.pow(1 - p, 3)));
        if (p < 1) {
          raf = requestAnimationFrame(step);
          return;
        }
        clearTimeout(settle);
      };
      raf = requestAnimationFrame(step);
    });

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, decimals, prefix, suffix]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}
      {(0).toFixed(decimals)}
      {suffix}
    </span>
  );
}
