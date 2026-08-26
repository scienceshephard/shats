"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { submit, describeFailure } from "@/lib/submit";
import { isClean, wholeNumber, type Errors } from "@/lib/validate";
import { ErrorState } from "@/components/states";
import { SendToDoctorDialog } from "@/components/dialogs/chw";
import { CheckIcon, TextInput, WifiOffIcon } from "@/components/ui";

type Values = { systolic: string; diastolic: string; temperature: string; pulse: string; notes: string };

/** Stand-ins until the round is loaded from `GET /chw/me/rounds`. */
const CHW_ID = "00000000-0000-4000-8000-000000000001";
const PATIENT_ID = "00000000-0000-4000-8000-000000000002";

/** Bounds a reading has to fall inside before it is worth recording at all. */
const RANGES = {
  systolic: { min: 50, max: 260, label: "The top number" },
  diastolic: { min: 30, max: 160, label: "The bottom number" },
  pulse: { min: 30, max: 220, label: "Pulse" },
};

/**
 * C3 — Record a home visit.
 *
 * Validation here is a safety feature, not politeness: a mistyped blood
 * pressure is what triggers or fails to trigger an escalation to a doctor. The
 * ranges below reject impossible readings without second-guessing unusual ones,
 * because the unusual ones are exactly the reason the health worker is there.
 */
export function VisitForm() {
  const [values, setValues] = useState<Values>({
    systolic: "", diastolic: "", temperature: "", pulse: "", notes: "",
  });
  const [errors, setErrors] = useState<Errors<Values>>({});
  const [failure, setFailure] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [escalate, setEscalate] = useState(false);

  const set = (key: keyof Values) => (v: string) => {
    setValues((p) => ({ ...p, [key]: v }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
    setSaved(false);
  };

  const systolic = Number(values.systolic);
  // The doctor's standing instruction for this patient.
  const breached = Number.isFinite(systolic) && systolic > 160;

  function validate(): Errors<Values> {
    const temp = Number(values.temperature);
    return {
      systolic: wholeNumber(values.systolic, RANGES.systolic),
      diastolic: wholeNumber(values.diastolic, RANGES.diastolic),
      pulse: wholeNumber(values.pulse, RANGES.pulse),
      temperature:
        values.temperature && (!Number.isFinite(temp) || temp < 30 || temp > 45)
          ? "Temperature should be between 30 and 45 °C."
          : undefined,
    };
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFailure(null);
    const found = validate();
    setErrors(found);
    if (!isClean(found)) return;

    setPending(true);
    try {
      // The real call records the visit. Offline it is queued instead, which
      // is what `POST /chw/sync` exists to drain — see BACKEND.md.
      await submit<unknown>(
        () =>
          api.chw.createVisit({
            chwId: CHW_ID,
            patientId: PATIENT_ID,
            scheduledFor: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            purpose: "Blood pressure check",
            notes: values.notes || undefined,
            vitals: {
              id: crypto.randomUUID(),
              patientId: PATIENT_ID,
              recordedAt: new Date().toISOString(),
              recordedByChwId: CHW_ID,
              systolic: Number(values.systolic) || undefined,
              diastolic: Number(values.diastolic) || undefined,
              temperatureC: Number(values.temperature) || undefined,
              pulseBpm: Number(values.pulse) || undefined,
            },
          }),
        () => ({ ok: true }),
      );
      setSaved(true);
    } catch (error) {
      setFailure(describeFailure(error).message);
    } finally {
      setPending(false);
    }
  }

  const field = (key: keyof Values, label: string, placeholder: string) => (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      <TextInput
        placeholder={placeholder}
        value={values[key]}
        onChange={set(key)}
        inputMode="numeric"
        invalid={Boolean(errors[key])}
      />
      {errors[key] && (
        <span role="alert" className="mt-1.5 block text-xs font-medium text-alert">
          {errors[key]}
        </span>
      )}
    </label>
  );

  return (
    <form onSubmit={onSubmit} noValidate>
      <section className="mt-7 rounded-[10px] border border-line bg-surface p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Measurements</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {field("systolic", "Blood pressure — top", "172")}
          {field("diastolic", "Blood pressure — bottom", "104")}
          {field("temperature", "Temperature (°C)", "37.2")}
          {field("pulse", "Pulse (bpm)", "96")}
        </div>
      </section>

      {breached && (
        <section className="mt-4 rounded-[10px] border border-alert bg-alert-wash p-6">
          <p className="text-[15px] font-semibold text-ink">
            That is above the number Dr. Okonkwo asked to be told about
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            Her standing instruction is to be told the same day if the top number goes above 160.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setEscalate(true)}
              className="rounded-full bg-alert px-6 py-3 text-sm font-semibold text-white"
            >
              Send to Dr. Okonkwo now
            </button>
            <button
              type="button"
              className="rounded-full border border-line-strong px-6 py-3 text-sm font-semibold text-ink"
            >
              Not this time — say why
            </button>
          </div>
        </section>
      )}

      <section className="mt-4 rounded-[10px] border border-line bg-surface p-6">
        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
            What you observed
          </span>
          <textarea
            rows={5}
            value={values.notes}
            onChange={(e) => set("notes")(e.target.value)}
            placeholder="She says the headache started on Sunday. Taking her tablets but ran out on Friday."
            className="mt-3 w-full resize-none rounded-[8px] border border-line-strong bg-surface p-3.5 text-sm text-ink outline-none placeholder:text-muted focus:border-pine"
          />
        </label>
      </section>

      <div className="mt-6 flex items-center gap-3 rounded-[10px] bg-clay-wash px-5 py-4">
        <span className="text-clay">
          <WifiOffIcon />
        </span>
        <p className="text-sm text-ink-soft">
          No network here. This saves on your phone and sends when you reach signal.
        </p>
      </div>

      {failure && <ErrorState title="We could not save that" body={failure} />}
      {saved && (
        <p
          role="status"
          className="mt-4 flex items-center gap-2.5 rounded-[10px] bg-pine-wash px-5 py-4 text-sm font-semibold text-pine"
        >
          <CheckIcon size={17} /> Saved on this phone. It sends itself when you have signal.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="tap mt-6 w-full rounded-full bg-pine py-3.5 text-center text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Saving…" : "Finish this visit"}
      </button>

      <SendToDoctorDialog open={escalate} onClose={() => setEscalate(false)} />
    </form>
  );
}
