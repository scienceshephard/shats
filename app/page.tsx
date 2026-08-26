import Image from "next/image";
import Link from "next/link";
import { CoverVeil } from "@/components/CoverVeil";
import { JourneyPanel } from "@/components/JourneyPanel";
import { OverlayStack } from "@/components/OverlayStack";
import { ScrollFx } from "@/components/ScrollFx";
import { Reveal, CountUp } from "@/components/Reveal";
import {
  ArrowDownIcon,
  ArrowRight,
  BadgeCheckIcon,
  CheckIcon,
  EyeOffIcon,
  FlaskIcon,
  FootprintsIcon,
  LanguagesIcon,
  ShieldCheckIcon,
  SpeakerIcon,
  Logo,
  PhoneIcon,
  PillIcon,
  SectionLabel,
  SirenIcon,
  StethoscopeIcon,
  WifiOffIcon,
} from "@/components/ui";
import { doctors, articles, naira } from "@/lib/mock";

/* -------------------------------------------------------------------------- */

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#doctors", label: "For doctors" },
  { href: "#chw", label: "For health workers" },
  { href: "#safety", label: "Safety" },
];

const JOURNEY = [
  {
    n: "1",
    lead: "You say what is wrong",
    accent: "in your own words.",
    body: "Tap the picture that matches how you feel. Press Listen and the question is read to you in Igbo, Hausa, Yorùbá or Pidgin. Nothing has to be typed, and nothing has to be spelled.",
  },
  {
    n: "2",
    lead: "You choose the doctor",
    accent: "and you see the price first.",
    body: "Real Nigerian doctors, with the languages they speak and the fee they charge shown side by side. You agree the price before anything begins. There is no second bill at the end.",
  },
  {
    n: "3",
    lead: "You talk to the doctor",
    accent: "and you are not alone.",
    body: "Video when the network is strong, voice when it is weak — it changes by itself and you never have to know why. If you want, the health worker in your village sits beside you and holds the phone.",
  },
  {
    n: "4",
    lead: "Your medicine and record",
    accent: "and help when it is urgent.",
    body: "The prescription goes to the chemist nearest you, and the record stays yours whether you are online or not. If it turns into an emergency, one press reaches a health worker, a doctor and a facility at the same time.",
  },
];

const CAPABILITIES = [
  {
    icon: <PhoneIcon size={21} />,
    title: "Works on a phone with no internet",
    body: "Dial *737# and book a doctor through a menu, the same way you buy airtime. No app, no data, no smartphone.",
  },
  {
    icon: <WifiOffIcon size={21} />,
    title: "Works when the network is down",
    body: "Your health worker's phone keeps working offline and sends everything the moment there is signal again.",
  },
  {
    icon: <PillIcon size={21} />,
    title: "Pay the way you already pay",
    body: "MTN MoMo, OPay, bank transfer — or cash handed to your health worker, receipted on the spot.",
  },
  {
    icon: <StethoscopeIcon size={21} />,
    title: "Speaks the way you speak",
    body: "Igbo, Hausa, Yorùbá, Pidgin and English. Every screen will read itself out loud if you ask it to.",
  },
];

const DOORS = [
  {
    href: "/welcome",
    label: "For patients and families",
    title: "Get care for someone",
    body: "Book a doctor for yourself, or for a parent in the village who cannot do it alone.",
    primary: true,
  },
  {
    href: "/enter/doctor",
    label: "For doctors and health workers",
    title: "Practise on SHATS",
    body: "See patients from anywhere in the country, on your own hours, paid every week.",
    primary: false,
  },
];

const STATS = [
  {
    value: <CountUp value={3.9} decimals={1} />,
    label: "doctors per 10,000 people",
    note: "The WHO's minimum threshold for adequate coverage is 10. Nigeria has never reached it.",
    tone: "text-pine",
  },
  {
    value: <CountUp value={45} suffix="%" />,
    label: "live outside the cities",
    note: "Where the fewest doctors, clinics and ambulances are. World Bank, 2024.",
    tone: "text-pine",
  },
  {
    value: <CountUp value={28.7} decimals={1} suffix="%" />,
    label: "of the world's maternal deaths",
    note: "Happen in this one country. WHO, Trends in Maternal Mortality, 2023.",
    tone: "text-clay",
  },
];

/** The canvas spells the languages out rather than showing the codes. */
const FOOTER_COLS = [
  { head: "Patients", links: ["How it works", "Languages", "What it costs", "Emergencies"] },
  { head: "Doctors", links: ["Practise on SHATS", "Verification", "Payouts"] },
  { head: "Health workers", links: ["Become a CHW", "Training", "Working offline"] },
  { head: "Company", links: ["About SHATS", "NDPR & privacy", "Contact"] },
];

