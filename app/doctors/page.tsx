import Link from "next/link";
import { PatientPage } from "@/components/shells";
import { ArrowRight, CheckIcon, ListenButton } from "@/components/ui";
import { doctors, naira } from "@/lib/mock";
import { Empty } from "@/components/states";

/** R6 — Choose a doctor. The fee sits beside the name, never behind a step. */
export default function ChooseDoctor() {
  return (
    <PatientPage showGoNext={false}>
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-clay">Question 2 of 3</p>
      <h1 className="mt-4 font-display text-[clamp(28px,5vw,36px)] font-semibold text-pine">
        Who do you want to talk to?
      </h1>
      <p className="mt-3 text-[15px] text-muted">
        Every doctor here is checked with the Medical and Dental Council of Nigeria.
      </p>
      <ListenButton text="Who do you want to talk to? Every doctor here is checked with the Medical and Dental Council of Nigeria." className="mt-4" />

      {doctors.length === 0 && (
        <Empty
          title="No doctor is free right now"
          body="Everyone is with a patient. Try again in a few minutes, or ask your health worker to book you the next free time."
          action={{ href: "/home", label: "Back to my home" }}
        />
      )}

      <ul className="mt-8 space-y-3">
        {doctors.map((d, i) => {
          const selected = i === 0;
          return (
            <li key={d.id}>
              <button
                className={`flex w-full items-center gap-4 rounded-[12px] border p-5 text-left ${
                  selected ? "border-2 border-pine bg-pine-wash" : "border-line bg-surface"
                }`}
              >
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-base font-bold ${
                    selected ? "bg-pine text-white" : "bg-line-strong text-paper"
                  }`}
                >
                  {d.fullName.split(" ")[1][0]}
                  {d.fullName.split(" ")[2]?.[0] ?? ""}
                </span>

                <span className="flex-1">
                  <span className="block text-[19px] font-semibold text-ink">{d.fullName}</span>
                  <span className="block text-sm text-muted">
                    {d.specialty} · {d.city}
                  </span>
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    {d.languages.map((l) => (
                      <span
                        key={l}
                        className="rounded-full border border-line bg-surface px-2.5 py-1 text-[11.5px] font-semibold text-ink-soft"
                      >
                        {l.toUpperCase()}
                      </span>
                    ))}
                    {!d.acceptingPatients && (
                      <span className="rounded-full bg-clay-wash px-2.5 py-1 text-[11.5px] font-semibold text-clay">
                        Not free today
                      </span>
                    )}
                  </span>
                </span>

                <span className="text-right">
                  <span
                    className={`block font-display text-[26px] font-semibold ${
                      selected ? "text-pine" : "text-ink-soft"
                    }`}
                  >
                    {naira(d.feeKobo)}
                  </span>
                  <span className="mt-1 block text-[12px] text-muted">
                    waits {d.averageWaitMinutes} min
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 flex items-center gap-2.5 text-[14.5px] text-ink-soft">
        <span className="text-pine-mid">
          <CheckIcon size={17} />
        </span>
        This is the whole price. Nothing is added at the end.
      </p>

      <Link
        href="/time"
        className="tap mt-9 flex w-full items-center justify-center gap-3 rounded-full bg-pine text-[18px] font-semibold text-white"
      >
        Choose a time <ArrowRight />
      </Link>
    </PatientPage>
  );
}
