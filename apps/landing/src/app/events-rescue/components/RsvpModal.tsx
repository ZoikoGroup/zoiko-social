"use client";

import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import type { RescueEvent } from "./rescueEvents";
import { C } from "./theme";

const PARTY_SIZES = ["Just me", "2 people", "3 people", "4 people"] as const;

/** Rules → details → confirmation, as three steps of one popup. */
type Step = 1 | 2 | 3;

const PRIMARY =
  "flex-1 rounded-xl px-6 py-3 text-center text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";

export default function RsvpModal({ e, onClose }: { e: RescueEvent; onClose: () => void }) {
  const [step, setStep] = useState<Step>(1);
  const [agreed, setAgreed] = useState(false);
  const [party, setParty] = useState<string>(PARTY_SIZES[0]);
  const [bringingPet, setBringingPet] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => ev.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  const rsvp = e.rsvp!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0" style={{ background: "rgba(3, 31, 37, 0.4)" }} onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rsvp-title"
        className="relative flex max-h-[92dvh] w-full max-w-[520px] flex-col overflow-hidden rounded-3xl bg-white shadow-[0px_20px_48px_0px_rgba(7,59,71,0.16)] sm:max-h-[774px]"
      >
        <div className="flex shrink-0 items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${C.line}` }}>
          <h2 id="rsvp-title" className="text-base font-extrabold leading-6" style={{ color: C.ink }}>
            RSVP
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 items-center justify-center rounded-lg bg-[#F0F0F0] outline-2 -outline-offset-2 outline-black transition hover:bg-neutral-200 focus:outline"
            style={{ color: C.muted }}
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex flex-col gap-6 overflow-y-auto overscroll-contain p-6">
          <div className="h-[5px] overflow-hidden rounded-full" style={{ background: C.panel }}>
            <div
              className="h-full rounded-full transition-[width] duration-300"
              style={{ width: `${(step / 3) * 100}%`, background: C.brand }}
            />
          </div>

          {step === 1 && (
            <div className="flex flex-col gap-[5px]">
              <h3 className="text-base font-extrabold leading-6" style={{ color: C.ink }}>
                {e.title}
              </h3>
              <p className="text-xs leading-5" style={{ color: C.muted }}>
                {rsvp.details}
              </p>
              <ul className="flex flex-col gap-3 pb-2.5 pt-3.5">
                {rsvp.rules.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-sm leading-5" style={{ color: C.inkDeep }}>
                    <Check size={14} strokeWidth={2.2} className="mt-[3px] shrink-0" style={{ color: C.ink }} />
                    {r}
                  </li>
                ))}
              </ul>
              <label
                className="flex cursor-pointer items-start gap-2.5 rounded-[10px] px-4 py-3.5 text-xs leading-5"
                style={{ background: C.panel, color: C.inkDeep }}
              >
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(ev) => setAgreed(ev.target.checked)}
                  className="ml-1 mt-px size-5 shrink-0 cursor-pointer"
                  style={{ accentColor: C.brand }}
                />
                I&apos;ve read and understand the animal participation rules for this event.
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col">
              <h3 className="text-base font-extrabold leading-6" style={{ color: C.ink }}>
                A few details
              </h3>
              <p className="pt-[5px] text-xs leading-5" style={{ color: C.muted }}>
                Only what&apos;s needed to plan for capacity.
              </p>
              <label className="flex flex-wrap items-end gap-x-1 pt-5 text-base leading-6" style={{ color: C.inkDeep }}>
                Party size (including you)
                <select
                  value={party}
                  onChange={(ev) => setParty(ev.target.value)}
                  className="border border-[#757575] bg-white pl-1 pr-4 text-sm leading-4 text-black"
                >
                  {PARTY_SIZES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
              <label className="flex cursor-pointer items-center gap-2 pt-px text-base leading-6" style={{ color: C.inkDeep }}>
                <input
                  type="checkbox"
                  checked={bringingPet}
                  onChange={(ev) => setBringingPet(ev.target.checked)}
                  className="ml-1 size-4 shrink-0 cursor-pointer"
                  style={{ accentColor: C.brand }}
                />
                I plan to bring my own leashed pet
              </label>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center px-4 py-3 text-center" role="status">
              <span className="flex size-14 items-center justify-center rounded-xl bg-[#E6F4EA] text-[#1E7E34]">
                <Check size={24} strokeWidth={2.5} />
              </span>
              <p className="pt-4 text-base font-extrabold leading-6" style={{ color: C.ink }}>
                You&apos;re going!
              </p>
              <p className="max-w-[340px] pt-1 text-xs leading-5" style={{ color: C.muted }}>
                You&apos;ll get a calendar entry and can update your RSVP anytime before the event.
              </p>
            </div>
          )}
        </div>

        <div className="flex shrink-0 gap-2.5 px-6 py-5" style={{ borderTop: `1px solid ${C.line}` }}>
          {step === 1 && (
            <>
              <span className="hidden flex-1 sm:block" aria-hidden />
              <button
                type="button"
                disabled={!agreed}
                onClick={() => setStep(2)}
                className={PRIMARY}
                style={{ background: C.brand }}
              >
                Continue
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-xl bg-white px-6 py-3 text-center text-base font-semibold transition hover:bg-neutral-50"
                style={{ color: C.ink, border: `1px solid ${C.line}` }}
              >
                Back
              </button>
              <button type="button" onClick={() => setStep(3)} className={PRIMARY} style={{ background: C.brand }}>
                Confirm RSVP
              </button>
            </>
          )}
          {step === 3 && (
            <button type="button" onClick={onClose} className={PRIMARY} style={{ background: C.brand }}>
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
