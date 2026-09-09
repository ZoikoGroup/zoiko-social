-- ── Hybrid news: curated external sources alongside community submissions ────
-- news_articles was built for one case — a member writes an article, and its
-- trust tier is derived from their verification. Adding ingested articles from
-- outside breaks three of its assumptions, and adding them to the home feed
-- breaks a fourth.
--
--   1. author_id is NOT NULL. An article from a wildlife charity's RSS feed has
--      no author profile. Rather than minting fake accounts for outlets — which
--      would be followable, messageable and would pollute search — external
--      articles point at a news_source and leave author_id NULL.
--
--   2. body is NOT NULL. Almost every RSS and news-API licence grants headline,
--      snippet and link — NOT the right to store or republish the full text. So
--      an external article has an excerpt and a link out, and no body at all.
--
--   3. Nothing deduplicates. The same story arrives from several feeds; without
--      a canonical URL the feed shows it four times.
--
--   4. Anyone signed in can publish, and news now appears in every member's home
--      feed. review_status gates what reaches that feed.
-- ─────────────────────────────────────────────────────────────────────────────

-- Curated publishers. Each source IS the relevance filter: twenty trusted feeds
-- beat keyword-matching a general news firehose for a niche this specific.
CREATE TABLE IF NOT EXISTS public.news_sources (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  slug            text NOT NULL UNIQUE,
  homepage_url    text,
  feed_url        text NOT NULL UNIQUE,
  logo_url        text,
  -- Trust travels from the source to everything it publishes, so this is set by
  -- whoever curates the list rather than derived per article.
  tier            text NOT NULL DEFAULT 'verified',
  -- Default category for this feed's items, since RSS categories are a mess.
  category        text NOT NULL DEFAULT 'community',
  enabled         boolean NOT NULL DEFAULT true,
  -- Operational state, so a silently failing feed is visible rather than just
  -- absent from the feed.
  last_fetched_at timestamptz,
  last_status     text,
  last_error      text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT news_sources_tier_check CHECK (tier IN ('institutional', 'verified', 'community'))
);

CREATE INDEX IF NOT EXISTS news_sources_enabled_idx ON public.news_sources (enabled, last_fetched_at NULLS FIRST);

-- An external article has no author.
ALTER TABLE public.news_articles ALTER COLUMN author_id DROP NOT NULL;

-- An external article has no body — only an excerpt and a link out.
ALTER TABLE public.news_articles ALTER COLUMN body DROP NOT NULL;

ALTER TABLE public.news_articles
  ADD COLUMN IF NOT EXISTS source_id     uuid REFERENCES public.news_sources(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS canonical_url text,
  ADD COLUMN IF NOT EXISTS is_external   boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reviewed_by   uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reviewed_at   timestamptz;

-- The dedupe key. Partial, because only ingested articles have one and a plain
-- UNIQUE would collapse every hand-written article into a single NULL slot on
-- some engines.
CREATE UNIQUE INDEX IF NOT EXISTS news_articles_canonical_url_key
  ON public.news_articles (canonical_url)
  WHERE canonical_url IS NOT NULL;

CREATE INDEX IF NOT EXISTS news_articles_source_idx
  ON public.news_articles (source_id, published_at DESC)
  WHERE source_id IS NOT NULL;

-- Review gate. Added with DEFAULT 'approved' so the articles that already exist
-- stay visible, then the default is changed so everything submitted from now on
-- starts pending. Doing it in this order is what keeps the backfill honest
-- without a separate UPDATE over the table.
ALTER TABLE public.news_articles
  ADD COLUMN IF NOT EXISTS review_status text NOT NULL DEFAULT 'approved';
ALTER TABLE public.news_articles
  ALTER COLUMN review_status SET DEFAULT 'pending';

ALTER TABLE public.news_articles
  DROP CONSTRAINT IF EXISTS news_articles_review_status_check;
ALTER TABLE public.news_articles
  ADD CONSTRAINT news_articles_review_status_check
  CHECK (review_status IN ('pending', 'approved', 'rejected'));

-- The feed asks one question — "what may I show" — so it gets one index.
CREATE INDEX IF NOT EXISTS news_articles_feed_idx
  ON public.news_articles (review_status, status, published_at DESC)
  WHERE is_deleted = false AND hidden_at IS NULL;

-- The moderator queue asks the opposite question, and should stay fast while
-- the approved pile grows without bound.
CREATE INDEX IF NOT EXISTS news_articles_pending_idx
  ON public.news_articles (created_at DESC)
  WHERE review_status = 'pending';
