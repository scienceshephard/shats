/**
 * Sample data for running the front end without the Spring Boot services.
 *
 * Every page reads from here today. To go live, replace the import in a page
 * with the matching `api.*` call from `lib/api.ts` — the shapes are identical
 * because both are typed against `lib/types.ts`.
 */

import type {
  Appointment,
  Article,
  Doctor,
  Emergency,
  HomeVisit,
  Patient,
  Prescription,
  Vitals,
} from "./types";

export const naira = (kobo: number) =>
  "₦" + (kobo / 100).toLocaleString("en-NG", { maximumFractionDigits: 0 });

export const currentPatient: Patient = {
  id: "p-1",
  shatsId: "004182",
  fullName: "Emeka Okafor",
  phone: "+234 803 555 0142",
  ageYears: 34,
  sex: "MALE",
  language: "ig",
  community: "Ede-Oballa",
  state: "Enugu",
  registeredByChw: true,
  nhisNumber: undefined,
  allergies: ["Penicillin"],
  conditions: [],
};

export const doctors: Doctor[] = [
  {
    id: "d-1",
    fullName: "Dr. Chidi Okonkwo",
    specialty: "General practice",
    city: "Enugu",
    languages: ["ig", "en"],
    feeKobo: 150_000,
    photoUrl: "/img/doctor-chidi.png",
    mdcnNumber: "MDCN/R/48213",
    verificationStatus: "VERIFIED",
    acceptingPatients: true,
    averageWaitMinutes: 14,
  },
  {
    id: "d-2",
    fullName: "Dr. Amina Bello",
    specialty: "Family medicine",
    city: "Kano",
    languages: ["ha", "en"],
    feeKobo: 200_000,
    mdcnNumber: "MDCN/R/51907",
    verificationStatus: "VERIFIED",
    acceptingPatients: true,
    averageWaitMinutes: 22,
  },
  {
    id: "d-3",
    fullName: "Dr. Tunde Adeyemi",
    specialty: "Paediatrics",
    city: "Ibadan",
    languages: ["yo", "en"],
    feeKobo: 250_000,
    mdcnNumber: "MDCN/R/44530",
    verificationStatus: "VERIFIED",
    acceptingPatients: false,
    averageWaitMinutes: 35,
  },
];

export const nextAppointment: Appointment = {
  id: "a-1",
  patientId: "p-1",
  doctorId: "d-1",
  startsAt: "2026-08-20T10:00:00Z",
  durationMinutes: 20,
  mode: "VIDEO",
  status: "CONFIRMED",
  reason: "Fever and joint pain, 3 days",
  feeKobo: 150_000,
  paymentId: "pay-1",
};

export const prescriptions: Prescription[] = [
  {
    id: "rx-1",
    consultationId: "c-1",
    patientId: "p-1",
    doctorId: "d-1",
    issuedAt: "2026-08-13T11:20:00Z",
    status: "READY",
    items: [
      {
        medicine: { code: "COARTEM", name: "Coartem", form: "tablet" },
        dosage: "1 tablet",
        frequencyPerDay: 2,
        durationDays: 3,
        instructions: "Take after food",
      },
      {
        medicine: { code: "PARA500", name: "Paracetamol", form: "tablet" },
        dosage: "2 tablets",
        frequencyPerDay: 3,
        durationDays: 5,
        instructions: "Only when the pain is bad",
      },
    ],
  },
];

export const vitalsHistory: Vitals[] = [
  {
    id: "v-3",
    patientId: "p-1",
    recordedAt: "2026-08-13T09:15:00Z",
    recordedByChwId: "chw-1",
    systolic: 128,
    diastolic: 84,
    temperatureC: 37.1,
    pulseBpm: 78,
  },
  {
    id: "v-2",
    patientId: "p-1",
    recordedAt: "2026-06-02T10:40:00Z",
    recordedByChwId: "chw-1",
    systolic: 134,
    diastolic: 88,
    temperatureC: 36.8,
    pulseBpm: 82,
  },
  {
    id: "v-1",
    patientId: "p-1",
    recordedAt: "2026-03-12T08:05:00Z",
    recordedByChwId: "chw-1",
    systolic: 126,
    diastolic: 80,
    temperatureC: 36.6,
    pulseBpm: 74,
  },
];

