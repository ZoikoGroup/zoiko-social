import React from 'react'
import Hero from './components/Hero'
import Rights from './components/Rights'
import WhenAppeal from './components/WhenAppeal'
import AppealTypes from './components/AppealTypes'
import Overturned from './components/Overturned'
import StrongAppeal from './components/StrongAppeal'
import Process from './components/Process'
import Timeline from './components/Timeline'
import Decision from './components/Decision'
import HelpAppeal from './components/HelpAppeal'
import Faq from './components/Faq'
import ReadyAppeal from './components/ReadyAppeal'

export default function page() {
  return (
    <main>
        <Hero />
        <Rights />
        <WhenAppeal />
        <AppealTypes />
        <Overturned />
        <StrongAppeal />
        <Process />
        <Timeline />
        <Decision />
        <HelpAppeal />
        <Faq />
        <ReadyAppeal />
    </main>
  )
}
