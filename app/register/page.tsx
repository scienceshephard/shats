import { ListenButton, Logo, PhoneIcon } from "@/components/ui";
import { RegisterForm } from "./RegisterForm";

/** R2 — Create account. One question per block, nothing optional shown. */
export default function Register() {
  return (
    <div className="min-h-screen bg-paper">
      <header className="flex h-[68px] items-center border-b border-line bg-surface px-6">
        <Logo height={30} />
      </header>

      <main className="mx-auto w-full max-w-[640px] px-6 py-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-clay">Step 1 of 2</p>
        <h1 className="mt-4 font-display text-[clamp(26px,4.5vw,34px)] font-semibold text-ink">
          What is your name and phone number?
        </h1>
        <ListenButton text="What is your name and phone number? We will send a code to that number to check it is you." className="mt-4" />

        <RegisterForm />

        <div className="mt-8 rounded-[12px] border border-line bg-surface p-5">
          <p className="flex items-center gap-2.5 text-[15px] font-semibold text-ink">
            <PhoneIcon /> No phone of your own?
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            The health worker in your village can register you in person. Nothing has to be typed,
            and you do not need an ID card.
          </p>
        </div>
      </main>
    </div>
  );
}
