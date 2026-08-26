# SHATS — backend build guide

Spring Boot microservices for the SHATS front end in this repository.
Everything the front end calls is declared in `lib/api.ts`; this document is the
server side of that contract.

---

## 1. How many services, and why

**Eight business services.** The rule used to draw the lines: *a service exists
because it owns one concept that the others must ask permission to touch.* Not
one service per table, and not one per screen.

| # | Service | The one concept it owns | Why it is separate |
|---|---|---|---|
| 1 | `identity-service` | **Who you are, and whether you may act** | Auth is the only thing every other service depends on. It must be the least likely to change. |
| 2 | `patient-service` | **The record that follows the person** | The crown jewel. NDPR consent and access logging live here, so its blast radius must be small and its audit trail complete. |
| 3 | `scheduling-service` | **Time** | The only service needing strict concurrency control — two patients must never take one slot. |
| 4 | `consultation-service` | **The clinical encounter** | Notes, diagnosis and prescriptions are written once and then are legally immutable. Different write pattern from everything else. |
| 5 | `payment-service` | **Money** | Different compliance rules, different retry semantics, and it talks to MoMo/OPay whose webhooks arrive twice. Isolate it. |
| 6 | `emergency-service` | **Dispatch under a clock** | Must stay up when the rest is down. It is the one service where an outage costs a life, so it gets its own deploy, its own scaling, and no dependency on payment or scheduling. |
| 7 | `content-service` | **Language and literacy** | Read-heavy, cacheable, publicly readable. Opposite profile to everything else, so it should never share a connection pool with them. |
| 8 | `notification-service` | **Reaching a phone with no internet** | SMS/USSD gateways are slow and flaky. Anything calling them synchronously inherits their latency, so it sits behind a queue. |

Plus three infrastructure programs: `api-gateway`, `discovery-server`
(Eureka), `config-server`. **Eleven Spring Boot applications in total.**

### Things that deliberately are *not* services

Naming these matters as much as naming the services — a bad split is harder to
undo than a missing one.

**There is no `chw-service`.** A community health worker is not a domain, it is
a *role* that writes into three domains: their identity is in
`identity-service`, the vitals they record belong to `patient-service`, and the
emergency reports they file belong to `emergency-service`. Giving them their own
service would mean a second copy of the patient record — two sources of truth
for one person's allergies, which is exactly the failure the design is built to
prevent.

Offline sync is a *transport* concern, not a domain. `POST /chw/sync` lives in
the **gateway**, which unpacks the batch and fans each record out to the service
that owns it.

**There is no `doctor-service`.** A doctor's credentials are identity
(`provider_profiles` in `identity-service`); their bookable hours are time
(`scheduling-service`). Splitting "doctor" out would force a join across a
network boundary on the single most-used query in the app — doctor discovery.

**There is no `prescription-service`.** A prescription cannot exist without the
consultation that produced it, is written in the same transaction, and is never
edited afterwards. Same aggregate, same service.

### `lib/api.ts` declares eleven base URLs — that is fine

The front end groups routes by *resource*; the backend groups by *concept*. The
groups map onto services like this, and because every unset variable falls back
to `NEXT_PUBLIC_API_GATEWAY` you do not have to change a line of front-end code:

| `lib/api.ts` group | Service |
|---|---|
| `auth` | `identity-service` |
| `doctors` | `identity-service` (profile, MDCN) + `scheduling-service` (availability, discovery) |
| `patients` | `patient-service` |
| `appointments` | `scheduling-service` |
| `consultations`, `prescriptions` | `consultation-service` |
| `payments` | `payment-service` |
| `emergency` | `emergency-service` |
| `chw` | gateway fan-out |
| `content` | `content-service` |
| `notifications` | `notification-service` |

---

## 2. Conventions that apply to every service

Agree these once or you will pay for it in every integration.

**Database per service.** No service reads another's tables. No shared schema,
no cross-service foreign keys, no `JOIN` across a boundary. If you need data you
do not own, call the owner or subscribe to its events.

**IDs are UUIDv7.** Time-ordered, so they index well, and they can be generated
on a CHW's phone while offline without collision.

```java
// A CHW registers a patient with no network. The ID is real immediately.
UUID id = Generators.timeBasedEpochGenerator().generate(); // java-uuid-generator
```

**Money is an integer count of kobo.** `fee_kobo BIGINT`. Never `DOUBLE`, never
a bare `amount` whose unit you have to guess. ₦1,500 is `150000`.

**Time is `timestamptz`, always UTC**, serialised as ISO-8601. Two timestamps
that are easy to conflate and must never be:

- `captured_at` — when the CHW took the reading, on their phone
- `received_at` — when your server heard about it, possibly nine hours later

Store both. Clinical decisions use `captured_at`.

**Errors have one shape**, matching `ApiError` in `lib/api.ts`:

