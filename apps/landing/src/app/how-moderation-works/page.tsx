import React from 'react'
import Hero from './components/Hero'
import ModerationTeams from './components/ModerationTeams'
import ModerationProcess from './components/ModerationProcess'
import Principles from './components/Principles'
import Challenges from './components/Challenges'
import SafetyCta from './components/SafetyCta'

export default function page() {
  return (
    <main>
        <Hero />
        <ModerationTeams />
        <ModerationProcess />
        <Principles />
        <Challenges />
        <SafetyCta />
    </main>
  )
}
