import Link from "next/link";
import { ChwTop } from "@/components/shells";
import { pendingSync } from "@/lib/mock";
import { WifiOffIcon } from "@/components/ui";
import { RegisterPatientForm } from "./RegisterPatientForm";

/**
 * C2 — Register a patient in the field.
 *
 * No ID number is required. Most rural patients have no document and no fixed
 * address, and demanding one is how people get excluded from care.
 */
export default function ChwRegister() {
  return (
    <div className="min-h-screen bg-paper">
      <ChwTop pathname="/chw/register" pending={pendingSync.total} />

      <main className="mx-auto w-full max-w-[760px] px-7 py-8">
        <h1 className="font-display text-[32px] font-semibold text-ink">Register a patient</h1>
        <p className="mt-2 text-sm text-muted">
          No ID card and no address is needed. A SHATS number is created for them.
        </p>

        <div className="mt-6 flex items-center gap-3 rounded-[10px] bg-clay-wash px-5 py-4">
          <span className="text-clay">
            <WifiOffIcon />
          </span>
          <p className="text-sm text-ink-soft">
            You can finish this with no network. It saves on this phone and sends itself later.
          </p>
        </div>

        <RegisterPatientForm />

        <div className="mt-3">
          <Link
            href="/chw"
            className="block w-full rounded-full border border-line-strong py-3.5 text-center text-sm font-semibold text-ink"
          >
            Save as draft
          </Link>
        </div>

      </main>
    </div>
  );
}
