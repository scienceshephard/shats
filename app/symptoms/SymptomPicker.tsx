"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckIcon } from "@/components/ui";
import { ToggleGroup } from "@/components/Selectable";

/**
 * R5 — what is wrong. Multi-select, because the screen says so: "Tap
 * everything that is true. You can choose more than one."
 *
 * The codes match `SymptomCode` in lib/types.ts, so what is collected here is
 * already the shape `POST /appointments` wants for its `symptoms.codes`.
 */
const SYMPTOMS = [
  { id: "FEVER", en: "Fever", local: "Ahụ ọkụ" },
  { id: "COUGH", en: "Cough", local: "Ụkwara" },
  { id: "BELLY_PAIN", en: "Belly pain", local: "Afọ mgbu" },
  { id: "CANNOT_SLEEP", en: "Cannot sleep", local: "Anaghị ehi ụra" },
  { id: "HEADACHE", en: "Headache", local: "Isi ọwụwa" },
  { id: "INJURY", en: "A wound", local: "Ọnyá" },
];

export function SymptomPicker() {
  const [picked, setPicked] = useState<string[]>(["FEVER"]);

  return (
    <>
      <ToggleGroup
        className="mt-8 grid gap-3 sm:grid-cols-2"
        items={SYMPTOMS}
        initial={["FEVER"]}
        onChange={setPicked}
      >
        {(s, on, toggle) => (
          <button
            onClick={toggle}
            aria-pressed={on}
            className={`selectable ${on ? "selectable-on" : ""} flex min-h-[92px] items-center gap-4 rounded-[12px] border-2 px-5 text-left ${
              on ? "border-pine bg-pine-wash" : "border-line bg-surface hover:border-line-strong"
            }`}
          >
            <span
              className={`selectable flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                on ? "bg-pine text-white" : "bg-paper text-ink-soft"
              }`}
            >
              <span className={`selectable-mark ${on ? "selectable-mark-on" : "selectable-mark-off"}`}>
                <CheckIcon size={20} />
              </span>
            </span>
            <span>
              <span className="block text-[18px] font-semibold text-ink">{s.en}</span>
              <span className="block text-sm text-muted">{s.local}</span>
            </span>
          </button>
        )}
      </ToggleGroup>

      <div className="mt-8 rounded-[12px] border border-line bg-surface p-5">
        <p className="text-[17px] font-semibold text-ink">
          Cannot find it? Say it in your own words.
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          Hold the button and talk. The doctor will hear exactly what you said.
        </p>
        <button className="tap selectable mt-4 w-full rounded-full border-2 border-line-strong bg-paper text-[16px] font-semibold text-ink hover:border-pine hover:text-pine">
          Hold to record
        </button>
      </div>

      {/* Nothing chosen is a real state: the button says so rather than
          leading to a doctor with an empty reason. */}
      <Link
        href={`/doctors?symptoms=${picked.join(",")}`}
        aria-disabled={picked.length === 0}
        className={`tap selectable mt-10 flex w-full items-center justify-center gap-3 rounded-full text-[18px] font-semibold ${
          picked.length === 0
            ? "pointer-events-none bg-line-strong text-paper"
            : "bg-pine text-white"
        }`}
      >
        {picked.length === 0 ? "Tap what is wrong first" : "Next question"}
        {picked.length > 0 && <ArrowRight />}
      </Link>
    </>
  );
}
