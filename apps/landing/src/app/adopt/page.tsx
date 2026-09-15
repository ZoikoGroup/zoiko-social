import type { Metadata } from "next";
import AdoptionHighlight from "./components/AdoptionHighlight";
import ListingGrid from "./components/ListingGrid";
import TrustSafety from "./components/TrustSafety";
import { C } from "./components/theme";

export const metadata: Metadata = {
  title: "Adopt Hub | Zoiko Social",
  description:
    "An overview of adoption on Zoiko Social — with adoption listings, verification information, and safety guidance one click away from wherever you're browsing.",
};

export default function AdoptPage() {
  return (
    <div className="min-h-screen" style={{ background: C.page }}>
      <div className="mx-auto max-w-[1280px] px-4 pb-20 sm:px-6">
        {/* Hero. The highlight panel sits beside the copy from lg and drops
            below it underneath, where a 384px panel would squeeze the text. */}
        <div className="flex flex-col gap-8 pt-10 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <header className="flex-1">
            <p
              className="inline-flex rounded-[20px] px-3 py-[5px] text-xs font-semibold leading-4 tracking-wide"
              style={{ background: C.chip, color: C.brand }}
            >
              Adopt
            </p>
            <h1
              className="pt-5 text-2xl font-extrabold leading-tight sm:text-3xl sm:leading-[48px]"
              style={{ color: C.ink }}
            >
              Adopt Hub
            </h1>
            <p className="max-w-[600px] pt-3 text-base leading-6" style={{ color: C.muted }}>
              An overview of adoption on Zoiko Social — with adoption listings,
              verification information, and safety guidance one click away from
              wherever you&apos;re browsing.
            </p>
            <p className="max-w-[600px] pt-4 text-base leading-6" style={{ color: C.muted }}>
              Verified source means the rescue or shelter behind a listing has
              met Zoiko Social&apos;s verification requirements. It does not
              guarantee a specific animal&apos;s health, an adopter&apos;s
              suitability, or the outcome of any individual adoption.
            </p>
          </header>

          <div className="lg:shrink-0">
            <AdoptionHighlight />
          </div>
        </div>

        <section className="pt-11">
          <h2 className="text-xl font-extrabold leading-8" style={{ color: C.ink }}>
            Animals for Adoption
          </h2>
          <p className="pt-[3px] text-sm leading-5" style={{ color: C.muted }}>
            A preview of current listings. Full filtering, safety details, and
            applicant guidance live on the complete Animals for Adoption page.
          </p>

          <div className="pt-4">
            <ListingGrid />
          </div>
        </section>

        <TrustSafety />
      </div>
    </div>
  );
}
