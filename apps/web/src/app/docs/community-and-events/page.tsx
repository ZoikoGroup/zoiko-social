import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Users, UserPlus, UserCheck, VolumeX, Ban, Shield, Calendar, CalendarCheck,
} from 'lucide-react'
import { DocHeader, JumpLinks, H2, P, UL, LI, Strong, Callout, Steps, FeatureGrid, DocTable } from '../_components/Prose'
import { DocsFooterNav } from '../_components/DocsFooterNav'

export const metadata: Metadata = { title: 'Network, Communities & Events' }

export default function CommunityAndEventsPage(): React.JSX.Element {
  return (
    <>
      <DocHeader
        icon={Users}
        eyebrow="Community"
        title="Network, Communities & Events"
        lead="Following people, joining communities, and hosting or attending events built for animal lovers."
      />

      <JumpLinks
        items={[
          { href: '#following-and-connections', label: 'Following & connections' },
          { href: '#blocking-and-muting', label: 'Blocking & muting' },
          { href: '#communities', label: 'Communities' },
          { href: '#community-roles', label: 'Roles & moderation' },
          { href: '#events', label: 'Events' },
        ]}
      />

      <H2 id="following-and-connections">Following & connections</H2>
      <P>
        The <Strong>Network</Strong> tab is your hub for connections. From there you can:
      </P>
      <FeatureGrid
        items={[
          { icon: UserPlus, title: 'Follow', body: 'Follow a person, pet, or organization to see their posts in your Home feed.' },
          { icon: UserCheck, title: 'Follow requests', body: 'If an account is private, your follow becomes a request until they approve it.' },
          { icon: Users, title: 'Followers & following', body: 'See who follows you, who you follow, and your mutual connections with anyone.' },
          { icon: UserPlus, title: 'Suggestions', body: 'Get suggested accounts based on your interests, pets, and existing connections.' },
        ]}
      />
      <P>
        You can also search directly for people, pets, and organizations from the search bar at the top
        of the app.
      </P>

      <H2 id="blocking-and-muting">Blocking & muting</H2>
      <DocTable
        headers={['Action', 'What happens']}
        rows={[
          ['Mute', 'Their posts stop appearing in your feed, but they’re not notified and can still see and interact with your content.'],
          ['Block', 'Neither of you can see each other’s profiles, posts, or send messages. They are not notified that they’ve been blocked.'],
        ]}
      />
      <Callout variant="tip">
        Muting is the quieter option when you just want less of someone in your feed. Blocking is the
        stronger option when you want to cut off contact entirely.
      </Callout>

      <H2 id="communities">Communities</H2>
      <P>
        Communities are groups built around a shared interest — a specific species, a local area, a
        rescue network, or a topic like climate or veterinary science. Each community has its own feed,
        member list, and rules.
      </P>
      <Steps
        items={[
          { title: 'Find a community', body: 'Browse or search Communities for one that matches your interests.' },
          { title: 'Join or request to join', body: 'Open communities let you join instantly; some require the moderators to approve your membership request first.' },
          { title: 'Or start your own', body: "If nothing fits, create a community with its own name, description, and rules — all checked for safety before it goes live." },
          { title: 'Invite people', body: 'Share an invite code or link to bring people directly into your community.' },
        ]}
      />

      <H2 id="community-roles">Roles & moderation</H2>
      <P>Every community has clear accountability built in:</P>
      <UL>
        <LI><Strong>Owner</Strong> — created the community and has full control, including transferring ownership.</LI>
        <LI><Strong>Moderator</Strong> — can review membership requests, remove posts, and mute or ban members.</LI>
        <LI><Strong>Member</Strong> — can post, comment, and participate in the community’s feed and chat.</LI>
      </UL>
      <FeatureGrid
        items={[
          { icon: Shield, title: 'Membership requests', body: 'Private communities queue new members for a moderator to approve or decline.' },
          { icon: VolumeX, title: 'Muting a member', body: 'Moderators can silence a disruptive member without removing them entirely.' },
          { icon: Ban, title: 'Banning a member', body: 'Serious or repeated issues can result in a moderator removing someone from the community outright.' },
        ]}
      />

      <H2 id="events">Events</H2>
      <P>
        Events give pet life a proper home on the platform — birthdays, adoption drives, training
        workshops, rescue meetups, and more.
      </P>
      <Steps
        items={[
          { title: 'Create an event', body: 'Set a title, description, date, time, and location (or mark it as virtual).' },
          { title: 'Invite people', body: 'Share the event with your followers or a specific community.' },
          { title: 'Track RSVPs', body: 'See who\'s attending, and manage your attendee list as the host.' },
          { title: 'Host the day of', body: 'Use the event page to keep everyone updated as things get underway.' },
        ]}
      />
      <Callout variant="note">
        Event titles and descriptions go through the same profanity-free check as everything else on
        ZoikoSocial — no exceptions for how an event is named.
      </Callout>
      <FeatureGrid
        items={[
          { icon: Calendar, title: 'Discover events', body: 'Browse upcoming events from your communities and network.' },
          { icon: CalendarCheck, title: 'RSVP', body: 'Let the host know you\'re coming — or mark yourself as interested.' },
        ]}
      />
      <P>
        Looking to adopt or coordinate a rescue effort instead? See{' '}
        <Link href="/docs/adoption-and-lost-found" className="text-primary font-medium hover:underline">
          Adoption &amp; Lost and Found
        </Link>
        .
      </P>

      <DocsFooterNav currentSlug="community-and-events" />
    </>
  )
}