```java
@RestControllerAdvice
public class ApiExceptionHandler {
    record ApiErrorBody(int status, String code, String message,
                        Map<String, String> fieldErrors, String traceId) {}

    @ExceptionHandler(DomainException.class)
    ResponseEntity<ApiErrorBody> handle(DomainException e) {
        return ResponseEntity.status(e.status()).body(new ApiErrorBody(
                e.status(), e.code(), e.getMessage(), e.fieldErrors(), MDC.get("traceId")));
    }
}
```

**Every write endpoint takes an idempotency key.** A health worker on one bar of
signal will retry. The key is the client-generated `local_id`.

```sql
-- The pattern, repeated in every service that accepts field writes.
ALTER TABLE vitals ADD COLUMN local_id TEXT;
CREATE UNIQUE INDEX vitals_local_id_key ON vitals (local_id) WHERE local_id IS NOT NULL;
```

```java
// Second delivery of the same record is a no-op, not a duplicate row.
@Transactional
public Vitals record(VitalsCommand cmd) {
    return vitals.findByLocalId(cmd.localId())
                 .orElseGet(() -> vitals.save(Vitals.from(cmd)));
}
```

---

## 3. Project layout

A multi-module Maven build. One repository is fine for a project this size —
splitting repositories buys you nothing until separate teams own the services.

```
shats-backend/
├── pom.xml                     <parent, dependencyManagement only>
├── shats-common/               shared DTOs, error shape, JWT filter, UUIDv7
├── discovery-server/           Eureka
├── config-server/              Spring Cloud Config
├── api-gateway/                Spring Cloud Gateway + /chw/sync fan-out
├── identity-service/
├── patient-service/
├── scheduling-service/
├── consultation-service/
├── payment-service/
├── emergency-service/
├── content-service/
├── notification-service/
└── docker-compose.yml          postgres ×8, rabbitmq, services
```

Inside each service, package by feature rather than by layer — `controller/`,
`service/`, `repository/` folders scatter one concept across three places:

```
patient-service/src/main/java/ng/shats/patient/
├── patient/      PatientController, PatientService, PatientRepository, Patient
├── vitals/       VitalsController, VitalsService, VitalsRepository, Vitals
├── consent/      ConsentController, ConsentService, ...
└── access/       RecordAccessLogService      <- NDPR audit
```

Dependencies every service shares:

```xml
<dependency><groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId></dependency>
<dependency><groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jpa</artifactId></dependency>
<dependency><groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-validation</artifactId></dependency>
<dependency><groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId></dependency>
<dependency><groupId>org.flywaydb</groupId>
  <artifactId>flyway-core</artifactId></dependency>
<dependency><groupId>org.postgresql</groupId>
  <artifactId>postgresql</artifactId></dependency>
```

Use **Flyway**, and set `spring.jpa.hibernate.ddl-auto=validate`. Never `update`
— it will silently drop a column on a health record one day.

---

## 4. The services

### 4.1 `identity-service` — who you are

Owns accounts, phone-OTP login, sessions, roles, and provider credentialing
(MDCN). Everything else trusts its JWT and never re-checks a password.

**API**

```
POST /auth/register            create a patient account
POST /auth/otp/request         send a 4-digit code by SMS
POST /auth/otp/verify          exchange code for a session
POST /auth/login               doctor/CHW password login
POST /auth/refresh
POST /auth/logout
GET  /auth/me
PUT  /auth/me/language
GET  /doctors/{id}             provider profile
GET  /doctors/me/verification  MDCN status
```

**Schema — `identity_db`**

```sql
CREATE TYPE account_role AS ENUM ('PATIENT', 'DOCTOR', 'CHW', 'ADMIN');
CREATE TYPE verification_status AS ENUM ('PENDING', 'VERIFIED', 'SUSPENDED');

CREATE TABLE accounts (
    id             UUID PRIMARY KEY,
    phone          TEXT NOT NULL UNIQUE,
    password_hash  TEXT,                         -- NULL for OTP-only patients
    role           account_role NOT NULL,
    display_name   TEXT NOT NULL,
    language       TEXT NOT NULL DEFAULT 'en',
    active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Codes are hashed. A leaked table must not let anyone log in.
CREATE TABLE otp_codes (
    id          UUID PRIMARY KEY,
    phone       TEXT NOT NULL,
    code_hash   TEXT NOT NULL,
    expires_at  TIMESTAMPTZ NOT NULL,
    consumed_at TIMESTAMPTZ,
    attempts    SMALLINT NOT NULL DEFAULT 0
);
CREATE INDEX otp_codes_phone_idx ON otp_codes (phone, expires_at DESC);

CREATE TABLE refresh_tokens (
    id         UUID PRIMARY KEY,
    account_id UUID NOT NULL REFERENCES accounts (id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ
);

CREATE TABLE provider_profiles (
    account_id          UUID PRIMARY KEY REFERENCES accounts (id) ON DELETE CASCADE,
    mdcn_number         TEXT NOT NULL UNIQUE,
    specialty           TEXT NOT NULL,
    city                TEXT NOT NULL,
    fee_kobo            BIGINT NOT NULL CHECK (fee_kobo >= 0),
    verification_status verification_status NOT NULL DEFAULT 'PENDING',
    verified_at         TIMESTAMPTZ,
    accepting_patients  BOOLEAN NOT NULL DEFAULT FALSE,
    photo_url           TEXT
);

CREATE TABLE provider_languages (
    account_id UUID NOT NULL REFERENCES provider_profiles (account_id) ON DELETE CASCADE,
    language   TEXT NOT NULL,
    PRIMARY KEY (account_id, language)
);
```

