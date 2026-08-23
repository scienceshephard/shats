#!/usr/bin/env python3
"""
Injects the SHATS motion layer into a Pencil html-css export.

Pencil draws the page but cannot animate it, so the scroll behaviour is added
here. It mirrors what shats/app/page.tsx does, and the model comes from
impilo.health's HowItWorks section:

  1. HERO OVERLAY   The hero pins to the top of the screen and S2 rides up over
                    it, sinking it as it covers. Hero and S2 are each one
                    viewport tall, so the pin releases exactly when the cover
                    completes. The overlay stops there.

  2. PIN AND HOLD   Step 01-04 each pin, hold still while you keep scrolling,
                    then release and clear out as the next arrives. The panels
                    never overlap. Impilo does this with GSAP ScrollTrigger;
                    a sticky element inside a taller wrapper behaves the same
                    with no library, so that is what this uses.

  3. UNBLUR/GROW    Inside each held panel the contents -- number, heading and
                    body -- unblur and grow into place as one block, then
                    re-blur and shrink as the panel leaves. The visual is a
                    plain fade, starting and ending a beat later. Both are tied
                    to scroll position rather than to a one-shot trigger, so
                    they reverse when you scroll up and nothing latches on
                    first sight.

  4. SECOND RUN     The overlay resumes at S4 and runs to S7: those four stack
                    the way the hero does. S4 unblurs and grows, since it is
                    only type and icons and a slide would look busy. S7 is
                    deliberately static.

  5. TAIL           S8 to S11 fade in and back out on scroll position.

Effects that change opacity or blur are applied to a wrapper around a section's
children, never to the section itself -- fading the element would fade its own
background and show the page straight through it.

Both are plain `position: sticky`, which means the export's own
`overflow: hidden` on the artboard has to be undone first -- an overflow
container captures sticky children and they never pin.

There is deliberately no smooth-scroll layer. The previous version of this
script translated a `position: fixed` wrapper to fake inertia, and a
transformed, overflow-hidden ancestor makes `position: sticky` inert. The two
techniques cannot coexist, and the pinning is the point.

Usage:
    python3 build-preview.py <pencil-export.html> <output.html>

Re-run after any re-export from Pencil. Nothing is hand-edited in the output.
"""

import re
import sys

# Fraction of a panel's own height that it stays pinned for. The Next app
# spells the same thing as a 178svh wrapper around a 100svh panel.
HOLD = 0.78

STYLE = r"""
<style id="shats-motion">
  :root { --ease: cubic-bezier(.22,1,.36,1); }

  html { background: #07171B; }
  body { margin: 0; background: #07171B; }

  /* The artboard exports as a fixed-height flex column with clipped overflow.
     Both have to go: the height because the pin wrappers add to it, and the
     overflow because it would swallow every sticky child. */
  [data-pencil-name="L0 · Landing Page"] {
    height: auto !important;
    overflow: visible !important;
    margin: 0 auto;
  }

  /* ---------- pinning ---------- */

  /* Bounds how long the hero stays pinned: it is exactly hero + cover tall. */
  .shats-scope { position: relative; width: 100%; flex-shrink: 0; }

  .shats-pin { position: sticky; top: 0; z-index: 0; }

  /* The block that rides over the hero. Must be positioned and opaque, or a
     pinned (and therefore positioned) hero paints straight over it. */
  .shats-sheet { position: relative; z-index: 1; width: 100%; }

  /* Sections past the overlay. The hero has unpinned by then; this is only
     here so nothing can ever paint underneath it during the handover. */
  .shats-after { position: relative; z-index: 2; }

  /* The second overlay run, S4 to S7. */
  .shats-stack { position: relative; width: 100%; flex-shrink: 0; }

  /* One journey step. Taller than the panel it holds -- the surplus IS the
     length of the hold. */
  .shats-hold { position: relative; width: 100%; flex-shrink: 0; }
  .shats-hold > * { position: sticky; top: 0; }

  .shats-veil {
    position: absolute; inset: 0; z-index: 5;
    background: #02161A; opacity: 0; pointer-events: none;
  }

  /* ---------- reveals ---------- */
  .rv {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity .95s var(--ease), transform .95s var(--ease);
  }
  .rv.in { opacity: 1; transform: none; }

  @media (prefers-reduced-motion: reduce) {
    .rv { opacity: 1; transform: none; transition: none; }
    .shats-pin, .shats-hold > * { position: static; }
    .shats-hold { height: auto !important; }
    .shats-veil { display: none; }
    .shats-fx { opacity: 1 !important; filter: none !important; transform: none !important; }
  }
</style>
"""

