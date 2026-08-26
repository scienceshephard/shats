import Link from "next/link";
import { PatientPage } from "@/components/shells";
import { ArrowRight, Pill, SpeakerIcon } from "@/components/ui";
import { currentPatient, doctors, nextAppointment } from "@/lib/mock";
import { DoctorReadyBanner } from "@/components/dialogs/triggers";

/**
 * R4 — Home. A hub, not a dashboard: one greeting, one thing happening now,
 * then one clearly dominant action.
 */
export default function Home() {
  const doctor = doctors.find((d) => d.id === nextAppointment.doctorId)!;
  const firstName = currentPatient.fullName.split(" ")[0];

  return (
    <PatientPage showGoNext={false}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[15px] text-muted">Good morning,</p>
          <h1 className="mt-1 font-display text-[clamp(30px,5vw,38px)] font-semibold text-ink">
            {firstName}
          </h1>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-amber px-4 py-2.5 text-sm font-semibold text-ink">
          <SpeakerIcon /> Listen
        </span>
      </div>

      {/* What is happening now — the only card that gets the dark treatment. */}
      <section className="mt-8 rounded-[14px] bg-pine p-6 text-white">
        <Pill tone="amber">In 24 minutes</Pill>
        <h2 className="mt-4 font-display text-[26px] font-semibold">
          {doctor.fullName} is waiting for you
        </h2>
        <p className="mt-2 text-sm text-white/70">
          Today at 10:00 · by video · already paid
        </p>
        <Link
          href="/consultation"
          className="tap mt-5 flex w-full items-center justify-center gap-3 rounded-[10px] bg-white text-[17px] font-semibold text-pine"
        >
          Join your doctor now
        </Link>
      </section>

      <h2 className="mt-12 font-display text-[26px] font-semibold text-ink">
        What do you need today?
      </h2>

      <Link
        href="/symptoms"
        className="mt-5 flex items-center justify-between rounded-[14px] bg-pine p-6 text-white"
      >
        <span>
          <span className="block font-display text-[26px] font-semibold">See a doctor</span>
          <span className="mt-1 block text-sm text-white/75">
            Talk by video, voice or writing. Most people wait {doctor.averageWaitMinutes} minutes.
          </span>
        </span>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
          <ArrowRight />
        </span>
      </Link>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Link
          href="/medicines"
          className="rounded-[14px] border border-line bg-surface p-6 hover:border-line-strong"
        >
          <span className="block text-[19px] font-semibold text-ink">My medicines</span>
          <span className="mt-1.5 block text-sm text-muted">What to take, and when</span>
        </Link>
        <Link
          href="/health"
          className="rounded-[14px] border border-line bg-surface p-6 hover:border-line-strong"
        >
          <span className="block text-[19px] font-semibold text-ink">My health</span>
          <span className="mt-1.5 block text-sm text-muted">Visits, results and papers</span>
        </Link>
      </div>

      <DoctorReadyBanner />

      <Link
        href="/emergency"
        className="mt-3 flex items-center justify-between rounded-[14px] border border-alert bg-alert-wash p-6"
      >
        <span>
          <span className="block font-display text-[22px] font-semibold text-alert">
            Emergency — I need help now
          </span>
          <span className="mt-1 block text-sm text-ink-soft">
            Free, always. A health worker comes to you.
          </span>
        </span>
        <ArrowRight />
      </Link>
    </PatientPage>
  );
}
