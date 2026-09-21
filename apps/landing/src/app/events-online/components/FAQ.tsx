"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { C } from "./theme";

const FAQS: readonly { q: string; a: string }[] = [
  {
    q: "Who hosts online events on Zoiko Social?",
    a: "Verified organizations, verified professionals, and verified communities. Each event card shows exactly which signal the host holds, so you can see who is behind a session before you RSVP.",
  },
  {
    q: "What is a given event about?",
    a: "Every event page lists its topic, organizer, agenda, and who it is for. If an event covers medical or veterinary topics, it is general education — not individualized advice for your animal.",
  },
  {
    q: "When does it start in my time zone?",
    a: "Times are shown in your local time first, with UTC alongside so there is no ambiguity when sharing with people in other regions.",
  },
  {
    q: "How do I attend?",
    a: "RSVP from the event card. You'll get a join link and a reminder before the start time. Live sessions show a Join now button once they begin.",
  },
  {
    q: "Is it free, paid, or fundraising?",
    a: "Each card states Free, the ticket price, or Donation-backed. Fundraisers show beneficiary verification, fees, and refund policy before you give anything.",
  },
  {
    q: "What language and accessibility options are confirmed?",
    a: "Captions and transcripts appear as tags on the card only when the organizer has confirmed them. If a tag isn't shown, don't assume it's available.",
  },
  {
    q: "Is an event live, upcoming, canceled, or available as a replay?",
    a: "The status badge on each card tells you: Starting soon, Live now, Full, Rescheduled, Canceled, or Ended with a replay. Rescheduled events show both the new and the previous time.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="pb-16 pt-12 sm:pb-20 sm:pt-16">
      <h2 className="text-xl font-extrabold leading-8" style={{ color: C.ink }}>
        Frequently asked questions
      </h2>

      <div className="mt-6 flex flex-col gap-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={f.q}
              className="rounded-2xl bg-white"
              style={{ border: `1px solid ${C.line}` }}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-bold"
                style={{ color: C.inkDeep }}
              >
                {f.q}
                <Plus
                  size={16}
                  strokeWidth={2.5}
                  className={`shrink-0 transition-transform ${isOpen ? "rotate-45" : ""}`}
                  style={{ color: C.brand }}
                />
              </button>
              {isOpen && (
                <p
                  id={`faq-${i}`}
                  className="px-5 pb-4 text-sm leading-6"
                  style={{ color: C.muted }}
                >
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
