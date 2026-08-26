/**
 * SHATS domain types.
 *
 * These follow the class model in SHATS_UML_Diagrams.html. Where the .docx and
 * the HTML disagreed the HTML was treated as canonical (the .docx carried
 * nonsensical primitives such as `patientId: long double`).
 */

export type UUID = string;
/** ISO-8601 instant, e.g. "2026-08-20T10:00:00Z". */
export type Instant = string;
/** ISO-8601 date, e.g. "2026-08-20". */
export type IsoDate = string;

export type LanguageCode = "en" | "ig" | "ha" | "yo" | "pcm";

export const LANGUAGES: { code: LanguageCode; label: string; english: string }[] =
  [
    { code: "en", label: "English", english: "English" },
    { code: "ig", label: "Asụsụ Igbo", english: "Igbo" },
    { code: "ha", label: "Harshen Hausa", english: "Hausa" },
    { code: "yo", label: "Èdè Yorùbá", english: "Yoruba" },
    { code: "pcm", label: "Naija Pidgin", english: "Pidgin" },
  ];

export type Role = "PATIENT" | "DOCTOR" | "CHW" | "ADMIN";

/* -------------------------------------------------------------------------- */
/* People                                                                      */
/* -------------------------------------------------------------------------- */

export interface Account {
  id: UUID;
  role: Role;
  phone: string;
  displayName: string;
  language: LanguageCode;
  createdAt: Instant;
}

export interface Patient {
  id: UUID;
  /** Human-quotable identifier read aloud over the phone, e.g. "004182". */
  shatsId: string;
  fullName: string;
  phone?: string;
  dateOfBirth?: IsoDate;
  ageYears: number;
  sex: "MALE" | "FEMALE";
  language: LanguageCode;
  community: string;
  state: string;
  /** True when a CHW registered them in the field with no ID document. */
  registeredByChw: boolean;
  nhisNumber?: string;
  allergies: string[];
  conditions: string[];
}

export interface Doctor {
  id: UUID;
  fullName: string;
  specialty: string;
  city: string;
  languages: LanguageCode[];
  /** Consultation fee in kobo. Integer money only — never floats. */
  feeKobo: number;
  photoUrl?: string;
  /** Medical and Dental Council of Nigeria registration. */
  mdcnNumber: string;
  verificationStatus: "VERIFIED" | "PENDING" | "SUSPENDED";
  acceptingPatients: boolean;
  averageWaitMinutes?: number;
}

export interface CommunityHealthWorker {
  id: UUID;
  fullName: string;
  community: string;
  phone: string;
  languages: LanguageCode[];
  supervisingDoctorId?: UUID;
}

/* -------------------------------------------------------------------------- */
/* Clinical                                                                    */
/* -------------------------------------------------------------------------- */

export interface Vitals {
  id: UUID;
  patientId: UUID;
  recordedAt: Instant;
  recordedByChwId?: UUID;
  systolic?: number;
  diastolic?: number;
  temperatureC?: number;
  pulseBpm?: number;
  weightKg?: number;
  /** Set when the reading breached a standing instruction and was escalated. */
  escalated?: boolean;
}

export type SymptomCode =
  | "FEVER"
  | "COUGH"
  | "BELLY_PAIN"
  | "CANNOT_SLEEP"
  | "HEADACHE"
  | "INJURY"
  | "PREGNANCY"
  | "OTHER";

export interface SymptomReport {
  codes: SymptomCode[];
  durationDays?: number;
  note?: string;
  /** Recorded audio when the patient could not read the options. */
  voiceNoteUrl?: string;
}

export type AppointmentStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "IN_SESSION"
  | "COMPLETED"
  | "CANCELLED"
  | "MISSED";

export type ConsultationMode = "VIDEO" | "VOICE" | "TEXT";

export interface Appointment {
  id: UUID;
  patientId: UUID;
  doctorId: UUID;
  startsAt: Instant;
  durationMinutes: number;
  mode: ConsultationMode;
  status: AppointmentStatus;
  reason: string;
  feeKobo: number;
  paymentId?: UUID;
  /** Set when a CHW booked on the patient's behalf. */
  bookedByChwId?: UUID;
}

export interface TimeSlot {
  startsAt: Instant;
  available: boolean;
}

export interface Consultation {
  id: UUID;
  appointmentId: UUID;
  patientId: UUID;
  doctorId: UUID;
  mode: ConsultationMode;
  startedAt: Instant;
  endedAt?: Instant;
  /** A CHW physically present with the patient during the call. */
  attendingChwId?: UUID;
  diagnosis?: string;
  notes?: string;
  followUpAt?: Instant;
}

