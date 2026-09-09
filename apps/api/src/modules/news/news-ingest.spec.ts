import { NewsIngestService } from './news-ingest.service'

/**
 * Feed parsing and ingestion.
 *
 * Feeds are input from outside the system that nobody here controls, arriving
 * in two incompatible formats that publishers switch between without notice.
 * These lock down the cases that would otherwise fail silently — a feed that
 * parses to nothing looks exactly like a feed with no new articles.
 */

// The service's parse and canonicalise helpers are private by design; the tests
// reach them deliberately rather than exposing them just to be testable.
type Internals = {
  parseFeed(xml: string): { title: string; link: string; excerpt: string; imageUrl: string | null; publishedAt: Date }[]
  canonicalise(link: string): string
  stripHtml(input: string): string
}

function build() {
  const prisma = {
    newsSource: { findUnique: jest.fn(), update: jest.fn().mockResolvedValue({}), findMany: jest.fn().mockResolvedValue([]) },
    newsArticle: { findUnique: jest.fn().mockResolvedValue(null), create: jest.fn().mockResolvedValue({}) },
  }
  // The cover mirror is a separate collaborator; these tests are about parsing
  // and dedupe, so it returns "no cover" and never touches the network.
  const covers = { mirror: jest.fn().mockResolvedValue(null), remove: jest.fn() }
  const service = new NewsIngestService(prisma as never, covers as never)
  return { service, prisma, covers, internals: service as unknown as Internals }
}

/** A recent date, so nothing is dropped by the freshness cutoff. */
const RECENT = new Date(Date.now() - 3_600_000).toUTCString()

describe('feed parsing — RSS and Atom', () => {
  it('reads a plain RSS 2.0 item', () => {
    const { internals } = build()
    const items = internals.parseFeed(`
      <rss version="2.0"><channel>
        <item>
          <title>Rescue dogs rehomed</title>
          <link>https://example.org/rescue</link>
          <description>Forty dogs found homes this month.</description>
          <pubDate>${RECENT}</pubDate>
        </item>
      </channel></rss>`)

    expect(items).toHaveLength(1)
    expect(items[0]).toMatchObject({
      title: 'Rescue dogs rehomed',
      link: 'https://example.org/rescue',
      excerpt: 'Forty dogs found homes this month.',
    })
  })

  it('reads an Atom entry, where the link is an attribute rather than text', () => {
    // The format difference that silently produces zero items if unhandled.
    const { internals } = build()
    const items = internals.parseFeed(`
      <feed xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <title>Wetlands protected</title>
          <link rel="alternate" href="https://example.org/wetlands"/>
          <summary>A new reserve opens.</summary>
          <published>${new Date(Date.now() - 3_600_000).toISOString()}</published>
        </entry>
      </feed>`)

    expect(items).toHaveLength(1)
    expect(items[0]?.link).toBe('https://example.org/wetlands')
  })

  it('handles a single item without treating its fields as an array', () => {
    // The parser returns an object for one item and an array for several; a
    // reader that assumes an array drops every single-item feed.
    const { internals } = build()
    const items = internals.parseFeed(`
      <rss><channel><item>
        <title>Only one</title><link>https://example.org/one</link><pubDate>${RECENT}</pubDate>
      </item></channel></rss>`)
    expect(items).toHaveLength(1)
  })

  it('strips markup out of a summary rather than showing tags to the reader', () => {
    const { internals } = build()
    const items = internals.parseFeed(`
      <rss><channel><item>
        <title>Tagged</title><link>https://example.org/a</link>
        <description><![CDATA[<p>Hello <b>there</b> &amp; welcome</p>]]></description>
        <pubDate>${RECENT}</pubDate>
      </item></channel></rss>`)
    expect(items[0]?.excerpt).toBe('Hello there & welcome')
    expect(items[0]?.excerpt).not.toContain('<')
  })

  it('skips an item with no usable link', () => {
    const { internals } = build()
    const items = internals.parseFeed(`
      <rss><channel><item><title>No link</title><pubDate>${RECENT}</pubDate></item></channel></rss>`)
    expect(items).toHaveLength(0)
  })

  it('drops anything older than the freshness window', () => {
    const { internals } = build()
    const old = new Date(Date.now() - 90 * 24 * 3_600_000).toUTCString()
    const items = internals.parseFeed(`
      <rss><channel><item>
        <title>Ancient</title><link>https://example.org/old</link><pubDate>${old}</pubDate>
      </item></channel></rss>`)
    expect(items).toHaveLength(0)
  })

  it('falls back to now when the date is missing or unparseable', () => {
    // Treating an unreadable date as 1970 would file the item under history and
    // it would never be seen.
    const { internals } = build()
    const items = internals.parseFeed(`
      <rss><channel><item>
        <title>Undated</title><link>https://example.org/x</link><pubDate>not a date</pubDate>
      </item></channel></rss>`)
    expect(items).toHaveLength(1)
    expect(Date.now() - items[0]!.publishedAt.getTime()).toBeLessThan(5_000)
  })

  it('finds the image wherever the publisher put it', () => {
    const { internals } = build()
    const items = internals.parseFeed(`
      <rss><channel><item>
        <title>Pictured</title><link>https://example.org/p</link><pubDate>${RECENT}</pubDate>
        <media:thumbnail url="https://cdn.example.org/a.jpg"/>
      </item></channel></rss>`)
    expect(items[0]?.imageUrl).toBe('https://cdn.example.org/a.jpg')
  })

  it('returns nothing rather than throwing on XML that is not a feed', () => {
    const { internals } = build()
    expect(internals.parseFeed('<html><body>Not a feed</body></html>')).toEqual([])
  })
})

