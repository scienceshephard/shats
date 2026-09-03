"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CancelVisitDialog,
  DoctorReadyDialog,
  LogOutDialog,
  MedicineReminderDialog,
  SendEmergencyDialog,
  WeakNetworkDialog,
} from "./patient";
import { ArrowRight, CheckIcon, SirenIcon, StethoscopeIcon, WifiOffIcon } from "../ui";

/**
 * Small client islands that own one dialog's open state and render the control
 * that opens it. Keeping them here means the screens themselves stay server
 * components — only the piece that actually needs state ships as client code.
 */

/* /profile · POP8 ----------------------------------------------------------- */
export function LogOutTrigger() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="tap mt-6 w-full rounded-full border border-line-strong bg-surface text-[17px] font-semibold text-ink"
      >
        Log out
      </button>
      <LogOutDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          // A full navigation, not a router push: the cookie is cleared by the
          // route handler and every cached server render has to be dropped.
          window.location.href = "/signout";
        }}
      />
    </>
  );
}

/* /emergency · POP5 --------------------------------------------------------- */
export function SendEmergencyTrigger() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="tap mt-8 flex min-h-[80px] w-full items-center justify-center gap-3 rounded-full bg-alert text-[22px] font-semibold text-white"
      >
        <SirenIcon size={26} /> Yes, send help now
      </button>
      <SendEmergencyDialog
        open={open}
        onClose={() => setOpen(false)}
        // Confirming raises the alert, so it has to leave for the screen that
        // tracks it. A dialog that only closes itself would tell someone in an
        // emergency nothing about whether anybody is coming.
        onConfirm={() => router.push("/emergency/coming")}
      />
    </>
  );
}

/* /booked · POP6 ------------------------------------------------------------ */
export function CancelVisitTrigger() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="tap mt-3 w-full rounded-full border border-line-strong bg-surface text-[17px] font-semibold text-clay"
      >
        Cancel this visit
      </button>
      <CancelVisitDialog
        open={open}
        onClose={() => setOpen(false)}
        // Cancelling leaves nothing on this screen to look at — the visit it
        // describes is gone — so it returns to the hub.
        onConfirm={() => router.push("/home")}
      />
    </>
  );
}

/* /home · POP1 -------------------------------------------------------------- */
export function DoctorReadyBanner() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-6 flex w-full items-center gap-4 rounded-[12px] border-2 border-pine bg-pine-wash p-5 text-left"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pine text-white">
          <StethoscopeIcon size={22} />
        </span>
        <span className="flex-1">
          <span className="block text-[17px] font-semibold text-ink">
            Dr. Adaeze is ready for you now
          </span>
          <span className="block text-sm text-ink-soft">Tap to join your consultation</span>
        </span>
        <span className="text-pine">
          <ArrowRight size={20} />
        </span>
      </button>
      <DoctorReadyDialog
        open={open}
        onClose={() => setOpen(false)}
        // "Join now" has to actually join, or the dialog is a dead end on the
        // one screen where the patient is being called into a consultation.
        onConfirm={() => router.push("/consultation")}
      />
    </>
  );
}

/* /medicines · POP2 --------------------------------------------------------- */
export function MedicineTakenTrigger() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="tap mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-pine text-[17px] font-semibold text-white"
      >
        <CheckIcon size={20} /> I have taken today&apos;s dose
      </button>
      <MedicineReminderDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/* /consultation · POP7 ------------------------------------------------------ */
export function WeakNetworkTrigger() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="tap flex items-center justify-center gap-3 rounded-full bg-white/10 text-[17px] font-semibold text-white"
      >
        <WifiOffIcon size={20} /> Weak network
      </button>
      <WeakNetworkDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}

