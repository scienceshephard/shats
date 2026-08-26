"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { submit, describeFailure } from "@/lib/submit";
import { otpCode } from "@/lib/validate";
import { ArrowRight } from "@/components/ui";

const LENGTH = 6;
const RESEND_SECONDS = 42;

/**
 * R3 — the SMS code.
 *
 * Six separate boxes rather than one field, because that is what the design
 * draws and because it is far easier to check you typed the right thing. The
 * fiddly parts are the ones people actually hit: pasting the whole code from
 * the message, backspacing out of an empty box, and arrow keys.
 */
export function VerifyForm({ phone }: { phone: string }) {
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const write = (index: number, raw: string) => {
    const only = raw.replace(/\D/g, "");
    if (!only) return;
    setError(null);
    setDigits((prev) => {
      const next = [...prev];
      // A pasted code fills from here onwards rather than landing in one box.
      for (let i = 0; i < only.length && index + i < LENGTH; i++) {
        next[index + i] = only[i];
      }
      return next;
    });
    const landed = Math.min(index + only.length, LENGTH - 1);
    boxes.current[landed]?.focus();
  };

  const onKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      setDigits((prev) => {
        const next = [...prev];
        if (next[index]) next[index] = "";
        else if (index > 0) {
          next[index - 1] = "";
          boxes.current[index - 1]?.focus();
        }
        return next;
      });
    }
    if (e.key === "ArrowLeft") boxes.current[index - 1]?.focus();
    if (e.key === "ArrowRight") boxes.current[index + 1]?.focus();
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const code = digits.join("");
    const complaint = otpCode(code);
    if (complaint) {
      setError(complaint);
      boxes.current[digits.findIndex((d) => !d)]?.focus();
      return;
    }

    setPending(true);
    setError(null);
    try {
      // The session it returns is not read here — the cookie is minted by
      // /enter/patient — so the call is typed for its success, not its value.
      await submit<unknown>(
        () => api.auth.verifyOtp(phone, code),
        () => ({ ok: true }),
      );
      // A full navigation: the route handler sets the session cookie, and every
      // cached server render from before sign-in has to be dropped.
      window.location.href = "/enter/patient";
    } catch (failure) {
      setError(describeFailure(failure).message);
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="mt-9 flex gap-2.5 sm:gap-4">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              boxes.current[i] = el;
            }}
            value={digit}
            onChange={(e) => write(i, e.target.value)}
            onKeyDown={onKeyDown(i)}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            aria-label={`Number ${i + 1} of ${LENGTH}`}
            aria-invalid={Boolean(error) || undefined}
            className={`h-[76px] w-full min-w-0 rounded-[12px] border-2 bg-surface text-center font-display text-[32px] font-semibold outline-none sm:h-[86px] sm:text-[38px] ${
              error
                ? "border-alert text-alert"
                : digit
                  ? "border-pine text-pine"
                  : "border-line-strong text-muted focus:border-pine"
            }`}
          />
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="tap mt-10 flex w-full items-center justify-center gap-3 rounded-full bg-pine text-[18px] font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Checking your code…" : "Check my code"}
        {!pending && <ArrowRight />}
      </button>

      <div className="mt-8 space-y-3">
        <button
          type="button"
          disabled={seconds > 0}
          onClick={() => setSeconds(RESEND_SECONDS)}
          className="tap w-full rounded-full border border-line-strong bg-surface text-[16px] font-semibold text-ink disabled:opacity-55"
        >
          {seconds > 0 ? `Send it again in ${seconds} seconds` : "Send the code again"}
        </button>
        <p className="text-center text-sm text-muted">
          Still nothing? Dial <span className="font-semibold text-ink">*347*55#</span> on this phone
          instead.
        </p>
      </div>
    </form>
  );
}
