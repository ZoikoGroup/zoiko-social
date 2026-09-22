"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { C } from "./theme";

const FAQS: readonly { q: string; a: string }[] = [
  {
    q: "What kinds of workshops are offered?",
    a: "Educational sessions and demonstrations across behavior and training, care education, grooming and handling, rescue and foster skills, enrichment, community safety, professional education, and first-aid awareness.",
  },
  {
    q: "Does attending a workshop give me a certification?",
    a: "No. Attendance or completion does not by itself grant a license, certification or professional competency.",
  },
  {
    q: "What does “instructor verified” mean?",
    a: "It confirms approved identity and scope information — never a guarantee of teaching quality or outcome.",
  },
  {
    q: "Can I bring my pet to a hands-on session?",
    a: "Only if the workshop allows attendee animals. Hands-on participation is limited by event safety, animal-welfare, age and professional-scope rules — never assumed from a workshop’s title.",
  },
  {
    q: "Is this a substitute for veterinary care?",
    a: "No. Health and first-aid sessions cover general awareness and prevention — never diagnosis, prescribing, or a substitute for veterinary care.",
  },
  {
    q: "What if a workshop is full?",
    a: "Full workshops show “Join Waitlist”. You can join the waitlist and be offered a spot if one opens up.",
  },
  {
    q: "Can I host a workshop?",
    a: "Professionals and organizations can host a workshop with clear learning outcomes and welfare-first participation rules. Professional verification is reviewed separately from event publishing.",
  },
  {
    q: "How do I report a concern about a workshop?",
    a: "Reporting is available on every workshop — content, animal-welfare, and professional-scope concerns route to the right team. Use “Report a concern” in the Trust & safety section above.",
  },
];

export default function CommonQuestions() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="pb-20 pt-16">
      <h2 className="text-center text-2xl font-extrabold sm:text-3xl" style={{ color: C.ink }}>
        Common questions
      </h2>
      <div className="mx-auto flex max-w-[760px] flex-col gap-3 pt-8">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="rounded-xl bg-white" style={{ border: `1px solid ${C.line}` }}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-bold"
                style={{ color: C.ink }}
              >
                {f.q}
                <span
                  className="flex size-6 shrink-0 items-center justify-center rounded-md"
                  style={{ background: C.chip, color: C.inkDeep }}
                >
                  <Plus size={14} strokeWidth={2.5} className={`transition-transform ${isOpen ? "rotate-45" : ""}`} />
                </span>
              </button>
              {isOpen && (
                <p id={`faq-${i}`} className="px-5 pb-4 text-sm leading-6" style={{ color: C.muted }}>
                  {f.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
