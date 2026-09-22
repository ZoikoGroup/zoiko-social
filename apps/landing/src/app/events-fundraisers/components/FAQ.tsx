"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { C } from "./theme";

const FAQS: readonly { q: string; a: string }[] = [
  {
    q: "What is a verified animal fundraiser?",
    a: "A fundraiser for a rescue, shelter, or animal-welfare organization that shows clear beneficiary information and organizer identity. Each verification signal — organization, organizer, beneficiary — is shown separately, never collapsed into one “trusted” badge.",
  },
  {
    q: "How does fundraiser verification work?",
    a: "Organizations, organizers, and beneficiaries are each checked under an approved process, and the campaign itself must pass current product, safety, and financial eligibility checks before it goes live.",
  },
  {
    q: "How are donations and contributions tracked?",
    a: "Where transparent tracking is supported, Zoiko Social displays authorized transaction and progress state with defined semantics — pledged, paid, settled, disbursed, and refunded funds are never conflated. Some fundraisers don’t publicly disclose their figures.",
  },
  {
    q: "How do I report a concern?",
    a: "Use the route that fits: a fundraiser concern (misleading claims, impersonation), a payment or contribution issue, or an animal-welfare concern. Each goes through private review — reports are never shown publicly.",
  },
  {
    q: "Are contributions tax deductible?",
    a: "It depends on the specific beneficiary entity and your jurisdiction. Zoiko Social does not claim tax deductibility unless a fundraiser’s own disclosure explicitly and authoritatively supports it.",
  },
  {
    q: "What happens if a fundraiser is paused or closed?",
    a: "While a fundraiser is under review, contributions are temporarily unavailable. Closed fundraisers show their outcome, and if a fundraiser is canceled, contributions are refunded.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="pb-20 pt-16">
      <h2 className="text-xl font-extrabold leading-8 sm:text-2xl" style={{ color: C.inkDeep }}>
        Frequently asked questions
      </h2>
      <div className="mt-6 flex flex-col gap-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="rounded-2xl bg-white" style={{ border: `1px solid ${C.line}` }}>
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
