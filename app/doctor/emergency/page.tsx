import Link from "next/link";
import { DoctorTop } from "@/components/shells";
import {
  Card,
  HospitalIcon,
  PhoneIcon,
  SirenIcon,
  TimerIcon,
  VideoIcon,
  WarningIcon,
} from "@/components/ui";
import { escalation } from "@/lib/mock";

function CardLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{children}</p>
  );
}

const TIMELINE_TONE = {
  alert: "text-alert",
  pine: "text-pine",
  clay: "text-clay",
  muted: "text-ink-soft",
} as const;

/**
 * D8 — an emergency escalated to the doctor.
 *
 * The doctor is reading a description of someone they cannot see, so the
 * complaint is quoted, attributed and timestamped: who observed it and when
 * changes what it is worth. Onset time is the number that decides whether clot
 * treatment is still possible, which is why it is in the quote rather than
 * summarised away.
 */
export default function DoctorEmergency() {
  const e = escalation;

  return (
    <div className="min-h-screen bg-paper">
      <DoctorTop pathname="/doctor/emergency" />

      <main className="px-7 py-6">
        <div className="flex flex-wrap items-center gap-5 rounded-[14px] bg-alert p-[22px]">
          <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#8F1E17] text-white">
            <SirenIcon size={26} />
          </span>
          <div className="flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-display text-2xl font-semibold text-white">
                Emergency escalated to you
              </h1>
              <span className="rounded-full bg-[#8F1E17] px-2.5 py-1 text-[11px] font-bold tracking-[0.05em] text-[#F5C4C0]">
                {e.reference}
              </span>
            </div>
            <p className="text-sm text-[#FBDEDC]">
              CHW {e.onScene.name} is on the scene in Ede-Oballa and needs a doctor now.
            </p>
          </div>
          {/* The clock is the reason this screen is urgent, so it is the largest
              thing on the banner after the headline. */}
          <div className="text-right">
            <p className="font-display text-[32px] font-semibold leading-none text-white">
              {e.reassignIn}
            </p>
            <p className="mt-1 text-[11.5px] text-[#F5C4C0]">before it escalates further</p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0 space-y-4">
            <div className="rounded-[14px] border border-alert bg-surface p-[22px]">
              <div className="flex flex-wrap items-center gap-3.5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-alert-wash font-display text-xl font-semibold text-alert">
                  {e.patient.initials}
                </span>
                <div className="flex-1">
                  <p className="font-display text-2xl font-semibold text-ink">{e.patient.name}</p>
                  <p className="text-[13.5px] text-ink-soft">{e.patient.meta}</p>
                </div>
                <button className="rounded-full border border-line-strong px-4 py-2.5 text-[13px] font-semibold text-ink">
                  Open full record
                </button>
              </div>

              <p className="mt-4 text-[14.5px] italic leading-relaxed text-ink-soft">
                &ldquo;{e.complaint}&rdquo;
              </p>
              <p className="mt-2 text-xs text-muted">
                Read aloud by {e.onScene.name}, on the scene · {e.raisedAt}
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-5">
                {e.vitals.map((v) => (
                  <div
                    key={v.key}
                    className={`rounded-[4px] px-3.5 py-3 ${v.hot ? "bg-alert-wash" : "bg-paper"}`}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                      {v.key}
                    </p>
                    <p
                      className={`mt-0.5 text-base font-bold ${v.hot ? "text-alert" : "text-ink"}`}
                    >
                      {v.value}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-4 flex items-center gap-2.5 rounded-[4px] bg-clay-wash p-3.5 text-[13px] font-semibold text-ink">
                <span className="shrink-0 text-clay">
                  <WarningIcon />
                </span>
                {e.history}
              </p>
            </div>

            <Card className="p-[22px]">
              <CardLabel>WHAT DO YOU WANT TO DO?</CardLabel>
              <div className="mt-3.5 flex flex-col gap-2.5 sm:flex-row">
                <Link
                  href="/doctor/consultation"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-alert px-5 py-4 text-[14.5px] font-semibold text-white"
                >
                  <VideoIcon /> Join {e.onScene.name.split(" ")[0]} now
                </Link>
                <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-line-strong px-5 py-4 text-[14.5px] font-semibold text-ink">
                  <HospitalIcon size={16} /> Refer to a facility
                </button>
                <button className="flex-1 rounded-full border border-line-strong px-5 py-4 text-[14.5px] font-semibold text-ink-soft">
                  I cannot take it
                </button>
              </div>
              <p className="mt-3.5 text-[12.5px] leading-relaxed text-muted">
                {e.nextAppointment} Taking this will not cancel it — she is told you may run late.
              </p>
            </Card>

            {/* Forty seconds of deciding should not be forty seconds of nobody
                doing anything, so the wait has instructions in it. */}
            <div className="rounded-[14px] bg-pine-wash p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-pine">
                WHILE YOU DECIDE — TELL {e.onScene.name.split(" ")[0].toUpperCase()}
              </p>
              <ul className="mt-3 space-y-2.5">
                {e.guidance.map((g) => (
                  <li key={g} className="flex gap-2.5">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-pine" />
                    <span className="text-[13px] leading-relaxed text-ink">{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-4">
            <Card className="p-5">
              <CardLabel>WHO IS THERE</CardLabel>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-clay-wash text-sm font-bold text-clay">
                  {e.onScene.initials}
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">{e.onScene.name}</p>
                  <p className="text-[11.5px] text-pine">
                    Health worker · on scene since {e.onScene.since}
                  </p>
                  <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-pine-wash px-2 py-0.5 text-[11px] font-bold text-pine">
                    <span className="h-1.5 w-1.5 rounded-full bg-pine" /> Waiting for you
                  </span>
                </div>
              </div>
              <a
                href={`tel:${e.onScene.phone.replace(/\s/g, "")}`}
                className="mt-3 flex items-center justify-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-[13px] font-semibold text-ink"
              >
                <PhoneIcon size={14} /> Call {e.onScene.name.split(" ")[0]} — {e.onScene.phone}
              </a>
            </Card>

            {/* Nearest is not the same as right: the closest post has no scanner. */}
            <Card className="p-5">
              <CardLabel>NEAREST FACILITIES</CardLabel>
              <ul className="mt-3 space-y-2.5">
                {e.facilities.map((f) => (
                  <li key={f.name} className="rounded-[4px] bg-paper px-3.5 py-3">
                    <div className="flex items-start justify-between gap-2.5">
                      <p className="text-[13px] font-bold text-ink">{f.name}</p>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-bold ${
                          f.bed ? "bg-pine-wash text-pine" : "bg-line text-muted"
                        }`}
                      >
                        {f.bed ? "Bed free" : "No bed"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11.5px] text-muted">{f.meta}</p>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-5">
              <CardLabel>WHAT HAS HAPPENED</CardLabel>
              <ol className="mt-3 space-y-2.5">
                {e.timeline.map((t) => (
                  <li key={t.at} className="flex gap-3">
                    <span className={`w-11 shrink-0 text-xs font-bold ${TIMELINE_TONE[t.tone]}`}>
                      {t.at}
                    </span>
                    <span className="text-[12.5px] leading-snug text-ink-soft">{t.event}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-[11.5px] text-muted">
                <TimerIcon size={13} /> Sent to 3 doctors at once — first to accept takes it.
              </p>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
