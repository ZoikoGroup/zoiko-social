import Image from "next/image";
import Section from "./Section";
import { IMG, WHY_IT_MATTERS } from "./content";
import { C } from "./theme";

export default function WhyItMatters() {
  return (
    <Section
      title="Why animal welfare reporting matters"
      intro="Animal welfare concerns require specialist attention and careful handling. Your report provides valuable information that helps protect vulnerable animals."
    >
      <div className="grid gap-8 pt-4 sm:grid-cols-3 sm:pt-6">
        {WHY_IT_MATTERS.map((w) => (
          <div key={w.title} className="flex flex-col items-center gap-3 text-center sm:gap-4">
            <Image src={`${IMG}${w.icon}`} alt="" width={40} height={36} className="h-9 w-auto" />
            <h3 className="text-base font-bold" style={{ color: C.brand }}>
              {w.title}
            </h3>
            <p className="max-w-[360px] text-sm leading-6" style={{ color: C.muted }}>
              {w.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
