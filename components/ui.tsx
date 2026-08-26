import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export { ListenButton } from "./ListenButton";

/* -------------------------------------------------------------------------- */
/* Brand                                                                       */
/* -------------------------------------------------------------------------- */

export function Logo({
  variant = "dark",
  height = 34,
  className = "",
}: {
  /** "dark" is the teal artwork for light surfaces; "light" for dark surfaces. */
  variant?: "dark" | "light";
  height?: number;
  className?: string;
}) {
  // The artwork is 738x979, so width is derived rather than guessed.
  const width = Math.round(height * 0.7538);
  return (
    <Image
      src={variant === "light" ? "/brand/shats-logo-light.png" : "/brand/shats-logo.png"}
      alt="SHATS"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Buttons                                                                     */
/* -------------------------------------------------------------------------- */

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger" | "quiet";
  /** Patient screens use "big"; professional screens use "normal". */
  size?: "big" | "normal";
  full?: boolean;
  className?: string;
  type?: "button" | "submit";
};

const buttonStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-pine text-white hover:bg-[#08363d]",
  ghost: "bg-transparent text-pine border border-line-strong hover:border-pine",
  danger: "bg-alert text-white hover:bg-[#8f1e17]",
  quiet: "bg-pine-wash text-pine hover:bg-[#cfe5e9]",
};

export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "normal",
  full,
  className = "",
  type = "button",
}: ButtonProps) {
  const cls = [
    "inline-flex items-center justify-center gap-2.5 rounded-full font-semibold transition-colors",
    buttonStyles[variant],
    size === "big" ? "text-lg px-8 min-h-[62px]" : "text-[15px] px-6 min-h-[46px]",
    full ? "w-full" : "",
    className,
  ].join(" ");

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Small pieces                                                                */
/* -------------------------------------------------------------------------- */

export function Pill({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "pine" | "clay" | "amber" | "alert" | "onDark";
  className?: string;
}) {
  const tones = {
    neutral: "bg-paper text-ink-soft border border-line",
    pine: "bg-pine-wash text-pine",
    clay: "bg-clay-wash text-clay",
    amber: "bg-amber text-ink",
    alert: "bg-alert-wash text-alert",
    onDark: "bg-white/10 text-night-text border border-white/20",
  }[tone];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${tones} ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * The eyebrow above a section heading. Canvas values: Archivo 11.5/700 at
 * 1.8px tracking. Three tones, one per surface — clay on paper, amber on the
 * dark teal, and the soft red the emergency section uses.
 */
export function SectionLabel({
  tone = "clay",
  as: Tag = "p",
  className = "",
  children,
}: {
  tone?: "clay" | "amber" | "alert" | "muted";
  /** The two-door rows need this inside a link, where a <p> is invalid. */
  as?: "p" | "span";
  className?: string;
  children: ReactNode;
}) {
  const color = {
    clay: "text-clay",
    amber: "text-amber",
    alert: "text-[#F0A9A2]",
    muted: "text-muted",
  }[tone];
  return (
    <Tag className={`text-[11.5px] font-bold uppercase tracking-[1.8px] ${color} ${className}`}>
      {children}
    </Tag>
  );
}

export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "li";
}) {
  return (
    <Tag className={`rounded-[14px] border border-line bg-surface ${className}`}>{children}</Tag>
  );
}

/**
 * Read-aloud control. Every patient-facing question carries one, because the
 * people this is built for may not read the screen at all.
 */
export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  /** Shown under the input and announced; the input should also be aria-invalid. */
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2.5 block text-[18px] font-semibold text-ink">{label}</span>
      {hint && <span className="mb-2.5 block text-sm text-muted">{hint}</span>}
      {children}
      {error && (
        <span role="alert" className="mt-2 block text-sm font-medium text-alert">
          {error}
        </span>
      )}
    </label>
  );
}

