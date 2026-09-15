import Link from "next/link";
import {
  ChevronRight,
  Handshake,
  HeartPulse,
  Lock,
  MessageSquare,
  ReceiptText,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import { appUrl } from "@/lib/app-links";
import { C } from "./theme";
import { ASSURANCES, FOSTER_SAFETY } from "./fosterNeeds";

const ASSURANCE_ICONS = [ShieldCheck, UserRoundCheck, MessageSquare] as const;
const SAFETY_ICONS = [Handshake, Lock, ReceiptText, HeartPulse] as const;

/**
 * The three sections between the results and the closing band: who stays
 * responsible, the foster safety panel, and the note for organizations.
 */
export default function InCharge() {
  return (
    <>
      <section className="pt-16">
        <h2
          className="text-center text-xl font-extrabold leading-8 sm:text-2xl"
          style={{ color: C.ink }}
        >
          The rescue or shelter stays in charge
        </h2>
        <p
          className="mx-auto max-w-[760px] pt-2 text-center text-sm leading-5"
          style={{ color: C.muted }}
        >
          Zoiko Social facilitates discovery and safe interest expression — the
          verified organization remains the responsible source and placement
          coordinator.
        </p>

        <div className="grid grid-cols-1 gap-8 pt-8 md:grid-cols-3">
          {ASSURANCES.map(({ title, body }, i) => {
            const Icon = ASSURANCE_ICONS[i];
            return (
              <div key={title} className="flex flex-col items-start gap-2">
                <Icon size={18} strokeWidth={1.5} style={{ color: C.brand }} aria-hidden />
                <h3 className="text-sm font-bold leading-5" style={{ color: C.inkDeep }}>
                  {title}
                </h3>
                <p className="text-xs leading-5" style={{ color: C.muted }}>
                  {body}
                </p>
              </div>
            );
          })}
        </div>

        <Link
          href={appUrl("/docs/adoption-and-lost-found")}
          className="mt-6 inline-flex items-center gap-1 text-sm font-semibold"
          style={{ color: C.brand }}
        >
          How We Verify
          <ChevronRight size={14} aria-hidden />
        </Link>
      </section>

      <section
        className="mt-12 rounded-3xl p-6 sm:p-8"
        style={{ background: "#F1F7F8", border: `1px solid ${C.line}` }}
      >
        <h2
          className="flex items-center gap-2 text-base font-bold leading-6"
          style={{ color: C.ink }}
        >
          <ShieldCheck size={18} strokeWidth={1.5} aria-hidden />
          Foster safety
        </h2>

        <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 xl:grid-cols-4">
          {FOSTER_SAFETY.map(({ title, body }, i) => {
            const Icon = SAFETY_ICONS[i];
            return (
              <div
                key={title}
                className="flex flex-col gap-2 rounded-2xl bg-white p-4"
                style={{ border: `1px solid ${C.line}` }}
              >
                <Icon size={16} strokeWidth={1.5} style={{ color: C.brand }} aria-hidden />
                <h3 className="text-sm font-bold leading-5" style={{ color: C.inkDeep }}>
                  {title}
                </h3>
                <p className="text-xs leading-5" style={{ color: C.muted }}>
                  {body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section
        className="mt-6 flex flex-col gap-4 rounded-2xl bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
        style={{ border: `1px solid ${C.line}` }}
      >
        <div className="flex items-start gap-3">
          <UserRoundCheck
            size={18}
            strokeWidth={1.5}
            className="mt-0.5 shrink-0"
            style={{ color: C.brand }}
            aria-hidden
          />
          <div>
            <h3 className="text-sm font-bold leading-5" style={{ color: C.inkDeep }}>
              Need to list a foster need?
            </h3>
            <p className="pt-1 text-xs leading-5" style={{ color: C.muted }}>
              Only verified rescues and shelters can list foster needs on Zoiko
              Social — there&apos;s no unverified public self-listing.
            </p>
          </div>
        </div>
        <Link
          href={appUrl("/docs/adoption-and-lost-found")}
          className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-center text-sm font-semibold"
          style={{ border: `1px solid ${C.line}`, color: C.inkDeep }}
        >
          Verify Your Organization
        </Link>
      </section>
    </>
  );
}
