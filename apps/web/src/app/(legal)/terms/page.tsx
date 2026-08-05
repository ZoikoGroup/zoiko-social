import type { Metadata } from 'next'
import Link from 'next/link'
import { Scale } from 'lucide-react'
import { DocHeader, H2, P, UL, LI, Strong, Callout } from '../../docs/_components/Prose'

export const metadata: Metadata = { title: 'Terms of Service' }

const LAST_UPDATED = '5 August 2026'

export default function TermsPage(): React.JSX.Element {
  return (
    <>
      <DocHeader
        icon={Scale}
        eyebrow="Legal"
        title="Terms of Service"
        lead={`The terms governing your use of ZoikoSocial. Last updated ${LAST_UPDATED}.`}
      />

      <Callout variant="warning" title="Draft — pending legal review">
        This document describes how ZoikoSocial actually operates today, written so
        counsel has something concrete to review. It has <Strong>not</Strong> been
        reviewed by a lawyer and is not a binding agreement yet. Sections marked{' '}
        <Strong>[TO BE COMPLETED BY COUNSEL]</Strong>{' '}
        need decisions only Zoiko
        Media Corp&rsquo;s legal advisers can make.
      </Callout>

      <H2 id="who-we-are">1. Who we are</H2>
      <P>
        ZoikoSocial is operated by <Strong>Zoiko Media Corp</Strong>, 1401 21st
        Street, Suite R, Sacramento, CA 95811, United States. In these terms,
        &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;ZoikoSocial&rdquo; mean that
        company; &ldquo;you&rdquo; means the person using the service.
      </P>

      <H2 id="what-zoikosocial-is">2. What ZoikoSocial is</H2>
      <P>
        ZoikoSocial is a social platform for animal welfare, climate, environment,
        science and technology. It provides profiles for people and their animals,
        a feed, communities, messaging and calls, events, adoption and lost-and-found
        listings, a service-provider directory, a marketplace, and vetted news.
      </P>
      <P>
        We may add, change or remove features. Where a change materially reduces
        what you can do with the service, we will give notice as described in
        section 12.
      </P>

      <H2 id="eligibility">3. Eligibility and your account</H2>
      <UL>
        <LI>
          You must be old enough to form a binding contract where you live.{' '}
          <Strong>[TO BE COMPLETED BY COUNSEL — minimum age, and whether under-18
          accounts are permitted with guardian consent]</Strong>
        </LI>
        <LI>You must give accurate registration information and keep it current.</LI>
        <LI>
          You are responsible for activity under your account and for keeping your
          credentials secure. Tell us promptly if you believe your account has been
          compromised.
        </LI>
        <LI>One person, one account. Do not impersonate anyone.</LI>
      </UL>

      <H2 id="community-rules">4. Community rules</H2>
      <P>
        These are not aspirations — they are conditions of using ZoikoSocial, and
        they are enforced automatically as well as by human review.
      </P>
      <UL>
        <LI>
          <Strong>No profanity.</Strong> ZoikoSocial is profanity-free by design.
          This applies to every surface: posts, comments, direct messages,
          usernames, community names, event titles, listings and news submissions.
          Content that fails this check is refused at the point of posting.
        </LI>
        <LI>
          <Strong>Animal welfare comes first.</Strong> Content promoting cruelty,
          neglect, unsafe handling, illegal trade or unlicensed breeding is
          prohibited. Animal welfare takes priority over engagement, reach and
          monetisation.
        </LI>
        <LI>
          <Strong>No harassment, abuse or impersonation</Strong> of people or
          organisations.
        </LI>
        <LI>
          <Strong>News must be sourced.</Strong> News submissions carry a source
          and a tier, and are subject to review and correction.
        </LI>
        <LI>
          <Strong>No fraudulent listings.</Strong> This includes fake adoption
          listings, fabricated lost-pet reward claims, misrepresented professional
          credentials and misrepresented goods.
        </LI>
        <LI>
          <Strong>Do not distribute distressing animal footage</Strong> without the
          gating and context the platform requires.
        </LI>
      </UL>

      <H2 id="your-content">5. Your content</H2>
      <P>
        You keep ownership of what you post. By posting, you grant us a
        non-exclusive, worldwide, royalty-free licence to host, store, reproduce
        and display that content for the purpose of operating and improving the
        service, and to the extent needed to show it to the audience you chose.
        That licence ends when you delete the content, except where it has already
        been shared onward by others or where we must retain it for the reasons in
        section 9.
      </P>
      <P>
        You are responsible for having the rights to what you post, including
        photographs of animals and people.
      </P>

      <H2 id="moderation">6. Moderation and enforcement</H2>
      <P>
        Anyone can report a post, comment, message, account, adoption listing,
        lost-and-found report, event, product, provider listing, breeding profile
        or community. Reports are reviewed and can result in the content being
        removed, or the account being warned, suspended or banned.
      </P>
      <P>
        Every enforcement action taken by our staff is recorded in an audit log.
      </P>
      <Callout variant="note">
        An appeals process is planned but not yet built. Until it exists, if you
        believe an enforcement decision was wrong, contact us using the details in
        section 13.
      </Callout>

      <H2 id="animal-health-records">7. Animal health records</H2>
      <P>
        The Health Passport lets you record vaccinations, vet visits, medications,
        allergies and weight for your animals, and share a read-only card for a
        single animal by link or QR code. You control who has that link and can
        revoke it at any time, which immediately invalidates it.
      </P>
      <P>
        These records are for your own use and for sharing with people you choose.
        They are not a medical record maintained by a veterinary practice, and
        ZoikoSocial does not provide veterinary advice. Always consult a qualified
        veterinarian.
      </P>

      <H2 id="professionals-and-commerce">8. Professionals, bookings and the marketplace</H2>
      <UL>
        <LI>
          Professional and organisation accounts may be required to verify their
          credentials before appearing in the directory or listing services.
        </LI>
        <LI>
          Bookings, adoptions and sales are agreements <Strong>between users</Strong>.
          ZoikoSocial provides the means to find each other and communicate; we are
          not a party to those agreements and do not guarantee any outcome.
        </LI>
        <LI>
          Reviews must reflect genuine experience. Incentivised or retaliatory
          reviews may be removed.
        </LI>
        <LI>
          <Strong>[TO BE COMPLETED BY COUNSEL — refunds, chargebacks, seller
          obligations, and consumer-protection terms for the marketplace]</Strong>
        </LI>
      </UL>

      <H2 id="suspension">9. Suspension, termination and retention</H2>
      <P>
        You can deactivate your account at any time, which hides you and your
        content; signing back in restores it. You can also delete your account
        permanently.
      </P>
      <P>
        We may suspend or terminate an account that breaks these terms, or where we
        are required to by law.
      </P>
      <P>
        <Strong>[TO BE COMPLETED BY COUNSEL — how long data is retained after
        deletion, and what must be kept for legal, safety or audit reasons]</Strong>
      </P>

      <H2 id="disclaimers">10. Disclaimers and liability</H2>
      <P>
        ZoikoSocial is provided as-is. We do not warrant that it will be
        uninterrupted or error-free, and we do not verify user content except as
        described in section 6.
      </P>
      <P>
        Nothing on ZoikoSocial is veterinary, medical, legal or financial advice.
      </P>
      <P>
        <Strong>[TO BE COMPLETED BY COUNSEL — warranty disclaimers, limitation of
        liability, and indemnity, drafted for each jurisdiction where the service
        is offered]</Strong>
      </P>

      <H2 id="governing-law">11. Governing law and disputes</H2>
      <P>
        <Strong>[TO BE COMPLETED BY COUNSEL — governing law, venue, and whether
        arbitration or a class-action waiver applies]</Strong>
      </P>

      <H2 id="changes">12. Changes to these terms</H2>
      <P>
        We may update these terms. When a change is material we will give notice in
        the app before it takes effect. Continuing to use ZoikoSocial after a change
        takes effect means you accept the updated terms.
      </P>

      <H2 id="contact">13. Contact</H2>
      <P>
        Zoiko Media Corp, 1401 21st Street, Suite R, Sacramento, CA 95811, United
        States.
      </P>
      <P>
        <Strong>[TO BE COMPLETED — the contact address for legal notices and for
        terms enquiries]</Strong>
      </P>

      <Callout variant="note" title="Related">
        See our{' '}
        <Link href="/privacy" className="text-primary font-medium hover:underline">
          Privacy Policy
        </Link>{' '}
        for how we handle your data, and the{' '}
        <Link href="/docs/safety-and-trust" className="text-primary font-medium hover:underline">
          Safety &amp; Trust
        </Link>{' '}
        guide for how reporting, blocking and muting work in practice.
      </Callout>
    </>
  )
}