export function TextInput({
  placeholder,
  type = "text",
  defaultValue,
  value,
  onChange,
  invalid,
  autoComplete,
  inputMode,
  maxLength,
}: {
  placeholder?: string;
  type?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  invalid?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "numeric" | "email";
  maxLength?: number;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      aria-invalid={invalid || undefined}
      autoComplete={autoComplete}
      inputMode={inputMode}
      maxLength={maxLength}
      className={`tap w-full rounded-[10px] border bg-surface px-4 text-[17px] text-ink outline-none placeholder:text-muted ${
        invalid ? "border-alert focus:border-alert" : "border-line-strong focus:border-pine"
      }`}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Icons — inline so no icon package is needed                                 */
/* -------------------------------------------------------------------------- */

const iconBase = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export const ArrowRight = ({ size = 18 }: { size?: number }) => (
  <svg {...iconBase} width={size} height={size} aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const SpeakerIcon = ({ size = 16 }: { size?: number }) => (
  <svg {...iconBase} width={size} height={size} aria-hidden>
    <path d="M11 5 6 9H2v6h4l5 4V5Z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
  </svg>
);

export const PhoneIcon = ({ size = 16 }: { size?: number }) => (
  <svg {...iconBase} width={size} height={size} aria-hidden>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.6 2.8a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.7 2Z" />
  </svg>
);

export const SirenIcon = ({ size = 22 }: { size?: number }) => (
  <svg {...iconBase} width={size} height={size} aria-hidden>
    <path d="M7 18v-6a5 5 0 0 1 10 0v6" />
    <path d="M5 21h14" />
    <path d="M12 2v2M4.9 5.6 6.3 7M19.1 5.6 17.7 7" />
  </svg>
);

export const StethoscopeIcon = ({ size = 22 }: { size?: number }) => (
  <svg {...iconBase} width={size} height={size} aria-hidden>
    <path d="M6 3v6a5 5 0 0 0 10 0V3" />
    <path d="M6 3H4M16 3h2" />
    <path d="M11 14v2a5 5 0 0 0 10 0v-2" />
    <circle cx="21" cy="12" r="2" />
  </svg>
);

export const PillIcon = ({ size = 22 }: { size?: number }) => (
  <svg {...iconBase} width={size} height={size} aria-hidden>
    <path d="m10.5 20.5-7-7a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7Z" />
    <path d="m8.5 8.5 7 7" />
  </svg>
);

export const HeartIcon = ({ size = 22 }: { size?: number }) => (
  <svg {...iconBase} width={size} height={size} aria-hidden>
    <path d="M19 14c1.5-1.5 2.5-3 2.5-5A4.5 4.5 0 0 0 12 6.5 4.5 4.5 0 0 0 2.5 9c0 2 1 3.5 2.5 5l7 7 7-7Z" />
  </svg>
);

export const FlaskIcon = ({ size = 14 }: { size?: number }) => (
  <svg {...iconBase} width={size} height={size} aria-hidden>
    <path d="M10 2v7.2L4.6 18.9A2 2 0 0 0 6.3 22h11.4a2 2 0 0 0 1.7-3.1L14 9.2V2" />
    <path d="M8.5 2h7" />
    <path d="M7.2 16h9.6" />
  </svg>
);

export const LanguagesIcon = ({ size = 15 }: { size?: number }) => (
  <svg {...iconBase} width={size} height={size} aria-hidden>
    <path d="M2 5h11" />
    <path d="M7.5 3v2" />
    <path d="M10.5 5a11 11 0 0 1-6 9" />
    <path d="M5.5 9a8 8 0 0 0 5 4.5" />
    <path d="m13 21 4.5-10L22 21" />
    <path d="M14.6 17.5h5.8" />
  </svg>
);

export const ArrowDownIcon = ({ size = 15 }: { size?: number }) => (
  <svg {...iconBase} width={size} height={size} aria-hidden>
    <path d="M12 5v14M18 13l-6 6-6-6" />
  </svg>
);

export const FootprintsIcon = ({ size = 22 }: { size?: number }) => (
  <svg {...iconBase} width={size} height={size} aria-hidden>
    <path d="M4 16v-2.4C4 12 5 11 6.5 11S9 12 9 13.6V16a2.5 2.5 0 0 1-5 0Z" />
    <path d="M4 21h5" />
    <path d="M15 11V8.6C15 7 16 6 17.5 6S20 7 20 8.6V11a2.5 2.5 0 0 1-5 0Z" />
    <path d="M15 16h5" />
  </svg>
);

export const EyeOffIcon = ({ size = 22 }: { size?: number }) => (
  <svg {...iconBase} width={size} height={size} aria-hidden>
    <path d="M2 2l20 20" />
    <path d="M9.9 5.1A9.9 9.9 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 3.9" />
    <path d="M6.2 6.6A17 17 0 0 0 2 12s4 7 10 7a9.7 9.7 0 0 0 4.3-1" />
    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
  </svg>
);

export const ShieldCheckIcon = ({ size = 22 }: { size?: number }) => (
  <svg {...iconBase} width={size} height={size} aria-hidden>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const BadgeCheckIcon = ({ size = 22 }: { size?: number }) => (
  <svg {...iconBase} width={size} height={size} aria-hidden>
    <path d="M3.9 8.1a2.6 2.6 0 0 1 1.8-3.1 2.6 2.6 0 0 0 1.5-1.1 2.6 2.6 0 0 1 4.4-.5 2.6 2.6 0 0 0 1.7.6 2.6 2.6 0 0 1 3.4 2.8 2.6 2.6 0 0 0 .7 1.7 2.6 2.6 0 0 1-.9 4.3 2.6 2.6 0 0 0-1.3 1.2 2.6 2.6 0 0 1-4.3 1 2.6 2.6 0 0 0-1.8 0 2.6 2.6 0 0 1-4.3-1 2.6 2.6 0 0 0-1.3-1.2 2.6 2.6 0 0 1-.9-4.3" />
    <path d="m9 11 2 2 4-4" />
  </svg>
);

export const CheckIcon = ({ size = 18 }: { size?: number }) => (
  <svg {...iconBase} width={size} height={size} aria-hidden>
    <path d="m5 13 4 4L19 7" />
  </svg>
);

export const HomeIcon = ({ size = 18 }: { size?: number }) => (
  <svg {...iconBase} width={size} height={size} aria-hidden>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
  </svg>
);

export const WifiOffIcon = ({ size = 18 }: { size?: number }) => (
  <svg {...iconBase} width={size} height={size} aria-hidden>
    <path d="M2 2l20 20" />
    <path d="M8.5 16.5a5 5 0 0 1 7 0" />
    <path d="M5 12.9a10 10 0 0 1 3.5-2.3M19 12.9a10 10 0 0 0-6.4-2.9" />
    <path d="M2 8.8a15 15 0 0 1 4.2-2.7M22 8.8a15 15 0 0 0-9.9-3.7" />
    <path d="M12 20h.01" />
  </svg>
);

export const HospitalIcon = ({ size = 21 }: { size?: number }) => (
  <svg {...iconBase} width={size} height={size} aria-hidden>
    <path d="M4 21V8l8-5 8 5v13" />
    <path d="M2 21h20" />
    <path d="M12 8.5v5M9.5 11h5" />
    <path d="M9.5 21v-4h5v4" />
  </svg>
);
