import Link from "next/link";
import { ProTop } from "@/components/shells";

import { VisitForm } from "./VisitForm";

const NAV = [
  { href: "/chw", label: "Today's rounds" },
  { href: "/chw/register", label: "Register a patient" },
  { href: "/chw/visit", label: "Record a visit", active: true },
  { href: "/chw/emergency", label: "Emergency" },
];

/** C3 — Record a home visit, including the automatic escalation check. */
export default function ChwVisit() {
  return (
    <div className="min-h-screen bg-paper">
      <ProTop links={NAV} badge="Health worker" right={<span className="text-sm font-semibold text-ink">Ngozi Eze</span>} />

      <main className="mx-auto w-full max-w-[760px] px-7 py-8">
        <Link href="/chw" className="text-sm text-ink-soft hover:text-ink">
          ← Today&apos;s rounds
        </Link>

        <h1 className="mt-4 font-display text-[32px] font-semibold text-ink">
          Ngozi Adeleke, 62
        </h1>
        <p className="mt-2 text-sm text-muted">
          Blood pressure check · Dr. Okonkwo&apos;s standing instruction
        </p>

        <VisitForm />

        <div className="mt-3">
          <Link
            href="/chw"
            className="block w-full rounded-full border border-line-strong py-3.5 text-center text-sm font-semibold text-ink"
          >
            Save and continue later
          </Link>
        </div>

      </main>
    </div>
  );
}
