import Link from "next/link";
import { PatientPage } from "@/components/shells";
import { ArrowRight, ListenButton } from "@/components/ui";

const DAYS = [
  { label: "Today", date: "20 Aug", on: true },
  { label: "Tomorrow", date: "21 Aug", on: false },
  { label: "Friday", date: "22 Aug", on: false },
];

const SLOTS = [
  { time: "10:00", plain: "in the morning", free: true, on: true },
  { time: "11:30", plain: "before noon", free: true, on: false },
  { time: "13:00", plain: "after noon", free: false, on: false },
  { time: "15:45", plain: "in the afternoon", free: true, on: false },
  { time: "17:00", plain: "in the evening", free: true, on: false },
  { time: "18:30", plain: "in the evening", free: false, on: false },
];

/** R7 — Choose a time. Clock time is paired with a plain-language time of day. */
export default function ChooseTime() {
  return (
    <PatientPage showGoNext={false}>
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-clay">Question 3 of 3</p>
      <h1 className="mt-4 font-display text-[clamp(28px,5vw,36px)] font-semibold text-pine">
        When can you talk?
      </h1>
      <p className="mt-3 text-[15px] text-muted">
        Dr. Chidi Okonkwo is free at these times. Pick one that suits you.
      </p>
      <ListenButton text="When can you talk? Pick a time that suits you." className="mt-4" />

      <div className="mt-8 grid grid-cols-3 gap-3">
        {DAYS.map((d) => (
          <button
            key={d.label}
            className={`rounded-[12px] border py-4 ${
              d.on ? "border-2 border-pine bg-pine-wash" : "border-line bg-surface"
            }`}
          >
            <span className="block text-[17px] font-semibold text-ink">{d.label}</span>
            <span className="mt-0.5 block text-[13px] text-muted">{d.date}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {SLOTS.map((s) => (
          <button
            key={s.time}
            disabled={!s.free}
            className={`flex min-h-[80px] items-center justify-between rounded-[12px] border px-5 text-left ${
              s.on
                ? "border-2 border-pine bg-pine-wash"
                : s.free
                  ? "border-line bg-surface"
                  : "border-line bg-paper opacity-50"
            }`}
          >
            <span>
              <span className="block font-display text-[24px] font-semibold text-ink">
                {s.time}
              </span>
              <span className="block text-[13px] text-muted">{s.plain}</span>
            </span>
            {!s.free && <span className="text-[12px] font-semibold text-muted">Taken</span>}
          </button>
        ))}
      </div>

      <Link
        href="/pay"
        className="tap mt-10 flex w-full items-center justify-center gap-3 rounded-full bg-pine text-[18px] font-semibold text-white"
      >
        Continue to pay <ArrowRight />
      </Link>
    </PatientPage>
  );
}
