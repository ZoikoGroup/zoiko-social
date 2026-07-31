import type { Metadata } from 'next'
import Link from 'next/link'
import {
  MessageSquare, Send, SmilePlus, CheckCheck, Palette, Video, Phone, ShieldCheck,
} from 'lucide-react'
import { DocHeader, JumpLinks, H2, P, UL, LI, Strong, Callout, FeatureGrid } from '../_components/Prose'
import { DocsFooterNav } from '../_components/DocsFooterNav'

export const metadata: Metadata = { title: 'Messaging & Calls' }

export default function MessagingAndCallsPage(): React.JSX.Element {
  return (
    <>
      <DocHeader
        icon={MessageSquare}
        eyebrow="Messaging"
        title="Messaging & Calls"
        lead="Direct messages, group chat, message requests, and audio/video calls — all covered by the same profanity-free standard as everything else on ZoikoSocial."
      />

      <JumpLinks
        items={[
          { href: '#starting-a-conversation', label: 'Starting a conversation' },
          { href: '#message-requests', label: 'Message requests' },
          { href: '#reactions-and-read-receipts', label: 'Reactions & read receipts' },
          { href: '#conversation-themes', label: 'Conversation themes' },
          { href: '#audio-and-video-calls', label: 'Audio & video calls' },
          { href: '#staying-safe', label: 'Staying safe' },
        ]}
      />

      <H2 id="starting-a-conversation">Starting a conversation</H2>
      <P>
        From <Strong>Messages</Strong>, start a new conversation with anyone you follow or who follows
        you, or create a group chat with multiple people at once. Search inside a conversation to find
        an old message quickly, or search across all your conversations to find a specific person.
      </P>
      <FeatureGrid
        items={[
          { icon: Send, title: 'One-to-one messages', body: 'Direct, private conversations between you and one other person.' },
          { icon: MessageSquare, title: 'Group chats', body: 'Bring several people together in one conversation — great for families, friend groups, or event attendees.' },
        ]}
      />

      <H2 id="message-requests">Message requests</H2>
      <P>
        If someone who doesn’t follow you sends a message, it arrives as a <Strong>message request</Strong>{' '}
        rather than landing straight in your inbox. You can review the message before deciding whether
        to accept it (moving it into your regular inbox) or decline it.
      </P>
      <Callout variant="tip">
        This keeps your main inbox for people you actually have a relationship with, while still letting
        someone reach out for the first time.
      </Callout>

      <H2 id="reactions-and-read-receipts">Reactions & read receipts</H2>
      <FeatureGrid
        items={[
          { icon: SmilePlus, title: 'Reactions', body: 'React to any message with an emoji instead of sending a whole new message.' },
          { icon: CheckCheck, title: 'Read receipts', body: 'See when a message has been delivered and read.' },
        ]}
      />

      <H2 id="conversation-themes">Conversation themes</H2>
      <P>
        <Palette className="w-4 h-4 inline -mt-0.5 mr-1.5 text-primary" aria-hidden />
        Give any conversation its own color theme from the conversation’s settings menu — a small touch
        that makes your chats easier to tell apart at a glance.
      </P>

      <H2 id="audio-and-video-calls">Audio & video calls</H2>
      <P>
        Calls run right in your browser — there’s nothing to download or install. Start a call from any
        conversation, one-to-one or with a group.
      </P>
      <FeatureGrid
        items={[
          { icon: Phone, title: 'Audio calls', body: 'A voice-only call for a quick, lightweight conversation.' },
          { icon: Video, title: 'Video calls', body: 'Face-to-face calls, including group video for catching up with more than one person at once.' },
        ]}
      />
      <Callout variant="safety" title="Recording requires consent">
        Nobody can record a call without every participant explicitly agreeing first. There’s no way to
        record silently in the background.
      </Callout>

      <H2 id="staying-safe">Staying safe while messaging</H2>
      <UL>
        <LI>Every message is checked against the same profanity-free standard as public posts, before it’s ever delivered.</LI>
        <LI>You can block or mute anyone directly from a conversation — see <Link href="/docs/community-and-events#blocking-and-muting" className="text-primary font-medium hover:underline">Blocking & muting</Link>.</LI>
        <LI>You can report a conversation or a specific message that concerns you.</LI>
        <LI>Attachments are screened before they reach you.</LI>
      </UL>
      <Callout variant="safety">
        <ShieldCheck className="w-3.5 h-3.5 inline -mt-0.5 mr-1 text-error" aria-hidden />
        For how reports and enforcement work in more detail, see{' '}
        <Link href="/docs/safety-and-trust" className="text-primary font-medium hover:underline">
          Safety, Privacy &amp; Trust
        </Link>
        .
      </Callout>

      <DocsFooterNav currentSlug="messaging-and-calls" />
    </>
  )
}
