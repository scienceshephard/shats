"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckIcon, SpeakerIcon } from "@/components/ui";
import { SelectGroup } from "@/components/Selectable";
import { LANGUAGES, type LanguageCode } from "@/lib/types";

/**
 * The language choice on R1.
 *
 * A client island so the page around it stays a server component. The chosen
 * language is carried into the rest of the flow on the query string — the
 * screens that follow read it to know which language to offer "Listen" in.
 */
export function LanguagePicker() {
  const [lang, setLang] = useState<LanguageCode>("ig");
  const chosen = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <>
      <SelectGroup
        className="mt-8 space-y-3"
        items={LANGUAGES.map((l) => ({ ...l, id: l.code }))}
        initial="ig"
        onChange={(id) => setLang(id as LanguageCode)}
      >
        {(item, on, choose) => (
          <button
            onClick={choose}
            aria-pressed={on}
            className={`selectable ${on ? "selectable-on" : ""} tap flex w-full items-center gap-4 rounded-[12px] border-2 px-5 text-left ${
              on
                ? "border-pine bg-pine text-white"
                : "border-line bg-surface hover:border-line-strong"
            }`}
          >
            <span
              className={`selectable flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                on ? "border-white bg-white text-pine" : "border-line-strong"
              }`}
            >
              <span className={`selectable-mark ${on ? "selectable-mark-on" : "selectable-mark-off"}`}>
                <CheckIcon size={14} />
              </span>
            </span>
            <span className="flex-1 py-4">
              <span className="block font-display text-[19px] font-semibold">{item.label}</span>
              <span className={`selectable block text-[13px] ${on ? "text-white/70" : "text-muted"}`}>
                {item.english}
              </span>
            </span>
            <span
              className={`selectable flex h-10 w-10 items-center justify-center rounded-full ${
                on ? "bg-amber text-ink" : "bg-paper text-ink-soft"
              }`}
            >
              <SpeakerIcon />
            </span>
          </button>
        )}
      </SelectGroup>

      <Link
        href={`/register?lang=${lang}`}
        className="tap mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-amber text-[18px] font-semibold text-ink"
      >
        Continue in {chosen.english} <ArrowRight />
      </Link>
    </>
  );
}
