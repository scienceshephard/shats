import Image from "next/image";
import { PatientPage } from "@/components/shells";
import { ListenButton, SpeakerIcon } from "@/components/ui";
import { articles } from "@/lib/mock";
import { Empty } from "@/components/states";

/** R15 — Learn about health. Free, spoken, and open whether or not you book. */
export default function Learn() {
  const [featured, ...rest] = articles;

  return (
    <PatientPage goNextExclude="/learn">
      <h1 className="font-display text-[clamp(28px,5vw,36px)] font-semibold text-ink">
        Learn about health
      </h1>
      <p className="mt-3 max-w-[540px] text-[15px] leading-relaxed text-muted">
        Short answers in your own language. Press Listen and they are read to you — you never have
        to read anything here.
      </p>
      <ListenButton text="Learn about health. Every one of these can be read out loud to you." className="mt-4" />

      <article className="mt-9 overflow-hidden rounded-[14px] border border-line bg-surface">
        <div className="relative h-[240px]">
          <Image src={featured.imageUrl} alt="" fill className="object-cover" />
        </div>
        <div className="p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-clay">
            Start here
          </p>
          <h2 className="mt-3 font-display text-[26px] font-semibold leading-snug text-ink">
            {featured.title}
          </h2>
          <p className="mt-2.5 text-[15.5px] leading-relaxed text-ink-soft">{featured.summary}</p>
          <button className="tap mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-pine text-[17px] font-semibold text-white">
            <SpeakerIcon /> Listen — {featured.readMinutes} minutes
          </button>
        </div>
      </article>

      <p className="mt-10 text-[11px] font-bold uppercase tracking-[0.15em] text-clay">
        More lessons
      </p>
      <ul className="mt-4 space-y-3">
        {rest.length === 0 && (
          <Empty
            title="Nothing here yet"
            body="We are still recording these in your language. Everything we add is free to read and to listen to."
          />
        )}
        {rest.map((a) => (
          <li key={a.slug}>
            <button className="flex w-full items-center gap-4 rounded-[14px] border border-line bg-surface p-4 text-left hover:border-line-strong">
              <span className="relative h-[76px] w-[100px] shrink-0 overflow-hidden rounded-[8px]">
                <Image src={a.imageUrl} alt="" fill className="object-cover" />
              </span>
              <span className="flex-1">
                <span className="block text-[18px] font-semibold leading-snug text-ink">
                  {a.title}
                </span>
                <span className="mt-1.5 block text-sm text-muted">
                  {a.readMinutes} min · {a.language.toUpperCase()}
                </span>
              </span>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pine-wash text-pine">
                <SpeakerIcon />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </PatientPage>
  );
}
