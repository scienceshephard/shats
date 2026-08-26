import Link from "next/link";
import { CheckIcon, Logo } from "@/components/ui";
import { WeakNetworkTrigger } from "@/components/dialogs/triggers";

/**
 * R10 — Talking to your doctor. The whole screen is the call; controls are
 * large and labelled with words, not icons alone.
 */
export default function Consultation() {
  return (
    <div className="flex min-h-screen flex-col bg-night">
      <header className="flex items-center justify-between px-6 py-4">
        <Logo variant="light" height={28} />
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-night-text">
          <span className="h-2 w-2 rounded-full bg-[#5FBF7A]" />
          You are connected · 04:12
        </span>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-pine-mid font-display text-4xl font-bold text-white">
          CO
        </div>
        <h1 className="mt-6 font-display text-[30px] font-semibold text-white">
          Dr. Chidi Okonkwo
        </h1>
        <p className="mt-2 text-[15px] text-night-muted">General doctor · speaking Igbo</p>

        <div className="mt-9 w-full max-w-[560px] space-y-3">
          <p className="rounded-[12px] bg-clay-wash p-4 text-[14.5px] leading-relaxed text-clay">
            The network got weak, so we moved you to voice. The doctor can still hear you.
          </p>
          <p className="flex items-center gap-2.5 rounded-[12px] bg-pine-wash p-4 text-[14.5px] text-pine">
            <CheckIcon size={17} />
            Ngozi Eze, your health worker, is in the room with you.
          </p>
        </div>
      </main>

      <footer className="px-6 pb-10">
        <div className="mx-auto flex w-full max-w-[560px] flex-col gap-3">
          <WeakNetworkTrigger />
          <Link
            href="/medicines"
            className="tap flex items-center justify-center rounded-full bg-alert text-[17px] font-semibold text-white"
          >
            End the call
          </Link>
        </div>
      </footer>
    </div>
  );
}
