import React from 'react';
import GlobalCoverageHero from './components/GlobalCoverageHero';
import RegionNavigator from './components/RegionNavigator';
import TopGlobalStories from './components/TopGlobalStories';
import CoverageSnapshot from './components/CoverageSnapshot';
import RegionDirectory from './components/RegionDirectory';
import AcrossRegions from './components/AcrossRegions';
import TiersByRegion from './components/TiersByRegion';
import TopicByRegion from './components/TopicByRegion';
import LanguageAndTranslation from './components/LanguageAndTranslation';
import TrustAndCorrections from './components/TrustAndCorrections';
import FollowDigest from './components/FollowDigest';
import FAQSection from './components/FAQSection';
import ExploreMoreCTA from './components/ExploreMoreCTA';

export default function GlobalCoveragePage() {
  return (
    <main className="w-full h-full min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto pt-[100px] pb-10 px-4 md:px-8">
        <GlobalCoverageHero />
        <RegionNavigator />
        <div className="mt-16">
          <TopGlobalStories />
        </div>
        <CoverageSnapshot />
        <RegionDirectory />
        <AcrossRegions />
        <TopicByRegion />
        <TiersByRegion />
        <LanguageAndTranslation />
        <TrustAndCorrections />
        <FollowDigest />
        <FAQSection />
        <ExploreMoreCTA />
      </div>
    </main>
  );
}
