-- ── Events — Visibility (public vs followers-only) ──────────────────────────
-- public: discoverable by everyone. followers: visible only to the host's
-- active followers (and the host). Idempotent.

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'public';

CREATE INDEX IF NOT EXISTS events_visibility_idx ON public.events (visibility, starts_at);
