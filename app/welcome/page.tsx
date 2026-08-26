import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckIcon, Logo, SpeakerIcon } from "@/components/ui";
import { LANGUAGES } from "@/lib/types";
import { isRole, type SessionRole } from "@/lib/session";

/**
 * R1 — Welcome & language. The first screen anyone sees, so it asks one thing.
 *
 * It doubles as the landing spot for anyone the proxy turned away: a deep link
 * to a doctor or health-worker screen arrives here with `as` and `next` set, so
 * the way back in is one tap rather than a dead end.
 */
export default async function Welcome({
  searchParams,
}: {
  searchParams: Promise<{ as?: string; next?: string }>;
}) {
  const { as, next } = await searchParams;
  const wanted = as && isRole(as.toUpperCase()) ? (as.toUpperCase() as SessionRole) : null;
  const returnTo = next?.startsWith("/") ? next : null;

  return (
    <div className="min-h-screen bg-paper">
      <div className="relative h-[380px] overflow-hidden">
        <Image src="/img/clinic.jpg" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-[#0A3F48]/85" />
        <div className="absolute left-6 top-6 rounded-full bg-black/25 p-2.5 backdrop-blur-sm">
          <Logo variant="light" height={30} />
        </div>
        <div className="absolute bottom-8 left-6 max-w-[560px] rounded-[14px] bg-pine/85 p-6 backdrop-blur-sm sm:left-10">
          <p className="font-display text-[26px] font-semibold leading-tight text-white">
            A doctor is 30 seconds away, not 30 kilometres.
          </p>
          <p className="mt-2 text-sm text-white/75">
            42,000 people across Enugu, Benue and Kogi already use SHATS.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[720px] px-6 py-12">
        <h1 className="font-display text-[clamp(28px,5vw,34px)] font-semibold text-ink">
          Welcome. Which language do you speak?
        </h1>
        <p className="mt-3 text-[15px] text-muted">
          Tap the one you understand best. You can change it later.
        </p>

        <ul className="mt-8 space-y-3">
          {LANGUAGES.map((lang) => {
            const selected = lang.code === "ig";
            return (
              <li key={lang.code}>
                <button
                  className={`tap flex w-full items-center gap-4 rounded-[12px] border px-5 text-left transition-colors ${
                    selected
                      ? "border-pine bg-pine text-white"
                      : "border-line bg-surface hover:border-line-strong"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      selected ? "border-white bg-white text-pine" : "border-line-strong"
                    }`}
                  >
                    {selected && <CheckIcon size={14} />}
                  </span>
                  <span className="flex-1 py-4">
                    <span className="block font-display text-[19px] font-semibold">
                      {lang.label}
                    </span>
                    <span
                      className={`block text-[13px] ${selected ? "text-white/70" : "text-muted"}`}
                    >
                      {lang.english}
                    </span>
                  </span>
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      selected ? "bg-amber text-ink" : "bg-paper text-ink-soft"
                    }`}
                  >
                    <SpeakerIcon />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <Link
          href="/register"
          className="tap mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-amber text-[18px] font-semibold text-ink"
        >
          Continue in Igbo <ArrowRight />
        </Link>

        {wanted && wanted !== "PATIENT" && (
          <div className="mt-8 rounded-[12px] border border-line bg-surface p-5">
            <p className="text-[15px] font-semibold text-ink">
              You need to be signed in to open that page
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              It belongs to {wanted === "DOCTOR" ? "a doctor" : "a health worker"}. This is a
              design project, so you can step straight in and look around.
            </p>
            <Link
              href={`/enter/${wanted.toLowerCase()}${returnTo ? `?next=${encodeURIComponent(returnTo)}` : ""}`}
              className="mt-4 inline-flex items-center gap-2.5 rounded-full bg-pine px-6 py-3 text-[15px] font-semibold text-white"
            >
              Continue as {wanted === "DOCTOR" ? "a doctor" : "a health worker"}{" "}
              <ArrowRight size={17} />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