**Queries that matter**

```sql
-- Verify an OTP. Single statement so a code cannot be used twice by two
-- concurrent requests: whoever updates the row first wins.
UPDATE otp_codes
   SET consumed_at = now()
 WHERE id = (
       SELECT id FROM otp_codes
        WHERE phone = :phone
          AND consumed_at IS NULL
          AND expires_at > now()
          AND attempts < 5
        ORDER BY expires_at DESC
        LIMIT 1
       )
   AND code_hash = crypt(:code, code_hash)
RETURNING id;
```

```sql
-- Suspend a struck-off doctor. The design promises the account closes the
-- same day, so this must also emit ProviderSuspended for scheduling to
-- cancel their future appointments.
UPDATE provider_profiles
   SET verification_status = 'SUSPENDED', accepting_patients = FALSE
 WHERE mdcn_number = :mdcn
RETURNING account_id;
```

---

### 4.2 `patient-service` — the record that follows the person

Owns demographics, vitals, allergies, NDPR consent, and the access log. This is
the service that makes "your record belongs to you, not to a clinic" true.

**API**

```
GET   /patients/me
PATCH /patients/me
GET   /patients/{id}                 requires a consultation grant
GET   /patients?q=                   doctor search by name or SHATS ID
GET   /patients/{id}/record
GET   /patients/{id}/vitals
POST  /patients/{id}/vitals          CHW writes here
GET   /patients/{id}/timeline
```

**Schema — `patient_db`**

```sql
CREATE TABLE patients (
    id                 UUID PRIMARY KEY,
    shats_id           TEXT NOT NULL UNIQUE,      -- '004182', read aloud on the phone
    account_id         UUID,                      -- NULL: registered by a CHW, no phone
    full_name          TEXT NOT NULL,
    date_of_birth      DATE,
    age_years          SMALLINT,                  -- when DOB is genuinely unknown
    sex                TEXT NOT NULL CHECK (sex IN ('MALE', 'FEMALE')),
    language           TEXT NOT NULL,
    community          TEXT NOT NULL,
    state              TEXT NOT NULL,
    nhis_number        TEXT,
    registered_by_chw  UUID,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigram index so "Okonkow" still finds "Okonkwo" — names are spelled from
-- hearing, not from a document.
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX patients_name_trgm ON patients USING gin (full_name gin_trgm_ops);
CREATE INDEX patients_shats_id_idx ON patients (shats_id);

-- Allergies carry their provenance. The prescribing dialog shows who recorded
-- it and when, so a doctor can weigh how much to trust it.
CREATE TABLE allergies (
    id           UUID PRIMARY KEY,
    patient_id   UUID NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
    substance    TEXT NOT NULL,
    severity     TEXT NOT NULL DEFAULT 'UNKNOWN',
    recorded_by  UUID NOT NULL,
    recorded_role TEXT NOT NULL,
    recorded_at  TIMESTAMPTZ NOT NULL,
    source_note  TEXT,
    UNIQUE (patient_id, substance)
);

CREATE TABLE vitals (
    id             UUID PRIMARY KEY,
    patient_id     UUID NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
    captured_at    TIMESTAMPTZ NOT NULL,     -- on the CHW's phone
    received_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    recorded_by    UUID,
    systolic       SMALLINT,
    diastolic      SMALLINT,
    temperature_c  NUMERIC(3,1),
    pulse_bpm      SMALLINT,
    weight_kg      NUMERIC(4,1),
    escalated      BOOLEAN NOT NULL DEFAULT FALSE,
    local_id       TEXT
);
CREATE UNIQUE INDEX vitals_local_id_key ON vitals (local_id) WHERE local_id IS NOT NULL;
CREATE INDEX vitals_patient_time ON vitals (patient_id, captured_at DESC);

-- NDPR: consent is a record with a purpose and a language, not a boolean.
CREATE TABLE consents (
    id                UUID PRIMARY KEY,
    patient_id        UUID NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
    purpose           TEXT NOT NULL,
    granted           BOOLEAN NOT NULL,
    granted_at        TIMESTAMPTZ NOT NULL,
    revoked_at        TIMESTAMPTZ,
    recorded_by       UUID NOT NULL,
    read_in_language  TEXT NOT NULL     -- proves it was read in a language they speak
);

-- "Every opening is logged." Append-only; never UPDATE or DELETE.
CREATE TABLE record_access_log (
    id             BIGGENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patient_id     UUID NOT NULL,
    actor_id       UUID NOT NULL,
    actor_role     TEXT NOT NULL,
    appointment_id UUID,
    reason         TEXT NOT NULL,
    accessed_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX record_access_patient ON record_access_log (patient_id, accessed_at DESC);
```

