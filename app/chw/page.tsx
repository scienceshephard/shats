import Link from "next/link";
import { ProTop } from "@/components/shells";
import { ArrowRight, CheckIcon, Pill, SirenIcon, WifiOffIcon } from "@/components/ui";
import { chwPatients, chwRounds } from "@/lib/mock";
import { RoundsTriggers } from "@/components/dialogs/pro-triggers";

const NAV = [
  { href: "/chw", label: "Today's rounds", active: true },
  { href: "/chw/register", label: "Register a patient" },
  { href: "/chw/visit", label: "Record a visit" },
  { href: "/chw/emergency", label: "Emergency" },
];

const timeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: false });

/**
 * C1 — Today's rounds.
 *
 * The offline strip is permanent, not a transient toast: a CHW needs to know
 * at a glance how much unsent work is sitting on the phone.
 */
export default function ChwRounds() {
  const pending = chwRounds.filter((r) => !r.synced).length;

  return (
    <div className="min-h-screen bg-paper">
      <ProTop
        links={NAV}
        badge="Health worker"
        right={
          <span className="flex items-center gap-2.5 text-sm font-semibold text-ink">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pine text-xs text-white">
              NE
            </span>
            Ngozi Eze
          </span>
        }
      />

      <main className="px-7 py-8">
        {pending > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[10px] bg-clay-wash px-5 py-4">
            <p className="flex items-center gap-3 text-sm text-ink">
              <span className="text-clay">
                <WifiOffIcon />
              </span>
              <span>
                <strong className="font-semibold">{pending} records are waiting to send.</strong>{" "}
                They are saved on this phone and will go by themselves when there is signal.
              </span>
            </p>
            <button className="rounded-full border border-clay px-4 py-2 text-xs font-semibold text-clay">
              Try now
            </button>
          </div>
        )}

        <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted">Ede-Oballa, Nsukka</p>
            <h1 className="mt-1 font-display text-[32px] font-semibold text-ink">
              Today&apos;s rounds
            </h1>
          </div>
          <Link
            href="/chw/register"
            className="rounded-full bg-pine px-6 py-3 text-sm font-semibold text-white"
          >
            Register a patient
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_340px]">
          <ol className="space-y-3">
            {chwRounds.map((visit) => {
              const p = chwPatients[visit.patientId];
              return (
                <li
                  key={visit.id}
                  className="flex items-center gap-5 rounded-[10px] border border-line bg-surface p-5"
                >
                  <span className="w-14 shrink-0 font-display text-[22px] font-semibold text-pine">
                    {timeLabel(visit.scheduledFor)}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[17px] font-semibold text-ink">{p.name}</span>
                    <span className="block text-sm text-muted">
                      {p.age} years · {p.note}
                    </span>
                    <span className="mt-2 block text-sm text-ink-soft">{visit.purpose}</span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-2">
                    {visit.synced ? (
                      <Pill tone="pine">
                        <CheckIcon size={13} /> sent
                      </Pill>
                    ) : (
                      <Pill tone="clay">on this phone</Pill>
                    )}
                    <Link
                      href="/chw/visit"
                      className="rounded-full border border-line-strong px-4 py-2 text-xs font-semibold text-ink hover:border-pine"
                    >
                      Record visit
                    </Link>
                  </span>
                </li>
              );
            })}
          </ol>

          <aside className="space-y-4">
            <Link
              href="/chw/emergency"
              className="block rounded-[10px] border-2 border-alert bg-alert-wash p-5"
            >
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-alert">
                <SirenIcon size={14} /> Emergency assigned to you
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                62-year-old man in Ede-Oballa. Suspected stroke — onset under 2 hours.
              </p>
              <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-alert">
                Open it now <ArrowRight size={15} />
              </p>
            </Link>

            <div className="rounded-[10px] border border-line bg-surface p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                Standing instructions
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Dr. Okonkwo: send any blood pressure above{" "}
                <strong className="text-ink">160/100</strong> straight to me, do not wait for the
                next round.
              </p>
            </div>

            <div className="rounded-[10px] border border-line bg-surface p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                This week
              </p>
              <div className="mt-3 space-y-2.5">
                {[
                  ["Visits completed", "14"],
                  ["Patients registered", "3"],
                  ["Escalated to a doctor", "2"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between">
                    <span className="text-sm text-ink-soft">{k}</span>
                    <span className="font-display text-lg font-semibold text-ink">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <RoundsTriggers />
          </aside>
        </div>
      </main>
    </div>
  );
}
