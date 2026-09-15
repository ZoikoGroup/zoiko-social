import type { Metadata } from "next";
import Link from "next/link";
import {
  CircleCheck,
  CircleX,
  ClipboardCheck,
  Clock,
  CreditCard,
  DollarSign,
  ExternalLink,
  Eye,
  Flag,
  Handshake,
  Heart,
  Lock,
  MapPin,
  MessageSquare,
  MessagesSquare,
  PawPrint,
  RefreshCw,
  ScrollText,
  Shield,
  ShieldCheck,
  TriangleAlert,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import { APP_LINKS } from "@/lib/app-links";
import Callouts from "./components/Callouts";
import ClosingBand from "./components/ClosingBand";
import FullChecklist from "./components/FullChecklist";
import GuidanceSection from "./components/GuidanceSection";
import RedFlags from "./components/RedFlags";
import ReportRoutes from "./components/ReportRoutes";
import SafetyChecklist from "./components/SafetyChecklist";
import StagePath from "./components/StagePath";
import {
  BEFORE_YOU_INQUIRE,
  COMMUNICATE_SAFELY,
  HANDOFF_FIRST_DAYS,
  HEALTH_RECORDS,
  MEET_SAFELY,
  PAYMENTS_FEES,
  TRANSPORT_SAFETY,
} from "./components/guidance";
import { C } from "./components/theme";

export const metadata: Metadata = {
  title: "Adoption Safety | Zoiko Social",
  description:
    "Verify the source, review the listing, communicate carefully, meet safely, understand fees and records, and know when to stop or report a concern.",
};

const heroButton =
  "flex items-center justify-center rounded-xl px-6 pb-3.5 pt-3 text-base font-semibold leading-6 transition hover:opacity-90";

export default function AdoptionSafetyPage() {
  return (
    <div className="min-h-screen" style={{ background: C.page }}>
      <div className="mx-auto max-w-[1280px] px-4 pb-20 sm:px-6">
        <div className="flex flex-col gap-8 pt-10 lg:flex-row lg:items-start lg:gap-10">
          <header className="flex-1">
            <p className="text-base leading-6" style={{ color: C.inkDeep }}>
              Adoption Safety
            </p>
            <h1
              className="text-2xl font-extrabold leading-tight sm:text-3xl sm:leading-[48px]"
              style={{ color: C.ink }}
            >
              Adopt with care, confidence, and verified support.
            </h1>
            <p className="pt-3 text-base leading-6" style={{ color: C.inkDeep }}>
              Use Zoiko Social&apos;s safety guidance to verify the source,
              review the listing, communicate carefully, meet safely,
              understand fees and records, and know when to stop or report a
              concern.
            </p>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <a href="#your-safety-checklist" className={heroButton} style={{ background: C.brand, color: "#fff" }}>
                Start the safety checklist
              </a>
              <Link
                href={APP_LINKS.safety}
                className={heroButton}
                style={{ background: "#fff", color: C.ink, border: `1px solid ${C.line}` }}
              >
                How verification works
              </Link>
            </div>

            <p className="max-w-[640px] pt-4 text-xs leading-5" style={{ color: C.muted }}>
              Verification and platform safeguards reduce risk, but no online
              process can guarantee a specific adoption outcome or future
              conduct.
            </p>
          </header>

          <div className="w-full lg:max-w-[440px]">
            <SafetyChecklist />
          </div>
        </div>

        <section id="safe-adoption-path" className="scroll-mt-24 pt-14">
          <StagePath />
        </section>

        <GuidanceSection
          title="Before you inquire"
          subtitle="A quick check before you reach out to a rescue or shelter."
          cards={BEFORE_YOU_INQUIRE}
          icons={[ShieldCheck, ClipboardCheck, Users, Wallet, MapPin, Clock]}
        />

        <GuidanceSection
          title="Communicate safely"
          subtitle="Keep the process transparent and your information protected."
          cards={COMMUNICATE_SAFELY}
          icons={[MessageSquare, MessagesSquare, Lock, ExternalLink, TriangleAlert, Users, Flag]}
        />
        <Callouts />

        <GuidanceSection
          title="Meet safely"
          subtitle="What to expect and ask when you meet the animal."
          cards={MEET_SAFELY}
          icons={[MapPin, Handshake, PawPrint, MessageSquare, ScrollText, Eye, TriangleAlert]}
        />

        <GuidanceSection
          title="Payments, fees & agreements"
          subtitle="Legitimate fees vary by organization, location, species, age, and care needs — we don't publish invented fee ranges."
          cards={PAYMENTS_FEES}
          icons={[DollarSign, UserRound, CreditCard, RefreshCw, ScrollText, CircleCheck, TriangleAlert]}
        />

        <GuidanceSection
          title="Transport & cross-border safety"
          subtitle="We don't assume transport is required, and we're direct about what we can't support."
          cards={TRANSPORT_SAFETY}
          icons={[MapPin, UserRound, MessageSquare, TriangleAlert, Lock, CircleX, Shield]}
        />

        <GuidanceSection
          title="Animal health, behavior & records"
          subtitle="What to expect, request, and clarify — without implying medical certainty."
          cards={HEALTH_RECORDS}
          icons={[Heart, Flag, ClipboardCheck, UserRound, Clock, CircleCheck, TriangleAlert]}
        />

        <GuidanceSection
          title="Handoff & first days"
          subtitle="What a safe transfer and transition look like."
          cards={HANDOFF_FIRST_DAYS}
          icons={[CircleCheck, MessageSquare, Clock, UserRound, Shield, TriangleAlert]}
        />

        <FullChecklist />

        <RedFlags />

        <ReportRoutes />

        <ClosingBand />
      </div>
    </div>
  );
}
