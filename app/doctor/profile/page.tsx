import Link from "next/link";
import { DoctorTop } from "@/components/shells";
import {
  ArrowRight,
  BadgeCheckIcon,
  CalendarIcon,
  Card,
  PencilIcon,
  ShieldCheckIcon,
} from "@/components/ui";
import { doctorProfile, doctorEarnings, doctorVerification, naira } from "@/lib/mock";
import {
  AcceptingPatientsToggle,
  ChangeFeeTrigger,
  NoticeToggles,
} from "@/components/dialogs/pro-triggers";

/** The eyebrow every card on this screen opens with. */
function CardLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{children}</p>
  );
}

function Row({ k, v, tone = "text-ink" }: { k: string; v: string; tone?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <dt className="text-[13.5px] text-ink-soft">{k}</dt>
      <dd className={`text-[13.5px] font-semibold ${tone}`}>{v}</dd>
    </div>
  );
}

/**
 * D5 — the doctor's own profile.
 *
 * Everything here is a statement about how this doctor appears to patients, so
 * the fee sits at the top of Practice: it is the one value on the screen that
 * changes what someone else is asked to pay, which is why it is the only one
 * with a dialog behind it rather than an inline edit.
 */
export default function DoctorProfile() {
  const p = doctorProfile;

  return (
    <div className="min-h-screen bg-paper">
      <DoctorTop pathname="/doctor/profile" />

      <main className="grid gap-4 px-7 py-7 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-4">
          <Card className="flex flex-wrap items-center gap-5 p-6">
            <span className="flex h-[86px] w-[86px] shrink-0 items-center justify-center rounded-full bg-pine-wash font-display text-[30px] font-semibold text-pine">
              {p.initials}
            </span>
            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-[30px] font-semibold text-ink">{p.fullName}</h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-pine-wash px-2.5 py-1 text-[12px] font-bold text-pine">
                  <BadgeCheckIcon size={13} /> MDCN verified
                </span>
              </div>
              <p className="text-[14.5px] text-ink-soft">
                {p.specialty} · {p.city} · {p.yearsInPractice} years in practice
              </p>
              <p className="text-[13px] text-muted">
                {p.mdcnNumber} · Checked {p.checkedOn}
              </p>
            </div>
            <button className="tap inline-flex items-center gap-2 rounded-full border border-line-strong px-[18px] text-[13.5px] font-semibold text-ink transition-colors hover:border-pine hover:text-pine">
              <PencilIcon /> Edit profile
            </button>
          </Card>

          <Card className="p-[22px]">
            <CardLabel>PRACTICE</CardLabel>
            {/* The fee is the one value here a patient is quoted before they
                commit, so it is pulled out of the list and owns its own row. */}
            <div className="mt-3.5">
              <ChangeFeeTrigger feeKobo={p.feeKobo} />
            </div>
            <dl className="mt-3.5 space-y-3.5">
              <Row k="Appointment length" v={`${p.appointmentMinutes} minutes`} />
              <Row k="Languages spoken" v={p.languages.join(" · ")} />
              <Row k="Modes offered" v={p.modes.join(" · ")} />
              <Row k="Patients seen" v={String(p.patientsSeen)} />
            </dl>
          </Card>

          <Card className="p-[22px]">
            <CardLabel>WORKING HOURS</CardLabel>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              The hours patients can book. Emergencies reach you outside these.
            </p>
            {/* A cell per day rather than only the days worked, so the row reads
                as a week and a closed day is visibly a choice. */}
            <div className="mt-3.5 grid grid-cols-4 gap-1.5 sm:grid-cols-7">
              {p.hours.map((h) => (
                <div
                  key={h.day}
                  className={`rounded-[4px] border px-2 py-2.5 text-center ${
                    h.span ? "border-pine bg-pine-wash" : "border-line bg-paper"
                  }`}
                >
                  <p
                    className={`text-[12px] font-bold ${h.span ? "text-pine" : "text-muted"}`}
                  >
                    {h.day}
                  </p>
                  <p
                    className={`text-[11.5px] ${h.span ? "text-pine" : "text-muted"}`}
                  >
                    {h.span ?? "Closed"}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-[22px]">
            <div className="flex items-center justify-between gap-4">
              <CardLabel>EARNINGS</CardLabel>
              <span className="text-[12.5px] text-muted">{doctorEarnings.month}</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { v: doctorEarnings.paidOutKobo, l: "Paid out", tone: "text-ink" },
                { v: doctorEarnings.clearingKobo, l: "Waiting to clear", tone: "text-clay" },
                { v: doctorEarnings.heldKobo, l: "Held for refunds", tone: "text-muted" },
              ].map((f) => (
                <div key={f.l} className="rounded-[4px] bg-paper px-4 py-3.5">
                  <p className={`font-display text-[26px] font-semibold ${f.tone}`}>
                    {naira(f.v)}
                  </p>
                  <p className="mt-1 text-xs text-muted">{f.l}</p>
                </div>
              ))}
            </div>
            <Link
              href="/doctor/earnings"
              className="mt-4 flex items-center gap-2.5 rounded-[4px] bg-pine-wash p-3.5 text-[13px] font-semibold text-pine"
            >
              <CalendarIcon size={16} />
              Next payout {doctorEarnings.nextPayoutOn.split(",")[0]}, to {doctorEarnings.account}
              <ArrowRight size={15} />
            </Link>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[14.5px] font-semibold text-ink">Accepting patients</p>
              <AcceptingPatientsToggle compact />
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
              New patients can find you and book. Turning this off keeps the appointments you
              already have.
            </p>
          </Card>

          <Card className="p-5">
            <CardLabel>VERIFICATION</CardLabel>
            <ul className="mt-3 space-y-3">
              {doctorVerification.map((v) => (
                <li key={v.label} className="flex items-start gap-2.5">
                  <span className={v.tone === "ok" ? "text-pine" : "text-clay"}>
                    {v.tone === "ok" ? <BadgeCheckIcon size={15} /> : <ShieldCheckIcon size={15} />}
                  </span>
                  <span>
                    <span className="block text-[13px] font-semibold text-ink">{v.label}</span>
                    <span
                      className={`block text-xs ${v.tone === "ok" ? "text-pine" : "text-clay"}`}
                    >
                      {v.value}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <NoticeToggles />
        </aside>
      </main>
    </div>
  );
}
