import React from 'react'
import PrivacyHero from './components/PrivacyHero'
import PrivacyLevels from './components/PrivacyLevels'
import PrivacyControls from './components/PrivacyControls'
import PrivacyChanges from './components/PrivacyChanges'
import PremiumPlans from './components/PremiumPlans'

export default function page() {
  return (
    <main>
        <PrivacyHero />
        <PrivacyLevels />
        <PrivacyControls />
        <PrivacyChanges />
        <PremiumPlans />
    </main>
  )
}
