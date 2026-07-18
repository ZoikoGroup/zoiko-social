-- ── Post Analytics — Extensible Event Props ─────────────────────────────────
-- Adds a free-form JSONB `props` bag so any new event (video_watch, link_click,
-- reaction, …) can carry arbitrary metadata (video %, dwell buckets, referrer,
-- button id) without a schema migration. Event `type`/`surface` are already
-- plain text, so new event kinds need no DB change either. Idempotent.

ALTER TABLE public.post_events ADD COLUMN IF NOT EXISTS props jsonb;

-- GIN index enables efficient filtering/grouping by any prop key or value,
-- e.g. WHERE props @> '{"cta":"follow"}' or GROUP BY props->>'variant'.
CREATE INDEX IF NOT EXISTS post_events_props_idx ON public.post_events USING gin (props);
