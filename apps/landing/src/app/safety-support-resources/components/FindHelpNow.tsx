import Image from "next/image";
import Section from "./Section";
import { HELP_NOW, IMG, externalProps } from "./content";
import { C } from "./theme";

export default function FindHelpNow() {
  return (
    <Section
      id="find-help-now"
      title="Find help right now"
      intro="Ready to start? Here are quick ways to connect with support today—no long waits required."
    >
      <div className="grid grid-cols-1 gap-3 pt-2 min-[360px]:grid-cols-2 sm:gap-6 sm:pt-6 lg:grid-cols-4">
        {HELP_NOW.map((h) => (
          <a
            key={h.title}
            href={h.href}
            {...externalProps(h.href)}
            className="flex flex-col items-center gap-2 rounded-[20px] bg-white px-4 py-6 text-center transition hover:shadow-[0px_8px_24px_0px_rgba(7,59,71,0.10)] sm:px-6 sm:py-7"
            style={{ border: `1px solid ${C.line}` }}
          >
            <Image src={`${IMG}${h.icon}.webp`} alt="" width={36} height={36} className="size-9" />
            <h3 className="pt-2 text-base font-bold sm:text-lg" style={{ color: C.brand }}>
              {h.title}
            </h3>
            <p className="max-w-[240px] text-sm leading-[21px]" style={{ color: C.muted }}>
              {h.body}
            </p>
          </a>
        ))}
      </div>
    </Section>
  );
}
