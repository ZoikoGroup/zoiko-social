import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ShieldCheck, MessageSquareOff, ClipboardCheck, VolumeX, Scale, Lock, Download, Trash2,
} from 'lucide-react'
import { DocHeader, JumpLinks, H2, P, UL, LI, Strong, Callout, Steps, FeatureGrid, DocTable } from '../_components/Prose'
import { DocsFooterNav } from '../_components/DocsFooterNav'

export const metadata: Metadata = { title: 'Safety, Privacy & Trust' }

export default function SafetyAndTrustPage(): React.JSX.Element {
  return (
    <>
      <DocHeader
        icon={ShieldCheck}
        eyebrow="Safety & Trust"
        title="Safety, Privacy & Trust"
        lead="The rules that hold ZoikoSocial together: a profanity-free standard, animal welfare above all, and a reporting system with real consequences."
      />

      <JumpLinks
        items={[
          { href: '#profanity-free-standard', label: 'Profanity-free standard' },
          { href: '#animal-welfare-first', label: 'Animal welfare first' },
          { href: '#reporting', label: 'Reporting' },
          { href: '#what-happens-after-you-report', label: 'After you report' },
          { href: '#blocking-and-muting', label: 'Blocking & muting' },
          { href: '#account-restrictions-and-appeals', label: 'Restrictions & appeals' },
          { href: '#privacy-controls', label: 'Privacy controls' },
          { href: '#your-data', label: 'Your data' },
        ]}
      />

      <H2 id="profanity-free-standard">Our profanity-free standard</H2>
      <P>
        ZoikoSocial is a profanity-free platform, and that rule doesn’t have exceptions for “private”
        spaces. It applies to:
      </P>
      <UL>
        <LI>Posts and comments</LI>
        <LI>Direct messages and group chats</LI>
        <LI>Usernames, display names, and bios</LI>
        <LI>Community names, descriptions, and rules</LI>
        <LI>Event titles and descriptions</LI>
        <LI>Marketplace and adoption listings</LI>
      </UL>
      <P>
        Content is checked before it’s published or delivered, not after. If something you write doesn’t
        pass, you’ll be asked to edit it — you’ll always know why.
      </P>

      <H2 id="animal-welfare-first">Animal welfare comes first</H2>
      <P>
        This is the one principle that overrides everything else on the platform, including engagement
        and discovery. Content that shows or promotes animal cruelty, neglect, unsafe handling, or
        trafficking is never allowed to spread — it’s removed, and serious cases are escalated for
        priority review rather than sitting in a normal queue.
      </P>
      <Callout variant="safety" title="If you witness animal cruelty in real life">
        Report it on ZoikoSocial so we can act on the account and content — but for an animal in
        immediate danger, please also contact your local animal control or emergency services directly.
      </Callout>

      <H2 id="reporting">Reporting content or a person</H2>
      <P>
        You’ll find a <Strong>Report</Strong> option on posts, comments, messages, profiles,
        listings, and communities — wherever content can appear, it can be reported.
      </P>
      <Steps
        items={[
          { title: 'Open the report option', body: 'Usually behind a "•••" menu on the content or profile in question.' },
          { title: 'Choose a reason', body: 'Pick the category that best fits — harassment, animal welfare, misinformation, spam, and more.' },
          { title: 'Add context if you can', body: 'A short note helps our reviewers understand what they\'re looking at.' },
          { title: 'Submit', body: 'The report goes straight into our moderation queue — the person you reported is never notified that you\'re the one who filed it.' },
        ]}
      />

      <H2 id="what-happens-after-you-report">What happens after you report</H2>
      <P>
        Every report is reviewed by our Trust &amp; Safety team. Depending on what’s found, the outcome can
        range from no action needed, up to removing content or restricting an account:
      </P>
      <DocTable
        headers={['Outcome', 'What it means']}
        rows={[
          ['No violation found', 'The content stays up; you\'ll see the report marked as reviewed.'],
          ['Content removed', 'The specific post, comment, message, or listing is taken down.'],
          ['Account restricted', 'The account temporarily loses access to posting, messaging, or other features.'],
          ['Account suspended', 'For serious or repeated violations, the account is suspended pending further review.'],
        ]}
      />
      <Callout variant="note">
        <ClipboardCheck className="w-3.5 h-3.5 inline -mt-0.5 mr-1 text-outline" aria-hidden />
        Every moderation decision is logged internally — nothing about how enforcement works is a black
        box on our end, even though the specifics of a given case stay confidential.
      </Callout>

      <H2 id="blocking-and-muting">Blocking & muting</H2>
      <P>
        Reporting isn’t your only tool — you can also take matters into your own hands instantly with
        blocking and muting.
      </P>
      <FeatureGrid
        items={[
          { icon: MessageSquareOff, title: 'Mute someone', body: 'Their posts stop showing up in your feed, quietly, with no notification to them.' },
          { icon: VolumeX, title: 'Block someone', body: 'Cuts off visibility and messaging both ways — they can\'t see your profile or contact you.' },
        ]}
      />
      <P>
        See{' '}
        <Link href="/docs/community-and-events#blocking-and-muting" className="text-primary font-medium hover:underline">
          Blocking &amp; muting in Network, Communities &amp; Events
        </Link>{' '}
        for exactly where to find these controls.
      </P>

      <H2 id="account-restrictions-and-appeals">Account restrictions & appeals</H2>
      <P>
        If your account is restricted or suspended, you’ll be told why and — in almost every case — given
        a way to appeal the decision. An appeal is reviewed by our team, and outcomes can be upheld,
        reversed, or adjusted.
      </P>
      <Callout variant="tip">
        <Scale className="w-3.5 h-3.5 inline -mt-0.5 mr-1 text-primary" aria-hidden />
        Appeals exist because we know automated and manual review both make mistakes sometimes. If you
        believe a decision was wrong, use the appeal option rather than creating a new account — a new
        account doesn’t clear an existing restriction and can create further problems of its own.
      </Callout>

      <H2 id="privacy-controls">Your privacy controls</H2>
      <P>
        <Lock className="w-4 h-4 inline -mt-0.5 mr-1.5 text-primary" aria-hidden />
        Beyond your profile’s overall privacy level (covered in{' '}
        <Link href="/docs/profile-and-pets#privacy-controls" className="text-primary font-medium hover:underline">
          Profiles &amp; Pet Passport
        </Link>
        ), <Strong>Settings → Privacy</Strong> lets you fine-tune who can message you, tag you, find you in
        search, and see your followers and following lists.
      </P>

      <H2 id="your-data">Your data</H2>
      <FeatureGrid
        items={[
          { icon: Download, title: 'Download your data', body: 'Request an export of your account data from Settings → Help & About.' },
          { icon: Trash2, title: 'Delete your account', body: 'A permanent action, covered step by step in Notifications & Account Settings.' },
        ]}
      />
      <P>
        For the full walkthrough of deleting your account, see{' '}
        <Link href="/docs/notifications-and-settings#deleting-your-account" className="text-primary font-medium hover:underline">
          Notifications &amp; Account Settings
        </Link>
        .
      </P>

      <DocsFooterNav currentSlug="safety-and-trust" />
    </>
  )
}
