# SHATS

**Smart Healthcare Appointment & Telemedicine System** — a telemedicine and
community-health platform designed for rural Nigeria, where the nearest doctor
is often hours of travel away and the phone in someone's pocket is the only
device that will ever reach one.

This repository holds three things: the **design source** the product was drawn
in, the **working front end** built from it, and the **specification** for the
Spring Boot back end that will sit behind it.

> [!IMPORTANT]
> **This is a design and engineering project, not a live service.** It is not
> registered with any health authority and cannot be used to obtain medical
> care. Doctor and patient names are illustrative, clinical content is sample
> data, and some photographs are AI-generated or stock — see the image
> provenance note inside `design/design.pen`. Nothing here should be presented
> as a real practitioner, a real patient, or real medical advice.

---

## The problem

Nigeria has roughly **3.9 doctors per 10,000 people**, against a WHO threshold
of 10. About **45% of Nigerians live in rural areas** (World Bank, 2024), and
the country accounts for **28.7% of global maternal deaths** (WHO MMEIG, 2023).

The shortage is not only a shortage of doctors — it is a shortage of *reach*.
A patient in a village may be four hours from the nearest physician, on a
network that drops to 2G, holding a phone with no data credit, reading in a
language most software does not speak.

SHATS is designed for those constraints rather than around them.

## What it does

Three people use the system, and they need different things from it.

| Role | What the product gives them |
| --- | --- |
| **Patient** | Describe symptoms with pictures and two languages, choose a doctor and a time, pay by mobile money, consult by video/voice/text, and track medicines and results afterwards. |
| **Doctor** | A day's schedule, a consultation room with the patient's record beside it, an allergy and interaction check that runs before any prescription is issued, and escalations arriving from the field. |
| **Community Health Worker (CHW)** | Register patients, record vitals and home visits **while offline**, escalate to a doctor, and respond to emergencies — with everything syncing when signal returns. |

The CHW is the part that makes the rest work. A doctor two states away cannot
take a blood pressure reading; a health worker on a bicycle can, and the CHW
role is what connects the person in the village to the physician on the network.

### Designed for the network you actually have

These are the constraints the design keeps returning to:

- **Offline first.** CHW capture never blocks on connectivity. Records are
  written on the phone with a client-generated ID and pushed in an idempotent
  batch later, so retrying in a weak-signal area cannot duplicate a patient.
- **Two clocks, never conflated.** `captured_at` is when the reading was taken;
  `received_at` is when the server heard about it, possibly hours later.
  Clinical decisions use `captured_at`.
- **A path that survives no data at all.** Every error state ends with a USSD
  fallback — `*737#`, or `*737*0#` for an emergency — which works on any phone,
  on any network, with no airtime.
- **Five languages.** English, Igbo, Hausa, Yorùbá and Nigerian Pidgin, with a
  *Listen* button on every screen that carries a decision, because the product
  cannot assume its reader is a confident reader.
- **Plain words.** No "invalid input", no "required field". Errors say what
  happened and what to do about it, in the interface's own voice.
- **Money as an integer count of kobo.** `feeKobo`, `amountKobo` — never a
  float, never a bare `amount` whose unit you have to guess.

## Repository layout

The Next.js application sits at the repository root, so Vercel and `next dev`
find it with no configuration.

```
SHATS/
├── app/                        Routes (App Router)
├── components/                 Shared kit, dialogs, scroll-motion components
├── lib/                        API client, domain types, mock data, validation
├── public/                     Logos and imagery
├── proxy.ts                    Role-based route guard
│
├── design/                     The design source of truth
│   ├── design.pen              Pencil canvas — every screen, dialog and token
│   ├── landing.html            Generated browsable preview (do not hand-edit)
│   ├── build-preview.py        Rebuilds landing.html from a Pencil export
│   ├── SHATS_UML_Diagrams.html UML diagrams (the canonical version)
│   ├── SHATS_UML_Design.docx   The same design as a document
│   ├── SHATS — UML Diagrams.pdf  Print exports
│   └── images/, *.jpg, *.png   Artwork and both logo variants
│
├── FRONTEND.md                 Front-end guide: routes, dialogs, motion, typography
└── BACKEND.md                  Full Spring Boot specification
```

## Project status

| Part | State |
| --- | --- |
| UML design (use case, class, state, sequence, activity) | **Complete** |
| Pencil design — 24 screens, 18 dialogs, landing page | **Complete** |
| Front end built from the design | **Complete** — all 24 screens and all 18 dialogs |
| Spring Boot back end | **Specified, not yet built** — see [`BACKEND.md`](BACKEND.md) |

