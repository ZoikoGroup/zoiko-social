import React from 'react'
import AdvancedModerationHero from './components/AdvancedModerationHero'
import ModerationActions from './components/ModerationActions'
import ModerationDashboard from './components/ModerationDashboard'
import TeamMemberShowcase from './components/TeamMemberShowcase'
import WhatYouCanDo from './components/WhatYouCanDo'

export default function page() {
  return (
    <main>
        <AdvancedModerationHero />
        <ModerationActions />
        <ModerationDashboard />
        <TeamMemberShowcase />
        <WhatYouCanDo />
    </main>
  )
}
