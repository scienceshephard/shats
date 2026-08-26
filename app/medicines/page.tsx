import { PatientPage } from "@/components/shells";
import { CheckIcon, ListenButton, Pill, PillIcon } from "@/components/ui";
import { prescriptions } from "@/lib/mock";
import { MedicineTakenTrigger } from "@/components/dialogs/triggers";
import { Empty } from "@/components/states";

/** R11 — My medicines. Dose is written as a sentence, not a table. */
export default function Medicines() {
  const rx = prescriptions[0];

  return (
    <PatientPage goNextExclude="/medicines">
      <h1 className="font-display text-[clamp(28px,5vw,36px)] font-semibold text-ink">
        My medicines
      </h1>
      <p className="mt-3 text-[15px] text-muted">
        Given by Dr. Chidi Okonkwo on 13 August. Finish all of it, even if you feel better.
      </p>
      <ListenButton text="This is your medicine. Finish all of it, even if you start to feel better." className="mt-4" />

      <ul className="mt-8 space-y-4">
        {rx.items.length === 0 && (
          <Empty
            title="You have no medicine to take"
            body="When a doctor prescribes something for you it appears here, with the times to take it read out loud."
            action={{ href: "/symptoms", label: "Talk to a doctor" }}
          />
        )}
        {rx.items.map((item) => (
          <li key={item.medicine.code} className="rounded-[14px] border border-line bg-surface p-6">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-pine-wash text-pine">
                <PillIcon />
              </span>
              <div className="flex-1">
                <h2 className="font-display text-[24px] font-semibold text-ink">
                  {item.medicine.name}
                </h2>
                <p className="mt-2 text-[17px] leading-relaxed text-ink-soft">
                  Take <strong className="text-ink">{item.dosage}</strong>,{" "}
                  <strong className="text-ink">
                    {item.frequencyPerDay} times a day
                  </strong>
                  , for{" "}
                  <strong className="text-ink">{item.durationDays} days</strong>.
                </p>
                {item.instructions && (
                  <p className="mt-2 text-[15px] text-muted">{item.instructions}</p>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-5">
              <Pill tone="pine">
                <CheckIcon size={14} /> Ready at Eze Chemist, Ede-Oballa
              </Pill>
              <span className="text-sm text-muted">1.2 km from you</span>
            </div>
          </li>
        ))}
      </ul>

      <MedicineTakenTrigger />

      <div className="mt-6 rounded-[12px] bg-clay-wash p-5">
        <p className="text-[15px] font-semibold text-clay">If the medicine finishes early</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Do not stop and do not share it with anyone else. Tell your health worker, or book a
          short follow-up — it costs nothing within seven days.
        </p>
      </div>
    </PatientPage>
  );
}
