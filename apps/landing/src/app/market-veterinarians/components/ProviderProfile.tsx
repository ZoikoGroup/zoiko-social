import Image from "next/image";
import { Hospital, TriangleAlert } from "lucide-react";
import { appUrl } from "@/lib/app-links";
import { C } from "./theme";

/** Dr. Sarah Chen's full profile, as the design shows it below the results. */
const PROFILE = {
  name: "Dr. Sarah Chen",
  role: "General Practice Veterinarian",
  bio: "Dr. Sarah Chen has been practicing veterinary medicine for over 12 years. She specializes in preventive care, wellness exams, and general medical treatment for dogs and cats. Her compassionate approach and thorough diagnostic skills make her a trusted choice for pet parents in Manhattan.",
  services: [
    "General wellness exams",
    "Preventive care & vaccinations",
    "Dental cleanings",
    "Surgical procedures",
    "Diagnostics & lab work",
    "Behavioral consultation",
  ],
  address: "123 Madison Ave, Manhattan, NY 10016",
  hours: ["Monday–Friday: 8:00 AM – 6:00 PM", "Saturday: 10:00 AM – 4:00 PM", "Sunday: Closed"],
  species: ["Dogs", "Cats", "Small mammals"],
  phone: "(212) 555-0123",
  website: "www.sarahchenvet.com",
};

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pt-8" style={{ borderTop: `1px solid ${C.line}` }}>
      <h3 className="text-base font-bold" style={{ color: C.brand }}>
        {title}
      </h3>
      <div className="pt-4 text-sm" style={{ color: C.ink }}>
        {children}
      </div>
    </div>
  );
}

export default function ProviderProfile() {
  const p = PROFILE;
  return (
    <section id="provider-profile" className="scroll-mt-6 py-12 sm:py-20" style={{ background: C.panel }}>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16 xl:px-28">
        <div className="rounded-[20px] bg-white p-5 sm:p-12" style={{ border: `1px solid ${C.line}` }}>
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
            <div className="relative aspect-[542/300] w-full overflow-hidden rounded-3xl">
              <Image
                src="/market-veterinarians/sarah-chen-profile.webp"
                alt="Dr. Sarah Chen holding a rabbit"
                fill
                sizes="(min-width: 1024px) 542px, 100vw"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: C.inkDeep }}>
                {p.name}
              </h2>
              <p className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 text-sm" style={{ color: C.ink }}>
                <span className="inline-flex items-center gap-2">
                  <Hospital size={14} strokeWidth={2} style={{ color: C.muted }} />
                  {p.role}
                </span>
                <span>✓ Verified provider</span>
              </p>
              <p className="pt-5 text-sm leading-6" style={{ color: C.ink }}>
                {p.bio}
              </p>
              <div className="mt-6 rounded-xl p-4" style={{ background: C.chip }}>
                <p className="text-base font-semibold" style={{ color: C.brand }}>
                  ✓ What does verified mean?
                </p>
                <p className="pt-2 text-xs leading-5" style={{ color: C.ink }}>
                  This provider&apos;s credentials, licensing, and professional
                  qualifications have been verified by our trust team.
                </p>
              </div>
              <div className="grid gap-3 pt-6 sm:grid-cols-2">
                <a
                  href="tel:+12125550123"
                  className="rounded-xl py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ background: C.brand }}
                >
                  Contact provider
                </a>
                <a
                  href={appUrl("/vet-finder")}
                  className="rounded-xl bg-white py-2.5 text-center text-sm font-semibold transition hover:bg-neutral-50"
                  style={{ color: C.brand, border: `1px solid ${C.line}` }}
                >
                  View full profile
                </a>
              </div>
            </div>
          </div>

          <div className="grid gap-x-8 gap-y-10 pt-12 md:grid-cols-2">
            <Block title="Services & expertise">
              <ul className="flex flex-col gap-3">
                {p.services.map((s) => (
                  <li key={s} className="flex items-center gap-2.5">
                    <span style={{ color: C.brand }}>✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </Block>
            <Block title="Location & hours">
              <p>
                <span className="font-semibold">Address:</span> {p.address}
              </p>
              <p className="pt-3 font-semibold">Hours:</p>
              <ul className="flex list-disc flex-col gap-3 pl-5 pt-3">
                {p.hours.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </Block>
            <Block title="Species & care focus">
              <ul className="flex list-disc flex-wrap gap-x-16 gap-y-2 pl-5">
                {p.species.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </Block>
            <Block title="Contact & directions">
              <p>
                <span className="font-semibold">Phone:</span> {p.phone}
              </p>
              <p className="pt-3">
                <span className="font-semibold">Website:</span> {p.website}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block rounded-xl bg-white py-2.5 text-center text-sm font-semibold transition hover:bg-neutral-50"
                style={{ color: C.brand, border: `1px solid ${C.line}` }}
              >
                Get directions
              </a>
            </Block>
          </div>

          <div
            className="mt-12 flex items-start gap-4 rounded-2xl p-5 sm:items-center sm:p-6"
            style={{ background: C.warmFill, border: `2px solid ${C.warm}` }}
          >
            <span
              className="flex size-11 shrink-0 items-center justify-center rounded-full text-white"
              style={{ background: C.warm }}
            >
              <TriangleAlert size={18} strokeWidth={2} />
            </span>
            <div>
              <p className="text-base font-bold" style={{ color: C.warm }}>
                Need emergency care?
              </p>
              <p className="pt-1 text-sm" style={{ color: C.ink }}>
                For urgent veterinary services available 24/7, explore our
                Emergency Vet Care listings.
              </p>
              <a
                href={appUrl("/vet-finder")}
                className="mt-2 inline-block text-sm font-semibold hover:underline"
                style={{ color: C.warm }}
              >
                Find emergency vet care →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