> Correct the type above to `BIGINT GENERATED ALWAYS AS IDENTITY` when you run
> it — written out here only to flag that this table is append-only.

**Queries that matter**

```sql
-- Doctor search: name or SHATS ID, tolerant of misspelling.
SELECT id, shats_id, full_name, age_years, sex, community, state
  FROM patients
 WHERE shats_id = :q
    OR full_name % :q
 ORDER BY similarity(full_name, :q) DESC
 LIMIT 20;
```

```sql
-- Authorisation for opening a record. A doctor may look only if they have a
-- consultation with this patient. This runs before every read, and the read
-- itself is logged.
SELECT EXISTS (
    SELECT 1 FROM consultation_grants
     WHERE patient_id = :patientId
       AND doctor_id  = :doctorId
       AND valid_until > now()
);
```

```sql
-- The escalation check behind C3: did this reading breach the doctor's
-- standing instruction?
SELECT v.id, v.systolic, v.diastolic, si.systolic_limit, si.diastolic_limit
  FROM vitals v
  JOIN standing_instructions si ON si.patient_id = v.patient_id
 WHERE v.id = :vitalsId
   AND (v.systolic >= si.systolic_limit OR v.diastolic >= si.diastolic_limit);
```

---

### 4.3 `scheduling-service` — time

Owns provider availability, slots, appointments, and the doctor discovery read
model. The only service that needs real concurrency control.

**API**

```
GET  /doctors                          discovery, filtered
GET  /doctors/{id}/availability
PUT  /doctors/me/availability
PATCH /doctors/me/accepting
GET  /appointments/slots
POST /appointments                     book
GET  /appointments/me
POST /appointments/{id}/cancel
POST /appointments/{id}/reschedule
GET  /appointments/doctor/schedule
```

**Schema — `scheduling_db`**

```sql
CREATE TYPE appointment_status AS ENUM (
    'PENDING_PAYMENT', 'CONFIRMED', 'IN_SESSION', 'COMPLETED', 'CANCELLED', 'MISSED');

CREATE TABLE availability_slots (
    id               UUID PRIMARY KEY,
    doctor_id        UUID NOT NULL,
    starts_at        TIMESTAMPTZ NOT NULL,
    duration_minutes SMALLINT NOT NULL DEFAULT 20,
    taken            BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (doctor_id, starts_at)      -- one doctor cannot be in two places
);
CREATE INDEX slots_open ON availability_slots (doctor_id, starts_at) WHERE NOT taken;

CREATE TABLE appointments (
    id               UUID PRIMARY KEY,
    slot_id          UUID NOT NULL UNIQUE REFERENCES availability_slots (id),
    patient_id       UUID NOT NULL,
    doctor_id        UUID NOT NULL,
    starts_at        TIMESTAMPTZ NOT NULL,
    duration_minutes SMALLINT NOT NULL,
    mode             TEXT NOT NULL CHECK (mode IN ('VIDEO', 'VOICE', 'TEXT')),
    status           appointment_status NOT NULL,
    reason           TEXT NOT NULL,
    fee_kobo         BIGINT NOT NULL,
    payment_id       UUID,
    booked_by_chw    UUID,
    hold_expires_at  TIMESTAMPTZ,       -- unpaid holds are released
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    version          INTEGER NOT NULL DEFAULT 0   -- @Version, optimistic locking
);
CREATE INDEX appt_doctor_day ON appointments (doctor_id, starts_at);
CREATE INDEX appt_patient ON appointments (patient_id, starts_at DESC);

-- Read model, kept current from identity-service events. Denormalised on
-- purpose: doctor discovery is the hottest query in the app and must not
-- cross a service boundary.
CREATE TABLE doctor_directory (
    doctor_id          UUID PRIMARY KEY,
    full_name          TEXT NOT NULL,
    specialty          TEXT NOT NULL,
    city               TEXT NOT NULL,
    languages          TEXT[] NOT NULL,
    fee_kobo           BIGINT NOT NULL,
    accepting          BOOLEAN NOT NULL,
    avg_wait_minutes   SMALLINT,
    verification_status TEXT NOT NULL,
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX directory_langs ON doctor_directory USING gin (languages);
```

**Queries that matter**

```sql
-- Doctor discovery for R6. Suspended doctors are excluded at the source.
SELECT doctor_id, full_name, specialty, city, languages, fee_kobo, avg_wait_minutes
  FROM doctor_directory
 WHERE verification_status = 'VERIFIED'
   AND accepting
   AND (:language IS NULL OR :language = ANY (languages))
   AND (:maxFeeKobo IS NULL OR fee_kobo <= :maxFeeKobo)
 ORDER BY fee_kobo ASC, avg_wait_minutes ASC
 LIMIT 20 OFFSET :offset;
```

