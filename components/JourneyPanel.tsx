"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Fraction of the way from `a` to `b`, clamped to 0..1. */
const ramp = (v: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (v - a) / (b - a)));

/**
 * One step of the journey: a panel that pins to the top of the viewport, holds
 * while you keep scrolling, then releases and clears out as the next arrives.
 * The pin is CSS — `sticky` inside a wrapper taller than the panel, where the
 * surplus height is the length of the hold.
 *
 * The contents are driven by scroll *position* rather than by a one-shot
 * trigger, which is the whole point: every state is a pure function of where
 * the wrapper sits, so the dissolve runs backwards when you scroll up and
 * nothing latches on first sight.
 *
 * The contents — number, heading and body — unblur and grow into place as one
 * block, then re-blur and shrink as the panel leaves. They scale from the left
 * edge so the text stays anchored to its column instead of sliding sideways.
 * The visual is a pure fade that starts and finishes later, letting the words
 * land before the card settles behind them.
 */
export function JourneyPanel({
  text,
  media,
  flip,
}: {
  text: ReactNode;
  media: ReactNode;
  flip: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const textEl = useRef<HTMLDivElement>(null);
  const mediaEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = wrap.current;
    const p = panel.current;
    const t = textEl.current;
    const m = mediaEl.current;
    if (!w || !p || !t || !m) return;

    const wide = window.matchMedia("(min-width: 1024px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    const clear = () => {
      for (const el of [t, m]) {
        el.style.opacity = "";
        el.style.filter = "";
        el.style.transform = "";
      }
    };

    // Read then write, in that order, so the rect is measured against a clean
    // layout. Runs straight off the scroll event: two rect-free reads and four
    // style writes is cheap, and rAF is paused in background tabs.
    const paint = () => {
      const vh = window.innerHeight;
      const top = w.getBoundingClientRect().top;
      const panelH = p.offsetHeight;
      const hold = w.offsetHeight - panelH;

      let textO: number;
      let mediaO: number;

      if (top > 0) {
        // Arriving from below.
        // Finishes as the panel reaches the top, not while it is still low
        // on the screen — the content is centred in a full-height panel, so
        // an early finish means nobody sees the effect.
        const e = 1 - top / vh;
        textO = ramp(e, 0.32, 0.92);
        mediaO = ramp(e, 0.42, 1);
      } else if (top > -hold) {
        // Pinned and held.
        textO = 1;
        mediaO = 1;
      } else {
        // Releasing and leaving upward.
        const x = (-top - hold) / panelH;
        textO = 1 - ramp(x, 0.05, 0.5);
        mediaO = 1 - ramp(x, 0.15, 0.62);
      }

      t.style.opacity = textO.toFixed(3);
      t.style.filter = `blur(${((1 - textO) * 9).toFixed(2)}px)`;
      t.style.transform = `scale(${(0.93 + textO * 0.07).toFixed(4)})`;
      m.style.opacity = mediaO.toFixed(3);
    };

    const sync = () => {
      window.removeEventListener("scroll", paint);
      window.removeEventListener("resize", paint);
      if (!wide.matches || still.matches) {
        clear();
        return;
      }
      // Anchored left so growing does not drag the text across its column.
      t.style.transformOrigin = "left center";
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
    <div ref={wrap} className="lg:h-[178svh]">
      <div
        ref={panel}
        className="lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:items-center"
      >
        <div className="mx-auto grid w-full max-w-[min(1920px,92vw)] items-center gap-12 px-6 py-20 sm:px-[72px] lg:grid-cols-2 lg:gap-[clamp(48px,4vw,80px)] lg:py-0">
          <div ref={textEl} className={flip ? "lg:order-2" : ""}>
            {text}
          </div>
          <div ref={mediaEl} className={flip ? "lg:order-1" : ""}>
            {media}
          </div>
        </div>
      </div>
    </div>
  );
}
