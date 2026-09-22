import Image from "next/image";
import { TriangleAlert } from "lucide-react";
import { appUrl } from "@/lib/app-links";
import { C } from "./theme";

/** Bay View Animal Hospital's full profile, as the design shows it below the results. */
const PROFILE = {
  name: "Bay View Animal Hospital",
  facts: [
    ["Type:", "Full-service animal hospital (24-hour emergency services available)"],
    ["Status:", "Verified facility"],
    ["Years:", "Operating since 2010"],
    ["Team:", "4 veterinarians on staff"],
  ],
  about:
    "Bay View Animal Hospital is a full-service, state-of-the-art veterinary facility committed to providing comprehensive care for dogs, cats, and select exotic pets. Our experienced team of veterinarians specializes in preventive medicine, surgical procedures, dental care, and emergency services. We pride ourselves on compassionate care, modern diagnostic equipment, and a commitment to client education.",
  team: [
    { name: "Dr. Wei Chen", focus: "General Practice & Surgery", image: "team-wei-chen" },
    { name: "Dr. Maria Garcia", focus: "Internal Medicine & Diagnostics", image: "team-maria-garcia" },
    { name: "Dr. Rajesh Patel", focus: "Dental & Preventive Care", image: "team-rajesh-patel" },
    { name: "Dr. Sarah Kim", focus: "Emergency Medicine & Critical Care", image: "team-sarah-kim" },
  ],
  services: [
    "General wellness exams",
    "Preventive care & vaccinations",
    "Dental cleaning & extractions",
    "Surgical procedures",
    "Orthopedic surgery",
    "Diagnostic imaging (X-ray, ultrasound)",
    "Laboratory testing",
    "Emergency & critical care",
  ],
  address: "456 Bay View Drive, San Francisco, CA 94102",
  hours: ["Monday–Friday: 8:00 AM – 8:00 PM", "Saturday–Sunday: 9:00 AM – 6:00 PM", "Emergency: 24/7 (call ahead)"],
  species: ["Dogs", "Cats", "Rabbits & pocket pets", "Exotic pets (birds, reptiles, small mammals)"],
  phone: "(415) 555-0123",
  website: "www.bayviewanimalhosp.com",
};

const MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(PROFILE.address)}`;

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-base font-bold" style={{ color: C.brand }}>
        {title}
      </h3>
      <div className="pt-4 text-sm" style={{ color: C.ink }}>
        {children}
      </div>
    </div>
  );
}

function Checks({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((s) => (
        <li key={s} className="flex items-start gap-2.5">
          <span style={{ color: C.brand }}>✓</span>
          {s}
        </li>
      ))}
    </ul>
  );
}

const OUTLINE_BTN = "rounded-xl bg-white px-6 py-2.5 text-center text-sm font-semibold transition hover:bg-neutral-50";

export default function FacilityProfile() {
  const p = PROFILE;
  return (
    <section className="px-4 py-12 sm:px-8 sm:py-20 lg:px-16 xl:px-28" style={{ background: C.panel }}>
      <div className="mx-auto flex max-w-[1230px] flex-col gap-8">
        <div id="facility-profile" className="scroll-mt-6 overflow-hidden rounded-[20px] bg-white" style={{ border: `1px solid ${C.line}` }}>
          <div
            className="grid gap-8 p-5 sm:p-12 lg:grid-cols-[minmax(0,344px)_minmax(0,1fr)_minmax(0,344px)] lg:items-start"
            style={{ background: "linear-gradient(110deg, #E8F0F1 0%, #F4F7F6 55%, #FBF4EE 100%)", borderBottom: `1px solid ${C.line}` }}
          >
            <div className="relative aspect-[344/300] w-full overflow-hidden rounded-3xl">
              <Image
                src="/market-clinics-hospitals/bay-view-profile.webp"
                alt="Two veterinarians examining a husky on an exam table"
                fill
                sizes="(min-width: 1024px) 344px, 100vw"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl sm:leading-[52px]" style={{ color: C.inkDeep }}>
                {p.name}
              </h2>
              <dl className="grid grid-cols-[88px_1fr] gap-x-2 gap-y-3 pt-5 text-sm">
                {p.facts.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="font-bold" style={{ color: C.brand }}>
                      {k}
                    </dt>
                    <dd style={{ color: C.ink }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="flex flex-col gap-6">
              <p className="rounded-3xl bg-white p-6 text-sm leading-6" style={{ color: C.ink }}>
                {p.about}
              </p>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <a
                  href="tel:+14155550123"
                  className="flex-1 rounded-xl px-6 py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-90 sm:flex-none"
                  style={{ background: C.brand }}
                >
                  Contact facility
                </a>
                <a
                  href={MAPS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 sm:flex-none ${OUTLINE_BTN}`}
                  style={{ color: C.brand, border: `1px solid ${C.line}` }}
                >
                  Get directions
                </a>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-12" style={{ borderBottom: `1px solid ${C.line}` }}>
            <h3 className="text-xl font-bold" style={{ color: C.inkDeep }}>
              <span aria-hidden>🧑‍⚕️ </span>Veterinary team
            </h3>
            <ul className="grid gap-6 pt-5 sm:grid-cols-2 lg:grid-cols-3">
              {p.team.map((t) => (
                <li
                  key={t.name}
                  className="flex items-center gap-4 rounded-[20px] px-4 py-4 sm:px-8"
                  style={{ background: C.chip, border: `1px solid ${C.line}` }}
                >
                  <Image
                    src={`/market-clinics-hospitals/${t.image}.webp`}
                    alt=""
                    width={60}
                    height={60}
                    className="size-[60px] shrink-0 rounded-full object-cover"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-bold" style={{ color: C.ink }}>
                      {t.name}
                    </span>
                    <span className="block text-xs leading-5" style={{ color: C.muted }}>
                      {t.focus}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-x-12 gap-y-10 p-5 sm:p-12 md:grid-cols-2">
            <Block title="Services & specialties">
              <Checks items={p.services} />
            </Block>
            <Block title="Location & hours">
              <p>
                <span className="font-semibold">Address:</span> {p.address}
              </p>
              <p className="pb-3 pt-3 font-semibold">Hours:</p>
              <Checks items={p.hours} />
            </Block>
            <div className="pt-10 md:col-span-2 md:grid md:grid-cols-2 md:gap-x-12" style={{ borderTop: `1px solid ${C.line}` }}>
              <Block title="Species & care focus">
                <ul className="flex list-disc flex-wrap gap-x-14 gap-y-3 pl-5">
                  {p.species.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </Block>
              <div className="pt-10 md:pt-0">
                <Block title="Contact & directions">
                  <p>
                    <span className="font-semibold">Phone:</span> {p.phone}
                  </p>
                  <p className="pt-3">
                    <span className="font-semibold">Website:</span> {p.website}
                  </p>
                  <a href={MAPS} target="_blank" rel="noopener noreferrer" className={`mt-4 block ${OUTLINE_BTN}`} style={{ color: C.brand, border: `1px solid ${C.line}` }}>
                    Get directions
                  </a>
                </Block>
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex items-start gap-4 rounded-2xl p-5 sm:items-center sm:p-6"
          style={{ background: C.warmFill, border: `2px solid ${C.warm}` }}
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full text-white" style={{ background: C.warm }}>
            <TriangleAlert size={18} strokeWidth={2} />
          </span>
          <div>
            <p className="text-base font-bold" style={{ color: C.warm }}>
              Need emergency care right now?
            </p>
            <p className="pt-1 text-sm" style={{ color: C.ink }}>
              If your pet requires urgent care outside regular hours, explore
              24-hour emergency veterinary services in your area.
            </p>
            <a href={appUrl("/vet-finder")} className="mt-2 inline-block text-sm font-semibold hover:underline" style={{ color: C.warm }}>
              Find emergency vet care →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
