import { PatientPage } from "@/components/shells";
import { ListenButton } from "@/components/ui";
import { SymptomPicker } from "./SymptomPicker";

/** R5 — What is wrong. Pictures and two languages, never free text alone. */
export default function Symptoms() {
  return (
    <PatientPage showGoNext={false}>
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-clay">Question 1 of 3</p>
      <h1 className="mt-4 font-display text-[clamp(28px,5vw,36px)] font-semibold text-pine">
        What is wrong?
      </h1>
      <p className="mt-3 text-[15px] text-muted">
        Tap everything that is true. You can choose more than one.
      </p>
      <ListenButton text="What is wrong? Tap everything that is true. You can choose more than one." className="mt-4" />

      <SymptomPicker />
    </PatientPage>
  );
}