export const articles: Article[] = [
  {
    slug: "headaches-stress",
    title: "Headaches, stress and your brain",
    summary: "Why your head hurts, when to rest, and when it is something else.",
    imageUrl: "/img/headache.png",
    readMinutes: 4,
    language: "ig",
  },
  {
    slug: "sickle-cell",
    title: "Sickle cell: what it means for your family",
    summary: "What the test says, and what you can do before a child is born.",
    imageUrl: "/img/family.png",
    readMinutes: 6,
    language: "ha",
  },
  {
    slug: "taking-medicine",
    title: "Taking your medicine the right way",
    summary: "Finishing the full course is what makes the medicine work.",
    imageUrl: "/img/clinic.jpg",
    readMinutes: 3,
    language: "pcm",
  },
];

/* --------------------------------- doctor -------------------------------- */

export interface ScheduleRow {
  time: string;
  patient: string;
  age: number;
  sex: string;
  reason: string;
  mode: "Video" | "Audio" | "Text";
  status: "In session" | "Waiting" | "Confirmed";
}

export const doctorSchedule: ScheduleRow[] = [
  { time: "10:00", patient: "Emeka Obi", age: 34, sex: "Male", reason: "Fever and joint pain, 3 days", mode: "Video", status: "In session" },
  { time: "10:30", patient: "Ngozi Adeleke", age: 41, sex: "Female", reason: "Blood pressure review", mode: "Video", status: "Waiting" },
  { time: "11:15", patient: "Sunday Okoro", age: 28, sex: "Male", reason: "Follow-up — typhoid treatment", mode: "Audio", status: "Confirmed" },
  { time: "13:00", patient: "Amaka Nwosu", age: 6, sex: "Female", reason: "Persistent cough (parent booking)", mode: "Video", status: "Confirmed" },
  { time: "14:30", patient: "Ibrahim Yusuf", age: 55, sex: "Male", reason: "Diabetes medication refill", mode: "Text", status: "Confirmed" },
  { time: "15:45", patient: "Chiamaka Eze", age: 23, sex: "Female", reason: "Skin rash after farm work", mode: "Video", status: "Confirmed" },
];

/* ----------------------------------- chw --------------------------------- */

export const chwRounds: HomeVisit[] = [
  {
    id: "hv-1",
    chwId: "chw-1",
    patientId: "p-2",
    scheduledFor: "2026-08-20T08:30:00Z",
    purpose: "Blood pressure check — Dr. Okonkwo's standing instruction",
    synced: true,
  },
  {
    id: "hv-2",
    chwId: "chw-1",
    patientId: "p-3",
    scheduledFor: "2026-08-20T10:00:00Z",
    purpose: "Antenatal follow-up, 28 weeks",
    synced: false,
  },
  {
    id: "hv-3",
    chwId: "chw-1",
    patientId: "p-4",
    scheduledFor: "2026-08-20T12:30:00Z",
    purpose: "Malaria treatment — day 3 review",
    synced: false,
  },
];

export const chwPatients: Record<string, { name: string; age: number; note: string }> = {
  "p-2": { name: "Ngozi Adeleke", age: 62, note: "BP was 172/104 last visit" },
  "p-3": { name: "Blessing Uche", age: 24, note: "First pregnancy" },
  "p-4": { name: "Ibrahim Sule", age: 9, note: "Started Coartem on Monday" },
};

export const activeEmergency: Emergency = {
  id: "e-1",
  reference: "EMG-2026-08-4471",
  patientId: "p-2",
  raisedAt: "2026-08-20T13:42:00Z",
  status: "ASSIGNED",
  description:
    "62-year-old man in Ede-Oballa. Suspected stroke — face drooping, weakness on the left side, onset under 2 hours.",
  location: { lat: 6.8567, lng: 7.3958, community: "Ede-Oballa" },
  assignedChwId: "chw-1",
  reassignInSeconds: 252,
};

