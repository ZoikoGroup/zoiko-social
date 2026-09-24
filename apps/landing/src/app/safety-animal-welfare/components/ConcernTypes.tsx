"use client";

import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import Section from "./Section";
import { CONCERN_TYPES, REPORT_URL } from "./content";
import { C } from "./theme";

const DESKTOP = "(min-width: 640px)";

export default function ConcernTypes() {
  // Cards open expanded from sm up, as the design shows them, but start
  // collapsed on phones, where six full lists run to a very long scroll. Until
  // a card is toggled, CSS alone picks that default, so nothing flashes open
  // and shut on load; a toggle then records an explicit choice for that card.
  const [choice, setChoice] = useState<Record<string, boolean>>({});
  const [desktop, setDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const toggle = (title: string) => {
    const current = choice[title] ?? desktop ?? window.matchMedia(DESKTOP).matches;
    setChoice({ ...choice, [title]: !current });
  };

  return (
    <Section
      id="concern-types"
      title="Types of animal welfare concerns"
      intro="Click on each concern type to learn more about what to report and how to report safely."
    >
      <div className="grid gap-4 pt-2 sm:grid-cols-2 sm:gap-6 sm:pt-6 lg:grid-cols-3 xl:grid-cols-4">
        {CONCERN_TYPES.map((t, i) => {
          const chosen = choice[t.title];
          // Explicit choice wins; otherwise the breakpoint default via CSS.
          const listClass = chosen === undefined ? "hidden sm:block" : chosen ? "block" : "hidden";
          const plusClass = chosen === undefined ? "sm:hidden" : chosen ? "hidden" : "";
          const minusClass = chosen === undefined ? "hidden sm:block" : chosen ? "" : "hidden";
          return (
            <article
              key={t.title}
              className="flex flex-col gap-4 rounded-[20px] bg-white px-6 pb-4 pt-2 shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)] xl:min-h-96"
              style={{ border: `1px solid ${C.line}` }}
            >
              <button
                type="button"
                aria-expanded={chosen ?? desktop ?? undefined}
                aria-controls={`concern-${i}`}
                onClick={() => toggle(t.title)}
                className="flex min-h-14 items-center justify-between gap-3 text-left text-base font-bold"
                style={{ color: C.brand }}
              >
                {t.title}
                <Plus size={18} aria-hidden className={`shrink-0 ${plusClass}`} />
                <Minus size={18} aria-hidden className={`shrink-0 ${minusClass}`} />
              </button>
              <p className="text-base leading-6 text-black">{t.summary}</p>
              <ul id={`concern-${i}`} className={`list-disc pl-5 text-sm leading-6 ${listClass}`} style={{ color: C.muted }}>
                {t.examples.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
              <a
                href={REPORT_URL}
                className="mt-auto rounded-xl px-5 py-3 text-center text-sm font-bold text-white transition hover:opacity-90"
                style={{ background: C.brand }}
              >
                Report
              </a>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
