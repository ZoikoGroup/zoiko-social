"use client";

import { useState } from "react";
import Image from "next/image";
import Section from "./Section";
import { APPROACH_ICONS, IMG, PSYCHOLOGY_TODAY, THERAPY_TABS } from "./content";
import { C } from "./theme";

export default function ProfessionalCare() {
  const [active, setActive] = useState(0);
  const tab = THERAPY_TABS[active];

  return (
    <Section
      id="professional-care"
      title="Professional mental health care"
      intro="Licensed therapists and counselors can help you process emotions, develop coping skills, and work through challenges. Here’s what to expect."
    >
      <div role="tablist" aria-label="Types of therapy" className="grid grid-cols-2 gap-3 pt-2 sm:flex sm:flex-wrap sm:gap-4 sm:pt-4">
        {THERAPY_TABS.map((t, i) => {
          const on = i === active;
          return (
            <button
              key={t.label}
              type="button"
              role="tab"
              id={`therapy-tab-${i}`}
              aria-selected={on}
              aria-controls="therapy-panel"
              onClick={() => setActive(i)}
              className="rounded-[20px] px-4 py-3 text-sm font-semibold transition sm:min-w-[184px] sm:px-6 sm:py-4 sm:text-left sm:text-base"
              style={{ background: on ? C.brand : "#fff", color: on ? "#fff" : C.ink, border: `2px solid ${on ? C.brand : C.line}` }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div
        id="therapy-panel"
        role="tabpanel"
        aria-labelledby={`therapy-tab-${active}`}
        className="grid gap-4 sm:gap-6 md:grid-cols-3"
      >
        {tab.approaches.map((a, i) => (
          <div
            key={a.title}
            className="flex flex-col gap-3 rounded-[20px] bg-white p-6 lg:p-8"
            style={{ border: `1px solid ${C.line}` }}
          >
            <Image src={`${IMG}${APPROACH_ICONS[i]}.webp`} alt="" width={36} height={36} className="size-9" />
            <h3 className="text-lg font-bold" style={{ color: C.brand }}>
              {a.title}
            </h3>
            <p className="pb-1 text-sm leading-6" style={{ color: C.muted }}>
              {a.body}
            </p>
            <a
              href={PSYCHOLOGY_TODAY}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto rounded-xl px-5 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: C.brand }}
            >
              {a.action}
            </a>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-[20px] p-5 sm:p-6" style={{ background: C.warmFill, border: `2px solid ${C.warm}` }}>
        <h3 className="text-lg font-bold" style={{ color: C.warm }}>
          What happens in your first session?
        </h3>
        <p className="text-base leading-7" style={{ color: C.muted }}>
          Your therapist will ask about your history, current challenges, and goals. They’ll explain their approach and
          discuss confidentiality (it’s protected, except in immediate safety situations). You’ll set goals together.
          It’s collaborative—your therapist works WITH you, not at you.
        </p>
      </div>
    </Section>
  );
}
