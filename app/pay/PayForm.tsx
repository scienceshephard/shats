"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { submit, describeFailure, IS_LIVE } from "@/lib/submit";
import { api } from "@/lib/api";
import { ErrorState } from "@/components/states";
import { ApproveOnPhoneDialog, PaymentFailedDialog } from "@/components/dialogs/patient";
import { ArrowRight, CheckIcon } from "@/components/ui";
import { naira } from "@/lib/mock";

const METHODS = [
  { id: "MOMO", name: "MTN MoMo", sub: "Pay from your phone wallet" },
  { id: "OPAY", name: "OPay", sub: "Pay from your OPay account" },
  { id: "BANK", name: "Bank transfer", sub: "We show you the account number" },
  {
    id: "CASH",
    name: "Cash to your health worker",
    sub: "Ngozi Eze collects it and gives you a receipt",
  },
] as const;

type MethodId = (typeof METHODS)[number]["id"];

/**
 * R8 — Pay.
 *
 * Choosing the method and paying are one form, because the choice is the only
 * input and nothing should be taken until it is made. Cash skips the wallet
 * approval entirely — it is the one route that never touches the network, which
 * is the point of offering it.
 */
export function PayForm({ fee, forward = "" }: { fee: number; forward?: string }) {
  const router = useRouter();
  const booked = forward ? `/booked?${forward}` : "/booked";
  const [method, setMethod] = useState<MethodId | null>("MOMO");
  const [dialog, setDialog] = useState<null | "approve" | "failed">(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  /**
   * A wallet payment finishes when the provider tells `payment-service` the PIN
   * was accepted, and the booking is confirmed from there. With no back end
   * there is no callback to wait for, so it is simulated: POP3 shows exactly as
   * drawn, then the flow carries on to the booked screen the way it will when
   * that callback is real. Without this the wallet methods dead-end on the
   * dialog and only cash reaches `/booked`.
   */
  useEffect(() => {
    if (dialog !== "approve" || IS_LIVE) return;
    const approved = setTimeout(() => router.push(booked), 2600);
    return () => clearTimeout(approved);
  }, [dialog, router, booked]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!method) {
      setFailure("Choose how you want to pay first.");
      return;
    }
    setFailure(null);
    setPending(true);
    try {
      await submit<unknown>(
        () => api.payments.methods(),
        () => ({ ok: true }),
      );
      // Cash never touches the network — that is the point of offering it — so
      // it skips the wallet approval and books straight away.
      if (method === "CASH") {
        router.push(booked);
        return;
      }
      setDialog("approve");
    } catch (error) {
      setFailure(describeFailure(error).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <fieldset className="mt-6">
        <legend className="sr-only">How do you want to pay?</legend>
        <ul className="space-y-3">
          {METHODS.map((m) => {
            const on = method === m.id;
            return (
              <li key={m.id}>
                <label
                  className={`selectable ${on ? "selectable-on" : ""} flex min-h-[84px] w-full cursor-pointer items-center gap-4 rounded-[12px] border-2 px-5 text-left ${
                    on ? "border-pine bg-pine-wash" : "border-line bg-surface hover:border-line-strong"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    className="sr-only"
                    checked={on}
                    onChange={() => {
                      setMethod(m.id);
                      setFailure(null);
                    }}
                  />
                  <span
                    aria-hidden
                    className={`selectable flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      on ? "border-pine bg-pine text-white" : "border-line-strong"
                    }`}
                  >
                    <span
                      className={`selectable-mark ${on ? "selectable-mark-on" : "selectable-mark-off"}`}
                    >
                      <CheckIcon size={14} />
                    </span>
                  </span>
                  <span>
                    <span className="block text-[18px] font-semibold text-ink">{m.name}</span>
                    <span className="block text-sm text-muted">{m.sub}</span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      {failure && <ErrorState title="We could not start the payment" body={failure} />}

      <button
        type="submit"
        disabled={pending}
        className="tap mt-6 flex min-h-[64px] w-full items-center justify-center gap-3 rounded-full bg-pine text-[18px] font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Starting…" : `Pay ${naira(fee)}`}
        {!pending && <ArrowRight size={20} />}
      </button>
      <p className="mt-3 text-center text-sm text-muted">
        Nothing is taken until you agree on your phone.{" "}
        <button type="button" onClick={() => setDialog("failed")} className="underline">
          See what happens if it fails
        </button>
      </p>

      <ApproveOnPhoneDialog open={dialog === "approve"} onClose={() => setDialog(null)} />
      <PaymentFailedDialog
        open={dialog === "failed"}
        onClose={() => setDialog(null)}
        onConfirm={() => setDialog("approve")}
      />
    </form>
  );
}