```sql
-- Booking. The whole point is that two patients cannot take one slot.
-- Claim the slot atomically; if zero rows come back, someone beat you to it.
UPDATE availability_slots
   SET taken = TRUE
 WHERE id = :slotId AND NOT taken
RETURNING id;
-- 0 rows  -> throw SlotTakenException (HTTP 409, code SLOT_TAKEN)
-- 1 row   -> INSERT the appointment as PENDING_PAYMENT with a 15-minute hold
```

```sql
-- Release expired unpaid holds. Run every minute with ShedLock so only one
-- instance fires it.
WITH expired AS (
    UPDATE appointments
       SET status = 'CANCELLED'
     WHERE status = 'PENDING_PAYMENT'
       AND hold_expires_at < now()
    RETURNING slot_id
)
UPDATE availability_slots s
   SET taken = FALSE
  FROM expired e
 WHERE s.id = e.slot_id;
```

---

### 4.4 `consultation-service` — the clinical encounter

Owns the encounter, its notes and diagnosis, the prescription, and brokering of
the video/voice session. Clinical records are append-only: a correction is a new
amendment row, never an `UPDATE`.

**API**

```
POST /consultations/{appointmentId}/start
GET  /consultations/{id}
POST /consultations/{id}/join         returns a short-lived media token
POST /consultations/{id}/mode         video -> voice when the network drops
POST /consultations/{id}/notes
POST /consultations/{id}/end
GET  /consultations/me
POST /prescriptions
POST /prescriptions/check             the allergy / interaction check
GET  /pharmacies/nearby
```

**Schema — `consultation_db`**

```sql
CREATE TABLE consultations (
    id               UUID PRIMARY KEY,
    appointment_id   UUID NOT NULL UNIQUE,
    patient_id       UUID NOT NULL,
    doctor_id        UUID NOT NULL,
    mode             TEXT NOT NULL,
    started_at       TIMESTAMPTZ NOT NULL,
    ended_at         TIMESTAMPTZ,
    attending_chw_id UUID,                 -- the CHW physically in the room
    diagnosis        TEXT,
    notes            TEXT,
    follow_up_at     TIMESTAMPTZ
);

CREATE TABLE consultation_amendments (
    id              UUID PRIMARY KEY,
    consultation_id UUID NOT NULL REFERENCES consultations (id),
    amended_by      UUID NOT NULL,
    amended_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    reason          TEXT NOT NULL,
    previous_notes  TEXT
);

CREATE TABLE symptom_reports (
    id             UUID PRIMARY KEY,
    appointment_id UUID NOT NULL,
    codes          TEXT[] NOT NULL,
    duration_days  SMALLINT,
    note           TEXT,
    voice_note_url TEXT              -- for patients who cannot read the options
);

CREATE TABLE prescriptions (
    id              UUID PRIMARY KEY,
    consultation_id UUID NOT NULL REFERENCES consultations (id),
    patient_id      UUID NOT NULL,
    doctor_id       UUID NOT NULL,
    issued_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    status          TEXT NOT NULL DEFAULT 'ISSUED',
    pharmacy_id     UUID,
    override_reason TEXT             -- set when a conflict was overridden
);

CREATE TABLE prescription_items (
    id                UUID PRIMARY KEY,
    prescription_id   UUID NOT NULL REFERENCES prescriptions (id) ON DELETE CASCADE,
    medicine_code     TEXT NOT NULL,
    dosage            TEXT NOT NULL,
    frequency_per_day SMALLINT NOT NULL,
    duration_days     SMALLINT NOT NULL,
    instructions      TEXT
);

-- Reference data driving the conflict check.
CREATE TABLE medicines (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    form TEXT NOT NULL
);

CREATE TABLE medicine_allergens (
    medicine_code TEXT NOT NULL REFERENCES medicines (code),
    allergen      TEXT NOT NULL,      -- 'sulfonamide', 'penicillin'
    PRIMARY KEY (medicine_code, allergen)
);

CREATE TABLE pharmacies (
    id        UUID PRIMARY KEY,
    name      TEXT NOT NULL,
    community TEXT NOT NULL,
    lat       DOUBLE PRECISION NOT NULL,
    lng       DOUBLE PRECISION NOT NULL
);
```

**The query this whole service exists to get right**

```sql
-- Prescribing conflict check. The patient's allergies arrive from
-- patient-service in the request body — this service does not read that
-- database. Returns one row per conflict, with provenance so the dialog can
-- say who recorded it and when.
SELECT m.code,
       m.name,
       ma.allergen,
       'CONTRAINDICATED' AS severity
  FROM medicines m
  JOIN medicine_allergens ma ON ma.medicine_code = m.code
 WHERE m.code = ANY (:medicineCodes)
   AND lower(ma.allergen) = ANY (SELECT lower(x) FROM unnest(:patientAllergens) AS x);
```

```java
// Called before every issue. "Prescribe anyway" is allowed — a doctor may
// have a reason — but it must be recorded, which is what override_reason is.
public PrescriptionCheck check(UUID patientId, List<String> codes) {
    var allergens = patientClient.allergensOf(patientId);   // REST call, cached 60s
    var conflicts = repo.findConflicts(codes, allergens);
    return new PrescriptionCheck(conflicts.isEmpty(), conflicts);
}
```

