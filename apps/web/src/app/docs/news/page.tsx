import type { Metadata } from 'next'
import {
  Newspaper, Heart, Bookmark, MessageCircle, ShieldCheck, Share2, ExternalLink,
} from 'lucide-react'
import { DocHeader, JumpLinks, H2, P, UL, LI, Strong, Callout, FeatureGrid } from '../_components/Prose'
import { DocsFooterNav } from '../_components/DocsFooterNav'

export const metadata: Metadata = { title: 'Verified News' }

export default function NewsPage(): React.JSX.Element {
  return (
    <>
      <DocHeader
        icon={Newspaper}
        eyebrow="News"
        title="Verified News"
        lead="Animal welfare, environment, science, and technology news — with the same safety standard as everywhere else on ZoikoSocial."
      />

      <JumpLinks
        items={[
          { href: '#reading-news', label: 'Reading news' },
          { href: '#news-in-your-feed', label: 'News in your feed' },
          { href: '#where-articles-come-from', label: 'Where articles come from' },
          { href: '#saving-and-liking', label: 'Saving & liking' },
          { href: '#commenting-on-news', label: 'Commenting' },
          { href: '#our-approach-to-news', label: 'Our approach to news' },
        ]}
      />

      <H2 id="reading-news">Reading news on ZoikoSocial</H2>
      <P>
        The <Strong>News</Strong> section is a dedicated feed focused on animals, the environment,
        science, and technology. Featured stories are surfaced at the top so the most relevant,
        high-quality coverage isn’t buried.
      </P>

      <H2 id="news-in-your-feed">News in your home feed</H2>
      <P>
        Articles also appear in your <Strong>home feed</Strong>, mixed in among posts from the people
        and communities you follow. They look and behave like posts — you can like, comment, save and
        share them the same way — but the row above each one always names the publisher, so it is
        clear at a glance that you are reading journalism rather than something a person you follow
        wrote.
      </P>
      <P>
        If you keep scrolling past everything the people you follow have posted, the feed continues
        into news rather than stopping. When there is genuinely nothing left, it tells you so.
      </P>

      <H2 id="where-articles-come-from">Where articles come from</H2>
      <P>
        Most articles are gathered automatically from publishers we have reviewed and added — the
        feed refreshes several times a day. A few are written by verified members.
      </P>
      <FeatureGrid
        items={[
          {
            icon: ShieldCheck,
            title: 'Verified source',
            body: 'A badge on the card marks institutional and independently verified publishers. Reviewing the publisher is the review — we do not add a source we would not trust to publish straight into the feed.',
          },
          {
            icon: ExternalLink,
            title: 'Opens the publisher’s site',
            body: 'For a gathered article we store the headline, summary and link — not the full text, which belongs to the publisher. Tapping it opens their page, and the card says so before you tap.',
          },
        ]}
      />
      <P>
        If a publisher takes an article down, it stops appearing here too — we check the links we
        have published and withdraw the ones that have gone.
      </P>

      <H2 id="saving-and-liking">Saving & liking articles</H2>
      <FeatureGrid
        items={[
          { icon: Heart, title: 'Like an article', body: 'Show support for a story and help surface it to others.' },
          { icon: Bookmark, title: 'Save for later', body: 'Save an article to come back to when you have more time to read. Your saved list is private to you.' },
          { icon: Share2, title: 'Share it', body: 'Sharing a gathered article shares the publisher’s own link, so whoever you send it to lands on the real story rather than a page that only points elsewhere.' },
        ]}
      />

      <H2 id="commenting-on-news">Commenting on news</H2>
      <P>
        <MessageCircle className="w-4 h-4 inline -mt-0.5 mr-1.5 text-primary" aria-hidden />
        Discuss a story directly on its article page. Comments on news follow the exact same
        profanity-free standard as comments anywhere else on the platform — informed disagreement is
        welcome, abuse is not.
      </P>

      <H2 id="our-approach-to-news">Our approach to news</H2>
      <P>
        News on ZoikoSocial isn’t treated like an ordinary post. It goes through the platform’s safety
        review just like everything else, with a specific focus on animal welfare, environmental, and
        scientific accuracy — the goal is a News section people can actually rely on, not a second feed
        for outrage or unverified claims.
      </P>
      <UL>
        <LI>Advertising is never disguised as news — sponsored content is always clearly labeled and kept separate from editorial coverage.</LI>
        <LI>Misinformation about animal health, climate, or science is treated as a safety issue, not just a quality issue.</LI>
      </UL>
      <Callout variant="note">
        <ShieldCheck className="w-3.5 h-3.5 inline -mt-0.5 mr-1 text-primary" aria-hidden />
        If you spot something that looks inaccurate or misleading in a news article, use the report
        option on that article to flag it for review.
      </Callout>

      <DocsFooterNav currentSlug="news" />
    </>
  )
}
