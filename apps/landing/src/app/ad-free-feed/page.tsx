import React from 'react'
import AdFreeFeed from './components/AdFreeFeed'
import AdFreeContent from './components/AdFreeContent'
import PremiumBenefits from './components/PremiumBenefits'
import AdFreeChanges from './components/AdFreeChanges'
import CheckAccess from './components/CheckAccess'
import PremiumPlans from './components/PremiumPlans'
import AdFreeFaq from './components/AdFreeFaq'

export default function page() {
  return (
    <main>
        <AdFreeFeed />
        <AdFreeContent />
        <PremiumBenefits />
        <AdFreeChanges />
        <CheckAccess />
        <PremiumPlans />
        <AdFreeFaq />
    </main>
  )
}
