"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { SpeakerIcon } from "./ui";

/* -------------------------------------------------------------------------- */
/* The shell                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Modal shell shared by every dialog in the design.
 *
 * The canvas draws these as full screens with a `#0A1214D9` scrim; here they
 * are real modals, which means the parts a static canvas cannot show have to be
 * built: Escape to dismiss, a scrim click to dismiss, the page behind locked
 * against scrolling, focus moved in on open and handed back to whatever opened
 * it on close, and Tab kept inside the panel while it is up.
 *
 * `labelledBy` must point at the element holding the title so screen readers
 * announce the dialog by name rather than as an unlabelled group.
 */
export function Dialog({
  open,
  onClose,
  labelledBy,
  width = 600,
  padded = true,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  width?: number;
  /** Patient dialogs pad the panel; the professional ones pad each band. */
  padded?: boolean;
  children: ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    opener.current = document.activeElement as HTMLElement | null;
    const node = panel.current;
    node?.focus();

    // The page behind must not scroll under the scrim, and removing the
    // scrollbar would shift the layout — so pad by exactly its width.
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !node) return;

      const focusable = node.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
      opener.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#0A1214D9] p-5 sm:p-[50px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        style={{ maxWidth: width }}
        className={`w-full rounded-[14px] bg-surface outline-none ${padded ? "flex flex-col gap-[18px] p-8" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared parts                                                                */
/* -------------------------------------------------------------------------- */

type Tone = "alert" | "pine" | "clay" | "amber";

const WASH: Record<Tone, string> = {
  alert: "bg-alert-wash text-alert",
  pine: "bg-pine-wash text-pine",
  clay: "bg-clay-wash text-clay",
  amber: "bg-[#FBF0DA] text-[#8A6316]",
};

const SOLID: Record<Tone, string> = {
  alert: "bg-alert text-white",
  pine: "bg-pine text-white",
  clay: "bg-clay text-white",
  amber: "bg-amber text-[#2A1D08]",
};

/** The 80px round badge the patient dialogs open with. */
export function DialogIcon({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className={`flex h-20 w-20 items-center justify-center rounded-full ${WASH[tone]}`}>
      {children}
    </span>
  );
}

export function DialogTitle({
  id,
  size = 30,
  children,
}: {
  id: string;
  size?: 30 | 26;
  children: ReactNode;
}) {
  return (
    <h2
      id={id}
      className={`font-display font-semibold leading-[1.25] text-ink ${size === 30 ? "text-[30px]" : "text-[26px]"}`}
    >
      {children}
    </h2>
  );
}

export function DialogBody({ size = 17, children }: { size?: 17 | 15; children: ReactNode }) {
  return (
    <p className={`leading-[1.55] text-ink-soft ${size === 17 ? "text-[17px]" : "text-[15px]"}`}>
      {children}
    </p>
  );
}

/** A tinted note with an icon, used for the line that carries a consequence. */
export function DialogNote({
  tone,
  icon,
  children,
}: {
  tone: Tone;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={`flex items-center gap-3 rounded-[8px] p-4 ${WASH[tone]}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="text-[15px] font-semibold leading-[1.4] text-ink">{children}</span>
    </div>
  );
}

/** The coloured band at the top of a professional dialog. */
export function DialogStrip({
  tone,
  icon,
  label,
  meta,
}: {
  tone: Tone;
  icon?: ReactNode;
  label: string;
  meta?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-t-[14px] px-[26px] py-3.5 ${SOLID[tone]}`}
    >
      <span className="flex items-center gap-2.5">
        {icon}
        <span className="text-[12px] font-bold uppercase tracking-[1px]">{label}</span>
      </span>
      {meta && <span className="shrink-0 text-[12px] font-bold tracking-[0.5px]">{meta}</span>}
    </div>
  );
}

/** Label/value rows in a tinted box — the clinical detail these dialogs carry. */
export function DialogFacts({
  tone = "pine",
  rows,
}: {
  tone?: Tone;
  rows: [string, string][];
}) {
  return (
    <dl className={`flex flex-col gap-2.5 rounded-[8px] p-4 ${WASH[tone]}`}>
      {rows.map(([k, v]) => (
        <div key={k} className="flex flex-wrap items-baseline justify-between gap-x-3.5 gap-y-1">
          <dt className="text-[13.5px] text-ink-soft">{k}</dt>
          <dd className="text-right text-[14px] font-semibold text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function DialogListen({ language = "Igbo" }: { language?: string }) {
  return (
    <button
      type="button"
      className="inline-flex w-fit items-center gap-2.5 rounded-full bg-amber px-4 py-2.5 text-[14px] font-bold text-[#2A1D08]"
    >
      <SpeakerIcon size={18} />
      Listen in {language}
    </button>
  );
}

/** Patient dialogs stack full-width buttons; professional ones sit them in a row. */
export function DialogActions({
  layout = "stack",
  className = "",
  children,
}: {
  layout?: "stack" | "row";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex gap-3 ${layout === "stack" ? "flex-col" : "flex-col sm:flex-row sm:items-center"} ${className}`}
    >
      {children}
    </div>
  );
}

export function DialogButton({
  tone,
  variant = "solid",
  size = "lg",
  icon,
  onClick,
  children,
}: {
  tone: Tone;
  variant?: "solid" | "outline";
  /** lg is the patient dialogs' 18px button, sm the professional 15px one. */
  size?: "lg" | "sm";
  icon?: ReactNode;
  onClick?: () => void;
  children: ReactNode;
}) {
  const outline: Record<Tone, string> = {
    alert: "border-alert text-alert",
    pine: "border-line-strong text-ink",
    clay: "border-clay text-clay",
    amber: "border-line-strong text-ink",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2.5 font-bold ${
        size === "lg" ? "rounded-[14px] px-6 py-[19px] text-[18px]" : "rounded-full px-5 py-[15px] text-[15px]"
      } ${variant === "solid" ? SOLID[tone] : `border bg-transparent ${outline[tone]}`}`}
    >
      {icon}
      {children}
    </button>
  );
}
