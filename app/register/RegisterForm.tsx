"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { submit, describeFailure } from "@/lib/submit";
import { nigerianPhone, normalisePhone, required, isClean, type Errors } from "@/lib/validate";
import { ErrorState } from "@/components/states";
import { ArrowRight, Field, TextInput } from "@/components/ui";

type Values = { fullName: string; phone: string; community: string };

/**
 * R2 — Create account.
 *
 * Validation runs on submit rather than on every keystroke: correcting someone
 * while they are still typing their own name is hostile, and these screens are
 * used by people who type slowly.
 */
export function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState<Values>({ fullName: "", phone: "", community: "" });
  const [errors, setErrors] = useState<Errors<Values>>({});
  const [failure, setFailure] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const set = (key: keyof Values) => (v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    // Clear a field's complaint as soon as they start fixing it.
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFailure(null);

    const found: Errors<Values> = {
      fullName: required(values.fullName, "We need your name so the doctor knows who they are seeing."),
      phone: nigerianPhone(values.phone),
      community: required(values.community, "We need your village or town to find a health worker near you."),
    };
    setErrors(found);
    if (!isClean(found)) return;

    setPending(true);
    try {
      const phone = normalisePhone(values.phone);
      await submit(
        () => api.auth.requestOtp(phone),
        () => ({ sentTo: phone, expiresInSeconds: 300 }),
      );
      router.push(`/verify?phone=${encodeURIComponent(phone)}`);
    } catch (error) {
      const { message, fields } = describeFailure(error);
      setFailure(message);
      if (fields) setErrors((prev) => ({ ...prev, ...fields }));
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="mt-9 space-y-7">
        <Field label="Your name" error={errors.fullName}>
          <TextInput
            placeholder="Emeka Okafor"
            value={values.fullName}
            onChange={set("fullName")}
            autoComplete="name"
            invalid={Boolean(errors.fullName)}
          />
        </Field>

        <Field
          label="Phone number"
          hint="We send a code to this number. It can be a family member's phone."
          error={errors.phone}
        >
          <TextInput
            placeholder="0803 555 0142"
            type="tel"
            value={values.phone}
            onChange={set("phone")}
            autoComplete="tel"
            invalid={Boolean(errors.phone)}
          />
        </Field>

        <Field label="Which village or town?" error={errors.community}>
          <TextInput
            placeholder="Ede-Oballa, Nsukka"
            value={values.community}
            onChange={set("community")}
            invalid={Boolean(errors.community)}
          />
        </Field>
      </div>

      {failure && <ErrorState title="We could not send your code" body={failure} />}

      <button
        type="submit"
        disabled={pending}
        className="tap mt-10 flex w-full items-center justify-center gap-3 rounded-full bg-pine text-[18px] font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Sending your code…" : "Send me a code"}
        {!pending && <ArrowRight />}
      </button>
    </form>
  );
}
