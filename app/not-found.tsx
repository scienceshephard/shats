import Link from "next/link";
import { ArrowRight, Logo } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-paper px-6 text-center">
      <Logo height={40} />
      <div>
        <h1 className="font-display text-[clamp(28px,5vw,38px)] font-semibold text-pine">
          That page is not here
        </h1>
        <p className="mx-auto mt-3 max-w-[460px] text-[16.5px] leading-relaxed text-ink-soft">
          The link may be old, or we may have moved it. Nothing is wrong with your account.
        </p>
      </div>
      <Link
        href="/home"
        className="inline-flex items-center gap-2.5 rounded-full bg-pine px-7 py-3.5 text-[16px] font-semibold text-white"
      >
        Go to my home <ArrowRight size={18} />
      </Link>
    </div>
  );
}
