import type { Metadata } from 'next'
import Link from 'next/link'
import {
  PawPrint, User, BookHeart, BadgeCheck, Lock,
} from 'lucide-react'
import { DocHeader, JumpLinks, H2, P, UL, LI, Strong, Callout, Steps, FeatureGrid, DocTable } from '../_components/Prose'
import { DocsFooterNav } from '../_components/DocsFooterNav'

export const metadata: Metadata = { title: 'Profiles & Pet Passport' }

export default function ProfileAndPetsPage(): React.JSX.Element {
  return (
    <>
      <DocHeader
        icon={PawPrint}
        eyebrow="Profiles & Pets"
        title="Profiles & Pet Passport"
        lead="Your human profile, your pets' profiles, their Pet Diary and Health Passport, and how to go professional."
      />

      <JumpLinks
        items={[
          { href: '#your-profile', label: 'Your profile' },
          { href: '#pet-profiles', label: 'Pet profiles' },
          { href: '#pet-diary', label: 'Pet Diary' },
          { href: '#health-passport', label: 'Health Passport' },
          { href: '#sharing-health-records', label: 'Sharing health records' },
          { href: '#pet-passport-lookup', label: 'Public Pet Passport link' },
          { href: '#professional-verification', label: 'Professional verification' },
          { href: '#privacy-controls', label: 'Privacy controls' },
        ]}
      />

      <H2 id="your-profile">Your profile</H2>
      <P>
        Your profile is your identity as a human on ZoikoSocial. It’s separate from any pets you add —
        think of it as the “owner” account that all of your pets, posts, and activity hang off of.
      </P>
      <FeatureGrid
        items={[
          { icon: User, title: 'Display name & username', body: "Your display name is shown on posts and comments; your username is your unique @handle." },
          { icon: BookHeart, title: 'Bio & avatar', body: 'A short bio and a profile photo help people recognize you across the platform.' },
          { icon: Lock, title: 'Privacy level', body: 'Choose how visible your profile and activity are — see Privacy controls below.' },
          { icon: BadgeCheck, title: 'Verification badge', body: 'Professionals and organizations can display a verified badge once approved.' },
        ]}
      />
      <P>
        Edit any of these from <Strong>Profile → Edit Profile</Strong>, or from{' '}
        <Link href="/settings" className="text-primary font-medium hover:underline">Settings → Account</Link>.
      </P>

      <H2 id="pet-profiles">Pet profiles</H2>
      <P>
        Every animal in your life can have their own profile — dogs, cats, birds, reptiles, small
        mammals, and more. A pet profile holds their name, species, breed, photos, and life status,
        and acts as the home for their Pet Diary and Health Passport.
      </P>
      <Steps
        items={[
          { title: 'Go to Pet Diary or your Profile', body: 'Choose "Add a pet" and fill in the basics.' },
          { title: 'Add photos and a short bio', body: "Give your pet's profile some personality — this is what people following your account will see." },
          { title: 'Set their privacy level', body: 'Public pet profiles can be discovered and followed; private ones are visible only to people you approve.' },
        ]}
      />
      <Callout variant="tip">
        You can create as many pet profiles as you like, and switch between them when posting, logging
        diary entries, or updating health records.
      </Callout>

      <H2 id="pet-diary">Pet Diary</H2>
      <P>
        Pet Diary is a running, chronological journal for each pet — a place to record the moments that
        matter, separate from your public posts.
      </P>
      <UL>
        <LI><Strong>Milestones</Strong> — first walk, adoption day, birthdays, and other life events.</LI>
        <LI><Strong>Weight tracking</Strong> — log weigh-ins over time and see them plotted on a simple chart, useful for spotting trends between vet visits.</LI>
        <LI><Strong>Reminders</Strong> — set reminders for things like medication, grooming, or upcoming vet appointments.</LI>
        <LI><Strong>Photos and video</Strong> — attach media directly to any diary entry.</LI>
        <LI><Strong>Sharing</Strong> — share a diary entry, or the whole diary, with family, a sitter, or a co-owner.</LI>
      </UL>

      <H2 id="health-passport">Health Passport</H2>
      <P>
        Health Passport is your pet’s medical record, kept separate from the more casual Pet Diary so
        that anything health-related stays organized and easy to find in an emergency.
      </P>
      <DocTable
        headers={['Record type', 'What it covers']}
        rows={[
          ['Vaccinations', 'Vaccine type, date administered, and next-due reminders.'],
          ['Vet visits', 'Visit dates, reasons, and notes from checkups or treatments.'],
          ['Medications', 'Current and past medications, dosage, and schedule.'],
        ]}
      />
      <Callout variant="safety" title="This is sensitive information">
        Health records are private by default. Only you — and anyone you explicitly share them with —
        can see a pet’s Health Passport.
      </Callout>

      <H2 id="sharing-health-records">Sharing health records securely</H2>
      <P>
        If a groomer, sitter, boarding facility, or new vet needs to see your pet’s records, you don’t
        have to hand over full access to your account. Instead, use the sharing option inside Health
        Passport to grant a scoped, revocable view of just that pet’s records.
      </P>
      <UL>
        <LI>Share access is specific to one pet at a time — it never exposes your other pets or your own profile.</LI>
        <LI>You can revoke access at any time from the same screen where you granted it.</LI>
      </UL>

      <H2 id="pet-passport-lookup">The public Pet Passport link</H2>
      <P>
        Every pet also gets a shareable, read-only <Strong>Pet Passport</Strong> link — a simple public page
        showing the essentials (name, photo, and whichever details you choose to include). It’s designed
        for situations where someone needs to quickly verify your pet’s identity or vaccination status
        without needing a ZoikoSocial account of their own — for example, a boarding facility, a groomer,
        or a travel check.
      </P>
      <Callout variant="tip">
        You control exactly what appears on the public Pet Passport page. Anything you don’t explicitly
        choose to share — like your address or full account details — never appears there.
      </Callout>

      <H2 id="professional-verification">Professional verification</H2>
      <P>
        If you’re a veterinarian, trainer, behaviorist, groomer, sitter, or run another pet-related
        business, you can switch your profile into a <Strong>professional profile</Strong>. This unlocks a
        dedicated professional presence and lets you appear in{' '}
        <Link href="/docs/marketplace-and-services#finding-a-provider" className="text-primary font-medium hover:underline">
          provider search
        </Link>
        .
      </P>
      <Steps
        items={[
          { title: 'Choose your professional category', body: 'Pick the category that best matches your services (vet, trainer, groomer, sitter, and more).' },
          { title: 'Submit your professional details', body: 'Fill in your business information so reviewers can confirm you are who you say you are.' },
          { title: 'Wait for review', body: 'Your verification status moves from submitted to verified once approved — you can check your current status any time.' },
          { title: 'Keep your profile up to date', body: 'Update your professional profile as your services or availability change.' },
        ]}
      />
      <Callout variant="note">
        Verification exists to protect the people who rely on your advice or services — it’s not a
        paywall. It just means someone has confirmed you’re a real, accountable professional before you
        can appear as one.
      </Callout>

      <H2 id="privacy-controls">Privacy controls for your profile and pets</H2>
      <P>
        Both your profile and each of your pets’ profiles support their own privacy level, so you can
        keep some things public and others just between family and friends.
      </P>
      <UL>
        <LI><Strong>Public</Strong> — anyone can view the profile and its posts.</LI>
        <LI><Strong>Followers only</Strong> — only people you’ve approved can see full activity.</LI>
        <LI><Strong>Private</Strong> — visible only to you, unless you explicitly share something (like a Pet Passport link).</LI>
      </UL>
      <P>
        Fine-tune these from{' '}
        <Link href="/docs/notifications-and-settings#privacy-settings" className="text-primary font-medium hover:underline">
          Settings → Privacy
        </Link>
        , where you can also manage who can message you, tag you, or find you in search.
      </P>

      <DocsFooterNav currentSlug="profile-and-pets" />
    </>
  )
}
