import { Injectable, Logger } from '@nestjs/common'
import { XMLParser } from 'fast-xml-parser'
import { PrismaService } from '../prisma/prisma.service'
import { NewsCoverService, MIN_COVER_WIDTH } from './news-cover.service'
import { readImageDimensions } from './image-size'

/**
 * Pulls articles from curated RSS/Atom feeds.
 *
 * Curated feeds rather than a general news API, for a reason specific to this
 * domain: animal welfare and environment is a niche, and a general API returns
 * a firehose you then have to filter for relevance. A list of trusted
 * publishers IS the relevance filter, and it costs nothing and has no quota.
 *
 * What is stored is headline, excerpt, image and link — never the body. Almost
 * every RSS and news-API licence grants exactly that much and no more, so an
 * ingested article is a card that opens the publisher's own page.
 */

/** Feeds are small; anything larger is a misconfigured URL, not a feed. */
const MAX_FEED_BYTES = 5 * 1024 * 1024
/** A slow feed must not hold the whole run open. */
const FETCH_TIMEOUT_MS = 15_000
/** Per run, per source. Enough for a daily catch-up, bounded against a flood. */
const MAX_ITEMS_PER_SOURCE = 25
/** Older than this on first sight is history, not news. */
const MAX_AGE_DAYS = 30
/**
 * How many stored articles get their link re-checked per run.
 *
 * Bounded on purpose: checking all of them every three hours would be hundreds
 * of requests at publishers who did nothing wrong. Least-recently-checked
 * first, so the whole catalogue is covered over a few runs.
 */
const LINK_CHECKS_PER_RUN = 40

/**
 * Covers re-examined per run.
 *
 * Each one costs a download and possibly an article-page fetch, so this is
 * deliberately small — the backlog clears over a handful of runs instead of
 * turning one scheduled ingest into a crawl of every publisher at once.
 */
const COVER_REPAIRS_PER_RUN = 12

export interface IngestResult {
  source: string
  fetched: number
  created: number
  skipped: number
  error?: string
}

/** One item as it appears in a feed, after the shapes have been reconciled. */
interface FeedItem {
  title: string
  link: string
  excerpt: string
  imageUrl: string | null
  publishedAt: Date
}

@Injectable()
export class NewsIngestService {
  private readonly logger = new Logger(NewsIngestService.name)

