import type { Metadata } from 'next'
import {
  HandHeart, Search, PawPrint, MapPin, Eye, ListChecks,
} from 'lucide-react'
import { DocHeader, JumpLinks, H2, P, Strong, Callout, Steps, FeatureGrid } from '../_components/Prose'
import { DocsFooterNav } from '../_components/DocsFooterNav'

export const metadata: Metadata = { title: 'Adoption & Lost and Found' }

export default function AdoptionAndLostFoundPage(): React.JSX.Element {
  return (
    <>
      <DocHeader
        icon={HandHeart}
        eyebrow="Adoption"
        title="Adoption & Lost and Found"
        lead="Rehoming a pet responsibly, applying to adopt, and reporting or finding a lost pet — with animal welfare built into every step."
      />

      <JumpLinks
        items={[
          { href: '#browsing-adoption-listings', label: 'Browsing listings' },
          { href: '#applying-to-adopt', label: 'Applying to adopt' },
          { href: '#listing-a-pet-for-adoption', label: 'Listing a pet' },
          { href: '#reporting-a-lost-pet', label: 'Reporting a lost pet' },
          { href: '#reporting-a-sighting', label: 'Reporting a sighting' },
          { href: '#reviewing-matches', label: 'Reviewing potential matches' },
        ]}
      />

      <H2 id="browsing-adoption-listings">Browsing adoption listings</H2>
      <P>
        The <Strong>Adoption</Strong> section is a dedicated space for rehoming — separate from the Shop,
        which is for pet products. Browse listings by species, breed, age, and location to find a pet
        that’s the right fit for your home.
      </P>
      <FeatureGrid
        items={[
          { icon: Search, title: 'Browse & filter', body: 'Narrow listings down by species, breed, age, size, and location.' },
          { icon: PawPrint, title: 'Listing details', body: 'Each listing includes photos, a description, and background on the pet\'s history where known.' },
        ]}
      />

      <H2 id="applying-to-adopt">Applying to adopt</H2>
      <Steps
        items={[
          { title: 'Open a listing that interests you', body: 'Read through the full listing, including any notes from the lister about temperament or care needs.' },
          { title: 'Send an enquiry', body: 'Message the lister directly through the listing to ask questions or express interest.' },
          { title: 'Keep the conversation going', body: 'Enquiries open a dedicated message thread with the lister, so you can work out details like a meet-and-greet.' },
        ]}
      />
      <Callout variant="tip">
        Take your time. A good adoption match benefits everyone involved — you, the pet, and the person
        rehoming them.
      </Callout>

      <H2 id="listing-a-pet-for-adoption">Listing a pet for adoption</H2>
      <P>
        If you need to rehome a pet, create a listing with clear, honest details: their history,
        temperament, health needs, and why they need a new home. This helps potential adopters make an
        informed decision and sets the pet up for a home that’s actually a good fit.
      </P>
      <Callout variant="safety" title="Animal welfare comes first">
        Every adoption listing goes through the same safety review as all content on ZoikoSocial.
        Listings that show signs of neglect, trafficking, or exploitation are removed and escalated —
        this isn’t a marketplace for treating animals as commodities.
      </Callout>

      <H2 id="reporting-a-lost-pet">Reporting a lost pet</H2>
      <P>
        The <Strong>Lost &amp; Found</Strong> section exists for exactly the moment you hope never happens.
        Create a report as soon as you notice your pet is missing:
      </P>
      <Steps
        items={[
          { title: 'Add a recent photo', body: 'A clear, recent photo makes your pet recognizable to people in the area.' },
          { title: 'Set the last-seen location', body: 'Pin the location and time your pet was last seen — this is what powers nearby matching.' },
          { title: 'Describe identifying details', body: 'Collar, microchip, markings, and temperament all help someone confirm a sighting.' },
        ]}
      />

      <H2 id="reporting-a-sighting">Reporting a sighting or a found pet</H2>
      <P>
        Spotted a pet that looks lost, or found one wandering? File a <Strong>found</Strong> report the same
        way — with a photo and location — so it can be checked against active lost-pet reports in the
        area.
      </P>
      <FeatureGrid
        items={[
          { icon: MapPin, title: 'Geo-tagged reports', body: 'Reports carry a location, so nearby sightings are easy to surface.' },
          { icon: Eye, title: 'Add a sighting', body: 'Already-open reports can collect multiple sightings as more people spot the same animal.' },
        ]}
      />

      <H2 id="reviewing-matches">Reviewing potential matches</H2>
      <P>
        ZoikoSocial compares lost and found reports for you and surfaces <Strong>potential matches</Strong> —
        found reports that might be your missing pet, or lost reports that might match an animal you
        found. Review each candidate and reach out through the report to confirm.
      </P>
      <Callout variant="tip">
        <ListChecks className="w-3.5 h-3.5 inline -mt-0.5 mr-1 text-primary" aria-hidden />
        New reports are automatically checked against open reports nearby, so a match can surface
        without you having to search manually.
      </Callout>

      <DocsFooterNav currentSlug="adoption-and-lost-found" />
    </>
  )
}
