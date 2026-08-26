import Link from "next/link";
import { PatientPage } from "@/components/shells";
import { CheckIcon, ListenButton, PhoneIcon, SirenIcon } from "@/components/ui";
import { SendEmergencyTrigger } from "@/components/dialogs/triggers";

/**
 * The emergency ask — the last chance to step back before the alert goes out.
 *
 * The only patient screen where the destructive-looking action is the primary
 * one: the big red button IS "yes, send help". Intent beats convention here.
 *
 * Confirming through POP5 leads to `/emergency/coming` (R14), which tracks the
 * alert once it is out.
 */
export default function EmergencyPage() {
  return (
    <PatientPage showGoNext={false}>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-alert text-white">
        <SirenIcon size={38} />
      </div>

      <h1 className="mt-7 font-display text-[clamp(28px,5vw,38px)] font-semibold text-alert">
        Do you need help now?
      </h1>
      <p className="mt-3 max-w-[540px] text-[17px] leading-relaxed text-ink-soft">
        Pressing this reaches your health worker, a doctor on call, and the nearest facility at the
        same time. It is free, and it works even if you have no money on your phone.
      </p>
      <ListenButton text="Do you need help now? A health worker near you will come to where you are. This is free." className="mt-4" />

      <section className="mt-8 rounded-[14px] border border-line bg-surface p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-clay">
          What we will share
        </p>
        <ul className="mt-4 space-y-3">
          {[
            "Where you are — Ede-Oballa, Nsukka",
            "Your name and SHATS number",
            "That you are allergic to penicillin",
          ].map((line) => (
            <li key={line} className="flex items-start gap-3 text-[15.5px] text-ink-soft">
              <span className="mt-0.5 text-pine">
                <CheckIcon size={17} />
              </span>
              {line}
            </li>
          ))}
        </ul>
      </section>

      <SendEmergencyTrigger />

      <Link
        href="/home"
        className="tap mt-3 flex w-full items-center justify-center rounded-full border border-line-strong bg-surface text-[17px] font-semibold text-ink"
      >
        No, go back
      </Link>

      <div className="mt-8 rounded-[12px] bg-pine-wash p-5">
        <p className="flex items-center gap-2.5 text-[15px] font-semibold text-pine">
          <PhoneIcon /> If the phone will not work
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Dial <span className="font-semibold text-ink">*737*0#</span> from any phone, on any
          network, with no airtime. It reaches the same people.
        </p>
      </div>
    </PatientPage>
  );
}
