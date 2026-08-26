import Link from "next/link";
import { PatientPage } from "@/components/shells";
import { CheckIcon, ListenButton, PhoneIcon } from "@/components/ui";
import { CancelVisitTrigger } from "@/components/dialogs/triggers";

/** R9 — Confirmation. Says what will happen next, and what to do if it doesn't. */
export default function Booked() {
  return (
    <PatientPage goNextExclude="/symptoms">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-pine text-white">
        <CheckIcon size={38} />
      </div>

      <h1 className="mt-7 font-display text-[clamp(30px,5vw,40px)] font-semibold text-pine">
        You are booked.
      </h1>
      <p className="mt-3 max-w-[520px] text-[17px] leading-relaxed text-ink-soft">
        Dr. Chidi Okonkwo will talk to you <strong className="text-ink">today at 10:00</strong>, by
        video, in Igbo.
      </p>
      <ListenButton text="You are booked. We will tell you when the doctor is ready for you." className="mt-4" />

      <section className="mt-9 rounded-[14px] border border-line bg-surface p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-clay">
          What happens now
        </p>
        <ol className="mt-4 space-y-4">
          {[
            "We send you a text message one hour before, and again five minutes before.",
            "Open SHATS and press the big button that says Join your doctor now.",
            "If your network is weak we move you to voice by ourselves. You do nothing.",
          ].map((line, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pine-wash text-sm font-bold text-pine">
                {i + 1}
              </span>
              <span className="text-[15.5px] leading-relaxed text-ink-soft">{line}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-4 rounded-[12px] bg-clay-wash p-5">
        <p className="flex items-center gap-2.5 text-[15px] font-semibold text-clay">
          <PhoneIcon /> If you cannot join
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Call your health worker Ngozi Eze on 0803 555 0198. She can sit with you and hold the
          phone during the call.
        </p>
      </div>

      <CancelVisitTrigger />

      <Link
        href="/home"
        className="tap mt-8 flex w-full items-center justify-center rounded-full border border-line-strong bg-surface text-[17px] font-semibold text-ink"
      >
        Back to home
      </Link>
    </PatientPage>
  );
}
