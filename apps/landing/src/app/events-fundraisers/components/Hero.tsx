import Image from "next/image";
import { BadgeCheck, Info, ShieldCheck, UserRound } from "lucide-react";
import { appUrl } from "@/lib/app-links";
import { C } from "./theme";

const POINTS = [
  { icon: ShieldCheck, text: "Know who benefits." },
  { icon: Info, text: "See how the fundraiser is structured." },
  { icon: UserRound, text: "Support through approved, safety-governed flows." },
] as const;

const SIDE = [
  { title: "Medical Care Fund", note: "Organizer verified", image: "thumb-medical-care", alt: "A veterinarian examining a dog" },
  { title: "Sanctuary Facility Repair", note: "Transparent tracking", image: "thumb-sanctuary", alt: "Goats at a farm sanctuary" },
] as const;

export default function Hero() {
  return (
    <section className="grid items-center gap-10 pb-10 pt-10 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,620px)] lg:gap-12">
      <div className="flex flex-col gap-3.5">
        <span
          className="self-start rounded-[20px] px-3 py-[5px] text-xs font-bold leading-4 tracking-wide"
          style={{ background: C.chip, color: C.brand }}
        >
          Events · Fundraisers
        </span>
        <h1 className="max-w-[460px] text-3xl font-extrabold leading-tight sm:text-4xl sm:leading-10" style={{ color: C.inkDeep }}>
          Support animal causes with confidence.
        </h1>
        <p className="max-w-[440px] text-base leading-6" style={{ color: C.muted }}>
          Discover fundraisers for verified rescues, shelters, and
          animal-welfare organizations with clear beneficiary information,
          organizer identity, and transparent contribution tracking where
          supported.
        </p>
        <div className="flex flex-col gap-2.5 pt-2 sm:flex-row sm:flex-wrap">
          <a
            href="#fundraisers"
            className="rounded-xl px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: C.brand }}
          >
            Explore fundraisers
          </a>
          <a
            href={appUrl("/events")}
            className="rounded-xl bg-white px-4 py-2.5 text-center text-sm font-semibold transition hover:bg-neutral-50"
            style={{ color: C.ink, border: `1px solid ${C.line}` }}
          >
            Start a fundraiser
          </a>
        </div>
        <ul className="flex flex-col gap-1.5 pt-1.5">
          {POINTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2 text-xs leading-5" style={{ color: C.muted }}>
              <Icon size={14} strokeWidth={2} className="shrink-0" style={{ color: C.brand }} />
              {text}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl p-5" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,230px)]">
          <div className="overflow-hidden rounded-2xl bg-white" style={{ border: `1px solid ${C.line}` }}>
            <div className="relative aspect-[333/188] w-full bg-gradient-to-br from-cyan-800 to-orange-500">
              <Image
                src="/events-fundraisers/hero-flood.webp"
                alt="Two volunteers kneeling beside dogs in a shelter barn"
                fill
                priority
                sizes="(min-width: 1024px) 340px, 100vw"
                className="object-cover"
              />
              <span
                className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md px-2 py-[3px] text-[9.5px] font-bold leading-4 text-white"
                style={{ background: C.overlay }}
              >
                <BadgeCheck size={9} strokeWidth={2.5} />
                Verified beneficiary
              </span>
            </div>
            <div className="flex flex-col gap-px px-3 py-2.5">
              <p className="text-xs font-bold leading-4" style={{ color: C.ink }}>
                Emergency Shelter Fundraiser: Flood Response
              </p>
              <p className="text-xs leading-4" style={{ color: C.muted }}>
                Beneficiary: Coastal Animal Rescue Network
              </p>
              <p className="flex flex-wrap gap-1.5 pt-1.5">
                {["Contributed $8,240", "Goal $15,000"].map((t) => (
                  <span
                    key={t}
                    className="rounded-md px-1.5 py-0.5 text-[9.5px] font-bold leading-4"
                    style={{ background: C.chip, color: C.inkDeep }}
                  >
                    {t}
                  </span>
                ))}
              </p>
            </div>
          </div>
          <ul
            className="flex flex-col gap-2.5 self-start rounded-2xl bg-white p-2.5"
            style={{ border: `1px solid ${C.line}` }}
          >
            {SIDE.map((s) => (
              <li key={s.title} className="flex items-center gap-2">
                <div className="relative h-10 w-12 shrink-0 overflow-hidden rounded-lg" style={{ background: C.chip }}>
                  <Image src={`/events-fundraisers/${s.image}.webp`} alt={s.alt} fill sizes="48px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold leading-4" style={{ color: C.ink }}>
                    {s.title}
                  </p>
                  <p className="text-[10px] leading-4" style={{ color: C.muted }}>
                    {s.note}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
