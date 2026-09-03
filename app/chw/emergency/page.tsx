import Link from "next/link";
import { ChwTop } from "@/components/shells";
import { CheckIcon, Pill, SirenIcon, WifiOffIcon } from "@/components/ui";
import { activeEmergency, pendingSync } from "@/lib/mock";
import { EmergencyCaseTriggers } from "@/components/dialogs/pro-triggers";

const OUTCOMES = [
  { id: "REFERRED_TO_FACILITY", label: "Referred to a facility", sub: "I sent them on, or went with them", on: true },
  { id: "RESOLVED_ON_SCENE", label: "Resolved on the scene", sub: "Treated and no referral needed", on: false },
  { id: "CARE_REFUSED", label: "Patient or family refused care", sub: "Recorded honestly, no blame", on: false },
];

const ACTIONS = ["Took vitals", "Gave first aid", "Called the doctor", "Arranged transport", "Stayed until help came"];

/** C4 — Emergency response and report. */
export default function ChwEmergency() {
  const mins = Math.floor((activeEmergency.reassignInSeconds ?? 0) / 60);
  const secs = String((activeEmergency.reassignInSeconds ?? 0) % 60).padStart(2, "0");

  return (
    <div className="min-h-screen bg-paper">
      <ChwTop pathname="/chw/emergency" pending={pendingSync.total} />

      {/* The countdown makes the escalation ladder visible: if she cannot go,
          the case moves on rather than silently stalling. */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-alert px-7 py-4 text-white">
        <p className="flex items-center gap-3 text-sm font-semibold">
          <SirenIcon size={18} />
          Emergency assigned to you · {activeEmergency.reference}
        </p>
        <p className="text-sm">
          Goes to the next worker in{" "}
          <span className="font-display text-lg font-semibold">
            {mins}:{secs}
          </span>
        </p>
      </div>

      <main className="mx-auto w-full max-w-[900px] px-7 py-8">
        <h1 className="font-display text-[30px] font-semibold text-ink">
          Suspected stroke, Ede-Oballa
        </h1>
        <p className="mt-3 max-w-[640px] text-[16px] leading-relaxed text-ink-soft">
          {activeEmergency.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button className="rounded-full bg-alert px-7 py-3.5 text-sm font-semibold text-white">
            I am going now
          </button>
          <button className="rounded-full border border-line-strong px-7 py-3.5 text-sm font-semibold text-ink">
            I cannot go — pass it on
          </button>
        </div>

        <hr className="my-9 border-line" />

        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-pine">
            Emergency report · {activeEmergency.reference}
          </p>
          <h2 className="mt-3 font-display text-[26px] font-semibold text-ink">
            What happened?
          </h2>

          <ul className="mt-5 space-y-3">
            {OUTCOMES.map((o) => (
              <li key={o.id}>
                <button
                  className={`flex w-full items-center gap-4 rounded-[10px] border p-5 text-left ${
                    o.on ? "border-2 border-pine bg-pine-wash" : "border-line bg-surface"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      o.on ? "border-pine bg-pine text-white" : "border-line-strong"
                    }`}
                  >
                    {o.on && <CheckIcon size={14} />}
                  </span>
                  <span>
                    <span className="block text-[16px] font-semibold text-ink">{o.label}</span>
                    <span className="block text-sm text-muted">{o.sub}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
            What did you do?
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ACTIONS.map((a, i) => (
              <button
                key={a}
                className={`rounded-full border px-4 py-2.5 text-sm font-semibold ${
                  i < 3 ? "border-2 border-pine bg-pine-wash text-pine" : "border-line-strong text-ink"
                }`}
              >
                {a}
              </button>
            ))}
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {[
              ["Arrived", "14:02"],
              ["Closed", "15:18"],
              ["Time on scene", "1h 16m"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-[10px] border border-line bg-surface p-4">
                <p className="text-[10px] uppercase tracking-wide text-muted">{k}</p>
                <p className="mt-1.5 font-display text-[22px] font-semibold text-ink">{v}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-[10px] bg-clay-wash px-5 py-4">
            <span className="text-clay">
              <WifiOffIcon />
            </span>
            <p className="text-sm text-ink-soft">
              No signal here. The report is saved and sends itself the moment you have network.
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              href="/chw"
              className="flex-1 rounded-full border border-line-strong py-3.5 text-center text-sm font-semibold text-ink"
            >
              Save as draft
            </Link>
            <Link
              href="/chw"
              className="flex-1 rounded-full bg-pine py-3.5 text-center text-sm font-semibold text-white"
            >
              Submit report
            </Link>
          </div>
        </section>

        <EmergencyCaseTriggers />

        <div className="mt-8 flex items-center gap-3">
          <Pill tone="pine">
            <CheckIcon size={13} /> 12 records sent
          </Pill>
          <span className="text-sm text-muted">Last sync 15:22 today</span>
        </div>
      </main>
    </div>
  );
}
