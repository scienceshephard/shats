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
import { ArrowRight, CheckIcon, PhoneIcon, SirenIcon, StethoscopeIcon, WifiOffIcon } from "../ui";

/**
 * CP1–CP5 — the health worker's dialogs. These are the only ones written for
 * someone who may be standing in a field with one bar of signal, so they carry
 * the practical facts first (how far, who reported it, what was recorded) and
 * they say plainly what happens when there is no network.
 */

type Props = { open: boolean; onClose: () => void; onConfirm?: () => void };

function Body({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-[15px] p-7">{children}</div>;
}

function Footer({ children }: { children: ReactNode }) {
  return <div className="px-7 pb-[26px]">{children}</div>;
}

/* CP1 · Emergency Assigned To You --------------------------------------------- */
export function EmergencyAssignedDialog({ open, onClose, onConfirm }: Props) {
  const id = useId();
  return (
    <Dialog open={open} onClose={onClose} labelledBy={id} width={660} padded={false}>
      <DialogStrip
        tone="alert"
        icon={<SirenIcon size={18} />}
        label="Emergency near you"
        meta="Goes to the next worker in 4:12"
      />
      <Body>
        <DialogTitle id={id} size={26}>
          Okwudili Obi, 62 — suspected stroke
        </DialogTitle>
        <DialogBody size={15}>
          Behind St. Mary&apos;s church, Ede-Oballa. You are the closest health worker.
        </DialogBody>
        <DialogFacts
          tone="alert"
          rows={[
            ["Distance from you", "1.4 km — about 6 minutes on foot"],
            ["Reported by", "Chidi Obi (son) · +234 806 551 0294"],
            ["Signs", "Face drooping, weakness on the left side"],
            ["Started", "About 1 hour 40 minutes ago"],
            ["Allergies", "Penicillin"],
          ]}
        />
      </Body>
      <Footer>
        <DialogActions layout="row">
          <DialogButton
            tone="alert"
            size="sm"
            icon={<ArrowRight size={17} />}
            onClick={onConfirm ?? onClose}
          >
            I am going now
          </DialogButton>
          <DialogButton tone="pine" variant="outline" size="sm" onClick={onClose}>
            I cannot go
          </DialogButton>
        </DialogActions>
      </Footer>
    </Dialog>
  );
}

/* CP2 · Submit Emergency Report ------------------------------------------------ */
export function SubmitReportDialog({ open, onClose, onConfirm }: Props) {
  const id = useId();
  const outcomes: [string, string][] = [
    ["Referred to a facility", "Ambulance took him to Bishop Shanahan"],
    ["Resolved on the scene", "He was stable and stayed at home"],
    ["Patient or family refused care", "They did not agree to treatment"],
  ];
  const actions = ["Laid him on his side", "Checked breathing", "Called the doctor", "Arranged transport"];
  return (
    <Dialog open={open} onClose={onClose} labelledBy={id} width={700} padded={false}>
      <DialogStrip tone="pine" label="Emergency report · EMG-2026-08-4471" />
      <Body>
        <DialogTitle id={id} size={26}>
          How did this emergency end?
        </DialogTitle>
        <DialogBody size={15}>
          Okwudili Obi, 62 · Ede-Oballa. Fill this before you close the case.
        </DialogBody>

        <fieldset className="flex flex-col gap-2.5">
          <legend className="sr-only">How did this emergency end?</legend>
          {outcomes.map(([label, note], i) => (
            <label
              key={label}
              className={`flex cursor-pointer items-start gap-3.5 rounded-[8px] border p-4 ${
                i === 0 ? "border-2 border-pine bg-pine-wash" : "border-line bg-surface"
              }`}
            >
              <input
                type="radio"
                name="outcome"
                defaultChecked={i === 0}
                className="mt-1 h-4 w-4 accent-[#0B4A54]"
              />
              <span>
                <span className="block text-[15px] font-semibold text-ink">{label}</span>
                <span className="block text-[13.5px] text-ink-soft">{note}</span>
              </span>
            </label>
          ))}
        </fieldset>

        <div>
          <p className="text-[11.5px] font-bold uppercase tracking-[1.5px] text-muted">
            What did you do? Tap all that apply
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {actions.map((a) => (
              <label
                key={a}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[13.5px] text-ink"
              >
                <input type="checkbox" className="h-3.5 w-3.5 accent-[#0B4A54]" />
                {a}
              </label>
            ))}
          </div>
        </div>

        <DialogFacts
          rows={[
            ["You arrived", "10:53"],
            ["Case closed", "11:34"],
            ["Time on scene", "41 minutes"],
          ]}
        />
        <DialogNote tone="amber">
          You are offline. This report saves on your tablet and sends itself when you have network.
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
            Submit report
          </DialogButton>
          <DialogButton tone="pine" variant="outline" size="sm" onClick={onClose}>
            Save as draft
          </DialogButton>
        </DialogActions>
      </Footer>
    </Dialog>
  );
}

/* CP3 · Send This To A Doctor? -------------------------------------------------- */
export function SendToDoctorDialog({ open, onClose, onConfirm }: Props) {
  const id = useId();
  return (
    <Dialog open={open} onClose={onClose} labelledBy={id} width={620} padded={false}>
      <Body>
        <DialogTitle id={id} size={26}>
          Send Ngozi&apos;s readings to a doctor?
        </DialogTitle>
        <DialogBody size={15}>
          Dr. Okonkwo asked to be told the same day if her top number goes above 160.
        </DialogBody>
        <DialogFacts
          tone="alert"
          rows={[
            ["Blood pressure", "172/104 — above her usual"],
            ["Symptoms", "Headache, blurred vision"],
            ["Her consultation", "Booked today at 10:30"],
            ["Goes to", "Dr. Adaeze Okonkwo"],
          ]}
        />
      </Body>
      <Footer>
        <DialogActions layout="row">
          <DialogButton
            tone="pine"
            size="sm"
            icon={<StethoscopeIcon size={17} />}
            onClick={onConfirm ?? onClose}
          >
            Send now
          </DialogButton>
          <DialogButton tone="pine" variant="outline" size="sm" onClick={onClose}>
            Not yet
          </DialogButton>
        </DialogActions>
      </Footer>
    </Dialog>
  );
}

/* CP4 · Cannot Reach The Patient ------------------------------------------------ */
export function CannotReachDialog({ open, onClose, onConfirm }: Props) {
  const id = useId();
  const reasons: [string, string][] = [
    ["Nobody was at the house", "The family may have taken him elsewhere"],
    ["His phone is not going through", "No answer after three tries"],
    ["I could not find the place", "The address or GPS was wrong"],
  ];
  return (
    <Dialog open={open} onClose={onClose} labelledBy={id} width={620} padded={false}>
      <Body>
        <DialogTitle id={id} size={26}>
          You could not reach Okwudili Obi
        </DialogTitle>
        <DialogBody size={15}>
          Tell us what happened so the case is not left open.
        </DialogBody>
        <fieldset className="flex flex-col gap-2.5">
          <legend className="sr-only">What happened?</legend>
          {reasons.map(([label, note], i) => (
            <label
              key={label}
              className={`flex cursor-pointer items-start gap-3.5 rounded-[8px] border p-4 ${
                i === 0 ? "border-2 border-pine bg-pine-wash" : "border-line bg-surface"
              }`}
            >
              <input
                type="radio"
                name="unreachable"
                defaultChecked={i === 0}
                className="mt-1 h-4 w-4 accent-[#0B4A54]"
              />
              <span>
                <span className="block text-[15px] font-semibold text-ink">{label}</span>
                <span className="block text-[13.5px] text-ink-soft">{note}</span>
              </span>
            </label>
          ))}
        </fieldset>
      </Body>
      <Footer>
        <DialogActions layout="row">
          <DialogButton
            tone="pine"
            size="sm"
            icon={<PhoneIcon size={17} />}
            onClick={onConfirm ?? onClose}
          >
            Call the family
          </DialogButton>
          <DialogButton tone="clay" variant="outline" size="sm" onClick={onClose}>
            Give this case to another worker
          </DialogButton>
        </DialogActions>
      </Footer>
    </Dialog>
  );
}

/* CP6 · Go Off Duty? ------------------------------------------------------------ */

/**
 * Going off duty hands the ward to somebody else, so the dialog has to answer
 * the three questions that decide whether it is safe: what is still unfinished,
 * what has not reached the doctor yet, and who is covering.
 *
 * The unsent count is the alert, not a footnote. A record still on the phone is
 * a record the supervising doctor cannot act on.
 */
export function GoOffDutyDialog({
  open,
  onClose,
  onConfirm,
  pending,
  visitsLeft,
  cover,
}: Props & { pending: number; visitsLeft: string; cover: string }) {
  const id = useId();
  return (
    <Dialog open={open} onClose={onClose} labelledBy={id} width={620} padded={false}>
      <DialogStrip tone="clay" label="Going off duty" />
      <Body>
        <DialogTitle id={id} size={26}>
          Go off duty for today?
        </DialogTitle>
        <DialogBody size={15}>
          Emergencies here will go to another health worker until you are back on duty.
        </DialogBody>
        <DialogFacts
          rows={[
            ["Visits still to do today", visitsLeft],
            ["Records still on this phone", `${pending} waiting to send`],
            ["Open emergency", "None"],
            ["Who covers for you", cover],
          ]}
        />
        {pending > 0 && (
          <DialogNote tone="alert" icon={<WifiOffIcon size={18} />}>
            Your {pending} records have not sent yet. They stay safe on this phone and go by
            themselves when you reach network — but Dr. Okonkwo cannot see them until then.
          </DialogNote>
        )}
      </Body>
      <Footer>
        <DialogActions layout="row">
          <DialogButton tone="pine" size="sm" onClick={onConfirm ?? onClose}>
            Go off duty
          </DialogButton>
          <DialogButton tone="pine" variant="outline" size="sm" onClick={onClose}>
            Stay on duty
          </DialogButton>
        </DialogActions>
      </Footer>
    </Dialog>
  );
}
export function RecordsSentDialog({ open, onClose }: Props) {
  const id = useId();
  return (
    <Dialog open={open} onClose={onClose} labelledBy={id} width={620} padded={false}>
      <DialogStrip tone="pine" icon={<CheckIcon size={18} />} label="Back online" />
      <Body>
        <DialogTitle id={id} size={26}>
          All 12 records have been sent
        </DialogTitle>
        <DialogBody size={15}>
          You have network again. Everything you recorded offline is now with SHATS.
        </DialogBody>
        <DialogFacts
          rows={[
            ["Patient registrations", "2 sent"],
            ["Home visits and vitals", "7 sent"],
            ["Emergency reports", "1 sent"],
            ["Medicine reminders", "2 sent"],
          ]}
        />
      </Body>
      <Footer>
        <DialogActions layout="row">
          <DialogButton tone="pine" size="sm" onClick={onClose}>
            Done
          </DialogButton>
        </DialogActions>
      </Footer>
    </Dialog>
  );
}