SCRIPT = r"""

<script>
(function () {
  var HOLD = %HOLD%;
  var page = document.querySelector('[data-pencil-name="L0 · Landing Page"]');
  if (!page) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var named = function (n) {
    return page.querySelector('[data-pencil-name="' + n + '"]');
  };
  function ramp(v, a, b) { return Math.min(1, Math.max(0, (v - a) / (b - a))); }

  // Captured before any wrapping, so it is the original section list rather
  // than the wrappers introduced below.
  var sections = [].slice.call(page.children);

  // An effect that changes opacity or blur has to act on a section's contents,
  // never on the section itself -- fading the element fades its own background
  // and shows the page through it. This moves the children into a wrapper that
  // reproduces the section's own flex layout.
  function inner(el) {
    var cs = getComputedStyle(el);
    var w = document.createElement('div');
    w.className = 'shats-fx';
    w.style.display = cs.display === 'flex' ? 'flex' : 'block';
    w.style.flexDirection = cs.flexDirection;
    w.style.alignItems = cs.alignItems;
    w.style.justifyContent = cs.justifyContent;
    w.style.gap = cs.gap;
    w.style.width = '100%';
    w.style.alignSelf = 'stretch';
    w.style.flex = '1 1 auto';
    // A veil belongs to the section, not to its contents -- swept into the
    // wrapper it would be blurred and scaled along with them, and would stop
    // covering the panel. Left in place, and last, so it still paints on top.
    [].slice.call(el.childNodes).forEach(function (c) {
      if (c.nodeType === 1 && c.classList.contains('shats-veil')) return;
      w.appendChild(c);
    });
    el.insertBefore(w, el.firstChild);
    return w;
  }

  var scrollDriven = [];   // sections kept out of the one-shot reveal

  /* ---------------- 1. hero overlay ---------------- */

  var hero = named('Hero');
  var cover = named('S2 · The Distance');
  var veil = null;

  if (hero && cover && !reduced) {
    var scope = document.createElement('div');
    scope.className = 'shats-scope';
    page.insertBefore(scope, hero);
    scope.appendChild(hero);

    var sheet = document.createElement('div');
    sheet.className = 'shats-sheet';
    scope.appendChild(sheet);
    sheet.appendChild(cover);

    hero.classList.add('shats-pin');
    veil = document.createElement('div');
    veil.className = 'shats-veil';
    hero.appendChild(veil);

    var seen = false;
    [].slice.call(page.children).forEach(function (el) {
      if (el === scope) { seen = true; return; }
      if (seen) el.classList.add('shats-after');
    });
  }

  /* ---------------- 2. journey pin and hold ---------------- */

  var steps = [];

  if (!reduced) {
    ['Step 01', 'Step 02', 'Step 03', 'Step 04'].forEach(function (n) {
      var panel = named(n);
      if (!panel || panel.parentNode !== page) return;
      var hold = document.createElement('div');
      hold.className = 'shats-hold shats-after';
      page.insertBefore(hold, panel);
      hold.appendChild(panel);
      var h = panel.offsetHeight || 860;
      hold.style.height = Math.round(h * (1 + HOLD)) + 'px';
      steps.push({
        hold: hold,
        panel: panel,
        text: panel.querySelector('[data-pencil-name="' + n + ' Text"]'),
        media: panel.querySelector('[data-pencil-name="' + n + ' Visual"]')
      });
      scrollDriven.push(panel);
    });
  }

  /* ---------------- 3. the second overlay run ---------------- */

  // S4 through S7 stack the way the hero does: each pins and the next rides
  // over it. The run ends at S7, whose container ends where it does, so it
  // never pins and the rest of the page scrolls on normally.
  var RUN = ['S4 · Works Without', 'S5 · The Health Worker',
             'S6 · The Doctors', 'S7 · Emergency'];
  var stack = [];

  if (!reduced) {
    var first = named(RUN[0]);
    if (first && first.parentNode === page) {
      var box = document.createElement('div');
      box.className = 'shats-stack shats-after';
      page.insertBefore(box, first);

      RUN.forEach(function (n, i) {
        var sec = named(n);
        if (!sec) return;
        box.appendChild(sec);
        // The hero pass marked every later section `shats-after`, which sets
        // position:relative and is declared after `shats-pin` -- it would win
        // and the section would never pin. The container carries it instead.
        sec.classList.remove('shats-after');
        sec.classList.add('shats-pin');
        sec.style.zIndex = String(i + 1);
        var v = document.createElement('div');
        v.className = 'shats-veil';
        sec.appendChild(v);
        stack.push({ sec: sec, veil: v });
      });
    }
  }

  /* ---------------- 4. section effects ---------------- */

  var fx = [];

  if (!reduced) {
    // Only type and icons, so it unblurs and grows instead of sliding.
    var s4 = named('S4 · Works Without');
    if (s4) { fx.push({ el: inner(s4), mode: 'blur-grow' }); scrollDriven.push(s4); }

    // Deliberately untouched: the emergency panel is the one moment on the
    // page that should read as an alarm rather than as a flourish.
    var s7 = named('S7 · Emergency');
    if (s7) scrollDriven.push(s7);

    // Per block rather than per section, which is what the Next app does:
    // the blocks fade in a soft cascade instead of the whole screen going at
    // once. No wrapper needed -- these carry no background of their own that
    // the page would show through.
    ['S8 · Learn', 'S9 · Your Records', 'S10 · Two Doors', 'S11 · Footer']
      .forEach(function (n) {
        var sec = named(n);
        if (!sec) return;
        [].slice.call(sec.children).forEach(function (child) {
          fx.push({ el: child, mode: 'fade' });
        });
        scrollDriven.push(sec);
      });
  }

  /* ---------------- 5. one-shot reveals and odometers ---------------- */

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      if (e.target.__count) e.target.__count();
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -12% 0px' });

  document.querySelectorAll('[data-pencil-name^="Stat Value "]').forEach(function (el) {
    var m = /^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/.exec(el.textContent.trim());
    if (!m) return;
    var pre = m[1], raw = m[2], suf = m[3];
    var target = parseFloat(raw.replace(/,/g, ''));
    var dec = (raw.split('.')[1] || '').length;
    var grouped = raw.indexOf(',') > -1;
    el.style.fontVariantNumeric = 'tabular-nums';

    function render(v) {
      var s = v.toFixed(dec);
      if (grouped) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      el.textContent = pre + s + suf;
    }
    if (reduced) return;
    render(0);

    var host = el.closest('[data-pencil-name^="Stat "]') || el;
    host.__count = function () {
      if (host.__ran) return;
      host.__ran = 1;
      var t0 = performance.now(), dur = 1500;
      // If rAF never runs, this snaps the number to its final value rather
      // than leaving a zero sitting on the page.
      var done = setTimeout(function () { render(target); }, dur + 700);
      (function step(now) {
        var p = Math.min(1, (now - t0) / dur);
        render(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) { requestAnimationFrame(step); return; }
        clearTimeout(done);
      })(t0);
    };
    io.observe(host);
  });

  sections.forEach(function (sec) {
    if (sec.offsetHeight < 50) return;
    // Anything painted from scroll position below is left alone. A one-shot
    // reveal would latch it opaque and the effect could never run back.
    if (scrollDriven.indexOf(sec) > -1) return;
    [].slice.call(sec.children).forEach(function (child, i) {
      child.classList.add('rv');
      child.style.transitionDelay = (i * 110) + 'ms';
      io.observe(child);
    });
  });

  /* ---------------- 6. scroll-driven painting ---------------- */

  function paint() {
    var vh = window.innerHeight, i;

    if (veil) {
      var c = 1 - cover.getBoundingClientRect().top / vh;
      veil.style.opacity = (Math.min(1, Math.max(0, c)) * 0.65).toFixed(3);
    }

    for (i = 0; i < steps.length; i++) {
      var s = steps[i];
      if (!s.text || !s.media) continue;

      var top = s.hold.getBoundingClientRect().top;
      var panelH = s.panel.offsetHeight;
      var held = s.hold.offsetHeight - panelH;
      var textO, mediaO;

      if (top > 0) {
        // Finishes as the panel reaches the top, not while it is still low
        // on the screen -- the content is centred in a full-height panel, so
        // an early finish means nobody sees the effect.
        var e = 1 - top / vh;
        textO = ramp(e, 0.32, 0.92);
        mediaO = ramp(e, 0.42, 1);
      } else if (top > -held) {
        textO = 1; mediaO = 1;
      } else {
        var x = (-top - held) / panelH;
        textO = 1 - ramp(x, 0.05, 0.50);
        mediaO = 1 - ramp(x, 0.15, 0.62);
      }

      s.text.style.transformOrigin = 'left center';
      s.text.style.opacity = textO.toFixed(3);
      s.text.style.filter = 'blur(' + ((1 - textO) * 9).toFixed(2) + 'px)';
      s.text.style.transform = 'scale(' + (0.93 + textO * 0.07).toFixed(4) + ')';
      s.media.style.opacity = mediaO.toFixed(3);
    }

    for (i = 0; i < stack.length; i++) {
      var next = stack[i + 1];
      var q = next
        ? Math.min(1, Math.max(0, 1 - next.sec.getBoundingClientRect().top / vh))
        : 0;
      stack[i].veil.style.opacity = (q * 0.6).toFixed(3);
    }

    for (i = 0; i < fx.length; i++) {
      var f = fx[i];
      var r = f.el.getBoundingClientRect();
      var p = Math.min(ramp((vh - r.top) / vh, 0.12, 0.5),
                       ramp(r.bottom / vh, 0, 0.4));
      if (f.mode === 'blur-grow') {
        f.el.style.opacity = (0.12 + p * 0.88).toFixed(3);
        f.el.style.filter = 'blur(' + ((1 - p) * 9).toFixed(2) + 'px)';
        f.el.style.transform = 'scale(' + (0.93 + p * 0.07).toFixed(4) + ')';
      } else {
        f.el.style.opacity = p.toFixed(3);
      }
    }
  }

  if (reduced) return;

  // Painted straight from the scroll event instead of being batched into rAF.
  // Every value is a pure function of scroll position, so there is no state to
  // lose, and rAF is paused in background tabs and throttled under power
  // saving -- batching there strands a section part-faded.
  window.addEventListener('scroll', paint, { passive: true });
  window.addEventListener('resize', paint);

  paint();
})();
</script>
""".replace("%HOLD%", str(HOLD))


def build(src: str, dst: str) -> None:
    with open(src, encoding="utf-8") as fh:
        html = fh.read()

    if "shats-motion" in html:
        raise SystemExit("motion layer already present in " + src)
    if 'data-pencil-name="L0 · Landing Page"' not in html:
        raise SystemExit(
            "no landing page in " + src + " -- export the L0 frame with "
            "includeLayerNames, the script keys off data-pencil-name"
        )

    html = html.replace("</head>", STYLE + "\n  </head>", 1)

    if "</body>" not in html:
        raise SystemExit("no </body> found in " + src)
    html = html.replace("</body>", SCRIPT + "\n</body>", 1)

    with open(dst, "w", encoding="utf-8") as fh:
        fh.write(html)

    print("wrote " + dst)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    build(sys.argv[1], sys.argv[2])
