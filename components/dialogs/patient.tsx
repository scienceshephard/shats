"use client";

import { useId } from "react";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogButton,
  DialogFacts,
  DialogIcon,
  DialogListen,
  DialogNote,
  DialogTitle,
} from "../Dialog";
import { CheckIcon, PhoneIcon, PillIcon, SirenIcon, StethoscopeIcon, WifiOffIcon } from "../ui";

/**
 * POP1–POP8 from the canvas — the moments the patient app has to interrupt
 * someone. They are deliberately the plainest screens in the product: one
 * question, the consequence spelled out, and both answers as full-width
 * buttons, because the person reading may be worried, on a small phone, and
 * not confident reading at all. Every one that carries a decision offers audio.
 */

type Props = { open: boolean; onClose: () => void; onConfirm?: () => void };

/* POP1 · Your Doctor Is Ready ---------------------------------------------- */
export function DoctorReadyDialog({ open, onClose, onConfirm }: Props) {
  const id = useId();
  return (
    <Dialog open={open} onClose={onClose} labelledBy={id}>
      <DialogIcon tone="pine">
        <StethoscopeIcon size={38} />
      </DialogIcon>
      <DialogTitle id={id}>Dr. Adaeze is ready for you now</DialogTitle>
      <DialogBody>
        She is waiting on the other side. Press the green button to talk to her.
      </DialogBody>
      <DialogListen />
      <DialogActions>
        <DialogButton tone="pine" onClick={onConfirm ?? onClose}>
          Join now
        </DialogButton>
        <DialogButton tone="pine" variant="outline" onClick={onClose}>
          I need 5 more minutes
        </DialogButton>
      </DialogActions>
    </Dialog>
  );
}

/* POP2 · Medicine Reminder -------------------------------------------------- */
export function MedicineReminderDialog({ open, onClose, onConfirm }: Props) {
  const id = useId();
  return (
    <Dialog open={open} onClose={onClose} labelledBy={id}>
      <DialogIcon tone="pine">
        <PillIcon size={38} />
      </DialogIcon>
      <DialogTitle id={id}>It is time to take your malaria medicine</DialogTitle>
      <DialogBody>Take 1 tablet now, with food. Not on an empty stomach.</DialogBody>
      <DialogFacts rows={[["Artemether/Lumefantrine", "Dose 4 of 6 · 2 days left"]]} />
      <DialogListen />
      <DialogActions>
        <DialogButton tone="pine" icon={<CheckIcon size={20} />} onClick={onConfirm ?? onClose}>
          I have taken it
        </DialogButton>
        <DialogButton tone="pine" variant="outline" onClick={onClose}>
          Remind me in 30 minutes
        </DialogButton>
      </DialogActions>
    </Dialog>
  );
}

