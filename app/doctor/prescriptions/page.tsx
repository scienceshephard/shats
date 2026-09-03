import { DoctorTop } from "@/components/shells";
import { Card, PlusIcon, SearchIcon } from "@/components/ui";
import { doctorPrescriptions, rxCounts, type RxRow } from "@/lib/mock";

/**
 * Status carries the whole meaning of a row, so each one gets its own tone.
 * "Not collected" is deliberately the alert colour: a prescription nobody
 * picked up is a clinical event, not an administrative one.
 */
const STATUS: Record<RxRow["status"], string> = {
  Ready: "bg-pine-wash text-pine",
  Dispensed: "bg-pine-wash text-pine",
  Waiting: "bg-clay-wash text-clay",
  "Not collected": "bg-alert-wash text-alert",
};

/**
 * D6 — everything this doctor has prescribed.
 *
 * The chemist column shows the distance because that is what decides whether a
 * patient can collect at all: a prescription sent 8km away in a village with no
 * transport is not a prescription, it is a suggestion.
 */
export default function DoctorPrescriptions() {
  return (
    <div className="min-h-screen bg-paper">
      <DoctorTop pathname="/doctor/prescriptions" />

      <main className="min-w-0 px-7 py-7">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
              WHAT YOU HAVE PRESCRIBED
            </p>
            <h1 className="mt-1.5 font-display text-[30px] font-semibold text-ink">
              Prescriptions
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="flex w-[280px] items-center gap-2 rounded-[4px] border border-line-strong px-3 py-2.5 text-[13px] text-muted">
              <SearchIcon /> Search patient or medicine
            </span>
            <button className="inline-flex items-center gap-2 rounded-full bg-pine px-[18px] py-2.5 text-[13.5px] font-semibold text-white">
              <PlusIcon /> Write a prescription
            </button>
          </div>
        </div>

        {/* The two that need chasing are outlined in alert, so the eye lands on
            them before it reads any number. */}
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {rxCounts.map((c) => (
            <div
              key={c.label}
              className={`rounded-[4px] border bg-surface px-[18px] py-4 ${
                c.hot ? "border-alert" : "border-line"
              }`}
            >
              <p
                className={`font-display text-[26px] font-semibold ${
                  c.hot ? "text-alert" : "text-ink"
                }`}
              >
                {c.value}
              </p>
              <p className="mt-1 text-xs text-muted">{c.label}</p>
            </div>
          ))}
        </div>

        <Card className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead>
              <tr className="border-b border-line bg-paper text-[10px] uppercase tracking-[0.1em] text-muted">
                {["Patient", "Medicine", "Issued", "Chemist", "Status", ""].map((h, i) => (
                  <th key={h || i} className="px-5 py-3 font-bold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {doctorPrescriptions.map((r) => (
                <tr key={r.patient + r.medicine} className="border-b border-line last:border-0">
                  <td className="px-5 py-3.5">
                    <p className="text-[13.5px] font-semibold text-ink">{r.patient}</p>
                    <p className="text-[11.5px] text-muted">{r.meta}</p>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-ink-soft">{r.medicine}</td>
                  <td className="px-5 py-3.5 text-[12.5px] text-ink-soft">{r.issued}</td>
                  <td
                    className={`px-5 py-3.5 text-[12.5px] ${
                      r.chemist ? "text-ink-soft" : "text-muted"
                    }`}
                  >
                    {r.chemist ?? "Not chosen yet"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-[11.5px] font-bold ${STATUS[r.status]}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="rounded-full border border-line-strong px-3.5 py-1.5 text-xs font-semibold text-ink">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>
    </div>
  );
}
