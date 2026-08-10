import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { HelpCircle, ChevronDown } from 'lucide-react'
import { DocHeader, JumpLinks, H2, Strong } from '../_components/Prose'
import { DocsFooterNav } from '../_components/DocsFooterNav'

export const metadata: Metadata = { title: 'FAQ & Troubleshooting' }

function FaqItem({ q, children }: { q: string; children: ReactNode }): React.JSX.Element {
  return (
    <details className="group border border-outline-variant/30 rounded-xl mb-3 open:bg-surface-container-lowest open:border-primary/20">
      <summary className="flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer list-none font-semibold text-on-surface text-[14.5px] [&::-webkit-details-marker]:hidden">
        {q}
        <ChevronDown className="w-4 h-4 text-outline flex-shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-4 pb-4 -mt-1 text-[13.5px] text-on-surface-variant leading-relaxed">{children}</div>
    </details>
  )
}

export default function FaqPage(): React.JSX.Element {
  return (
    <>
      <DocHeader
        icon={HelpCircle}
        eyebrow="FAQ"
        title="FAQ & Troubleshooting"
        lead="Quick answers to the questions people ask most. If yours isn't here, every question links out to the full guide it belongs to."
      />

      <JumpLinks
        items={[
          { href: '#account-basics', label: 'Account basics' },
          { href: '#pets-and-content', label: 'Pets & content' },
          { href: '#safety-and-privacy', label: 'Safety & privacy' },
          { href: '#calls-and-messaging', label: 'Calls & messaging' },
          { href: '#troubleshooting', label: 'Troubleshooting' },
        ]}
      />

      <H2 id="account-basics">Account basics</H2>

      <FaqItem q="Is ZoikoSocial free to use?">
        <p>
          Yes — creating an account, following people, posting, joining communities, and messaging are
          all free. Optional plan details live under{' '}
          <Strong>Settings → Help &amp; About → Billing &amp; Subscriptions</Strong>.
        </p>
      </FaqItem>

      <FaqItem q="Do I need to own a pet to use ZoikoSocial?">
        <p>
          No. You can follow Verified News, join communities around climate, science, or technology, and
          participate in discussions without ever adding a pet profile. Pet profiles are there for when
          you’re ready to use them.
        </p>
      </FaqItem>

      <FaqItem q="I forgot my password. Now what?">
        <p>
          Use the <Strong>Forgot password</Strong> link on the sign-in page to reset it by email. See{' '}
          <Link href="/docs/getting-started#creating-your-account" className="text-primary font-medium hover:underline">
            Creating your account
          </Link>{' '}
          for the full sign-up and sign-in flow.
        </p>
      </FaqItem>

      <FaqItem q="How do I switch to a professional profile?">
        <p>
          From your profile, choose the option to switch to a professional profile, pick your category,
          and submit your details for review. Full walkthrough:{' '}
          <Link href="/docs/profile-and-pets#professional-verification" className="text-primary font-medium hover:underline">
            Professional verification
          </Link>
          .
        </p>
      </FaqItem>

      <FaqItem q="How do I delete my account?">
        <p>
          From <Strong>Settings → Account</Strong>, and you’ll need to type your username to confirm — it’s
          permanent. Details in{' '}
          <Link href="/docs/notifications-and-settings#deleting-your-account" className="text-primary font-medium hover:underline">
            Deleting your account
          </Link>
          .
        </p>
      </FaqItem>

      <H2 id="pets-and-content">Pets & content</H2>

      <FaqItem q="Why was I asked to edit my post or comment before it posted?">
        <p>
          ZoikoSocial checks text against its profanity-free standard before anything is published or
          delivered. If something doesn’t pass, you’re asked to revise it — nothing is silently removed
          after the fact. See{' '}
          <Link href="/docs/safety-and-trust#profanity-free-standard" className="text-primary font-medium hover:underline">
            Our profanity-free standard
          </Link>
          .
        </p>
      </FaqItem>

      <FaqItem q="Is my pet's Health Passport data private?">
        <p>
          Yes — health records are private by default. You can share a specific pet’s records with a
          sitter, groomer, or new vet using scoped, revocable sharing, without exposing your full
          account. See{' '}
          <Link href="/docs/profile-and-pets#sharing-health-records" className="text-primary font-medium hover:underline">
            Sharing health records securely
          </Link>
          .
        </p>
      </FaqItem>

      <FaqItem q="Can I change my display currency?">
        <p>
          Yes, from <Strong>Settings → Preferences</Strong> — it applies to Shop prices and provider
          bookings.
        </p>
      </FaqItem>

      <FaqItem q="Can I browse adoption listings without listing a pet myself?">
        <p>
          Absolutely — browsing, applying, and messaging listers is completely independent of whether
          you ever create a listing of your own. See{' '}
          <Link href="/docs/adoption-and-lost-found#browsing-adoption-listings" className="text-primary font-medium hover:underline">
            Browsing adoption listings
          </Link>
          .
        </p>
      </FaqItem>

      <H2 id="safety-and-privacy">Safety & privacy</H2>

      <FaqItem q="How do I report animal cruelty or abuse?">
        <p>
          Use the Report option on the post, listing, or profile in question and choose the animal
          welfare category — these reports are escalated for priority review. See{' '}
          <Link href="/docs/safety-and-trust#animal-welfare-first" className="text-primary font-medium hover:underline">
            Animal welfare comes first
          </Link>
          . If an animal is in immediate danger, please also contact local animal control or emergency
          services directly.
        </p>
      </FaqItem>

      <FaqItem q="What's the difference between blocking and muting?">
        <p>
          Muting quietly stops someone’s posts from showing in your feed; blocking cuts off visibility
          and messaging in both directions. Full comparison:{' '}
          <Link href="/docs/safety-and-trust#blocking-and-muting" className="text-primary font-medium hover:underline">
            Blocking &amp; muting
          </Link>
          .
        </p>
      </FaqItem>

      <FaqItem q="Why can't I see someone's post or profile anymore?">
        <p>
          A few possibilities: they’ve set their account to private and you’re not approved as a
          follower, you’ve muted or blocked each other, or the content was removed for a policy
          violation. It generally isn’t a bug.
        </p>
      </FaqItem>

      <H2 id="calls-and-messaging">Calls & messaging</H2>

      <FaqItem q="Do I need to install anything for audio or video calls?">
        <p>
          No — calls run directly in your browser. Just start a call from any conversation. See{' '}
          <Link href="/docs/messaging-and-calls#audio-and-video-calls" className="text-primary font-medium hover:underline">
            Audio &amp; video calls
          </Link>
          .
        </p>
      </FaqItem>

      <FaqItem q="Someone I don't follow messaged me — where did it go?">
        <p>
          It’s waiting in your <Strong>message requests</Strong>, not your main inbox, until you decide to
          accept or decline it. See{' '}
          <Link href="/docs/messaging-and-calls#message-requests" className="text-primary font-medium hover:underline">
            Message requests
          </Link>
          .
        </p>
      </FaqItem>

      <H2 id="troubleshooting">Troubleshooting</H2>

      <FaqItem q="The app feels stuck, or a page won't load.">
        <p>
          Start with a refresh, and check your internet connection. If that doesn’t help, try signing
          out and back in — this clears up the vast majority of loading issues.
        </p>
      </FaqItem>

      <FaqItem q="My notification count doesn't match what I actually see.">
        <p>
          Open the Notification Center and use <Strong>mark all as read</Strong> — this resyncs the count.
          If it keeps drifting, a refresh usually clears it.
        </p>
      </FaqItem>

      <FaqItem q="None of this answered my question.">
        <p>
          Head to <Strong>Settings → Help &amp; About → Contact Support</Strong> and our team will pick it up
          from there.
        </p>
      </FaqItem>

      <DocsFooterNav currentSlug="faq" />
    </>
  )
}
