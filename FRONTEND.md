# SHATS — front end

Smart Healthcare Appointment & Telemedicine System. Next.js 16 (App Router),
React 19, Tailwind v4, TypeScript.

> **This is a design project.** It is not a real service, it is not registered
> with any health authority, and it cannot be used to obtain medical care.
> Doctor and patient names are illustrative and some photographs are
> AI-generated. See `design/design.pen` for the image provenance note.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Routes

| Route | Screen |
| --- | --- |
| `/` | Landing page |
| `/welcome` | Language selection |
| `/register` → `/verify` | Sign-up and SMS code |
| `/home` | Patient hub |
| `/symptoms` → `/doctors` → `/time` → `/pay` → `/booked` | Booking flow |
| `/consultation` | Patient's call screen |
| `/medicines`, `/health`, `/profile`, `/learn` | Patient references |
| `/emergency` → `/emergency/coming` | Raise an emergency, then track it |
| `/doctor` | Today's schedule |
| `/doctor/patients`, `/doctor/patients/[id]` | Patient list and record |
| `/doctor/consultation` | Consultation room + end/conflict dialogs |
| `/chw` | Today's rounds |
| `/chw/register`, `/chw/visit`, `/chw/emergency` | Field work |

## Shared UI

`components/ui.tsx` holds the kit. Two pieces were exported but unused, and are
now the single source for patterns the screens had been repeating inline:

- **`SectionLabel`** — the eyebrow above a section heading, at the canvas values
  (Archivo 11.5/700, 1.8px tracking). Ten usages on the landing page across
  three tones. Takes `as="span"` for the places it sits inside a link.
- **`Field`** — label, optional hint, input. Used by the sign-up form.

## Dialogs

The design carries 18 modal states alongside the 24 screens, and all of them are
built. `components/Dialog.tsx` is the shell — it adds the things a static canvas
cannot show: Escape to dismiss, a scrim click to dismiss, the page behind locked
against scrolling, focus moved in on open and handed back to the trigger on
close, and Tab kept inside the panel.

| Set | File | Screens |
| --- | --- | --- |
| Patient | `components/dialogs/patient.tsx` | POP1–POP8 |
| Doctor | `components/dialogs/doctor.tsx` | DP1–DP5 |
| Health worker | `components/dialogs/chw.tsx` | CP1–CP5 |

Pages stay server components. The state lives in small client islands in
`components/dialogs/triggers.tsx` (patient) and `pro-triggers.tsx` (doctor and
CHW), each rendering only the control that opens its dialog.

## Landing-page motion

The landing page runs five scroll moves, specified in the author notes inside
`design/design.pen`. Everything from the second section down is **scroll-position
driven, not triggered** — every state is a pure function of where the element
sits, so effects run backwards on the way up and nothing latches on first sight.

| Move | Component | What it does |
| --- | --- | --- |
| Hero overlay | `CoverVeil` | Hero and section 2 pin; each sinks to 65% black as the next rides over it |
| Journey pin and hold | `JourneyPanel` | Steps 01–04 each pin and hold, text unblurring 9px→0 and growing 0.93→1 from the left edge |
| Unblur and grow | `ScrollFx mode="blur-grow"` | Section 4, which is only type and icons |
| Second overlay | `OverlayStack` | Sections 4–7 stack; section 7 is last, so it cannot pin — deliberately static |
| Tail fades | `ScrollFx mode="fade"` | Sections 8–11 cascade block by block |

All of it is off under `prefers-reduced-motion` and below 1024px, where the page
is a plain stack. Opacity and blur are applied to a wrapper around a section's
contents, never to the section itself.

## Typography

`Fraunces` is a variable font with an optical-size axis, requested explicitly in
`app/layout.tsx` (`axes: ["opsz"]`) and pinned to the display cut in
`app/globals.css`. Without the pin Chrome picks an optical size from the font
size, the letterforms widen, and every headline breaks in a different place than
the canvas. The font variables are declared on `<html>`, not `<body>`, because
Tailwind v4 emits its `@theme` tokens on `:root` — declared any lower, the
`var()` chain collapses and display type silently falls back to sans.

## Wiring up the Spring Boot back end

Everything crosses the network through **`lib/api.ts`**. Nothing else calls
`fetch`, so that one file is the whole contract.

**1. Point at the gateway.** Copy `.env.example` to `.env.local`. Each service
reads its own variable and falls back to `NEXT_PUBLIC_API_GATEWAY`, so you can
split services out one at a time without touching code.

**2. Check the routes against your controllers.** `API_ROUTES` in `lib/api.ts`
is a flat manifest of every path the client calls, grouped by service. Diff it
against your `@RequestMapping` values — if the two agree, the contract holds.

**3. Match the DTOs.** `lib/types.ts` is the domain model from the UML class
diagram. Two conventions worth keeping on the Java side:

- **Money is `kobo` as an integer** (`feeKobo`, `amountKobo`). Never a float,
  and never a bare "amount" whose unit you have to guess.
- **Timestamps are ISO-8601 strings**, not epoch numbers, so an offline CHW
  record keeps its original capture time when it finally syncs.

**4. Supply the token.** Call `setTokenProvider(() => token)` once at start-up;
the client attaches `Authorization: Bearer …` to everything except the calls
marked anonymous (registration, OTP, public content).

**5. Errors.** Non-2xx responses become an `ApiError` with `status`, `code`,
`fieldErrors` and `traceId`. Return that shape from a
`@RestControllerAdvice` and the front end needs no special cases.

See [`BACKEND.md`](BACKEND.md) for the full service specification.

## Where the data comes from today

Pages read from `lib/mock.ts`. Both it and the API client are typed against
`lib/types.ts`, so going live is a matter of replacing a mock import with the
matching `api.*` call — the shapes already agree.

## Authentication today

`lib/session.ts` holds a **demo session**, not authentication: an unsigned
base64 payload in an httpOnly cookie with a fabricated token, so the role-based
routing in `proxy.ts` can be demonstrated. It uses `btoa`/`atob` rather than
`Buffer` because the proxy runs on the Edge runtime, where `Buffer` does not
exist — and if it throws there, every guarded route silently falls open.

`proxy.ts` is the Next.js 16 name for what used to be `middleware.ts`. It
imports from `./lib/session` with a relative path rather than the `@/` alias,
because the Edge bundler that packages this file does not resolve the tsconfig
path alias.

Replace it with `identity-service` before this is exposed to anyone.

## Design tokens

`app/globals.css` mirrors the variables in `design/design.pen` one-for-one. If
a colour changes there, change it there and nowhere else — no component
hard-codes a hex value.

The palette is a deep petrol teal (`--color-pine: #0B4A54`), chosen because it
is the complement of blood red — the reason operating-theatre textiles are that
colour. It reads as clinical rather than as generic "wellness green".
