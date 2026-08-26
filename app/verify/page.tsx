import { ListenButton, Logo } from "@/components/ui";
import { VerifyForm } from "./VerifyForm";

/** R3 — Enter the code. Big boxes, because this is typed on a shared phone. */
export default async function Verify({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string }>;
}) {
  const { phone } = await searchParams;
  const shown = phone ?? "your phone";

  return (
    <div className="min-h-screen bg-paper">
      <header className="flex h-[68px] items-center border-b border-line bg-surface px-6">
        <Logo height={30} />
      </header>

      <main className="mx-auto w-full max-w-[640px] px-6 py-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-clay">Step 2 of 2</p>
        <h1 className="mt-4 font-display text-[clamp(26px,4.5vw,34px)] font-semibold text-ink">
          We sent 6 numbers to your phone
        </h1>
        <p className="mt-3 text-[15px] text-muted">
          Open your messages and type the 6 numbers here. They were sent to {shown}.
        </p>
        <ListenButton
          text="Type the six numbers we sent you. We sent them to your phone in a text message."
          className="mt-4"
        />

        <VerifyForm phone={phone ?? ""} />
      </main>
    </div>
  );
}
