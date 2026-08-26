"use client";

import { useState } from "react";
import { submit, describeFailure } from "@/lib/submit";
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
export function PayForm({ fee }: { fee: number }) {
  const [method, setMethod] = useState<MethodId | null>("MOMO");
  const [dialog, setDialog] = useState<null | "approve" | "failed">(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

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
      setDialog(method === "CASH" ? null : "approve");
      if (method === "CASH") window.location.href = "/booked";
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
                  className={`flex min-h-[84px] w-full cursor-pointer items-center gap-4 rounded-[12px] border px-5 text-left ${
                    on ? "border-2 border-pine bg-surface" : "border-line bg-surface"
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
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      on ? "border-pine bg-pine text-white" : "border-line-strong"
                    }`}
                  >
                    {on && <CheckIcon size={14} />}
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
