import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Settings, Bell, BellRing, Lock, Shield, Sliders, HelpCircle, Trash2, Coins, SunMoon,
} from 'lucide-react'
import { DocHeader, JumpLinks, H2, P, UL, LI, Strong, Callout, Steps, FeatureGrid, DocTable } from '../_components/Prose'
import { DocsFooterNav } from '../_components/DocsFooterNav'

export const metadata: Metadata = { title: 'Notifications & Account Settings' }

export default function NotificationsAndSettingsPage(): React.JSX.Element {
  return (
    <>
      <DocHeader
        icon={Settings}
        eyebrow="Settings"
        title="Notifications & Account Settings"
        lead="Everything under the Settings menu: notifications, privacy, security, preferences, and your account itself."
      />

      <JumpLinks
        items={[
          { href: '#notification-center', label: 'Notification Center' },
          { href: '#notification-preferences', label: 'Notification preferences' },
          { href: '#privacy-settings', label: 'Privacy settings' },
          { href: '#security', label: 'Security' },
          { href: '#preferences', label: 'Preferences' },
          { href: '#help-and-about', label: 'Help & About' },
          { href: '#deleting-your-account', label: 'Deleting your account' },
        ]}
      />

      <H2 id="notification-center">The Notification Center</H2>
      <P>
        The bell icon in the top navigation (or <Strong>Alerts</Strong> in the mobile tab bar) opens your
        Notification Center — a running feed of likes, comments, follows, messages, mentions, and more,
        with an unread count badge so you always know what’s new.
      </P>
      <FeatureGrid
        items={[
          { icon: Bell, title: 'Unread badge', body: 'A live count on the bell icon shows how many notifications you haven\'t seen yet.' },
          { icon: BellRing, title: 'Mark as read', body: 'Open a notification, or mark everything as read at once, to clear the badge.' },
        ]}
      />

      <H2 id="notification-preferences">Notification preferences</H2>
      <P>
        From <Strong>Settings → Notifications</Strong>, choose which categories of activity notify you and
        how — push, email, or just in-app — so you can dial things up or down based on how you actually
        want to use ZoikoSocial.
      </P>

      <H2 id="privacy-settings">Privacy settings</H2>
      <P>
        <Lock className="w-4 h-4 inline -mt-0.5 mr-1.5 text-primary" aria-hidden />
        <Strong>Settings → Privacy</Strong> controls who can see your activity: your posts, your follower
        and following lists, whether people can message you without following you first, and whether you
        appear in search. For profile- and pet-specific visibility, see{' '}
        <Link href="/docs/profile-and-pets#privacy-controls" className="text-primary font-medium hover:underline">
          Privacy controls in Profiles &amp; Pet Passport
        </Link>
        .
      </P>

      <H2 id="security">Security</H2>
      <P>
        <Shield className="w-4 h-4 inline -mt-0.5 mr-1.5 text-primary" aria-hidden />
        <Strong>Settings → Security</Strong> is where your account’s login and access controls live.
      </P>
      <UL>
        <LI><Strong>Change your password</Strong> — requires your current password to confirm it’s really you.</LI>
        <LI><Strong>Change your email</Strong> — also requires re-entering your password before the change takes effect.</LI>
        <LI><Strong>Active sessions</Strong> — review the devices currently signed in to your account.</LI>
      </UL>
      <Callout variant="tip">
        Use a unique, strong password for ZoikoSocial, and review your active sessions occasionally —
        especially after using a shared or public computer.
      </Callout>

      <H2 id="preferences">Preferences</H2>
      <FeatureGrid
        items={[
          { icon: SunMoon, title: 'Theme', body: 'Switch between light, dark, or match-your-system appearance.' },
          { icon: Coins, title: 'Currency', body: 'Set your preferred display currency for Shop prices and provider bookings.' },
          { icon: Sliders, title: 'Language & accessibility', body: 'Adjust language and accessibility options to fit how you use the platform.' },
        ]}
      />

      <H2 id="help-and-about">Help & About</H2>
      <P>
        <HelpCircle className="w-4 h-4 inline -mt-0.5 mr-1.5 text-primary" aria-hidden />
        <Strong>Settings → Help &amp; About</Strong> is your jumping-off point for everything support-related:
      </P>
      <DocTable
        headers={['Item', 'What it does']}
        rows={[
          ['Help Center', 'Brings you right back to this guide.'],
          ['Community Guidelines', 'The full rules for posts, comments, communities, and more — an extension of the profanity-free and animal-welfare-first standards.'],
          ['Contact Support', 'Reach our team directly for anything this guide doesn\'t answer.'],
          ['Billing & Subscriptions', 'Manage your plan and payment details.'],
          ['Download Your Data', 'Request an export of your account data.'],
          ['Terms of Service / Privacy Policy', 'The legal terms governing your use of ZoikoSocial.'],
          ['Version History', 'See which build of ZoikoSocial you\'re currently using.'],
        ]}
      />

      <H2 id="deleting-your-account">Deleting your account</H2>
      <P>
        Account deletion lives in <Strong>Settings → Account</Strong>, and it’s deliberately not a single
        click — this permanently removes your account, so we make sure it’s really you and really
        intentional.
      </P>
      <Steps
        items={[
          { title: 'Open Delete Account', body: 'Found near the bottom of Settings → Account.' },
          { title: 'Type your username to confirm', body: 'This extra step exists specifically to prevent accidental deletion.' },
          { title: 'Confirm', body: "Once confirmed, your account is deleted and you're signed out." },
        ]}
      />
      <Callout variant="warning" title="This can't be undone">
        <Trash2 className="w-3.5 h-3.5 inline -mt-0.5 mr-1 text-secondary" aria-hidden />
        Deleting your account is permanent. If you just want a break, consider whether adjusting your
        privacy settings or muting/blocking specific people covers what you need first.
      </Callout>

      <DocsFooterNav currentSlug="notifications-and-settings" />
    </>
  )
}
