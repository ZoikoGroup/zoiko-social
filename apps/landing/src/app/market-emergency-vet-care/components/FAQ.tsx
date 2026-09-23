"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { C } from "./theme";

const FAQS: readonly { q: string; a: string }[] = [
  {
    q: "How do I use this marketplace?",
    a: "Enter a location and your pet’s species, then narrow the results with the filters. Each listing shows the facility’s hours, services, and phone number so you can contact them directly.",
  },
  {
    q: "What does “Verified” mean?",
    a: "The facility’s identity and professional credentials have been checked before it was listed. Verification is not a guarantee of availability or of the care you’ll receive.",
  },
  {
    q: "Can I book an appointment here?",
    a: "No. Zoiko Social helps you find emergency care options, but appointments and admissions are handled by each facility. Call them directly using the number on the listing.",
  },
  {
    q: "Is this an emergency dispatch service?",
    a: "No. This is a discovery tool, not an emergency response service. In a life-threatening situation, call the nearest emergency clinic or go there directly.",
  },
  {
    q: "How often is information updated?",
    a: "Facilities update their own details, and listings are reviewed regularly. Hours and availability can change without notice, so always confirm with the facility before you travel.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-4 py-16 sm:px-8 sm:py-20 lg:px-16" style={{ background: C.panel }}>
      <div className="mx-auto max-w-[800px]">
        <h2 className="text-center text-2xl font-extrabold leading-9 sm:text-3xl" style={{ color: C.ink }}>
          Frequently asked questions
        </h2>
        <div className="mt-10 flex flex-col gap-4">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="rounded-xl bg-white" style={{ border: `1px solid ${C.line}` }}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex min-h-[68px] w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-bold"
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
                  <p id={`faq-${i}`} className="px-6 pb-5 text-sm leading-6" style={{ color: C.muted }}>
                    {f.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
