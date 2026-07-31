import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Rocket, UserPlus, Users, MessageSquare, Bell, LayoutGrid, PawPrint, Newspaper,
  Calendar, HandHeart, Stethoscope,
} from 'lucide-react'
import { DocHeader, JumpLinks, H2, P, UL, LI, Strong, Callout, Steps, FeatureGrid } from '../_components/Prose'
import { DocsFooterNav } from '../_components/DocsFooterNav'

export const metadata: Metadata = { title: 'Getting Started' }

export default function GettingStartedPage(): React.JSX.Element {
  return (
    <>
      <DocHeader
        icon={Rocket}
        eyebrow="Getting Started"
        title="Welcome to ZoikoSocial"
        lead="A quick tour of what ZoikoSocial is, how to set up your account and your first pet profile, and where everything lives."
      />

      <JumpLinks
        items={[
          { href: '#what-is-zoikosocial', label: 'What is ZoikoSocial?' },
          { href: '#creating-your-account', label: 'Creating your account' },
          { href: '#setting-up-your-profile', label: 'Setting up your profile' },
          { href: '#main-navigation', label: 'Finding your way around' },
          { href: '#adding-your-first-pet', label: 'Adding your first pet' },
          { href: '#where-to-go-next', label: 'Where to go next' },
        ]}
      />

      <H2 id="what-is-zoikosocial">What is ZoikoSocial?</H2>
      <P>
        ZoikoSocial is a social platform built specifically for animal lovers, rescuers, veterinarians,
        breeders, and anyone who cares about animal welfare, the environment, science, and technology.
        It brings together the things you’d expect from a modern social app — a feed, stories, groups,
        messaging, video calls, and marketplaces — but everything runs under one set of rules that put
        safety first.
      </P>
      <UL>
        <LI><Strong>Profanity-free by design.</Strong> This standard applies everywhere: posts, comments, direct messages, usernames, community names, and event titles.</LI>
        <LI><Strong>Animal welfare comes first.</Strong> Content and listings that put an animal at risk are never allowed to outrank safety.</LI>
        <LI><Strong>News you can trust.</Strong> The News section focuses on verified, well-sourced animal, environment, science, and technology stories.</LI>
        <LI><Strong>Every safety-relevant action is logged.</Strong> Reports, moderation decisions, and account restrictions are all auditable — nothing happens invisibly.</LI>
      </UL>
      <P>
        You’ll see this philosophy reflected throughout this guide: nearly every feature below has a
        safety or trust angle built in, not bolted on afterward.
      </P>

      <H2 id="creating-your-account">Creating your account</H2>
      <P>
        Head to the sign-up page and choose whichever option is fastest for you:
      </P>
      <Steps
        items={[
          {
            title: 'Choose how you want to sign up',
            body: (
              <>
                Sign up with your email and a password, or use <Strong>Google</Strong>, <Strong>Apple</Strong>, or{' '}
                <Strong>Facebook</Strong> to create your account in one tap. However you sign up, your
                sign-in method can always be used to log back in later.
              </>
            ),
          },
          {
            title: 'Verify your email',
            body: 'If you signed up with email and password, confirm your address using the verification link we send you.',
          },
          {
            title: 'Pick a username',
            body: 'Your username is how people find and @mention you. Like everything else on ZoikoSocial, it has to pass our profanity-free check.',
          },
          {
            title: "You're in",
            body: "You'll land on your Home feed. From here, the fastest way to get value out of ZoikoSocial is to fill out your profile and add a pet.",
          },
        ]}
      />
      <Callout variant="tip" title="Forgot your password?">
        Use the <Strong>Forgot password</Strong> link on the sign-in page to reset it by email — no need to contact
        support for routine password resets.
      </Callout>

      <H2 id="setting-up-your-profile">Setting up your profile</H2>
      <P>
        Your profile is your human identity on the platform — separate from any pet profiles you create.
        From <Strong>Profile</Strong> (or <Strong>Settings → Account</Strong>), you can set:
      </P>
      <UL>
        <LI><Strong>Display name</Strong> — the name people see on your posts and comments.</LI>
        <LI><Strong>Username</Strong> — your unique @handle, checked for availability as you type.</LI>
        <LI><Strong>Bio and avatar</Strong> — a short introduction and a profile photo.</LI>
        <LI><Strong>Privacy level</Strong> — control who can see your activity from <Strong>Settings → Privacy</Strong>.</LI>
      </UL>
      <P>
        If you’re a veterinarian, trainer, groomer, sitter, breeder, or run a pet-related business, you
        can also switch on a <Strong>professional profile</Strong> — see{' '}
        <Link href="/docs/profile-and-pets#professional-verification" className="text-primary font-medium hover:underline">
          Professional verification
        </Link>{' '}
        for details.
      </P>

      <H2 id="main-navigation">Finding your way around</H2>
      <P>
        The top navigation bar (or the bottom tab bar on mobile) is your home base. A few things are
        always within reach:
      </P>
      <FeatureGrid
        items={[
          { icon: LayoutGrid, title: 'Home', body: 'Your personalized feed of posts, stories, and updates from people and communities you follow.' },
          { icon: Users, title: 'Network', body: 'Followers, following, mutual connections, and people you might know.' },
          { icon: MessageSquare, title: 'Messages', body: 'Direct messages, group chats, and calls — with an unread badge when something new arrives.' },
          { icon: Bell, title: 'Alerts', body: 'A running feed of notifications: likes, comments, follows, messages, and more.' },
        ]}
      />
      <P>
        The <Strong>More</Strong> menu (desktop) or the <Strong>+</Strong> button (mobile) opens the full list of
        platform modules:
      </P>
      <UL>
        <LI><Strong>Communities</Strong> — species, local, rescue, and interest-based groups.</LI>
        <LI><Strong>Verified News</Strong> — animal, environment, science, and technology news.</LI>
        <LI><Strong>Events</Strong> — pet birthdays, adoption drives, workshops, and meetups.</LI>
        <LI><Strong>Lost &amp; Found</Strong> — report or search for lost and found pets.</LI>
        <LI><Strong>Adoption &amp; Rescue</Strong> — browse listings or apply to adopt.</LI>
        <LI><Strong>Shop</Strong> — pet products from vetted sellers.</LI>
        <LI><Strong>Pet Care</Strong> and <Strong>Vet Finder</Strong> — book walkers, sitters, groomers, and vets.</LI>
        <LI><Strong>Breeding Match</Strong> — ethical, health-record-verified breeding matches.</LI>
        <LI><Strong>Pet Diary</Strong> and <Strong>Health Passport</Strong> — your pet’s milestones and medical records.</LI>
      </UL>
      <Callout variant="note">
        Every one of these has its own dedicated guide in the sidebar — this page is just the map.
      </Callout>

      <H2 id="adding-your-first-pet">Adding your first pet</H2>
      <P>
        Pet profiles are where ZoikoSocial really comes alive. Go to <Strong>Pet Diary</Strong> or your{' '}
        <Strong>Profile</Strong> and choose <Strong>Add a pet</Strong>. You’ll be asked for the basics — name,
        species, breed, and a photo — and you can fill in the rest over time.
      </P>
      <Steps
        items={[
          { title: 'Add the basics', body: "Name, species, breed, and a profile photo are enough to get started." },
          { title: 'Start their Pet Diary', body: "Log milestones like a first walk, a birthday, or a weight check-in — you can attach photos and videos." },
          { title: 'Build their Health Passport', body: "Add vaccination records, vet visits, and medications so everything lives in one place." },
          { title: 'Decide who can see it', body: "Set your pet's profile to public or private, and share a read-only Pet Passport link with a sitter or vet when needed." },
        ]}
      />
      <P>
        The full walkthrough — including how secure health-record sharing and the public Pet Passport
        link work — is in{' '}
        <Link href="/docs/profile-and-pets" className="text-primary font-medium hover:underline">
          Profiles &amp; Pet Passport
        </Link>
        .
      </P>

      <H2 id="where-to-go-next">Where to go next</H2>
      <P>Depending on what brought you to ZoikoSocial, here’s where to head next:</P>
      <FeatureGrid
        items={[
          { icon: PawPrint, title: 'I want to document my pet', body: 'Read Profiles & Pet Passport for Pet Diary and Health Passport.' },
          { icon: Newspaper, title: 'I want to post and follow people', body: 'Read Feed, Posts & Stories.' },
          { icon: Calendar, title: 'I want to join a community or event', body: 'Read Network, Communities & Events.' },
          { icon: HandHeart, title: 'I want to adopt or rehome a pet', body: 'Read Adoption & Lost and Found.' },
          { icon: Stethoscope, title: 'I need a vet or pet-care provider', body: 'Read Shop, Providers & Bookings.' },
          { icon: UserPlus, title: 'I want to switch to a professional profile', body: 'Read Professional verification in Profiles & Pet Passport.' },
        ]}
      />

      <DocsFooterNav currentSlug="getting-started" />
    </>
  )
}
