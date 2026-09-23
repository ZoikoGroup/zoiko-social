"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { C } from "./theme";

const FAQS: readonly { q: string; a: string }[] = [
  {
    q: "Are all products verified?",
    a: "Products are listed only from authorized sellers and manufacturers. Each listing shows its source so you can see where the product information comes from.",
  },
  {
    q: "Can I trust the product information?",
    a: "Species, life stage, ingredients, and warnings come from official manufacturer or seller sources. Zoiko Social does not add health claims to product listings.",
  },
  {
    q: "What if my pet has allergies?",
    a: "Check the full ingredient list on each product and talk to your veterinarian before switching foods or adding supplements. Product listings are not a substitute for veterinary advice.",
  },
  {
    q: "Are these prescription diets?",
    a: "No. This page covers everyday food, treats, and care supplies. Prescription and therapeutic diets should only be used under the direction of a veterinarian.",
  },
  {
    q: "How do I report a product issue?",
    a: "Use the report option on the product listing to flag inaccurate information, a safety concern, or a recall. Reports go through private review and are never shown publicly.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-white px-4 py-16 sm:px-8 sm:py-20 lg:px-16 xl:px-28">
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
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-sm font-bold"
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
