"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { C } from "./theme";

const FAQS: readonly { q: string; a: string }[] = [
  {
    q: "What counts as a Rescue Event?",
    a: "Adoption days, rescue drives, shelter gatherings, and foster-support events hosted by verified rescue organizations.",
  },
  {
    q: "Can I adopt an animal directly at one of these events?",
    a: "Events tagged “Adoptable animals present” let you meet animals in person. Each rescue runs its own adoption process, so an event is where you start — not always where an adoption is finalized.",
  },
  {
    q: "What does “verified rescue relationship” mean?",
    a: "It confirms the relationship between the event and the rescue or beneficiary it supports. It’s a separate signal from organizer identity — never merged into one badge.",
  },
  {
    q: "Why don’t I see the exact address?",
    a: "Exact details are shown only according to the event’s approved visibility rules — sometimes only after RSVP. Rescues and foster homes are never exposed publicly.",
  },
  {
    q: "Can I bring my own pet?",
    a: "Check each event’s animal-presence tag. Adoptable and demo animals follow welfare-first handling and environment conditions set by the organizer, so bring your own pet only when the event says it’s allowed.",
  },
  {
    q: "What if an event is postponed or canceled?",
    a: "Changes are shown on the event listing, and everyone who RSVP’d is notified. Updated events carry an “Updated” label.",
  },
  {
    q: "Is donating at one of these events required?",
    a: "No. Some events include an authorized fundraiser, shown as its own separate label — but attending never requires a donation.",
  },
  {
    q: "How do I report a concern about a rescue event?",
    a: "Reporting is available on every listing — content, animal-welfare, and organizer concerns route to the right team. Use “Report a concern” in the Trust & safety section above.",
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