/* POP3 · Approve On Your Phone ---------------------------------------------- */
export function ApproveOnPhoneDialog({ open, onClose }: Props) {
  const id = useId();
  const steps = ["Request sent to your phone", "You type your MoMo PIN", "We book your visit"];
  return (
    <Dialog open={open} onClose={onClose} labelledBy={id}>
      <DialogIcon tone="pine">
        <PhoneIcon size={38} />
      </DialogIcon>
      <DialogTitle id={id}>Look at your phone now</DialogTitle>
      <DialogBody>
        We have sent a request to 803 412 7788. Type your MoMo PIN to agree to pay ₦2,500.
      </DialogBody>
      <ol className="flex flex-col gap-3">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-3.5">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${
                i === 0 ? "bg-pine text-white" : "bg-pine-wash text-pine"
              }`}
            >
              {i === 0 ? <CheckIcon size={15} /> : i + 1}
            </span>
            <span className="text-[15.5px] text-ink">{s}</span>
          </li>
        ))}
      </ol>
      <DialogNote tone="amber">
        Do not close this page. It can take up to one minute.
      </DialogNote>
      <DialogActions>
        <DialogButton tone="pine" variant="outline" onClick={onClose}>
          Cancel this payment
        </DialogButton>
      </DialogActions>
    </Dialog>
  );
}

/* POP4 · Payment Did Not Work ----------------------------------------------- */
export function PaymentFailedDialog({ open, onClose, onConfirm }: Props) {
  const id = useId();
  return (
    <Dialog open={open} onClose={onClose} labelledBy={id}>
      <DialogIcon tone="alert">
        <PhoneIcon size={38} />
      </DialogIcon>
      <DialogTitle id={id}>Your payment did not go through</DialogTitle>
      <DialogBody>
        There was not enough money in your MoMo wallet. Nothing has been taken from you.
      </DialogBody>
      <DialogNote tone="amber">Your 10:00 time is held for 9 more minutes.</DialogNote>
      <DialogListen />
      <DialogActions>
        <DialogButton tone="pine" onClick={onConfirm ?? onClose}>
          Try MoMo again
        </DialogButton>
        <DialogButton tone="pine" variant="outline" onClick={onClose}>
          Pay a different way
        </DialogButton>
      </DialogActions>
    </Dialog>
  );
}

/* POP5 · Send Emergency Alert? ---------------------------------------------- */
export function SendEmergencyDialog({ open, onClose, onConfirm }: Props) {
  const id = useId();
  return (
    <Dialog open={open} onClose={onClose} labelledBy={id}>
      <DialogIcon tone="alert">
        <SirenIcon size={38} />
      </DialogIcon>
      <DialogTitle id={id}>Do you want to send an emergency alert?</DialogTitle>
      <DialogBody>
        A health worker near you will be told straight away and will come to where you are. This is
        free.
      </DialogBody>
      <DialogNote tone="alert" icon={<SirenIcon size={20} />}>
        We will share where you are: Ede-Oballa, behind St. Mary&apos;s.
      </DialogNote>
      <DialogListen />
      <DialogActions>
        <DialogButton tone="alert" icon={<SirenIcon size={20} />} onClick={onConfirm ?? onClose}>
          Yes, send help now
        </DialogButton>
        <DialogButton tone="pine" variant="outline" onClick={onClose}>
          No, I pressed it by mistake
        </DialogButton>
      </DialogActions>
    </Dialog>
  );
}

/* POP6 · Cancel This Visit? -------------------------------------------------- */
export function CancelVisitDialog({ open, onClose, onConfirm }: Props) {
  const id = useId();
  return (
    <Dialog open={open} onClose={onClose} labelledBy={id}>
      <DialogIcon tone="clay">
        <PhoneIcon size={38} />
      </DialogIcon>
      <DialogTitle id={id}>Do you want to cancel your visit?</DialogTitle>
      <DialogBody>
        Your visit with Dr. Adaeze today at 10:00 will be cancelled. She will be told.
      </DialogBody>
      <DialogNote tone="pine">
        Your ₦2,500 will come back to your MoMo wallet in 24 hours.
      </DialogNote>
      <DialogListen />
      <DialogActions>
        {/* Keeping the visit is the safe answer, so it is the filled button. */}
        <DialogButton tone="pine" onClick={onClose}>
          No, keep my visit
        </DialogButton>
        <DialogButton tone="clay" variant="outline" onClick={onConfirm ?? onClose}>
          Yes, cancel it
        </DialogButton>
      </DialogActions>
    </Dialog>
  );
}

/* POP7 · Network Is Weak ----------------------------------------------------- */
export function WeakNetworkDialog({ open, onClose, onConfirm }: Props) {
  const id = useId();
  return (
    <Dialog open={open} onClose={onClose} labelledBy={id}>
      <DialogIcon tone="amber">
        <WifiOffIcon size={38} />
      </DialogIcon>
      <DialogTitle id={id}>Your network is too weak for pictures</DialogTitle>
      <DialogBody>
        Dr. Adaeze can still hear you. If you turn off the picture, your voice will be clear and you
        will use much less data.
      </DialogBody>
      <DialogListen />
      <DialogActions>
        <DialogButton tone="pine" onClick={onConfirm ?? onClose}>
          Talk without picture
        </DialogButton>
        <DialogButton tone="pine" variant="outline" onClick={onClose}>
          Keep trying with picture
        </DialogButton>
      </DialogActions>
    </Dialog>
  );
}

/* POP8 · Log Out? ------------------------------------------------------------ */
export function LogOutDialog({ open, onClose, onConfirm }: Props) {
  const id = useId();
  return (
    <Dialog open={open} onClose={onClose} labelledBy={id}>
      <DialogTitle id={id}>Do you want to log out?</DialogTitle>
      <DialogBody>You will need your phone number and a new code to come back in.</DialogBody>
      <DialogNote tone="pine">Your medicines and records stay safe. Nothing is deleted.</DialogNote>
      <DialogActions>
        <DialogButton tone="pine" onClick={onClose}>
          No, stay signed in
        </DialogButton>
        <DialogButton tone="alert" variant="outline" onClick={onConfirm ?? onClose}>
          Yes, log out
        </DialogButton>
      </DialogActions>
    </Dialog>
  );
}
