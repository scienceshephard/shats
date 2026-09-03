"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo, Pill } from "@/components/ui";
import {
  EndConsultationDialog,
  PatientNotJoinedDialog,
  PrescribingConflictDialog,
} from "@/components/dialogs/doctor";

/**
 * D2 — Consultation room.
 *
 * Two columns: the call on the left, the clinical workspace on the right, so
 * notes are written without leaving the patient's face.
 */
export default function DoctorConsultation() {
  const [dialog, setDialog] = useState<null | "end" | "conflict" | "no-show">(null);
  // Call controls are toggles, so they have to show their own state — a mute
  // button that looks identical muted and unmuted is worse than none.
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(true);
  const [chwInvited, setChwInvited] = useState(false);

  return (
    <div className="flex min-h-screen bg-night">
      {/* --------------------------- video column --------------------------- */}
      <section className="flex flex-1 flex-col p-6">
        <header className="flex items-center justify-between">
          <Logo variant="light" height={26} />
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-night-text">
            <span className="h-2 w-2 rounded-full bg-[#5FBF7A]" /> Connected · 04:12
          </span>
        </header>

        <div className="mt-5 flex flex-1 flex-col items-center justify-center rounded-[12px] bg-night-2">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-pine-mid font-display text-3xl font-bold text-white">
            EO
          </div>
          <p className="mt-5 font-display text-2xl font-semibold text-white">Emeka Okafor</p>
          <p className="mt-1.5 text-sm text-night-muted">34 · Male · Ede-Oballa · SHATS 004182</p>
          <p className="mt-6 rounded-full bg-clay-wash px-4 py-2 text-xs font-semibold text-clay">
            Network weak — audio only
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => setMuted((m) => !m)}
            aria-pressed={muted}
            className={`selectable ${muted ? "selectable-on" : ""} rounded-full px-6 py-3 text-sm font-semibold ${
              muted ? "bg-amber text-[#2A1D08]" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {muted ? "Unmute" : "Mute"}
          </button>
          <button
            onClick={() => setCameraOff((c) => !c)}
            aria-pressed={cameraOff}
            className={`selectable ${cameraOff ? "selectable-on" : ""} rounded-full px-6 py-3 text-sm font-semibold ${
              cameraOff ? "bg-amber text-[#2A1D08]" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {cameraOff ? "Camera off" : "Camera on"}
          </button>
          <button
            onClick={() => setChwInvited((c) => !c)}
            aria-pressed={chwInvited}
            className={`selectable ${chwInvited ? "selectable-on" : ""} rounded-full px-6 py-3 text-sm font-semibold ${
              chwInvited ? "bg-pine text-white" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {chwInvited ? "Health worker invited" : "Invite the health worker"}
          </button>
          <button
            onClick={() => setDialog("no-show")}
            className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white"
          >
            Patient has not joined
          </button>
          <button
            onClick={() => setDialog("end")}
            className="ml-auto rounded-full bg-alert px-6 py-3 text-sm font-semibold text-white"
          >
            End consultation
          </button>
        </div>
      </section>

      {/* ------------------------ clinical workspace ------------------------ */}
      <aside className="w-[420px] shrink-0 overflow-y-auto bg-paper p-6">
        <div className="rounded-[10px] border-2 border-alert bg-alert-wash p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-alert">
            Allergies
          </p>
          <p className="mt-2 text-sm font-semibold text-ink">Penicillin</p>
          <p className="mt-1 text-xs text-ink-soft">Recorded by CHW N. Eze, 12 Mar 2026</p>
        </div>

        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
            Presenting complaint
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Fever and joint pain for 3 days. Selected “Fever” and “Belly pain” on intake.
          </p>
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
            Consultation notes
          </p>
          <textarea
            rows={7}
            defaultValue="Febrile, reports joint pain and headache. No rash. RDT requested via CHW."
            className="mt-2 w-full resize-none rounded-[8px] border border-line-strong bg-surface p-3.5 text-sm text-ink outline-none focus:border-pine"
          />
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
            Prescription
          </p>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between rounded-[8px] border border-line bg-surface p-3.5">
              <div>
                <p className="text-sm font-semibold text-ink">Coartem</p>
                <p className="text-xs text-muted">1 tablet, twice daily, 3 days</p>
              </div>
              <Pill tone="pine">ready</Pill>
            </div>
            <button
              onClick={() => setDialog("conflict")}
              className="w-full rounded-[8px] border border-dashed border-line-strong py-3 text-sm font-semibold text-ink-soft hover:border-pine hover:text-pine"
            >
              + Add a medicine
            </button>
          </div>
        </div>

        <Link
          href="/doctor"
          className="mt-6 block rounded-full border border-line-strong py-3 text-center text-sm font-semibold text-ink"
        >
          Back to schedule
        </Link>
      </aside>

      {/* -------------------------------- dialogs --------------------------- */}
      <EndConsultationDialog open={dialog === "end"} onClose={() => setDialog(null)} />
      <PrescribingConflictDialog open={dialog === "conflict"} onClose={() => setDialog(null)} />
      <PatientNotJoinedDialog open={dialog === "no-show"} onClose={() => setDialog(null)} />
    </div>
  );
}
