"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "@/components/ui";
import { SelectGroup } from "@/components/Selectable";

/**
 * R7 — choose a day and a time.
 *
 * Two groups rather than one: the day narrows the slots, and both have to stay
 * visible so it is obvious which day the times belong to. A taken slot renders
 * but cannot be chosen — seeing that 13:00 is gone is information.
 */
const DAYS = [
  { id: "today", label: "Today", date: "20 Aug" },
  { id: "tomorrow", label: "Tomorrow", date: "21 Aug" },
  { id: "friday", label: "Friday", date: "22 Aug" },
];

const SLOTS = [
  { id: "10:00", time: "10:00", plain: "in the morning", free: true },
  { id: "11:30", time: "11:30", plain: "before noon", free: true },
  { id: "13:00", time: "13:00", plain: "after noon", free: false },
  { id: "15:45", time: "15:45", plain: "in the afternoon", free: true },
  { id: "17:00", time: "17:00", plain: "in the evening", free: true },
  { id: "18:30", time: "18:30", plain: "in the evening", free: false },
];

export function TimePicker({ forward }: { forward: Record<string, string> }) {
  const [day, setDay] = useState("today");
  const [slot, setSlot] = useState("10:00");

  // A plain object, not URLSearchParams: props crossing from a server
  // component have to be serializable, and a URLSearchParams instance is not.
  const next = new URLSearchParams({ ...forward, day, at: slot });

  return (
    <>
      <SelectGroup
        className="mt-8 grid grid-cols-3 gap-3"
        items={DAYS}
        initial="today"
        onChange={setDay}
      >
        {(d, on, choose) => (
          <button
            onClick={choose}
            aria-pressed={on}
            className={`selectable ${on ? "selectable-on" : ""} rounded-[12px] border-2 py-4 ${
              on ? "border-pine bg-pine-wash" : "border-line bg-surface hover:border-line-strong"
            }`}
          >
            <span className="block text-[17px] font-semibold text-ink">{d.label}</span>
            <span className="mt-0.5 block text-[13px] text-muted">{d.date}</span>
          </button>
        )}
      </SelectGroup>

      <SelectGroup
        className="mt-4 grid gap-3 sm:grid-cols-2"
        items={SLOTS.map((s) => ({ ...s, disabled: !s.free }))}
        initial="10:00"
        onChange={setSlot}
      >
        {(s, on, choose) => (
          <button
            onClick={choose}
            disabled={!s.free}
            aria-pressed={on}
            className={`selectable ${on ? "selectable-on" : ""} flex min-h-[80px] items-center justify-between rounded-[12px] border-2 px-5 text-left ${
              on
                ? "border-pine bg-pine-wash"
                : s.free
                  ? "border-line bg-surface hover:border-line-strong"
                  : "border-line bg-paper opacity-50"
            }`}
          >
            <span>
              <span className="block font-display text-[24px] font-semibold text-ink">{s.time}</span>
              <span className="block text-[13px] text-muted">{s.plain}</span>
            </span>
            {!s.free && <span className="text-[12px] font-semibold text-muted">Taken</span>}
          </button>
        )}
      </SelectGroup>

      <Link
        href={`/pay?${next.toString()}`}
        className="tap mt-10 flex w-full items-center justify-center gap-3 rounded-full bg-pine text-[18px] font-semibold text-white"
      >
        Continue to pay <ArrowRight />
      </Link>
    </>
  );
}
