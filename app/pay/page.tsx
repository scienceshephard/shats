import { PatientPage } from "@/components/shells";
import { CheckIcon, ListenButton, PhoneIcon } from "@/components/ui";
import { naira } from "@/lib/mock";
import { PayForm } from "./PayForm";

/** R8 — Pay. The total is stated before any method is chosen. */
export default function Pay() {
  const fee = 150_000;

  return (
    <PatientPage showGoNext={false}>
      <h1 className="font-display text-[clamp(28px,5vw,36px)] font-semibold text-pine">
        How do you want to pay?
      </h1>
      <ListenButton text="How do you want to pay? Nothing is taken from you until you agree on your phone." className="mt-4" />

      <section className="mt-8 rounded-[14px] border-2 border-pine bg-pine-wash p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-pine">You will pay</p>
        <p className="mt-2 font-display text-[46px] font-semibold leading-none text-pine">
          {naira(fee)}
        </p>
        <p className="mt-3 text-[15px] text-ink-soft">
          Dr. Chidi Okonkwo · today at 10:00 · by video
        </p>
        <p className="mt-4 flex items-start gap-2.5 text-[14.5px] text-ink-soft">
          <span className="mt-0.5 text-pine">
            <CheckIcon size={17} />
          </span>
          Nothing else is added. If the doctor does not arrive, the money comes back to you within
          24 hours.
        </p>
      </section>

      <PayForm fee={fee} />

      <div className="mt-6 rounded-[12px] border border-line bg-surface p-5">
        <p className="flex items-center gap-2.5 text-[15px] font-semibold text-ink">
          <PhoneIcon /> No internet on this phone?
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Dial <span className="font-semibold text-ink">*737#</span> and follow the menu. The
          booking is held for you for one hour.
        </p>
      </div>
    </PatientPage>
  );
}
