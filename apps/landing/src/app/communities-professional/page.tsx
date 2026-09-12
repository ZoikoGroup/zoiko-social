import React from "react";
import HeroSection from "./components/HeroSection";
import OperatorExplorer from "./components/OperatorExplorer";
import Toolbar from "./components/Toolbar";
import ProfessionalCommunitiesHeader from "./components/ProfessionalCommunitiesHeader";
import CommunityCard from "./components/CommunityCard";
import LoadMoreButton from "./components/LoadMoreButton";
import TrustAndIdentityExplainer from "./components/TrustAndIdentityExplainer";
import BrowseAnotherWay from "./components/BrowseAnotherWay";
import ConversionBand from "./components/ConversionBand";
import FAQSection from "./components/FAQSection";

const PROFESSIONAL_COMMUNITIES = [
  {
    "id": "CommunityCard",
    "title": "Riverside Animal Hospital Community",
    "description": "Post-op recovery support and general care questions for clients and followers of the clinic.",
    "role": "Vet",
    "roleName": "Riverside Animal Hospital",
    "tags": [
      "Dogs",
      "Cats"
    ],
    "status": "Open to join",
    "primaryBtn": "View Community",
    "secondaryBtn": "Join",
    "cover": "/communities-professional/veterinarian,clinic.png",
    "avatar": "/communities-professional/veterinary,icon.png"
  },
  {
    "id": "CalmPawsCard",
    "title": "Calm Paws Dog Training Collective",
    "description": "Reward-based training resources and local class information from a professional trainer network.",
    "role": "Trainer",
    "roleName": "Calm Paws Training Co.",
    "tags": [
      "Dogs"
    ],
    "status": "Open to join",
    "primaryBtn": "View Community",
    "secondaryBtn": "Join",
    "cover": "/communities-professional/dogtraining.png",
    "avatar": null
  },
  {
    "id": "ShelterCard",
    "title": "Northside Shelter Alumni Network",
    "description": "A space for adopters and volunteers connected to Northside Animal Shelter to stay in touch.",
    "role": "Shelter",
    "roleName": "Northside Animal Shelter",
    "tags": [
      "Dogs",
      "Cats"
    ],
    "status": "Open to join",
    "primaryBtn": "View Community",
    "secondaryBtn": "Join",
    "cover": "/communities-professional/shelter,dog.png",
    "avatar": "/communities-professional/shelter,icon.png"
  },
  {
    "id": "DeltaEquineCard",
    "title": "Delta Equine Veterinary Group",
    "description": "Equine health topics and clinic updates from a regional veterinary practice.",
    "role": "Vet",
    "roleName": "Delta Equine Veterinary Group",
    "tags": [
      "Horses"
    ],
    "status": "Request required",
    "primaryBtn": "View Community",
    "secondaryBtn": "Request to Join",
    "cover": "/communities-professional/Background.png",
    "avatar": "/communities-professional/horse,icon.png"
  },
  {
    "id": "PositiveReinforcementCard",
    "title": "Positive Reinforcement Trainers Guild",
    "description": "A guild of trainers sharing reward-based methods and continuing-education resources.",
    "role": "Trainer",
    "roleName": "PR Trainers Guild",
    "tags": [
      "Dogs"
    ],
    "status": "Request required",
    "primaryBtn": "View Community",
    "secondaryBtn": "Request to Join",
    "cover": "/communities-professional/Background (1).png",
    "avatar": "/communities-professional/Background+Border+Shadow (1).png"
  },
  {
    "id": "CoastalWildlifeCard",
    "title": "Coastal Wildlife Shelter Volunteers",
    "description": "Volunteer coordination and public updates from a coastal wildlife rehabilitation shelter.",
    "role": "Shelter",
    "roleName": "Coastal Wildlife Shelter",
    "tags": [
      "Wildlife"
    ],
    "status": "Request required",
    "primaryBtn": "View Community",
    "secondaryBtn": "Request to Join",
    "cover": "/communities-professional/Background (2).png",
    "avatar": "/communities-professional/fox,icon.png"
  },
  {
    "id": "FelineWellnessCard",
    "title": "Feline Wellness Clinic Community",
    "description": "Cat-focused wellness information and clinic updates from a feline-only veterinary practice.",
    "role": "Vet",
    "roleName": "Feline Wellness Clinic",
    "tags": [
      "Cats"
    ],
    "status": "Open to join",
    "primaryBtn": "View Community",
    "secondaryBtn": "Join",
    "cover": "/communities-professional/cat,veterinary.png",
    "avatar": "/communities-professional/cat,icon.png"
  },
  {
    "id": "K9BehaviorAllianceCard",
    "title": "K9 Behavior & Training Alliance",
    "description": "Behavior-focused training discussion associated with a network of certified trainers.",
    "role": "Trainer",
    "roleName": "K9 Behavior Alliance",
    "tags": [
      "Dogs"
    ],
    "status": "Open to join",
    "primaryBtn": "View Community",
    "secondaryBtn": "Join",
    "cover": "/communities-professional/Background (3).png",
    "avatar": "/communities-professional/dogtraining,icon.png"
  },
  {
    "id": "DowntownHumaneCard",
    "title": "Downtown Humane Society Circle",
    "description": "Community updates and volunteer sign-ups associated with the downtown humane society.",
    "role": "Shelter",
    "roleName": "Downtown Humane Society",
    "tags": [
      "Dogs",
      "Cats"
    ],
    "status": "Open to join",
    "primaryBtn": "View Community",
    "secondaryBtn": "Join",
    "cover": "/communities-professional/Background (4).png",
    "avatar": "/communities-professional/shelter,icon (1).png"
  }
];

export default function Page() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center py-12 px-6">
      <div className="w-[1232px] flex flex-col gap-12">
        {/* Hero Section */}
        <HeroSection />

        {/* Operator Explorer Section */}
        <OperatorExplorer />

        {/* Search & Filter Toolbar */}
        <Toolbar />

        {/* Communities Header & Count */}
        <ProfessionalCommunitiesHeader />

        {/* Grid of Community Cards */}
        <div className="grid grid-cols-3 gap-6 auto-rows-fr">
          {PROFESSIONAL_COMMUNITIES.map((card) => (
            <CommunityCard key={card.id} card={card} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center my-4">
          <LoadMoreButton />
        </div>

        {/* Trust & Identity Explainer */}
        <TrustAndIdentityExplainer />

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