/**
 * The same kind of alert seen from the other side — what the person who pressed
 * the button is watching while they wait (R14).
 *
 * `status` is the whole state of that screen: the tracker, and which step is
 * still to come, are read off this one field rather than kept as a second copy
 * that could disagree with it.
 */
export const patientEmergency: Emergency = {
  id: "e-2",
  reference: "EMG-2026-08-4482",
  patientId: currentPatient.id,
  raisedAt: "2026-08-22T09:04:00Z",
  status: "ACCEPTED",
  description: "Sudden weakness down one side. Started about 40 minutes ago.",
  location: { lat: 6.8571, lng: 7.3944, community: "Ede-Oballa" },
  assignedChwId: "chw-1",
};

/** Who is on the way, and how far off they are. */
export const emergencyResponder = {
  name: "Blessing Uche",
  role: "Your health worker",
  distanceKm: 2.1,
  minutesAway: 9,
  phone: "+234 805 220 7719",
};

export type NotifiedParty = {
  icon: "hospital" | "doctor" | "phone";
  name: string;
  note: string;
};

/**
 * Everyone the one button reached. Spelling this out is the point of the
 * screen: the promise on the emergency page is that pressing once tells the
 * health worker, a doctor and the nearest facility at the same time, so the
 * patient has to be able to see that it actually happened.
 */
export const emergencyNotified: NotifiedParty[] = [
  {
    icon: "hospital",
    name: "Bishop Shanahan Hospital",
    note: "They are getting an ambulance ready · 11.4 km",
  },
  {
    icon: "doctor",
    name: "Dr. Adaeze Okonkwo",
    note: "She is ready to talk to Blessing when she arrives",
  },
  {
    icon: "phone",
    name: "Chidi Obi (your son)",
    note: "We sent him a message with your location",
  },
];

/* ------------------------------ doctor profile ---------------------------- */

/**
 * D5. The fee is the one field here that changes what a patient sees, which is
 * why it is the only one with a dialog behind it.
 */
export const doctorProfile = {
  fullName: "Dr. Chidi Okonkwo",
  initials: "CO",
  specialty: "General practice",
  city: "Enugu",
  yearsInPractice: 9,
  mdcnNumber: "MDCN/R/48213",
  checkedOn: "2 August 2026",
  feeKobo: 150_000,
  appointmentMinutes: 20,
  languages: ["Igbo", "English"],
  modes: ["Video", "Voice", "Text"],
  patientsSeen: 284,
  acceptingPatients: true,
  /** Mon–Sun. `null` is a day not worked, kept as a value so the row is even. */
  hours: [
    { day: "Mon", span: "08–17" },
    { day: "Tue", span: "08–17" },
    { day: "Wed", span: "08–17" },
    { day: "Thu", span: "08–17" },
    { day: "Fri", span: "08–13" },
    { day: "Sat", span: null },
    { day: "Sun", span: null },
  ] as { day: string; span: string | null }[],
};

export const doctorVerification: {
  label: string;
  value: string;
  tone: "ok" | "due";
}[] = [
  { label: "MDCN licence", value: "Valid to Mar 2027", tone: "ok" },
  { label: "Identity (NIN)", value: "Confirmed", tone: "ok" },
  { label: "Payout account", value: "GTBank ••4471", tone: "ok" },
  { label: "Indemnity cover", value: "Renew in 24 days", tone: "due" },
];

/** Emergencies are on and cannot sensibly be off, so they carry the SMS note. */
export const doctorNotices: { label: string; on: boolean }[] = [
  { label: "Emergency escalations", on: true },
  { label: "New booking", on: true },
  { label: "Patient joined the call", on: true },
  { label: "Weekly earnings summary", on: false },
];

/* ------------------------------ doctor earnings --------------------------- */

/**
 * D7. Every figure is kobo so nothing here is a float, and the platform fee is
 * stated rather than implied — a doctor should not have to work out what they
 * actually keep.
 */
export const PLATFORM_FEE_PERCENT = 12;

