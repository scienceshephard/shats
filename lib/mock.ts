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
