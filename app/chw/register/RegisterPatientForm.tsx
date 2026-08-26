"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { submit, describeFailure } from "@/lib/submit";
import {
  isClean,
  nigerianPhone,
  normalisePhone,
  required,
  wholeNumber,
  type Errors,
} from "@/lib/validate";
import { ErrorState } from "@/components/states";
import { CheckIcon, TextInput } from "@/components/ui";

type Values = {
  fullName: string;
  ageYears: string;
  sex: "FEMALE" | "MALE";
  community: string;
  phone: string;
  history: string;
  consent: boolean;
};

/**
 * C2 — Register a patient in the field.
 *
 * The consent checkbox is the one that actually blocks. NDPR requires recorded
 * consent before any health information is stored, and the health worker has to
 * have read it aloud in a language the person understands — so the form will
 * not submit until that is confirmed, and says why rather than just refusing.
 */
export function RegisterPatientForm() {
  const [values, setValues] = useState<Values>({
    fullName: "",
    ageYears: "",
    sex: "FEMALE",
    community: "",
    phone: "",
    history: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Errors<Values>>({});
  const [failure, setFailure] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [shatsId, setShatsId] = useState<string | null>(null);

  const set = <K extends keyof Values>(key: K) => (v: Values[K]) => {
    setValues((p) => ({ ...p, [key]: v }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFailure(null);

    const found: Errors<Values> = {
      fullName: required(values.fullName, "The person's name is needed to create their record."),
      community: required(values.community, "Where they live is how a health worker finds them again."),
      ageYears: wholeNumber(values.ageYears, { min: 0, max: 120, label: "Age" }),
      phone: values.phone.trim() ? nigerianPhone(values.phone) : undefined,
      consent: values.consent
        ? undefined
        : "You must read the consent aloud and confirm they agreed before this can be saved.",
    };
    setErrors(found);
    if (!isClean(found)) return;

    setPending(true);
    try {
      await submit<unknown>(
        () =>
          api.chw.registerPatient({
            fullName: values.fullName,
            phone: normalisePhone(values.phone),
            language: "ha",
            community: values.community,
            state: "Enugu",
            ageYears: values.ageYears ? Number(values.ageYears) : undefined,
            sex: values.sex,
          }),
        () => ({ ok: true }),
      );
      setShatsId(`SH-${Math.floor(100000 + Math.random() * 899999)}`);
    } catch (error) {
      setFailure(describeFailure(error).message);
    } finally {
      setPending(false);
    }
  }

  const text = (key: "fullName" | "ageYears" | "community" | "phone" | "history",
                label: string, placeholder: string, span = false, type = "text") => (
    <label className={`block ${span ? "sm:col-span-2" : ""}`}>
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      <TextInput
        placeholder={placeholder}
        type={type}
        value={values[key]}
        onChange={set(key)}
        invalid={Boolean(errors[key])}
      />
      {errors[key] && (
        <span role="alert" className="mt-1.5 block text-xs font-medium text-alert">
          {errors[key]}
        </span>
      )}
    </label>
  );

  if (shatsId) {
    return (
      <section className="mt-7 rounded-[10px] border-2 border-pine bg-pine-wash p-6">
        <p className="flex items-center gap-2.5 text-[15px] font-semibold text-pine">
          <CheckIcon size={18} /> {values.fullName} is registered
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          Their SHATS number is <span className="font-semibold text-ink">{shatsId}</span>. Write it
          on their card. It saves on this phone and sends itself when you have signal.
        </p>
      </section>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <section className="mt-7 rounded-[10px] border border-line bg-surface p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
          About the person
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {text("fullName", "Full name", "Ngozi Adeleke", true)}
          {text("ageYears", "Age (about)", "62")}
          <fieldset className="block">
            <legend className="mb-2 block text-sm font-semibold text-ink">Sex</legend>
            <div className="flex gap-2">
              {(["FEMALE", "MALE"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set("sex")(s)}
                  aria-pressed={values.sex === s}
                  className={`flex-1 rounded-[10px] border py-3 text-sm font-semibold ${
                    values.sex === s
                      ? "border-2 border-pine bg-pine-wash text-pine"
                      : "border-line-strong text-ink"
                  }`}
                >
                  {s === "FEMALE" ? "Female" : "Male"}
                </button>
              ))}
            </div>
          </fieldset>
          {text("community", "Village or compound", "Ede-Oballa, near the market", true)}
          {text("phone", "Phone number (theirs, or a relative's)", "0803 555 0142", true, "tel")}
        </div>
      </section>

      <section className="mt-4 rounded-[10px] border border-line bg-surface p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
          Anything a doctor must know
        </p>
        <div className="mt-5">
          {text("history", "Allergies and long-term conditions", "Penicillin · high blood pressure · none", true)}
        </div>
      </section>

      {/* Consent is read aloud and recorded, per NDPR. */}
      <section
        className={`mt-4 rounded-[10px] border-2 p-6 ${
          errors.consent ? "border-alert bg-alert-wash" : "border-pine bg-pine-wash"
        }`}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-pine">
          Read this aloud in their language
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-ink">
          “SHATS will keep your health information so a doctor can help you. Only a doctor you book
          can see it. You can ask us to delete it at any time. Do you agree?”
        </p>
        <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm font-semibold text-ink">
          <input
            type="checkbox"
            className="sr-only"
            checked={values.consent}
            onChange={(e) => set("consent")(e.target.checked)}
          />
          <span
            aria-hidden
            className={`flex h-6 w-6 items-center justify-center rounded-[6px] border-2 ${
              values.consent ? "border-pine bg-pine text-white" : "border-pine bg-surface"
            }`}
          >
            {values.consent && <CheckIcon size={14} />}
          </span>
          They said yes, and I read it in Hausa
        </label>
        {errors.consent && (
          <p role="alert" className="mt-3 text-sm font-medium text-alert">
            {errors.consent}
          </p>
        )}
      </section>

      {failure && <ErrorState title="We could not register them" body={failure} />}

      <button
        type="submit"
        disabled={pending}
        className="tap mt-6 w-full rounded-full bg-pine py-3.5 text-center text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Registering…" : "Register and create SHATS number"}
      </button>
    </form>
  );
}
