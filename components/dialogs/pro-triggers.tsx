"use client";

import { useState } from "react";
import { ChangeFeeDialog, EscalationDialog, StopAcceptingDialog } from "./doctor";
import {
  CannotReachDialog,
  EmergencyAssignedDialog,
  GoOffDutyDialog,
  RecordsSentDialog,
  SubmitReportDialog,
} from "./chw";
import { LogOutIcon, MoonIcon, PencilIcon } from "../ui";
import { doctorNotices, naira, PLATFORM_FEE_PERCENT } from "@/lib/mock";

/** Client islands for the doctor and health-worker screens. */

/* /doctor · DP5 -------------------------------------------------------------- */
export function AcceptingPatientsToggle({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [accepting, setAccepting] = useState(true);
  return (
    <>
      <button
        onClick={() => (accepting ? setOpen(true) : setAccepting(true))}
        aria-pressed={accepting}
        aria-label={accepting ? "Accepting patients" : "Not accepting patients"}
        className={`selectable flex items-center gap-3 text-sm font-semibold text-ink ${
          compact ? "" : "rounded-full border border-line bg-surface px-4 py-2.5"
        }`}
      >
        {!compact && (accepting ? "Accepting patients" : "Not accepting")}
        <span
          className={`selectable relative h-6 w-11 rounded-full ${
            accepting ? "bg-pine" : "bg-line-strong"
          }`}
        >
          <span
            className={`selectable absolute top-0.5 h-5 w-5 rounded-full bg-white ${
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

/* /doctor/profile · DP6 ------------------------------------------------------- */

/**
 * The fee row and its own control.
 *
 * The row lives here rather than in the page's static list because the dialog
 * changes it: a server-rendered copy of the same number would keep showing the
 * old fee after saving, and the screen would contradict itself. One owner, one
 * value. The proposed fee is a fixed step up rather than a text field because
 * there is nothing to type yet — `payment-service` will own the real value.
 */
export function ChangeFeeTrigger({ feeKobo }: { feeKobo: number }) {
  const [open, setOpen] = useState(false);
  const [fee, setFee] = useState(feeKobo);
  const proposed = fee + 50_000;
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[4px] bg-paper px-4 py-3.5">
        <span>
          <span className="block text-[13.5px] text-ink-soft">Consultation fee</span>
          <span className="block font-display text-[22px] font-semibold text-ink">
            {naira(fee)}
          </span>
        </span>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:border-pine hover:text-pine"
        >
          <PencilIcon size={13} /> Change fee
        </button>
      </div>
      <ChangeFeeDialog
        open={open}
        onClose={() => setOpen(false)}
        fromKobo={fee}
        toKobo={proposed}
        feePercent={PLATFORM_FEE_PERCENT}
        bookedToday={2}
        onConfirm={() => {
          setFee(proposed);
          setOpen(false);
        }}
      />
    </>
  );
}

/** The notification switches. State only — nothing to send until the back end. */
export function NoticeToggles() {
  const [on, setOn] = useState(() => doctorNotices.map((n) => n.on));
  return (
    <div className="rounded-[14px] border border-line bg-surface p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
        HOW WE REACH YOU
      </p>
      <ul className="mt-3 space-y-3">
        {doctorNotices.map((n, i) => (
          <li key={n.label} className="flex items-center justify-between gap-3">
            <span className="text-[13px] text-ink-soft">{n.label}</span>
            <button
              onClick={() => setOn((prev) => prev.map((v, j) => (j === i ? !v : v)))}
              aria-pressed={on[i]}
              aria-label={n.label}
              className={`selectable relative h-[21px] w-9 shrink-0 rounded-full ${
                on[i] ? "bg-pine" : "bg-line-strong"
              }`}
            >
              <span
                className={`selectable absolute top-0.5 h-[15px] w-[15px] rounded-full bg-white ${
                  on[i] ? "right-0.5" : "left-0.5"
                }`}
              />
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        Emergencies also reach you by SMS, so a weak network cannot silence them.
      </p>
      <a
        href="/signout"
        className="mt-4 flex items-center justify-center gap-2 rounded-full border border-line-strong py-3 text-sm font-semibold text-ink"
      >
        <LogOutIcon /> Log out
      </a>
    </div>
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

/* /chw/profile · CP6 ---------------------------------------------------------- */
export function GoOffDutyTrigger({
  pending,
  visitsLeft,
  cover,
}: {
  pending: number;
  visitsLeft: string;
  cover: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-line-strong py-3 text-sm font-semibold text-ink transition-colors hover:border-clay hover:text-clay"
      >
        <MoonIcon size={15} /> Go off duty
      </button>
      <GoOffDutyDialog
        open={open}
        onClose={() => setOpen(false)}
        pending={pending}
        visitsLeft={visitsLeft}
        cover={cover}
      />
    </>
  );
}