describe('dedupe key', () => {
  it('strips campaign parameters so one story is one row', () => {
    // Without this the key stops deduplicating the moment a publisher tags its
    // own feed, and the same story appears several times in the feed.
    const { internals } = build()
    expect(internals.canonicalise('https://example.org/a?utm_source=rss&utm_medium=feed')).toBe(
      'https://example.org/a',
    )
  })

  it('drops the fragment, which never identifies a different article', () => {
    const { internals } = build()
    expect(internals.canonicalise('https://example.org/a#top')).toBe('https://example.org/a')
  })

  it('keeps parameters that do identify the article', () => {
    const { internals } = build()
    expect(internals.canonicalise('https://example.org/read?id=42')).toBe('https://example.org/read?id=42')
  })

  it('returns something usable for a malformed URL instead of throwing', () => {
    const { internals } = build()
    expect(internals.canonicalise('not a url')).toBe('not a url')
  })
})

describe('a source that fails', () => {
  it('records the error on the row and does not throw', async () => {
    // A feed that quietly stops working is otherwise invisible — it just stops
    // contributing and nobody notices for weeks.
    const { service, prisma } = build()
    prisma.newsSource.findUnique.mockResolvedValue({
      id: 's1', name: 'Broken Feed', feedUrl: 'https://example.org/feed', tier: 'verified', category: 'rescue',
    })
    global.fetch = jest.fn().mockRejectedValue(new Error('ECONNREFUSED')) as never

    const result = await service.ingestSource('s1')

    expect(result.error).toContain('ECONNREFUSED')
    expect(result.created).toBe(0)
    expect(prisma.newsSource.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ lastStatus: 'error' }) }),
    )
  })

  it('refuses a feed URL that is not http', async () => {
    // A file: URL in the source list would point the ingester at the disk.
    const { service, prisma } = build()
    prisma.newsSource.findUnique.mockResolvedValue({
      id: 's1', name: 'Local', feedUrl: 'file:///etc/passwd', tier: 'verified', category: 'rescue',
    })
    const result = await service.ingestSource('s1')
    expect(result.error).toContain('http')
  })
})