export const doctorEarnings = {
  month: "August 2026",
  paidOutKobo: 7_450_000,
  clearingKobo: 1_200_000,
  heldKobo: 450_000,
  payoutCount: 5,
  cancellations: 2,
  nextPayoutKobo: 1_848_000,
  nextPayoutOn: "Friday 22 August, before 6pm",
  account: "GTBank ••4471 · Chidi Okonkwo",
  consultationsThisMonth: 58,
};

export const earningWeeks = [
  { week: "Wk 1", consultations: 12, grossKobo: 1_800_000 },
  { week: "Wk 2", consultations: 15, grossKobo: 2_250_000 },
  { week: "Wk 3", consultations: 17, grossKobo: 2_550_000 },
  { week: "Wk 4", consultations: 14, grossKobo: 2_100_000 },
];

export interface Payout {
  date: string;
  consultations: number;
  grossKobo: number;
  status: "Paid" | "Scheduled";
}

/** Newest first. The fee and net are derived, never stored twice. */
export const payouts: Payout[] = [
  { date: "22 Aug", consultations: 14, grossKobo: 2_100_000, status: "Scheduled" },
  { date: "15 Aug", consultations: 17, grossKobo: 2_550_000, status: "Paid" },
  { date: "8 Aug", consultations: 15, grossKobo: 2_250_000, status: "Paid" },
  { date: "1 Aug", consultations: 12, grossKobo: 1_800_000, status: "Paid" },
];

export const platformFeeKobo = (grossKobo: number) =>
  Math.round((grossKobo * PLATFORM_FEE_PERCENT) / 100);

export const netKobo = (grossKobo: number) => grossKobo - platformFeeKobo(grossKobo);

/**
 * Cash a patient handed to a health worker instead of paying from a wallet. It
 * still has to reach the doctor, so it is shown rather than left implicit.
 */
export const cashCollected = [
  { by: "Blessing Uche", amountKobo: 450_000, receipts: 3 },
  { by: "Ngozi Eze", amountKobo: 150_000, receipts: 1 },
];

/* --------------------------- doctor prescriptions -------------------------- */

export interface RxRow {
  patient: string;
  meta: string;
  medicine: string;
  issued: string;
  chemist: string | null;
  status: "Ready" | "Dispensed" | "Waiting" | "Not collected";
}

/** D6. "Not collected" is a clinical event, not an administrative one. */
export const doctorPrescriptions: RxRow[] = [
  {
    patient: "Ngozi Adeleke",
    meta: "62 · Obollo-Afor",
    medicine: "Amlodipine 5mg · 1 daily · 30 days",
    issued: "Today, 10:24",
    chemist: "Grace Chemist, Nsukka · 4.1 km",
    status: "Ready",
  },
  {
    patient: "Emeka Obi",
    meta: "34 · Ede-Oballa",
    medicine: "Coartem · 2 daily · 3 days",
    issued: "Today, 09:10",
    chemist: "Ede-Oballa Health Post · 0.6 km",
    status: "Dispensed",
  },
  {
    patient: "Ibrahim Yusuf",
    meta: "55 · Opi junction",
    medicine: "Metformin 500mg · 2 daily · 60 days",
    issued: "Yesterday",
    chemist: null,
    status: "Waiting",
  },
  {
    patient: "Amaka Nwosu",
    meta: "6 · Nsukka road",
    medicine: "Amoxicillin syrup · 3 daily · 5 days",
    issued: "18 Aug",
    chemist: "Grace Chemist, Nsukka · 4.1 km",
    status: "Not collected",
  },
  {
    patient: "Chiamaka Eze",
    meta: "23 · Ede-Oballa",
    medicine: "Hydrocortisone cream · 2 daily · 7 days",
    issued: "17 Aug",
    chemist: "Umu-Ozzi Pharmacy · 7.8 km",
    status: "Dispensed",
  },
];

export const rxCounts = [
  { value: 18, label: "Issued this week", hot: false },
  { value: 7, label: "Waiting at the chemist", hot: false },
  { value: 2, label: "Not collected in 5 days", hot: true },
  { value: 1, label: "Blocked by a conflict", hot: true },
];

