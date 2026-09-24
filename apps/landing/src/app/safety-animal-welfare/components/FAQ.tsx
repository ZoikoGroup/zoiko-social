"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { FAQS } from "./content";
import { C } from "./theme";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-4 py-16 sm:px-8 sm:py-20 lg:px-16" style={{ background: C.panel }}>
      <div className="mx-auto max-w-[800px]">
        <h2 className="text-center text-2xl font-extrabold leading-9 sm:text-3xl sm:leading-[51.2px]" style={{ color: C.ink }}>
          Frequently asked questions
        </h2>
        <div className="mt-8 flex flex-col gap-4 sm:mt-12">
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
