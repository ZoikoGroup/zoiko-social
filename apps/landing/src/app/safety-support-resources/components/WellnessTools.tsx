import Image from "next/image";
import Section from "./Section";
import { IMG, WELLNESS, externalProps } from "./content";
import { C } from "./theme";

export default function WellnessTools() {
  return (
    <Section
      id="wellness-tools"
      title="Wellness tools & self-care practices"
      intro="Healing happens in daily moments. Small, consistent practices create big changes. Find tools that feel sustainable and joyful for you."
    >
      <div className="grid gap-4 pt-2 sm:grid-cols-2 sm:gap-6 sm:pt-6 lg:grid-cols-3 lg:gap-y-14">
        {WELLNESS.map((w) => (
          <article
            key={w.title}
            className="flex flex-col gap-1 rounded-[20px] bg-white p-6 sm:p-8"
            style={{ border: `1px solid ${C.line}` }}
          >
            <div className="relative h-36 w-full overflow-hidden rounded-t-[20px]">
              <Image
                src={`${IMG}${w.image}.webp`}
                alt={w.alt}
                fill
                sizes="(min-width: 1024px) 328px, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <h3 className="pt-3 text-lg font-bold" style={{ color: C.brand }}>
              {w.title}
            </h3>
            <p className="pb-6 pt-2 text-sm leading-6" style={{ color: C.muted }}>
              <strong>{w.lead}</strong> {w.body}
            </p>
            <a
              href={w.href}
              {...externalProps(w.href)}
              className="mt-auto rounded-xl px-5 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: C.brand }}
            >
              {w.action}
            </a>
          </article>
        ))}
      </div>
    </Section>
  );
}
