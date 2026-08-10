import HeroSection from "./components/HeroSection";
import OurPurposeSection from "./components/OurPurposeSection";
import MeaningSection from "./components/MeaningSection";
import WhatIsSection from "./components/WhatIsSection";
import BuiltForSection from "./components/BuiltForSection";
import TrustSection from "./components/TrustSection";
import GlobalPerspectiveSection from "./components/GlobalPerspectiveSection";
import LifeEventsSection from "./components/LifeEventsSection";
import EcosystemSection from "./components/EcosystemSection";
import CommitmentSection from "./components/CommitmentSection";

export default function AboutUsPage() {
    return (
        <main className="flex min-h-screen flex-col overflow-hidden">
            <HeroSection />
            <OurPurposeSection />
            <MeaningSection />
            <WhatIsSection />
            <BuiltForSection />
            <TrustSection />
            <GlobalPerspectiveSection />
            <LifeEventsSection />
            <EcosystemSection />
            <CommitmentSection />
        </main>
    );
}