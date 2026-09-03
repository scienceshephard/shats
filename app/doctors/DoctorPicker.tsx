"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckIcon } from "@/components/ui";
import { SelectGroup } from "@/components/Selectable";
import { naira } from "@/lib/mock";
import type { Doctor } from "@/lib/types";

/**
 * R6 — choose a doctor.
 *
 * The chosen id travels on the query string into `/time` and `/pay`, so the
 * name and fee on those screens are the ones actually picked here rather than
 * a fixed first row. A doctor who is not accepting cannot be chosen — the
 * design shows them, greyed, so the list does not silently shrink.
 */
export function DoctorPicker({ doctors, symptoms }: { doctors: Doctor[]; symptoms?: string }) {
  const bookable = doctors.filter((d) => d.acceptingPatients);
  const [chosen, setChosen] = useState<string>(bookable[0]?.id ?? doctors[0]?.id ?? "");

  const next = new URLSearchParams({ doctor: chosen });
  if (symptoms) next.set("symptoms", symptoms);

  return (
    <>
      <SelectGroup
        className="mt-8 space-y-3"
        items={doctors.map((d) => ({ ...d, disabled: !d.acceptingPatients }))}
        initial={chosen}
        onChange={setChosen}
      >
        {(d, on, choose) => (
          <button
            onClick={choose}
            disabled={!d.acceptingPatients}
            aria-pressed={on}
            className={`selectable ${on ? "selectable-on" : ""} flex w-full items-center gap-4 rounded-[12px] border-2 p-5 text-left ${
              on
                ? "border-pine bg-pine-wash"
                : d.acceptingPatients
                  ? "border-line bg-surface hover:border-line-strong"
                  : "border-line bg-paper opacity-60"
            }`}
          >
            <span
              className={`selectable relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-base font-bold ${
                on ? "bg-pine text-white" : "bg-line-strong text-paper"
              }`}
            >
              {d.fullName.split(" ")[1][0]}
              {d.fullName.split(" ")[2]?.[0] ?? ""}
              <span
                className={`selectable-mark absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-pine text-white ring-2 ring-pine-wash ${
                  on ? "selectable-mark-on" : "selectable-mark-off"
                }`}
              >
                <CheckIcon size={13} />
              </span>
            </span>

            <span className="flex-1">
              <span className="block text-[19px] font-semibold text-ink">{d.fullName}</span>
              <span className="block text-sm text-muted">
                {d.specialty} · {d.city}
              </span>
              <span className="mt-2 flex flex-wrap gap-1.5">
                {d.languages.map((l) => (
                  <span
                    key={l}
                    className="rounded-full border border-line bg-surface px-2.5 py-1 text-[11.5px] font-semibold text-ink-soft"
                  >
                    {l.toUpperCase()}
                  </span>
                ))}
                {!d.acceptingPatients && (
                  <span className="rounded-full bg-clay-wash px-2.5 py-1 text-[11.5px] font-semibold text-clay">
                    Not free today
                  </span>
                )}
              </span>
            </span>

            <span className="text-right">
              <span
                className={`selectable block font-display text-[26px] font-semibold ${
                  on ? "text-pine" : "text-ink-soft"
                }`}
              >
                {naira(d.feeKobo)}
              </span>
              <span className="mt-1 block text-[12px] text-muted">
                waits {d.averageWaitMinutes} min
              </span>
            </span>
          </button>
        )}
      </SelectGroup>

      <p className="mt-6 flex items-center gap-2.5 text-[14.5px] text-ink-soft">
        <span className="text-pine-mid">
          <CheckIcon size={17} />
        </span>
        This is the whole price. Nothing is added at the end.
      </p>

      <Link
        href={`/time?${next.toString()}`}
        className="tap mt-9 flex w-full items-center justify-center gap-3 rounded-full bg-pine text-[18px] font-semibold text-white"
      >
        Choose a time <ArrowRight />
      </Link>
    </>
  );
}