/* --------------------- doctor's own emergency response --------------------- */

/**
 * D8. The doctor is reading a description of someone they cannot see, so the
 * complaint is attributed and timestamped: it matters who observed it and when,
 * not just what was observed.
 */
export const escalation = {
  reference: "EMG-2026-08-4471",
  patient: { name: "Okwudili Obi", initials: "OO", meta: "62 · Male · Ede-Oballa · SHATS 004503" },
  raisedAt: "14:05",
  reassignIn: "3:47",
  onScene: { name: "Blessing Uche", initials: "BU", since: "14:05", phone: "0805 220 7719" },
  complaint:
    "Face is drooping on one side and he cannot lift his left arm. It started before 2 o'clock — a bit less than two hours ago. He is awake and can hear me but his speech is not clear.",
  vitals: [
    { key: "BP", value: "186/112", hot: true },
    { key: "Pulse", value: "104", hot: true },
    { key: "Temp", value: "36.9°C", hot: false },
    { key: "Sugar", value: "6.1 mmol", hot: false },
    { key: "Oxygen", value: "94%", hot: false },
  ],
  history: "Allergy: penicillin · On amlodipine for blood pressure · Missed last 2 refills",
  /** Said to the health worker while the doctor decides — the wait is not dead time. */
  guidance: [
    "Note the exact time the drooping started — it decides whether clot treatment is still possible.",
    "Lay him on his side, nothing to eat or drink, do not give aspirin until a scan is done.",
    "Keep him talking. If speech stops or he cannot stay awake, call again immediately.",
  ],
  facilities: [
    { name: "Bishop Shanahan Hospital", meta: "11.4 km · CT scanner · 26 min", bed: true },
    { name: "Nsukka General Hospital", meta: "18.2 km · no scanner", bed: true },
    { name: "Ede-Oballa Health Post", meta: "0.6 km · first aid only", bed: false },
  ],
  timeline: [
    { at: "14:05", event: "Blessing raised the alert from Ede-Oballa", tone: "alert" },
    { at: "14:06", event: "Bishop Shanahan told — preparing an ambulance", tone: "pine" },
    { at: "14:07", event: "Sent to you and 2 other doctors", tone: "clay" },
    { at: "14:09", event: "You opened it", tone: "muted" },
  ] as { at: string; event: string; tone: "alert" | "pine" | "clay" | "muted" }[],
  nextAppointment: "Your 10:30 with Ngozi Adeleke is 25 minutes away.",
};

/* -------------------------------- chw profile ------------------------------ */

/**
 * C5. Sync leads this screen, because for this role it is the thing that
 * decides whether any of the work counted.
 */
export const chwProfile = {
  fullName: "Blessing Uche",
  initials: "BU",
  ward: "Ede-Oballa ward",
  patientsAssigned: 148,
  supervisor: { name: "Dr. Chidi Okonkwo", initials: "CO", replyMinutes: 20 },
  standingInstruction:
    "Tell her the same day if a top number goes above 160.",
  chwNumber: "CHW/EN/2291",
  batteryPercent: 64,
  languages: [
    { label: "Igbo", on: true },
    { label: "English", on: true },
    { label: "Pidgin", on: true },
    { label: "Hausa", on: false },
  ],
};

/** What is on the phone and has not reached the server yet. */
export const pendingSync = {
  total: 12,
  lastSentAt: "yesterday, 18:42 · at Nsukka market",
  breakdown: [
    { value: 7, label: "Home visits" },
    { value: 3, label: "New patients" },
    { value: 2, label: "Emergency reports" },
  ],
};

export const chwWork = [
  { value: 96, label: "Visits done" },
  { value: 14, label: "Patients registered" },
  { value: 7, label: "Sent to a doctor" },
  { value: 3, label: "Emergencies" },
];

