-- An index the feed's own ordering can actually use.
--
-- `NewsService.feedCards` — the query behind every page of every member's home
-- feed — asks for:
--
--   WHERE  status = 'published' AND is_deleted = false
--          AND hidden_at IS NULL AND review_status = 'approved'
--   ORDER BY featured DESC, published_at DESC, id DESC
--
-- `news_articles_feed_idx` covers that WHERE clause, but it is ordered
-- (review_status, status, published_at DESC). The ORDER BY leads with
-- `featured`, which the index does not contain, so Postgres cannot use it to
-- satisfy the sort: it reads the whole table and sorts. EXPLAIN ANALYZE
-- confirms a sequential scan over every published article.
--
-- At 424 articles that costs ~40ms, which the round-trip hides. The problem is
-- the shape rather than the number: the ingest adds articles every three hours
-- and only dead links are retired, so this table grows steadily while the scan
-- cost grows with it. A few thousand articles turns a feed page into a sort of
-- the entire catalogue.
--
-- The contrast is already in the schema: `browse()` orders by
-- (published_at, id) and is served by `news_articles_published_idx` in ~5ms
-- against the same rows.
--
-- Additive only. Adding an index cannot change what any query returns — it
-- gives the planner a cheaper way to return the same rows, in the same order.
--
-- Partial, matching the WHERE clause exactly, so it stays small and is only
-- consulted for rows the feed can actually show: an unpublished, deleted or
-- moderated-away article is not in it at all.

CREATE INDEX IF NOT EXISTS news_articles_feed_cards_idx
  ON public.news_articles (featured DESC, published_at DESC, id DESC)
  WHERE is_deleted = false
    AND hidden_at IS NULL
    AND status = 'published'
    AND review_status = 'approved';
