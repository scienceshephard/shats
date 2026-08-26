import { PatientPage } from "@/components/shells";
import { ListenButton } from "@/components/ui";
import { currentPatient, vitalsHistory } from "@/lib/mock";

const dateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });

/**
 * R12 — My health. Built as a timeline rather than a grid of stat cards: a
 * person wants to know what happened and in what order, not a dashboard.
 */
export default function Health() {
  return (
    <PatientPage goNextExclude="/health">
      <h1 className="font-display text-[clamp(28px,5vw,36px)] font-semibold text-ink">
        My health
      </h1>
      <p className="mt-3 max-w-[540px] text-[15px] leading-relaxed text-muted">
        Everything that has been written about you. You can show this to any doctor, even one
        outside SHATS.
      </p>
      <ListenButton text="This is your health record. It belongs to you and it goes with you." className="mt-4" />

      <section className="mt-9">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-clay">
          Things to remember
        </p>
        <div className="mt-4 rounded-[14px] border-2 border-alert bg-alert-wash p-5">
          <p className="text-[17px] font-semibold text-alert">
            You are allergic to {currentPatient.allergies.join(", ")}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Every doctor on SHATS is warned before they can prescribe. Tell any doctor outside
            SHATS yourself.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-clay">
          What has happened
        </p>

        <ol className="mt-5 border-l-2 border-line pl-6">
          {vitalsHistory.map((v, i) => (
            <li key={v.id} className="relative pb-9 last:pb-0">
              <span
                className={`absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-paper ${
                  i === 0 ? "bg-pine" : "bg-line-strong"
                }`}
              />
              <p className="text-sm text-muted">{dateLabel(v.recordedAt)}</p>
              <p className="mt-1 text-[18px] font-semibold text-ink">
                {i === 0 ? "Visit from your health worker" : "Blood pressure check"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {[
                  { label: "Blood pressure", value: `${v.systolic}/${v.diastolic}` },
                  { label: "Temperature", value: `${v.temperatureC}°C` },
                  { label: "Pulse", value: `${v.pulseBpm}` },
                ].map((m) => (
                  <span
                    key={m.label}
                    className="rounded-[8px] border border-line bg-surface px-3.5 py-2.5"
                  >
                    <span className="block text-[11px] uppercase tracking-wide text-muted">
                      {m.label}
                    </span>
                    <span className="block font-display text-[19px] font-semibold text-ink">
                      {m.value}
                    </span>
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </PatientPage>
  );
}
