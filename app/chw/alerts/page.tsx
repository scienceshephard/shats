import Link from "next/link";
import { ChwTop } from "@/components/shells";
import {
  ActivityIcon,
  CalendarIcon,
  Card,
  NavigationIcon,
  PillIcon,
  SirenIcon,
  StethoscopeIcon,
  TimerIcon,
  UserPlusIcon,
} from "@/components/ui";
import { chwAlerts, chwEmergencyAlert, pendingSync, type AlertKind } from "@/lib/mock";

/**
 * Each kind gets its own icon and tone. The reading alert is the alert colour
 * because it is the one that carries a standing clinical instruction — it has a
 * deadline the others do not.
 */
const KIND: Record<AlertKind, { Icon: typeof PillIcon; tone: string; wash: string }> = {
  doctor: { Icon: StethoscopeIcon, tone: "text-pine", wash: "bg-pine-wash" },
  reading: { Icon: ActivityIcon, tone: "text-alert", wash: "bg-alert-wash" },
  visit: { Icon: CalendarIcon, tone: "text-clay", wash: "bg-clay-wash" },
  supply: { Icon: PillIcon, tone: "text-clay", wash: "bg-clay-wash" },
  registration: { Icon: UserPlusIcon, tone: "text-pine", wash: "bg-pine-wash" },
};

const BORDER: Record<AlertKind, string> = {
  doctor: "border-pine",
  reading: "border-alert",
  visit: "border-clay",
  supply: "border-clay",
  registration: "border-pine",
};

/**
 * C6 — alerts.
 *
 * The assigned emergency is not one of the list items: it takes the whole width
 * and carries its own countdown, because an alert that expires is a different
 * kind of thing from one that waits.
 */
export default function ChwAlerts() {
  const e = chwEmergencyAlert;

  return (
    <div className="min-h-screen bg-paper">
      <ChwTop pathname="/chw/alerts" pending={pendingSync.total} />

      <main className="space-y-3.5 px-7 py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
              WHAT NEEDS YOU
            </p>
            <h1 className="mt-1.5 font-display text-[28px] font-semibold text-ink">Alerts</h1>
          </div>
          <button className="rounded-full border border-line-strong px-4 py-2.5 text-[13px] font-semibold text-ink">
            Mark all as seen
          </button>
        </div>

        <div className="rounded-[14px] bg-alert p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="flex items-center gap-2.5 text-[15px] font-bold text-white">
              <SirenIcon size={18} /> Emergency assigned to you
            </p>
            <span className="text-xs font-semibold text-[#F5C4C0]">{e.ago}</span>
          </div>
          <p className="mt-3 text-[13.5px] leading-relaxed text-[#FBDEDC]">
            {e.patient} — {e.where}. {e.detail}
          </p>
          <div className="mt-3.5 flex flex-wrap gap-2.5">
            <Link
              href="/chw/emergency"
              className="inline-flex items-center gap-2 rounded-full bg-surface px-5 py-3 text-[13.5px] font-bold text-alert"
            >
              <NavigationIcon /> Respond now
            </Link>
            <button className="rounded-full border border-[#F5C4C0] px-5 py-3 text-[13.5px] font-bold text-white">
              I cannot go
            </button>
          </div>
          <p className="mt-3.5 flex items-center gap-2 text-[12.5px] font-semibold text-[#F5C4C0]">
            <TimerIcon /> Passes to the next health worker in {e.reassignIn}
          </p>
        </div>

        <ul className="space-y-3.5">
          {chwAlerts.map((a) => {
            const k = KIND[a.kind];
            return (
              <li key={a.title}>
                <Card
                  className={`flex items-start gap-3.5 p-[18px] ${
                    a.unread ? BORDER[a.kind] : "border-line"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${k.wash} ${k.tone}`}
                  >
                    <k.Icon size={18} />
                  </span>
                  <span className="flex-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-3.5 gap-y-1">
                      <span className="text-[14.5px] font-bold text-ink">{a.title}</span>
                      <span className="text-[11.5px] text-muted">{a.when}</span>
                    </span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-ink-soft">
                      {a.body}
                    </span>
                  </span>
                  {/* Unread is a dot rather than a bold row: a health worker
                      reads this list in daylight on a cheap screen. */}
                  {a.unread && (
                    <span
                      aria-label="Not seen yet"
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                        a.kind === "reading" ? "bg-alert" : "bg-pine"
                      }`}
                    />
                  )}
                </Card>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