---

### 4.5 `payment-service` — money

Owns payment intents, MoMo/OPay/USSD integration, refunds and NHIS claims.
Every external webhook is assumed to arrive more than once.

**Schema — `payment_db`**

```sql
CREATE TABLE payment_intents (
    id             UUID PRIMARY KEY,
    appointment_id UUID NOT NULL,
    patient_id     UUID NOT NULL,
    amount_kobo    BIGINT NOT NULL CHECK (amount_kobo > 0),
    method         TEXT NOT NULL,       -- MOMO | OPAY | BANK_TRANSFER | CASH_TO_CHW | NHIS
    status         TEXT NOT NULL DEFAULT 'PENDING',
    reference      TEXT NOT NULL UNIQUE,
    ussd_code      TEXT,
    collected_by   UUID,                -- the CHW, for CASH_TO_CHW
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    confirmed_at   TIMESTAMPTZ
);

-- Raw provider callbacks, deduplicated. Never act on a webhook twice.
CREATE TABLE payment_events (
    provider      TEXT NOT NULL,
    provider_ref  TEXT NOT NULL,
    intent_id     UUID REFERENCES payment_intents (id),
    payload       JSONB NOT NULL,
    received_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (provider, provider_ref)
);

CREATE TABLE refunds (
    id          UUID PRIMARY KEY,
    intent_id   UUID NOT NULL REFERENCES payment_intents (id),
    amount_kobo BIGINT NOT NULL,
    reason      TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'PENDING',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

```sql
-- Idempotent webhook. If the insert conflicts, this delivery is a duplicate
-- and nothing else runs.
INSERT INTO payment_events (provider, provider_ref, intent_id, payload)
VALUES (:provider, :providerRef, :intentId, :payload::jsonb)
ON CONFLICT (provider, provider_ref) DO NOTHING
RETURNING intent_id;
```

```sql
-- Confirm, only from PENDING. The guard in the WHERE clause means a replay
-- cannot move a REFUNDED intent back to PAID.
UPDATE payment_intents
   SET status = 'PAID', confirmed_at = now()
 WHERE id = :intentId AND status = 'PENDING'
RETURNING id, appointment_id;
```

---

### 4.6 `emergency-service` — dispatch under a clock

Owns alerts, the escalation ladder, facility referral and field reports. Build
it to survive alone: no synchronous call to payment or scheduling, and it
degrades to SMS if everything else is unreachable.

**Schema — `emergency_db`**

```sql
CREATE TABLE emergencies (
    id                UUID PRIMARY KEY,
    reference         TEXT NOT NULL UNIQUE,      -- 'EMG-2026-08-4471'
    patient_id        UUID,
    raised_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    status            TEXT NOT NULL DEFAULT 'RAISED',
    description       TEXT NOT NULL,
    lat               DOUBLE PRECISION NOT NULL,
    lng               DOUBLE PRECISION NOT NULL,
    community         TEXT NOT NULL,
    assigned_chw_id   UUID,
    assigned_doctor_id UUID,
    facility_id       UUID,
    reassign_at       TIMESTAMPTZ                -- the countdown the CHW sees
);
CREATE INDEX emg_open ON emergencies (status, reassign_at) WHERE status IN ('RAISED','ASSIGNED');

-- Every rung of the ladder, so an unanswered alert can be audited afterwards.
CREATE TABLE escalation_steps (
    id             UUID PRIMARY KEY,
    emergency_id   UUID NOT NULL REFERENCES emergencies (id) ON DELETE CASCADE,
    step_no        SMALLINT NOT NULL,
    responder_type TEXT NOT NULL,        -- CHW | DOCTOR | FACILITY
    responder_id   UUID,
    notified_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    responded_at   TIMESTAMPTZ,
    response       TEXT,                 -- ACCEPTED | DECLINED | TIMED_OUT
    UNIQUE (emergency_id, step_no)
);

CREATE TABLE emergency_reports (
    id           UUID PRIMARY KEY,
    emergency_id UUID NOT NULL UNIQUE REFERENCES emergencies (id),
    outcome      TEXT NOT NULL,   -- REFERRED_TO_FACILITY | RESOLVED_ON_SCENE | CARE_REFUSED
    actions      JSONB NOT NULL,
    arrived_at   TIMESTAMPTZ NOT NULL,
    closed_at    TIMESTAMPTZ NOT NULL,
    notes        TEXT,
    submitted_by UUID NOT NULL,
    local_id     TEXT UNIQUE      -- idempotent when a CHW resends after sync
);

