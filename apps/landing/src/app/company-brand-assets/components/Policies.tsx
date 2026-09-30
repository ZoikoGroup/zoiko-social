"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import Section from "./Section";
import { BRAND_EMAIL, CONTACT_BRAND, FAQS, IMG, RIGHTS, TRADEMARK_POLICY } from "./content";
import { C } from "./theme";

const LINK = "font-semibold underline underline-offset-2";

export function Rights() {
  return (
    <Section tinted title="Rights and permissions" intro="Understanding how to use Zoiko Social brand assets appropriately and legally.">
      <div className="grid gap-4 pt-2 sm:gap-6 sm:pt-7 md:grid-cols-3">
        {RIGHTS.map((r) => (
          <div key={r.title} className="rounded-[20px] p-6" style={{ background: C.chip, border: `1px solid ${C.brand}` }}>
            <h3 className="pb-2 text-base font-bold" style={{ color: C.brand, borderBottom: `1px solid ${C.line}` }}>
              {r.title}
            </h3>
            <p className="pt-2 text-sm leading-6" style={{ color: C.muted }}>
              {r.body}
            </p>
          </div>
        ))}
      </div>
      <div className="rounded-[20px] bg-white p-6 sm:px-8 sm:pb-12 sm:pt-8" style={{ border: `1px solid ${C.line}` }}>
        <h3 className="pb-2 text-base font-bold" style={{ color: C.ink }}>
          Questions about brand use?
        </h3>
        <p className="text-base leading-7" style={{ color: C.muted }}>
          Review our{" "}
          <a href={TRADEMARK_POLICY} className={LINK} style={{ color: C.brand }}>
            trademark policy
          </a>
          , or contact us at{" "}
          <a href={CONTACT_BRAND} className={`${LINK} break-all`} style={{ color: C.brand }}>
            {BRAND_EMAIL}
          </a>{" "}
          for specific use cases.
        </p>
      </div>
    </Section>
  );
}

function Disclosure({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="overflow-hidden rounded-[20px] bg-white" style={{ border: `1px solid ${C.line}` }}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left text-base font-semibold"
        style={{ color: C.ink }}
      >
        {title}
        <span aria-hidden className="shrink-0 text-lg" style={{ color: C.brand }}>
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open && (
        <div className="px-6 py-6 text-sm leading-6" style={{ background: C.panel, color: C.muted }}>
          {children}
        </div>
      )}
    </div>
  );
}

export function Changelog() {
  return (
    <Section title="Version and changelog" intro="Current brand asset version and historical updates.">
      <div className="flex flex-col gap-4 pt-2 sm:pt-7">
        <div className="rounded-[20px] p-6" style={{ background: C.chip, border: `1px solid ${C.brand}` }}>
          <p className="font-bold" style={{ color: C.brand }}>
            Current Version: 1.0
          </p>
          <p className="pt-1 text-base" style={{ color: C.muted }}>
            Published September 25, 2026
          </p>
        </div>
        <Disclosure title="v1.0 — Brand System Launch (September 2026)" defaultOpen>
          Initial release: primary logo system, teal/orange color palette, Plus Jakarta Sans typography, media kit, usage
          guidelines, and asset library.
        </Disclosure>
        <Disclosure title="Previous versions">No earlier versions — v1.0 is the first published release.</Disclosure>
      </div>
    </Section>
  );
}

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="px-4 py-16 sm:px-8 sm:py-20 lg:px-16" style={{ background: C.panel }}>
      <div className="mx-auto max-w-[800px]">
        <h2 className="text-center text-2xl font-extrabold leading-9 sm:text-3xl" style={{ color: C.ink }}>
          Frequently asked questions
        </h2>
        <div className="mt-8 flex flex-col gap-4 sm:mt-12">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="rounded-2xl bg-white" style={{ border: `1px solid ${C.line}` }}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex min-h-[68px] w-full items-center justify-between gap-4 px-6 py-4 text-left text-[15px] font-bold"
                  style={{ color: C.ink }}
                >
                  {f.q}
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md" style={{ background: C.chip }}>
                    <Plus size={14} strokeWidth={2.5} className={`transition-transform ${isOpen ? "rotate-45" : ""}`} style={{ color: C.ink }} />
                  </span>
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

export function CTA() {
  return (
    <section className="bg-white px-4 py-12 sm:px-8 lg:px-16 xl:px-28">
      <div className="relative mx-auto max-w-[1230px] overflow-hidden rounded-3xl">
        <Image src={`${IMG}cta.webp`} alt="" fill sizes="(min-width: 1280px) 1230px, 100vw" className="object-cover" />
        {/* The photo ships with its overlay; this wash keeps the copy readable where phones crop into its lighter right side. */}
        <div className="absolute inset-0 bg-[rgba(8,51,68,0.4)] md:bg-transparent" />
        <div className="relative flex flex-col items-center gap-4 px-6 py-12 text-center sm:px-12 md:min-h-[370px] md:justify-center">
          <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-4xl">Need help with brand usage?</h2>
          <p className="max-w-[460px] text-base leading-7 text-white/90">
            Visit our press center for media inquiries, or contact our partnerships team for business collaboration.
          </p>
          <a
            href={CONTACT_BRAND}
            className="mt-4 rounded-xl bg-white px-10 py-4 text-sm font-semibold transition hover:bg-neutral-50"
            style={{ color: C.brand }}
          >
            Contact Brand Team
          </a>
        </div>
      </div>
    </section>
  );
}
