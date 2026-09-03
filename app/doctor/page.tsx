import Link from "next/link";
import { DoctorTop } from "@/components/shells";
import { ArrowRight, Pill, SirenIcon } from "@/components/ui";
import { doctorSchedule, naira } from "@/lib/mock";
import { AcceptingPatientsToggle, EscalationActions } from "@/components/dialogs/pro-triggers";

const statusTone = {
  "In session": "pine",
  Waiting: "clay",
  Confirmed: "neutral",
} as const;

/**
 * D1 — Today's schedule.
 *
 * Professional density: this is read at a glance between patients, so it is a
 * table rather than the single-column layout the patient app uses.
 */
export default function DoctorSchedule() {
  return (
    <div className="min-h-screen bg-paper">
      <DoctorTop pathname="/doctor" />

      <main className="px-7 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted">Good morning, Dr. Okonkwo</p>
            <h1 className="mt-1 font-display text-[32px] font-semibold text-ink">
              Tuesday, 19 August
            </h1>
          </div>
          <AcceptingPatientsToggle />
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0">
            {/* Metric strip — the one waiting now is highlighted because it is
                the only number that demands an action right this minute. */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Consultations today", value: "6", sub: "2 remaining" },
                { label: "Waiting now", value: "1", sub: "Ngozi A. · 4 min", hot: true },
                { label: "This week", value: "18", sub: "+3 vs last week" },
                { label: "Earnings this week", value: naira(7_450_000), sub: "Paid out Friday" },
              ].map((m) => (
                <div
                  key={m.label}
                  className={`rounded-[10px] border p-4 ${
                    m.hot ? "border-pine bg-pine text-white" : "border-line bg-surface"
                  }`}
                >
                  <p
                    className={`text-[10px] font-bold uppercase tracking-[0.12em] ${
                      m.hot ? "text-white/70" : "text-muted"
                    }`}
                  >
                    {m.label}
                  </p>
                  <p className="mt-2 font-display text-[30px] font-semibold leading-none">
                    {m.value}
                  </p>
                  <p className={`mt-2 text-xs ${m.hot ? "text-white/70" : "text-muted"}`}>
                    {m.sub}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 overflow-hidden rounded-[10px] border border-line bg-surface">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-line bg-paper text-[10px] uppercase tracking-[0.12em] text-muted">
                    <th className="px-5 py-3 font-bold">Time</th>
                    <th className="px-5 py-3 font-bold">Patient</th>
                    <th className="px-5 py-3 font-bold">Reason</th>
                    <th className="px-5 py-3 font-bold">Type</th>
                    <th className="px-5 py-3 font-bold">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {doctorSchedule.map((row) => (
                    <tr
                      key={row.time}
                      className={`border-b border-line last:border-0 ${
                        row.status === "In session" ? "bg-pine-wash/60" : ""
                      }`}
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-ink">{row.time}</td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-ink">{row.patient}</p>
                        <p className="text-xs text-muted">
                          {row.age} · {row.sex}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-sm text-ink-soft">{row.reason}</td>
                      <td className="px-5 py-4 text-sm text-ink-soft">{row.mode}</td>
                      <td className="px-5 py-4">
                        <Pill tone={statusTone[row.status]}>{row.status}</Pill>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href="/doctor/consultation"
                          className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold ${
                            row.status === "In session"
                              ? "bg-pine text-white"
                              : "border border-line-strong text-ink"
                          }`}
                        >
                          {row.status === "In session"
                            ? "Rejoin"
                            : row.status === "Waiting"
                              ? "Start"
                              : "View"}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rail: next patient, then the escalation that cannot wait. */}
          <aside className="space-y-4">
            <div className="rounded-[10px] border border-line bg-surface p-5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                  Next patient
                </p>
                <Pill tone="clay">in 6 min</Pill>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pine-wash text-sm font-bold text-pine">
                  NA
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-ink">Ngozi Adeleke</p>
                  <p className="text-xs text-muted">41 · Female · Obollo-Afor</p>
                </div>
              </div>
              <p className="mt-4 rounded-[8px] bg-paper p-3.5 text-[13.5px] italic leading-relaxed text-ink-soft">
                “My head has been paining me since Sunday and my chest feels tight.”
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { k: "BP", v: "158/96", hot: true },
                  { k: "Temp", v: "37.1°C" },
                  { k: "Pulse", v: "88" },
                ].map((v) => (
                  <div
                    key={v.k}
                    className={`rounded-[8px] p-2.5 ${v.hot ? "bg-alert-wash" : "bg-paper"}`}
                  >
                    <p className="text-[10px] uppercase text-muted">{v.k}</p>
                    <p
                      className={`text-[15px] font-semibold ${
                        v.hot ? "text-alert" : "text-ink"
                      }`}
                    >
                      {v.v}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-clay">
                ⚠ Allergy: penicillin
              </p>
              <Link
                href="/doctor/consultation"
                className="mt-4 flex w-full items-center justify-center rounded-[8px] bg-pine py-3 text-sm font-semibold text-white"
              >
                Start consultation
              </Link>
            </div>

            <div className="rounded-[10px] border border-alert bg-surface p-5">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-alert">
                  <SirenIcon size={13} /> CHW escalation
                </p>
                <span className="text-xs text-muted">3 min ago</span>
              </div>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
                CHW Blessing Uche is with a 62-year-old man in Ede-Oballa. Suspected stroke — face
                drooping, weakness on the left side, onset under 2 hours.
              </p>
              <EscalationActions />
            </div>

            <Link
              href="/doctor/patients"
              className="flex items-center justify-between rounded-[10px] border border-line bg-surface p-5 text-sm font-semibold text-ink hover:border-line-strong"
            >
              All my patients <ArrowRight size={16} />
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}
