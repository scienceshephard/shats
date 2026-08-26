import Link from "next/link";
import { ProTop } from "@/components/shells";
import { Pill } from "@/components/ui";

const NAV = [
  { href: "/doctor", label: "Schedule" },
  { href: "/doctor/patients", label: "My patients", active: true },
  { href: "/doctor/consultation", label: "Consultation room" },
];

const PATIENTS = [
  { id: "p-1", name: "Emeka Okafor", shats: "004182", age: 34, sex: "Male", place: "Ede-Oballa, Nsukka", last: "13 Aug 2026", flag: "Penicillin allergy" },
  { id: "p-2", name: "Ngozi Adeleke", shats: "004201", age: 41, sex: "Female", place: "Obollo-Afor", last: "19 Aug 2026", flag: "Hypertension" },
  { id: "p-3", name: "Sunday Okoro", shats: "003920", age: 28, sex: "Male", place: "Nsukka", last: "02 Aug 2026", flag: "" },
  { id: "p-4", name: "Amaka Nwosu", shats: "004310", age: 6, sex: "Female", place: "Ede-Oballa", last: "28 Jul 2026", flag: "Parent booking" },
  { id: "p-5", name: "Ibrahim Yusuf", shats: "003855", age: 55, sex: "Male", place: "Enugu", last: "21 Jul 2026", flag: "Type 2 diabetes" },
];

/** D3 — My patients. Search is by name or SHATS ID, the number read over the phone. */
export default function DoctorPatients() {
  return (
    <div className="min-h-screen bg-paper">
      <ProTop links={NAV} right={<span className="text-sm font-semibold text-ink">Dr. Okonkwo</span>} />

      <main className="px-7 py-8">
        <h1 className="font-display text-[32px] font-semibold text-ink">My patients</h1>
        <p className="mt-2 text-sm text-muted">
          Everyone you have consulted. You can only open a record for a consultation you booked.
        </p>

        <input
          placeholder="Search name or SHATS ID"
          className="mt-6 w-full max-w-[420px] rounded-full border border-line-strong bg-surface px-5 py-3 text-sm outline-none placeholder:text-muted focus:border-pine"
        />

        <div className="mt-6 overflow-hidden rounded-[10px] border border-line bg-surface">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line bg-paper text-[10px] uppercase tracking-[0.12em] text-muted">
                <th className="px-5 py-3 font-bold">Patient</th>
                <th className="px-5 py-3 font-bold">SHATS ID</th>
                <th className="px-5 py-3 font-bold">Community</th>
                <th className="px-5 py-3 font-bold">Last seen</th>
                <th className="px-5 py-3 font-bold">Flags</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {PATIENTS.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted">
                    No patients match that search.
                  </td>
                </tr>
              )}
              {PATIENTS.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-ink">{p.name}</p>
                    <p className="text-xs text-muted">
                      {p.age} · {p.sex}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-ink-soft">{p.shats}</td>
                  <td className="px-5 py-4 text-sm text-ink-soft">{p.place}</td>
                  <td className="px-5 py-4 text-sm text-ink-soft">{p.last}</td>
                  <td className="px-5 py-4">
                    {p.flag && (
                      <Pill tone={p.flag.includes("allergy") ? "alert" : "neutral"}>{p.flag}</Pill>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/doctor/patients/${p.id}`}
                      className="rounded-full border border-line-strong px-4 py-2 text-xs font-semibold text-ink hover:border-pine"
                    >
                      Open record
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
