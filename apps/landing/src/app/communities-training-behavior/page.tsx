import React from "react";
import HeroSection from "./components/HeroSection";
import IntentTabs from "./components/IntentTabs";
import SearchFilters from "./components/SearchFilters";
import TopicPills from "./components/TopicPills";
import ResultsSummary from "./components/ResultsSummary";
import CommunityCard, { type CommunityCardData } from "./components/CommunityCard";
import AdviceWelfareScope from "./components/AdviceWelfareScope";
import ProfessionalHandoff from "./components/ProfessionalHandoff";
import TrustModeration from "./components/TrustModeration";
import FAQSection from "./components/FAQSection";
import ConversionCTA from "./components/ConversionCTA";

const TRAINING_BEHAVIOR_COMMUNITIES: CommunityCardData[] = [
  {
    id: "PositiveTrainingNutritionCircle",
    title: "Positive Training & Nutrition Circle",
    description: "Evidence-based training methods and nutrition guidance for dogs and cats.",
    species: "Dogs, Cats",
    topics: "Positive Reinforcement, Puppy Training",
    rulesAvailable: true,
    actionLabel: "Join",
    cover: "/communities-training-behavior/positive-training-nutrition-circle.png",
  },
  {
    id: "ReactiveDogSupportCircle",
    title: "Reactive Dog Support Circle",
    description: "A supportive space to work through leash reactivity and fear-based behavior in dogs.",
    species: "Dogs",
    topics: "Leash Reactivity, Socialization",
    actionLabel: "Join",
    cover: "/communities-training-behavior/reactive-dog-support-circle.png",
  },
  {
    id: "CatBehaviorEnrichmentHub",
    title: "Cat Behavior & Enrichment Hub",
    description: "Discussing enrichment, resource guarding, and everyday cat behavior questions.",
    species: "Cats",
    topics: "Enrichment, Resource Guarding",
    rulesAvailable: true,
    actionLabel: "Request to Join",
    cover: "/communities-training-behavior/cat-behavior-enrichment-hub.png",
  },
  {
    id: "PositiveReinforcementTrainersExchange",
    title: "Positive Reinforcement Trainers Exchange",
    description: "A professional space for credentialed trainers to exchange positive-reinforcement methods and case notes.",
    species: "Dogs",
    topics: "Positive Reinforcement",
    rulesAvailable: true,
    badges: ["Verified Community", "Professional-led"],
    actionLabel: "Request to Join",
    cover: "/communities-training-behavior/positive-reinforcement-trainers-exchange.png",
  },
  {
    id: "ParrotTrainingEnrichmentNetwork",
    title: "Parrot Training & Enrichment Network",
    description: "Training techniques and enrichment ideas for parrots and other companion birds.",
    species: "Birds",
    topics: "Enrichment",
    actionLabel: "Join",
    cover: "/communities-training-behavior/parrot-training-enrichment-network.png",
  },
  {
    id: "HorseGroundworkBehaviorCircle",
    title: "Horse Groundwork & Behavior Circle",
    description: "Groundwork techniques and behavior discussion for horse owners and handlers.",
    species: "Horses",
    topics: "Socialization",
    rulesAvailable: true,
    badges: ["Organization-led"],
    actionLabel: "Join",
    cover: null,
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-[1232px] flex flex-col gap-10">
        {/* Hero */}
        <HeroSection />

        {/* Intent tabs */}
        <IntentTabs />

        {/* Search, species, sort & filters */}
        <SearchFilters />

        {/* Topic pills */}
        <TopicPills />

        {/* Results summary */}
        <ResultsSummary />

        {/* Grid of Community Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {TRAINING_BEHAVIOR_COMMUNITIES.map((card) => (
            <CommunityCard key={card.id} card={card} />
          ))}
        </div>

        {/* Advice, Welfare & Scope */}
        <AdviceWelfareScope />

        {/* Professional Handoff */}
        <ProfessionalHandoff />

        {/* Trust & Moderation */}
        <TrustModeration />

        {/* Conversion CTA */}
        <ConversionCTA />

        {/* FAQ */}
        <FAQSection />
      </div>
    </main>
  );
}
