import type { Metadata } from 'next'
import Link from 'next/link'
import {
  LayoutGrid, Compass, ImagePlus, Heart, MessageCircle, Bookmark, Hash, Flag,
} from 'lucide-react'
import { DocHeader, JumpLinks, H2, P, UL, LI, Strong, Callout, FeatureGrid } from '../_components/Prose'
import { DocsFooterNav } from '../_components/DocsFooterNav'

export const metadata: Metadata = { title: 'Feed, Posts & Stories' }

export default function FeedAndContentPage(): React.JSX.Element {
  return (
    <>
      <DocHeader
        icon={LayoutGrid}
        eyebrow="Feed & Content"
        title="Feed, Posts & Stories"
        lead="How your Home feed is put together, how to post and tell stories, and how hashtags and reactions work."
      />

      <JumpLinks
        items={[
          { href: '#home-feed-and-explore', label: 'Home feed & Explore' },
          { href: '#creating-a-post', label: 'Creating a post' },
          { href: '#reactions-comments-and-saves', label: 'Reactions, comments & saves' },
          { href: '#stories', label: 'Stories' },
          { href: '#hashtags-and-trends', label: 'Hashtags & trends' },
          { href: '#reporting-content', label: 'Reporting content' },
        ]}
      />

      <H2 id="home-feed-and-explore">Home feed & Explore</H2>
      <P>
        Your <Strong>Home</Strong> feed is where posts from the people, pets, and communities you follow
        show up. It’s built to favor genuine connection over noise — posts from accounts you actually
        follow are prioritized over the kind of open-ended recommendations you’d get on a purely
        algorithmic feed.
      </P>
      <P>
        <Strong>Explore</Strong> is the discovery side of things: a place to find new posts, communities,
        and pets you don’t already follow, organized around topics and hashtags you’re interested in.
      </P>
      <FeatureGrid
        items={[
          { icon: LayoutGrid, title: 'Home feed', body: 'Posts from people, pets, and communities you follow, newest first.' },
          { icon: Compass, title: 'Explore', body: 'Discover new posts and accounts outside your existing network.' },
        ]}
      />
      <Callout variant="note">
        Community feeds and your own profile feed work the same way — each is just a different filter
        over the same underlying posts.
      </Callout>

      <H2 id="creating-a-post">Creating a post</H2>
      <P>Tap the compose button to start a new post. You can:</P>
      <UL>
        <LI>Write text, and attach photos or video.</LI>
        <LI>Tag a pet profile so the post shows up on their page too.</LI>
        <LI>Add hashtags so people searching those topics can find your post.</LI>
        <LI>Choose who can see it, based on your profile’s privacy level.</LI>
      </UL>
      <Callout variant="warning" title="Every post is checked before it's published">
        ZoikoSocial’s profanity-free standard applies to captions, comments, and usernames alike. If a
        post doesn’t pass, you’ll be asked to edit it before it goes live — content is never published
        and then quietly removed, you’ll always know up front.
      </Callout>

      <H2 id="reactions-comments-and-saves">Reactions, comments & saves</H2>
      <FeatureGrid
        items={[
          { icon: Heart, title: 'Reactions', body: 'Like a post to show appreciation — the author is notified.' },
          { icon: MessageCircle, title: 'Comments', body: 'Reply to a post, reply to other comments, and like individual comments.' },
          { icon: Bookmark, title: 'Saves', body: 'Save a post to revisit later without it showing up in anyone else’s feed.' },
          { icon: ImagePlus, title: 'Sharing', body: 'Share a post to your own followers, or send it directly to someone in a message.' },
        ]}
      />
      <P>
        Post authors and community moderators can <Strong>pin</Strong> an important comment so it stays at
        the top of the thread.
      </P>

      <H2 id="stories">Stories</H2>
      <P>
        Stories are short-lived photo and video posts that appear at the top of the feed and disappear
        after a set amount of time — great for day-to-day moments that don’t need to live on your
        profile forever.
      </P>
      <UL>
        <LI><Strong>Highlights</Strong> — save your favorite stories permanently to a labeled collection on your profile.</LI>
        <LI><Strong>Mentions</Strong> — tag another person or pet directly in a story.</LI>
        <LI><Strong>Music</Strong> — search for and add a soundtrack to your story.</LI>
        <LI><Strong>Reactions</Strong> — friends can react to your story directly, and you can report a story the same way you’d report a post.</LI>
      </UL>
      <Callout variant="tip">
        Archived a story by accident, or let one expire? You can restore it from your story archive at
        any time.
      </Callout>

      <H2 id="hashtags-and-trends">Hashtags & trends</H2>
      <P>
        Add hashtags to posts and stories so they’re discoverable beyond your existing followers.
        Tapping a hashtag anywhere takes you to everything tagged with it — posts and stories alike —
        and you can search for a specific tag directly from the search bar to see what’s trending.
      </P>
      <FeatureGrid
        items={[
          { icon: Hash, title: 'Tag your posts', body: 'Add one or more hashtags when you post so the right people can find it.' },
          { icon: Compass, title: 'Browse a tag', body: 'Tap any hashtag to see every public post and story that used it.' },
        ]}
      />

      <H2 id="reporting-content">Reporting content you’re concerned about</H2>
      <P>
        If you come across a post, comment, or story that doesn’t belong — anything that looks like
        harassment, animal cruelty, misinformation, or otherwise breaks the rules — use the{' '}
        <Strong>Report</Strong> option on that piece of content. It only takes a moment, and it starts a
        proper review on our end.
      </P>
      <Callout variant="note" title="Want the full picture?">
        <Flag className="w-3.5 h-3.5 inline -mt-0.5 mr-1 text-outline" aria-hidden />
        See{' '}
        <Link href="/docs/safety-and-trust" className="text-primary font-medium hover:underline">
          Safety, Privacy &amp; Trust
        </Link>{' '}
        for how reports are handled, what happens after you submit one, and how blocking and muting work.
      </Callout>

      <DocsFooterNav currentSlug="feed-and-content" />
    </>
  )
}