export interface MediaSession {
  consultationId: UUID;
  mode: ConsultationMode;
  /** Short-lived token for the media provider. */
  token: string;
  roomId: string;
  expiresAt: Instant;
}

export interface Medicine {
  code: string;
  name: string;
  form: string;
}

export interface PrescriptionItem {
  medicine: Medicine;
  dosage: string;
  frequencyPerDay: number;
  durationDays: number;
  instructions?: string;
}

export interface Prescription {
  id: UUID;
  consultationId: UUID;
  patientId: UUID;
  doctorId: UUID;
  issuedAt: Instant;
  items: PrescriptionItem[];
  pharmacyId?: UUID;
  status: "ISSUED" | "READY" | "DISPENSED" | "EXPIRED";
}

/** Result of the safety check behind the prescribing-conflict dialog. */
export interface PrescriptionCheck {
  safe: boolean;
  conflicts: {
    severity: "INFO" | "WARNING" | "CONTRAINDICATED";
    medicineCode: string;
    reason: string;
    /** Where the conflicting fact came from, e.g. "CHW intake, 12 Mar 2026". */
    source: string;
  }[];
}

export interface Pharmacy {
  id: UUID;
  name: string;
  community: string;
  distanceKm: number;
  hasStock: boolean;
}

/* -------------------------------------------------------------------------- */
/* Money                                                                       */
/* -------------------------------------------------------------------------- */

export type PaymentMethod = "MOMO" | "OPAY" | "BANK_TRANSFER" | "CASH_TO_CHW" | "NHIS";

export interface PaymentIntent {
  id: UUID;
  appointmentId: UUID;
  amountKobo: number;
  method: PaymentMethod;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  /** USSD string the patient dials when paying from a feature phone. */
  ussdCode?: string;
  reference: string;
  createdAt: Instant;
}

/* -------------------------------------------------------------------------- */
/* Emergency                                                                   */
/* -------------------------------------------------------------------------- */

export type EmergencyStatus =
  | "RAISED"
  | "ASSIGNED"
  | "ACCEPTED"
  | "ESCALATED"
  | "RESOLVED"
  | "CANCELLED";

export interface Emergency {
  id: UUID;
  reference: string;
  patientId: UUID;
  raisedAt: Instant;
  status: EmergencyStatus;
  description: string;
  location: { lat: number; lng: number; community: string };
  assignedChwId?: UUID;
  assignedDoctorId?: UUID;
  facilityId?: UUID;
  /** Seconds left before the alert passes to the next responder. */
  reassignInSeconds?: number;
}

export interface EmergencyReport {
  emergencyId: UUID;
  outcome: "REFERRED_TO_FACILITY" | "RESOLVED_ON_SCENE" | "CARE_REFUSED";
  actionsTaken: string[];
  arrivedAt: Instant;
  closedAt: Instant;
  notes?: string;
}

export interface Facility {
  id: UUID;
  name: string;
  level: "PHC" | "GENERAL" | "TEACHING";
  distanceKm: number;
  hasFreeBed: boolean;
}

/* -------------------------------------------------------------------------- */
/* CHW field work                                                              */
/* -------------------------------------------------------------------------- */

export interface HomeVisit {
  id: UUID;
  chwId: UUID;
  patientId: UUID;
  scheduledFor: Instant;
  completedAt?: Instant;
  purpose: string;
  vitals?: Vitals;
  notes?: string;
  /** False until the record has reached the server. */
  synced: boolean;
}

export interface SyncBatch {
  records: {
    kind: "VISIT" | "VITALS" | "REGISTRATION" | "EMERGENCY_REPORT";
    localId: string;
    payload: unknown;
    capturedAt: Instant;
  }[];
}

export interface SyncResult {
  accepted: number;
  rejected: { localId: string; reason: string }[];
  syncedAt: Instant;
}

/* -------------------------------------------------------------------------- */
/* Content                                                                     */
/* -------------------------------------------------------------------------- */

export interface Article {
  slug: string;
  title: string;
  summary: string;
  imageUrl: string;
  readMinutes: number;
  language: LanguageCode;
  audioUrl?: string;
  body?: string;
}

/* -------------------------------------------------------------------------- */
/* Transport                                                                   */
/* -------------------------------------------------------------------------- */

export interface Page<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

export interface ApiErrorBody {
  status: number;
  code: string;
  message: string;
  /** Field-level validation failures, keyed by field name. */
  fieldErrors?: Record<string, string>;
  traceId?: string;
}
