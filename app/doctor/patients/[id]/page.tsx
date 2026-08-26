import Link from "next/link";
import { ProTop } from "@/components/shells";
import { Pill } from "@/components/ui";
import { currentPatient, vitalsHistory } from "@/lib/mock";

const NAV = [
  { href: "/doctor", label: "Schedule" },
  { href: "/doctor/patients", label: "My patients", active: true },
  { href: "/doctor/consultation", label: "Consultation room" },
];

const HISTORY = [
  { date: "13 Aug 2026", title: "Malaria — confirmed by RDT", by: "Dr. C. Okonkwo", note: "Coartem 1 tab BD ×3 days. Advised to complete the course." },
  { date: "02 Jun 2026", title: "Blood pressure review", by: "CHW N. Eze", note: "134/88. Within the range Dr. Okonkwo set. No escalation." },
  { date: "12 Mar 2026", title: "Intake and registration", by: "CHW N. Eze", note: "Registered in the field. Penicillin allergy reported by the patient's wife." },
];

/** D4 — Patient record. Every allergy and its provenance is visible up top. */
export default async function PatientRecord({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;

  return (
    <div className="min-h-screen bg-paper">
      <ProTop links={NAV} right={<span className="text-sm font-semibold text-ink">Dr. Okonkwo</span>} />

      <main className="px-7 py-8">
        <Link href="/doctor/patients" className="text-sm text-ink-soft hover:text-ink">
          ← All patients
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-pine font-display text-xl font-bold text-white">
              {currentPatient.fullName[0]}
            </span>
            <div>
              <h1 className="font-display text-[30px] font-semibold text-ink">
                {currentPatient.fullName}
              </h1>
              <p className="mt-1 text-sm text-muted">
                {currentPatient.ageYears} · {currentPatient.sex === "MALE" ? "Male" : "Female"} ·
                SHATS ID {currentPatient.shatsId} · {currentPatient.community},{" "}
                {currentPatient.state}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="rounded-full border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink">
              Refer to facility
            </button>
            <Link
              href="/doctor/consultation"
              className="rounded-full bg-pine px-5 py-2.5 text-sm font-semibold text-white"
            >
              Start consultation
            </Link>
          </div>
        </div>

        {/* Allergies come first and cite where they came from, because that is
            what the prescribing check will fire on. */}
        <div className="mt-6 rounded-[10px] border-2 border-alert bg-alert-wash p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-alert">
            Allergies and cautions
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            {currentPatient.allergies.map((a) => (
              <Pill key={a} tone="alert">
                {a}
              </Pill>
            ))}
            <span className="text-xs text-ink-soft">
              Recorded by CHW N. Eze at intake, 12 Mar 2026
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_340px]">
          <section className="rounded-[10px] border border-line bg-surface p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
              Clinical history
            </p>
            <ol className="mt-5 border-l-2 border-line pl-6">
              {HISTORY.map((h, i) => (
                <li key={h.date} className="relative pb-7 last:pb-0">
                  <span
                    className={`absolute -left-[29px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-surface ${
                      i === 0 ? "bg-pine" : "bg-line-strong"
                    }`}
                  />
                  <p className="text-xs text-muted">
                    {h.date} · {h.by}
                  </p>
                  <p className="mt-1 text-[16px] font-semibold text-ink">{h.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{h.note}</p>
                </li>
              ))}
            </ol>
          </section>

          <aside className="space-y-4">
            <div className="rounded-[10px] border border-line bg-surface p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                Latest vitals
              </p>
              <p className="mt-1 text-xs text-muted">
                Taken by CHW N. Eze, 13 Aug 2026
              </p>
              <div className="mt-4 space-y-2.5">
                {[
                  { k: "Blood pressure", v: `${vitalsHistory[0].systolic}/${vitalsHistory[0].diastolic}` },
                  { k: "Temperature", v: `${vitalsHistory[0].temperatureC}°C` },
                  { k: "Pulse", v: `${vitalsHistory[0].pulseBpm} bpm` },
                ].map((m) => (
                  <div key={m.k} className="flex items-baseline justify-between">
                    <span className="text-sm text-ink-soft">{m.k}</span>
                    <span className="font-display text-lg font-semibold text-ink">{m.v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[10px] border border-line bg-surface p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                Care team
              </p>
              <p className="mt-3 text-sm font-semibold text-ink">Ngozi Eze</p>
              <p className="text-xs text-muted">Community health worker · Ede-Oballa</p>
              <p className="mt-3 text-sm font-semibold text-ink">Dr. Chidi Okonkwo</p>
              <p className="text-xs text-muted">General practice · you</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