  // `ignoreAttributes: false` because the image and the Atom link both live in
  // attributes rather than text nodes.
  private readonly parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    trimValues: true,
  })

  constructor(
    private readonly prisma: PrismaService,
    private readonly covers: NewsCoverService,
  ) {}

  // ── Entry point ────────────────────────────────────────────────────────────

  /**
   * Runs every enabled source.
   *
   * Sequential rather than parallel: this is a background catch-up, not a
   * latency-sensitive path, and hitting twenty publishers at once from one IP
   * is how an ingester gets rate-limited or blocked.
   */
  async ingestAll(): Promise<{ sources: number; created: number; removed: number; repaired: number; results: IngestResult[] }> {
    const sources = await this.prisma.newsSource.findMany({
      where: { enabled: true },
      orderBy: { lastFetchedAt: { sort: 'asc', nulls: 'first' } },
    })

    const results: IngestResult[] = []
    for (const source of sources) {
      results.push(await this.ingestSource(source.id))
    }

    // Pulling new articles and retiring dead ones are the same job: keeping what
    // we show in step with what the publisher still stands behind.
    const removed = await this.retireDeadLinks()

    // Covers stored before there was a size floor are repaired here rather than
    // by a one-off script, so the fix arrives on its own and keeps arriving.
    const repaired = await this.repairWeakCovers()

    return {
      sources: sources.length,
      created: results.reduce((n, r) => n + r.created, 0),
      removed,
      repaired,
      results,
    }
  }

  // ── Retiring articles the publisher has taken down ─────────────────────────

  /**
   * Removes articles whose original page is gone.
   *
   * An article dropping out of a feed does NOT mean it was deleted — feeds only
   * carry the most recent items, so everything ages out eventually. The only
   * honest signal is asking the URL: 404 or 410 means the publisher took it
   * down, and a card that opens a dead page is worse than no card.
   *
   * Deliberately narrow about what counts as gone. A 500, a timeout, a block or
   * a paywall redirect all mean "cannot tell right now", and deleting on those
   * would quietly empty the catalogue during someone else's outage.
   */
  async retireDeadLinks(limit = LINK_CHECKS_PER_RUN): Promise<number> {
    const candidates = await this.prisma.newsArticle.findMany({
      where: { isExternal: true, isDeleted: false, NOT: { canonicalUrl: null } },
      // updatedAt doubles as "last checked": every check below writes to the row,
      // which rotates it to the back of the queue. Saves a column, and the only
      // other thing that updates these rows is a check.
      orderBy: { updatedAt: 'asc' },
      take: limit,
      select: { id: true, canonicalUrl: true, title: true },
    })

    let removed = 0
    for (const article of candidates) {
      const gone = await this.isGone(article.canonicalUrl as string)
      if (gone) {
        await this.prisma.newsArticle.update({
          where: { id: article.id },
          data: { isDeleted: true },
        })
        // The mirrored cover has nothing left to illustrate.
        await this.covers.remove(article.id)
        removed++
        this.logger.log(`Retired (gone at source): ${article.title.slice(0, 60)}`)
      } else {
        // Touch the row so it goes to the back of the check queue even when
        // nothing changed, or the same few articles would be checked forever.
        await this.prisma.newsArticle.update({
          where: { id: article.id },
          data: { updatedAt: new Date() },
        })
      }
    }
    return removed
  }

  /** True only when the publisher has definitively taken the page down. */
  private async isGone(url: string): Promise<boolean> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
    try {
      const res = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: { 'User-Agent': 'ZoikoSocialBot/1.0 (+https://zoikosocial.com)' },
      })
      // 405 means the host refuses HEAD, not that the article is missing.
      return res.status === 404 || res.status === 410
    } catch {
      // Unreachable is not the same as removed.
      return false
    } finally {
      clearTimeout(timer)
    }
  }

  /**
   * Runs one source, recording the outcome on the row either way.
   *
   * A feed that quietly stops working is otherwise invisible — it just stops
   * contributing, and nobody notices for weeks. Never throws: one broken
   * publisher must not end the run for the other nineteen.
   */
  async ingestSource(sourceId: string): Promise<IngestResult> {
    const source = await this.prisma.newsSource.findUnique({ where: { id: sourceId } })
    if (!source) return { source: sourceId, fetched: 0, created: 0, skipped: 0, error: 'Source not found' }

    try {
      const xml = await this.fetchFeed(source.feedUrl)
      const items = this.parseFeed(xml).slice(0, MAX_ITEMS_PER_SOURCE)
      let created = 0
      let skipped = 0

      for (const item of items) {
        const wasCreated = await this.storeItem(source, item)
        if (wasCreated) created++
        else skipped++
      }

      await this.prisma.newsSource.update({
        where: { id: source.id },
        data: { lastFetchedAt: new Date(), lastStatus: 'ok', lastError: null },
      })
      return { source: source.name, fetched: items.length, created, skipped }
    } catch (e) {
      const error = e instanceof Error ? e.message : 'Unknown error'
      await this.prisma.newsSource.update({
        where: { id: source.id },
        data: { lastFetchedAt: new Date(), lastStatus: 'error', lastError: error.slice(0, 500) },
      })
      this.logger.warn(`Feed failed for ${source.name}: ${error}`)
      return { source: source.name, fetched: 0, created: 0, skipped: 0, error }
    }
  }

  // ── Fetch ──────────────────────────────────────────────────────────────────

  private async fetchFeed(url: string): Promise<string> {
    // Only http(s), and resolved from the stored URL rather than matched by
    // pattern, so a file: or data: URL in the source list cannot read the disk.
    const { protocol } = new URL(url)
    if (protocol !== 'http:' && protocol !== 'https:') {
      throw new Error('Feed URL must be http or https')
    }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          // Publishers block unidentified clients, and an honest UA is also how
          // they reach us if the ingest ever misbehaves.
          'User-Agent': 'ZoikoSocialBot/1.0 (+https://zoikosocial.com)',
          Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml',
        },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const text = await res.text()
      if (text.length > MAX_FEED_BYTES) throw new Error('Feed too large')
      return text
    } finally {
      clearTimeout(timer)
    }
  }

  // ── Parse ──────────────────────────────────────────────────────────────────

  /** Coerces the parser's string-or-object-or-array output into one array. */
  private asArray(value: unknown): Record<string, unknown>[] {
    if (!value) return []
    const list = Array.isArray(value) ? value : [value]
    return list.filter((v): v is Record<string, unknown> => typeof v === 'object' && v !== null)
  }

  /** Node text, whether it came back as a string or as `{ '#text': ... }`. */
  private text(value: unknown): string {
    if (typeof value === 'string') return value
    if (typeof value === 'number') return String(value)
    if (value && typeof value === 'object') {
      const inner = (value as Record<string, unknown>)['#text']
      if (typeof inner === 'string') return inner
    }
    return ''
  }

  /**
   * Reads RSS 2.0 and Atom out of the same method.
   *
   * They disagree on nearly every field name, and a publisher can switch
   * between them without warning — handling one and not the other means a feed
   * silently produces nothing.
   */
  private parseFeed(xml: string): FeedItem[] {
    const doc = this.parser.parse(xml) as Record<string, unknown>

    const rssChannel = (doc.rss as Record<string, unknown> | undefined)?.channel
    const rssItems = this.asArray((rssChannel as Record<string, unknown> | undefined)?.item)
    const atomEntries = this.asArray((doc.feed as Record<string, unknown> | undefined)?.entry)

    const raw = rssItems.length > 0 ? rssItems : atomEntries
    const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 3_600_000

    const items: FeedItem[] = []
    for (const node of raw) {
      const title = this.stripHtml(this.text(node.title)).trim()
      const link = this.readLink(node)
      if (!title || !link) continue

      const publishedAt = this.readDate(node)
      if (publishedAt.getTime() < cutoff) continue

      const summary = this.stripHtml(
        this.text(node.description) || this.text(node.summary) || this.text(node['content:encoded']),
      ).trim()

      items.push({
        title: title.slice(0, 300),
        link,
        // An empty excerpt is better than a fabricated one; the card falls back
        // to the title alone.
        excerpt: (summary || title).slice(0, 500),
        imageUrl: this.readImage(node),
        publishedAt,
      })
    }
    return items
  }

  /** RSS puts the URL in `link`'s text; Atom puts it in an href attribute. */
  private readLink(node: Record<string, unknown>): string | null {
    const direct = this.text(node.link)
    if (direct.startsWith('http')) return direct

    for (const candidate of this.asArray(node.link)) {
      const href = candidate['@_href']
      const rel = candidate['@_rel']
      if (typeof href === 'string' && href.startsWith('http') && (!rel || rel === 'alternate')) {
        return href
      }
    }
    const guid = this.text(node.guid)
    return guid.startsWith('http') ? guid : null
  }

  private readDate(node: Record<string, unknown>): Date {
    for (const key of ['pubDate', 'published', 'updated', 'dc:date']) {
      const raw = this.text(node[key])
      if (!raw) continue
      const parsed = new Date(raw)
      if (!Number.isNaN(parsed.getTime())) return parsed
    }
    // No usable date means "now" — treating it as 1970 would file it under
    // history and it would never be seen.
    return new Date()
  }

  /**
   * Replaces covers that are too small to render, a few at a time.
   *
   * Everything mirrored before there was a size floor is still in storage,
   * including a run of 90x90 thumbnails that the feed was stretching across a
   * 900px column. Those cannot be identified from the database — the stored row
   * knows the URL, not the dimensions — so each candidate is measured, and only
   * the ones that fail get a second attempt via the article's own og:image.
   *
   * `updatedAt` doubles as "last examined", exactly as it does for dead links,
   * so successive runs walk the whole catalogue instead of re-checking the same
   * few rows. That means every path here writes to the row, including the ones
   * that change nothing.
   *
   * When no better image can be found the cover is cleared. An article with no
   * picture reads as a deliberate choice; one with a smeared picture reads as a
   * broken page.
   */
  async repairWeakCovers(limit = COVER_REPAIRS_PER_RUN): Promise<number> {
    const candidates = await this.prisma.newsArticle.findMany({
      where: { coverUrl: { not: null }, isDeleted: false },
      orderBy: { updatedAt: 'asc' },
      take: limit,
      select: { id: true, coverUrl: true, sourceUrl: true },
    })

    let repaired = 0
    for (const article of candidates) {
      const width = await this.measureCover(article.coverUrl!)

      // Unmeasurable is left alone: it means a format we do not parse, not a
      // bad cover, and replacing it would be guesswork.
      if (width === null || width >= MIN_COVER_WIDTH) {
        await this.touch(article.id)
        continue
      }

      /*
        The old file goes first, unconditionally.

        It is being discarded either way — replaced if the article page offers
        something better, cleared if it does not — and a replacement arriving
        under a different extension (`.png` over a stored `.jpg`) would upsert
        alongside it rather than over it, leaving the original orphaned in the
        bucket with nothing referencing it.
      */
      await this.covers.remove(article.id)

      const replacement = article.sourceUrl
        ? await this.acquireCover(null, article.sourceUrl, article.id)
        : null

      await this.prisma.newsArticle.update({
        where: { id: article.id },
        // Cleared rather than kept when nothing better exists.
        data: { coverUrl: replacement },
      })

      if (replacement) {
        repaired++
        this.logger.log(`Replaced an undersized cover for article ${article.id}`)
      } else {
        this.logger.debug(`Cleared an undersized cover for article ${article.id}`)
      }
    }

    return repaired
  }

  /** The stored cover's real width, or null if it cannot be read. */
  private async measureCover(url: string): Promise<number | null> {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 10_000)
      try {
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) return null
        const size = readImageDimensions(Buffer.from(await res.arrayBuffer()))
        return size ? size.width : null
      } finally {
        clearTimeout(timer)
      }
    } catch {
      return null
    }
  }

  /**
   * Marks a row as examined without changing anything else.
   *
   * Without this the ordering above would hand back the same rows every run and
   * the rest of the catalogue would never be reached.
   */
  private async touch(articleId: string): Promise<void> {
    await this.prisma.newsArticle
      .update({ where: { id: articleId }, data: { updatedAt: new Date() } })
      .catch(() => undefined)
  }

  /**
   * Gets a usable cover for an article, from the feed or from the article page.
   *
   * Two sources, tried in order, because neither is sufficient alone. The feed
   * image is free — already in hand, no extra request — but several publishers
   * only offer a list thumbnail. The article's own og:image is the right size
   * but costs a page fetch, so it is the fallback rather than the default.
   *
   * `mirror()` enforces the size floor, so "the feed image was too small" and
   * "there was no feed image" arrive here as the same null and take the same
   * path. That is the point: the caller does not need to know which happened.
   */
  private async acquireCover(
    feedImageUrl: string | null,
    articleUrl: string,
    articleId: string,
  ): Promise<string | null> {
    if (feedImageUrl) {
      const fromFeed = await this.covers.mirror(feedImageUrl, articleId)
      if (fromFeed) return fromFeed
    }

    if (!articleUrl) return null
    const og = await this.covers.resolveOgImage(articleUrl)
    // Guard against the page pointing back at the thumbnail we just rejected —
    // a wasted round trip that ends in the same refusal.
    if (!og || og === feedImageUrl) return null

    return this.covers.mirror(og, articleId)
  }

  /**
   * The best image a feed item offers, not merely the first.
   *
   * Publishers disagree on where the image goes, and several supply more than
   * one at different sizes — commonly a `media:thumbnail` for lists alongside a
   * full-size `media:content`. Taking the first match picked the thumbnail, so
   * the feed mirrored 90x90 images and rendered them across a 900px column.
   *
   * Widest declared wins; an undeclared width sorts last but still counts,
   * because plenty of full-size images carry no attribute at all and the real
   * dimensions get measured at mirror time regardless.
   */
  private readImage(node: Record<string, unknown>): string | null {
    const candidates: { url: string; width: number }[] = []

    const consider = (raw: unknown, urlKey: string): void => {
      // A feed may repeat any of these tags, in which case the parser hands
      // back an array — the case that matters most here, since that is exactly
      // how a publisher offers several sizes.
      const nodes = Array.isArray(raw) ? raw : [raw]
      for (const n of nodes) {
        if (!n || typeof n !== 'object') continue
        const entry = n as Record<string, unknown>
        const url = entry[urlKey]
        if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) continue

        // Some feeds put the size on the medium instead; both are advisory.
        const declared = Number(entry['@_width'] ?? entry['@_height'] ?? 0)
        candidates.push({
          url: url.slice(0, 600),
          width: Number.isFinite(declared) && declared > 0 ? declared : 0,
        })
      }
    }

    consider(node['media:content'], '@_url')
    consider(node['media:thumbnail'], '@_url')
    consider(node.enclosure, '@_url')
    consider(node['itunes:image'], '@_href')

    if (candidates.length === 0) return null

    // Stable: equal widths keep feed order, so the publisher's own preference
    // survives when nothing distinguishes the candidates.
    let best = candidates[0]!
    for (const c of candidates) {
      if (c.width > best.width) best = c
    }
    return best.url
  }

  /**
   * Strips tags and decodes the handful of entities feeds actually use.
   *
   * Feed summaries arrive as HTML and this text is rendered as a plain string,
   * so leaving markup in would show tags to the reader — and storing unescaped
   * markup is how it later ends up somewhere that does render it.
   */
  private stripHtml(input: string): string {
    return input
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
  }

  // ── Store ──────────────────────────────────────────────────────────────────

  /**
   * Writes one item, or does nothing if it is already known.
   *
   * Dedupe is on the canonical URL with a unique index behind it, so two
   * concurrent runs cannot both insert the same story — the second gets a
   * constraint violation, which is caught and counted as a skip rather than
   * failing the source.
   */
  private async storeItem(
    source: { id: string; tier: string; category: string; name: string },
    item: FeedItem,
  ): Promise<boolean> {
    const canonicalUrl = this.canonicalise(item.link)

    const existing = await this.prisma.newsArticle.findUnique({
      where: { canonicalUrl },
      select: { id: true },
    })
    if (existing) return false

    try {
      const created = await this.prisma.newsArticle.create({
        data: {
          title: item.title,
          excerpt: item.excerpt,
          // No body, deliberately: see the note at the top of this file.
          body: null,
          authorId: null,
          sourceId: source.id,
          isExternal: true,
          canonicalUrl,
          // Set below once the image has been copied into our own storage. The
          // publisher's URL is never stored as the cover: the CSP would refuse
          // to render it, so it would be a link to a picture nobody can see.
          coverUrl: null,
          category: source.category,
          tier: source.tier,
          sourceName: source.name,
          sourceUrl: item.link,
          readMinutes: this.readingTime(item.excerpt),
          status: 'published',
          // Curating the source IS the review. A source that cannot be trusted
          // to publish straight into the feed should not be in the list.
          reviewStatus: 'approved',
          publishedAt: item.publishedAt,
        },
        select: { id: true },
      })

      // After the insert, so a slow or hostile image host delays nothing and
      // the article exists either way.
      const cover = await this.acquireCover(item.imageUrl, item.link, created.id)
      if (cover) {
        await this.prisma.newsArticle.update({
          where: { id: created.id },
          data: { coverUrl: cover },
        })
      }
      return true
    } catch {
      // Almost certainly the unique index doing its job under a concurrent run.
      return false
    }
  }

  /**
   * Strips tracking parameters so the same story shared twice is one row.
   *
   * utm_* and friends differ per campaign, so without this the dedupe key stops
   * deduplicating the moment a publisher tags its own feed.
   */
  private canonicalise(link: string): string {
    try {
      const url = new URL(link)
      for (const key of [...url.searchParams.keys()]) {
        if (/^utm_/i.test(key) || ['fbclid', 'gclid', 'ref', 'source'].includes(key.toLowerCase())) {
          url.searchParams.delete(key)
        }
      }
      url.hash = ''
      return url.toString().slice(0, 800)
    } catch {
      return link.slice(0, 800)
    }
  }

  /** Rough minutes at ~200 wpm, floored at 1 so nothing reads "0 min". */
  private readingTime(text: string): number {
    return Math.max(1, Math.round(text.split(/\s+/).length / 200))
  }
}
