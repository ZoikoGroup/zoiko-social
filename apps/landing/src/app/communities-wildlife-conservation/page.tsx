import React from "react";
import HeroImageSection from "./components/HeroImageSection";
import DiscoveryStrip from "./components/DiscoveryStrip";
import Toolbar from "./components/Toolbar";
import ResultsHeader from "./components/ResultsHeader";
import CommunityCard, { type CommunityCardData } from "./components/CommunityCard";
import LoadMoreButton from "./components/LoadMoreButton";
import GlobalConservationGallery from "./components/GlobalConservationGallery";
import SafetyLocationPanel from "./components/SafetyLocationPanel";
import TrustModerationReporting from "./components/TrustModerationReporting";
import BrowseAnotherWay from "./components/BrowseAnotherWay";
import ConversionBand from "./components/ConversionBand";
import FAQSection from "./components/FAQSection";

const WILDLIFE_CONSERVATION_COMMUNITIES: CommunityCardData[] = [
  {
    id: "UrbanBirdConservationNetwork",
    title: "Urban Bird Conservation Network",
    topic: "Habitat Conservation",
    description: "Guided walks and habitat-conservation discussion for local and migratory bird populations.",
    tag: "Birds",
    location: "Global (broad)",
    status: "Open to join",
    primaryBtn: "View Community",
    secondaryBtn: "Join",
    cover: "/communities-wildlife-conservation/birdwatching,park.png",
    icon: "/communities-wildlife-conservation/bird,icon.png",
  },
  {
    id: "CoralReefWatchCommunity",
    title: "Coral Reef Watch Community",
    topic: "Habitat Conservation",
    description: "Discussion and observation-sharing for coral reef health and marine conservation.",
    tag: "Marine life",
    location: "Location details limited for conservation sensitivity",
    locationSensitive: true,
    status: "Request required",
    primaryBtn: "View Community",
    secondaryBtn: "Request to Join",
    cover: "/communities-wildlife-conservation/coralreef,ocean.png",
    icon: "/communities-wildlife-conservation/coral,icon.png",
  },
  {
    id: "BackyardPollinatorAlliance",
    title: "Backyard Pollinator Alliance",
    topic: "Habitat Conservation",
    description: "Community-run space for people creating pollinator-friendly gardens and habitats.",
    tag: "Pollinators",
    location: "Global (broad)",
    status: "Open to join",
    primaryBtn: "View Community",
    secondaryBtn: "Join",
    cover: "/communities-wildlife-conservation/bee,garden.png",
    icon: "/communities-wildlife-conservation/bee,icon.png",
  },
  {
    id: "ArcticWildlifeDiscussionCircle",
    title: "Arctic Wildlife Discussion Circle",
    topic: "Species Monitoring",
    description: "Discussion of Arctic wildlife, changing habitats, and monitoring efforts.",
    tag: "Wildlife",
    location: "Arctic region (broad)",
    status: "Open to join",
    primaryBtn: "View Community",
    secondaryBtn: "Join",
    cover: "/communities-wildlife-conservation/arctic,wildlife,snow.png",
    icon: "/communities-wildlife-conservation/arctic,icon.png",
  },
  {
    id: "SeaTurtleConservationCommunity",
    title: "Sea Turtle Conservation Community",
    topic: "Species Monitoring",
    description: "Following sea turtle conservation topics and nesting-season awareness.",
    tag: "Marine life",
    location: "Location details limited for conservation sensitivity",
    locationSensitive: true,
    status: "Request required",
    primaryBtn: "View Community",
    secondaryBtn: "Request to Join",
    cover: "/communities-wildlife-conservation/seaturtle,ocean.png",
    icon: "/communities-wildlife-conservation/turtle,icon.png",
  },
  {
    id: "OwlRaptorWatchers",
    title: "Owl & Raptor Watchers",
    topic: "Community Science",
    description: "Community science and sighting discussion for owls and birds of prey.",
    tag: "Birds",
    location: "Global (broad)",
    status: "Open to join",
    primaryBtn: "View Community",
    secondaryBtn: "Join",
    cover: "/communities-wildlife-conservation/owl,raptor.png",
    icon: "/communities-wildlife-conservation/owl,icon.png",
  },
  {
    id: "WolfPredatorCoexistenceForum",
    title: "Wolf & Predator Coexistence Forum",
    topic: "Policy & Advocacy",
    description: "Policy and advocacy discussion on human-predator coexistence.",
    tag: "Wildlife",
    location: "Global (broad)",
    status: "Open to join",
    primaryBtn: "View Community",
    secondaryBtn: "Join",
    cover: "/communities-wildlife-conservation/wolf,forest.png",
    icon: "/communities-wildlife-conservation/wolf,icon.png",
  },
  {
    id: "BatConservationCircle",
    title: "Bat Conservation Circle",
    topic: "Habitat Conservation",
    description: "Habitat-conservation discussion focused on bat species and roost protection awareness.",
    tag: "Wildlife",
    location: "Location details limited for conservation sensitivity",
    locationSensitive: true,
    status: "Request required",
    primaryBtn: "View Community",
    secondaryBtn: "Request to Join",
    cover: "/communities-wildlife-conservation/bat,cave.png",
    icon: "/communities-wildlife-conservation/bat,icon.png",
  },
  {
    id: "ElephantConservationDiscussionGroup",
    title: "Elephant Conservation Discussion Group",
    topic: "Policy & Advocacy",
    description: "Policy and advocacy discussion related to elephant conservation.",
    tag: "Wildlife",
    location: "Global (broad)",
    orgName: "Global Elephant Coalition (associated group)",
    status: "Open to join",
    primaryBtn: "View Community",
    secondaryBtn: "Join",
    cover: "/communities-wildlife-conservation/elephant,savanna.png",
    icon: "/communities-wildlife-conservation/elephant,icon.png",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-[1232px] flex flex-col gap-12">
        {/* Mobile-only breadcrumb (desktop frame omits it) */}
        <div className="sm:hidden text-teal-950 text-sm font-semibold font-['Plus_Jakarta_Sans']">
          Home / Communities / Wildlife &amp; Conservation
        </div>

        {/* Hero (background image) */}
        <HeroImageSection />

        {/* Browse by conservation topic */}
        <DiscoveryStrip />

        {/* Search & Filter Toolbar */}
        <Toolbar />

        {/* Results Header & Count */}
        <ResultsHeader />

        {/* Grid of Community Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {WILDLIFE_CONSERVATION_COMMUNITIES.map((card) => (
            <CommunityCard key={card.id} card={card} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center my-4">
          <LoadMoreButton />
        </div>

        {/* Global Conservation Context (image gallery) */}
        <GlobalConservationGallery />

        {/* Safety & Sensitive-Location Panel (image band) */}
        <SafetyLocationPanel />

        {/* Trust, Moderation & Reporting */}
        <TrustModerationReporting />

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
