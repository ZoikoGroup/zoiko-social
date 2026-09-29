import React from 'react'
import MarketHero from './components/MarketHero'
import CategoryNav from './components/CategoryNav'
import ProfessionalCare from './components/ProfessionalCare'
import ServicesSupplies from './components/ServicesSupplies'
import MarketGuides from './components/MarketGuides'
import TrustedPartners from './components/TrustedPartners'
import SafetyTransparency from './components/SafetyTransparency'
import MarketFaq from './components/MarketFaq'
import MarketCta from './components/MarketCta'

export default function page() {
  return (
    <main>
        <MarketHero />
        <CategoryNav />
        <ProfessionalCare />
        <ServicesSupplies />
        <MarketGuides />
        <TrustedPartners />
        <SafetyTransparency />
        <MarketFaq />
        <MarketCta />
    </main>
  )
}
