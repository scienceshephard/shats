"use client";

import { useState } from "react";
import { EscalationDialog, StopAcceptingDialog } from "./doctor";
import {
  CannotReachDialog,
  EmergencyAssignedDialog,
  RecordsSentDialog,
  SubmitReportDialog,
} from "./chw";

/** Client islands for the doctor and health-worker screens. */

/* /doctor · DP5 -------------------------------------------------------------- */
export function AcceptingPatientsToggle() {
  const [open, setOpen] = useState(false);
  const [accepting, setAccepting] = useState(true);
  return (
    <>
      <button
        onClick={() => (accepting ? setOpen(true) : setAccepting(true))}
        aria-pressed={accepting}
        className="flex items-center gap-3 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink"
      >
        {accepting ? "Accepting patients" : "Not accepting"}
        <span
          className={`relative h-6 w-11 rounded-full transition-colors ${
            accepting ? "bg-pine" : "bg-line-strong"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
              accepting ? "right-0.5" : "left-0.5"
            }`}
          />
        </span>
      </button>
      <StopAcceptingDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          setAccepting(false);
          setOpen(false);
        }}
      />
    </>
  );
}

/* /doctor · DP1 -------------------------------------------------------------- */
export function EscalationActions() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setOpen(true)}
          className="flex-1 rounded-full bg-alert py-2.5 text-xs font-semibold text-white"
        >
          Join now
        </button>
        <button className="flex-1 rounded-full border border-line-strong py-2.5 text-xs font-semibold text-ink">
          Refer to facility
        </button>
      </div>
      <EscalationDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/* /chw · CP1 and CP5 ---------------------------------------------------------- */
export function RoundsTriggers() {
  const [dialog, setDialog] = useState<null | "assigned" | "synced">(null);
  return (
    <>
      <div className="mt-4 flex flex-wrap gap-2.5">
        <button
          onClick={() => setDialog("assigned")}
          className="rounded-full bg-alert px-5 py-2.5 text-sm font-semibold text-white"
        >
          Emergency near you
        </button>
        <button
          onClick={() => setDialog("synced")}
          className="rounded-full border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink"
        >
          Sync my records
        </button>
      </div>
      <EmergencyAssignedDialog open={dialog === "assigned"} onClose={() => setDialog(null)} />
      <RecordsSentDialog open={dialog === "synced"} onClose={() => setDialog(null)} />
    </>
  );
}

/* /chw/emergency · CP2 and CP4 ------------------------------------------------- */
export function EmergencyCaseTriggers() {
  const [dialog, setDialog] = useState<null | "report" | "unreachable">(null);
  return (
    <>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => setDialog("report")}
          className="tap flex-1 rounded-full bg-pine text-[17px] font-semibold text-white"
        >
          Close the case
        </button>
        <button
          onClick={() => setDialog("unreachable")}
          className="tap flex-1 rounded-full border border-line-strong bg-surface text-[17px] font-semibold text-ink"
        >
          I cannot reach them
        </button>
      </div>
      <SubmitReportDialog open={dialog === "report"} onClose={() => setDialog(null)} />
      <CannotReachDialog open={dialog === "unreachable"} onClose={() => setDialog(null)} />
    </>
  );
}
