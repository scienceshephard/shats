"use client";

import { useId, type ReactNode } from "react";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogButton,
  DialogFacts,
  DialogNote,
  DialogStrip,
  DialogTitle,
} from "../Dialog";
import { ArrowRight, CheckIcon, PhoneIcon, SirenIcon, StethoscopeIcon } from "../ui";
import { naira } from "@/lib/mock";

/**
 * DP1–DP5 — the doctor's interruptions. Denser than the patient dialogs and
 * unapologetically clinical: whoever is reading these is deciding something
 * with a clock running, so every one leads with the facts that change the
 * decision rather than with reassurance.
 */

type Props = { open: boolean; onClose: () => void; onConfirm?: () => void };

/** The professional dialogs are banded rather than padded as one block. */
function Body({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-[15px] p-7">{children}</div>;
}

function Footer({ children }: { children: ReactNode }) {
  return <div className="px-7 pb-[26px]">{children}</div>;
}

/* DP1 · CHW Escalation Incoming --------------------------------------------- */
export function EscalationDialog({ open, onClose, onConfirm }: Props) {
  const id = useId();
  return (
    <Dialog open={open} onClose={onClose} labelledBy={id} width={660} padded={false}>
      <DialogStrip
        tone="alert"
        icon={<SirenIcon size={18} />}
        label="Emergency escalation from a health worker"
        meta="Respond within 2:14"
      />
      <Body>
        <DialogTitle id={id} size={26}>
          Suspected stroke — Okwudili Obi, 62
        </DialogTitle>
        <DialogBody size={15}>
          Blessing Uche is on the scene in Ede-Oballa and has asked for you.
        </DialogBody>
        <DialogFacts
          tone="alert"
          rows={[
            ["FAST check", "Face, arms and speech all positive"],
            ["Time since onset", "1 hour 42 minutes — inside the window"],
            ["Blood pressure", "172/104"],
            ["Known conditions", "Hypertension stage 2 · Type 2 diabetes"],
            ["Allergies", "Penicillin"],
            ["Adherence", "Stopped amlodipine 2 weeks ago"],
          ]}
        />
      </Body>
      <Footer>
        <DialogActions layout="row">
          <DialogButton
            tone="alert"
            size="sm"
            icon={<StethoscopeIcon size={17} />}
            onClick={onConfirm ?? onClose}
          >
            Join video now
          </DialogButton>
          <DialogButton tone="pine" variant="outline" size="sm" onClick={onClose}>
            Refer to facility
          </DialogButton>
          <DialogButton tone="pine" variant="outline" size="sm" onClick={onClose}>
            I cannot take this
          </DialogButton>
        </DialogActions>
      </Footer>
    </Dialog>
  );
}

/* DP2 · End Consultation? ---------------------------------------------------- */
export function EndConsultationDialog({ open, onClose, onConfirm }: Props) {
  const id = useId();
  return (
    <Dialog open={open} onClose={onClose} labelledBy={id} width={620} padded={false}>
      <Body>
        <DialogTitle id={id} size={26}>
          End this consultation?
        </DialogTitle>
        <DialogBody size={15}>
          Emeka Obi · 18 minutes · video. This is what will be saved to his record.
        </DialogBody>
        <DialogFacts
          rows={[
            ["Diagnosis", "Malaria — uncomplicated"],
            ["Prescription", "2 medicines, ready to send"],
            ["Consultation notes", "Saved"],
            ["Follow-up", "Not scheduled"],
          ]}
        />
        <DialogNote tone="pine">
          He will get the prescription by SMS and in the app, with audio in Igbo.
        </DialogNote>
      </Body>
      <Footer>
        <DialogActions layout="row">
          <DialogButton
            tone="pine"
            size="sm"
            icon={<CheckIcon size={17} />}
            onClick={onConfirm ?? onClose}
          >
            End and send prescription
          </DialogButton>
          <DialogButton tone="pine" variant="outline" size="sm" onClick={onClose}>
            Not yet
          </DialogButton>
        </DialogActions>
      </Footer>
    </Dialog>
  );
}

/* DP3 · Prescribing Conflict -------------------------------------------------- */
export function PrescribingConflictDialog({ open, onClose, onConfirm }: Props) {
  const id = useId();
  return (
    <Dialog open={open} onClose={onClose} labelledBy={id} width={660} padded={false}>
      <DialogStrip
        tone="alert"
        icon={<SirenIcon size={18} />}
        label="Check before you prescribe"
      />
      <Body>
        <DialogTitle id={id} size={26}>
          This medicine conflicts with a recorded allergy
        </DialogTitle>
        <DialogBody size={15}>
          You are about to prescribe Co-trimoxazole to Okwudili Obi.
        </DialogBody>
        <DialogFacts
          tone="alert"
          rows={[
            ["Recorded allergy", "Sulfa drugs"],
            ["Recorded by", "CHW Blessing Uche · 18 Aug 2026"],
            ["Conflict", "Co-trimoxazole is a sulfonamide"],
          ]}
        />
      </Body>
      <Footer>
        <DialogActions layout="row">
          <DialogButton
            tone="pine"
            size="sm"
            icon={<ArrowRight size={17} />}
            onClick={onConfirm ?? onClose}
          >
            Choose another medicine
          </DialogButton>
          <DialogButton tone="alert" variant="outline" size="sm" onClick={onClose}>
            Prescribe anyway
          </DialogButton>
        </DialogActions>
      </Footer>
    </Dialog>
  );
}

/* DP4 · Patient Has Not Joined ------------------------------------------------ */
export function PatientNotJoinedDialog({ open, onClose, onConfirm }: Props) {
  const id = useId();
  return (
    <Dialog open={open} onClose={onClose} labelledBy={id} width={620} padded={false}>
      <Body>
        <DialogTitle id={id} size={26}>
          Emeka Obi has not joined
        </DialogTitle>
        <DialogBody size={15}>
          It is 6 minutes past the start time. His last known network was 2G.
        </DialogBody>
        <DialogFacts
          tone="amber"
          rows={[
            ["Booked for", "Today at 10:00"],
            ["Paid", "₦2,500 via MoMo"],
            ["Phone", "+234 803 412 7788"],
          ]}
        />
      </Body>
      <Footer>
        <DialogActions layout="row">
          <DialogButton
            tone="pine"
            size="sm"
            icon={<PhoneIcon size={17} />}
            onClick={onConfirm ?? onClose}
          >
            Call his phone
          </DialogButton>
          <DialogButton tone="pine" variant="outline" size="sm" onClick={onClose}>
            Wait 5 more minutes
          </DialogButton>
          <DialogButton tone="alert" variant="outline" size="sm" onClick={onClose}>
            Mark as missed
          </DialogButton>
        </DialogActions>
      </Footer>
    </Dialog>
  );
}

/* DP6 · Change Your Fee -------------------------------------------------------- */

/**
 * The fee is the only profile field a patient is quoted before they commit, so
 * changing it gets a dialog rather than an inline edit. Two things have to be on
 * screen before anyone presses save: what the doctor actually keeps once the
 * platform fee is taken, and the fact that today's booked patients still pay the
 * old price.
 */
export function ChangeFeeDialog({
  open,
  onClose,
  onConfirm,
  fromKobo,
  toKobo,
  feePercent,
  bookedToday,
}: Props & {
  fromKobo: number;
  toKobo: number;
  feePercent: number;
  bookedToday: number;
}) {
  const id = useId();
  const keep = toKobo - Math.round((toKobo * feePercent) / 100);
  return (
    <Dialog open={open} onClose={onClose} labelledBy={id} width={620} padded={false}>
      <Body>
        <DialogTitle id={id} size={26}>
          Change your consultation fee?
        </DialogTitle>
        <DialogBody size={15}>
          Patients see this price before they book, and it is the whole price — nothing is added at
          the end.
        </DialogBody>
        <DialogFacts
          rows={[
            ["Your fee now", naira(fromKobo)],
            ["New fee", naira(toKobo)],
            [`You keep, after SHATS takes ${feePercent}%`, `${naira(keep)} per consultation`],
          ]}
        />
        <DialogNote tone="clay">
          The {bookedToday} patients already booked today still pay {naira(fromKobo)}. The new price
          starts with the next booking.
        </DialogNote>
      </Body>
      <Footer>
        <DialogActions layout="row">
          <DialogButton tone="pine" size="sm" onClick={onConfirm ?? onClose}>
            Save new fee
          </DialogButton>
          <DialogButton tone="pine" variant="outline" size="sm" onClick={onClose}>
            Keep {naira(fromKobo)}
          </DialogButton>
        </DialogActions>
      </Footer>
    </Dialog>
  );
}
export function StopAcceptingDialog({ open, onClose, onConfirm }: Props) {
  const id = useId();
  return (
    <Dialog open={open} onClose={onClose} labelledBy={id} width={620} padded={false}>
      <Body>
        <DialogTitle id={id} size={26}>
          Stop accepting new patients?
        </DialogTitle>
        <DialogBody size={15}>
          You will stay visible for appointments already booked, but no new patient can choose you.
        </DialogBody>
        <DialogFacts
          rows={[
            ["Waiting right now", "1 patient — Ngozi Adeleke"],
            ["Still booked today", "2 consultations"],
            ["Next appointment", "10:30 with Ngozi Adeleke"],
          ]}
        />
      </Body>
      <Footer>
        <DialogActions layout="row">
          <DialogButton tone="clay" size="sm" onClick={onConfirm ?? onClose}>
            Stop accepting
          </DialogButton>
          <DialogButton tone="pine" variant="outline" size="sm" onClick={onClose}>
            Keep accepting
          </DialogButton>
        </DialogActions>
      </Footer>
    </Dialog>
  );
}