CREATE TABLE facilities (
    id        UUID PRIMARY KEY,
    name      TEXT NOT NULL,
    level     TEXT NOT NULL,      -- PHC | GENERAL | TEACHING
    lat       DOUBLE PRECISION NOT NULL,
    lng       DOUBLE PRECISION NOT NULL,
    free_beds SMALLINT NOT NULL DEFAULT 0
);
```

**Queries that matter**

```sql
-- Nearest available CHW. Haversine in SQL is fine at this scale; move to
-- PostGIS only when it stops being fast enough.
SELECT chw_id, full_name,
       6371 * acos(cos(radians(:lat)) * cos(radians(lat)) *
                   cos(radians(lng) - radians(:lng)) +
                   sin(radians(:lat)) * sin(radians(lat))) AS distance_km
  FROM chw_directory
 WHERE on_duty
   AND chw_id <> ALL (:alreadyTried)
 ORDER BY distance_km
 LIMIT 1;
```

```sql
-- The ladder. A scheduled job every 15s takes alerts whose countdown expired
-- and moves them on. FOR UPDATE SKIP LOCKED lets several instances run this
-- without stepping on each other.
SELECT id FROM emergencies
 WHERE status = 'ASSIGNED' AND reassign_at < now()
 FOR UPDATE SKIP LOCKED
 LIMIT 20;
```

---

### 4.7 `content-service` — language and literacy

Health articles, UI translations, and text-to-speech. Read-heavy and public;
cache it hard.

```sql
CREATE TABLE articles (
    id           UUID PRIMARY KEY,
    slug         TEXT NOT NULL,
    language     TEXT NOT NULL,
    title        TEXT NOT NULL,
    summary      TEXT NOT NULL,
    body         TEXT NOT NULL,
    image_url    TEXT,
    read_minutes SMALLINT NOT NULL,
    audio_url    TEXT,
    published_at TIMESTAMPTZ,
    UNIQUE (slug, language)      -- same article, one row per language
);

CREATE TABLE ui_translations (
    key      TEXT NOT NULL,
    language TEXT NOT NULL,
    value    TEXT NOT NULL,
    PRIMARY KEY (key, language)
);

-- Synthesised audio is expensive; generate once and keep it.
CREATE TABLE tts_cache (
    text_hash  TEXT NOT NULL,
    language   TEXT NOT NULL,
    audio_url  TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (text_hash, language)
);
```

```sql
-- Fall back to English rather than showing nothing when a translation is
-- missing. DISTINCT ON keeps the caller's language when it exists.
SELECT DISTINCT ON (slug) slug, language, title, summary, image_url, read_minutes
  FROM articles
 WHERE language IN (:language, 'en') AND published_at IS NOT NULL
 ORDER BY slug, (language = :language) DESC;
```

---

### 4.8 `notification-service` — reaching a phone with no internet

Outbound SMS, USSD session state, and push. Consumes events; nothing calls it
synchronously, so a slow SMS gateway never slows a booking.

```sql
CREATE TABLE messages (
    id           UUID PRIMARY KEY,
    account_id   UUID,
    phone        TEXT NOT NULL,
    channel      TEXT NOT NULL,      -- SMS | USSD | PUSH
    template     TEXT NOT NULL,
    payload      JSONB NOT NULL,
    language     TEXT NOT NULL,
    status       TEXT NOT NULL DEFAULT 'QUEUED',
    attempts     SMALLINT NOT NULL DEFAULT 0,
    provider_ref TEXT,
    dedupe_key   TEXT UNIQUE,        -- 'appt-{id}-reminder-1h', sent once only
    send_after   TIMESTAMPTZ NOT NULL DEFAULT now(),
    sent_at      TIMESTAMPTZ
);
CREATE INDEX messages_due ON messages (send_after) WHERE status = 'QUEUED';

CREATE TABLE ussd_sessions (
    session_id TEXT PRIMARY KEY,
    phone      TEXT NOT NULL,
    state      JSONB NOT NULL,       -- where they are in the *737# menu
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL
);
```

```sql
-- Claim a batch to send. SKIP LOCKED means several workers can drain the
-- queue in parallel without sending the same message twice.
UPDATE messages
   SET status = 'SENDING', attempts = attempts + 1
 WHERE id IN (
       SELECT id FROM messages
        WHERE status = 'QUEUED' AND send_after <= now()
        ORDER BY send_after
        FOR UPDATE SKIP LOCKED
        LIMIT 50)
RETURNING *;
```

---

## 5. The flows that cross services

### 5.1 Booking and payment — a saga, not a transaction

There is no distributed transaction. Scheduling and payment each commit
locally, and a compensating action undoes the first if the second fails.

```
POST /appointments
  scheduling: claim slot, INSERT appointment PENDING_PAYMENT, hold 15 min
           -> publishes AppointmentHeld
  payment:   create intent for the held appointment
  patient pays (MoMo / OPay / USSD / cash to CHW)
  payment:   INSERT payment_event (idempotent), mark PAID
           -> publishes PaymentConfirmed
  scheduling: PENDING_PAYMENT -> CONFIRMED, clear the hold
  notification: SMS "You are booked", plus reminders at T-1h and T-5min

Compensation — hold expires unpaid:
  scheduling: appointment -> CANCELLED, slot released
           -> publishes AppointmentCancelled
  payment:   intent -> EXPIRED
