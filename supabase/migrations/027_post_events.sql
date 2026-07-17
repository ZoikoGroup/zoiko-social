-- ── Post Analytics — Event Stream (Phase 1) ─────────────────────────────────
-- Append-only impression/interaction events for posts authored by PROFESSIONAL
-- accounts. Powers per-post reach/views + the follower vs non-follower split.
-- Aggregates are computed from this table (and mirrored into Redis counters when
-- Redis is available). Private analytics data: RLS on, no public policy — access
-- is service-role only (the API). Idempotent.

CREATE TABLE IF NOT EXISTS public.post_events (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id            uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  -- denormalized author so account-level rollups never need to join posts
  author_id          uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- nullable so an event survives the viewer deleting their account
  viewer_id          uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  type               text NOT NULL,                       -- impression | view | profile_tap | link_tap
  surface            text,                                -- feed | explore | hashtag | profile | dm_share | detail
  viewer_is_follower boolean NOT NULL DEFAULT false,      -- captured at emit time → reach split
  device_type        text,                                -- mobile | tablet | desktop | bot | unknown
  os                 text,
  country            text,                                -- ISO-3166 alpha-2 (from CDN geo header)
  dwell_ms           integer,                             -- time-on-post for views
  created_at         timestamptz NOT NULL DEFAULT now()
);

-- per-post insights (reach, views, breakdowns), newest first
CREATE INDEX IF NOT EXISTS post_events_post_idx    ON public.post_events (post_id, created_at DESC);
-- account-level rollups over a time window
CREATE INDEX IF NOT EXISTS post_events_author_idx  ON public.post_events (author_id, created_at DESC);
-- fast count-by-type per post
CREATE INDEX IF NOT EXISTS post_events_type_idx    ON public.post_events (post_id, type);
-- unique-reach (COUNT DISTINCT viewer) per post
CREATE INDEX IF NOT EXISTS post_events_viewer_idx  ON public.post_events (post_id, viewer_id);
-- retention / future daily-partition pruning
CREATE INDEX IF NOT EXISTS post_events_created_idx ON public.post_events (created_at);

ALTER TABLE public.post_events ENABLE ROW LEVEL SECURITY;
-- No SELECT/INSERT policy on purpose: analytics rows are private. The API
-- connects with the service role (bypasses RLS); anon/authenticated get nothing.
