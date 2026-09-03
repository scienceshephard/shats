import { PatientPage } from "@/components/shells";
import { ListenButton } from "@/components/ui";
import { doctors } from "@/lib/mock";
import { Empty } from "@/components/states";
import { DoctorPicker } from "./DoctorPicker";

/** R6 — Choose a doctor. The fee sits beside the name, never behind a step. */
export default async function ChooseDoctor({
  searchParams,
}: {
  searchParams: Promise<{ symptoms?: string }>;
}) {
  const { symptoms } = await searchParams;
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

      <DoctorPicker doctors={doctors} symptoms={symptoms} />
    </PatientPage>
  );
}
