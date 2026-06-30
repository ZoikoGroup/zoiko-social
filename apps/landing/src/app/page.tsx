import { Nav } from '@/components/nav'
import { Hero } from '@/components/hero'
import { Features } from '@/components/features'
import { Modules } from '@/components/modules'
import { Waitlist } from '@/components/waitlist'
import { Footer } from '@/components/footer'

export default function LandingPage(): React.JSX.Element {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Features />
        <Modules />
        <Waitlist />
      </main>
      <Footer />
    </>
  )
}