The front end currently reads from `lib/mock.ts`. It is a fully navigable
prototype: real focus management, real scroll motion, real text-to-speech, real
offline messaging — but no server behind it yet.

> [!NOTE]
> Sign-in is a **demo session**, not authentication. It stores an unsigned
> base64 payload in an httpOnly cookie with a fabricated token, purely so the
> role-based routing can be demonstrated. It must be replaced by
> `identity-service` before this is exposed to anyone.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Pick a role on `/welcome` — patient, doctor or health worker — and the app
routes you to that role's home. Other commands:

```bash
npm run build      # production build
npm run lint       # eslint
npx tsc --noEmit   # typecheck
```

**Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript
(strict). Pages are Server Components by default; interactivity is isolated
into small client islands so a screen ships almost no JavaScript.

## The design source

`design/design.pen` is a [Pencil](https://pen.dev) canvas and the authority on
everything visual. It contains all 24 screens, all 18 dialog states, the landing
page, a component kit, and four author notes specifying image provenance and the
landing page's scroll choreography.

Two rules that keep the code and the canvas in agreement:

1. **Design tokens live in one place.** `app/globals.css` mirrors the
   canvas variables one-for-one via Tailwind v4 `@theme`. If a colour changes,
   it changes there and nowhere else — no component hard-codes a hex value.
2. **`design/landing.html` is generated, never hand-edited.** Export the `L0`
   frame from Pencil as `html-css` with layer names on, then:
   ```bash
   python3 design/build-preview.py <export> design/landing.html
   ```

`.pen` files are encrypted and cannot be opened with a text editor — use Pencil.

### About the palette

The primary colour is a deep petrol teal (`--color-pine: #0B4A54`), chosen
because it is the complement of blood red — the same reason operating-theatre
textiles are that colour. It reads as clinical rather than as generic
"wellness green".

## Architecture

### Today

```
Next.js front end  ──►  lib/mock.ts   (typed sample data)
```

### Intended

```
Next.js front end  ──►  lib/api.ts  ──►  API gateway  ──►  11 Spring Boot apps
                                                             ├─ 8 business services
                                                             └─ 3 infrastructure
```

**`lib/api.ts` is the entire contract.** Nothing else in the front end
calls `fetch`, so that one file is the whole seam between client and server. It
exports `API_ROUTES`, a flat manifest of every path the client calls — written
to be diffed directly against your Spring `@RequestMapping` values.

`lib/types.ts` is the domain model, taken from the UML class diagram.
Both the mock data and the API client are typed against it, so going live means
replacing a mock import with the matching `api.*` call — the shapes already
agree.

### The eight business services

Drawn on one rule: *a service exists because it owns one concept that the others
must ask permission to touch.*

| Service | Owns |
| --- | --- |
| `identity-service` | Who you are, and whether you may act |
| `patient-service` | The record that follows the person |
| `scheduling-service` | Time |
| `consultation-service` | The clinical encounter |
| `payment-service` | Money |
| `emergency-service` | Dispatch under a clock |
| `content-service` | Language and literacy |
| `notification-service` | Reaching a phone with no internet |

Plus `api-gateway`, `discovery-server` (Eureka) and `config-server` — **eleven
Spring Boot applications** in total.

`BACKEND.md` also argues for three services that deliberately **do not** exist
(`chw-service`, `doctor-service`, `prescription-service`), because a bad service
split is harder to undo than a missing one. It carries the full Postgres schema,
the booking saga, the outbox pattern for events, and a four-phase build order.

## UML design documents

`design/SHATS_UML_Diagrams.html` is the canonical set — open it in a browser:

- **Use case diagram** — actors and system boundaries
- **Class diagram** — the domain model that `lib/types.ts` implements
- **State diagram** — the appointment lifecycle
- **Sequence diagram** — booking an appointment
- **Activity diagram** — the booking workflow

`design/SHATS_UML_Design.docx` and the PDFs are the same design in document
form. Where they disagree, the HTML version is authoritative.

## Where to read next

| I want to… | Read |
| --- | --- |
| Understand the screens, routes and dialogs | [`FRONTEND.md`](FRONTEND.md) |
| Build the back end | [`BACKEND.md`](BACKEND.md) |
| See the API contract | `lib/api.ts` |
| See the domain model | `lib/types.ts` |
| Change a colour, radius or font | `app/globals.css` (mirrors `design.pen`) |
| Configure service URLs | `.env.example` → `.env.local` |
