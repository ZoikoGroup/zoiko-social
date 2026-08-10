-- ── Events — Share-link access ───────────────────────────────────────────────
-- Every event gets an opaque `share_token`. Anyone holding the link can join:
--   * POST /events/:id/join { token } validates the token and (when the host
--     allows it) adds the joiner to event_invites.
--   * share_link_extends_invites = true  → joiners become formal invitees the
--     host can see/revoke.
--   * share_link_extends_invites = false → the link grants view + RSVP access
--     without creating an invite row (host's invite list stays clean).
-- The API layer enforces the real gate (get/rsvp accept ?share=token);
-- RLS on events stays as-is (API-enforced pattern).
-- Idempotent.

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS share_token text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS share_link_extends_invites boolean NOT NULL DEFAULT false;

-- Backfill existing events so every event is immediately shareable.
UPDATE public.events SET share_token = gen_random_uuid()::text WHERE share_token IS NULL;

-- One link per event; multiple NULLs allowed (token always present in practice).
CREATE UNIQUE INDEX IF NOT EXISTS events_share_token_idx ON public.events (share_token) WHERE share_token IS NOT NULL;