const EMERGENCY_CHAIN = [
  "The health worker nearest you",
  "The doctor on call",
  "The facility with a free bed",
];

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  ig: "Igbo",
  ha: "Hausa",
  yo: "Yorùbá",
  pcm: "Pidgin",
};

const CHW_FACTS = [
  "Registers people who have no ID and no fixed address",
  "Works offline all day, then syncs everything at night",
  "Escalates to a doctor in seconds, not days",
];

const SAFEGUARDS = [
  {
    icon: <FootprintsIcon size={22} />,
    title: "It follows you",
    body: "Your history goes with you to any doctor you choose, on SHATS or off it.",
  },
  {
    icon: <EyeOffIcon size={22} />,
    title: "Nobody looks without asking",
    body: "A doctor sees your record only for the consultation you booked. Every opening is logged.",
  },
  {
    icon: <ShieldCheckIcon size={22} />,
    title: "NDPR compliant",
    body: "Built to the Nigeria Data Protection Regulation. Consent is recorded before anything is shared.",
  },
  {
    icon: <BadgeCheckIcon size={22} />,
    title: "It knows about NHIS",
    body: "If you are enrolled, your cover is applied before you are ever asked to pay.",
  },
];

/* -------------------------------------------------------------------------- */

export default function Landing() {
  return (
    <div className="bg-paper">
      {/* Portfolio disclaimer. This is a design project, and anyone who opens
          the link has to know that before they read anything else. */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 bg-night px-6 py-2 sm:px-[72px] lg:h-[46px] lg:py-0">
        <span className="flex items-center gap-2.5 text-amber">
          <FlaskIcon size={14} />
          <span className="text-[11px] font-bold uppercase tracking-[1.5px]">
            Portfolio concept
          </span>
        </span>
        <span className="text-[12.5px] text-night-muted">
          SHATS is a design project, not a live service. No real doctors or patients are shown,
          and no consultation can be booked.
        </span>
      </div>

      {/* ------------------------------- hero ------------------------------- */}
      {/* The hero pins to the top of the viewport and the problem section
          rides up over it. The wrapper is exactly hero + problem tall, so
          the pin releases the moment the cover is complete — the overlay
          ends here and the journey below scrolls on its own terms. */}
      <div className="relative">
        <section className="relative isolate z-0 flex min-h-[760px] flex-col overflow-hidden lg:sticky lg:top-0 lg:h-[100svh] lg:min-h-[620px]">
          <Image
            src="/img/clinic.jpg"
            alt=""
            fill
            priority
            className="-z-20 object-cover"
          />
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(90deg, #04262CFA 0%, #04262CE0 42%, #04262C99 100%)",
            }}
          />

          <header className="flex h-20 shrink-0 items-center justify-between px-6 sm:px-[72px] lg:h-24">
            <Logo variant="light" height={36} />
            <nav className="hidden items-center gap-9 md:flex">
              {NAV.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-[14.5px] text-[#CBDBDD] hover:text-white"
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <Link
              href="/welcome"
              className="flex h-[46px] items-center rounded-full bg-clay px-6 text-[14.5px] font-semibold text-white hover:bg-[#a9490f]"
            >
              Get care
            </Link>
          </header>

          <div className="flex flex-1 flex-col justify-center px-6 py-16 sm:px-[72px] lg:py-0">
            <div className="flex w-full flex-col gap-[26px] lg:max-w-[780px]">
            <Reveal>
              <span className="inline-flex h-[34px] items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.12] px-4 text-[11.5px] font-semibold tracking-[1.4px] text-[#F0D9A8]">
                <LanguagesIcon size={15} />
                IGBO · HAUSA · YORÙBÁ · PIDGIN · ENGLISH
              </span>
            </Reveal>

            <Reveal delay={90}>
              <h1 className="max-w-[760px] font-display text-[40px] font-semibold leading-[1.078] tracking-[-0.0156em] text-white sm:text-[52px] lg:text-[64px]">
                Six hours to the nearest doctor.
                <span className="block text-amber">Now six minutes.</span>
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="max-w-[610px] text-[17px] leading-[1.59] text-[#D3E2E4] lg:text-[19.5px]">
                SHATS connects rural communities to real Nigerian doctors — by video, by voice, or
                from a basic phone with no internet at all. And a trained health worker in your own
                village to sit beside you while you talk.
              </p>
            </Reveal>

            <Reveal delay={260}>
              <div className="flex flex-wrap items-center gap-3.5">
                <Link
                  href="/welcome"
                  className="inline-flex h-[58px] items-center gap-2.5 rounded-full bg-clay px-8 text-[16.5px] font-semibold text-white hover:bg-[#a9490f]"
                >
                  Get care for someone <ArrowRight size={18} />
                </Link>
                <Link
                  href="/enter/doctor"
                  className="inline-flex h-[58px] items-center rounded-full border border-white/40 px-7 text-[16.5px] font-medium text-white hover:border-white"
                >
                  I am a doctor
                </Link>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <p className="flex items-center gap-2.5 text-[15px] text-[#9FBDC1]">
                <PhoneIcon size={16} /> No smartphone, no data? Dial *737# from any phone.
              </p>
            </Reveal>
            </div>
          </div>

          {/* The canvas ends the hero with a scroll cue; the app was missing it. */}
          <div className="hidden h-[76px] shrink-0 items-center gap-3 px-6 sm:px-[72px] lg:flex">
            <span className="text-[11.5px] font-semibold uppercase tracking-[1.6px] text-white/60">
              See the whole journey
            </span>
            <span className="text-white/60">
              <ArrowDownIcon size={15} />
            </span>
          </div>
          {/* Sinks the hero as the problem section climbs over it. */}
          <CoverVeil />
        </section>

        {/* A pinned sticky hero is a positioned element, so anything after it
            has to be positioned and opaque too — otherwise it paints
            underneath and the hero shows through. */}
        <div className="relative z-10 bg-paper">

          {/* ----------------------------- the problem --------------------------- */}
          {/* 104/72 padding, 58px between head and stats, head split 660 + 436
              across a 100px gutter — the canvas values, held at lg and up. */}
          <section className="flex flex-col justify-center gap-10 bg-paper px-6 py-[72px] sm:px-[72px] lg:h-[100svh] lg:gap-[58px] lg:py-[104px]">
            <Reveal>
              <div className="flex flex-col gap-10 lg:flex-row lg:gap-[100px]">
                <div className="flex w-full flex-col gap-[22px] lg:max-w-[660px]">
                  <SectionLabel>
                    The problem
                  </SectionLabel>
                  <h2 className="max-w-[640px] font-display text-[32px] font-semibold leading-[1.128] tracking-[-0.017em] text-pine sm:text-[40px] lg:text-[47px]">
                    In rural Nigeria, distance is the disease.
                  </h2>
                </div>
                <p className="text-[17px] leading-[1.667] text-ink-soft lg:max-w-[436px] lg:shrink-0 lg:text-[18px]">
                  Most Nigerians who die of treatable illness do not die because the medicine does not
                  exist. They die because the road to it is too long, too expensive, or too late at
                  night to travel.
                </p>
              </div>
            </Reveal>

            <div className="flex flex-col gap-10 md:flex-row md:gap-0">
              {STATS.map((s, i) => (
                <Reveal
                  key={s.label}
                  delay={i * 110}
                  className={`md:flex-1 ${
                    i > 0 ? "md:border-l md:border-line-strong md:pl-14" : ""
                  } ${i < STATS.length - 1 ? "md:pr-14" : ""}`}
                >
                  <p
                    className={`font-display text-[58px] font-semibold leading-[1.052] tracking-[-0.026em] ${s.tone}`}
                  >
                    {s.value}
                  </p>
                  <p className="mt-3 max-w-[300px] text-[17.5px] font-semibold text-ink">
                    {s.label}
                  </p>
                  <p className="mt-3 max-w-[300px] text-[14.5px] leading-[1.517] text-muted">
                    {s.note}
                  </p>
                </Reveal>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="relative z-20 bg-paper">

        {/* ------------------------------ journey ------------------------------ */}
        <section id="how" className="bg-[#062E35]">
          {/* 100/74 top and bottom, a 700 + 396 split across a 100px gutter,
              bottom-aligned — the canvas measurements. */}
          <div className="flex flex-col gap-10 px-6 pb-[74px] pt-[72px] sm:px-[72px] lg:flex-row lg:items-end lg:gap-[100px] lg:pt-[100px]">
            <Reveal className="lg:w-[700px] lg:shrink-0">
              <SectionLabel tone="amber">
                How it works
              </SectionLabel>
              <h2 className="mt-5 max-w-[680px] font-display text-[32px] font-semibold leading-[1.12] tracking-[-0.017em] text-white sm:text-[40px] lg:text-[47px]">
                Four steps. That is the whole thing.
              </h2>
            </Reveal>
            <Reveal delay={120} className="lg:max-w-[396px]">
              <p className="text-[17px] leading-[1.65] text-[#9FBDC1]">
                No forms to fill. No words to spell. Every screen asks one question and reads it
                out loud if you want it to.
              </p>
            </Reveal>
          </div>

          {/* Each step pins to the top of the viewport, holds while you keep
              scrolling, then releases as the next arrives. Its contents are
              tied to scroll position rather than to a one-shot trigger, so the
              dissolve reverses when you scroll back up. No divider between
              panels — the dissolve is the hand-off. */}
          {JOURNEY.map((step, i) => (
            <JourneyPanel
              key={step.n}
              flip={i % 2 === 1}
              text={
                <div className="flex max-w-[clamp(430px,34vw,680px)] flex-col gap-[22px]">
                  <span className="block font-display text-[clamp(52px,5vw,76px)] font-semibold leading-none text-amber">
                    {step.n}
                  </span>
                  <h3 className="font-display text-[28px] font-semibold leading-[1.162] tracking-[-0.016em] text-white sm:text-[33px] lg:text-[37px]">
                    {step.lead}
                    <span className="block text-amber">{step.accent}</span>
                  </h3>
                  <p className="text-[17px] leading-[1.706] text-[#B7CDD0]">{step.body}</p>
                </div>
              }
              media={
                <div className="flex items-center justify-center rounded-[14px] bg-[#0A3C46] px-8 py-8 lg:h-[452px] lg:px-10 lg:py-0">
                  <JourneyCard step={i} />
                </div>
              }
            />
          ))}
        </section>

        {/* The overlay treatment resumes here and runs to the emergency
            section: each of these four fills the screen, pins, and is covered
            by the next. Every one needs an opaque background and a full
            viewport height or the panel beneath shows through. */}
        <OverlayStack>
          {/* ------------------------ works without ------------------------ */}
          {/* Canvas: 104/72 padding, a 452 column and the list across a 96px
              gutter, both centred against the panel. */}
          <section className="bg-paper px-6 py-[72px] sm:px-[72px] lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-[104px]">
            {/* Only type and icons here, so it unblurs and grows rather than
                sliding — and reverses on the way back up. */}
            <ScrollFx
              mode="blur-grow"
              className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-[96px]"
            >
              <div className="flex flex-col gap-[22px] lg:w-[452px] lg:shrink-0">
                <SectionLabel>
                  Why this one works here
                </SectionLabel>
                <h2 className="max-w-[436px] font-display text-[32px] font-semibold leading-[1.14] tracking-[-0.016em] text-pine sm:text-[38px] lg:text-[43px]">
                  Built for what you have, not what you are missing.
                </h2>
                <p className="max-w-[420px] text-[16.5px] leading-[1.636] text-ink-soft">
                  Most telemedicine assumes a smartphone, a data plan, a card and a shared language.
                  In rural Nigeria that is four assumptions too many.
                </p>
              </div>

              <div className="flex flex-col lg:flex-1">
                {CAPABILITIES.map((c, i) => (
                  <div
                    key={c.title}
                    className={`flex gap-[22px] py-[26px] ${
                      i > 0 ? "border-t border-line" : ""
                    }`}
                  >
                    <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-pine-wash text-pine">
                      {c.icon}
                    </span>
                    <div className="flex flex-col gap-[7px]">
                      <h3 className="max-w-[560px] text-[19px] font-semibold text-ink">
                        {c.title}
                      </h3>
                      <p className="max-w-[560px] text-[15.5px] leading-[1.613] text-ink-soft">
                        {c.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollFx>
          </section>

          {/* ------------------------------ the CHW ------------------------------ */}
          {/* Canvas: a 610px photo hard against the left edge, the text column
              centred in the remainder on a 22px rhythm. */}
          <section
            id="chw"
            className="grid items-stretch bg-[#0B3D46] lg:h-[100svh] lg:grid-cols-[610px_1fr]"
          >
            <div className="relative min-h-[360px]">
              <Image src="/img/chw-visit.png" alt="" fill className="object-cover" />
            </div>
            <div className="flex flex-col justify-center gap-[22px] px-6 py-16 sm:px-[72px] lg:py-0">
              <Reveal>
                <SectionLabel tone="amber">
                  The person in the middle
                </SectionLabel>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="max-w-[600px] font-display text-[30px] font-semibold leading-[1.146] tracking-[-0.017em] text-white sm:text-[36px] lg:text-[41px]">
                  A trained neighbour,
                  <span className="block text-amber">not a stranger.</span>
                </h2>
              </Reveal>
              <Reveal delay={140}>
                <p className="max-w-[596px] text-[16.5px] leading-[1.697] text-[#B7CDD0]">
                  SHATS does not drop an app into a village and hope. Every community has a Community
                  Health Worker — someone from there, trained and equipped — who registers people,
                  takes blood pressure and temperature, sits in on the consultation, and carries the
                  cases a phone alone cannot carry.
                </p>
              </Reveal>
              <Reveal delay={200}>
                <ul className="flex flex-col gap-[13px] pt-2">
                  {CHW_FACTS.map((f) => (
                    <li key={f} className="flex items-center gap-[11px] text-[15.5px] text-[#D3E2E4]">
                      <span className="shrink-0 text-amber">
                        <CheckIcon size={17} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={260}>
                <Link
                  href="/enter/chw"
                  className="inline-flex items-center gap-2.5 text-[16px] font-semibold text-amber hover:underline"
                >
                  Are you a health worker? See your rounds <ArrowRight size={17} />
                </Link>
              </Reveal>
            </div>
          </section>

          {/* ----------------------------- the doctors --------------------------- */}
          {/* Canvas: 56/72 padding, 34px between head and grid, 660 + 436 head
              split, 28px between cards, photos a flat 340 tall. */}
          <section
            id="doctors"
            className="bg-paper px-6 py-[56px] sm:px-[72px] lg:flex lg:h-[100svh] lg:flex-col lg:justify-center"
          >
            <Reveal>
              <div className="flex flex-col gap-10 lg:flex-row lg:gap-[100px]">
                <div className="flex flex-col gap-5 lg:w-[660px] lg:shrink-0">
                  <SectionLabel>
                    Who you will meet
                  </SectionLabel>
                  <h2 className="max-w-[640px] font-display text-[32px] font-semibold leading-[1.14] tracking-[-0.016em] text-pine sm:text-[38px] lg:text-[43px]">
                    Every doctor is checked against the register before they see anyone.
                  </h2>
                </div>
                <p className="text-[17px] leading-[1.647] text-ink-soft lg:max-w-[436px] lg:shrink-0">
                  Licence verified with the Medical and Dental Council of Nigeria, identity confirmed,
                  and every consultation recorded. If a doctor is struck off, their account closes the
                  same day.
                </p>
              </div>
            </Reveal>

            <div className="mt-[34px] grid gap-[28px] md:grid-cols-3">
              {doctors.map((d, i) => (
                <Reveal key={d.id} delay={i * 100}>
                  <article className="flex flex-col gap-4">
                    <div className="relative h-[340px] overflow-hidden rounded-[8px] bg-line">
                      {d.photoUrl ? (
                        <Image src={d.photoUrl} alt="" fill className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center font-display text-4xl text-muted">
                          {d.fullName
                            .split(" ")
                            .slice(1)
                            .map((p) => p[0])
                            .join("")}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-[7px]">
                      <h3 className="text-[19px] font-semibold text-ink">{d.fullName}</h3>
                      <p className="text-[14.5px] text-muted">
                        {d.specialty} · {d.city}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5 pt-3">
                      <span className="shrink-0 text-ink-soft">
                        <LanguagesIcon size={15} />
                      </span>
                      <span className="text-[14px] text-ink-soft">
                        {d.languages.map((l) => LANGUAGE_NAMES[l] ?? l).join(", ")}
                      </span>
                      <span className="ml-auto font-display text-[20px] font-semibold text-pine">
                        {naira(d.feeKobo)}
                      </span>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <Link
                href="/enter/doctor"
                className="mt-[26px] inline-flex items-center gap-2.5 text-[16px] font-semibold text-clay hover:underline"
              >
                <StethoscopeIcon size={18} />
                Are you a doctor? See how consultations, referrals and payouts work
                <ArrowRight size={17} />
              </Link>
            </Reveal>
          </section>

          {/* ----------------------------- emergency ----------------------------- */}
          {/* Last panel of the run, and deliberately static: it is the one moment
              on the page that should feel like an alarm, not a flourish.
              Canvas: 96/72 padding, 26px rhythm, 56px chips on a 16px chain. */}
          <section className="bg-[#08272E] px-6 py-[72px] sm:px-[72px] lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-[96px]">
            <div className="flex flex-col gap-[26px]">
              <SectionLabel tone="alert">
                When it is urgent
              </SectionLabel>
              <h2 className="max-w-[900px] font-display text-[32px] font-semibold leading-[1.111] tracking-[-0.018em] text-white sm:text-[38px] lg:text-[45px]">
                One press. Three people move at once.
              </h2>
              <p className="max-w-[700px] text-[17.5px] leading-[1.657] text-[#B7CDD0]">
                An emergency does not wait for a booking. The alert goes out to everyone who can help
                at the same time, and it keeps moving down the line until somebody accepts it.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-[18px]">
                {EMERGENCY_CHAIN.map((label, i) => (
                  <div key={label} className="flex items-center gap-4">
                    {i > 0 && (
                      <span className="text-[#5E7C81]">
                        <ArrowRight size={19} />
                      </span>
                    )}
                    <span className="inline-flex h-[56px] items-center gap-[11px] rounded-full border border-[#1D5460] bg-[#0E3A43] px-[22px] text-[15.5px] font-semibold text-night-text">
                      <span className="text-amber">
                        <SirenIcon size={19} />
                      </span>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </OverlayStack>

        {/* ------------------------------- learn ------------------------------- */}
        {/* Canvas: 104/72 padding, 52px between head and cards, 660 + 436 head
            split, 28px between cards, photos 196 tall. */}
        <section className="bg-paper px-6 py-[72px] sm:px-[72px] lg:py-[104px]">
          <ScrollFx mode="fade">
            <div className="flex flex-col gap-10 lg:flex-row lg:gap-[100px]">
              <div className="flex flex-col gap-5 lg:w-[660px] lg:shrink-0">
                <SectionLabel>
                  Between visits
                </SectionLabel>
                <h2 className="max-w-[640px] font-display text-[32px] font-semibold leading-[1.14] tracking-[-0.016em] text-pine sm:text-[38px] lg:text-[43px]">
                  Plain answers, read aloud, in your own language.
                </h2>
              </div>
              <p className="text-[17px] leading-[1.647] text-ink-soft lg:max-w-[436px] lg:shrink-0">
                Health information written for people who were never taught to read it — short,
                spoken, and free whether or not you ever book a consultation.
              </p>
            </div>
          </ScrollFx>

          <div className="mt-[52px] grid gap-[28px] md:grid-cols-3">
            {articles.map((a) => (
              <ScrollFx mode="fade" key={a.slug}>
                <Link href="/learn" className="flex flex-col gap-[15px]">
                  <div className="relative h-[196px] overflow-hidden rounded-[8px]">
                    <Image src={a.imageUrl} alt="" fill className="object-cover" />
                  </div>
                  <h3 className="max-w-[390px] text-[19.5px] font-semibold leading-[1.333] text-ink">
                    {a.title}
                  </h3>
                  <p className="flex items-center gap-[9px] text-[14px] text-muted">
                    <SpeakerIcon size={15} />
                    {a.readMinutes} min · {LANGUAGE_NAMES[a.language] ?? a.language}
                  </p>
                </Link>
              </ScrollFx>
            ))}
          </div>
        </section>

        {/* ------------------------------ safety ------------------------------- */}
        <section id="safety" className="bg-[#062E35] px-6 py-[72px] sm:px-[72px] lg:py-[104px]">
          <ScrollFx mode="fade">
            <div className="flex flex-col gap-10 lg:flex-row lg:gap-[100px]">
              <div className="flex flex-col gap-5 lg:w-[660px] lg:shrink-0">
                <SectionLabel tone="amber">
                  Safety and privacy
                </SectionLabel>
                <h2 className="max-w-[640px] font-display text-[32px] font-semibold leading-[1.14] tracking-[-0.016em] text-white sm:text-[38px] lg:text-[43px]">
                  Your record belongs to you, not to a clinic.
                </h2>
              </div>
              <p className="text-[17px] leading-[1.65] text-[#9FBDC1] lg:max-w-[436px] lg:shrink-0">
                Rural patients are used to their history living in a paper file in a building they
                cannot get back to. On SHATS it travels with them.
              </p>
            </div>
          </ScrollFx>

          <div className="mt-[58px] grid gap-10 md:grid-cols-4 md:gap-0">
            {SAFEGUARDS.map((s, i) => (
              <ScrollFx
                mode="fade"
                key={s.title}
                className={`flex flex-col gap-3 ${
                  i > 0 ? "md:border-l md:border-[#1D5460] md:pl-10" : ""
                } ${i < SAFEGUARDS.length - 1 ? "md:pr-10" : ""}`}
              >
                <span className="text-amber">{s.icon}</span>
                <h3 className="max-w-[250px] text-[18px] font-semibold text-white">{s.title}</h3>
                <p className="max-w-[250px] text-[14.5px] leading-[1.6] text-[#9FBDC1]">
                  {s.body}
                </p>
              </ScrollFx>
            ))}
          </div>
        </section>

        {/* ----------------------------- two doors ----------------------------- */}
        {/* Two full-width rows separated by hairlines rather than two filled
            cards. The hierarchy is carried by type size and by which arrow is
            solid — the patient door is the one that matters, and a pair of
            equal coloured boxes said the opposite. */}
        <section className="px-6 py-24 sm:px-[72px]">
          <ScrollFx mode="fade">
            <SectionLabel>Where to start</SectionLabel>
            <h2 className="mt-[18px] font-display text-[clamp(30px,4.5vw,48px)] font-semibold leading-[1.12] tracking-[-0.02em] text-pine">
              Somebody you love is far from a doctor.
              <span className="block text-clay">That is the whole problem we are solving.</span>
            </h2>
          </ScrollFx>

          <ScrollFx mode="fade" className="mt-11">
            {DOORS.map((d) => (
              <Link
                key={d.href}
                href={d.href}
                className="group flex flex-col gap-5 border-t border-line-strong py-9 last:border-b lg:flex-row lg:items-center lg:gap-11"
              >
                <SectionLabel
                  as="span"
                  tone={d.primary ? "clay" : "muted"}
                  className="lg:w-[300px] lg:shrink-0"
                >
                  {d.label}
                </SectionLabel>

                <span className="flex-1">
                  <span
                    className={`block font-display font-semibold leading-[1.1] tracking-[-0.015em] ${
                      d.primary
                        ? "text-[clamp(28px,3.2vw,40px)] text-pine"
                        : "text-[clamp(25px,2.7vw,34px)] text-ink"
                    }`}
                  >
                    {d.title}
                  </span>
                  <span
                    className={`mt-2.5 block max-w-[700px] text-base leading-relaxed ${
                      d.primary ? "text-ink-soft" : "text-muted"
                    }`}
                  >
                    {d.body}
                  </span>
                </span>

                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ease-out group-hover:-translate-y-1.5 ${
                    d.primary
                      ? "bg-clay text-white"
                      : "border border-line-strong text-ink-soft"
                  }`}
                >
                  <ArrowRight size={22} />
                </span>
              </Link>
            ))}
          </ScrollFx>

          <p className="mt-8 flex items-center gap-2.5 text-[15.5px] text-muted">
            <PhoneIcon size={17} />
            No smartphone? Dial *737# from any phone in Nigeria and a health worker will call you back.
          </p>
        </section>

        {/* ------------------------------- footer ------------------------------ */}
        {/* Canvas order: brand + link columns, then the disclaimer, then the
            rule, then the bottom bar. 76/72 padding, 80px gutter. */}
        <footer className="bg-night px-6 py-[72px] sm:px-[72px] lg:py-[76px]">
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
            <div className="flex flex-col items-start gap-4 lg:w-[352px] lg:shrink-0">
              <Logo variant="light" height={34} />
              <p className="max-w-[330px] text-[15px] leading-[1.667] text-night-muted">
                Smart Healthcare Appointment &amp; Telemedicine System. Built for rural Nigeria, on
                the phones people already have.
              </p>
              <span className="inline-flex h-9 items-center gap-[9px] rounded-full bg-night-2 px-[15px] text-[14px] font-bold tracking-[0.6px] text-night-text">
                <span className="text-amber">
                  <PhoneIcon size={14} />
                </span>
                *737#
              </span>
            </div>

            <div className="grid flex-1 gap-10 sm:grid-cols-4">
              {FOOTER_COLS.map((col) => (
                <div key={col.head} className="flex flex-col gap-[15px]">
                  <p className="text-[10.5px] font-bold uppercase tracking-[1.5px] text-night-muted">
                    {col.head}
                  </p>
                  {col.links.map((l) => (
                    <span key={l} className="text-[14.5px] text-night-text">
                      {l}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5 pt-[34px]">
            <p className="text-[10.5px] font-bold uppercase tracking-[1.5px] text-amber">
              About this project
            </p>
            <p className="max-w-[1000px] text-[13.5px] leading-[1.63] text-night-muted">
              SHATS is a university design project (CSC 411, Object-Oriented Analysis &amp; Design).
              It is not a real service, it is not registered with any health authority, and it cannot
              be used to obtain medical care or advice. Doctor and patient names are illustrative.
              Some photographs are AI-generated and do not depict real people. Statistics are cited
              from WHO and World Bank sources and were checked in August 2026.
            </p>
          </div>

          <div className="mt-[34px] h-px w-full bg-night-line" />

          <div className="flex flex-wrap items-center justify-between gap-7 pt-[26px] text-[13.5px] text-night-muted">
            <span>© 2026 SHATS · A CSC 411 design project</span>
            <span className="flex flex-wrap gap-[26px]">
              <span>Terms</span>
              <span>Privacy</span>
              <span>Data protection (NDPR)</span>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* The product fragments shown beside each journey step                        */
/* -------------------------------------------------------------------------- */

function JourneyCard({ step }: { step: number }) {
  const shell =
    "flex w-full max-w-[clamp(440px,36vw,760px)] flex-col gap-[15px] rounded-[14px] bg-paper p-[26px]";

  if (step === 0) {
    const tiles = [
      { en: "Fever", ig: "Ahụ ọkụ", on: true },
      { en: "Cough", ig: "Ụkwara", on: false },
      { en: "Belly pain", ig: "Afọ mgbu", on: false },
      { en: "Cannot sleep", ig: "Anaghị ehi ụra", on: false },
    ];
    return (
      <div className={shell}>
        <p className="text-[10.5px] font-bold uppercase tracking-[0.15em] text-clay">
          Question 1 of 3
        </p>
        <h4 className="font-display text-[31px] font-semibold text-pine">What is wrong?</h4>
        <span className="inline-flex items-center gap-2 rounded-full bg-pine-wash px-4 py-2 text-sm font-semibold text-pine">
          Listen in Igbo
        </span>
        <div className="grid grid-cols-2 gap-3">
          {tiles.map((t) => (
            <div
              key={t.en}
              className={`rounded-[8px] border p-4 ${
                t.on ? "border-2 border-pine bg-pine-wash" : "border-line bg-white"
              }`}
            >
              <p className="text-base font-semibold text-ink">{t.en}</p>
              <p className="text-[13px] text-muted">{t.ig}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className={shell}>
        <p className="text-[10.5px] font-bold uppercase tracking-[0.15em] text-clay">
          Choose a doctor
        </p>
        <div className="space-y-3">
          {doctors.slice(0, 2).map((d, i) => (
            <div
              key={d.id}
              className={`flex items-center gap-3.5 rounded-[8px] border p-3.5 ${
                i === 0 ? "border-2 border-pine bg-pine-wash" : "border-line bg-white"
              }`}
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold ${
                  i === 0 ? "bg-pine text-white" : "bg-line-strong text-paper"
                }`}
              >
                {d.fullName.split(" ")[1][0]}
                {d.fullName.split(" ")[2]?.[0] ?? ""}
              </span>
              <span className="flex-1">
                <span className="block text-[16.5px] font-semibold text-ink">{d.fullName}</span>
                <span className="block text-[13px] text-muted">
                  {d.specialty} · {d.city}
                </span>
              </span>
              <span
                className={`font-display text-[25px] font-semibold ${
                  i === 0 ? "text-pine" : "text-ink-soft"
                }`}
              >
                {naira(d.feeKobo)}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[13.5px] text-ink-soft">
          This is the whole price. Nothing is added at the end.
        </p>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className={shell}>
        <div className="flex h-[182px] flex-col items-center justify-center gap-3 rounded-[8px] bg-[#0B2E35]">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-pine-mid text-xl font-bold text-white">
            CO
          </span>
          <p className="text-[17px] font-semibold text-white">Dr. Chidi Okonkwo</p>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-[#D3E2E4]">
            <span className="h-2 w-2 rounded-full bg-[#5FBF7A]" /> You are connected · 04:12
          </span>
        </div>
        <p className="rounded-[8px] bg-clay-wash p-3.5 text-[13.5px] leading-snug text-clay">
          The network got weak, so we moved you to voice. The doctor can still hear you.
        </p>
        <p className="rounded-[8px] bg-pine-wash p-3.5 text-[13.5px] leading-snug text-pine">
          Ngozi Eze, your health worker, is in the room with you.
        </p>
      </div>
    );
  }

  return (
    <div className={shell}>
      <p className="text-[10.5px] font-bold uppercase tracking-[0.15em] text-clay">
        After the visit
      </p>
      <div className="flex items-center gap-3.5 rounded-[8px] border border-line bg-white p-3.5">
        <span className="text-pine">
          <PillIcon size={24} />
        </span>
        <span className="flex-1">
          <span className="block text-[16.5px] font-semibold text-ink">Coartem</span>
          <span className="block text-[13.5px] text-muted">1 tablet, twice a day, for 3 days</span>
        </span>
        <span className="rounded-full bg-pine-wash px-3 py-1.5 text-[11.5px] font-semibold text-pine">
          Ready at Eze Chemist
        </span>
      </div>
      <p className="rounded-[8px] border border-line bg-white p-3.5 text-[13.5px] text-ink-soft">
        Your record was saved — on SHATS and on your own phone.
      </p>
      <div className="flex items-center gap-3 rounded-[8px] bg-alert-wash p-3.5">
        <span className="text-alert">
          <SirenIcon size={22} />
        </span>
        <span>
          <span className="block text-[10.5px] font-bold uppercase tracking-[0.12em] text-alert">
            If it becomes an emergency
          </span>
          <span className="mt-1 block text-[13.5px] leading-snug text-ink">
            One press reaches your health worker, a doctor and the nearest facility at once.
          </span>
        </span>
      </div>
    </div>
  );
}