export const chwKit: { item: string; note: string; tone: "ok" | "due" }[] = [
  { item: "Blood pressure cuff", note: "Checked 4 Aug", tone: "ok" },
  { item: "Thermometer", note: "Checked 4 Aug", tone: "ok" },
  { item: "Malaria test kits", note: "6 left — order more", tone: "due" },
  { item: "Phone battery", note: "64% · charge tonight", tone: "due" },
];

export const chwTraining: { course: string; state: string; tone: "ok" | "due" }[] = [
  { course: "Community health basics", state: "Passed, Feb 2026", tone: "ok" },
  { course: "Emergency first response", state: "Passed, Feb 2026", tone: "ok" },
  { course: "Maternal care", state: "Renew by 30 Sept", tone: "due" },
];

/* --------------------------------- chw alerts ------------------------------ */

/** C6. The assigned emergency is not one of these — it sits above them. */
export const chwEmergencyAlert = {
  patient: "Okwudili Obi, 62",
  where: "Behind St. Mary's",
  detail:
    "Suspected stroke: face drooping, weakness on the left side, started under 2 hours ago.",
  ago: "4 min ago",
  reassignIn: "4:12",
};

export type AlertKind = "doctor" | "reading" | "visit" | "supply" | "registration";

export interface ChwAlert {
  kind: AlertKind;
  title: string;
  body: string;
  when: string;
  unread: boolean;
}

export const chwAlerts: ChwAlert[] = [
  {
    kind: "doctor",
    title: "Dr. Okonkwo replied about Ngozi Adeleke",
    body: "She says start her on Amlodipine 5mg today and check the pressure again on Thursday. Tap to read the full note.",
    when: "18 min ago",
    unread: true,
  },
  {
    kind: "reading",
    title: "Blood pressure above the line you were told about",
    body: "Michael Attah's reading was 178/108 this morning. Dr. Okonkwo asked to be told the same day if the top number goes above 160.",
    when: "1 hour ago",
    unread: true,
  },
  {
    kind: "visit",
    title: "Antenatal visit due tomorrow",
    body: "Blessing Nwafor is 28 weeks. Her visit is planned for 08:30 at Ede-Oballa.",
    when: "3 hours ago",
    unread: false,
  },
  {
    kind: "supply",
    title: "Malaria test kits running low",
    body: "6 left. Order more from the Nsukka store before Friday or you cannot test.",
    when: "Yesterday",
    unread: false,
  },
  {
    kind: "registration",
    title: "2 patients you registered are now confirmed",
    body: "Ibrahim Sule and Grace Odo have SHATS numbers. Write them on their cards.",
    when: "Yesterday",
    unread: false,
  },
];

/* -------------------------------- chw reports ------------------------------ */

export interface ChwReport {
  when: string;
  kind: "Home visit" | "New patient" | "Emergency report";
  patient: string;
  found: string;
  /** False while the record is still only on the phone. */
  sent: boolean;
}

/**
 * C7. The last column is the whole point: the health worker's real question is
 * not "did I write it" but "has anybody read it".
 */
export const chwReports: ChwReport[] = [
  {
    when: "Today, 14:05",
    kind: "Emergency report",
    patient: "Okwudili Obi, 62",
    found: "Referred to facility — suspected stroke",
    sent: false,
  },
  {
    when: "Today, 11:20",
    kind: "Home visit",
    patient: "Michael Attah, 41",
    found: "BP 178/108 — sent to Dr. Okonkwo",
    sent: false,
  },
  {
    when: "Today, 08:30",
    kind: "Home visit",
    patient: "Ngozi Adeleke, 62",
    found: "BP 148/92 — improving on tablets",
    sent: true,
  },
  {
    when: "Yesterday",
    kind: "New patient",
    patient: "Grace Odo, 19",
    found: "Immunisation record updated",
    sent: true,
  },
  {
    when: "19 Aug",
    kind: "Home visit",
    patient: "Blessing Nwafor, 24",
    found: "Antenatal 28 weeks — normal",
    sent: true,
  },
  {
    when: "18 Aug",
    kind: "Emergency report",
    patient: "Amaka Nwosu, 6",
    found: "Resolved on scene — fever controlled",
    sent: true,
  },
];
