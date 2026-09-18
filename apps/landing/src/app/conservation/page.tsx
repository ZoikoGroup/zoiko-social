import React from 'react'
import ConservationNewsHero from './components/ConservationNewsHero'
import ConservationBrief from './components/ConservationBrief'
import ConservationFeed from './components/ConservationFeed'
import ConservationStatusTracker from './components/ConservationStatusTracker'
import EvidenceLabels from './components/EvidenceLabels'
import SourceStandards from './components/SourceStandards'
import RelatedCommunityDiscussion from './components/RelatedCommunityDiscussion'
import ConservationDigest from './components/ConservationDigest'
import ConservationFAQ from './components/ConservationFAQ'


export default function page() {
  return (
    <main>
        <ConservationNewsHero />
        <ConservationBrief />
        <ConservationFeed />
        <ConservationStatusTracker />
        <EvidenceLabels />
        <SourceStandards />
        <RelatedCommunityDiscussion />
        <ConservationDigest />
        <ConservationFAQ />
    </main>
  )
}
