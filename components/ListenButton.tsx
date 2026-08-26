"use client";

import { useEffect, useState } from "react";
import { SpeakerIcon } from "./ui";
import { LANGUAGES, type LanguageCode } from "@/lib/types";

/**
 * Reads the screen out loud.
 *
 * The whole product claims it speaks five Nigerian languages, so this button
 * has to do something real. It uses the Web Speech API, which means what it can
 * actually pronounce depends on the voices installed on the reader's device —
 * and in practice almost nobody has an Igbo, Hausa, Yorùbá or Pidgin voice.
 *
 * Rather than pretend, the button says so: it falls back to an English voice
 * and tells you the phone has no voice for that language yet. That is the true
 * state of platform TTS for these languages, and a production build would ship
 * recorded audio from `content-service` instead of relying on the device.
 */

/** Nigerian locales first; the browser matches on the prefix if the exact tag is absent. */
const BCP47: Record<LanguageCode, string> = {
  en: "en-NG",
  ig: "ig-NG",
  ha: "ha-NG",
  yo: "yo-NG",
  pcm: "en-NG",
};

type Status = "idle" | "speaking" | "fallback" | "unsupported";

/**
 * Pine reads as a quiet offer on paper; amber is for the warm panels where
 * pine-wash would disappear into the background — the first-aid card during an
 * emergency, where the button has to be the second thing you see.
 */
const TONE = {
  pine: "bg-pine-wash text-pine hover:bg-[#cbe4e9]",
  amber: "bg-amber text-[#2A1D08] hover:bg-[#d4941f]",
} as const;

export function ListenButton({
  text,
  lang = "ig",
  tone = "pine",
  className = "",
}: {
  /** What to read. Without it the button has nothing to say, so it renders nothing. */
  text?: string;
  lang?: LanguageCode;
  tone?: keyof typeof TONE;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const label = LANGUAGES.find((l) => l.code === lang)?.english ?? "English";

  useEffect(() => {
    // Speech keeps running across client-side navigation, so stop on unmount.
    // Support is checked on click instead of here: branching on a browser-only
    // API during render would desync the server and client markup, and setting
    // state from an effect to do it just cascades a render.
    return () => window.speechSynthesis?.cancel();
  }, []);

  if (!text) return null;

  const speak = () => {
    const synth = typeof window === "undefined" ? undefined : window.speechSynthesis;
    if (!synth) {
      setStatus("unsupported");
      return;
    }

    if (status === "speaking" || status === "fallback") {
      synth.cancel();
      setStatus("idle");
      return;
    }

    synth.cancel();
    const want = BCP47[lang];
    const voices = synth.getVoices();
    const voice =
      voices.find((v) => v.lang === want) ??
      voices.find((v) => v.lang.split("-")[0] === want.split("-")[0]);

    const u = new SpeechSynthesisUtterance(text);
    u.lang = want;
    if (voice) u.voice = voice;
    // Slower than default: these screens are read by people who are worried,
    // and often in their second or third language.
    u.rate = 0.92;
    u.onend = () => setStatus("idle");
    u.onerror = () => setStatus("idle");

    synth.speak(u);
    setStatus(voice || lang === "en" ? "speaking" : "fallback");
  };

  return (
    <span className={`inline-flex flex-col items-start gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={speak}
        aria-pressed={status === "speaking" || status === "fallback"}
        className={`tap inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${TONE[tone]}`}
      >
        <SpeakerIcon />
        {status === "speaking" || status === "fallback" ? "Stop" : `Listen in ${label}`}
      </button>
      <span aria-live="polite" className="text-xs text-muted">
        {status === "fallback" && `This phone has no ${label} voice yet — reading in English.`}
        {status === "unsupported" && "This browser cannot read pages out loud."}
      </span>
    </span>
  );
}
