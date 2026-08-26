import Link from "next/link";
import {
  CheckIcon,
  HospitalIcon,
  ListenButton,
  PhoneIcon,
  SirenIcon,
  StethoscopeIcon,
} from "@/components/ui";
import { emergencyNotified, emergencyResponder, patientEmergency } from "@/lib/mock";
import type { EmergencyStatus } from "@/lib/types";

/**
 * R14 — Help is coming.
 *
 * Where the emergency page's red button lands. It answers the only question
 * somebody has after pressing it: is anyone actually coming, and what do I do
 * until they get here.
 *
 * It carries its own alert bar instead of the usual patient top bar. The bar is
 * the status — a second row of navigation above it would push the one thing
 * that matters down the screen — and there is no "where do you want to go next"
 * block for the same reason: right now there is nowhere else to go.
 */

/** The tracker is the emergency's own lifecycle, not a second copy of it. */
const TRACK: { status: EmergencyStatus; label: string }[] = [
  { status: "RAISED", label: "You asked for help" },
  { status: "ASSIGNED", label: "We found Blessing" },
  { status: "ACCEPTED", label: "She is coming" },
  { status: "RESOLVED", label: "She is with you" },
];

/**
 * Stroke guidance, in the order it matters. Numbered because these genuinely
 * are steps to follow while waiting — and short enough to act on with one hand
 * holding the phone.
 */
const WHILE_YOU_WAIT = [
  "Lay him on his side. Not on his back.",
  "Do not give him food, water or any medicine.",
  "Loosen anything tight on his neck and chest.",
  "Remember the time the weakness started. The doctor will ask you.",
];

const TOLD_ICON = {
  hospital: <HospitalIcon size={21} />,
  doctor: <StethoscopeIcon size={21} />,
  phone: <PhoneIcon size={21} />,
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

export default function HelpIsComing() {
  const at = TRACK.findIndex((step) => step.status === patientEmergency.status);
  const { name, role, distanceKm, minutesAway, phone } = emergencyResponder;

  const spoken =
    `${name} is coming to you. She will reach you in about ${minutesAway} minutes. ` +
    `While you wait: ${WHILE_YOU_WAIT.join(" ")}`;

  return (
    <div className="min-h-screen bg-paper">
      {/* The bar stays put: on a screen you keep scrolling for instructions, the
          fact that help is on its way should never scroll away. */}
      <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 bg-alert px-6 py-[18px]">
        <p className="flex items-center gap-3.5 text-[22px] font-semibold text-white">
          <SirenIcon size={24} /> Help is coming
        </p>
        <Link
          href="/home"
          className="rounded-full border-2 border-[#F6D5D2] px-[18px] py-[11px] text-sm font-bold text-white"
        >
          I do not need help again
        </Link>
      </header>

      <main className="px-6 py-8 sm:px-[60px] sm:py-[30px]">
        <div className="flex max-w-[700px] flex-col gap-5">
          <h1 className="font-display text-[clamp(26px,5vw,34px)] font-semibold leading-tight text-ink">
            {name} is coming to you.
            <br />
            She will reach you in about {minutesAway} minutes.
          </h1>

          <ol className="grid grid-cols-2 overflow-hidden rounded-[14px] border border-line bg-surface sm:grid-cols-4">
            {TRACK.map((step, i) => {
              const done = i < at;
              const now = i === at;
              return (
                <li
                  key={step.status}
                  aria-current={now ? "step" : undefined}
                  className={`flex flex-col gap-2.5 p-4 sm:border-r-2 sm:border-line sm:last:border-r-0 ${
                    now ? "bg-clay-wash" : ""
                  }`}
                >
                  <span
                    className={`flex h-[34px] w-[34px] items-center justify-center rounded-full ${
                      done
                        ? "bg-pine text-white"
                        : now
                          ? "bg-clay text-white"
                          : "border border-line"
                    }`}
                  >
                    {done && <CheckIcon size={18} />}
                    {now && (
                      <span className="h-[13px] w-[13px] animate-pulse rounded-full bg-white" />
                    )}
                  </span>
                  <span
                    className={`text-sm ${
                      i > at ? "font-medium text-muted" : "font-bold text-ink"
                    }`}
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>

          <section className="flex flex-wrap items-center gap-[18px] rounded-[14px] bg-pine p-[22px]">
            <span
              aria-hidden
              className="flex h-[86px] w-[86px] shrink-0 items-center justify-center rounded-full bg-pine-mid font-display text-[30px] font-semibold text-white"
            >
              {initials(name)}
            </span>
            <span className="min-w-[180px] flex-1">
              <span className="block font-display text-[26px] font-semibold text-white">
                {name}
              </span>
              <span className="mt-1 block text-base text-[#C9E1E6]">
                {role} · she is {distanceKm} km away
              </span>
            </span>
            {/* A real tel: link, not a button that looks like one — on the phone
                this is read on, it has to actually place the call. */}
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="tap flex w-full items-center justify-center gap-2.5 rounded-[8px] bg-surface px-6 text-[18px] font-bold text-pine sm:w-[190px]"
            >
              <PhoneIcon size={21} /> Call her
            </a>
          </section>

          <section className="flex flex-col gap-4 rounded-[14px] bg-clay-wash p-[22px]">
            <div className="flex flex-wrap items-center justify-between gap-3.5">
              <h2 className="font-display text-[24px] font-semibold text-clay">
                Do this while you wait
              </h2>
              <ListenButton text={spoken} tone="amber" />
            </div>
            <ol className="flex flex-col gap-4">
              {WHILE_YOU_WAIT.map((line, i) => (
                <li key={line} className="flex items-start gap-3.5">
                  <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-clay font-display text-[19px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-1.5 text-[18px] leading-snug text-ink">{line}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="flex flex-col gap-3 rounded-[14px] border border-line bg-surface p-[22px]">
            <h2 className="font-display text-[22px] font-semibold text-ink">We have also told</h2>
            {emergencyNotified.map((who) => (
              <div key={who.name} className="flex items-center gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-pine-wash text-pine">
                  {TOLD_ICON[who.icon]}
                </span>
                <span>
                  <span className="block text-[17px] font-bold text-ink">{who.name}</span>
                  <span className="mt-0.5 block text-sm text-ink-soft">{who.note}</span>
                </span>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
