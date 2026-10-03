import React from 'react'
import YourRegionHero from './components/YourRegionHero'
import GlobalCoverageFeed from './components/GlobalCoverageFeed'
import CorrectedStoryCard from './components/CorrectedStoryCard'
import RegionalCoverageSections from './components/RegionalCoverageSections'
import WhatChanged from './components/WhatChanged'
import RegionalSources from './components/RegionalSources'
import BeyondRegion from './components/BeyondRegion'
import GlobalCoverageCTA from './components/GlobalCoverageCTA'

export default function page() {
  return (
    <main>
        <YourRegionHero />
        <GlobalCoverageFeed />
        <CorrectedStoryCard />
        <RegionalCoverageSections />
        <WhatChanged />
        <RegionalSources />
        <BeyondRegion />
        <GlobalCoverageCTA />
    </main>
  )
}
