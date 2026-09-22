import type { Metadata } from "next";
import Link from "next/link";
import Hero from "./components/Hero";
import FundraiserBrowser from "./components/FundraiserBrowser";
import { FollowCauses, SafetySupport, TrustTable } from "./components/InfoSections";
import FAQ from "./components/FAQ";
import { C } from "./components/theme";

export const metadata: Metadata = {
  title: "Fundraisers | Zoiko Social Events",
  description:
    "Support animal causes with confidence — fundraisers for verified rescues, shelters, and animal-welfare organizations with clear beneficiary information and transparent tracking.",
};

export default function EventsFundraisersPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="pt-4 text-xs leading-5" style={{ color: C.muted }}>
          <Link href="/" className="hover:underline">
            Home
          </Link>
          {" / "}
          <Link href="/events-upcoming" className="hover:underline">
            Events
          </Link>
          {" / "}
          <span aria-current="page" className="font-semibold" style={{ color: C.ink }}>
            Fundraisers
          </span>
        </nav>
        <Hero />
        <FundraiserBrowser />
        <TrustTable />
        <SafetySupport />
        <FollowCauses />
        <FAQ />
      </div>
    </div>
  );
}
