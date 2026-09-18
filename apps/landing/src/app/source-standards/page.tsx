import React from 'react'
import Hero from './components/Hero'
import ApprovedPublicRatings from './components/ApprovedPublicRatings'
import WhatWeEvaluate from './components/WhatWeEvaluate'
import ReviewLifecycle from './components/ReviewLifecycle'
import SourceProfileProof from './components/SourceProfileProof'
import ThreeTrustLayers from './components/ThreeTrustLayers'
import ChangesCorrectionsChallenges from './components/ChangesCorrectionsChallenges'
import EditorialIndependence from './components/EditorialIndependence'
import MethodologyVersionHistory from './components/MethodologyVersionHistory'
import FrequentlyAskedQuestions from './components/FrequentlyAskedQuestions'
import TrustInspectCta from './components/TrustInspectCta'


export default function page() {
  return (
    <main>
        <Hero />
        <ApprovedPublicRatings />
        <WhatWeEvaluate />
        <ReviewLifecycle />
        <SourceProfileProof />
        <ThreeTrustLayers />
        <ChangesCorrectionsChallenges />
        <EditorialIndependence />
        <MethodologyVersionHistory />
        <FrequentlyAskedQuestions />
        <TrustInspectCta />
    </main>
  )
}
