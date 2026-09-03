import { ChwTop } from "@/components/shells";
import { CalendarIcon, Card, CheckIcon, ChevronDownIcon, WifiOffIcon } from "@/components/ui";
import { chwReports, chwWork, pendingSync } from "@/lib/mock";

function CardLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{children}</p>
  );
}

/**
 * C7 — what the health worker has sent in.
 *
 * The last column is the whole reason this screen exists. The question a CHW
 * actually has is not "did I write it down" but "has anybody read it" — so the
 * table ends in either `On this phone` or the doctor's name, and never in a
 * vague "pending".
 */
export default function ChwReports() {
  const unsent = chwReports.filter((r) => !r.sent).length;

  return (
    <div className="min-h-screen bg-paper">
      <ChwTop pathname="/chw/reports" pending={pendingSync.total} />

      <main className="min-w-0 space-y-3.5 px-7 py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <CardLabel>WHAT YOU HAVE SENT IN</CardLabel>
            <h1 className="mt-1.5 font-display text-[28px] font-semibold text-ink">Reports</h1>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-line-strong px-[15px] py-2.5 text-[13px] font-semibold text-ink">
            <CalendarIcon /> August 2026 <ChevronDownIcon />
          </button>
        </div>

        {/* Above the table, not a footnote in it: a report that has not reached
            the doctor is functionally not filed. */}
        {unsent > 0 && (
          <div className="flex flex-wrap items-center gap-3.5 rounded-[14px] bg-[#3A2A16] p-[18px]">
            <span className="text-amber">
              <WifiOffIcon size={20} />
            </span>
            <div className="flex-1">
              <p className="text-[14.5px] font-bold text-amber">
                {unsent} {unsent === 1 ? "report has" : "reports have"} not reached Dr. Okonkwo yet
              </p>
              <p className="mt-0.5 text-[12.5px] leading-relaxed text-[#D9C7A8]">
                They are safe on this phone. Nothing is lost — they send when you next reach
                network.
              </p>
            </div>
            <button className="rounded-full bg-amber px-4 py-2.5 text-[13px] font-bold text-[#2A1D08]">
              Try to sync
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {chwWork.map((w, i) => (
            <Card key={w.label} className="px-[17px] py-4">
              <p
                className={`font-display text-[26px] font-semibold ${
                  i === 2 ? "text-clay" : i === 3 ? "text-alert" : "text-pine"
                }`}
              >
                {w.value}
              </p>
              <p className="mt-1 text-xs leading-snug text-muted">{w.label}</p>
            </Card>
          ))}
        </div>

        <Card className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-line bg-paper text-[10px] uppercase tracking-[0.1em] text-muted">
                {["When", "What", "Patient", "What you found", "State"].map((h) => (
                  <th key={h} className="px-[18px] py-3 font-bold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chwReports.map((r) => (
                <tr key={r.when + r.patient} className="border-b border-line last:border-0">
                  <td className="px-[18px] py-3.5 text-[12.5px] font-semibold text-ink">
                    {r.when}
                  </td>
                  <td className="px-[18px] py-3.5 text-[12.5px] text-ink-soft">{r.kind}</td>
                  <td className="px-[18px] py-3.5 text-[13px] font-semibold text-ink">
                    {r.patient}
                  </td>
                  <td className="px-[18px] py-3.5 text-[12.5px] text-ink-soft">{r.found}</td>
                  <td className="px-[18px] py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        r.sent ? "bg-pine-wash text-pine" : "bg-[#3A2A16] text-amber"
                      }`}
                    >
                      {r.sent ? <CheckIcon size={11} /> : <WifiOffIcon size={11} />}
                      {r.sent ? "Dr. Okonkwo saw it" : "On this phone"}
                    </span>
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
