# ZoikoSocial — News Pipeline

**Version:** 1.0 · **Status:** Implemented · **Owner:** Platform Engineering
**Companion:** [feed-posts-architecture.md](./feed-posts-architecture.md) — §4.3 covers placement and pagination

How third-party journalism reaches the feed: what is ingested, what is stored,
what is deliberately not stored, and how it is kept honest over time.

Feed placement — how cards are interleaved with posts, and how the two streams
paginate — is covered in [feed-posts-architecture.md §4.3](./feed-posts-architecture.md).

---

## 1. What this is, and what it is not

The platform mixes member-written articles with articles ingested from external
publishers. Both live in `news_articles`; `is_external` separates them.

**An ingested article stores the headline, the excerpt, the link and a mirrored
cover image — never the body.** The licence for a public RSS feed covers a
summary and a link, not the text, so there is no in-app reader for external
pieces: the card opens the publisher's own page. A member's article, by
contrast, has a body and is read in-app. `NewsFeedCard` decides between the two
on `isExternal && sourceUrl`.

This is why the article detail page shows a "Read the full article at …" link
where the body would otherwise be — for an ingested piece there is nothing to
render, and an empty column reads as a bug.

---

## 2. Sources

`news_sources` — one row per feed. Curated by an admin in the panel
(`/admin?s=news`); there is no self-service submission.

| Column | Purpose |
|---|---|
| `feed_url` | RSS or Atom. Unique. |
| `tier` | `institutional` · `verified` · `community` — drives the badge on the card |
| `category` | `policy` · `science` · `rescue` · `health` · `climate` · `community` |
| `enabled` | The panic switch. Stops future ingestion; already-published items stay. |
| `last_fetched_at` | Doubles as the staleness gate for the scheduler |
| `last_status` / `last_error` | Surfaced in the panel so a silently broken feed is visible |

**Curating the source *is* the review.** Ingested articles are written with
`review_status: 'approved'` — a source that cannot be trusted to publish straight
into the feed should not be in the list. Member-submitted articles default to
`pending` and wait for a moderator, which is why migration `076` adds the column
with a default of `approved` and *then* alters the default to `pending`: existing
rows are grandfathered in one statement without a backfill `UPDATE`.

---

## 3. Ingestion

`NewsIngestService.ingestAll()` walks every enabled source **sequentially**. Not
parallel: this is a background catch-up, not a latency-sensitive path, and
hitting twenty publishers at once from one IP is how an ingester gets blocked.

Per source:

1. Fetch and parse the feed (`fast-xml-parser`, RSS and Atom shapes reconciled).
2. For each item, derive a canonical URL and skip anything already stored — the
   unique index on `canonical_url` is the real guard, so a concurrent run loses
   the race harmlessly rather than duplicating.
3. Insert the article.
4. **Then** acquire a cover (§4). After the insert deliberately, so a slow or
   hostile image host delays nothing and the article exists either way.

Feed summaries arrive as HTML and are rendered as plain strings, so tags are
stripped and the handful of entities feeds actually use are decoded at ingest —
storing unescaped markup is how it later ends up somewhere that does render it.

### Retiring dead links

`retireDeadLinks()` runs after each ingest, checking 40 articles per run ordered
by `updated_at` ascending so successive runs walk the whole catalogue. An article
whose source URL returns **404 or 410** is withdrawn and its mirrored cover
deleted.

Only those two statuses. A `405` means the host refuses `HEAD`, not that the
article is missing, and treating every non-200 as death would empty the feed the
first time a publisher had a bad afternoon.

---

## 4. Covers

### Why they are copied rather than hotlinked

The app's CSP allows images only from our own hosts, and `next/image` serves only
allow-listed remotes. Publishers are arbitrary hosts, so displaying their images
directly would mean opening both to the whole web — which drops a real XSS
mitigation and turns the image optimiser into an open proxy. Copying costs one
fetch per article ever, serves from our own CDN, and survives the publisher
moving or deleting the file.

The catch is that this fetches a URL chosen by a third party, so the address
checks are not optional.

### Fetching safely

`NewsCoverService.mirror()` refuses loopback, private ranges, link-local, IPv6
unique-local and — the one that actually matters on a cloud host — the metadata
address. Redirects are followed, so **the final host is re-checked**: a publisher
URL that 302s to the metadata address would otherwise walk straight past the
first check.

