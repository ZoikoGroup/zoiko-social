import type { Metadata } from 'next'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { DocHeader, H2, P, UL, LI, Strong, Callout, DocTable } from '../../docs/_components/Prose'

export const metadata: Metadata = { title: 'Privacy Policy' }

const LAST_UPDATED = '5 August 2026'

export default function PrivacyPage(): React.JSX.Element {
  return (
    <>
      <DocHeader
        icon={Lock}
        eyebrow="Legal"
        title="Privacy Policy"
        lead={`What ZoikoSocial collects, why, and who it is shared with. Last updated ${LAST_UPDATED}.`}
      />

      <Callout variant="warning" title="Draft — pending legal review">
        The descriptions of what we collect and which providers process it are
        accurate to how the platform is built today. The legal framing — lawful
        bases, retention periods, and your statutory rights by jurisdiction —{' '}
        <Strong>has not been reviewed by a lawyer</Strong>. Sections marked{' '}
        <Strong>[TO BE COMPLETED BY COUNSEL]</Strong>{' '}
        need decisions only Zoiko
        Media Corp&rsquo;s legal advisers can make.
      </Callout>

      <H2 id="controller">1. Who controls your data</H2>
      <P>
        <Strong>Zoiko Media Corp</Strong>, 1401 21st Street, Suite R, Sacramento,
        CA 95811, United States, is the controller of the personal data described
        here.
      </P>

      <H2 id="what-we-collect">2. What we collect</H2>

      <P>
        <Strong>Information you give us directly</Strong>
      </P>
      <UL>
        <LI>
          <Strong>Account</Strong> — email address, password (stored hashed by our
          authentication provider, never in readable form), and optionally a phone
          number.
        </LI>
        <LI>
          <Strong>Profile</Strong> — name, username, biography, avatar and cover
          images, and your chosen privacy level.
        </LI>
        <LI>
          <Strong>Animal profiles</Strong> — names, species, breed, dates, photos
          and the details you choose to add.
        </LI>
        <LI>
          <Strong>Animal health records</Strong> — vaccinations, vet visits,
          medications, allergies and weight history. See section 5, which treats
          these as sensitive.
        </LI>
        <LI>
          <Strong>Content</Strong> — posts, comments, direct and group messages,
          listings, events, news submissions and reviews.
        </LI>
        <LI>
          <Strong>Location</Strong> — locations you enter on listings, events and
          lost-and-found reports, and coordinates used to fetch local safety
          advisories.
        </LI>
        <LI>
          <Strong>Professional details</Strong> — for verification: category,
          credentials and any documents you upload.
        </LI>
      </UL>

      <P>
        <Strong>Information we collect automatically</Strong>
      </P>
      <UL>
        <LI>
          <Strong>Usage and engagement</Strong> — what you view, like, save, follow
          and open. This is used to rank your feed and to produce analytics for
          professional accounts.
        </LI>
        <LI>
          <Strong>Device and browser</Strong> — derived from your user-agent string
          for analytics purposes.
        </LI>
        <LI>
          <Strong>Connection</Strong> — IP address and timestamps, used for
          security, abuse prevention and rate limiting.
        </LI>
        <LI>
          <Strong>Presence</Strong> — whether you are currently online, shown to
          people you message.
        </LI>
      </UL>

      <H2 id="why">3. Why we use it</H2>
      <DocTable
        headers={['Purpose', 'What it involves']}
        rows={[
          ['Operating your account', 'Authentication, profiles, settings, sessions'],
          ['Delivering content', 'Feed, communities, messaging, calls, notifications'],
          ['Personalisation', 'Ranking your feed and suggesting topics, people and communities based on what you engage with'],
          ['Safety and moderation', 'Automated profanity checks on every submission, report handling, blocking and muting, abuse prevention'],
          ['Local safety advisories', 'Fetching weather and air-quality conditions for coordinates you supply'],
          ['Commerce', 'Bookings, adoption enquiries, marketplace enquiries and, once enabled, payments'],
          ['Analytics for professionals', 'Reach and engagement figures on your own account and posts'],
          ['Legal and security', 'Audit logging of enforcement actions, fraud prevention, meeting legal obligations'],
        ]}
      />
      <P>
        <Strong>[TO BE COMPLETED BY COUNSEL — the lawful basis for each purpose
        above under GDPR and equivalent regimes, and where consent rather than
        legitimate interest is required]</Strong>
      </P>

      <H2 id="processors">4. Who we share it with</H2>
      <P>
        We do <Strong>not</Strong> sell your personal data. We do not currently
        serve advertising, so no data is shared with advertising networks.
      </P>
      <P>
        We use the following service providers, each processing data on our behalf:
      </P>
      <DocTable
        headers={['Provider', 'What it processes', 'Where']}
        rows={[
          ['Supabase', 'Authentication, the main database, and file storage for avatars, post media and chat media', 'United States'],
          ['Upstash (Redis)', 'Caching, presence, rate limiting and background job queues', 'United States'],
          ['LiveKit', 'Real-time audio and video for calls', 'See provider terms'],
          ['Groq', 'Messages you send to the ZoikoSocial AI assistant, in order to generate its replies', 'United States'],
          ['Open-Meteo', 'Coordinates you supply, to return weather and air-quality data for safety advisories', 'European Union'],
          ['Stripe', 'Payment processing — currently not enabled, so no payment data is processed today', 'United States'],
          ['Cloudflare R2', 'Object storage — configured but currently inactive', 'See provider terms'],
        ]}
      />
      <Callout variant="note" title="About the AI assistant">
        Messages you send to the <Strong>@zoikosocial.ai</Strong> assistant are sent
        to Groq to generate a reply. The assistant reads only the conversation you
        are in — never your other conversations — and can act on your own animal
        records only, never anyone else&rsquo;s. Do not send it anything you would
        not want processed by a third-party model provider.
      </Callout>
      <P>
        We may also disclose data where legally required, or to protect the safety
        of people or animals.
      </P>

      <H2 id="health-records">5. Animal health records and sharing links</H2>
      <P>
        Health records are visible only to you unless you share them. The share
        feature produces a link and QR code granting read-only access to{' '}
        <Strong>one animal&rsquo;s</Strong> card — it does not expose your other
        animals or your profile.
      </P>
      <UL>
        <LI>Anyone holding the link can view that card, so share it deliberately.</LI>
        <LI>Revoking access invalidates the old link immediately.</LI>
      </UL>

      <H2 id="your-controls">6. Your controls</H2>
      <UL>
        <LI>
          <Strong>Privacy level</Strong> — make your account private so new
          followers must be approved.
        </LI>
        <LI>
          <Strong>Per-item visibility</Strong> — choose the audience when you post.
        </LI>
        <LI>
          <Strong>Blocking and muting</Strong> — block to cut off contact entirely;
          mute to stop seeing someone without unfollowing.
        </LI>
        <LI>
          <Strong>Messaging privacy</Strong> — control who may message you
          directly; others land in message requests.
        </LI>
        <LI>
          <Strong>Notifications</Strong> — configure what you are notified about.
        </LI>
        <LI>
          <Strong>Deactivate</Strong> — hide your account and content; signing back
          in restores it.
        </LI>
        <LI>
          <Strong>Delete</Strong> — remove your account permanently.
        </LI>
      </UL>
      <Callout variant="note">
        A self-service data export is planned but not yet available. Until it is,
        request a copy of your data using the contact details in section 10.
      </Callout>

      <H2 id="rights">7. Your rights</H2>
      <P>
        Depending on where you live, you may have rights to access, correct, delete,
        restrict or object to our processing of your data, to data portability, and
        to withdraw consent.
      </P>
      <P>
        <Strong>[TO BE COMPLETED BY COUNSEL — the specific rights and response
        timeframes for GDPR, UK GDPR, CCPA/CPRA and other applicable regimes, plus
        how to lodge a complaint with a supervisory authority]</Strong>
      </P>

      <H2 id="retention">8. How long we keep it</H2>
      <P>
        We keep your data for as long as your account is active. Deactivating hides
        your data but does not delete it, so that signing back in restores your
        account. Deleting your account removes your data, subject to records we
        must retain for safety, audit or legal reasons.
      </P>
      <P>
        <Strong>[TO BE COMPLETED BY COUNSEL — concrete retention periods per data
        category, including audit logs and moderation records]</Strong>
      </P>

      <H2 id="security">9. Security</H2>
      <UL>
        <LI>Traffic is encrypted in transit.</LI>
        <LI>Passwords are never stored in readable form.</LI>
        <LI>
          Chat media is held in a private storage bucket and is never served
          publicly.
        </LI>
        <LI>Verification documents are readable only by you and by reviewers.</LI>
        <LI>Every staff enforcement action is written to an audit log.</LI>
      </UL>
      <P>
        No system is perfectly secure. If you believe your account has been
        compromised, contact us immediately.
      </P>
      <P>
        <Strong>[TO BE COMPLETED BY COUNSEL — breach notification commitments and
        timelines]</Strong>
      </P>

      <H2 id="children">10. Children</H2>
      <P>
        <Strong>[TO BE COMPLETED BY COUNSEL — minimum age, COPPA position, and
        handling of accounts discovered to belong to children]</Strong>
      </P>

      <H2 id="transfers">11. International transfers</H2>
      <P>
        Several of our providers are located in the United States, so your data may
        be transferred and processed there.
      </P>
      <P>
        <Strong>[TO BE COMPLETED BY COUNSEL — transfer mechanisms such as Standard
        Contractual Clauses]</Strong>
      </P>

      <H2 id="changes">12. Changes and contact</H2>
      <P>
        We will give notice in the app before a material change to this policy takes
        effect.
      </P>
      <P>
        Zoiko Media Corp, 1401 21st Street, Suite R, Sacramento, CA 95811, United
        States.
      </P>
      <P>
        <Strong>[TO BE COMPLETED — privacy contact address, and a Data Protection
        Officer or EU/UK representative if one is required]</Strong>
      </P>

      <Callout variant="note" title="Related">
        See our{' '}
        <Link href="/terms" className="text-primary font-medium hover:underline">
          Terms of Service
        </Link>
        , and the{' '}
        <Link href="/docs/safety-and-trust" className="text-primary font-medium hover:underline">
          Safety &amp; Trust
        </Link>{' '}
        guide for how privacy controls work day to day.
      </Callout>
    </>
  )
}
