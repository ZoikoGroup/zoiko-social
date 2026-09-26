import React from 'react'
import Hero from './components/Hero'
import Values from './components/Values'
import Enforce from './components/Enforce'
import Prohibited from './components/Prohibited'
import Rights from './components/Rights'
import AllowedNotAllowed from './components/AllowedNotAllowed'
import GlobalEnforcement from './components/GlobalEnforcement'
import Impact from './components/Impact'
import LearningResources from './components/LearningResources'
import Faq from './components/Faq'
import Commitment from './components/Commitment'

export default function page() {
  return (
    <main>
        <Hero />
        <Values />
        <Enforce />
        <Prohibited />
        <Rights />
        <AllowedNotAllowed />
        <GlobalEnforcement />
        <Impact />
        <LearningResources />
        <Faq />
        <Commitment />
    </main>
  )
}
