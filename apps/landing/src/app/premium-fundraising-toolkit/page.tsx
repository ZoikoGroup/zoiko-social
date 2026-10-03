import React from 'react'
import FundraisingHero from './components/FundraisingHero'
import CampaignJourney from './components/CampaignJourney'
import ExampleCampaigns from './components/ExampleCampaigns'
import TrackingFeatures from './components/TrackingFeatures'
import PremiumPlans from './components/PremiumPlans'
import FundraisingCTA from './components/FundraisingCTA'

export default function page() {
  return (
    <main>
        <FundraisingHero />
        <CampaignJourney />
        <ExampleCampaigns />
        <TrackingFeatures />
        <PremiumPlans />
        <FundraisingCTA />
    </main>
  )
}
