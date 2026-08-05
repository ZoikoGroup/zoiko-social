-- ── Indexes for the two hottest list queries ─────────────────────────────────
-- Both of these existed as single-column indexes that the planner cannot
-- actually use for the query that runs.
--
-- 1. Explore feed filters `visibility = 'public' AND created_at >= <window>`
--    and orders by created_at DESC. An index on visibility alone is a
--    low-cardinality column — three or four distinct values across the table —
--    so it is never selective enough to be chosen, and the query falls back to
--    scanning by created_at and filtering. The composite serves the filter and
--    the sort together.
--
-- 2. The notification list is `WHERE user_id = ? ORDER BY created_at DESC`.
--    (user_id) alone means fetching every notification a member has ever had
--    and sorting them; (user_id, is_read) doesn't help the sort either.
--
-- Both are CONCURRENTLY-safe candidates but written plainly here to match the
-- rest of this migration set; the tables are small enough that the brief lock
-- is not a concern at current volume.
--
-- Idempotent.

CREATE INDEX IF NOT EXISTS posts_visibility_created_idx
  ON public.posts (visibility, created_at DESC);

CREATE INDEX IF NOT EXISTS notifications_user_created_idx
  ON public.notifications (user_id, created_at DESC);

-- Superseded by the composite above: any query that could use (visibility) can
-- use the leading column of (visibility, created_at).
DROP INDEX IF EXISTS posts_visibility_idx;
