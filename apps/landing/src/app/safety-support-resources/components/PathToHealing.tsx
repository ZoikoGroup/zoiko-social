import Image from "next/image";
import Section from "./Section";
import { IMG, PATHS } from "./content";
import { C } from "./theme";

export default function PathToHealing() {
  return (
    <Section
      tinted
      title="Find your path to healing"
      intro="Different people heal differently. Explore the support types that resonate with you, or combine multiple approaches for a personalized recovery plan."
    >
      {/* Two up even on phones: four full-width photo cards made a very long stack. */}
      <div className="grid grid-cols-2 gap-3 pt-2 sm:gap-6 sm:pt-6 lg:grid-cols-4">
        {PATHS.map((p) => (
          <div
            key={p.title}
            className="flex flex-col items-center gap-1 rounded-[20px] bg-white p-3 text-center sm:p-8"
            style={{ border: `2px solid ${C.line}` }}
          >
            <div className="relative h-28 w-full overflow-hidden rounded-t-2xl sm:h-44 sm:rounded-t-[20px]">
              <Image
                src={`${IMG}${p.image}.webp`}
                alt={p.alt}
                fill
                sizes="(min-width: 1024px) 222px, 50vw"
                className="object-cover"
              />
            </div>
            <h3 className="pt-3 text-base font-bold sm:text-lg" style={{ color: C.brand }}>
              {p.title}
            </h3>
            <p className="max-w-[260px] pt-1 text-xs leading-5 sm:pt-2 sm:text-sm sm:leading-6" style={{ color: C.muted }}>
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
