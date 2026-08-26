/**
 * SHATS API client.
 *
 * This is the single seam between the Next.js front end and the Spring Boot
 * back end. Nothing else in the app should call `fetch` directly.
 *
 * ---------------------------------------------------------------------------
 * Microservice layout
 * ---------------------------------------------------------------------------
 * Each key in `SERVICES` is intended to be one Spring Boot service behind an
 * API gateway. In development every service can point at the same origin; in
 * production give each one its own base URL via the environment variables
 * listed below and the client needs no other change.
 *
 *   NEXT_PUBLIC_API_GATEWAY          fallback for every service
 *   NEXT_PUBLIC_API_AUTH             auth-service
 *   NEXT_PUBLIC_API_PATIENTS         patient-service
 *   NEXT_PUBLIC_API_DOCTORS          doctor-service
 *   NEXT_PUBLIC_API_APPOINTMENTS     appointment-service
 *   NEXT_PUBLIC_API_CONSULTATIONS    consultation-service
 *   NEXT_PUBLIC_API_PRESCRIPTIONS    prescription-service
 *   NEXT_PUBLIC_API_PAYMENTS         payment-service
 *   NEXT_PUBLIC_API_EMERGENCY        emergency-service
 *   NEXT_PUBLIC_API_CHW              chw-service
 *   NEXT_PUBLIC_API_CONTENT          content-service
 *   NEXT_PUBLIC_API_NOTIFICATIONS    notification-service
 *
 * `API_ROUTES` below is a flat manifest of every path this client calls. It is
 * exported so it can be diffed against the Spring `@RequestMapping` values —
 * if the two lists agree, the contract holds.
 */

import type {
  Account,
  Appointment,
  Article,
  Consultation,
  CommunityHealthWorker,
  Doctor,
  Emergency,
  EmergencyReport,
  Facility,
  HomeVisit,
  IsoDate,
  LanguageCode,
  MediaSession,
  Page,
  Patient,
  PaymentIntent,
  PaymentMethod,
  Pharmacy,
  Prescription,
  PrescriptionCheck,
  PrescriptionItem,
  SymptomReport,
  SyncBatch,
  SyncResult,
  TimeSlot,
  UUID,
  Vitals,
  ApiErrorBody,
  ConsultationMode,
} from "./types";

/* -------------------------------------------------------------------------- */
/* Service registry                                                            */
/* -------------------------------------------------------------------------- */

const GATEWAY =
  process.env.NEXT_PUBLIC_API_GATEWAY?.replace(/\/$/, "") ?? "http://localhost:8080";

function base(envVar: string | undefined): string {
  return (envVar ?? GATEWAY).replace(/\/$/, "");
}

export const SERVICES = {
  auth: base(process.env.NEXT_PUBLIC_API_AUTH),
  patients: base(process.env.NEXT_PUBLIC_API_PATIENTS),
  doctors: base(process.env.NEXT_PUBLIC_API_DOCTORS),
  appointments: base(process.env.NEXT_PUBLIC_API_APPOINTMENTS),
  consultations: base(process.env.NEXT_PUBLIC_API_CONSULTATIONS),
  prescriptions: base(process.env.NEXT_PUBLIC_API_PRESCRIPTIONS),
  payments: base(process.env.NEXT_PUBLIC_API_PAYMENTS),
  emergency: base(process.env.NEXT_PUBLIC_API_EMERGENCY),
  chw: base(process.env.NEXT_PUBLIC_API_CHW),
  content: base(process.env.NEXT_PUBLIC_API_CONTENT),
  notifications: base(process.env.NEXT_PUBLIC_API_NOTIFICATIONS),
} as const;

export type ServiceName = keyof typeof SERVICES;

/* -------------------------------------------------------------------------- */
/* Route manifest                                                              */
/* -------------------------------------------------------------------------- */