The declared `content-type` decides the extension, never the URL — trusting the
URL would let a publisher serve HTML as `cover.jpg`. Size is capped at 3 MB and
re-checked after download, because `content-length` is a claim.

### Choosing which image

Publishers disagree on where the image goes, and several offer more than one at
different sizes — commonly a list thumbnail alongside a full-size asset. The
ingester takes the **widest declared** candidate across `media:content`,
`media:thumbnail`, `enclosure` and `itunes:image`, handling the case where a tag
repeats as an array.

Taking the *first* match instead was a real bug: Phys.org publishes
`<media:thumbnail width="90" height="90">`, so the feed mirrored 90×90 images and
stretched them across a 900px column.

**Fallback: the article page's `og:image`.** A feed that only publishes a
thumbnail cannot supply a usable cover at all. The social image is the picture
the publisher chose for a link preview — wide, and meant to be seen at that size.
For the article that prompted this work, `og:image` is 1280×960 against the 90×90
the feed advertised. Only the first 200 KB of the page is read; the meta tags
live in the first few kilobytes.

### The size floor

**`MIN_COVER_WIDTH = 600`**, measured from the file's own bytes by
`readImageDimensions()` (`image-size.ts` — a small header parser for JPEG, PNG,
WebP and GIF, deliberately not a dependency).

A feed's declared width is a claim: publishers omit it, round it, or describe a
different asset. An image that cannot be measured is **allowed through** — null
means "a format we do not parse", and discarding those would lose good covers to
protect against nothing.

A refused cover leaves the article with no picture. The card has a no-cover state
that looks deliberate, which is better than a smeared one that looks broken.

### Repairing what is already stored

`repairWeakCovers()` runs after each ingest, 12 articles per run. The stored row
knows the URL and not the dimensions, so each candidate is downloaded and
measured; anything under the floor is re-acquired from the article's `og:image`,
and cleared if nothing better exists.

The old file is removed **before** re-acquiring — a replacement arriving under a
different extension (`.png` over a stored `.jpg`) would upsert alongside the
original and orphan it.

As with dead links, `updated_at` doubles as "last examined", so every path writes
to the row including the ones that change nothing. Without that the ordering
would hand back the same rows every run.

---

## 5. Scheduling

`NewsScheduleService` runs the ingest **every 3 hours** on a plain timer.

Not `@nestjs/schedule`: this is one job on one interval and not worth a
dependency. Timers are `unref()`'d so they never hold shutdown or a test run
open.

Safe to run on more than one instance, and under a restart loop:

- A source refreshed within the window is skipped, so a second instance starting
  up finds nothing due and does no work.
- An in-flight run causes the next tick to be dropped rather than overlapping a
  slow publisher.
- A failure is logged and the next cycle still runs — the feed keeps serving what
  it already has.
- First run is delayed 60s, so a crash-looping container cannot hammer
  publishers.
- `NEWS_INGEST_DISABLED=true` opts out entirely, for local work.

Admins can also run it on demand from the panel (`POST /news/ingest`, or
`POST /news/sources/:id/ingest` for one source), which is unconditional — it
ignores the staleness gate.

The run result reports `{ sources, created, removed, repaired }`, and the panel
shows all four, because a run that creates nothing is not the same as a run that
did nothing.

---

## 6. Reading and reacting

Ingested articles behave like posts in the feed: like, comment, save and share,
with optimistic like/save that reverts on failure. Sharing an external article
shares the **publisher's** link, not ours — sharing our URL would send people to
a page that only links onward.

The attribution row does the work of keeping this honest: the source's name, its
logo and a tier badge say plainly where the item came from, and an "Opens …"
hint is shown before the tap rather than after it.

Only `institutional` and `verified` sources earn a badge. Marking `community`
too would make the badge meaningless — it exists to distinguish.

---

## 7. Eligibility

An article reaches the feed only when all of these hold:

```
status = 'published'  AND  review_status = 'approved'
AND is_deleted = false  AND  hidden_at IS NULL
```

Enforced in `feedCards()` and, for direct PostgREST access, by the RLS policy in
migration `077`. The feed is the widest surface in the product and the last place
an unpublished or moderated-away article should appear.

Ordering is `featured DESC, published_at DESC, id DESC` — stable, so paging
cannot skip or repeat an item.
