import Image from "next/image";
import { telHref } from "./providers";
import { C } from "./theme";

/** Emergency Vet Care SF's full profile, as the design shows it below the results. */
const PROFILE = {
  name: "Emergency Vet Care SF",
  tags: ["Emergency surgery", "Trauma care", "Dogs & cats"],
  about:
    "Emergency Vet Care SF is a full-service emergency veterinary hospital staffed 24/7 by board-certified veterinarians and experienced technicians. We specialize in emergency, surgical, and critical care services.",
  facts: [
    ["Verified status", "✓ Verified"],
    ["Hours", "24 hours daily"],
    ["New patients", "Accepting"],
    ["Species", "Dogs & cats"],
  ],
  services: [
    "24/7 emergency surgery",
    "Trauma and critical care",
    "Internal medicine emergencies",
    "Emergency diagnostics (ultrasound, x-ray)",
    "Blood transfusions",
    "Intensive care unit (ICU)",
  ],
  address: "1234 Mission Street, San Francisco, CA 94110",
  phone: "(415) 555-0001",
  website: "www.emergencyvetcaresf.com",
  beforeVisit: [
    "Call ahead to confirm availability",
    "Bring your pet’s medical records if available",
    "Have your ID and payment method ready",
    "Emergency drop-off available 24/7",
  ],
  access: [
    "Wheelchair accessible entrance",
    "Accessible restrooms",
    "Street and lot parking available",
    "Bus stops nearby (lines 12, 27)",
  ],
};

const MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(PROFILE.address)}`;

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 pt-6" style={{ borderTop: `1px solid ${C.line}` }}>
      <h3 className="text-base font-bold leading-6" style={{ color: C.brand }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Checks({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-col">
      {items.map((s) => (
        <li key={s} className="flex items-start gap-2 py-2 text-sm leading-6" style={{ color: C.ink }}>
          <span className="font-bold" style={{ color: C.brand }} aria-hidden>
            ✓
          </span>
          {s}
        </li>
      ))}
    </ul>
  );
}

export default function ProviderProfile() {
  const p = PROFILE;
  return (
    <section className="bg-white px-4 pb-12 sm:px-8 sm:pb-16 lg:px-16 lg:pb-20 xl:px-20">
      <article
        id="provider-profile"
        className="mx-auto flex max-w-[1280px] scroll-mt-4 flex-col gap-8 rounded-3xl bg-white p-5 sm:gap-12 sm:p-12"
        style={{ border: `1px solid ${C.line}` }}
      >
        <div className="grid gap-8 md:grid-cols-2 md:items-start lg:gap-16">
          <div className="relative aspect-[525/397] w-full overflow-hidden rounded-3xl">
            <Image
              src="/market-emergency-vet-care/profile.webp"
              alt="Two vets bandaging a German Shepherd puppy's paw"
              fill
              sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-3.5">
            <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl sm:leading-[51.2px]" style={{ color: C.ink }}>
              {p.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-2xl px-3 py-1.5 text-xs font-semibold uppercase leading-5"
                  style={{ background: C.chip, color: C.brand, border: `1px solid ${C.line}` }}
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="text-sm leading-6" style={{ color: C.ink }}>
              {p.about}
            </p>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-[20px] px-4 pb-4 pt-6" style={{ background: C.panel }}>
              {p.facts.map(([k, v]) => (
                <div key={k} className="flex flex-col gap-1">
                  <dt className="text-xs font-bold uppercase leading-4 tracking-wide" style={{ color: C.muted }}>
                    {k}
                  </dt>
                  <dd className="text-sm font-semibold leading-6" style={{ color: C.ink }}>
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div
          role="note"
          className="flex items-start gap-4 rounded-3xl p-5 sm:gap-6 sm:p-8"
          style={{ background: C.warmFill, border: `2px solid ${C.warm}` }}
        >
          <span className="text-2xl leading-10 sm:text-3xl" aria-hidden>
            ⚠️
          </span>
          <div className="flex flex-col gap-2">
            <p className="text-base font-bold leading-6" style={{ color: C.ink }}>
              Important: This is a discovery tool
            </p>
            <p className="text-sm leading-6" style={{ color: C.ink }}>
              This page helps you find emergency vet care options, but it is not an emergency response service. Always
              confirm availability with the facility directly before travel. In life-threatening situations, call ahead or
              go directly to the nearest emergency clinic.
            </p>
          </div>
        </div>

        <div className="grid gap-x-16 gap-y-10 md:grid-cols-2">
          <Block title="Emergency services">
            <Checks items={p.services} />
          </Block>
          <Block title="Location & contact">
            <div className="flex flex-col gap-3 text-sm leading-6" style={{ color: C.ink }}>
              <p>
                <span className="font-bold">Address:</span> {p.address}
              </p>
              <p>
                <span className="font-bold">Phone:</span>{" "}
                <a href={telHref(p.phone)} className="hover:underline" style={{ color: C.brand }}>
                  {p.phone}
                </a>
              </p>
              <p>
                <span className="font-bold">Website:</span> <span style={{ color: C.brand }}>{p.website}</span>
              </p>
              <p>
                <span className="font-bold">Directions:</span>{" "}
                <a href={MAPS} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: C.brand }}>
                  Get directions
                </a>
              </p>
            </div>
          </Block>
          <Block title="Before you visit">
            <Checks items={p.beforeVisit} />
          </Block>
          <Block title="Accessibility & parking">
            <Checks items={p.access} />
          </Block>
        </div>
      </article>
    </section>
  );
}
