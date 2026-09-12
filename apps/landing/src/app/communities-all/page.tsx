import Image from "next/image";
import React from "react";
import CommunitiesHeader from "./components/CommunitiesHeader";
import CommunityPurposeBanner from "./components/CommunityPurposeBanner";
import CommunityFilterBar from "./components/CommunityFilterBar";
import CommunitiesSectionHeader from "./components/CommunitiesSectionHeader";
import LoadMoreButton from "./components/LoadMoreButton";
import BrowseCategories from "./components/BrowseCategories";
import CallToActionBanner from "./components/CallToActionBanner";
import FAQSection from "./components/FAQSection";

const COMMUNITY_IMAGES = [
  "/communities-all/Article.png",
  "/communities-all/Article (1).png",
  "/communities-all/Article (2).png",
  "/communities-all/Article (3).png",
  "/communities-all/Article (4).png",
  "/communities-all/Article (5).png",
  "/communities-all/Article (6).png",
  "/communities-all/Article (7).png",
  "/communities-all/Article (8).png",
];

export default function CommunitiesPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-10 pb-20">
      <div className="w-full max-w-[1232px] flex flex-col gap-8">
        {/* Header and Search */}
        <CommunitiesHeader />

        {/* Educational Banner */}
        <CommunityPurposeBanner />

        {/* Main Directory Section */}
        <section className="flex flex-col gap-4">
          <CommunityFilterBar />
          <CommunitiesSectionHeader />

          {/* Community cards grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMUNITY_IMAGES.map((src) => (
              <div
                key={src}
                className="relative aspect-[395/376] overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
              >
                <Image
                  src={src}
                  alt="Community"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <LoadMoreButton />
        </section>

        <hr className="w-full border-gray-200 my-4" />

        {/* Alternative Browsing Methods */}
        <BrowseCategories />

        {/* Call To Action */}
        <div className="py-8">
          <CallToActionBanner />
        </div>

        {/* FAQs */}
        <FAQSection />
      </div>
    </main>
  );
}
