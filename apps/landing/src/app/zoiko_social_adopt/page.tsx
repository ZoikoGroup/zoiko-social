import React from "react";
import HeroSection from "./components/HeroSection";
import IntentTabs from "./components/IntentTabs";
import SearchFilters from "./components/SearchFilters";
import DiscoveryPathways from "./components/DiscoveryPathways";
import ResultsSummary from "./components/ResultsSummary";
import AnimalCard, { type AnimalCardData } from "./components/AnimalCard";
import VerifiedRescues from "./components/VerifiedRescues";
import VerificationWorks from "./components/VerificationWorks";
import AdoptionSafety from "./components/AdoptionSafety";
import ConversionCTA from "./components/ConversionCTA";
import FAQSection from "./components/FAQSection";

const ANIMAL_RECORDS: AnimalCardData[] = [
  {
    id: "willow",
    name: "Willow",
    details: "Dog · Labrador Mix · Adult",
    location: "Sacramento, CA area",
    organization: "Sacramento Animal Rescue",
    listedTime: "Listed 3 days ago",
    intentBadge: "Adoption",
    statusBadge: "Available",
    cover: "/zoiko_social_adopt/willow.png",
  },
  {
    id: "max",
    name: "Max",
    details: "Dog · Golden Retriever · Senior",
    location: "Sacramento, CA area",
    organization: "Golden State Rescue Alliance",
    listedTime: "Listed 9 days ago",
    intentBadge: "Adoption",
    statusBadge: "Application Pending",
    cover: "/zoiko_social_adopt/max.png",
  },
  {
    id: "bella",
    name: "Bella",
    details: "Cat · Domestic Shorthair · Young Adult",
    location: "London area",
    organization: "Second Chance Animal Shelter",
    listedTime: "Listed 1 day ago",
    intentBadge: "Adoption",
    statusBadge: "Available",
    cover: "/zoiko_social_adopt/bella.png",
  },
  {
    id: "oliver",
    name: "Oliver",
    details: "Rabbit · Holland Lop · Adult",
    location: "Bristol area",
    organization: "Second Chance Animal Shelter",
    listedTime: "Listed 5 days ago",
    intentBadge: "Foster",
    statusBadge: "Available",
    cover: "/zoiko_social_adopt/oliver.png",
  },
  {
    id: "daisy",
    name: "Daisy",
    details: "Guinea Pig · Abyssinian · Young",
    location: "London area",
    organization: "Second Chance Animal Shelter",
    listedTime: "Listed 2 days ago",
    intentBadge: "Foster",
    statusBadge: "Available",
    cover: "/zoiko_social_adopt/daisy.png",
  },
  {
    id: "charlie",
    name: "Charlie",
    details: "Dog · Border Collie Mix · Puppy",
    location: "Manchester area",
    organization: "Golden State Rescue Alliance",
    listedTime: "Listed 12 days ago",
    intentBadge: "Adoption",
    statusBadge: "On Hold",
    cover: "/zoiko_social_adopt/charlie.png",
  },
  {
    id: "pepper",
    name: "Pepper",
    details: "Cat · Domestic Shorthair · Senior",
    location: "Sacramento, CA area",
    organization: "Sacramento Animal Rescue",
    listedTime: "Listed 6 days ago",
    intentBadge: "Adoption",
    statusBadge: "Available",
    cover: "/zoiko_social_adopt/pepper.png",
  },
  {
    id: "shadow",
    name: "Shadow",
    details: "Horse · Quarter Horse · Adult",
    location: "Yorkshire, UK area",
    organization: "Meadowbrook Sanctuary",
    listedTime: "Listed 6 days ago",
    intentBadge: "Foster",
    statusBadge: "Available",
    cover: "/zoiko_social_adopt/shadow.png",
  },
];

export default function AdoptPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-[1232px] flex flex-col gap-10">
        {/* Hero */}
        <HeroSection />

        {/* Intent tabs */}
        <IntentTabs />

        {/* Search & Filters */}
        <SearchFilters />

        {/* Discovery Pathways */}
        <DiscoveryPathways />

        {/* Results summary */}
        <ResultsSummary />

        {/* Grid of Animal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {ANIMAL_RECORDS.map((card) => (
            <AnimalCard key={card.id} card={card} />
          ))}
        </div>

        <div className="w-full flex justify-center py-4">
           <button className="h-[47px] px-8 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-200 text-cyan-950 text-sm font-bold font-['Plus_Jakarta_Sans'] hover:bg-zinc-50 transition-colors">
             Load more
           </button>
        </div>

        {/* Verified Rescues */}
        <VerifiedRescues />

        {/* Verification Works */}
        <VerificationWorks />

        {/* Adoption Safety */}
        <AdoptionSafety />

        {/* Conversion CTA */}
        <ConversionCTA />

        {/* FAQ */}
        <FAQSection />
      </div>
    </main>
  );
}
