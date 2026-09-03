import { ChwTop } from "@/components/shells";
import {
  ActivityIcon,
  BadgeCheckIcon,
  BatteryIcon,
  Card,
  FlaskIcon,
  PhoneIcon,
  ThermometerIcon,
  WifiOffIcon,
} from "@/components/ui";
import { chwKit, chwProfile, chwTraining, chwWork, pendingSync } from "@/lib/mock";
import { GoOffDutyTrigger } from "@/components/dialogs/pro-triggers";

function CardLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{children}</p>
  );
}

/** One icon per kit item, in the order the list is written. */
const KIT_ICONS = [ActivityIcon, ThermometerIcon, FlaskIcon, BatteryIcon];

/**
 * C5 — the health worker's own profile.
 *
 * Sync leads the screen rather than sitting in a settings list, because for this
 * role it is the thing that decides whether any of the work counted: a visit
 * still on the phone is a visit the supervising doctor cannot act on.
 */
export default function ChwProfile() {
  const p = chwProfile;

  return (
    <div className="min-h-screen bg-paper">
      <ChwTop pathname="/chw/profile" pending={pendingSync.total} />

      <main className="space-y-4 px-7 py-6">
        <Card className="flex flex-wrap items-center gap-[18px] p-[22px]">
          <span className="flex h-[74px] w-[74px] shrink-0 items-center justify-center rounded-full bg-clay-wash font-display text-[26px] font-semibold text-clay">
            {p.initials}
          </span>
          <div className="flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-display text-[26px] font-semibold text-ink">{p.fullName}</h1>
              <span className="rounded-[3px] bg-clay-wash px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.09em] text-clay">
                Health worker
              </span>
            </div>
            <p className="text-sm text-ink-soft">
              {p.ward} · {p.patientsAssigned} patients assigned
            </p>
            <p className="text-[12.5px] text-muted">
              Supervised by {p.supervisor.name} · {p.chwNumber}
            </p>
          </div>
        </Card>

        {/* The dark panel is the offline state of the product made visible: this
            is the only card on the screen that can cost the patient anything. */}
        <div className="rounded-[14px] bg-[#3A2A16] p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="flex items-center gap-2.5 text-[15px] font-bold text-amber">
              <WifiOffIcon size={17} /> {pendingSync.total} records waiting to send
            </p>
            <button className="rounded-full bg-amber px-4 py-2.5 text-[13px] font-bold text-[#2A1D08]">
              Try to sync
            </button>
          </div>
          <p className="mt-3.5 text-[12.5px] leading-relaxed text-[#D9C7A8]">
            Everything you record is saved on this phone. It sends itself the moment you reach
            network — you do not have to remember.
          </p>
          <div className="mt-3.5 grid grid-cols-3 gap-2.5">
            {pendingSync.breakdown.map((b) => (
              <div key={b.label} className="rounded-[4px] bg-[#4A3720] px-3.5 py-3">
                <p className="font-display text-[21px] font-semibold text-amber">{b.value}</p>
                <p className="text-[11.5px] text-[#D9C7A8]">{b.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-3.5 text-xs text-[#A8977C]">Last sent {pendingSync.lastSentAt}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0 space-y-4">
            <Card className="p-5">
              <CardLabel>MY WORK THIS MONTH</CardLabel>
              <div className="mt-3.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {chwWork.map((w) => (
                  <div key={w.label} className="rounded-[4px] bg-paper px-3.5 py-3">
                    <p className="font-display text-2xl font-semibold text-pine">{w.value}</p>
                    <p className="mt-0.5 text-[11.5px] leading-snug text-muted">{w.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3.5 text-xs leading-relaxed text-muted">
                Counted from what has reached the server. Anything still on this phone is added when
                it sends.
              </p>
            </Card>

            <Card className="p-5">
              <CardLabel>MY KIT</CardLabel>
              <ul className="mt-3 space-y-3">
                {chwKit.map((k, i) => {
                  const Icon = KIT_ICONS[i] ?? ActivityIcon;
                  const tone = k.tone === "ok" ? "text-pine" : "text-clay";
                  return (
                    <li key={k.item} className="flex items-start gap-2.5">
                      <span className={tone}>
                        <Icon size={15} />
                      </span>
                      <span>
                        <span className="block text-[13px] font-semibold text-ink">{k.item}</span>
                        <span className={`block text-[11.5px] ${tone}`}>{k.note}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card className="p-5">
              <CardLabel>MY SUPERVISING DOCTOR</CardLabel>
              <div className="mt-3 flex items-center gap-2.5">
                <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-pine-wash text-sm font-bold text-pine">
                  {p.supervisor.initials}
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">{p.supervisor.name}</p>
                  <p className="text-[11.5px] text-muted">
                    General practice · usually replies in {p.supervisor.replyMinutes} min
                  </p>
                </div>
              </div>
              <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-pine px-4 py-3 text-[13.5px] font-bold text-white">
                <PhoneIcon size={15} /> Call {p.supervisor.name.split(" ")[1]}
              </button>
              <p className="mt-3 text-xs leading-relaxed text-ink-soft">
                Standing instruction: {p.standingInstruction}
              </p>
            </Card>

            <Card className="p-5">
              <CardLabel>LANGUAGES I SPEAK</CardLabel>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.languages.map((l) => (
                  <span
                    key={l.label}
                    className={`rounded-full border px-3 py-1.5 text-[12.5px] font-bold ${
                      l.on ? "border-pine bg-pine-wash text-pine" : "border-line bg-paper text-muted"
                    }`}
                  >
                    {l.label}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                Patients who speak these are sent to you first.
              </p>
            </Card>

            <Card className="p-5">
              <CardLabel>TRAINING</CardLabel>
              <ul className="mt-3 space-y-3">
                {chwTraining.map((t) => (
                  <li key={t.course} className="flex items-start gap-2.5">
                    <span className={t.tone === "ok" ? "text-pine" : "text-clay"}>
                      <BadgeCheckIcon size={15} />
                    </span>
                    <span>
                      <span className="block text-[13px] font-semibold text-ink">{t.course}</span>
                      <span
                        className={`block text-[11.5px] ${
                          t.tone === "ok" ? "text-pine" : "text-clay"
                        }`}
                      >
                        {t.state}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            <GoOffDutyTrigger
              pending={pendingSync.total}
              visitsLeft="2 — Michael Attah, Grace Odo"
              cover="Ngozi Eze · Obollo-Afor"
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
