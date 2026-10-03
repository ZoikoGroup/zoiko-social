import Image from "next/image";
import Section from "./Section";
import { IMG, ONLINE_THERAPY } from "./content";
import { C } from "./theme";

export default function OnlineTherapy() {
  return (
    <Section
      id="online-therapy"
      tinted
      title="Online therapy & digital support"
      intro="Flexible, affordable alternatives to in-person therapy. Talk to licensed therapists via video, phone, or chat on your schedule."
    >
      <div className="grid gap-4 pt-2 sm:grid-cols-2 sm:gap-6 sm:pt-6 lg:grid-cols-3 lg:gap-y-9">
        {ONLINE_THERAPY.map((o) => (
          <article
            key={o.name}
            className="flex flex-col rounded-[20px] bg-white p-6 sm:p-8"
            style={{ border: `1px solid ${C.line}` }}
          >
            <div className="relative h-36 w-full overflow-hidden rounded-t-[20px]">
              <Image
                src={`${IMG}${o.image}.webp`}
                alt={o.alt}
                fill
                sizes="(min-width: 1024px) 328px, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <h3 className="pt-5 text-lg font-bold" style={{ color: C.brand }}>
              {o.name}
            </h3>
            <p className="pt-2 text-sm leading-[23px]" style={{ color: C.muted }}>
              {o.body}
            </p>
            <p className="pb-6 pt-4 text-[13px] font-semibold" style={{ color: C.price }}>
              {o.price}
            </p>
            <a
              href={o.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto rounded-xl px-5 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: C.brand }}
            >
              Explore<span className="sr-only"> {o.name}</span>
            </a>
          </article>
        ))}
      </div>
      <p className="text-xs leading-5" style={{ color: C.muted }}>
        Prices are approximate and set by each provider. Zoiko Social isn’t affiliated with these services — check
        current pricing and coverage on their sites.
      </p>
    </Section>
  );
}
