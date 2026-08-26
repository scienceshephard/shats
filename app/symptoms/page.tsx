import Link from "next/link";
import { PatientPage } from "@/components/shells";
import { ArrowRight, ListenButton } from "@/components/ui";

const SYMPTOMS = [
  { en: "Fever", local: "Ahụ ọkụ", on: true },
  { en: "Cough", local: "Ụkwara", on: false },
  { en: "Belly pain", local: "Afọ mgbu", on: false },
  { en: "Cannot sleep", local: "Anaghị ehi ụra", on: false },
  { en: "Headache", local: "Isi ọwụwa", on: false },
  { en: "A wound", local: "Ọnyá", on: false },
];

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

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {SYMPTOMS.map((s) => (
          <button
            key={s.en}
            className={`flex min-h-[92px] items-center gap-4 rounded-[12px] border px-5 text-left ${
              s.on ? "border-2 border-pine bg-pine-wash" : "border-line bg-surface"
            }`}
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                s.on ? "bg-pine text-white" : "bg-paper text-ink-soft"
              }`}
            >
              ●
            </span>
            <span>
              <span className="block text-[18px] font-semibold text-ink">{s.en}</span>
              <span className="block text-sm text-muted">{s.local}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-[12px] border border-line bg-surface p-5">
        <p className="text-[17px] font-semibold text-ink">
          Cannot find it? Say it in your own words.
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          Hold the button and talk. The doctor will hear exactly what you said.
        </p>
        <button className="tap mt-4 w-full rounded-full border border-line-strong bg-paper text-[16px] font-semibold text-ink">
          Hold to record
        </button>
      </div>

      <Link
        href="/doctors"
        className="tap mt-10 flex w-full items-center justify-center gap-3 rounded-full bg-pine text-[18px] font-semibold text-white"
      >
        Next question <ArrowRight />
      </Link>
    </PatientPage>
  );
}
