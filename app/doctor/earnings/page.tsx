import { DoctorTop } from "@/components/shells";
import { BankIcon, CalendarIcon, Card, ChevronDownIcon, DownloadIcon } from "@/components/ui";
import {
  cashCollected,
  doctorEarnings,
  doctorProfile,
  earningWeeks,
  naira,
  netKobo,
  payouts,
  platformFeeKobo,
  PLATFORM_FEE_PERCENT,
} from "@/lib/mock";

function CardLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{children}</p>
  );
}

/**
 * D7 — earnings.
 *
 * The platform fee is stated on every row and broken down for a single
 * consultation, because a doctor should never have to work out what they
 * actually keep. Gross, fee and net are derived from one stored number rather
 * than held as three that could disagree.
 */
export default function DoctorEarnings() {
  const e = doctorEarnings;
  // The tallest week sets the scale, so the bars stay honest relative to
  // each other rather than to an arbitrary ceiling.
  const peak = Math.max(...earningWeeks.map((w) => w.grossKobo));

  return (
    <div className="min-h-screen bg-paper">
      <DoctorTop pathname="/doctor/earnings" />

      <main className="px-7 py-7">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <CardLabel>WHAT YOU HAVE EARNED</CardLabel>
            <h1 className="mt-1.5 font-display text-[30px] font-semibold text-ink">Earnings</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button className="inline-flex items-center gap-2 rounded-full border border-line-strong px-[15px] py-2.5 text-[13px] font-semibold text-ink">
              <CalendarIcon /> {e.month} <ChevronDownIcon />
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-line-strong px-[17px] py-2.5 text-[13.5px] font-semibold text-ink">
              <DownloadIcon /> Download statement
            </button>
          </div>
        </div>

        {/* `min-w-0` on the column is what keeps the payout table's 840px
            minimum from stretching the grid track: an auto track's minimum is
            its content's minimum, so without this the whole page grows to 840px
            on a tablet instead of the table scrolling inside its own box. */}
        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0 space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { v: e.paidOutKobo, l: "Paid out", n: `${e.payoutCount} payouts`, tone: "text-ink" },
                { v: e.clearingKobo, l: "Waiting to clear", n: "clears Friday", tone: "text-clay" },
                {
                  v: e.heldKobo,
                  l: "Held for refunds",
                  n: `${e.cancellations} cancellations`,
                  tone: "text-muted",
                },
              ].map((f) => (
                <Card key={f.l} className="px-[19px] py-4">
                  <p className={`font-display text-[29px] font-semibold ${f.tone}`}>{naira(f.v)}</p>
                  <p className="mt-1 text-[12.5px] font-semibold text-ink-soft">{f.l}</p>
                  <p className="text-[11.5px] text-muted">{f.n}</p>
                </Card>
              ))}
            </div>

            <Card className="p-[22px]">
              <div className="flex items-center justify-between gap-4">
                <CardLabel>CONSULTATIONS PER WEEK</CardLabel>
                <span className="text-[12.5px] text-muted">
                  {e.consultationsThisMonth} this month
                </span>
              </div>
              <div className="mt-4 flex h-[150px] items-end gap-3.5">
                {earningWeeks.map((w) => (
                  <div key={w.week} className="flex flex-1 flex-col items-center gap-1.5">
                    <p className="text-[11.5px] font-bold text-ink-soft">{naira(w.grossKobo)}</p>
                    <div
                      className="w-full rounded-t-[4px] bg-pine"
                      style={{ height: `${Math.round((w.grossKobo / peak) * 105)}px` }}
                    />
                    <p className="text-[11.5px] text-muted">
                      {w.week} · {w.consultations}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="overflow-x-auto">
              <div className="border-b border-line px-5 py-4">
                <CardLabel>PAYOUTS</CardLabel>
              </div>
              <table className="w-full min-w-[840px] text-left">
                <thead>
                  <tr className="border-b border-line bg-paper text-[10px] uppercase tracking-[0.1em] text-muted">
                    {["Date", "Consultations", "Gross", `SHATS ${PLATFORM_FEE_PERCENT}%`, "You received", "Status"].map(
                      (h) => (
                        <th key={h} className="px-5 py-3 font-bold">
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((p) => (
                    <tr key={p.date} className="border-b border-line last:border-0">
                      <td className="px-5 py-3.5 text-[13px] font-bold text-ink">{p.date}</td>
                      <td className="px-5 py-3.5 text-[12.5px] text-ink-soft">
                        {p.consultations} consultations
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-ink-soft">
                        {naira(p.grossKobo)}
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-muted">
                        −{naira(platformFeeKobo(p.grossKobo))}
                      </td>
                      <td className="px-5 py-3.5 text-[13.5px] font-bold text-ink">
                        {naira(netKobo(p.grossKobo))}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-[11.5px] font-bold ${
                            p.status === "Paid"
                              ? "bg-pine-wash text-pine"
                              : "bg-clay-wash text-clay"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[14px] bg-pine p-[22px]">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8FC4CC]">
                NEXT PAYOUT
              </p>
              <p className="mt-3 font-display text-[38px] font-semibold leading-none text-white">
                {naira(e.nextPayoutKobo)}
              </p>
              <p className="mt-3 text-[13.5px] font-semibold text-[#C7E2E7]">{e.nextPayoutOn}</p>
              <p className="mt-3.5 flex items-center gap-2.5 border-t border-white/15 pt-3.5 text-[12.5px] text-[#C7E2E7]">
                <BankIcon /> {e.account}
              </p>
            </div>

            <Card className="p-5">
              <CardLabel>{`ON A ${naira(doctorProfile.feeKobo)} CONSULTATION`}</CardLabel>
              <dl className="mt-3 space-y-3">
                {[
                  { k: "Patient pays", v: naira(doctorProfile.feeKobo), tone: "text-ink" },
                  {
                    k: "SHATS platform fee",
                    v: `−${naira(platformFeeKobo(doctorProfile.feeKobo))}`,
                    tone: "text-muted",
                  },
                  {
                    k: "You receive",
                    v: naira(netKobo(doctorProfile.feeKobo)),
                    tone: "text-pine",
                  },
                ].map((r) => (
                  <div key={r.k} className="flex items-baseline justify-between gap-3">
                    <dt className="text-[13px] text-ink-soft">{r.k}</dt>
                    <dd className={`text-[13.5px] font-bold ${r.tone}`}>{r.v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                The fee covers the video call, SMS to patients, and payment charges.
              </p>
            </Card>

            {/* Cash handed to a health worker still has to reach the doctor, so
                it is shown rather than folded silently into the payout. */}
            <Card className="p-5">
              <CardLabel>CASH TAKEN BY HEALTH WORKERS</CardLabel>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">
                Patients with no wallet pay their health worker. It reaches you in the same payout.
              </p>
              <ul className="mt-3 space-y-3">
                {cashCollected.map((c) => (
                  <li key={c.by} className="flex items-center justify-between gap-3">
                    <span>
                      <span className="block text-[13px] font-semibold text-ink">{c.by}</span>
                      <span className="block text-[11.5px] text-muted">
                        {c.receipts} {c.receipts === 1 ? "receipt" : "receipts"}
                      </span>
                    </span>
                    <span className="text-[13.5px] font-bold text-pine">
                      {naira(c.amountKobo)}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
