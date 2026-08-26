import { PatientPage } from "@/components/shells";
import { ListenButton, PhoneIcon } from "@/components/ui";
import { currentPatient } from "@/lib/mock";
import { LogOutTrigger } from "@/components/dialogs/triggers";

const ROWS = [
  { title: "My language", value: "Igbo", sub: "Every screen is read aloud in this language" },
  { title: "My phone number", value: "0803 555 0142", sub: "Codes and reminders come here" },
  { title: "My health worker", value: "Ngozi Eze", sub: "Ede-Oballa · 0803 555 0198" },
  { title: "How to use SHATS", value: "", sub: "Short lessons, read aloud" },
];

/** R13 — Profile. A settings page, so it reads as a list, not as a hub. */
export default function Profile() {
  return (
    <PatientPage goNextExclude="/profile">
      <div className="flex items-center gap-5">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-pine font-display text-3xl font-bold text-white">
          {currentPatient.fullName[0]}
        </span>
        <div>
          <h1 className="font-display text-[clamp(26px,4.5vw,32px)] font-semibold text-ink">
            {currentPatient.fullName}
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            SHATS number {currentPatient.shatsId} · {currentPatient.community},{" "}
            {currentPatient.state}
          </p>
        </div>
      </div>
      <ListenButton text="This is your profile. You can change your language and your details here." className="mt-5" />

      <p className="mt-9 text-[11px] font-bold uppercase tracking-[0.15em] text-clay">
        Your details
      </p>
      <ul className="mt-4 divide-y divide-line overflow-hidden rounded-[14px] border border-line bg-surface">
        {ROWS.map((r) => (
          <li key={r.title}>
            <button className="flex w-full items-center justify-between gap-4 p-5 text-left hover:bg-paper">
              <span>
                <span className="block text-[18px] font-semibold text-ink">{r.title}</span>
                <span className="mt-1 block text-sm text-muted">{r.sub}</span>
              </span>
              <span className="shrink-0 text-[16px] font-semibold text-pine">{r.value}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-[12px] border border-line bg-surface p-5">
        <p className="flex items-center gap-2.5 text-[15px] font-semibold text-ink">
          <PhoneIcon /> Using a phone with no internet
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Dial <span className="font-semibold text-ink">*737#</span> from the number above. You can
          book, check your medicine, and call for help from the menu.
        </p>
      </div>

      <LogOutTrigger />
      <p className="mt-3 text-center text-sm text-muted">
        Logging out does not delete anything. Your record stays yours.
      </p>
    </PatientPage>
  );
}
