"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BadgeCheck, X } from "lucide-react";
import { APP_LINKS, appUrl } from "@/lib/app-links";
import type { Fundraiser } from "./fundraisers";
import { C } from "./theme";

const AMOUNTS = ["$25", "$50", "$100", "Custom"] as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase leading-4 tracking-tight" style={{ color: C.muted }}>
      {children}
    </p>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center gap-[3px] rounded-md px-1.5 py-0.5 text-[9.5px] font-bold leading-4"
      style={{ background: C.chip, color: C.inkDeep }}
    >
      <BadgeCheck size={9} strokeWidth={2.5} />
      {label}
    </span>
  );
}

function Party({ role, name, badge }: { role: string; name: string; badge: string }) {
  return (
    <p className="flex flex-wrap items-center gap-1.5 text-xs leading-4">
      <span className="min-w-16 pr-1 font-semibold" style={{ color: C.muted }}>
        {role}
      </span>
      <span className="font-bold" style={{ color: C.ink }}>
        {name}
      </span>
      <Badge label={badge} />
    </p>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-px rounded-[10px] px-2.5 py-2" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
      <span className="text-xs font-semibold uppercase leading-4" style={{ color: C.muted }}>
        {label}
      </span>
      <span className="text-sm font-bold leading-5" style={{ color: C.ink }}>
        {value}
      </span>
    </div>
  );
}

export default function FundraiserModal({ f, onClose }: { f: Fundraiser; onClose: () => void }) {
  const [amount, setAmount] = useState<string | null>(null);
  const [showName, setShowName] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Contributions are only possible while a fundraiser is open.
  const open = f.status === "live" || f.status === "goal-reached";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  const figures: [string, string][] = [];
  if (f.goal) figures.push(["Goal", f.goal]);
  if (f.contributed) figures.push(["Contributed", f.contributed]);
  if (f.breakdown) {
    figures.push(
      ["Pending", f.breakdown.pending],
      ["Settled", f.breakdown.settled],
      ["Disbursed", f.breakdown.disbursed],
      ["Refunded", f.breakdown.refunded],
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0" style={{ background: "rgba(6, 47, 57, 0.5)" }} onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="fundraiser-title"
        className="relative flex max-h-[92dvh] w-full max-w-[640px] overscroll-contain sm:max-h-[90vh] flex-col overflow-y-auto rounded-3xl bg-white shadow-[0px_16px_40px_0px_rgba(7,59,71,0.12)]"
      >
        <div className="relative aspect-[625/352] w-full shrink-0 bg-gradient-to-br from-cyan-800 to-orange-500">
          <Image src={f.image} alt={f.imageAlt} fill sizes="(min-width: 640px) 640px, 100vw" className="object-cover" />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90 transition hover:bg-white"
            style={{ color: C.inkDeep }}
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-5 pb-7 pt-5 sm:px-6">
          <h2 id="fundraiser-title" className="text-lg font-extrabold leading-7" style={{ color: C.ink }}>
            {f.title}
          </h2>

          <div className="flex flex-col gap-2">
            <SectionLabel>Beneficiary &amp; organizer</SectionLabel>
            <div className="flex flex-col gap-1.5 rounded-xl px-3.5 py-3" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
              <Party role="Beneficiary" name={f.beneficiary} badge="Verified Beneficiary" />
              <Party role="Organizer" name={f.organizer ?? f.beneficiary} badge="Verified Organizer" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <SectionLabel>Purpose</SectionLabel>
            <p className="text-sm leading-5" style={{ color: C.ink }}>
              {f.blurb}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <SectionLabel>Financial transparency</SectionLabel>
            {figures.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                  {figures.map(([label, value]) => (
                    <Figure key={label} label={label} value={value} />
                  ))}
                </div>
                <p className="text-xs leading-4" style={{ color: C.muted }}>
                  Each figure has its own definition and freshness — none imply
                  the beneficiary has received the funds unless labeled
                  Disbursed.
                </p>
              </>
            ) : (
              <p className="text-xs italic leading-4" style={{ color: C.muted }}>
                Financial details not publicly disclosed for this fundraiser.
              </p>
            )}
          </div>

          {open && (
            <div className="flex flex-col gap-2">
              <SectionLabel>Contribute</SectionLabel>
              <div role="group" aria-label="Contribution amount" className="flex flex-wrap gap-2">
                {AMOUNTS.map((a) => {
                  const on = amount === a;
                  return (
                    <button
                      key={a}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setAmount(on ? null : a)}
                      className="rounded-[10px] px-4 py-2 text-xs font-bold transition"
                      style={
                        on
                          ? { background: C.brand, color: "#fff", border: `1px solid ${C.brand}` }
                          : { background: "#fff", color: "#000", border: `1px solid ${C.line}` }
                      }
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
              <label className="flex cursor-pointer items-center gap-2 pt-0.5 text-xs leading-5" style={{ color: C.ink }}>
                <input
                  type="checkbox"
                  checked={showName}
                  onChange={(e) => setShowName(e.target.checked)}
                  className="size-3 accent-[#066879]"
                />
                Display my name publicly with this contribution (off by default)
              </label>
              <p className="rounded-[10px] px-3 py-2.5 text-xs leading-5" style={{ background: C.panel, color: C.muted, border: `1px solid ${C.line}` }}>
                Beneficiary, purpose, and currency are shown above. Fee and tax
                treatment vary by region and entity — see this fundraiser&apos;s
                own disclosure for specifics. No hidden mandatory charges.
              </p>
              <div>
                <a
                  href={APP_LINKS.signUp}
                  className="inline-block rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ background: C.brand }}
                >
                  Contribute
                </a>
              </div>
            </div>
          )}

          {f.update && (
            <div className="flex flex-col gap-2">
              <SectionLabel>Updates</SectionLabel>
              <p className="text-xs leading-5" style={{ color: C.muted }}>
                {f.update}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-4 text-xs font-semibold underline">
            <a href={APP_LINKS.safety} style={{ color: C.muted }}>
              Report a fundraiser concern
            </a>
            <a href={appUrl("/settings")} style={{ color: C.muted }}>
              Payment issue
            </a>
            <a href={APP_LINKS.safety} style={{ color: "#B42318" }}>
              Animal-welfare concern
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