```

The hold is what makes this safe. The slot is taken the moment booking starts,
so nobody else can have it while the patient is finding their MoMo PIN; if they
never finish, the timer gives it back.

### 5.2 Publish events with the outbox pattern

Writing to the database and publishing to RabbitMQ are two systems. Do both in
one local transaction by writing the event to a table, then relaying it.

```sql
CREATE TABLE outbox (
    id             UUID PRIMARY KEY,
    aggregate_type TEXT NOT NULL,
    aggregate_id   UUID NOT NULL,
    event_type     TEXT NOT NULL,
    payload        JSONB NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    published_at   TIMESTAMPTZ
);
CREATE INDEX outbox_unpublished ON outbox (created_at) WHERE published_at IS NULL;
```

```java
@Transactional
public Appointment book(BookCommand cmd) {
    var appt = appointments.save(Appointment.held(cmd));
    outbox.save(OutboxEvent.of("Appointment", appt.getId(), "AppointmentHeld", appt));
    return appt;   // both rows commit together, or neither does
}
```

A scheduled relay reads unpublished rows, sends them, and stamps
`published_at`. Consumers must tolerate the same event twice.

### 5.3 Offline sync — the gateway fans out

`POST /chw/sync` carries a batch captured over hours with no signal. The
gateway unpacks it and routes each record to its owner:

| `kind` | Goes to |
|---|---|
| `REGISTRATION` | `patient-service` |
| `VITALS` | `patient-service` |
| `VISIT` | `patient-service` |
| `EMERGENCY_REPORT` | `emergency-service` |

Every record carries a client-generated `local_id`, and every target table has a
unique index on it. A partial batch can be resent whole — the records that
already landed are ignored, and the response tells the phone exactly which
`local_id`s were rejected and why, so it can stop retrying those.

---

## 6. Infrastructure

**Gateway** — one entry point, JWT validated once, request ID injected.

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: identity
          uri: lb://identity-service
          predicates: [ Path=/auth/**, Path=/doctors/*/verification ]
        - id: patients
          uri: lb://patient-service
          predicates: [ Path=/patients/** ]
        - id: scheduling
          uri: lb://scheduling-service
          predicates: [ Path=/appointments/**, Path=/doctors/** ]
        - id: consultations
          uri: lb://consultation-service
          predicates: [ Path=/consultations/**, Path=/prescriptions/**, Path=/pharmacies/** ]
        - id: payments
          uri: lb://payment-service
          predicates: [ Path=/payments/** ]
        - id: emergency
          uri: lb://emergency-service
          predicates: [ Path=/emergencies/**, Path=/facilities/** ]
        - id: content
          uri: lb://content-service
          predicates: [ Path=/content/** ]
```

**CORS** — allow the Next.js origin, or the browser blocks every call:

```yaml
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins: [ "http://localhost:3000" ]
            allowedMethods: [ GET, POST, PUT, PATCH, DELETE, OPTIONS ]
            allowedHeaders: [ "*" ]
```

**Resilience** — the front end already shows a "no network" state, so return a
degraded response rather than hanging:

```java
@CircuitBreaker(name = "patient", fallbackMethod = "allergensUnavailable")
List<String> allergensOf(UUID patientId) { ... }

// Fail closed on a safety check: if allergies cannot be read, say so rather
// than implying the patient has none.
List<String> allergensUnavailable(UUID id, Throwable t) {
    throw new DomainException(503, "ALLERGY_CHECK_UNAVAILABLE",
            "Cannot verify allergies right now. Do not prescribe until this clears.");
}
```

---

## 7. Suggested build order

Eleven applications is a lot to start with. Build a thin vertical slice first
and prove the pattern end to end.

**Phase 1 — one flow works, front to back.** `discovery-server`,
`config-server`, `api-gateway`, `identity-service`, `patient-service`. Register
a patient, log in with an OTP, read your own record from `/home`.

**Phase 2 — the money path.** `scheduling-service`, `payment-service`. This is
where you implement the saga, the slot race, and idempotent webhooks — the
hardest and most interesting parts.

**Phase 3 — clinical.** `consultation-service`, including the prescribing
conflict check.

**Phase 4 — the differentiators.** `emergency-service`, `notification-service`,
`content-service`. These are what make SHATS specific to rural Nigeria rather
than a generic booking app.

**Testing worth the effort:** Testcontainers for a real PostgreSQL per service,
and one integration test per cross-service flow — especially two concurrent
bookings for the same slot, and the same payment webhook delivered twice.

---

## 8. Connecting the front end

Copy `.env.example` to `.env.local` and point it at the gateway:

```
NEXT_PUBLIC_API_GATEWAY=http://localhost:8080
```

Then check `API_ROUTES` in `lib/api.ts` against your `@RequestMapping` values.
If the two lists agree, the contract holds — and because each service reads its
own environment variable with the gateway as a fallback, you can split services
out one at a time without changing a line of front-end code.
