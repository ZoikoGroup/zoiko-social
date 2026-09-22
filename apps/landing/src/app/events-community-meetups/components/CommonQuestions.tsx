"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { C } from "./theme";

const FAQS: readonly { q: string; a: string }[] = [
  {
    q: "What is a Community Meetup?",
    a: "A casual, community-centered gathering built around animals, shared interests, and responsible participation — like a group dog walk, a new-owner support circle, or a birdwatching outing. Meetups are hosted by organizations, communities, or independent community members.",
  },
  {
    q: "Can I bring my pet?",
    a: "Check the animal-attendance tag on each meetup: “Animals welcome”, “Animals optional”, or “People-only”. Organizers state species, handling, environment, and safety requirements — never assume from event photos.",
  },
  {
    q: "Why don’t I see the exact address?",
    a: "Exact details are shown only according to the event’s approved visibility rules. Some meetups list a public venue, some show only an approximate area, and some share the location only after RSVP or organizer approval.",
  },
  {
    q: "What does “RSVP pending” mean?",
    a: "Some meetups need the organizer’s approval before you can attend — these show “Request to Join” instead of RSVP. Your request stays pending until the organizer reviews it, and you’ll be notified either way.",
  },
  {
    q: "What happens if a meetup is full?",
    a: "Full meetups show “Join Waitlist”. If a spot opens up, people on the waitlist are offered it in order.",
  },
  {
    q: "Are children allowed?",
    a: "Age policy is set by the organizer and shown on every meetup: “All ages”, “Adults only”, or “Guardian required”. It is never inferred from a meetup’s title or description.",
  },
  {
    q: "Does an organizer being “verified” mean the meetup is safe?",
    a: "No. Verification confirms who the organizer is — it isn’t a guarantee about the meetup itself. Organizer identity, community affiliation, professional status, and sponsorship are shown as separate signals, never merged into one “verified” badge.",
  },
  {
    q: "How do I report a concern about a meetup?",
    a: "Reporting is available from every meetup, whether you’re attending or just browsing. Use “Report a concern” in the Trust & participation section above.",
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
                <Plus
                  size={16}
                  strokeWidth={2.5}
                  className={`shrink-0 transition-transform ${isOpen ? "rotate-45" : ""}`}
                  style={{ color: C.brand }}
                />
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