export const API_ROUTES = {
  auth: {
    registerPatient: "POST /auth/register",
    requestOtp: "POST /auth/otp/request",
    verifyOtp: "POST /auth/otp/verify",
    login: "POST /auth/login",
    refresh: "POST /auth/refresh",
    logout: "POST /auth/logout",
    me: "GET /auth/me",
    setLanguage: "PUT /auth/me/language",
  },
  patients: {
    me: "GET /patients/me",
    updateMe: "PATCH /patients/me",
    byId: "GET /patients/{id}",
    search: "GET /patients",
    record: "GET /patients/{id}/record",
    vitals: "GET /patients/{id}/vitals",
    addVitals: "POST /patients/{id}/vitals",
    timeline: "GET /patients/{id}/timeline",
  },
  doctors: {
    discover: "GET /doctors",
    byId: "GET /doctors/{id}",
    availability: "GET /doctors/{id}/availability",
    setAvailability: "PUT /doctors/me/availability",
    setAccepting: "PATCH /doctors/me/accepting",
    verification: "GET /doctors/me/verification",
    earnings: "GET /doctors/me/earnings",
    myPatients: "GET /doctors/me/patients",
  },
  appointments: {
    slots: "GET /appointments/slots",
    book: "POST /appointments",
    mine: "GET /appointments/me",
    byId: "GET /appointments/{id}",
    cancel: "POST /appointments/{id}/cancel",
    reschedule: "POST /appointments/{id}/reschedule",
    doctorSchedule: "GET /appointments/doctor/schedule",
  },
  consultations: {
    start: "POST /consultations/{appointmentId}/start",
    byId: "GET /consultations/{id}",
    join: "POST /consultations/{id}/join",
    setMode: "POST /consultations/{id}/mode",
    saveNotes: "POST /consultations/{id}/notes",
    end: "POST /consultations/{id}/end",
    history: "GET /consultations/me",
  },
  prescriptions: {
    create: "POST /prescriptions",
    mine: "GET /prescriptions/me",
    byId: "GET /prescriptions/{id}",
    check: "POST /prescriptions/check",
    dispense: "POST /prescriptions/{id}/dispense",
    pharmaciesNearby: "GET /pharmacies/nearby",
  },
  payments: {
    methods: "GET /payments/methods",
    createIntent: "POST /payments/intent",
    confirm: "POST /payments/{id}/confirm",
    refund: "POST /payments/{id}/refund",
    mine: "GET /payments/me",
    initiateUssd: "POST /payments/ussd/initiate",
  },
  emergency: {
    raise: "POST /emergencies",
    byId: "GET /emergencies/{id}",
    assigned: "GET /emergencies/assigned",
    accept: "POST /emergencies/{id}/accept",
    decline: "POST /emergencies/{id}/decline",
    escalate: "POST /emergencies/{id}/escalate",
    submitReport: "POST /emergencies/{id}/report",
    facilitiesNearby: "GET /facilities/nearby",
  },
  chw: {
    rounds: "GET /chw/me/rounds",
    createVisit: "POST /chw/visits",
    visitById: "GET /chw/visits/{id}",
    registerPatient: "POST /chw/patients",
    sync: "POST /chw/sync",
    syncStatus: "GET /chw/sync/status",
    me: "GET /chw/me",
  },
  content: {
    articles: "GET /content/articles",
    articleBySlug: "GET /content/articles/{slug}",
    languages: "GET /content/languages",
    speak: "POST /content/tts",
  },
  notifications: {
    mine: "GET /notifications/me",
    markRead: "POST /notifications/{id}/read",
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Transport                                                                   */
/* -------------------------------------------------------------------------- */

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors?: Record<string, string>;
  readonly traceId?: string;

  constructor(body: ApiErrorBody) {
    super(body.message);
    this.name = "ApiError";
    this.status = body.status;
    this.code = body.code;
    this.fieldErrors = body.fieldErrors;
    this.traceId = body.traceId;
  }

  /** True when retrying the same request later could plausibly succeed. */
  get isRetryable(): boolean {
    return this.status === 0 || this.status === 408 || this.status >= 500;
  }
}

type TokenProvider = () => string | null | Promise<string | null>;

let getToken: TokenProvider = () => null;

/**
 * Register how the client obtains the bearer token. Call once during app
 * start-up (or from an auth provider) rather than threading tokens through
 * every call site.
 */
export function setTokenProvider(provider: TokenProvider): void {
  getToken = provider;
}

interface RequestOptions {
  service: ServiceName;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  /** Milliseconds before the request is aborted. Defaults to 15s. */
  timeoutMs?: number;
  signal?: AbortSignal;
  /** Skip the Authorization header (registration, OTP, public content). */
  anonymous?: boolean;
}

function buildUrl(opts: RequestOptions): string {
  const url = new URL(SERVICES[opts.service] + opts.path);
  for (const [key, value] of Object.entries(opts.query ?? {})) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}

export async function request<T>(opts: RequestOptions): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? 15_000);
  if (opts.signal) {
    opts.signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  const headers: Record<string, string> = { Accept: "application/json" };
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (!opts.anonymous) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(opts), {
      method: opts.method,
      headers,
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
      signal: controller.signal,
      cache: "no-store",
    });
  } catch {
    // Network failure and abort land here. Rural connectivity makes this the
    // normal case rather than the exceptional one, so it gets a real code.
    throw new ApiError({
      status: 0,
      code: controller.signal.aborted ? "TIMEOUT" : "NETWORK_UNAVAILABLE",
      message:
        controller.signal.aborted
          ? "The request took too long. Your network may be weak."
          : "Could not reach SHATS. Your work is saved and will send when there is signal.",
    });
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  const payload = text ? safeJson(text) : undefined;

  if (!response.ok) {
    const body = (payload ?? {}) as Partial<ApiErrorBody>;
    throw new ApiError({
      status: response.status,
      code: body.code ?? `HTTP_${response.status}`,
      message: body.message ?? response.statusText,
      fieldErrors: body.fieldErrors,
      traceId: body.traceId ?? response.headers.get("x-trace-id") ?? undefined,
    });
  }

  return payload as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

const get = <T>(service: ServiceName, path: string, query?: RequestOptions["query"], anonymous?: boolean) =>
  request<T>({ service, method: "GET", path, query, anonymous });

const post = <T>(service: ServiceName, path: string, body?: unknown, anonymous?: boolean) =>
  request<T>({ service, method: "POST", path, body, anonymous });

const put = <T>(service: ServiceName, path: string, body?: unknown) =>
  request<T>({ service, method: "PUT", path, body });

const patch = <T>(service: ServiceName, path: string, body?: unknown) =>
  request<T>({ service, method: "PATCH", path, body });

/* -------------------------------------------------------------------------- */
/* Request/response payloads                                                   */
/* -------------------------------------------------------------------------- */

export interface RegisterPatientRequest {
  fullName: string;
  phone: string;
  language: LanguageCode;
  community: string;
  state: string;
  ageYears?: number;
  sex?: "MALE" | "FEMALE";
  nhisNumber?: string;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  account: Account;
}

export interface BookAppointmentRequest {
  doctorId: UUID;
  startsAt: string;
  mode: ConsultationMode;
  symptoms: SymptomReport;
  bookedByChwId?: UUID;
}

export interface DoctorQuery {
  language?: LanguageCode;
  specialty?: string;
  maxFeeKobo?: number;
  availableOn?: IsoDate;
  page?: number;
  size?: number;
}

export interface RaiseEmergencyRequest {
  patientId?: UUID;
  description: string;
  lat: number;
  lng: number;
  community: string;
}

export interface CreatePaymentRequest {
  appointmentId: UUID;
  method: PaymentMethod;
  /** Required for CASH_TO_CHW so the receipt is attributable. */
  chwId?: UUID;
}

/* -------------------------------------------------------------------------- */
/* Client                                                                      */
/* -------------------------------------------------------------------------- */

export const api = {
  auth: {
    registerPatient: (body: RegisterPatientRequest) =>
      post<Session>("auth", "/auth/register", body, true),
    requestOtp: (phone: string) =>
      post<{ sentTo: string; expiresInSeconds: number }>(
        "auth",
        "/auth/otp/request",
        { phone },
        true,
      ),
    verifyOtp: (phone: string, code: string) =>
      post<Session>("auth", "/auth/otp/verify", { phone, code }, true),
    login: (phone: string, password: string) =>
      post<Session>("auth", "/auth/login", { phone, password }, true),
    refresh: (refreshToken: string) =>
      post<Session>("auth", "/auth/refresh", { refreshToken }, true),
    logout: () => post<void>("auth", "/auth/logout"),
    me: () => get<Account>("auth", "/auth/me"),
    setLanguage: (language: LanguageCode) =>
      put<Account>("auth", "/auth/me/language", { language }),
  },

  patients: {
    me: () => get<Patient>("patients", "/patients/me"),
    updateMe: (body: Partial<Patient>) => patch<Patient>("patients", "/patients/me", body),
    byId: (id: UUID) => get<Patient>("patients", `/patients/${id}`),
    /** Doctor-facing search by name or SHATS ID. */
    search: (q: string, page = 0, size = 20) =>
      get<Page<Patient>>("patients", "/patients", { q, page, size }),
    record: (id: UUID) => get<Consultation[]>("patients", `/patients/${id}/record`),
    vitals: (id: UUID) => get<Vitals[]>("patients", `/patients/${id}/vitals`),
    addVitals: (id: UUID, body: Omit<Vitals, "id" | "patientId" | "recordedAt">) =>
      post<Vitals>("patients", `/patients/${id}/vitals`, body),
    timeline: (id: UUID) =>
      get<{ at: string; kind: string; summary: string }[]>(
        "patients",
        `/patients/${id}/timeline`,
      ),
  },

  doctors: {
    discover: (query: DoctorQuery = {}) =>
      get<Page<Doctor>>("doctors", "/doctors", query as RequestOptions["query"]),
    byId: (id: UUID) => get<Doctor>("doctors", `/doctors/${id}`),
    availability: (id: UUID, date: IsoDate) =>
      get<TimeSlot[]>("doctors", `/doctors/${id}/availability`, { date }),
    setAvailability: (slots: { startsAt: string; durationMinutes: number }[]) =>
      put<void>("doctors", "/doctors/me/availability", { slots }),
    setAccepting: (accepting: boolean) =>
      patch<Doctor>("doctors", "/doctors/me/accepting", { accepting }),
    verification: () =>
      get<{ mdcnNumber: string; status: string; checkedAt: string }>(
        "doctors",
        "/doctors/me/verification",
      ),
    earnings: (from?: IsoDate, to?: IsoDate) =>
      get<{ totalKobo: number; paidOutKobo: number; nextPayoutAt: string }>(
        "doctors",
        "/doctors/me/earnings",
        { from, to },
      ),
    myPatients: (page = 0, size = 20) =>
      get<Page<Patient>>("doctors", "/doctors/me/patients", { page, size }),
  },

  appointments: {
    slots: (doctorId: UUID, date: IsoDate) =>
      get<TimeSlot[]>("appointments", "/appointments/slots", { doctorId, date }),
    book: (body: BookAppointmentRequest) =>
      post<Appointment>("appointments", "/appointments", body),
    mine: () => get<Appointment[]>("appointments", "/appointments/me"),
    byId: (id: UUID) => get<Appointment>("appointments", `/appointments/${id}`),
    cancel: (id: UUID, reason?: string) =>
      post<{ appointment: Appointment; refundKobo: number; refundEtaHours: number }>(
        "appointments",
        `/appointments/${id}/cancel`,
        { reason },
      ),
    reschedule: (id: UUID, startsAt: string) =>
      post<Appointment>("appointments", `/appointments/${id}/reschedule`, { startsAt }),
    doctorSchedule: (date: IsoDate) =>
      get<Appointment[]>("appointments", "/appointments/doctor/schedule", { date }),
  },

  consultations: {
    start: (appointmentId: UUID) =>
      post<Consultation>("consultations", `/consultations/${appointmentId}/start`),
    byId: (id: UUID) => get<Consultation>("consultations", `/consultations/${id}`),
    join: (id: UUID) => post<MediaSession>("consultations", `/consultations/${id}/join`),
    /** Used when the network degrades and video must drop to voice. */
    setMode: (id: UUID, mode: ConsultationMode) =>
      post<MediaSession>("consultations", `/consultations/${id}/mode`, { mode }),
    saveNotes: (id: UUID, notes: string, diagnosis?: string) =>
      post<Consultation>("consultations", `/consultations/${id}/notes`, { notes, diagnosis }),
    end: (id: UUID, body: { diagnosis?: string; followUpAt?: string }) =>
      post<Consultation>("consultations", `/consultations/${id}/end`, body),
    history: () => get<Consultation[]>("consultations", "/consultations/me"),
  },

  prescriptions: {
    create: (consultationId: UUID, items: PrescriptionItem[], pharmacyId?: UUID) =>
      post<Prescription>("prescriptions", "/prescriptions", {
        consultationId,
        items,
        pharmacyId,
      }),
    mine: () => get<Prescription[]>("prescriptions", "/prescriptions/me"),
    byId: (id: UUID) => get<Prescription>("prescriptions", `/prescriptions/${id}`),
    /**
     * Allergy and interaction check. This is what stands behind the
     * prescribing-conflict dialog, so it must run before every issue.
     */
    check: (patientId: UUID, medicineCodes: string[]) =>
      post<PrescriptionCheck>("prescriptions", "/prescriptions/check", {
        patientId,
        medicineCodes,
      }),
    dispense: (id: UUID, pharmacyId: UUID) =>
      post<Prescription>("prescriptions", `/prescriptions/${id}/dispense`, { pharmacyId }),
    pharmaciesNearby: (lat: number, lng: number, medicineCode?: string) =>
      get<Pharmacy[]>("prescriptions", "/pharmacies/nearby", { lat, lng, medicineCode }),
  },

  payments: {
    methods: () => get<PaymentMethod[]>("payments", "/payments/methods"),
    createIntent: (body: CreatePaymentRequest) =>
      post<PaymentIntent>("payments", "/payments/intent", body),
    confirm: (id: UUID, reference: string) =>
      post<PaymentIntent>("payments", `/payments/${id}/confirm`, { reference }),
    refund: (id: UUID, reason: string) =>
      post<PaymentIntent>("payments", `/payments/${id}/refund`, { reason }),
    mine: () => get<PaymentIntent[]>("payments", "/payments/me"),
    initiateUssd: (appointmentId: UUID) =>
      post<{ ussdCode: string; reference: string }>("payments", "/payments/ussd/initiate", {
        appointmentId,
      }),
  },

  emergency: {
    raise: (body: RaiseEmergencyRequest) =>
      post<Emergency>("emergency", "/emergencies", body),
    byId: (id: UUID) => get<Emergency>("emergency", `/emergencies/${id}`),
    /** The responder queue for the signed-in CHW or doctor. */
    assigned: () => get<Emergency[]>("emergency", "/emergencies/assigned"),
    accept: (id: UUID) => post<Emergency>("emergency", `/emergencies/${id}/accept`),
    decline: (id: UUID, reason: string) =>
      post<Emergency>("emergency", `/emergencies/${id}/decline`, { reason }),
    escalate: (id: UUID, to: "DOCTOR" | "FACILITY", note?: string) =>
      post<Emergency>("emergency", `/emergencies/${id}/escalate`, { to, note }),
    submitReport: (id: UUID, body: Omit<EmergencyReport, "emergencyId">) =>
      post<EmergencyReport>("emergency", `/emergencies/${id}/report`, body),
    facilitiesNearby: (lat: number, lng: number) =>
      get<Facility[]>("emergency", "/facilities/nearby", { lat, lng }),
  },

  chw: {
    me: () => get<CommunityHealthWorker>("chw", "/chw/me"),
    rounds: (date: IsoDate) => get<HomeVisit[]>("chw", "/chw/me/rounds", { date }),
    createVisit: (body: Omit<HomeVisit, "id" | "synced">) =>
      post<HomeVisit>("chw", "/chw/visits", body),
    visitById: (id: UUID) => get<HomeVisit>("chw", `/chw/visits/${id}`),
    registerPatient: (body: RegisterPatientRequest) =>
      post<Patient>("chw", "/chw/patients", body),
    /** Bulk push of everything captured while offline. */
    sync: (batch: SyncBatch) => post<SyncResult>("chw", "/chw/sync", batch),
    syncStatus: () =>
      get<{ pending: number; lastSyncedAt: string | null }>("chw", "/chw/sync/status"),
  },

  content: {
    articles: (language: LanguageCode) =>
      get<Article[]>("content", "/content/articles", { language }, true),
    articleBySlug: (slug: string, language: LanguageCode) =>
      get<Article>("content", `/content/articles/${slug}`, { language }, true),
    languages: () => get<LanguageCode[]>("content", "/content/languages", undefined, true),
    /** Server-side text-to-speech; every patient screen can be read aloud. */
    speak: (text: string, language: LanguageCode) =>
      post<{ audioUrl: string }>("content", "/content/tts", { text, language }, true),
  },

  notifications: {
    mine: () =>
      get<{ id: UUID; title: string; body: string; readAt: string | null }[]>(
        "notifications",
        "/notifications/me",
      ),
    markRead: (id: UUID) => post<void>("notifications", `/notifications/${id}/read`),
  },
} as const;

export default api;
