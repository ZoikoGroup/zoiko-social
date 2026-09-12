import Image from "next/image";
import PopularCommunities from "./components/PopularCommunities";
import TrustStrip from "./components/TrustStrip";
import Toolbar from "./components/Toolbar";
import ResultsHeader from "./components/ResultsHeader";
import SortDisclaimer from "./components/SortDisclaimer";
import LoadMore from "./components/LoadMore";
import BrowseAnotherWay from "./components/BrowseAnotherWay";
import ConversionBand from "./components/ConversionBand";
import FAQ from "./components/FAQ";

const COMMUNITY_IMAGES = [
  "/communities-popular/Article (9).png",
  "/communities-popular/Article (10).png",
  "/communities-popular/Article (11).png",
  "/communities-popular/Article (12).png",
  "/communities-popular/Article (13).png",
  "/communities-popular/Article (14).png",
  "/communities-popular/Article (15).png",
  "/communities-popular/Article (16).png",
  "/communities-popular/Article (17).png",
];

export default function PopularCommunitiesPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Wrapper to constrain max width and manage vertical spacing */}
      <div className="w-full max-w-[1232px] flex flex-col gap-8">
        {/* 1. Page Header & Introduction */}
        <section className="flex flex-col gap-4">
          <PopularCommunities />
          <TrustStrip />
        </section>

        {/* 2. Search, Filters & Sorting */}
        <Toolbar />

        {/* 3. Community Results Section */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <ResultsHeader />
            <SortDisclaimer />
          </div>

          {/*
            Community cards grid — 9 cards, one per community image.
            Replace with the actual CommunityCard component when ready.
          */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
            {COMMUNITY_IMAGES.map((src) => (
              <div
                key={src}
                className="relative h-[373px] overflow-hidden rounded-[20px] border border-slate-200 bg-slate-50"
              >
                <Image
                  src={src}
                  alt="Community"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <LoadMore />
        </section>

        {/* 4. Alternative Discovery Options */}
        <BrowseAnotherWay />

        {/* 5. Bottom Call to Action */}
        <div className="py-8">
          <ConversionBand />
        </div>

        {/* 6. FAQ Section */}
        <FAQ />
      </div>
    </main>
  );
}
