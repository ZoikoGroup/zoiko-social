import React from "react";
import HeroSection from "./components/HeroSection";
import PurposeExplorer from "./components/PurposeExplorer";
import Toolbar from "./components/Toolbar";
import ResultsHeader from "./components/ResultsHeader";
import CommunityCard, { type CommunityCardData } from "./components/CommunityCard";
import LoadMoreButton from "./components/LoadMoreButton";
import SafetyScopeExplainer from "./components/SafetyScopeExplainer";
import BrowseAnotherWay from "./components/BrowseAnotherWay";
import ConversionBand from "./components/ConversionBand";
import FAQSection from "./components/FAQSection";

const RESCUE_ADOPTION_COMMUNITIES: CommunityCardData[] = [
  {
    id: "FelineFosterNetwork",
    title: "Feline Foster Network",
    purpose: "Fostering",
    description: "Coordinates foster placements and adoption events for cats and kittens.",
    tags: ["Cats"],
    orgName: "Feline Foster Network",
    status: "Request required",
    primaryBtn: "View Community",
    secondaryBtn: "Request to Join",
    cover: "/communities-rescue-adoption/kitten,foster.png",
    avatar: "/communities-rescue-adoption/cat,icon (1).png",
  },
  {
    id: "SacramentoValleyWildlifeRescue",
    title: "Sacramento Valley Wildlife Rescue",
    purpose: "Rescue",
    description: "Public updates and volunteer coordination for regional wildlife rescue and rehabilitation work.",
    tags: ["Wildlife"],
    orgName: "Sacramento Valley Wildlife Rescue",
    status: "Request required",
    primaryBtn: "View Community",
    secondaryBtn: "Request to Join",
    cover: "/communities-rescue-adoption/wildlife,rescue.png",
    avatar: "/communities-rescue-adoption/fox,icon.png",
  },
  {
    id: "AdoptionDayVolunteersNetwork",
    title: "Adoption Day Volunteers Network",
    purpose: "Adoption Support",
    description: "Coordinates volunteers for regional adoption events across shelters and rescues.",
    tags: ["Dogs", "Cats"],
    status: "Open to join",
    primaryBtn: "View Community",
    secondaryBtn: "Join",
    cover: "/communities-rescue-adoption/adoption,event.png",
    avatar: "/communities-rescue-adoption/adoption,icon.png",
  },
  {
    id: "DowntownHumaneSocietyCircle",
    title: "Downtown Humane Society Circle",
    purpose: "Adoption Support",
    description: "Community updates and volunteer sign-ups associated with the downtown humane society.",
    tags: ["Dogs", "Cats"],
    orgName: "Downtown Humane Society",
    status: "Open to join",
    primaryBtn: "View Community",
    secondaryBtn: "Join",
    cover: "/communities-rescue-adoption/humane,shelter.png",
    avatar: "/communities-rescue-adoption/shelter,icon.png",
  },
  {
    id: "CoastalWildlifeShelterVolunteers",
    title: "Coastal Wildlife Shelter Volunteers",
    purpose: "Rescue",
    description: "Volunteer coordination and public updates from a coastal wildlife rehabilitation shelter.",
    tags: ["Wildlife"],
    orgName: "Coastal Wildlife Shelter",
    status: "Request required",
    primaryBtn: "View Community",
    secondaryBtn: "Request to Join",
    cover: "/communities-rescue-adoption/wildlife,shelter.png",
    avatar: "/communities-rescue-adoption/fox,icon.png",
  },
  {
    id: "BackyardLitterFosterCircle",
    title: "Backyard Litter Foster Circle",
    purpose: "Fostering",
    description: "Peer support for people fostering unweaned kittens and small litters at home.",
    tags: ["Cats"],
    status: "Open to join",
    primaryBtn: "View Community",
    secondaryBtn: "Join",
    cover: "/communities-rescue-adoption/kitten,litter.png",
    avatar: "/communities-rescue-adoption/cat,icon.png",
  },
  {
    id: "RegionalFarmSanctuaryShelterGroup",
    title: "Regional Farm Sanctuary Shelter Group",
    purpose: "Rescue",
    description: "Volunteer and visitor updates associated with a regional farm animal sanctuary.",
    tags: ["Farm animals"],
    orgName: "Regional Farm Sanctuary",
    status: "Open to join",
    primaryBtn: "View Community",
    secondaryBtn: "Join",
    cover: "/communities-rescue-adoption/farm,sanctuary.png",
    avatar: "/communities-rescue-adoption/farm,icon.png",
  },
  {
    id: "PuppyFosterSupportGroup",
    title: "Puppy Foster Support Group",
    purpose: "Fostering",
    description: "Peer support and practical advice for people fostering puppies before adoption.",
    tags: ["Dogs"],
    status: "Open to join",
    primaryBtn: "View Community",
    secondaryBtn: "Join",
    cover: "/communities-rescue-adoption/puppy,foster.png",
    avatar: "/communities-rescue-adoption/dog,icon.png",
  },
  {
    id: "EquineRescueRehabilitation",
    title: "Equine Rescue & Rehabilitation",
    purpose: "Rescue",
    description: "Organization-associated group supporting rescued and retired horses through rehabilitation.",
    tags: ["Horses"],
    orgName: "Equine Rescue & Rehabilitation",
    status: "Request required",
    primaryBtn: "View Community",
    secondaryBtn: "Request to Join",
    cover: "/communities-rescue-adoption/horse,rescue.png",
    avatar: null,
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-[1232px] flex flex-col gap-12">
        {/* Hero Section */}
        <HeroSection />

        {/* Purpose Explorer Section */}
        <PurposeExplorer />

        {/* Search & Filter Toolbar */}
        <Toolbar />

        {/* Results Header & Count */}
        <ResultsHeader />

        {/* Grid of Community Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {RESCUE_ADOPTION_COMMUNITIES.map((card) => (
            <CommunityCard key={card.id} card={card} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center my-4">
          <LoadMoreButton />
        </div>

        {/* Safety & Scope Explainer */}
        <SafetyScopeExplainer />

        {/* Browse Another Way Section */}
        <BrowseAnotherWay />

        {/* Conversion / CTA Band */}
        <ConversionBand />

        {/* FAQ Section */}
        <FAQSection />
      </div>
    </main>
  );
}
