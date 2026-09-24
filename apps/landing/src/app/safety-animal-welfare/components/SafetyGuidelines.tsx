import Image from "next/image";
import Section from "./Section";
import { IMG, NEVER_DO, SAFE_WAYS } from "./content";
import { C } from "./theme";

function List({ items, mark, color }: { items: readonly string[]; mark: string; color: string }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((s) => (
        <li key={s} className="relative pl-6 text-sm leading-6" style={{ color: C.ink }}>
          <span className="absolute left-0 top-0 font-bold" style={{ color }} aria-hidden>
            {mark}
          </span>
          {s}
        </li>
      ))}
    </ul>
  );
}

export default function SafetyGuidelines() {
  return (
    <>
      <div className="bg-white px-4 pt-6 sm:px-8 lg:px-16 xl:px-28">
        <figure className="mx-auto max-w-[1280px] overflow-hidden rounded-3xl">
          <div className="relative aspect-[4/3] w-full sm:aspect-[1230/410]">
            <Image
              src={`${IMG}volunteers.webp`}
              alt="Two volunteers in blue T-shirts petting a smiling dog"
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption
            className="p-4 text-xs"
            style={{ color: C.muted, background: "#F8FAFB", border: `1px solid ${C.line}`, borderTop: 0 }}
          >
            Animal welfare professionals help identify and respond to a wide range of welfare concerns
          </figcaption>
        </figure>
      </div>
      <Section
        title="Reporter safety guidelines"
        intro="Your safety matters. Follow these guidelines when reporting or documenting animal welfare concerns."
      >
        <div className="grid gap-4 pt-2 sm:gap-8 sm:pt-6 md:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-[20px] bg-white p-6 sm:px-8 sm:pb-11 sm:pt-8" style={{ border: `1px solid ${C.line}` }}>
            <h3 className="text-base font-bold" style={{ color: C.brand }}>
              Safe ways to help
            </h3>
            <List items={SAFE_WAYS} mark="✓" color={C.warm} />
          </div>
          <div
            className="flex flex-col gap-4 rounded-[20px] p-6 sm:px-8 sm:pb-11 sm:pt-8"
            style={{ background: C.greyFill, border: `1px solid ${C.greyLine}` }}
          >
            <h3 className="text-base font-bold" style={{ color: C.danger }}>
              Never do this
            </h3>
            <List items={NEVER_DO} mark="✕" color={C.danger} />
          </div>
        </div>
      </Section>
    </>
  );
}
