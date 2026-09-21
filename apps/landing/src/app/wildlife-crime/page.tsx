import React from 'react';
import HeroSection from './components/HeroSection';
import CrimeTypeFilters from './components/CrimeTypeFilters';
import ArticleList from './components/ArticleList';
import LegalStageExplainer from './components/LegalStageExplainer';
import CasePolicyTracker from './components/CasePolicyTracker';
import EvidenceLegend from './components/EvidenceLegend';
import RetentionDigest from './components/RetentionDigest';
import StickySidebar from './components/StickySidebar';
import FAQSection from './components/FAQSection';

export default function WildlifeCrimePage() {
  return (
    <main className="w-full h-full min-h-screen bg-[#F7F9FA]">
      <div className="max-w-[1320px] mx-auto pt-[136px] pb-10">
        <HeroSection />
        <CrimeTypeFilters />
        <div className="flex flex-col lg:flex-row gap-6 px-6 lg:px-[24px] justify-between relative mt-[72px]">
          <ArticleList />
          <StickySidebar />
        </div>
        <div className="flex flex-col gap-10 px-6 lg:px-[24px]">
          <LegalStageExplainer />
          <CasePolicyTracker />
          <EvidenceLegend />
          <RetentionDigest />
          <FAQSection />
        </div>
      </div>
    </main>
  );
}
