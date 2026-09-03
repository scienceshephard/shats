import { PatientPage } from "@/components/shells";
import { ListenButton } from "@/components/ui";
import { doctors } from "@/lib/mock";
import { TimePicker } from "./TimePicker";

/** R7 — Choose a time. Clock time is paired with a plain-language time of day. */
export default async function ChooseTime({
  searchParams,
}: {
  searchParams: Promise<{ doctor?: string; symptoms?: string }>;
}) {
  const { doctor, symptoms } = await searchParams;
  // Whoever was chosen on R6, falling back to the first doctor so the screen
  // still reads correctly if someone opens this URL directly.
  const chosen = doctors.find((d) => d.id === doctor) ?? doctors[0];

  const forward: Record<string, string> = {};
  if (doctor) forward.doctor = doctor;
  if (symptoms) forward.symptoms = symptoms;

  return (
    <PatientPage showGoNext={false}>
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-clay">Question 3 of 3</p>
      <h1 className="mt-4 font-display text-[clamp(28px,5vw,36px)] font-semibold text-pine">
        When can you talk?
      </h1>
      <p className="mt-3 text-[15px] text-muted">
        {chosen.fullName} is free at these times. Pick one that suits you.
      </p>
      <ListenButton text="When can you talk? Pick a time that suits you." className="mt-4" />

      <TimePicker forward={forward} />
    </PatientPage>
  );
}
